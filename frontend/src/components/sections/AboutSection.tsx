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
              I am a <strong>Digital Specialist Engineer at Infosys</strong> with hands-on expertise
              in web development, testing, and automation. I don't just write code — I build
              solutions that deliver <strong>real results</strong>.
            </p>
            <p>
              I work with <strong>businesses</strong> to get them online with clean, fast, and
              converting websites. I also help <strong>final year students</strong> (B.Tech, MCA,
              BCA, M.Tech) build complete projects — from ideation to working demo — that are
              ready to submit and impress examiners.
            </p>
            <blockquote className={styles.quote}>
              "My goal is simple: help businesses grow online, and help students graduate
              confidently — through modern technology and practical solutions."
            </blockquote>
            <p>
              Beyond my corporate role I've built a community of <strong>15,000+ people on
              Instagram</strong> sharing tech, career, and web development content.
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
