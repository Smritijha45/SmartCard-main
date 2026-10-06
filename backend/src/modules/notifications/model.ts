import { Schema, model, Document } from 'mongoose';

export interface INotification {
  userId: Schema.Types.ObjectId;
  type: string;
  unread: boolean;
  title: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface INotificationDocument extends INotification, Document {}

const NotificationSchema = new Schema<INotificationDocument>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  type: { type: String, required: true },
  unread: { type: Boolean, default: true, index: true },
  title: { type: String, required: true },
  description: { type: String, required: true }
}, {
  timestamps: true
});

export const NotificationModel = model<INotificationDocument>('Notification', NotificationSchema);
export default NotificationModel;
