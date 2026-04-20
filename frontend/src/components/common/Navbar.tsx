import { useEffect, useRef, useState } from 'react';
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
  const navRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    const closeOnOutsideTap = (event: MouseEvent | TouchEvent) => {
      if (!menuOpen) return;
      const target = event.target as Node;
      if (navRef.current && !navRef.current.contains(target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', closeOnOutsideTap);
    document.addEventListener('touchstart', closeOnOutsideTap);

    return () => {
      document.removeEventListener('mousedown', closeOnOutsideTap);
      document.removeEventListener('touchstart', closeOnOutsideTap);
    };
  }, [menuOpen]);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const isLinkActive = (link: typeof links[0]): boolean => {
    if (link.to === '/') return location.pathname === '/';
    return location.pathname === link.to;
  };

  return (
    <nav ref={navRef} className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
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
        <Link to="/contact" className={`${styles.hireBtn} btn-primary`}>
          Hire Me
        </Link>
        <button
          className={`${styles.hamburger} ${menuOpen ? styles.hamburgerOpen : ''}`}
          onClick={() => setMenuOpen(p => !p)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <>
          <button
            className={styles.mobileBackdrop}
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
          />
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
            <Link to="/contact" className={`${styles.mobileHireBtn} btn-primary`} onClick={() => setMenuOpen(false)}>
              Hire Me
            </Link>
          </div>
        </>
      )}
    </nav>
  );
}
