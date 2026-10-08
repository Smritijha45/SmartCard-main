import { apiClient } from './client';

export interface CardDTO {
  _id?: string;
  id?: string;
  userId?: string;
  username: string;
  name: string;
  title?: string;
  role?: string;
  company?: string;
  bio?: string;
  profileImage?: string;
  email?: string;
  phone?: string;
  website?: string;
  location?: string;
  github?: string;
  linkedin?: string;
  instagram?: string;
  twitter?: string;
  cardTheme?: string;
  cardLayout?: string;
  themeColor?: string;
  template?: string;
  isPublic?: boolean;
  qrCodeUrl?: string;
  socialLinks?: Record<string, string>;
  appearance?: {
    theme?: string;
    accentColor?: string;
    font?: string;
    layout?: string;
  };
  views?: number;
  scans?: number;
  createdAt?: string;
  updatedAt?: string;
}

export async function getMyCard(): Promise<CardDTO> {
  try {
    return await apiClient<CardDTO>('/api/cards/me');
  } catch {
    const list = await apiClient<CardDTO[]>('/api/cards');
    if (Array.isArray(list) && list.length > 0) {
      return list[0];
    }
    throw new Error('No SmartCard found');
  }
}

export async function updateMyCard(cardData: Partial<CardDTO>): Promise<CardDTO> {
  try {
    return await apiClient<CardDTO>('/api/cards/me', {
      method: 'PUT',
      body: JSON.stringify(cardData),
    });
  } catch {
    const cardId = cardData._id || cardData.id || cardData.username || 'smriti';
    return await apiClient<CardDTO>(`/api/cards/${cardId}`, {
      method: 'PUT',
      body: JSON.stringify(cardData),
    });
  }
}

export async function createCard(cardData: Partial<CardDTO>): Promise<CardDTO> {
  return await apiClient<CardDTO>('/api/cards', {
    method: 'POST',
    body: JSON.stringify(cardData),
  });
}

export async function deleteMyCard(): Promise<void> {
  await apiClient('/api/cards/me', { method: 'DELETE' });
}

export async function getPublicCard(username: string): Promise<CardDTO> {
  try {
    return await apiClient<CardDTO>(`/api/cards/public/${username}`);
  } catch {
    return await apiClient<CardDTO>(`/api/cards/${username}`);
  }
}
