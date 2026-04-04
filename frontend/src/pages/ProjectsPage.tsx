import { useEffect, useState } from 'react';
import ProjectCard from '../components/common/ProjectCard';
import { Spinner, ErrorMessage, EmptyState } from '../components/common/UIHelpers';
import { projectApi } from '../services/api';
import type { Project } from '../types';
import styles from './ProjectsPage.module.css';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');
  const [filter, setFilter]     = useState<'all' | 'featured'>('all');

  useEffect(() => {
    projectApi.getAll()
      .then(r => setProjects(r.data))
      .catch(() => setError('Could not load projects. Make sure the backend is running.'))
      .finally(() => setLoading(false));
  }, []);

  const displayed = filter === 'featured'
    ? projects.filter(p => p.featured)
    : projects;

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <span className="section-tag">Portfolio</span>
        <h1 className="section-title">My Projects</h1>
        <p className="section-sub">
          A collection of work spanning machine learning, web development, and automation.
        </p>
      </div>

      <div className={styles.inner}>
        {/* Filter tabs */}
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${filter === 'all' ? styles.active : ''}`}
            onClick={() => setFilter('all')}
          >
            All Projects ({projects.length})
          </button>
          <button
            className={`${styles.tab} ${filter === 'featured' ? styles.active : ''}`}
            onClick={() => setFilter('featured')}
          >
            ⭐ Featured ({projects.filter(p => p.featured).length})
          </button>
        </div>

        {loading && <Spinner />}
        {error   && <ErrorMessage message={error} />}
        {!loading && !error && displayed.length === 0 && <EmptyState message="No projects found." />}
        {!loading && !error && displayed.length > 0 && (
          <div className={styles.grid}>
            {displayed.map(p => <ProjectCard key={p.id} project={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}
