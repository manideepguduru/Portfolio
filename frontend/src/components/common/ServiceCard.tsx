import { Link } from 'react-router-dom';
import type { Service } from '../../types';
import styles from './ServiceCard.module.css';

interface Props { service: Service; }

export default function ServiceCard({ service }: Props) {
  return (
    <div className={styles.card}>
      <h3 className={styles.title}>{service.title}</h3>
      <p className={styles.desc}>{service.description}</p>
      <Link to="/contact" className={styles.cta}>💬 Get in Touch</Link>
    </div>
  );
}
