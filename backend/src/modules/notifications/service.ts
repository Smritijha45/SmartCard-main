import NotificationModel, { INotificationDocument } from './model';
import { sendToUser } from '../../lib/socket';
import logger from '../../lib/logger';
import { Types } from 'mongoose';

export class NotificationService {
  async createNotification(data: {
    userId: string | Types.ObjectId;
    type: string;
    title: string;
    description: string;
  }): Promise<INotificationDocument> {
    const notification = await NotificationModel.create({
      userId: data.userId,
      type: data.type,
      title: data.title,
      description: data.description,
      unread: true
    });

    logger.info({ notificationId: notification.id, userId: data.userId }, 'Saved notification to database');

    // Emit via WebSocket room in real-time
    try {
      sendToUser(data.userId.toString(), 'new-notification', {
        id: notification.id,
        type: notification.type,
        title: notification.title,
        description: notification.description,
        unread: notification.unread,
        createdAt: notification.createdAt
      });
    } catch (err) {
      logger.error({ err }, 'Failed to broadcast notification over socket');
    }

    return notification;
  }

  async getNotifications(userId: string): Promise<INotificationDocument[]> {
    return NotificationModel.find({ userId }).sort({ createdAt: -1 }).limit(50);
  }

  async markAllAsRead(userId: string): Promise<void> {
    await NotificationModel.updateMany({ userId, unread: true }, { $set: { unread: false } });
  }
}

export default NotificationService;
