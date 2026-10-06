import { UserRole } from '../constants/roles';

declare global {
  namespace Express {
    interface Request {
      cookies?: Record<string, string>;
      user?: {
        id: string;
        email: string;
        role: UserRole;
        companyId?: string;
      };
    }
  }
}
