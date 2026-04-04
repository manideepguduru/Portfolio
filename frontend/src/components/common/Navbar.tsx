import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useActiveSection } from '../../hooks/useActiveSection';
import styles from './Navbar.module.css';

const links = [
  { to: '/', label: 'Home', section: 'hero' },
  { to: '/#services', label: 'Services', section: 'services' },
  { to: '/#projects', label: 'Projects', section: 'projects' },
  { to: '/contact', label: 'Contact', section: '' },
];

export default function Navbar() {
  const [scrolled, setScrolled]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const activeSection = useActiveSection();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  // Check if link is active - either by route or by visible section on homepage
  const isLinkActive = (link: typeof links[0]): boolean => {
    // If on homepage and link has a section, check if section is visible
    if (location.pathname === '/' && link.section) {
      return activeSection === link.section;
    }
    // Special case: Home link with no other section visible (at top of page)
    if (link.to === '/' && location.pathname === '/' && !activeSection) {
      return true;
    }
    // Otherwise use standard route matching for Contact page
    return location.pathname === link.to && location.pathname !== '/';
  };

  // Handle smooth scroll to section on homepage
  const handleSectionClick = (e: React.MouseEvent, link: typeof links[0]) => {
    if (location.pathname === '/' && link.section) {
      e.preventDefault();
      const section = document.getElementById(link.section);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
        setMenuOpen(false);
      }
    }
  };

  return (
    <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
      <Link to="/" className={styles.logo}>
        GM<span>.</span>dev
      </Link>

      {/* Desktop links */}
      <ul className={styles.links}>
        {links.map(l => (
          <li key={l.to + l.section}>
            {l.to !== '/contact' ? (
              <a
                href={l.to}
                onClick={(e) => handleSectionClick(e, l)}
                className={isLinkActive(l) ? `${styles.link} ${styles.active}` : styles.link}
              >
                {l.label}
              </a>
            ) : (
              <a
                href={l.to}
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/contact');
                  setMenuOpen(false);
                }}
                className={isLinkActive(l) ? `${styles.link} ${styles.active}` : styles.link}
              >
                {l.label}
              </a>
            )}
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
            <div key={l.to + l.section}>
              {l.to !== '/contact' ? (
                <a
                  href={l.to}
                  onClick={(e) => handleSectionClick(e, l)}
                  className={isLinkActive(l) ? `${styles.mobileLink} ${styles.active}` : styles.mobileLink}
                >
                  {l.label}
                </a>
              ) : (
                <a
                  href={l.to}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/contact');
                    setMenuOpen(false);
                  }}
                  className={isLinkActive(l) ? `${styles.mobileLink} ${styles.active}` : styles.mobileLink}
                >
                  {l.label}
                </a>
              )}
            </div>
          ))}
          <Link to="/contact" className="btn-primary" style={{ marginTop: '0.5rem' }} onClick={() => setMenuOpen(false)}>
            Hire Me
          </Link>
        </div>
      )}
    </nav>
  );
}
