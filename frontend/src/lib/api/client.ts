/**
 * SmartCard Centralized API Client
 * Normalizes HTTP requests, credentials, and user-friendly error handling.
 */

export class ApiError extends Error {
  status: number;
  data?: any;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

export function getFriendlyErrorMessage(status: number, originalMessage?: string): string {
  if (originalMessage && originalMessage.trim() && !originalMessage.startsWith('<!DOCTYPE')) {
    return originalMessage;
  }
  switch (status) {
    case 400:
      return 'Invalid request details. Please check your input.';
    case 401:
      return 'Please log in to continue.';
    case 403:
      return 'You do not have permission to access this resource.';
    case 404:
      return 'SmartCard or resource not found.';
    case 409:
      return 'This username or email is already taken.';
    case 500:
    default:
      return 'Something went wrong. Please try again.';
  }
}

export async function apiClient<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token && !headers['Authorization'] && !headers['authorization']) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  const response = await fetch(endpoint, {
    ...options,
    headers,
    credentials: options.credentials || 'include',
  });

  if (!response.ok) {
    let errorMsg = '';
    let errorData = null;
    try {
      errorData = await response.json();
      errorMsg = errorData.message || errorData.error || '';
    } catch {
      // Non-JSON response
    }
    const friendlyMsg = getFriendlyErrorMessage(response.status, errorMsg);
    throw new ApiError(friendlyMsg, response.status, errorData);
  }

  try {
    const data = await response.json();
    return (data.data !== undefined ? data.data : data) as T;
  } catch {
    return {} as T;
  }
}
