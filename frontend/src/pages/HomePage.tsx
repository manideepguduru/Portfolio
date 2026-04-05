import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import HeroSection      from '../components/sections/HeroSection';
import StatsSection     from '../components/sections/StatsSection';
import AboutSection     from '../components/sections/AboutSection';
import ProjectCard      from '../components/common/ProjectCard';
import ServiceCard      from '../components/common/ServiceCard';
import ContactForm      from '../components/sections/ContactForm';
import { Spinner, ErrorMessage } from '../components/common/UIHelpers';
import { projectApi, serviceApi } from '../services/api';
import type { Project, Service } from '../types';
import styles from './HomePage.module.css';

export default function HomePage() {
  const [projects, setProjects]       = useState<Project[]>([]);
  const [services, setServices]       = useState<Service[]>([]);
  const [loadingP, setLoadingP]       = useState(true);
  const [loadingS, setLoadingS]       = useState(true);
  const [errorP, setErrorP]           = useState('');
  const [errorS, setErrorS]           = useState('');

  useEffect(() => {
    projectApi.getAll()
      .then(r => setProjects(r.data))
      .catch(() => setErrorP('Could not load projects.'))
      .finally(() => setLoadingP(false));

    serviceApi.getActive()
      .then(r => setServices(r.data))
      .catch(() => setErrorS('Could not load services.'))
      .finally(() => setLoadingS(false));
  }, []);

  return (
    <>
      <HeroSection />
      <StatsSection />
      <AboutSection />

      {/* ── Services ─────────────────────────────────────── */}
      <section className={styles.servicesSection} id="services">
        <div className={styles.inner}>
          <div className="text-center" style={{ marginBottom: '3rem' }}>
            <span className="section-tag">What I Offer</span>
            <h2 className="section-title">Services Built for Results</h2>
            <p className="section-sub">
              From pixel-perfect business websites to complete final year projects —
              every service is designed to deliver real value.
            </p>
          </div>

          {loadingS && <Spinner />}
          {errorS   && <ErrorMessage message={errorS} />}
          {!loadingS && !errorS && (
            <div className={styles.servicesGrid}>
              {services.map(s => <ServiceCard key={s.id} service={s} />)}
            </div>
          )}
        </div>
      </section>

      {/* ── Projects ─────────────────────────────────────── */}
      <section className={styles.projectsSection} id="projects">
        <div className={styles.inner}>
          <div className="text-center" style={{ marginBottom: '3rem' }}>
            <span className="section-tag">Portfolio</span>
            <h2 className="section-title">My Projects</h2>
            <p className="section-sub">Real projects solving real problems.</p>
          </div>

          {loadingP && <Spinner />}
          {errorP   && <ErrorMessage message={errorP} />}
          {!loadingP && !errorP && (
            <div className={styles.projectsGrid}>
              {projects.map(p => <ProjectCard key={p.id} project={p} />)}
            </div>
          )}
        </div>
      </section>

      {/* ── CTA banner ───────────────────────────────────── */}
      <section className={styles.cta}>
        <div className={styles.ctaInner}>
          <div>
            <h2>Ready to get started?</h2>
            <p>Whether you're a business owner or a final year student — let's build something great together.</p>
          </div>
          <div className={styles.ctaBtns}>
            <a href="https://wa.me/919346929001" target="_blank" rel="noopener" className="btn-primary">
              💬 WhatsApp Now
            </a>
            <Link to="/contact" className="btn-secondary">Send a Message</Link>
          </div>
        </div>
      </section>

      {/* ── Contact section ───────────────────────────────── */}
      <section className={`section`} id="contact" style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)' }}>
        <div className={styles.contactInner}>
          <div className={styles.contactLeft}>
            <span className="section-tag">Get in Touch</span>
            <h2 className="section-title">Let's Build Something Great</h2>
            <p className="section-sub">Have a project in mind? Need a final year project? Just say hello.</p>
            <div className={styles.contactItems}>
              <div className={styles.ci}><span>📧</span><div><div className={styles.ciLabel}>Email</div><div>softwarekattubanisa@gmail.com</div></div></div>
              <div className={styles.ci}><span>📱</span><div><div className={styles.ciLabel}>WhatsApp</div><div><a href="https://wa.me/919346929001" target="_blank" rel="noopener" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Click to Message</a></div></div></div>
              <div className={styles.ci}><span>📍</span><div><div className={styles.ciLabel}>Location</div><div>Bangalore, Karnataka</div></div></div>
              <div className={styles.ci}><span>⚡</span><div><div className={styles.ciLabel}>Response Time</div><div>Within 24 hours</div></div></div>
            </div>
          </div>
          <div className={styles.contactRight}>
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
