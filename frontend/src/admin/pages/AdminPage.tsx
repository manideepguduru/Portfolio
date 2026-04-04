import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAuth } from '../utils/auth';

interface Project {
  id: number;
  title: string;
  description: string;
  link: string;
  imageUrl: string;
  featured: boolean;
}

interface Service {
  id: number;
  title: string;
  description: string;
  isActive: boolean;
}

interface Contact {
  id: number;
  name: string;
  email: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export default function AdminPage({ onLogout }: { onLogout: () => void }) {
  const [tab, setTab] = useState<'projects' | 'services' | 'contacts'>('projects');
  const navigate = useNavigate();

  const handleLogout = () => {
    adminAuth.logout();
    onLogout();
    navigate('/admin/login');
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f1419', color: '#cbd5e1' }}>
      {/* Header */}
      <div style={{ backgroundColor: '#1a1f2e', borderBottom: '2px solid rgba(0, 217, 255, 0.2)', padding: '1.5rem 2rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ color: '#00d9ff', margin: 0 }}>🛡️ Admin Dashboard</h1>
          <button 
            onClick={handleLogout}
            style={{ 
              padding: '0.6rem 1.2rem',
              backgroundColor: '#ff6b6b',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ backgroundColor: '#141a2f', padding: '1rem 2rem', borderBottom: '1px solid rgba(0, 217, 255, 0.1)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '1rem' }}>
          {['projects', 'services', 'contacts'].map((t) => (
            <button 
              key={t}
              onClick={() => setTab(t as any)}
              style={{ 
                padding: '0.8rem 1.5rem',
                backgroundColor: tab === t ? '#00d9ff' : 'transparent',
                color: tab === t ? '#0f1419' : '#00d9ff',
                border: `2px solid ${tab === t ? '#00d9ff' : 'rgba(0, 217, 255, 0.3)'}`,
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold',
                textTransform: 'capitalize',
                transition: 'all 0.3s'
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        {tab === 'projects' && <ProjectsAdmin />}
        {tab === 'services' && <ServicesAdmin />}
        {tab === 'contacts' && <ContactsAdmin />}
      </div>
    </div>
  );
}

function ProjectsAdmin() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/projects`);
      const data = await res.json();
      setProjects(data.data || []);
    } catch (err) {
      setError('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const deleteProject = async (id: number) => {
    if (confirm('Delete this project?')) {
      try {
        await fetch(`${API_URL}/projects/${id}`, { method: 'DELETE' });
        setProjects(projects.filter(p => p.id !== id));
      } catch (err) {
        alert('Failed to delete project');
      }
    }
  };

  return (
    <div style={{ backgroundColor: '#1a1f2e', padding: '2rem', borderRadius: '8px', border: '1px solid rgba(0, 217, 255, 0.1)' }}>
      <h2 style={{ color: '#00d9ff', marginTop: 0 }}>📁 Manage Projects</h2>
      
      {loading && <p style={{ color: '#00d9ff' }}>Loading projects...</p>}
      {error && <p style={{ color: '#ff6b6b' }}>{error}</p>}
      
      {!loading && projects.length === 0 && <p style={{ color: '#a0aec0' }}>No projects found</p>}
      
      {!loading && projects.length > 0 && (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid rgba(0, 217, 255, 0.2)' }}>
                <th style={{ padding: '0.8rem', textAlign: 'left', color: '#00d9ff' }}>Title</th>
                <th style={{ padding: '0.8rem', textAlign: 'left', color: '#00d9ff' }}>Link</th>
                <th style={{ padding: '0.8rem', textAlign: 'center', color: '#00d9ff' }}>Featured</th>
                <th style={{ padding: '0.8rem', textAlign: 'center', color: '#00d9ff' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {projects.map(p => (
                <tr key={p.id} style={{ borderBottom: '1px solid rgba(0, 217, 255, 0.1)' }}>
                  <td style={{ padding: '0.8rem', color: '#cbd5e1' }}>{p.title}</td>
                  <td style={{ padding: '0.8rem', color: '#a0aec0', fontSize: '0.85rem' }}>{p.link}</td>
                  <td style={{ padding: '0.8rem', textAlign: 'center', color: p.featured ? '#00d9ff' : '#a0aec0' }}>
                    {p.featured ? '✓' : '○'}
                  </td>
                  <td style={{ padding: '0.8rem', textAlign: 'center' }}>
                    <button 
                      onClick={() => deleteProject(p.id)}
                      style={{ 
                        padding: '0.4rem 0.8rem',
                        backgroundColor: '#ff6b6b',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function ServicesAdmin() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/services/all`);
      const data = await res.json();
      setServices(data.data || []);
    } catch (err) {
      setError('Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  const toggleActive = async (id: number, isActive: boolean) => {
    try {
      const service = services.find(s => s.id === id);
      if (!service) return;
      
      await fetch(`${API_URL}/services/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...service, isActive: !isActive })
      });
      
      setServices(services.map(s => s.id === id ? { ...s, isActive: !isActive } : s));
    } catch (err) {
      alert('Failed to update service');
    }
  };

  const deleteService = async (id: number) => {
    if (confirm('Delete this service?')) {
      try {
        await fetch(`${API_URL}/services/${id}`, { method: 'DELETE' });
        setServices(services.filter(s => s.id !== id));
      } catch (err) {
        alert('Failed to delete service');
      }
    }
  };

  return (
    <div style={{ backgroundColor: '#1a1f2e', padding: '2rem', borderRadius: '8px', border: '1px solid rgba(0, 217, 255, 0.1)' }}>
      <h2 style={{ color: '#00d9ff', marginTop: 0 }}>🛠️ Manage Services</h2>
      
      {loading && <p style={{ color: '#00d9ff' }}>Loading services...</p>}
      {error && <p style={{ color: '#ff6b6b' }}>{error}</p>}
      
      {!loading && services.length === 0 && <p style={{ color: '#a0aec0' }}>No services found</p>}
      
      {!loading && services.length > 0 && (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid rgba(0, 217, 255, 0.2)' }}>
                <th style={{ padding: '0.8rem', textAlign: 'left', color: '#00d9ff' }}>Title</th>
                <th style={{ padding: '0.8rem', textAlign: 'center', color: '#00d9ff' }}>Status</th>
                <th style={{ padding: '0.8rem', textAlign: 'center', color: '#00d9ff' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.map(s => (
                <tr key={s.id} style={{ borderBottom: '1px solid rgba(0, 217, 255, 0.1)' }}>
                  <td style={{ padding: '0.8rem', color: '#cbd5e1' }}>{s.title}</td>
                  <td style={{ padding: '0.8rem', textAlign: 'center', color: s.isActive ? '#00d9ff' : '#a0aec0' }}>
                    {s.isActive ? 'Active' : 'Inactive'}
                  </td>
                  <td style={{ padding: '0.8rem', textAlign: 'center' }}>
                    <button 
                      onClick={() => toggleActive(s.id, s.isActive)}
                      style={{ 
                        padding: '0.4rem 0.8rem',
                        backgroundColor: s.isActive ? '#ff9500' : '#00d9ff',
                        color: s.isActive ? 'white' : '#0f1419',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        marginRight: '0.5rem'
                      }}
                    >
                      {s.isActive ? 'Disable' : 'Enable'}
                    </button>
                    <button 
                      onClick={() => deleteService(s.id)}
                      style={{ 
                        padding: '0.4rem 0.8rem',
                        backgroundColor: '#ff6b6b',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function ContactsAdmin() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchContacts();
    fetchUnreadCount();
  }, []);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/contact`);
      const data = await res.json();
      setContacts(data.data || []);
    } catch (err) {
      setError('Failed to load contacts');
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const res = await fetch(`${API_URL}/contact/unread-count`);
      const data = await res.json();
      setUnreadCount(data.data || 0);
    } catch (err) {
      // Silent fail
    }
  };

  const markAsRead = async (id: number) => {
    try {
      await fetch(`${API_URL}/contact/${id}/read`, { method: 'PUT' });
      setContacts(contacts.map(c => c.id === id ? { ...c, isRead: true } : c));
      fetchUnreadCount();
    } catch (err) {
      alert('Failed to update contact');
    }
  };

  const deleteContact = async (id: number) => {
    if (confirm('Delete this message?')) {
      try {
        await fetch(`${API_URL}/contact/${id}`, { method: 'DELETE' });
        setContacts(contacts.filter(c => c.id !== id));
        fetchUnreadCount();
      } catch (err) {
        alert('Failed to delete contact');
      }
    }
  };

  return (
    <div style={{ backgroundColor: '#1a1f2e', padding: '2rem', borderRadius: '8px', border: '1px solid rgba(0, 217, 255, 0.1)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2 style={{ color: '#00d9ff', margin: 0 }}>📧 Contact Submissions</h2>
        <span style={{ backgroundColor: '#ff6b6b', color: 'white', padding: '0.4rem 0.8rem', borderRadius: '20px', fontSize: '0.85rem' }}>
          Unread: {unreadCount}
        </span>
      </div>
      
      {loading && <p style={{ color: '#00d9ff' }}>Loading contacts...</p>}
      {error && <p style={{ color: '#ff6b6b' }}>{error}</p>}
      
      {!loading && contacts.length === 0 && <p style={{ color: '#a0aec0' }}>No contact messages yet</p>}
      
      {!loading && contacts.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          {contacts.map(c => (
            <div 
              key={c.id} 
              style={{ 
                backgroundColor: c.isRead ? '#141a2f' : 'rgba(0, 217, 255, 0.1)',
                padding: '1rem',
                marginBottom: '1rem',
                borderRadius: '4px',
                border: `1px solid ${c.isRead ? 'rgba(0, 217, 255, 0.1)' : 'rgba(0, 217, 255, 0.3)'}`,
                borderLeft: `4px solid ${c.isRead ? '#a0aec0' : '#00d9ff'}`
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                <div>
                  <p style={{ margin: '0 0 0.3rem 0', color: '#00d9ff', fontWeight: 'bold' }}>{c.name}</p>
                  <p style={{ margin: 0, color: '#a0aec0', fontSize: '0.85rem' }}>{c.email}</p>
                </div>
                <span style={{ fontSize: '0.75rem', color: '#78849c' }}>
                  {new Date(c.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p style={{ margin: '0.8rem 0', color: '#cbd5e1', lineHeight: '1.5' }}>{c.message}</p>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.8rem' }}>
                {!c.isRead && (
                  <button 
                    onClick={() => markAsRead(c.id)}
                    style={{ 
                      padding: '0.4rem 0.8rem',
                      backgroundColor: '#00d9ff',
                      color: '#0f1419',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      fontWeight: 'bold'
                    }}
                  >
                    Mark as Read
                  </button>
                )}
                <button 
                  onClick={() => deleteContact(c.id)}
                  style={{ 
                    padding: '0.4rem 0.8rem',
                    backgroundColor: '#ff6b6b',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '0.85rem'
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
