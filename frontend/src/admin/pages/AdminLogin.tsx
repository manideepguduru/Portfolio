import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAuth } from '../utils/auth';

export default function AdminLogin({ onLoginSuccess }: { onLoginSuccess: () => void }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Simple password verification (no backend API call needed for demo)
      const correctPassword = 'Infosys@19';
      
      if (password !== correctPassword) {
        throw new Error('Invalid password');
      }

      // Set auth token in localStorage
      adminAuth.setToken('admin-token-' + Date.now(), 86400000); // 24 hour expiry
      onLoginSuccess();
      navigate('/admin');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0f1419' }}>
      <div style={{ maxWidth: '400px', width: '100%', padding: '2rem', backgroundColor: '#1a1f2e', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '2rem', color: '#00d9ff' }}>Admin Login</h1>
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#cbd5e1' }}>Password</label>
            <input
              type="password"
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ 
                width: '100%', 
                padding: '0.8rem', 
                border: '1px solid #00d9ff',
                borderRadius: '4px',
                backgroundColor: '#0f1419',
                color: '#00d9ff',
                fontSize: '1rem',
                boxSizing: 'border-box'
              }}
            />
          </div>
          {error && <p style={{ color: '#ff6b6b', marginBottom: '1rem', textAlign: 'center' }}>{error}</p>}
          <button 
            type="submit" 
            disabled={loading} 
            style={{ 
              width: '100%', 
              padding: '0.8rem',
              backgroundColor: '#00d9ff',
              color: '#0f1419',
              border: 'none',
              borderRadius: '4px',
              fontWeight: 'bold',
              cursor: 'pointer',
              opacity: loading ? 0.6 : 1
            }}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '2rem', color: '#78849c', fontSize: '0.85rem' }}>
          Demo credentials are displayed in the README
        </p>
      </div>
    </div>
  );
}

