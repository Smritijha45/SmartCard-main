import { z } from 'zod';
import { UserRole } from '../../constants/roles';

export const createCompanySchema = z.object({
  body: z.object({
    name: z.string().min(2).max(100),
    domain: z.string().min(3).max(100).optional(),
  })
});

export const addMemberSchema = z.object({
  body: z.object({
    email: z.string().email(),
    role: z.nativeEnum(UserRole).default(UserRole.EMPLOYEE)
  })
});
