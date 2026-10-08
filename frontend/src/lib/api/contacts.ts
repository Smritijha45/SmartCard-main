import { apiClient } from './client';

export interface ContactDTO {
  _id?: string;
  id?: string;
  ownerId?: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  role?: string;
  source?: string;
  status?: string;
  notes?: string;
  dateConnected?: string;
  avatarColor?: string;
  createdAt?: string;
}

export async function getContacts(): Promise<ContactDTO[]> {
  try {
    const data = await apiClient<ContactDTO[]>('/api/contacts');
    return Array.isArray(data) ? data : (data as any)?.contacts || [];
  } catch {
    const leads = await apiClient<ContactDTO[]>('/api/leads');
    return Array.isArray(leads) ? leads : [];
  }
}

export async function createContact(contactData: Partial<ContactDTO>): Promise<ContactDTO> {
  try {
    return await apiClient<ContactDTO>('/api/contacts', {
      method: 'POST',
      body: JSON.stringify(contactData),
    });
  } catch {
    return await apiClient<ContactDTO>('/api/leads', {
      method: 'POST',
      body: JSON.stringify(contactData),
    });
  }
}

export async function deleteContact(id: string): Promise<void> {
  try {
    await apiClient(`/api/contacts/${id}`, { method: 'DELETE' });
  } catch {
    // Fallback if needed
  }
}
