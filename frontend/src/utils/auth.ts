// Simple admin authentication utility
const ADMIN_TOKEN_KEY = 'admin_token';
const ADMIN_PASSWORD = 'admin@2024'; // Change this to your secure password

export const adminAuth = {
  isAuthenticated: (): boolean => {
    if (typeof window === 'undefined') return false;
    const token = localStorage.getItem(ADMIN_TOKEN_KEY);
    return !!token;
  },

  login: (password: string): boolean => {
    if (password === ADMIN_PASSWORD) {
      const token = btoa(`admin:${Date.now()}`); // Simple token encoding
      localStorage.setItem(ADMIN_TOKEN_KEY, token);
      return true;
    }
    return false;
  },

  logout: (): void => {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
  },

  getToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(ADMIN_TOKEN_KEY);
  },
};
