import { Server as SocketIOServer } from 'socket.io';
import { Server as HttpServer } from 'http';
import jwt from 'jsonwebtoken';
import config from '../config';
import logger from './logger';

let io: SocketIOServer | null = null;

export function initSocket(server: HttpServer): SocketIOServer {
  io = new SocketIOServer(server, {
    cors: {
      origin: '*', // Adjust origins as necessary for client domains
      credentials: true
    }
  });

  // Authentication Middleware for Handshake
  io.use((socket, next) => {
    try {
      const authHeader = socket.handshake.auth.token || socket.handshake.headers.authorization;
      const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader;

      if (!token) {
        return next(new Error('Authentication token required'));
      }

      const decoded = jwt.verify(token, config.JWT_ACCESS_SECRET) as any;
      socket.data = {
        userId: decoded.id,
        email: decoded.email,
        role: decoded.role,
        companyId: decoded.companyId
      };
      next();
    } catch (err) {
      logger.warn({ err }, 'WebSocket handshake authentication failed');
      next(new Error('Authentication failed'));
    }
  });

  io.on('connection', (socket) => {
    const { userId } = socket.data;
    logger.info({ userId, socketId: socket.id }, 'User connected to WebSocket server');

    // Join a user-specific room
    socket.join(userId);

    socket.on('disconnect', () => {
      logger.info({ userId, socketId: socket.id }, 'User disconnected from WebSocket server');
    });
  });

  return io;
}

export function getIO(): SocketIOServer {
  if (!io) {
    throw new Error('Socket.io is not initialized yet');
  }
  return io;
}

export function sendToUser(userId: string, event: string, payload: any): void {
  if (io) {
    io.to(userId).emit(event, payload);
    logger.debug({ userId, event, payload }, 'Dispatched real-time message to socket room');
  }
}
export default initSocket;
