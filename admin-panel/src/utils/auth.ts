export const adminAuth = {
  TOKEN_KEY: 'admin_token',
  EXPIRY_KEY: 'admin_token_expiry',

  setToken: (token: string, expiresIn: number = 86400000) => {
    localStorage.setItem(adminAuth.TOKEN_KEY, token);
    localStorage.setItem(adminAuth.EXPIRY_KEY, (Date.now() + expiresIn).toString());
  },

  getToken: (): string | null => {
    const token = localStorage.getItem(adminAuth.TOKEN_KEY);
    const expiry = localStorage.getItem(adminAuth.EXPIRY_KEY);
    
    if (!token || !expiry) return null;
    if (Date.now() > parseInt(expiry)) {
      adminAuth.logout();
      return null;
    }
    return token;
  },

  isAuthenticated: (): boolean => {
    return adminAuth.getToken() !== null;
  },

  logout: () => {
    localStorage.removeItem(adminAuth.TOKEN_KEY);
    localStorage.removeItem(adminAuth.EXPIRY_KEY);
  }
};
