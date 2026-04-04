import { useEffect, useRef, useState } from 'react';
import styles from './StatsSection.module.css';

const stats = [
  { icon: '📸', target: 17100,  label: 'Instagram Followers', suffix: 'K+', divisor: 1000 },
  { icon: '👁',  target: 745000, label: 'Monthly Views',       suffix: 'K+', divisor: 1000 },
  { icon: '🏢',  target: 30,     label: 'Business Websites',   suffix: '+',  divisor: 1 },
  { icon: '🎓',  target: 50,     label: 'Student Projects',    suffix: '+',  divisor: 1 },
];

function useCounter(target: number, divisor: number, triggered: boolean) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!triggered) return;
    const duration = 1800;
    const start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round((ease * target) / divisor));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [triggered, target, divisor]);
  return value;
}

function StatCard({ icon, target, label, suffix, divisor }: typeof stats[0]) {
  const ref = useRef<HTMLDivElement>(null);
  const [triggered, setTriggered] = useState(false);
  const value = useCounter(target, divisor, triggered);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setTriggered(true); },
      { threshold: 0.4 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className={styles.card} ref={ref}>
      <div className={styles.icon}>{icon}</div>
      <div className={styles.num}>
        {value}{divisor > 1 ? suffix : suffix}
      </div>
      <div className={styles.label}>{label}</div>
    </div>
  );
}

export default function StatsSection() {
  return (
    <section className={styles.section} id="stats">
      <div className={styles.inner}>
        <div className={styles.heading}>
          <span className="section-tag">Social Proof</span>
          <h2 className="section-title">Trusted by 15,000+ People</h2>
        </div>
        <div className={styles.grid}>
          {stats.map(s => <StatCard key={s.label} {...s} />)}
        </div>
      </div>
    </section>
  );
}
