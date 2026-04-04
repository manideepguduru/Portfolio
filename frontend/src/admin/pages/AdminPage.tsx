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
  const [originalData, setOriginalData] = useState<Partial<Project>>({});

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
    setOriginalData({ ...project });
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

  const hasChanged = (key: string) => formData[key as keyof typeof formData] !== originalData[key as keyof typeof originalData];

  return (
    <div style={{ backgroundColor: '#1a1f2e', padding: '2rem', borderRadius: '8px', border: '1px solid rgba(0, 217, 255, 0.1)' }}>
      <h2 style={{ color: '#00d9ff', marginTop: 0 }}>📁 Manage Projects</h2>
      
      {loading && <p style={{ color: '#00d9ff' }}>Loading projects...</p>}
      {error && <p style={{ color: '#ff6b6b' }}>{error}</p>}
      
      {!loading && projects.length === 0 && <p style={{ color: '#a0aec0' }}>No projects found</p>}
      
      {!loading && projects.length > 0 && (
        <>
          {editingId ? (
            // Edit Modal
            <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
              <div style={{ backgroundColor: '#1a1f2e', padding: '2rem', borderRadius: '8px', border: '2px solid #00d9ff', maxWidth: '500px', width: '90%', maxHeight: '90vh', overflowY: 'auto' }}>
                <h3 style={{ color: '#00d9ff', marginTop: 0 }}>✏️ Edit Project</h3>
                
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', color: '#00d9ff', marginBottom: '0.3rem', fontSize: '0.9rem', fontWeight: 'bold' }}>Title {hasChanged('title') && <span style={{ color: '#ff9500' }}>●</span>}</label>
                  <input 
                    type="text" 
                    value={formData.title || ''} 
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    style={{ width: '100%', padding: '0.7rem', backgroundColor: '#0f1419', color: '#00d9ff', border: hasChanged('title') ? '2px solid #ff9500' : '1px solid #00d9ff', borderRadius: '4px', boxSizing: 'border-box' }}
                  />
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', color: '#00d9ff', marginBottom: '0.3rem', fontSize: '0.9rem', fontWeight: 'bold' }}>Description {hasChanged('description') && <span style={{ color: '#ff9500' }}>●</span>}</label>
                  <textarea 
                    value={formData.description || ''} 
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    style={{ width: '100%', padding: '0.7rem', backgroundColor: '#0f1419', color: '#00d9ff', border: hasChanged('description') ? '2px solid #ff9500' : '1px solid #00d9ff', borderRadius: '4px', minHeight: '100px', boxSizing: 'border-box', fontFamily: 'monospace', fontSize: '0.9rem' }}
                  />
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', color: '#00d9ff', marginBottom: '0.3rem', fontSize: '0.9rem', fontWeight: 'bold' }}>Link {hasChanged('link') && <span style={{ color: '#ff9500' }}>●</span>}</label>
                  <input 
                    type="text" 
                    value={formData.link || ''} 
                    onChange={(e) => setFormData({...formData, link: e.target.value})}
                    style={{ width: '100%', padding: '0.7rem', backgroundColor: '#0f1419', color: '#00d9ff', border: hasChanged('link') ? '2px solid #ff9500' : '1px solid #00d9ff', borderRadius: '4px', boxSizing: 'border-box' }}
                  />
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#00d9ff', cursor: 'pointer' }}>
                    <input 
                      type="checkbox" 
                      checked={formData.featured || false}
                      onChange={(e) => setFormData({...formData, featured: e.target.checked})}
                      style={{ cursor: 'pointer', width: '18px', height: '18px' }}
                    />
                    <span>Featured {hasChanged('featured') && <span style={{ color: '#ff9500' }}>●</span>}</span>
                  </label>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem' }}>
                  <button 
                    onClick={() => saveEdit(editingId!)}
                    style={{ flex: 1, padding: '0.8rem', backgroundColor: '#00d9ff', color: '#0f1419', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.9rem' }}
                  >
                    ✅ Save Changes
                  </button>
                  <button 
                    onClick={() => setEditingId(null)}
                    style={{ flex: 1, padding: '0.8rem', backgroundColor: '#a0aec0', color: '#0f1419', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.9rem' }}
                  >
                    ❌ Cancel
                  </button>
                </div>
              </div>
            </div>
          ) : null}

          {/* Grid View */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
            {projects.map(p => (
              <div key={p.id} style={{ backgroundColor: '#141a2f', padding: '1.2rem', borderRadius: '8px', border: '1px solid rgba(0, 217, 255, 0.2)', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                <div>
                  <h4 style={{ margin: '0 0 0.3rem 0', color: '#00d9ff', fontSize: '1rem', wordBreak: 'break-word' }}>{p.title}</h4>
                  <p style={{ margin: 0, color: '#a0aec0', fontSize: '0.8rem', lineHeight: '1.4', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{p.description}</p>
                </div>
                
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', fontSize: '0.75rem' }}>
                  <span style={{ backgroundColor: 'rgba(0, 217, 255, 0.2)', color: '#00d9ff', padding: '0.3rem 0.6rem', borderRadius: '3px' }}>🔗 {p.featured ? '⭐ Featured' : 'Portfolio'}</span>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                  <button 
                    onClick={() => startEdit(p)}
                    style={{ flex: 1, padding: '0.6rem', backgroundColor: '#ff9500', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.8rem' }}
                  >
                    ✏️ Edit
                  </button>
                  <button 
                    onClick={() => deleteProject(p.id)}
                    style={{ flex: 1, padding: '0.6rem', backgroundColor: '#ff6b6b', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.8rem' }}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
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
  const [originalData, setOriginalData] = useState<Partial<Service>>({});

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
    setOriginalData({ ...service });
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

  const hasChanged = (key: string) => formData[key as keyof typeof formData] !== originalData[key as keyof typeof originalData];

  return (
    <div style={{ backgroundColor: '#1a1f2e', padding: '2rem', borderRadius: '8px', border: '1px solid rgba(0, 217, 255, 0.1)' }}>
      <h2 style={{ color: '#00d9ff', marginTop: 0 }}>🛠️ Manage Services</h2>
      
      {loading && <p style={{ color: '#00d9ff' }}>Loading services...</p>}
      {error && <p style={{ color: '#ff6b6b' }}>{error}</p>}
      
      {!loading && services.length === 0 && <p style={{ color: '#a0aec0' }}>No services found</p>}
      
      {!loading && services.length > 0 && (
        <>
          {editingId ? (
            // Edit Modal
            <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
              <div style={{ backgroundColor: '#1a1f2e', padding: '2rem', borderRadius: '8px', border: '2px solid #00d9ff', maxWidth: '500px', width: '90%', maxHeight: '90vh', overflowY: 'auto' }}>
                <h3 style={{ color: '#00d9ff', marginTop: 0 }}>✏️ Edit Service</h3>
                
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', color: '#00d9ff', marginBottom: '0.3rem', fontSize: '0.9rem', fontWeight: 'bold' }}>Title {hasChanged('title') && <span style={{ color: '#ff9500' }}>●</span>}</label>
                  <input 
                    type="text" 
                    value={formData.title || ''} 
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    style={{ width: '100%', padding: '0.7rem', backgroundColor: '#0f1419', color: '#00d9ff', border: hasChanged('title') ? '2px solid #ff9500' : '1px solid #00d9ff', borderRadius: '4px', boxSizing: 'border-box' }}
                  />
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', color: '#00d9ff', marginBottom: '0.3rem', fontSize: '0.9rem', fontWeight: 'bold' }}>Description {hasChanged('description') && <span style={{ color: '#ff9500' }}>●</span>}</label>
                  <textarea 
                    value={formData.description || ''} 
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    style={{ width: '100%', padding: '0.7rem', backgroundColor: '#0f1419', color: '#00d9ff', border: hasChanged('description') ? '2px solid #ff9500' : '1px solid #00d9ff', borderRadius: '4px', minHeight: '100px', boxSizing: 'border-box', fontFamily: 'monospace', fontSize: '0.9rem' }}
                  />
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#00d9ff', cursor: 'pointer' }}>
                    <input 
                      type="checkbox" 
                      checked={formData.isActive || false}
                      onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                      style={{ cursor: 'pointer', width: '18px', height: '18px' }}
                    />
                    <span>Active {hasChanged('isActive') && <span style={{ color: '#ff9500' }}>●</span>}</span>
                  </label>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem' }}>
                  <button 
                    onClick={() => saveEdit(editingId!)}
                    style={{ flex: 1, padding: '0.8rem', backgroundColor: '#00d9ff', color: '#0f1419', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.9rem' }}
                  >
                    ✅ Save Changes
                  </button>
                  <button 
                    onClick={() => setEditingId(null)}
                    style={{ flex: 1, padding: '0.8rem', backgroundColor: '#a0aec0', color: '#0f1419', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.9rem' }}
                  >
                    ❌ Cancel
                  </button>
                </div>
              </div>
            </div>
          ) : null}

          {/* Grid View */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
            {services.map(s => (
              <div key={s.id} style={{ backgroundColor: '#141a2f', padding: '1.2rem', borderRadius: '8px', border: '1px solid rgba(0, 217, 255, 0.2)', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                <div>
                  <h4 style={{ margin: '0 0 0.3rem 0', color: '#00d9ff', fontSize: '1rem', wordBreak: 'break-word' }}>{s.title}</h4>
                  <p style={{ margin: 0, color: '#a0aec0', fontSize: '0.8rem', lineHeight: '1.4', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{s.description}</p>
                </div>
                
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', fontSize: '0.75rem' }}>
                  <span style={{ backgroundColor: s.isActive ? 'rgba(0, 217, 255, 0.2)' : 'rgba(160, 174, 192, 0.2)', color: s.isActive ? '#00d9ff' : '#a0aec0', padding: '0.3rem 0.6rem', borderRadius: '3px', fontWeight: 'bold' }}>
                    {s.isActive ? '🟢 Active' : '⚫ Inactive'}
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                  <button 
                    onClick={() => startEdit(s)}
                    style={{ flex: 1, padding: '0.6rem', backgroundColor: '#ff9500', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.8rem' }}
                  >
                    ✏️ Edit
                  </button>
                  <button 
                    onClick={() => deleteService(s.id)}
                    style={{ flex: 1, padding: '0.6rem', backgroundColor: '#ff6b6b', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.8rem' }}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h2 style={{ color: '#00d9ff', margin: 0 }}>📧 Messages (From Contact Form)</h2>
        {unreadCount > 0 && (
          <span style={{ backgroundColor: '#ff6b6b', color: 'white', padding: '0.4rem 0.8rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold', display: 'inline-block' }}>
            📬 {unreadCount} Unread
          </span>
        )}
      </div>
      
      {loading && <p style={{ color: '#00d9ff' }}>Loading messages...</p>}
      {error && <p style={{ color: '#ff6b6b' }}>{error}</p>}
      
      {!loading && contacts.length === 0 && <p style={{ color: '#a0aec0' }}>No contact messages yet</p>}
      
      {!loading && contacts.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
          {contacts.map(c => (
            <div 
              key={c.id} 
              style={{ 
                backgroundColor: c.isRead ? '#141a2f' : 'rgba(0, 217, 255, 0.1)',
                padding: '1.2rem',
                borderRadius: '8px',
                border: `2px solid ${c.isRead ? 'rgba(0, 217, 255, 0.1)' : 'rgba(0, 217, 255, 0.5)'}`,
                borderLeft: `4px solid ${c.isRead ? '#a0aec0' : '#ff9500'}`,
                display: 'flex',
                flexDirection: 'column',
                gap: '0.8rem'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: '0.5rem' }}>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: '0 0 0.3rem 0', color: '#00d9ff', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.95rem' }}>
                    {!c.isRead && <span style={{ fontSize: '0.8rem' }}>🔴</span>}
                    {c.name}
                  </p>
                  <p style={{ margin: 0, color: '#a0aec0', fontSize: '0.8rem', wordBreak: 'break-all' }}>📧 {c.email}</p>
                </div>
                <span style={{ fontSize: '0.7rem', color: '#78849c', whiteSpace: 'nowrap', textAlign: 'right' }}>
                  {new Date(c.createdAt).toLocaleDateString()}<br />{new Date(c.createdAt).toLocaleTimeString()}
                </span>
              </div>
              
              <p style={{ margin: '0.5rem 0', color: '#cbd5e1', lineHeight: '1.5', fontSize: '0.9rem', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{c.message}</p>
              
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                {!c.isRead && (
                  <button 
                    onClick={() => markAsRead(c.id)}
                    style={{ 
                      flex: 1,
                      padding: '0.6rem',
                      backgroundColor: '#00d9ff',
                      color: '#0f1419',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '0.8rem',
                      fontWeight: 'bold'
                    }}
                  >
                    ✓ Read
                  </button>
                )}
                <button 
                  onClick={() => deleteContact(c.id)}
                  style={{ 
                    flex: 1,
                    padding: '0.6rem',
                    backgroundColor: '#ff6b6b',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    fontWeight: 'bold'
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
