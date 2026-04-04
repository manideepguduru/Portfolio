import ContactForm from '../components/sections/ContactForm';
import styles from './ContactPage.module.css';

export default function ContactPage() {
  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <span className="section-tag">Contact</span>
        <h1 className="section-title">Let's Build Something Great</h1>
        <p className="section-sub">
          Have a project in mind? Need a final year project? Just say hello.
          I respond within 24 hours.
        </p>
      </div>

      <div className={styles.inner}>
        <div className={styles.info}>
          <h2>Get in Touch</h2>
          <p>Pick the fastest way to reach me:</p>

          <div className={styles.cards}>
            <a href="https://wa.me/919346929001" target="_blank" rel="noopener" className={styles.card} title="Open WhatsApp">
              <span className={styles.cardIcon}>💬</span>
              <div>
                <div className={styles.cardTitle}>WhatsApp (Fastest)</div>
                <div className={styles.cardSub}>Click to message</div>
              </div>
            </a>
            <a href="mailto:softwarekattubanisa@gmail.com" className={styles.card}>
              <span className={styles.cardIcon}>📧</span>
              <div>
                <div className={styles.cardTitle}>Email</div>
                <div className={styles.cardSub}>softwarekattubanisa@gmail.com</div>
              </div>
            </a>
            <a href="https://www.instagram.com/antha_manadey/" target="_blank" rel="noopener" className={styles.card}>
              <span className={styles.cardIcon}>📸</span>
              <div>
                <div className={styles.cardTitle}>Instagram</div>
                <div className={styles.cardSub}>@antha_manadey</div>
              </div>
            </a>
            <div className={styles.card}>
              <span className={styles.cardIcon}>📍</span>
              <div>
                <div className={styles.cardTitle}>Location</div>
                <div className={styles.cardSub}>Bangalore, Karnataka</div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.formWrap}>
          <div className={styles.formCard}>
            <h3>Send a Message</h3>
            <p>Fill in the form and I'll get back to you within 24 hours.</p>
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}
