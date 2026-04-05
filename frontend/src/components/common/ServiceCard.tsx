import { Link } from 'react-router-dom';
import type { Service } from '../../types';
import styles from './ServiceCard.module.css';

interface Props { service: Service; }

function formatPrice(range: string): string {
  const parts = range.split('-').map(p => p.trim());
  const fmt = (n: string) => {
    const num = parseInt(n.replace(/[^0-9]/g, ''), 10);
    return isNaN(num) ? n : `\u20B9${num.toLocaleString('en-IN')}`;
  };
  return parts.length === 2 ? `${fmt(parts[0])} \u2013 ${fmt(parts[1])}` : range;
}

export default function ServiceCard({ service }: Props) {
  const techs = service.techStack ? service.techStack.split(',').map(t => t.trim()) : [];

  return (
    <div className={styles.card}>
      <h3 className={styles.title}>{service.title}</h3>
      <p className={styles.desc}>{service.description}</p>
      
      {service.priceRange && <p className={styles.price}>{formatPrice(service.priceRange)}</p>}

      {techs.length > 0 && (
        <div className={styles.tags}>
          {techs.map(t => <span key={t} className={styles.tag}>{t}</span>)}
        </div>
      )}

      <div className={styles.links}>
        {service.githubUrl && (
          <a href={service.githubUrl} target="_blank" rel="noopener" className="btn-secondary"
            style={{ padding: '0.5rem 1rem', fontSize: '0.82rem' }}>
            GitHub
          </a>
        )}
        {service.liveUrl && (
          <a href={service.liveUrl} target="_blank" rel="noopener" className="btn-primary"
            style={{ padding: '0.5rem 1rem', fontSize: '0.82rem' }}>
            Live Demo
          </a>
        )}
        <Link to="/contact" className={styles.cta}>Get in Touch</Link>
      </div>
    </div>
  );
}
