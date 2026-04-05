import { Link } from 'react-router-dom';
import type { Service } from '../../types';
import styles from './ServiceCard.module.css';

interface Props { service: Service; }

export default function ServiceCard({ service }: Props) {
  const techs = service.techStack ? service.techStack.split(',').map(t => t.trim()) : [];

  return (
    <div className={styles.card}>
      {service.icon && <div className={styles.icon}>{service.icon}</div>}
      <h3 className={styles.title}>{service.title}</h3>
      <p className={styles.desc}>{service.description}</p>
      
      {service.priceRange && <p className={styles.price}>{service.priceRange}</p>}

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
