import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { projectApi, serviceApi, contactApi } from '../services/api';
import AdminLogin from '../components/common/AdminLogin';
import { adminAuth } from '../utils/auth';
import type { Project, Service, Contact, ProjectDTO, ServiceDTO } from '../types';
import { Spinner, ErrorMessage, EmptyState } from '../components/common/UIHelpers';
import styles from './AdminPage.module.css';

type Tab = 'projects' | 'services' | 'contacts';

/* ── helpers ── */
const emptyProject: ProjectDTO = { title: '', description: '', techStack: '', githubUrl: '', liveUrl: '', imageUrl: '', featured: false, sortOrder: 0 };
const emptyService: ServiceDTO = { title: '', description: '', icon: '', priceRange: '', sortOrder: 0, active: true };

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>('projects');
  const [isAuthenticated, setIsAuthenticated] = useState(adminAuth.isAuthenticated());

  useEffect(() => {
    setIsAuthenticated(adminAuth.isAuthenticated());
  }, []);

  const handleLogout = () => {
    adminAuth.logout();
    setIsAuthenticated(false);
    toast.success('Logged out successfully!');
  };

  if (!isAuthenticated) {
    return <AdminLogin onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1>Admin Panel</h1>
          <p>Manage your portfolio content</p>
        </div>
        <button 
          onClick={handleLogout}
          style={{
            padding: '0.6rem 1.2rem',
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid #ef4444',
            color: '#ef4444',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '0.9rem',
            fontWeight: '500'
          }}
        >
          🚪 Logout
        </button>
      </div>

      <div className={styles.tabs}>
        {(['projects', 'services', 'contacts'] as Tab[]).map(t => (
          <button key={t} className={`${styles.tab} ${tab === t ? styles.active : ''}`} onClick={() => setTab(t)}>
            {t === 'projects' ? '💻 Projects' : t === 'services' ? '⚡ Services' : '📬 Messages'}
          </button>
        ))}
      </div>

      <div className={styles.body}>
        {tab === 'projects'  && <ProjectsAdmin />}
        {tab === 'services'  && <ServicesAdmin />}
        {tab === 'contacts'  && <ContactsAdmin />}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════
   PROJECTS ADMIN
════════════════════════════════════════ */
function ProjectsAdmin() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');
  const [form, setForm]         = useState<ProjectDTO>(emptyProject);
  const [editing, setEditing]   = useState<number | null>(null);
  const [saving, setSaving]     = useState(false);
  const [showForm, setShowForm] = useState(false);

  const load = () => {
    setLoading(true);
    projectApi.getAll()
      .then(r => setProjects(r.data))
      .catch(() => setError('Failed to load projects.'))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const openNew = () => { setForm(emptyProject); setEditing(null); setShowForm(true); };
  const openEdit = (p: Project) => {
    setForm({ title: p.title, description: p.description, techStack: p.techStack, githubUrl: p.githubUrl ?? '', liveUrl: p.liveUrl ?? '', imageUrl: p.imageUrl ?? '', featured: p.featured, sortOrder: p.sortOrder });
    setEditing(p.id);
    setShowForm(true);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.techStack) { toast.error('Title, description and tech stack are required.'); return; }
    setSaving(true);
    try {
      if (editing) {
        await projectApi.update(editing, form);
        toast.success('Project updated!');
      } else {
        await projectApi.create(form);
        toast.success('Project created!');
      }
      setShowForm(false); load();
    } catch { toast.error('Save failed.'); }
    finally { setSaving(false); }
  };

  const del = async (id: number) => {
    if (!confirm('Delete this project?')) return;
    try { await projectApi.delete(id); toast.success('Deleted.'); load(); }
    catch { toast.error('Delete failed.'); }
  };

  return (
    <div>
      <div className={styles.panelHeader}>
        <h2>Projects</h2>
        <button className="btn-primary" onClick={openNew}>+ Add Project</button>
      </div>

      {showForm && (
        <form className={styles.form} onSubmit={save}>
          <h3>{editing ? 'Edit Project' : 'New Project'}</h3>
          <div className={styles.formRow}>
            <div className="form-group"><label>Title *</label><input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} /></div>
            <div className="form-group"><label>Tech Stack * (comma-separated)</label><input value={form.techStack} onChange={e => setForm(f => ({ ...f, techStack: e.target.value }))} placeholder="React, Spring Boot, MySQL" /></div>
          </div>
          <div className="form-group"><label>Description *</label><textarea rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} /></div>
          <div className={styles.formRow}>
            <div className="form-group"><label>GitHub URL</label><input value={form.githubUrl ?? ''} onChange={e => setForm(f => ({ ...f, githubUrl: e.target.value }))} /></div>
            <div className="form-group"><label>Live URL</label><input value={form.liveUrl ?? ''} onChange={e => setForm(f => ({ ...f, liveUrl: e.target.value }))} /></div>
          </div>
          <div className={styles.formRow}>
            <div className="form-group">
              <label>Image URL</label>
              <input 
                value={form.imageUrl ?? ''} 
                onChange={e => setForm(f => ({ ...f, imageUrl: e.target.value }))} 
              />
              {form.imageUrl && (
                <div style={{ marginTop: '0.8rem' }}>
                  <small style={{ color: '#94a3b8' }}>Preview:</small>
                  <img 
                    src={form.imageUrl} 
                    alt="preview" 
                    style={{
                      marginTop: '0.5rem',
                      maxWidth: '100%',
                      maxHeight: '150px',
                      borderRadius: '8px',
                      border: '1.5px solid rgba(0, 217, 255, 0.1)',
                      objectFit: 'cover'
                    }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>
            <div className="form-group"><label>Sort Order</label><input type="number" value={form.sortOrder} onChange={e => setForm(f => ({ ...f, sortOrder: +e.target.value }))} /></div>
          </div>
          <div className="form-checkbox form-group">
            <input type="checkbox" id="feat" checked={form.featured} onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))} />
            <label htmlFor="feat" style={{ textTransform: 'none', fontSize: '0.9rem' }}>Mark as Featured</label>
          </div>
          <div className={styles.formActions}>
            <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save Project'}</button>
            <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </form>
      )}

      {loading && <Spinner />}
      {error   && <ErrorMessage message={error} />}
      {!loading && !error && projects.length === 0 && <EmptyState message="No projects yet." />}
      {!loading && !error && (
        <div className={styles.table}>
          <table>
            <thead><tr><th>Image</th><th>Title</th><th>Tech Stack</th><th>Featured</th><th>Order</th><th>Actions</th></tr></thead>
            <tbody>
              {projects.map(p => (
                <tr key={p.id}>
                  <td>
                    <div className={`${styles.imageThumb} ${!p.imageUrl ? styles.placeholder : ''}`}>
                      {p.imageUrl ? (
                        <img src={p.imageUrl} alt={p.title} />
                      ) : (
                        '📸'
                      )}
                    </div>
                  </td>
                  <td><strong>{p.title}</strong></td>
                  <td className={styles.techCell}>{p.techStack}</td>
                  <td>{p.featured ? '⭐ Yes' : '—'}</td>
                  <td>{p.sortOrder}</td>
                  <td>
                    <div className={styles.actions}>
                      <button className="btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} onClick={() => openEdit(p)}>✏️ Edit</button>
                      <button className="btn-danger" onClick={() => del(p.id)}>🗑 Delete</button>
                    </div>
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

/* ════════════════════════════════════════
   SERVICES ADMIN
════════════════════════════════════════ */
function ServicesAdmin() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');
  const [form, setForm]         = useState<ServiceDTO>(emptyService);
  const [editing, setEditing]   = useState<number | null>(null);
  const [saving, setSaving]     = useState(false);
  const [showForm, setShowForm] = useState(false);

  const load = () => {
    setLoading(true);
    serviceApi.getAll()
      .then(r => setServices(r.data))
      .catch(() => setError('Failed to load services.'))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const openNew  = () => { setForm(emptyService); setEditing(null); setShowForm(true); };
  const openEdit = (s: Service) => {
    setForm({ title: s.title, description: s.description, icon: s.icon ?? '', priceRange: s.priceRange ?? '', sortOrder: s.sortOrder, active: s.active });
    setEditing(s.id); setShowForm(true);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.description) { toast.error('Title and description required.'); return; }
    setSaving(true);
    try {
      if (editing) { await serviceApi.update(editing, form); toast.success('Service updated!'); }
      else         { await serviceApi.create(form);          toast.success('Service created!'); }
      setShowForm(false); load();
    } catch { toast.error('Save failed.'); }
    finally { setSaving(false); }
  };

  const del = async (id: number) => {
    if (!confirm('Delete this service?')) return;
    try { await serviceApi.delete(id); toast.success('Deleted.'); load(); }
    catch { toast.error('Delete failed.'); }
  };

  return (
    <div>
      <div className={styles.panelHeader}>
        <h2>Services</h2>
        <button className="btn-primary" onClick={openNew}>+ Add Service</button>
      </div>

      {showForm && (
        <form className={styles.form} onSubmit={save}>
          <h3>{editing ? 'Edit Service' : 'New Service'}</h3>
          <div className={styles.formRow}>
            <div className="form-group"><label>Title *</label><input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} /></div>
            <div className="form-group"><label>Icon (emoji)</label><input value={form.icon ?? ''} onChange={e => setForm(f => ({ ...f, icon: e.target.value }))} placeholder="🌐" /></div>
          </div>
          <div className="form-group"><label>Description *</label><textarea rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} /></div>
          <div className={styles.formRow}>
            <div className="form-group"><label>Price Range</label><input value={form.priceRange ?? ''} onChange={e => setForm(f => ({ ...f, priceRange: e.target.value }))} placeholder="₹5,000 – ₹25,000" /></div>
            <div className="form-group"><label>Sort Order</label><input type="number" value={form.sortOrder} onChange={e => setForm(f => ({ ...f, sortOrder: +e.target.value }))} /></div>
          </div>
          <div className="form-checkbox form-group">
            <input type="checkbox" id="active" checked={form.active} onChange={e => setForm(f => ({ ...f, active: e.target.checked }))} />
            <label htmlFor="active" style={{ textTransform: 'none', fontSize: '0.9rem' }}>Active (visible on website)</label>
          </div>
          <div className={styles.formActions}>
            <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save Service'}</button>
            <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </form>
      )}

      {loading && <Spinner />}
      {error   && <ErrorMessage message={error} />}
      {!loading && !error && services.length === 0 && <EmptyState message="No services yet." />}
      {!loading && !error && (
        <div className={styles.table}>
          <table>
            <thead><tr><th>Icon</th><th>Title</th><th>Price Range</th><th>Active</th><th>Actions</th></tr></thead>
            <tbody>
              {services.map(s => (
                <tr key={s.id}>
                  <td style={{ fontSize: '1.4rem' }}>{s.icon}</td>
                  <td><strong>{s.title}</strong></td>
                  <td>{s.priceRange ?? '—'}</td>
                  <td>{s.active ? '✅ Yes' : '❌ No'}</td>
                  <td>
                    <div className={styles.actions}>
                      <button className="btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} onClick={() => openEdit(s)}>✏️ Edit</button>
                      <button className="btn-danger" onClick={() => del(s.id)}>🗑 Delete</button>
                    </div>
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

/* ════════════════════════════════════════
   CONTACTS ADMIN
════════════════════════════════════════ */
function ContactsAdmin() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');
  const [filter, setFilter]     = useState<'all' | 'unread'>('all');
  const [expanded, setExpanded] = useState<number | null>(null);

  const load = () => {
    setLoading(true);
    contactApi.getAll()
      .then(r => setContacts(r.data))
      .catch(() => setError('Failed to load messages.'))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const markRead = async (id: number) => {
    try { await contactApi.markAsRead(id); toast.success('Marked as read.'); load(); }
    catch { toast.error('Failed.'); }
  };

  const del = async (id: number) => {
    if (!confirm('Delete this message?')) return;
    try { await contactApi.delete(id); toast.success('Deleted.'); load(); }
    catch { toast.error('Delete failed.'); }
  };

  const displayed = filter === 'unread' ? contacts.filter(c => !c.readStatus) : contacts;
  const unreadCount = contacts.filter(c => !c.readStatus).length;

  return (
    <div>
      <div className={styles.panelHeader}>
        <h2>Messages {unreadCount > 0 && <span className={styles.badge}>{unreadCount} new</span>}</h2>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className={`${styles.tab} ${filter === 'all' ? styles.active : ''}`} onClick={() => setFilter('all')}>All ({contacts.length})</button>
          <button className={`${styles.tab} ${filter === 'unread' ? styles.active : ''}`} onClick={() => setFilter('unread')}>Unread ({unreadCount})</button>
        </div>
      </div>

      {loading && <Spinner />}
      {error   && <ErrorMessage message={error} />}
      {!loading && !error && displayed.length === 0 && <EmptyState message="No messages found." />}
      {!loading && !error && displayed.length > 0 && (
        <div className={styles.messages}>
          {displayed.map(c => (
            <div key={c.id} className={`${styles.msg} ${!c.readStatus ? styles.unread : ''}`}>
              <div className={styles.msgHeader} onClick={() => setExpanded(expanded === c.id ? null : c.id)}>
                <div className={styles.msgMeta}>
                  {!c.readStatus && <span className={styles.dot} />}
                  <strong>{c.name}</strong>
                  <span className={styles.email}>{c.email}</span>
                  <span className={styles.subject}>{c.subject}</span>
                </div>
                <div className={styles.msgRight}>
                  <span className={styles.time}>{new Date(c.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                  <span>{expanded === c.id ? '▲' : '▼'}</span>
                </div>
              </div>
              {expanded === c.id && (
                <div className={styles.msgBody}>
                  <p>{c.message}</p>
                  <div className={styles.msgActions}>
                    <a href={`mailto:${c.email}`} className="btn-secondary" style={{ padding: '0.4rem 0.9rem', fontSize: '0.82rem' }}>📧 Reply</a>
                    {!c.readStatus && (
                      <button className="btn-secondary" style={{ padding: '0.4rem 0.9rem', fontSize: '0.82rem' }} onClick={() => markRead(c.id)}>✅ Mark Read</button>
                    )}
                    <button className="btn-danger" onClick={() => del(c.id)}>🗑 Delete</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
