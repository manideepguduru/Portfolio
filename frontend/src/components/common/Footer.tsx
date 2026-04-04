import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.top}>
          <div className={styles.brand}>
            <span className={styles.logo}>GM<span>.</span>dev</span>
            <p>Digital Specialist Engineer & Web Developer. Building websites for businesses and final year students.</p>
            <div className={styles.socials}>
              <a href="https://www.instagram.com/antha_manadey/" target="_blank" rel="noopener" aria-label="Instagram" title="Instagram">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <circle cx="17.5" cy="6.5" r="1.5"></circle>
                </svg>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener" aria-label="LinkedIn" title="LinkedIn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.475-2.236-1.986-2.236-1.081 0-1.722.722-2.004 1.418-.103.249-.129.597-.129.946v5.441h-3.586s.047-8.842 0-9.769h3.586v1.381c.43-.664 1.195-1.608 2.905-1.608 2.121 0 3.71 1.385 3.71 4.36v5.636zM5.337 9.433c-1.144 0-1.915-.758-1.915-1.704 0-.951.77-1.703 1.96-1.703 1.188 0 1.913.752 1.932 1.703 0 .946-.744 1.704-1.977 1.704zm1.581 11.019H3.819V9.683h3.099v10.769zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z"/>
                </svg>
              </a>
              <a href="https://github.com" target="_blank" rel="noopener" aria-label="GitHub" title="GitHub">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.007 12.007 0 0024 12c0-6.63-5.37-12-12-12z"/>
                </svg>
              </a>
              <a href="mailto:softwarekattubanisa@gmail.com" aria-label="Email" title="Email">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                  <path d="m22 7-10 5L2 7"></path>
                </svg>
              </a>
            </div>
          </div>

          <div className={styles.col}>
            <h4>Navigation</h4>
            <Link to="/">Home</Link>
            <Link to="/projects">Projects</Link>
            <Link to="/services">Services</Link>
            <Link to="/contact">Contact</Link>
          </div>

          <div className={styles.col}>
            <h4>Services</h4>
            <Link to="/services">Business Websites</Link>
            <Link to="/services">Final Year Projects</Link>
            <Link to="/services">Landing Pages</Link>
            <Link to="/services">Resume Review</Link>
          </div>

          <div className={styles.col}>
            <h4>Contact</h4>
            <a href="mailto:softwarekattubanisa@gmail.com">softwarekattubanisa@gmail.com</a>
            <a href="https://wa.me/919346929001" target="_blank" rel="noopener" title="WhatsApp">
              WhatsApp Me
            </a>
            <span>Bangalore, Karnataka</span>
          </div>
        </div>

        <div className={styles.bottom}>
          <p>© {new Date().getFullYear()} Guduru Manideep. Built with ☕ and clean code.</p>
        </div>
      </div>
    </footer>
  );
}
