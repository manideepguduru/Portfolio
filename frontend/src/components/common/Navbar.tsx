import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './Navbar.module.css';

const links = [
  { to: '/', label: 'Home' },
  { to: '/services', label: 'Services' },
  { to: '/projects', label: 'Projects' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const isLinkActive = (link: typeof links[0]): boolean => {
    if (link.to === '/') return location.pathname === '/';
    return location.pathname === link.to;
  };

  return (
    <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
      <Link to="/" className={styles.logo}>
        GM<span>.</span>dev
      </Link>

      {/* Desktop links */}
      <ul className={styles.links}>
        {links.map(l => (
          <li key={l.to}>
            <Link
              to={l.to}
              className={isLinkActive(l) ? `${styles.link} ${styles.active}` : styles.link}
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>

      <div className={styles.right}>
        <Link to="/contact" className="btn-primary" style={{ padding: '0.5rem 1.2rem', fontSize: '0.85rem' }}>
          Hire Me
        </Link>
        <button
          className={styles.hamburger}
          onClick={() => setMenuOpen(p => !p)}
          aria-label="Toggle menu"
        >
          <span className={menuOpen ? styles.open : ''} />
          <span className={menuOpen ? styles.open : ''} />
          <span className={menuOpen ? styles.open : ''} />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className={styles.mobile}>
          {links.map(l => (
            <Link
              key={l.to}
              to={l.to}
              className={isLinkActive(l) ? `${styles.mobileLink} ${styles.active}` : styles.mobileLink}
              onClick={() => setMenuOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          <Link to="/contact" className="btn-primary" style={{ marginTop: '0.5rem' }} onClick={() => setMenuOpen(false)}>
            Hire Me
          </Link>
        </div>
      )}
    </nav>
  );
}
