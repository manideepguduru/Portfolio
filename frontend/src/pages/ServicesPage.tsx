import { useEffect, useState } from 'react';
import ServiceCard from '../components/common/ServiceCard';
import { Spinner, ErrorMessage } from '../components/common/UIHelpers';
import { serviceApi } from '../services/api';
import type { Service } from '../types';
import styles from './ServicesPage.module.css';

const highlights = [
  { icon: '▪', title: 'Business Websites', desc: 'Professional sites that build trust and drive customers to your door — for restaurants, clinics, agencies, shops and more.' },
  { icon: '▪', title: 'Final Year Projects', desc: 'Complete B.Tech / MCA / BCA / M.Tech projects with source code, documentation, and a live demo. Submission-ready.' },
];

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');

  useEffect(() => {
    serviceApi.getActive()
      .then(r => setServices(r.data))
      .catch(() => setError('Could not load services.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className={styles.page}>
      {/* Hero */}
      <div className={styles.hero}>
        <span className="section-tag">Services</span>
        <h1 className="section-title">Services Built for Results</h1>
        <p className="section-sub">
          Whether you're a business owner who needs a website, or a student who needs a
          final year project — I've got you covered.
        </p>
      </div>

      {/* Highlighted services */}
      <section className={styles.highlights}>
        <div className={styles.inner}>
          {highlights.map(h => (
            <div key={h.title} className={styles.highlight}>
              <div className={styles.hlIcon}>{h.icon}</div>
              <div>
                <h3>{h.title}</h3>
                <p>{h.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* All services grid */}
      <section className={styles.grid_section}>
        <div className={styles.inner}>
          <div className="text-center" style={{ marginBottom: '2.5rem' }}>
            <span className="section-tag">All Services</span>
            <h2 className="section-title">What I Can Do For You</h2>
          </div>

          {loading && <Spinner />}
          {error   && <ErrorMessage message={error} />}
          {!loading && !error && (
            <div className={styles.grid}>
              {services.map(s => <ServiceCard key={s.id} service={s} />)}
            </div>
          )}
        </div>
      </section>

      {/* FAQ / How it works */}
      <section className={styles.process}>
        <div className={styles.inner}>
          <div className="text-center" style={{ marginBottom: '2.5rem' }}>
            <span className="section-tag">How It Works</span>
            <h2 className="section-title">Simple 3-Step Process</h2>
          </div>
          <div className={styles.steps}>
            {[
              { num: '01', title: 'Get in Touch', desc: 'WhatsApp or email me with your requirements — project type, deadline, and budget.' },
              { num: '02', title: 'We Plan Together', desc: 'I share a clear scope, timeline, and price. No hidden charges, no surprises.' },
              { num: '03', title: 'Delivery', desc: 'You get working, tested deliverables with source code, documentation, and support.' },
            ].map(s => (
              <div key={s.num} className={styles.step}>
                <div className={styles.stepNum}>{s.num}</div>
                <h4>{s.title}</h4>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Get in Touch CTA */}
      <section style={{ padding: '4rem 1.5rem', textAlign: 'center', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)' }}>
        <div className={styles.inner}>
          <h2 className="section-title" style={{ marginBottom: '1.5rem' }}>Ready to Start Your Project?</h2>
          <p className="section-sub" style={{ marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
            Whether you need a business website or a complete final year project, I'm ready to help.
            Let's discuss your requirements and bring your ideas to life.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="https://wa.me/919346929001" target="_blank" rel="noopener" className="btn-primary">
              💬 WhatsApp Me
            </a>
            <a href="mailto:softwarekattubanisa@gmail.com" className="btn-secondary">
              📧 Send Email
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
