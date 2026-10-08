import { apiClient } from './client';

export interface UserDTO {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: string;
  createdAt?: string;
}

export interface AuthResponse {
  user: UserDTO;
  token?: string;
  accessToken?: string;
  message?: string;
}

export async function register(name: string, email: string, password: string):Promise<AuthResponse> {
  const result = await apiClient<AuthResponse>('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  });
  if (typeof window !== 'undefined' && (result.token || result.accessToken)) {
    localStorage.setItem('token', result.token || result.accessToken || '');
    localStorage.setItem('smartcard_authenticated', 'true');
    localStorage.setItem('smartcard_user', JSON.stringify(result.user));
  }
  return result;
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  const result = await apiClient<AuthResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  if (typeof window !== 'undefined' && (result.token || result.accessToken)) {
    localStorage.setItem('token', result.token || result.accessToken || '');
    localStorage.setItem('smartcard_authenticated', 'true');
    localStorage.setItem('smartcard_user', JSON.stringify(result.user));
  }
  return result;
}

export async function getCurrentUser(): Promise<UserDTO | null> {
  try {
    const user = await apiClient<UserDTO>('/api/auth/me');
    if (user && user.email) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('smartcard_user', JSON.stringify(user));
        localStorage.setItem('smartcard_authenticated', 'true');
      }
      return user;
    }
    return null;
  } catch {
    return null;
  }
}

export async function logout(): Promise<void> {
  try {
    await apiClient('/api/auth/logout', { method: 'POST' });
  } finally {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('smartcard_authenticated');
      localStorage.removeItem('smartcard_user');
    }
  }
}
