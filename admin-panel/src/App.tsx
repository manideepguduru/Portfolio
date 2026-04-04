import { Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import AdminLogin from './pages/AdminLogin';
import AdminPage from './pages/AdminPage';
import { adminAuth } from './utils/auth';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const authenticated = adminAuth.isAuthenticated();
    setIsAuthenticated(authenticated);
    setLoading(false);
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <Routes>
      <Route path="/login" element={<AdminLogin onLoginSuccess={() => setIsAuthenticated(true)} />} />
      <Route 
        path="/" 
        element={isAuthenticated ? <AdminPage onLogout={() => setIsAuthenticated(false)} /> : <Navigate to="/login" />} 
      />
      <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} />} />
    </Routes>
  );
}
