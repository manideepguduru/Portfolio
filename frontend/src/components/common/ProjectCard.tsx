import type { Project } from '../../types';
import styles from './ProjectCard.module.css';

interface Props { project: Project; }

export default function ProjectCard({ project }: Props) {
  const techs = project.techStack.split(',').map(t => t.trim());

  return (
    <div className={styles.card}>
      {/* Thumbnail */}
      <div className={styles.thumb}>
        {project.imageUrl
          ? <img src={project.imageUrl} alt={project.title} />
          : <div className={styles.placeholder}>{project.title.charAt(0)}</div>
        }
        {project.featured && <span className={styles.badge}>⭐ Featured</span>}
      </div>

      <div className={styles.body}>
        <h3 className={styles.title}>{project.title}</h3>
        <p className={styles.desc}>{project.description}</p>

        <div className={styles.tags}>
          {techs.map(t => <span key={t} className={styles.tag}>{t}</span>)}
        </div>

        <div className={styles.links}>
          {project.githubUrl && (
            <a href={project.githubUrl} target="_blank" rel="noopener" className="btn-secondary"
              style={{ padding: '0.5rem 1rem', fontSize: '0.82rem' }}>
              🐱 GitHub
            </a>
          )}
          {project.liveUrl && (
            <a href={project.liveUrl} target="_blank" rel="noopener" className="btn-primary"
              style={{ padding: '0.5rem 1rem', fontSize: '0.82rem' }}>
              🚀 Live Demo
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
