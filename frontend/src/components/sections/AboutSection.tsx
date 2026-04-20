import { Link } from 'react-router-dom';
import styles from './AboutSection.module.css';

const skills = [
  'HTML / CSS', 'JavaScript', 'TypeScript', 'React', 'Node.js',
  'Java', 'Spring Boot', 'MySQL', 'Python', 'Machine Learning',
  'REST APIs', 'Selenium', 'Git / GitHub', 'Responsive Design', 'SEO',
];

const offerings = [
  { icon: '🏢', title: 'For Businesses', desc: 'Professional websites, landing pages, and automation tools that help your business grow online.' },
  { icon: '🎓', title: 'For Final Year Students', desc: 'Complete B.Tech / MCA / BCA projects with source code, documentation, and working demo — submission ready.' },
  { icon: '📄', title: 'For Job Seekers', desc: 'ATS-friendly resume building, LinkedIn optimisation, and career guidance to land your dream role.' },
];

export default function AboutSection() {
  return (
    <section className={`${styles.section} section`} id="about">
      <div className={styles.inner}>
        <div className={styles.grid}>
          {/* Left — text */}
          <div className={styles.text}>
            <span className="section-tag">About Me</span>
            <h2 className="section-title">Engineer. Developer.<br />Digital Creator.</h2>
            <p>
              I am a <strong>Digital Specialist Engineer at Infosys</strong> focused on web
              development, testing, and automation. I build practical digital solutions that
              drive <strong>real results</strong>.
            </p>
            <p>
              I help <strong>businesses</strong> launch clean, fast websites that convert. I also
              help <strong>final year students</strong> (B.Tech, MCA, BCA, M.Tech) build complete,
              working projects from idea to final demo.
            </p>
            <blockquote className={styles.quote}>
              "My goal is simple: help businesses grow online and help students graduate with
              confidence through practical technology solutions."
            </blockquote>
            <p>
              Beyond my role at Infosys, I have built a <strong>15,000+ member community</strong>
              where I share web, tech, and career guidance.
            </p>
            <div className={styles.actions}>
              <a href="https://wa.me/919346929001" target="_blank" rel="noopener" className="btn-primary">
                💬 Chat on WhatsApp
              </a>
              <Link to="/services" className="btn-secondary">View Services →</Link>
            </div>
          </div>

          {/* Right — skills + offerings */}
          <div className={styles.right}>
            <div className={styles.card}>
              <span className="section-tag">Tech Stack</span>
              <div className={styles.skills}>
                {skills.map(s => <span key={s} className={styles.skill}>{s}</span>)}
              </div>
            </div>

            <div className={styles.offerings}>
              {offerings.map(o => (
                <div key={o.title} className={styles.offer}>
                  <div className={styles.offerIcon}>{o.icon}</div>
                  <div>
                    <h4>{o.title}</h4>
                    <p>{o.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
