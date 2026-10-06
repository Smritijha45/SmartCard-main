import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(50),
    email: z.string().email(),
    password: z.string().min(6).max(100),
    profilePhoto: z.string().optional(),
  })
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string(),
  })
});

export const refreshTokenSchema = z.object({
  cookies: z.object({
    refreshToken: z.string({
      required_error: 'Refresh token is required in cookie'
    })
  }).passthrough() // Cookies are checked from req.cookies
});

export const requestOtpSchema = z.object({
  body: z.object({
    email: z.string().email()
  })
});

export const verifyOtpSchema = z.object({
  body: z.object({
    email: z.string().email(),
    code: z.string().length(6, 'OTP must be exactly 6 characters')
  })
});
