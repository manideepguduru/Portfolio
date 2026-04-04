import { useState } from 'react';
import { adminAuth } from '../../utils/auth';
import styles from './AdminLogin.module.css';

interface AdminLoginProps {
  onLoginSuccess: () => void;
}

export default function AdminLogin({ onLoginSuccess }: AdminLoginProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulate a small delay
    await new Promise(resolve => setTimeout(resolve, 300));

    if (adminAuth.login(password)) {
      onLoginSuccess();
    } else {
      setError('Invalid password. Please try again.');
      setPassword('');
    }

    setLoading(false);
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.content}>
          <h2>Admin Login</h2>
          <p>Enter your password to access the admin panel.</p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                disabled={loading}
                autoFocus
              />
              {error && <span className="form-error">{error}</span>}
            </div>

            <button
              type="submit"
              className="btn-primary"
              disabled={loading || !password.trim()}
              style={{ width: '100%', justifyContent: 'center' }}
            >
              {loading ? '⏳ Verifying...' : '🔐 Login'}
            </button>
          </form>

          <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '1rem', textAlign: 'center' }}>
            💡 Contact the admin for credentials
          </p>
        </div>
      </div>
    </div>
  );
}
