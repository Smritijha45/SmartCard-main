const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;
const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/smartcard';
const mongoDbName = process.env.MONGODB_DB || 'smartcard';
const jwtSecret = process.env.JWT_SECRET || 'dev-secret';

app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());
app.use(express.json());

let client;
let db;

async function connectToDatabase() {
  if (db) return db;
  client = new MongoClient(mongoUri);
  await client.connect();
  db = client.db(mongoDbName);
  return db;
}

function createId() {
  return new ObjectId().toString();
}

function signToken(payload) {
  return jwt.sign(payload, jwtSecret, { expiresIn: '7d' });
}

function getTokenFromRequest(req) {
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.slice(7);
  }
  return req.cookies?.auth_token || null;
}

function getAuthenticatedUser(req) {
  const token = getTokenFromRequest(req);
  if (!token) return null;

  try {
    return jwt.verify(token, jwtSecret);
  } catch {
    return null;
  }
}

function authMiddleware(req, res, next) {
  const user = getAuthenticatedUser(req);
  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  req.user = user;
  next();
}

function mapCard(card) {
  if (!card) return null;
  return {
    ...card,
    _id: card._id,
    id: card._id,
    profileImage: card.profileImage || card.profile_image || '',
  };
}

function buildUserPayload(user) {
  return {
    id: user._id,
    email: user.email,
    name: user.name,
    createdAt: user.createdAt,
    user_metadata: {
      name: user.name,
      full_name: user.name,
    },
  };
}

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.post('/api/auth/signup', async (req, res) => {
  try {
    const { email, password, name } = req.body || {};
    if (!email || !password || !name) {
      return res.status(400).json({ message: 'Email, password, and name are required' });
    }

    const database = await connectToDatabase();
    const users = database.collection('users');
    const existing = await users.findOne({ email: email.toLowerCase() });

    if (existing) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const id = createId();
    const createdAt = new Date().toISOString();
    const userDoc = {
      _id: id,
      id,
      email: email.toLowerCase(),
      password: hashedPassword,
      name,
      createdAt,
    };

    await users.insertOne(userDoc);
    const token = signToken({ sub: id, email: userDoc.email });

    res.cookie('auth_token', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    res.status(201).json({
      message: 'User created',
      token,
      user: buildUserPayload(userDoc),
    });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Signup failed' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const database = await connectToDatabase();
    const users = database.collection('users');
    const user = await users.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = signToken({ sub: user._id, email: user.email });
    res.cookie('auth_token', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    res.json({
      message: 'Logged in',
      token,
      user: buildUserPayload(user),
    });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Login failed' });
  }
});

app.get('/api/auth/me', async (req, res) => {
  try {
    const user = getAuthenticatedUser(req);
    if (!user) {
      return res.status(200).json({
        id: 'mock_id',
        name: 'Guest User',
        email: 'guest@example.com',
        user_metadata: {},
      });
    }

    const database = await connectToDatabase();
    const userDoc = await database.collection('users').findOne({ _id: user.sub });
    if (!userDoc) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(buildUserPayload(userDoc));
  } catch (error) {
    res.status(500).json({ message: error.message || 'Unable to load profile' });
  }
});

app.post('/api/auth/logout', (_req, res) => {
  res.clearCookie('auth_token');
  res.json({ success: true });
});

app.get('/api/cards', authMiddleware, async (req, res) => {
  try {
    const database = await connectToDatabase();
    const cards = await database.collection('cards').find({ userId: req.user.sub }).sort({ createdAt: -1 }).toArray();
    res.json(cards.map(mapCard));
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to load cards' });
  }
});

app.post('/api/cards', authMiddleware, async (req, res) => {
  try {
    const database = await connectToDatabase();
    const payload = { ...req.body, userId: req.user.sub, createdAt: new Date().toISOString() };
    const id = createId();
    const card = { _id: id, id, ...payload };
    await database.collection('cards').insertOne(card);
    res.status(201).json(mapCard(card));
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to save card' });
  }
});

app.get('/api/cards/:id', authMiddleware, async (req, res) => {
  try {
    const database = await connectToDatabase();
    const card = await database.collection('cards').findOne({ _id: req.params.id });
    if (!card) {
      return res.status(404).json({ message: 'Card not found' });
    }
    res.json(mapCard(card));
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to load card' });
  }
});

app.put('/api/cards/:id', authMiddleware, async (req, res) => {
  try {
    const database = await connectToDatabase();
    const { _id, ...rest } = req.body || {};
    const updated = await database.collection('cards').findOneAndUpdate(
      { _id: req.params.id, userId: req.user.sub },
      { $set: { ...rest, updatedAt: new Date().toISOString() } },
      { returnDocument: 'after' }
    );

    if (!updated.value) {
      return res.status(404).json({ message: 'Card not found' });
    }

    res.json(mapCard(updated.value));
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to update card' });
  }
});

app.delete('/api/cards/:id', authMiddleware, async (req, res) => {
  try {
    const database = await connectToDatabase();
    const result = await database.collection('cards').deleteOne({ _id: req.params.id, userId: req.user.sub });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Card not found' });
    }
    res.json({ message: 'Card deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to delete card' });
  }
});

app.get('/api/leads', authMiddleware, async (req, res) => {
  try {
    const database = await connectToDatabase();
    const cards = await database.collection('cards').find({ userId: req.user.sub }).project({ _id: 1, name: 1, template: 1 }).toArray();
    const cardIds = cards.map((card) => card._id);

    const leads = await database.collection('leads').find({ cardId: { $in: cardIds } }).sort({ createdAt: -1 }).toArray();
    const formattedLeads = leads.map((lead) => ({
      ...lead,
      _id: lead._id,
      cardId: cards.find((card) => card._id === lead.cardId)
        ? { _id: cards.find((card) => card._id === lead.cardId)._id, name: cards.find((card) => card._id === lead.cardId).name, template: cards.find((card) => card._id === lead.cardId).template }
        : lead.cardId,
    }));

    res.json(formattedLeads);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to load leads' });
  }
});

app.post('/api/leads', async (req, res) => {
  try {
    const database = await connectToDatabase();
    const payload = { ...req.body, createdAt: new Date().toISOString() };
    const id = createId();
    const lead = { _id: id, id, ...payload };
    await database.collection('leads').insertOne(lead);

    const card = await database.collection('cards').findOne({ _id: lead.cardId });
    if (card?.userId) {
      await database.collection('notifications').insertOne({
        _id: createId(),
        userId: card.userId,
        type: 'lead',
        unread: true,
        title: 'New Lead Captured',
        description: `${lead.name || 'Someone'} left their contact info on your card "${card.name || 'Untitled'}".`,
        createdAt: new Date().toISOString(),
      });
    }

    res.status(201).json({ ...lead, _id: lead._id });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to save lead' });
  }
});

app.get('/api/notifications', authMiddleware, async (req, res) => {
  try {
    const database = await connectToDatabase();
    const notifications = await database.collection('notifications').find({ userId: req.user.sub }).sort({ createdAt: -1 }).limit(50).toArray();
    res.json({ notifications });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to load notifications' });
  }
});

app.patch('/api/notifications', authMiddleware, async (req, res) => {
  try {
    const { action } = req.body || {};
    const database = await connectToDatabase();

    if (action === 'mark_all_read') {
      await database.collection('notifications').updateMany({ userId: req.user.sub, unread: true }, { $set: { unread: false } });
      return res.json({ success: true });
    }

    res.status(400).json({ message: 'Invalid action' });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to update notifications' });
  }
});

app.get('/api/analytics/dashboard', authMiddleware, async (req, res) => {
  try {
    const database = await connectToDatabase();
    const userCards = await database.collection('cards').find({ userId: req.user.sub }).toArray();
    const cardIds = userCards.map((card) => card._id);

    if (cardIds.length === 0) {
      return res.json({ totalViews: 0, totalShares: 0, totalLeads: 0, chartData: [], topCards: userCards.map(mapCard), recentLeads: [] });
    }

    const analytics = await database.collection('analytics').find({ cardId: { $in: cardIds } }).sort({ date: 1 }).toArray();
    const leads = await database.collection('leads').find({ cardId: { $in: cardIds } }).sort({ createdAt: -1 }).toArray();

    let totalViews = 0;
    let totalShares = 0;
    const chartDataMap = {};

    analytics.forEach((entry) => {
      totalViews += entry.views || 0;
      totalShares += entry.shares || 0;
      const day = new Date(entry.date).toLocaleDateString('en-US', { weekday: 'short' });
      if (!chartDataMap[day]) chartDataMap[day] = { views: 0, shares: 0, leads: 0 };
      chartDataMap[day].views += entry.views || 0;
      chartDataMap[day].shares += entry.shares || 0;
    });

    leads.forEach((lead) => {
      const day = new Date(lead.createdAt).toLocaleDateString('en-US', { weekday: 'short' });
      if (!chartDataMap[day]) chartDataMap[day] = { views: 0, shares: 0, leads: 0 };
      chartDataMap[day].leads += 1;
    });

    const daysOrder = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const chartData = Object.keys(chartDataMap).sort((a, b) => daysOrder.indexOf(a) - daysOrder.indexOf(b)).map((key) => ({
      name: key,
      views: chartDataMap[key].views,
      shares: chartDataMap[key].shares,
      leads: chartDataMap[key].leads,
    }));

    const recentLeads = leads.slice(0, 3).map((lead) => ({ name: lead.name, email: lead.email, createdAt: lead.createdAt }));
    const topCards = userCards.slice(0, 5).map(mapCard);

    res.json({ totalViews, totalShares, totalLeads: leads.length, chartData, topCards, recentLeads });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to load analytics' });
  }
});

app.post('/api/analytics/track', async (req, res) => {
  try {
    const { cardId, type, isNewUniqueView } = req.body || {};
    if (!cardId || !type) {
      return res.status(400).json({ message: 'cardId and type are required' });
    }

    const database = await connectToDatabase();
    const today = new Date().toISOString().slice(0, 10);
    const analyticsCollection = database.collection('analytics');
    const cardsCollection = database.collection('cards');
    const notificationsCollection = database.collection('notifications');

    const existing = await analyticsCollection.findOne({ cardId, date: today });
    if (existing) {
      await analyticsCollection.updateOne({ _id: existing._id }, { $set: { views: type === 'view' ? (existing.views || 0) + 1 : existing.views || 0, shares: type === 'share' ? (existing.shares || 0) + 1 : existing.shares || 0 } });
    } else {
      await analyticsCollection.insertOne({ _id: createId(), cardId, date: today, views: type === 'view' ? 1 : 0, shares: type === 'share' ? 1 : 0 });
    }

    const card = await cardsCollection.findOne({ _id: cardId });
    let updatedViews = card?.totalViews || 0;
    let updatedUnique = card?.uniqueViews || 0;

    if (type === 'view' && card) {
      updatedViews += 1;
      if (isNewUniqueView) updatedUnique += 1;
      await cardsCollection.updateOne({ _id: cardId }, { $set: { totalViews: updatedViews, uniqueViews: updatedUnique } });

      const recentNotification = await notificationsCollection.findOne({ userId: card.userId, type: 'view', unread: true, description: { $regex: card.name || 'Untitled' } });
      if (!recentNotification) {
        await notificationsCollection.insertOne({
          _id: createId(),
          userId: card.userId,
          type: 'view',
          unread: true,
          title: 'Card Viewed',
          description: `Your card "${card.name || 'Untitled'}" received a new view.`,
          createdAt: new Date().toISOString(),
        });
      }
    }

    if (type === 'share' && card) {
      await notificationsCollection.insertOne({
        _id: createId(),
        userId: card.userId,
        type: 'share',
        unread: true,
        title: 'Card Shared',
        description: `Someone just shared your card "${card.name || 'Untitled'}"!`,
        createdAt: new Date().toISOString(),
      });
    }

    res.json({ success: true, totalViews: updatedViews, uniqueViews: updatedUnique });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to track analytics' });
  }
});

app.get('/api/search', authMiddleware, async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || typeof q !== 'string' || q.trim() === '') {
      return res.json({ cards: [], leads: [] });
    }

    const database = await connectToDatabase();
    const cards = await database.collection('cards').find({ userId: req.user.sub, $or: [{ name: { $regex: q, $options: 'i' } }, { company: { $regex: q, $options: 'i' } }, { role: { $regex: q, $options: 'i' } }] }).limit(5).toArray();
    const allUserCards = await database.collection('cards').find({ userId: req.user.sub }).project({ _id: 1 }).toArray();
    const cardIds = allUserCards.map((card) => card._id);

    let leads = [];
    if (cardIds.length > 0) {
      leads = await database.collection('leads').find({ cardId: { $in: cardIds }, $or: [{ name: { $regex: q, $options: 'i' } }, { email: { $regex: q, $options: 'i' } }, { phone: { $regex: q, $options: 'i' } }] }).limit(5).toArray();
    }

    res.json({ cards: cards.map(mapCard), leads: leads.map((lead) => ({ ...lead, _id: lead._id })) });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Search failed' });
  }
});

app.get('/api/user/profile', authMiddleware, async (req, res) => {
  try {
    const database = await connectToDatabase();
    const userDoc = await database.collection('users').findOne({ _id: req.user.sub });
    if (!userDoc) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(buildUserPayload(userDoc));
  } catch (error) {
    res.status(500).json({ message: error.message || 'Unable to load profile' });
  }
});

app.listen(port, () => {
  console.log(`Express server listening on port ${port}`);
});
