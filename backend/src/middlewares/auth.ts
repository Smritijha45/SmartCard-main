import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config';
import { UnauthorizedError, ForbiddenError } from '../errors/AppError';
import { UserRole, hasRoleAccess } from '../constants/roles';

interface JWTPayload {
  id: string;
  email: string;
  role: UserRole;
  companyId?: string;
}

export const authenticate = (req: Request, _res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new UnauthorizedError('Missing or malformed authorization token'));
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, config.JWT_ACCESS_SECRET) as JWTPayload;
    req.user = {
      id: payload.id,
      email: payload.email,
      role: payload.role,
      companyId: payload.companyId
    };
    next();
  } catch (error) {
    next(error);
  }
};

export const requireRole = (requiredRole: UserRole) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new UnauthorizedError('User authentication required'));
    }

    const authorized = hasRoleAccess(req.user.role, requiredRole);
    if (!authorized) {
      return next(new ForbiddenError(`Insufficient privileges: Requires role ${requiredRole} or higher`));
    }

    next();
  };
};
