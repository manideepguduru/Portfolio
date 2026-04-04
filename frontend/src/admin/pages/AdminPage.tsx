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
  createdAt?: string;
  updatedAt?: string;
}

interface Service {
  id: number;
  title: string;
  description: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
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
  const [tab, setTab] = useState<'contacts' | 'projects' | 'services'>('contacts');
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
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', gap: '1rem' }}>
          {['contacts', 'projects', 'services'].map((t) => (
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
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem' }}>
        {tab === 'contacts' && <ContactsAdmin />}
        {tab === 'projects' && <ProjectsAdmin />}
        {tab === 'services' && <ServicesAdmin />}
      </div>
    </div>
  );
}

function ProjectsAdmin() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<Project>>({});

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
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (project: Project) => {
    setEditingId(project.id);
    setFormData({ ...project });
  };

  const saveEdit = async (id: number) => {
    if (!formData.title || !formData.description || !formData.link) {
      alert('Please fill all fields');
      return;
    }
    try {
      const res = await fetch(`${API_URL}/projects/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setEditingId(null);
        await fetchProjects();
      } else {
        alert('Failed to update project');
      }
    } catch (err) {
      alert('Failed to update project');
      console.error(err);
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
                <th style={{ padding: '0.8rem', textAlign: 'left', color: '#00d9ff' }}>Description</th>
                <th style={{ padding: '0.8rem', textAlign: 'left', color: '#00d9ff' }}>Link</th>
                <th style={{ padding: '0.8rem', textAlign: 'center', color: '#00d9ff' }}>Featured</th>
                <th style={{ padding: '0.8rem', textAlign: 'center', color: '#00d9ff' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map(p => (
                <tr key={p.id} style={{ borderBottom: '1px solid rgba(0, 217, 255, 0.1)' }}>
                  <td style={{ padding: '0.8rem' }}>
                    {editingId === p.id ? (
                      <input 
                        type="text" 
                        value={formData.title || ''} 
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        style={{ width: '100%', padding: '0.4rem', backgroundColor: '#0f1419', color: '#00d9ff', border: '1px solid #00d9ff', borderRadius: '4px' }}
                      />
                    ) : (
                      <span style={{ color: '#cbd5e1' }}>{p.title}</span>
                    )}
                  </td>
                  <td style={{ padding: '0.8rem', maxWidth: '200px' }}>
                    {editingId === p.id ? (
                      <textarea 
                        value={formData.description || ''} 
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        style={{ width: '100%', padding: '0.4rem', backgroundColor: '#0f1419', color: '#00d9ff', border: '1px solid #00d9ff', borderRadius: '4px', minHeight: '60px', fontFamily: 'monospace', fontSize: '0.8rem' }}
                      />
                    ) : (
                      <span style={{ color: '#a0aec0', fontSize: '0.85rem' }}>{p.description?.substring(0, 50)}...</span>
                    )}
                  </td>
                  <td style={{ padding: '0.8rem' }}>
                    {editingId === p.id ? (
                      <input 
                        type="text" 
                        value={formData.link || ''} 
                        onChange={(e) => setFormData({...formData, link: e.target.value})}
                        style={{ width: '100%', padding: '0.4rem', backgroundColor: '#0f1419', color: '#00d9ff', border: '1px solid #00d9ff', borderRadius: '4px' }}
                      />
                    ) : (
                      <span style={{ color: '#a0aec0', fontSize: '0.85rem' }}>{p.link}</span>
                    )}
                  </td>
                  <td style={{ padding: '0.8rem', textAlign: 'center', color: p.featured ? '#00d9ff' : '#a0aec0' }}>
                    {editingId === p.id ? (
                      <input 
                        type="checkbox" 
                        checked={formData.featured || false}
                        onChange={(e) => setFormData({...formData, featured: e.target.checked})}
                      />
                    ) : (
                      p.featured ? '✓' : '○'
                    )}
                  </td>
                  <td style={{ padding: '0.8rem', textAlign: 'center' }}>
                    {editingId === p.id ? (
                      <>
                        <button 
                          onClick={() => saveEdit(p.id)}
                          style={{ padding: '0.4rem 0.8rem', backgroundColor: '#00d9ff', color: '#0f1419', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '0.5rem', fontWeight: 'bold', fontSize: '0.85rem' }}
                        >
                          Save
                        </button>
                        <button 
                          onClick={() => setEditingId(null)}
                          style={{ padding: '0.4rem 0.8rem', backgroundColor: '#a0aec0', color: '#0f1419', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' }}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button 
                          onClick={() => startEdit(p)}
                          style={{ padding: '0.4rem 0.8rem', backgroundColor: '#ff9500', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '0.5rem', fontSize: '0.85rem' }}
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => deleteProject(p.id)}
                          style={{ padding: '0.4rem 0.8rem', backgroundColor: '#ff6b6b', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' }}
                        >
                          Delete
                        </button>
                      </>
                    )}
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
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<Service>>({});

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
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (service: Service) => {
    setEditingId(service.id);
    setFormData({ ...service });
  };

  const saveEdit = async (id: number) => {
    if (!formData.title || !formData.description) {
      alert('Please fill all fields');
      return;
    }
    try {
      const res = await fetch(`${API_URL}/services/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setEditingId(null);
        await fetchServices();
      } else {
        alert('Failed to update service');
      }
    } catch (err) {
      alert('Failed to update service');
      console.error(err);
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
                <th style={{ padding: '0.8rem', textAlign: 'left', color: '#00d9ff' }}>Description</th>
                <th style={{ padding: '0.8rem', textAlign: 'center', color: '#00d9ff' }}>Status</th>
                <th style={{ padding: '0.8rem', textAlign: 'center', color: '#00d9ff' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.map(s => (
                <tr key={s.id} style={{ borderBottom: '1px solid rgba(0, 217, 255, 0.1)' }}>
                  <td style={{ padding: '0.8rem' }}>
                    {editingId === s.id ? (
                      <input 
                        type="text" 
                        value={formData.title || ''} 
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        style={{ width: '100%', padding: '0.4rem', backgroundColor: '#0f1419', color: '#00d9ff', border: '1px solid #00d9ff', borderRadius: '4px' }}
                      />
                    ) : (
                      <span style={{ color: '#cbd5e1' }}>{s.title}</span>
                    )}
                  </td>
                  <td style={{ padding: '0.8rem', maxWidth: '250px' }}>
                    {editingId === s.id ? (
                      <textarea 
                        value={formData.description || ''} 
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        style={{ width: '100%', padding: '0.4rem', backgroundColor: '#0f1419', color: '#00d9ff', border: '1px solid #00d9ff', borderRadius: '4px', minHeight: '60px', fontFamily: 'monospace', fontSize: '0.8rem' }}
                      />
                    ) : (
                      <span style={{ color: '#a0aec0', fontSize: '0.85rem' }}>{s.description?.substring(0, 60)}...</span>
                    )}
                  </td>
                  <td style={{ padding: '0.8rem', textAlign: 'center' }}>
                    {editingId === s.id ? (
                      <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                        <input 
                          type="checkbox" 
                          checked={formData.isActive || false}
                          onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                          style={{ cursor: 'pointer' }}
                        />
                        <span style={{ color: formData.isActive ? '#00d9ff' : '#a0aec0', fontSize: '0.85rem' }}>
                          {formData.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </label>
                    ) : (
                      <span style={{ color: s.isActive ? '#00d9ff' : '#a0aec0', fontWeight: 'bold' }}>
                        {s.isActive ? 'Active' : 'Inactive'}
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '0.8rem', textAlign: 'center' }}>
                    {editingId === s.id ? (
                      <>
                        <button 
                          onClick={() => saveEdit(s.id)}
                          style={{ padding: '0.4rem 0.8rem', backgroundColor: '#00d9ff', color: '#0f1419', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '0.5rem', fontWeight: 'bold', fontSize: '0.85rem' }}
                        >
                          Save
                        </button>
                        <button 
                          onClick={() => setEditingId(null)}
                          style={{ padding: '0.4rem 0.8rem', backgroundColor: '#a0aec0', color: '#0f1419', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' }}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button 
                          onClick={() => startEdit(s)}
                          style={{ padding: '0.4rem 0.8rem', backgroundColor: '#ff9500', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '0.5rem', fontSize: '0.85rem' }}
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => deleteService(s.id)}
                          style={{ padding: '0.4rem 0.8rem', backgroundColor: '#ff6b6b', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' }}
                        >
                          Delete
                        </button>
                      </>
                    )}
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
      // Sort by date, newest first
      const contactsList = data.data || [];
      contactsList.sort((a: Contact, b: Contact) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setContacts(contactsList);
    } catch (err) {
      setError('Failed to load contacts');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const res = await fetch(`${API_URL}/contact/unread-count`);
      const data = await res.json();
      // Handle both direct count or nested count property
      const count = data.data?.count || data.data || data.count || 0;
      setUnreadCount(count);
    } catch (err) {
      console.error('Failed to fetch unread count', err);
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
        <h2 style={{ color: '#00d9ff', margin: 0 }}>📧 Messages (From Contact Form)</h2>
        {unreadCount > 0 && (
          <span style={{ backgroundColor: '#ff6b6b', color: 'white', padding: '0.4rem 0.8rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold' }}>
            📬 {unreadCount} Unread
          </span>
        )}
      </div>
      
      {loading && <p style={{ color: '#00d9ff' }}>Loading messages...</p>}
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
                border: `1px solid ${c.isRead ? 'rgba(0, 217, 255, 0.1)' : 'rgba(0, 217, 255, 0.5)'}`,
                borderLeft: `4px solid ${c.isRead ? '#a0aec0' : '#ff9500'}`
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                <div>
                  <p style={{ margin: '0 0 0.3rem 0', color: '#00d9ff', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {!c.isRead && <span style={{ fontSize: '1rem' }}>🔴</span>}
                    {c.name}
                  </p>
                  <p style={{ margin: 0, color: '#a0aec0', fontSize: '0.85rem' }}>📧 {c.email}</p>
                </div>
                <span style={{ fontSize: '0.75rem', color: '#78849c', whiteSpace: 'nowrap' }}>
                  {new Date(c.createdAt).toLocaleDateString()} {new Date(c.createdAt).toLocaleTimeString()}
                </span>
              </div>
              <p style={{ margin: '0.8rem 0', color: '#cbd5e1', lineHeight: '1.6', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{c.message}</p>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.8rem' }}>
                {!c.isRead && (
                  <button 
                    onClick={() => markAsRead(c.id)}
                    style={{ 
                      padding: '0.4rem 1rem',
                      backgroundColor: '#00d9ff',
                      color: '#0f1419',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      fontWeight: 'bold'
                    }}
                  >
                    ✓ Mark as Read
                  </button>
                )}
                <button 
                  onClick={() => deleteContact(c.id)}
                  style={{ 
                    padding: '0.4rem 1rem',
                    backgroundColor: '#ff6b6b',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '0.85rem'
                  }}
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
