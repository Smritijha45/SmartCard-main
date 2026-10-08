# SmartCard — Digital Business Card Platform

SmartCard is a full-stack digital business card and professional identity system built with Next.js, TypeScript, Tailwind CSS, Node.js + Express, and MongoDB.

---

## 🏗️ Architecture & Core Principles

```
                    ┌─────────────────────────┐
                    │   MongoDB Atlas / Local │
                    └────────────▲────────────┘
                                 │
                    ┌────────────┴────────────┐
                    │   Express.js Backend    │
                    │   (Render / Railway)    │
                    └────────────▲────────────┘
                                 │
                    ┌────────────┴────────────┐
                    │     Next.js Frontend    │
                    │         (Vercel)        │
                    └────────────▲────────────┘
                                 │
                 https://smartcard.vercel.app/smriti
                                 │
                    ┌────────────┴────────────┐
                    │                         │
                 💻 Laptop                 📱 Phone
                    │                         │
                    └────────────┬────────────┘
                                 │
                          Same LIVE Card
```

### The Live Card Principle
1. **URL-Only QR Code**: The QR code encodes solely the canonical public profile URL (e.g. `https://smartcard.vercel.app/smriti`).
2. **Dynamic Live Sync**: When a user updates their card title, bio, or links, MongoDB is updated.
3. **No Re-Printing**: Visiting or scanning the existing QR code immediately renders the latest live card from MongoDB.

---

## 🚀 Local Development Setup

### 1. Backend Setup (Node.js + Express + MongoDB)
```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Start development server on port 5000
npm run dev
```

### 2. Frontend Setup (Next.js App Router)
```bash
# Navigate to frontend (in a separate terminal)
cd frontend

# Install dependencies
npm install

# Start development server on port 3000
npm run dev
```

The application will be accessible at:
- **Frontend**: `http://localhost:3000`
- **Backend API**: `http://localhost:5000`
- **Live Demo Profile**: `http://localhost:3000/smriti`

---

## 🔑 Environment Variables

Create `.env.local` in `frontend/` and `.env` in `backend/`.

### Frontend (`frontend/.env.local`)
| Variable | Description | Example (Development) | Example (Production) |
| :--- | :--- | :--- | :--- |
| `NEXT_PUBLIC_APP_URL` | Canonical base URL used for public profiles and QR generation | `http://localhost:3000` | `https://smartcard.vercel.app` |
| `NEXT_PUBLIC_API_URL` | Express backend base URL for API communication | `http://localhost:5000` | `https://api.yourdomain.com` |

### Backend (`backend/.env`)
| Variable | Description | Example (Development) | Example (Production) |
| :--- | :--- | :--- | :--- |
| `PORT` | Port number for Express server | `5000` | `5000` |
| `NODE_ENV` | Runtime environment | `development` | `production` |
| `MONGODB_URI` | MongoDB connection string (Atlas or Local) | `mongodb://127.0.0.1:27017/smartcard` | `mongodb+srv://<user>:<password>@cluster.mongodb.net/smartcard` |
| `JWT_SECRET` | Secret key for signing JSON Web Tokens | `your-secure-jwt-secret-key-min-32-chars` | *(Set securely in host environment)* |
| `CLIENT_URL` | Allowed client origin for CORS restrictions | `http://localhost:3000` | `https://smartcard.vercel.app` |

> ⚠️ **Security Note**: Never commit actual database credentials or secret keys to version control.

---

## 🌐 Production Deployment Guide

### Deploying Frontend to Vercel
1. Connect your repository to [Vercel](https://vercel.com).
2. Set the **Root Directory** to `frontend`.
3. Configure the Environment Variables:
   - `NEXT_PUBLIC_APP_URL`: `https://your-app-name.vercel.app`
   - `NEXT_PUBLIC_API_URL`: `https://your-backend-domain.com`
4. Deploy.

### Deploying Backend to Render / Railway
1. Create a new Web Service on [Render](https://render.com) or [Railway](https://railway.app).
2. Set the **Root Directory** to `backend`.
3. Set **Build Command**: `npm install && npm run build`
4. Set **Start Command**: `npm start`
5. Configure Environment Variables (`MONGODB_URI`, `JWT_SECRET`, `CLIENT_URL`, `PORT=5000`).

---

## 🛡️ Security & Authorization
- **Password Hashing**: Salted bcrypt hashing for all stored credentials.
- **Session Tokens**: JWT stored in secure `HttpOnly` cookies and Authorization Bearer headers.
- **Card Ownership**: Users can only modify cards where `card.userId === authenticatedUser.id`.
- **Sanitized Public Responses**: Private credentials, hashed passwords, and internal tokens are never returned on public routes.
- **Privacy Mode**: Disabling `isPublic` on a profile returns a clean private state page without exposing contact details.
