import { z } from 'zod';
import { UserRole } from '../../constants/roles';

export const updateProfileSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(50).optional(),
    email: z.string().email().optional(),
    profilePhoto: z.string().optional(),
  })
});

export const updateUserSchema = updateProfileSchema;

export const updatePlanSchema = z.object({
  body: z.object({
    plan: z.enum(['starter', 'professional', 'enterprise', 'pro', 'team'])
  })
});

export const changePasswordSchema = z.object({
  body: z.object({
    oldPassword: z.string().min(6),
    newPassword: z.string().min(6),
  })
});

export const updateUserRoleSchema = z.object({
  body: z.object({
    role: z.nativeEnum(UserRole)
  }),
  params: z.object({
    id: z.string().min(1, 'Invalid User ID format')
  })
});

export const updateRoleSchema = updateUserRoleSchema;
