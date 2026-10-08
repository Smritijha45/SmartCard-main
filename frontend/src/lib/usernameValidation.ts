/**
 * Centralized App URL and Username Validation utilities for SmartCard
 */

export const RESERVED_USERNAMES = [
  'admin',
  'administrator',
  'dashboard',
  'login',
  'signup',
  'signin',
  'register',
  'api',
  'settings',
  'pricing',
  'features',
  'about',
  'notifications',
  'analytics',
  'profile',
  'contacts',
  'cards',
  'leads',
  'demo',
  'c',
  '_not-found',
  'help',
  'terms',
  'privacy',
  'auth',
  'app',
  'www',
  'root',
  'support',
  'status',
  'account',
  'billing',
  'docs',
  'static',
  'assets',
  'public',
  'favicon',
];

/**
 * Returns the configured base application URL using NEXT_PUBLIC_APP_URL,
 * window.location.origin (client-side), or https://smartcard.app (fallback).
 */
export function getAppUrl(): string {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/+$/, '');
  }
  if (typeof window !== 'undefined' && window.location.origin) {
    return window.location.origin.replace(/\/+$/, '');
  }
  return 'https://smartcard.app';
}

/**
 * Generates the full canonical public SmartCard URL for a given username
 */
export function getCardPublicUrl(username: string): string {
  const clean = (username || 'user').toLowerCase().trim().replace(/[^a-z0-9_-]/g, '-');
  return `${getAppUrl()}/${clean}`;
}

export interface UsernameValidationResult {
  isValid: boolean;
  error?: string;
  sanitized: string;
}

/**
 * Validates a SmartCard username slug against all platform rules and reserved words.
 */
export function validateUsername(rawUsername: string): UsernameValidationResult {
  if (!rawUsername || typeof rawUsername !== 'string') {
    return { isValid: false, error: 'Username is required', sanitized: '' };
  }

  const trimmed = rawUsername.trim().toLowerCase();

  if (trimmed.length === 0) {
    return { isValid: false, error: 'Username is required', sanitized: '' };
  }

  if (/\s/.test(rawUsername)) {
    return { isValid: false, error: 'Username cannot contain spaces', sanitized: trimmed.replace(/\s+/g, '-') };
  }

  if (trimmed.length < 3) {
    return { isValid: false, error: 'Username must be at least 3 characters', sanitized: trimmed };
  }

  if (trimmed.length > 30) {
    return { isValid: false, error: 'Username cannot exceed 30 characters', sanitized: trimmed.slice(0, 30) };
  }

  if (!/^[a-z0-9_-]+$/.test(trimmed)) {
    return { isValid: false, error: 'Username can only contain letters, numbers, hyphens, and underscores', sanitized: trimmed.replace(/[^a-z0-9_-]/g, '') };
  }

  if (/^[-_]|[-_]$/.test(trimmed)) {
    return { isValid: false, error: 'Username cannot start or end with a hyphen or underscore', sanitized: trimmed.replace(/^[-_]+|[-_]+$/g, '') };
  }

  if (RESERVED_USERNAMES.includes(trimmed)) {
    return { isValid: false, error: `"${trimmed}" is a reserved system keyword. Please choose another username.`, sanitized: trimmed };
  }

  return { isValid: true, sanitized: trimmed };
}
