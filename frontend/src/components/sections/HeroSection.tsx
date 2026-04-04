import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import styles from './HeroSection.module.css';

const phrases = [
  'I build websites for businesses',
  'I build final year projects',
  'I craft landing pages',
  'I automate workflows',
];

export default function HeroSection() {
  const typedRef = useRef<HTMLSpanElement>(null);

  // Typewriter effect
  useEffect(() => {
    let pi = 0, ci = 0, deleting = false;
    let timer: ReturnType<typeof setTimeout>;

    function tick() {
      const el = typedRef.current;
      if (!el) return;
      const phrase = phrases[pi];
      if (!deleting) {
        ci++;
        el.textContent = phrase.slice(0, ci);
        if (ci === phrase.length) { deleting = true; timer = setTimeout(tick, 1800); return; }
      } else {
        ci--;
        el.textContent = phrase.slice(0, ci);
        if (ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; }
      }
      timer = setTimeout(tick, deleting ? 48 : 88);
    }
    timer = setTimeout(tick, 600);
    return () => clearTimeout(timer);
  }, []);

  const handleWhatsAppClick = () => {
    const message = `Hi! I'm interested in learning more about your services. I'm particularly interested in what you offer.`;
    const event = new CustomEvent('whatsapp-message-update', { 
      detail: { message } 
    });
    window.dispatchEvent(event);
  };

  return (
    <section className={styles.hero} id="hero">
      <div className={styles.mesh} />
      <div className={styles.content}>
        <div className={styles.badge}>🚀 Available for Projects</div>

        <h1>
          <span className={styles.typed}>
            <span ref={typedRef} />
            <span className={styles.cursor} />
          </span>
          <span className={styles.highlight}>&amp; grow your career.</span>
        </h1>

        <p className={styles.sub}>
          Digital Specialist Engineer at Infosys — I help <strong>businesses</strong> get online
          and <strong>final year students</strong> build submission-ready projects with full
          source code, documentation, and live demos.
        </p>

        <div className={styles.proof}>
          <div className={styles.pill}>📸 <strong>17.1K+</strong> Instagram Followers</div>
          <div className={styles.pill}>👁 <strong>745K+</strong> Monthly Views</div>
        </div>

        <div className={styles.btns}>
          <a 
            href="https://wa.me/919346929001?text=Hi! I'm interested in learning more about your services. I'm particularly interested in what you offer."
            target="_blank" 
            rel="noopener" 
            className="btn-primary"
            onClick={handleWhatsAppClick}
          >
            💬 WhatsApp Me Now
          </a>
          <Link to="/projects" className="btn-secondary">View Projects →</Link>
        </div>
      </div>
    </section>
  );
}
