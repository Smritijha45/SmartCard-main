import { z } from 'zod';
import { UserRole } from '../../constants/roles';

export const updateUserSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(50).optional(),
    email: z.string().email().optional(),
  })
});

export const changePasswordSchema = z.object({
  body: z.object({
    oldPassword: z.string().min(6),
    newPassword: z.string().min(6),
  })
});

export const updateRoleSchema = z.object({
  body: z.object({
    role: z.nativeEnum(UserRole)
  }),
  params: z.object({
    id: z.string().length(24, 'Invalid User ID format')
  })
});
