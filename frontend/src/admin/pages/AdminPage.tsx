import { useState, useEffect, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAuth } from '../utils/auth';

/* --- Types matching backend entities exactly --- */

interface Project {
  id: number;
  title: string;
  description: string;
  techStack: string;
  githubUrl: string | null;
  liveUrl: string | null;
  imageUrl: string | null;
  featured: boolean;
  sortOrder: number;
  createdAt?: string;
  updatedAt?: string;
}

interface Service {
  id: number;
  title: string;
  description: string;
  icon: string | null;
  priceRange: string | null;
  techStack: string | null;
  githubUrl: string | null;
  liveUrl: string | null;
  sortOrder: number;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface Contact {
  id: number;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  readStatus: boolean;
  createdAt: string;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

/* --- Shared styles --- */

const css = {
  card: {
    backgroundColor: '#161d2f',
    borderRadius: '10px',
    border: '1px solid rgba(0,217,255,.12)',
    padding: '1.25rem',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '.7rem',
    transition: 'border-color .2s',
  },
  input: {
    width: '100%',
    padding: '.65rem .8rem',
    backgroundColor: '#0d1117',
    color: '#e6edf3',
    border: '1px solid #30363d',
    borderRadius: '6px',
    fontSize: '.9rem',
    boxSizing: 'border-box' as const,
    outline: 'none',
  },
  label: {
    display: 'block',
    color: '#8b949e',
    marginBottom: '.3rem',
    fontSize: '.82rem',
    fontWeight: 600 as const,
  },
  btnPrimary: {
    padding: '.6rem 1.2rem',
    background: 'linear-gradient(135deg, #00d9ff, #0090ff)',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 700 as const,
    fontSize: '.85rem',
  },
  btnDanger: {
    padding: '.55rem 1rem',
    backgroundColor: '#da3633',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 600 as const,
    fontSize: '.8rem',
  },
  btnSecondary: {
    padding: '.55rem 1rem',
    backgroundColor: '#30363d',
    color: '#e6edf3',
    border: '1px solid #484f58',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 600 as const,
    fontSize: '.8rem',
  },
  tag: {
    backgroundColor: 'rgba(0,217,255,.1)',
    color: '#58a6ff',
    padding: '.15rem .5rem',
    borderRadius: '12px',
    fontSize: '.72rem',
    fontWeight: 600 as const,
  },
};

/* --- Reusable Modal --- */

function Modal({ title, children, onClose }: { title: string; children: ReactNode; onClose: () => void }) {
  return (
    <div
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{ backgroundColor: '#161d2f', borderRadius: '12px', border: '1px solid #30363d', maxWidth: '560px', width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '1.5rem 1.75rem' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
          <h3 style={{ color: '#e6edf3', margin: 0, fontSize: '1.1rem' }}>{title}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#8b949e', cursor: 'pointer', fontSize: '1.3rem', lineHeight: 1 }}>&#x2715;</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div style={{ marginBottom: '.85rem' }}>
      <label style={css.label}>{label}</label>
      {children}
    </div>
  );
}

/* --- Root Admin Page --- */

export default function AdminPage({ onLogout }: { onLogout: () => void }) {
  const [tab, setTab] = useState<'projects' | 'services' | 'contacts'>('projects');
  const navigate = useNavigate();

  const handleLogout = () => {
    adminAuth.logout();
    onLogout();
    navigate('/admin/login');
  };

  const tabs: { key: typeof tab; icon: string; label: string }[] = [
    { key: 'projects', icon: '\uD83D\uDCC1', label: 'Projects' },
    { key: 'services', icon: '\uD83D\uDEE0\uFE0F', label: 'Services' },
    { key: 'contacts', icon: '\uD83D\uDCE7', label: 'Messages' },
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0d1117', color: '#e6edf3' }}>
      {/* Header */}
      <header style={{ backgroundColor: '#161d2f', borderBottom: '1px solid #21262d', padding: '1rem 1.5rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ margin: 0, fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '.5rem' }}>
            <span style={{ background: 'linear-gradient(135deg, #00d9ff, #0090ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Admin Panel</span>
          </h1>
          <button onClick={handleLogout} style={{ ...css.btnDanger, fontSize: '.8rem', padding: '.5rem 1rem' }}>Logout</button>
        </div>
      </header>

      {/* Tabs */}
      <nav style={{ backgroundColor: '#161d2f', borderBottom: '1px solid #21262d', padding: '0 1.5rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: 0 }}>
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              style={{
                padding: '.75rem 1.25rem',
                background: 'none',
                color: tab === t.key ? '#58a6ff' : '#8b949e',
                border: 'none',
                borderBottom: tab === t.key ? '2px solid #58a6ff' : '2px solid transparent',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '.9rem',
                transition: 'all .2s',
              }}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Content */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '1.5rem' }}>
        {tab === 'projects' && <ProjectsAdmin />}
        {tab === 'services' && <ServicesAdmin />}
        {tab === 'contacts' && <ContactsAdmin />}
      </main>
    </div>
  );
}

/* ================================================================
   PROJECTS ADMIN
   ================================================================ */

function ProjectsAdmin() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/projects`);
      const json = await res.json();
      setProjects(json.data || []);
    } catch { setError('Failed to load projects'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchProjects(); }, []);

  const deleteProject = async (id: number) => {
    if (!confirm('Delete this project?')) return;
    try {
      await fetch(`${API_URL}/projects/${id}`, { method: 'DELETE' });
      setProjects(prev => prev.filter(p => p.id !== id));
    } catch { alert('Failed to delete'); }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <h2 style={{ margin: 0, fontSize: '1.1rem', color: '#e6edf3' }}>{'\uD83D\uDCC1'} Projects ({projects.length})</h2>
        <button onClick={() => setIsCreating(true)} style={css.btnPrimary}>+ New Project</button>
      </div>

      {loading && <p style={{ color: '#8b949e' }}>Loading...</p>}
      {error && <p style={{ color: '#f85149' }}>{error}</p>}
      {!loading && !projects.length && <p style={{ color: '#8b949e' }}>No projects yet. Click "New Project" to create one.</p>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(320px,1fr))', gap: '1rem' }}>
        {projects.map(p => (
          <div key={p.id} style={css.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <h4 style={{ margin: 0, color: '#e6edf3', fontSize: '.95rem' }}>{p.title}</h4>
              {p.featured && <span style={{ ...css.tag, backgroundColor: 'rgba(255,215,0,.15)', color: '#ffd700' }}>{'\u2605'} Featured</span>}
            </div>
            <p style={{ margin: 0, color: '#8b949e', fontSize: '.82rem', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{p.description}</p>
            {p.techStack && (
              <div style={{ display: 'flex', gap: '.35rem', flexWrap: 'wrap' }}>
                {p.techStack.split(',').map((t, i) => <span key={i} style={css.tag}>{t.trim()}</span>)}
              </div>
            )}
            <div style={{ display: 'flex', gap: '.5rem', marginTop: 'auto', paddingTop: '.5rem' }}>
              <button onClick={() => setEditingProject(p)} style={{ ...css.btnSecondary, flex: 1 }}>Edit</button>
              <button onClick={() => deleteProject(p.id)} style={{ ...css.btnDanger, flex: 1 }}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      {(isCreating || editingProject) && (
        <ProjectForm
          project={editingProject}
          onClose={() => { setEditingProject(null); setIsCreating(false); }}
          onSaved={() => { setEditingProject(null); setIsCreating(false); fetchProjects(); }}
        />
      )}
    </div>
  );
}

function ProjectForm({ project, onClose, onSaved }: { project: Project | null; onClose: () => void; onSaved: () => void }) {
  const isEdit = !!project;
  const [form, setForm] = useState({
    title: project?.title || '',
    description: project?.description || '',
    techStack: project?.techStack || '',
    githubUrl: project?.githubUrl || '',
    liveUrl: project?.liveUrl || '',
    imageUrl: project?.imageUrl || '',
    featured: project?.featured || false,
    sortOrder: project?.sortOrder ?? 0,
  });
  const [saving, setSaving] = useState(false);

  const set = (key: string, val: string | boolean | number) => setForm(f => ({ ...f, [key]: val }));

  const handleSave = async () => {
    if (!form.title.trim() || !form.description.trim() || !form.techStack.trim()) {
      alert('Title, Description and Tech Stack are required');
      return;
    }
    setSaving(true);
    try {
      const url = isEdit ? `${API_URL}/projects/${project!.id}` : `${API_URL}/projects`;
      const res = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title.trim(),
          description: form.description.trim(),
          techStack: form.techStack.trim(),
          githubUrl: form.githubUrl.trim() || null,
          liveUrl: form.liveUrl.trim() || null,
          imageUrl: form.imageUrl.trim() || null,
          featured: form.featured,
          sortOrder: form.sortOrder,
        }),
      });
      if (!res.ok) throw new Error('Failed');
      onSaved();
    } catch { alert('Save failed. Check backend logs.'); }
    finally { setSaving(false); }
  };

  return (
    <Modal title={isEdit ? 'Edit Project' : 'New Project'} onClose={onClose}>
      <Field label="Title *">
        <input style={css.input} value={form.title} onChange={e => set('title', e.target.value)} placeholder="Project title" />
      </Field>
      <Field label="Description *">
        <textarea style={{ ...css.input, minHeight: '80px', resize: 'vertical', fontFamily: 'inherit' }} value={form.description} onChange={e => set('description', e.target.value)} placeholder="Brief project description" />
      </Field>
      <Field label="Tech Stack * (comma-separated)">
        <input style={css.input} value={form.techStack} onChange={e => set('techStack', e.target.value)} placeholder="React, TypeScript, Spring Boot" />
      </Field>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.75rem' }}>
        <Field label="GitHub URL">
          <input style={css.input} value={form.githubUrl} onChange={e => set('githubUrl', e.target.value)} placeholder="https://github.com/..." />
        </Field>
        <Field label="Live URL">
          <input style={css.input} value={form.liveUrl} onChange={e => set('liveUrl', e.target.value)} placeholder="https://..." />
        </Field>
      </div>
      <Field label="Image URL">
        <input style={css.input} value={form.imageUrl} onChange={e => set('imageUrl', e.target.value)} placeholder="https://..." />
      </Field>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.75rem', alignItems: 'center' }}>
        <Field label="Sort Order">
          <input type="number" style={css.input} value={form.sortOrder} onChange={e => set('sortOrder', parseInt(e.target.value) || 0)} />
        </Field>
        <label style={{ display: 'flex', alignItems: 'center', gap: '.5rem', color: '#e6edf3', cursor: 'pointer', paddingTop: '1.1rem' }}>
          <input type="checkbox" checked={form.featured} onChange={e => set('featured', e.target.checked)} style={{ width: 16, height: 16, cursor: 'pointer' }} />
          Featured
        </label>
      </div>
      <div style={{ display: 'flex', gap: '.6rem', marginTop: '1rem' }}>
        <button disabled={saving} onClick={handleSave} style={{ ...css.btnPrimary, flex: 1, opacity: saving ? .6 : 1 }}>
          {saving ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Project'}
        </button>
        <button onClick={onClose} style={{ ...css.btnSecondary, flex: 1 }}>Cancel</button>
      </div>
    </Modal>
  );
}

/* ================================================================
   SERVICES ADMIN
   ================================================================ */

function ServicesAdmin() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/services/all`);
      const json = await res.json();
      setServices(json.data || []);
    } catch { setError('Failed to load services'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchServices(); }, []);

  const deleteService = async (id: number) => {
    if (!confirm('Delete this service?')) return;
    try {
      await fetch(`${API_URL}/services/${id}`, { method: 'DELETE' });
      setServices(prev => prev.filter(s => s.id !== id));
    } catch { alert('Failed to delete'); }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <h2 style={{ margin: 0, fontSize: '1.1rem', color: '#e6edf3' }}>{'\uD83D\uDEE0\uFE0F'} Services ({services.length})</h2>
        <button onClick={() => setIsCreating(true)} style={css.btnPrimary}>+ New Service</button>
      </div>

      {loading && <p style={{ color: '#8b949e' }}>Loading...</p>}
      {error && <p style={{ color: '#f85149' }}>{error}</p>}
      {!loading && !services.length && <p style={{ color: '#8b949e' }}>No services yet. Click "New Service" to create one.</p>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(320px,1fr))', gap: '1rem' }}>
        {services.map(s => (
          <div key={s.id} style={css.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <h4 style={{ margin: 0, color: '#e6edf3', fontSize: '.95rem' }}>
                {s.icon && <span style={{ marginRight: '.4rem' }}>{s.icon}</span>}
                {s.title}
              </h4>
              <span style={{ ...css.tag, backgroundColor: s.active ? 'rgba(63,185,80,.15)' : 'rgba(139,148,158,.15)', color: s.active ? '#3fb950' : '#8b949e', fontSize: '.7rem' }}>
                {s.active ? 'Active' : 'Inactive'}
              </span>
            </div>
            <p style={{ margin: 0, color: '#8b949e', fontSize: '.82rem', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{s.description}</p>
            {s.priceRange && <p style={{ margin: 0, color: '#58a6ff', fontSize: '.82rem', fontWeight: 600 }}>{s.priceRange}</p>}
            <div style={{ display: 'flex', gap: '.5rem', marginTop: 'auto', paddingTop: '.5rem' }}>
              <button onClick={() => setEditingService(s)} style={{ ...css.btnSecondary, flex: 1 }}>Edit</button>
              <button onClick={() => deleteService(s.id)} style={{ ...css.btnDanger, flex: 1 }}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      {(isCreating || editingService) && (
        <ServiceForm
          service={editingService}
          onClose={() => { setEditingService(null); setIsCreating(false); }}
          onSaved={() => { setEditingService(null); setIsCreating(false); fetchServices(); }}
        />
      )}
    </div>
  );
}

function ServiceForm({ service, onClose, onSaved }: { service: Service | null; onClose: () => void; onSaved: () => void }) {
  const isEdit = !!service;
  const [form, setForm] = useState({
    title: service?.title || '',
    description: service?.description || '',
    icon: service?.icon || '',
    priceRange: service?.priceRange || '',
    techStack: service?.techStack || '',
    githubUrl: service?.githubUrl || '',
    liveUrl: service?.liveUrl || '',
    sortOrder: service?.sortOrder ?? 0,
    active: service?.active ?? true,
  });
  const [saving, setSaving] = useState(false);

  const set = (key: string, val: string | boolean | number) => setForm(f => ({ ...f, [key]: val }));

  const handleSave = async () => {
    if (!form.title.trim() || !form.description.trim()) {
      alert('Title and Description are required');
      return;
    }
    setSaving(true);
    try {
      const url = isEdit ? `${API_URL}/services/${service!.id}` : `${API_URL}/services`;
      const res = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title.trim(),
          description: form.description.trim(),
          icon: form.icon.trim() || null,
          priceRange: form.priceRange.trim() || null,
          techStack: form.techStack.trim() || null,
          githubUrl: form.githubUrl.trim() || null,
          liveUrl: form.liveUrl.trim() || null,
          sortOrder: form.sortOrder,
          active: form.active,
        }),
      });
      if (!res.ok) throw new Error('Failed');
      onSaved();
    } catch { alert('Save failed. Check backend logs.'); }
    finally { setSaving(false); }
  };

  return (
    <Modal title={isEdit ? 'Edit Service' : 'New Service'} onClose={onClose}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '.75rem' }}>
        <Field label="Title *">
          <input style={css.input} value={form.title} onChange={e => set('title', e.target.value)} placeholder="Service title" />
        </Field>
        <Field label="Icon">
          <input style={{ ...css.input, width: '60px', textAlign: 'center', fontSize: '1.2rem' }} value={form.icon} onChange={e => set('icon', e.target.value)} placeholder={'\uD83C\uDFE2'} />
        </Field>
      </div>
      <Field label="Description *">
        <textarea style={{ ...css.input, minHeight: '80px', resize: 'vertical', fontFamily: 'inherit' }} value={form.description} onChange={e => set('description', e.target.value)} placeholder="Service description" />
      </Field>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.75rem' }}>
        <Field label="Price Range">
          <input style={css.input} value={form.priceRange} onChange={e => set('priceRange', e.target.value)} placeholder="$500 - $2,500" />
        </Field>
        <Field label="Sort Order">
          <input type="number" style={css.input} value={form.sortOrder} onChange={e => set('sortOrder', parseInt(e.target.value) || 0)} />
        </Field>
      </div>
      <Field label="Tech Stack (comma-separated)">
        <input style={css.input} value={form.techStack} onChange={e => set('techStack', e.target.value)} placeholder="React, Node.js, PostgreSQL" />
      </Field>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.75rem' }}>
        <Field label="GitHub URL">
          <input style={css.input} value={form.githubUrl} onChange={e => set('githubUrl', e.target.value)} placeholder="https://github.com/..." />
        </Field>
        <Field label="Live URL">
          <input style={css.input} value={form.liveUrl} onChange={e => set('liveUrl', e.target.value)} placeholder="https://..." />
        </Field>
      </div>
      <label style={{ display: 'flex', alignItems: 'center', gap: '.5rem', color: '#e6edf3', cursor: 'pointer', margin: '.5rem 0' }}>
        <input type="checkbox" checked={form.active} onChange={e => set('active', e.target.checked)} style={{ width: 16, height: 16, cursor: 'pointer' }} />
        Active (visible to users)
      </label>
      <div style={{ display: 'flex', gap: '.6rem', marginTop: '1rem' }}>
        <button disabled={saving} onClick={handleSave} style={{ ...css.btnPrimary, flex: 1, opacity: saving ? .6 : 1 }}>
          {saving ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Service'}
        </button>
        <button onClick={onClose} style={{ ...css.btnSecondary, flex: 1 }}>Cancel</button>
      </div>
    </Modal>
  );
}

/* ================================================================
   CONTACTS ADMIN
   ================================================================ */

function ContactsAdmin() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/contact`);
      const json = await res.json();
      const list: Contact[] = json.data || [];
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setContacts(list);
    } catch { setError('Failed to load messages'); }
    finally { setLoading(false); }
  };

  const fetchUnreadCount = async () => {
    try {
      const res = await fetch(`${API_URL}/contact/unread-count`);
      const json = await res.json();
      setUnreadCount(json.data?.count ?? json.data ?? 0);
    } catch { /* ignore */ }
  };

  useEffect(() => { fetchContacts(); fetchUnreadCount(); }, []);

  const markAsRead = async (id: number) => {
    try {
      await fetch(`${API_URL}/contact/${id}/read`, { method: 'PUT' });
      setContacts(prev => prev.map(c => c.id === id ? { ...c, readStatus: true } : c));
      setUnreadCount(n => Math.max(0, n - 1));
    } catch { alert('Failed to update'); }
  };

  const deleteContact = async (id: number) => {
    if (!confirm('Delete this message?')) return;
    try {
      await fetch(`${API_URL}/contact/${id}`, { method: 'DELETE' });
      const removed = contacts.find(c => c.id === id);
      setContacts(prev => prev.filter(c => c.id !== id));
      if (removed && !removed.readStatus) setUnreadCount(n => Math.max(0, n - 1));
    } catch { alert('Failed to delete'); }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '.75rem' }}>
        <h2 style={{ margin: 0, fontSize: '1.1rem', color: '#e6edf3' }}>{'\uD83D\uDCE7'} Messages ({contacts.length})</h2>
        {unreadCount > 0 && (
          <span style={{ backgroundColor: '#da3633', color: '#fff', padding: '.3rem .75rem', borderRadius: '12px', fontSize: '.8rem', fontWeight: 700 }}>
            {unreadCount} unread
          </span>
        )}
      </div>

      {loading && <p style={{ color: '#8b949e' }}>Loading...</p>}
      {error && <p style={{ color: '#f85149' }}>{error}</p>}
      {!loading && !contacts.length && <p style={{ color: '#8b949e' }}>No messages yet.</p>}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '.75rem' }}>
        {contacts.map(c => (
          <div
            key={c.id}
            style={{
              ...css.card,
              flexDirection: 'row' as const,
              alignItems: 'start',
              gap: '1rem',
              borderLeft: `3px solid ${c.readStatus ? '#30363d' : '#58a6ff'}`,
              opacity: c.readStatus ? .8 : 1,
            }}
          >
            {!c.readStatus && <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#58a6ff', marginTop: '.4rem', flexShrink: 0 }} />}

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: '.5rem', marginBottom: '.35rem' }}>
                <div>
                  <span style={{ color: '#e6edf3', fontWeight: 600, fontSize: '.9rem' }}>{c.name}</span>
                  <span style={{ color: '#8b949e', fontSize: '.8rem', marginLeft: '.5rem' }}>{c.email}</span>
                  {c.phone && <span style={{ color: '#8b949e', fontSize: '.8rem', marginLeft: '.5rem' }}>{c.phone}</span>}
                </div>
                <span style={{ color: '#484f58', fontSize: '.75rem', whiteSpace: 'nowrap' }}>
                  {new Date(c.createdAt).toLocaleDateString()} {new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              {c.subject && <p style={{ margin: '0 0 .3rem', color: '#58a6ff', fontSize: '.85rem', fontWeight: 600 }}>{c.subject}</p>}
              <p style={{ margin: 0, color: '#8b949e', fontSize: '.85rem', lineHeight: 1.55, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{c.message}</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '.4rem', flexShrink: 0 }}>
              {!c.readStatus && (
                <button onClick={() => markAsRead(c.id)} style={{ ...css.btnSecondary, fontSize: '.75rem', padding: '.4rem .6rem' }}>{'\u2713'} Read</button>
              )}
              <button onClick={() => deleteContact(c.id)} style={{ ...css.btnDanger, fontSize: '.75rem', padding: '.4rem .6rem' }}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
