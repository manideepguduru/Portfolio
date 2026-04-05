import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import FloatingWhatsApp from './components/common/FloatingWhatsApp';
import HomePage from './pages/HomePage';
import ProjectsPage from './pages/ProjectsPage';
import ServicesPage from './pages/ServicesPage';
import ContactPage from './pages/ContactPage';
import { AdminLogin, AdminPage } from './admin/pages';
import { adminAuth } from './admin/utils/auth';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function PublicLayout() {
  return (
    <>
      <Navbar />
      <ScrollToTop />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
      <FloatingWhatsApp />
    </>
  );
}

function AdminLayout({ isAuthenticated, onLoginSuccess, onLogout }: { isAuthenticated: boolean; onLoginSuccess: () => void; onLogout: () => void }) {
  return (
    <Routes>
      <Route path="login" element={<AdminLogin onLoginSuccess={onLoginSuccess} />} />
      <Route 
        path="/" 
        element={
          isAuthenticated ? (
            <AdminPage onLogout={onLogout} />
          ) : (
            <Navigate to="/admin/login" replace />
          )
        } 
      />
      <Route path="*" element={<Navigate to="/admin/login" replace />} />
    </Routes>
  );
}

export default function App() {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminLoading, setAdminLoading] = useState(true);

  useEffect(() => {
    const authenticated = adminAuth.isAuthenticated();
    setIsAdminAuthenticated(authenticated);
    setAdminLoading(false);
  }, []);

  if (adminLoading) {
    return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>Loading...</div>;
  }

  return (
    <>
      <Routes>
        <Route 
          path="/admin/*" 
          element={
            <AdminLayout 
              isAuthenticated={isAdminAuthenticated}
              onLoginSuccess={() => setIsAdminAuthenticated(true)}
              onLogout={() => setIsAdminAuthenticated(false)}
            />
          } 
        />
        <Route path="/*" element={<PublicLayout />} />
      </Routes>
    </>
  );
}
