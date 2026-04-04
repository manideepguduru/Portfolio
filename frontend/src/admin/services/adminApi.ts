import { adminAuth } from '../utils/auth';

const API_URL = import.meta.env.VITE_ADMIN_API_URL || 'http://localhost:8080/api/admin';

export const adminApiClient = {
  async get(endpoint: string) {
    const token = adminAuth.getToken();
    if (!token) throw new Error('Not authenticated');

    const response = await fetch(`${API_URL}${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) throw new Error(`API error: ${response.status}`);
    return response.json();
  },

  async post(endpoint: string, data: any) {
    const token = adminAuth.getToken();
    if (!token) throw new Error('Not authenticated');

    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) throw new Error(`API error: ${response.status}`);
    return response.json();
  },

  async put(endpoint: string, data: any) {
    const token = adminAuth.getToken();
    if (!token) throw new Error('Not authenticated');

    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) throw new Error(`API error: ${response.status}`);
    return response.json();
  },

  async delete(endpoint: string) {
    const token = adminAuth.getToken();
    if (!token) throw new Error('Not authenticated');

    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) throw new Error(`API error: ${response.status}`);
    return response.json();
  }
};
