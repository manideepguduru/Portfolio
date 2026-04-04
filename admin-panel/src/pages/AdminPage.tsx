import { useState } from 'react';
import { adminAuth } from '../utils/auth';

export default function AdminPage({ onLogout }: { onLogout: () => void }) {
  const [tab, setTab] = useState<'projects' | 'services' | 'contacts'>('projects');

  const handleLogout = () => {
    adminAuth.logout();
    onLogout();
  };

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Admin Panel</h1>
        <button onClick={handleLogout}>Logout</button>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <button onClick={() => setTab('projects')} style={{ padding: '0.5rem 1rem' }}>
          Projects
        </button>
        <button onClick={() => setTab('services')} style={{ padding: '0.5rem 1rem' }}>
          Services
        </button>
        <button onClick={() => setTab('contacts')} style={{ padding: '0.5rem 1rem' }}>
          Contacts
        </button>
      </div>

      {tab === 'projects' && <ProjectsAdmin />}
      {tab === 'services' && <ServicesAdmin />}
      {tab === 'contacts' && <ContactsAdmin />}
    </div>
  );
}

function ProjectsAdmin() {
  return (
    <div>
      <h2>Manage Projects</h2>
      <p>Projects management interface coming soon...</p>
    </div>
  );
}

function ServicesAdmin() {
  return (
    <div>
      <h2>Manage Services</h2>
      <p>Services management interface coming soon...</p>
    </div>
  );
}

function ContactsAdmin() {
  return (
    <div>
      <h2>Contact Submissions</h2>
      <p>Contacts management interface coming soon...</p>
    </div>
  );
}
