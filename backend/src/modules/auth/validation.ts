import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(50),
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters').max(100),
    profilePhoto: z.string().optional(),
  })
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(1, 'Password is required'),
  })
});

export const refreshTokenSchema = z.object({
  cookies: z.object({
    refreshToken: z.string({
      required_error: 'Refresh token is required in cookie'
    })
  }).passthrough()
});

export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string().email('Please enter a valid email address')
  })
});

export const resetPasswordSchema = z.object({
  body: z.object({
    token: z.string().min(1, 'Reset token is required'),
    newPassword: z.string().min(6, 'Password must be at least 6 characters').max(100)
  })
});

export const verifyEmailSchema = z.object({
  body: z.object({
    token: z.string().optional(),
    email: z.string().email().optional(),
    code: z.string().optional()
  })
});

export const resendVerificationSchema = z.object({
  body: z.object({
    email: z.string().email('Please enter a valid email address')
  })
});

export const requestOtpSchema = z.object({
  body: z.object({
    email: z.string().email('Please enter a valid email address')
  })
});

export const verifyOtpSchema = z.object({
  body: z.object({
    email: z.string().email('Please enter a valid email address'),
    code: z.string().length(6, 'OTP must be exactly 6 characters')
  })
});
