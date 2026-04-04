import { useState } from 'react';
import toast from 'react-hot-toast';
import { contactApi } from '../../services/api';
import type { ContactDTO, FormErrors } from '../../types';
import styles from './ContactForm.module.css';

function validate(form: ContactDTO): FormErrors<ContactDTO> {
  const errors: FormErrors<ContactDTO> = {};
  if (!form.name.trim())                           errors.name    = 'Name is required';
  if (!form.email.trim())                          errors.email   = 'Email is required';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
                                                   errors.email   = 'Enter a valid email';
  if (!form.phone || !form.phone.trim())           errors.phone   = 'Phone number is required';
  else if (!/^\d{10,15}$/.test(form.phone.replace(/\D/g, '')))
                                                   errors.phone   = 'Enter a valid phone number';
  if (!form.subject.trim())                        errors.subject = 'Subject is required';
  if (form.message.trim().length < 10)             errors.message = 'Message must be at least 10 characters';
  return errors;
}

const empty: ContactDTO = { name: '', email: '', phone: '', subject: '', message: '' };

export default function ContactForm() {
  const [form, setForm]       = useState<ContactDTO>(empty);
  const [errors, setErrors]   = useState<FormErrors<ContactDTO>>({});
  const [loading, setLoading] = useState(false);
  const [sent, setSent]       = useState(false);

  const change = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setErrors(er => ({ ...er, [e.target.name]: '' }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    try {
      const res = await contactApi.submit(form);
      toast.success(res.message);
      setForm(empty);
      setSent(true);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })
        ?.response?.data?.message ?? 'Failed to send message. Please try again.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className={styles.success}>
        <div className={styles.successIcon}>🎉</div>
        <h3>Message Sent!</h3>
        <p>Thanks for reaching out. I'll get back to you within 24 hours.</p>
        <button className="btn-secondary" onClick={() => setSent(false)}>Send Another Message</button>
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={submit} noValidate>
      <div className={styles.row}>
        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <input id="name" name="name" placeholder="Guduru Manideep" value={form.name} onChange={change} />
          {errors.name && <span className="form-error">{errors.name}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input id="email" name="email" type="email" placeholder="you@example.com" value={form.email} onChange={change} />
          {errors.email && <span className="form-error">{errors.email}</span>}
        </div>
      </div>

      <div className={styles.row}>
        <div className="form-group">
          <label htmlFor="phone">Phone Number *</label>
          <input id="phone" name="phone" type="tel" placeholder="+91 98765 43210" value={form.phone || ''} onChange={change} required />
          {errors.phone && <span className="form-error">{errors.phone}</span>}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="subject">Subject</label>
        <select id="subject" name="subject" value={form.subject} onChange={change}>
          <option value="">— Select a subject —</option>
          <option value="Business Website Development">Business Website Development</option>
          <option value="Final Year Project Help">Final Year Project Help</option>
          <option value="Static & Dynamic Pages with Payment Integration">Static & Dynamic Pages with Payment Integration</option>
          <option value="Domain Setup & Deployment">Domain Setup & Deployment</option>
          <option value="Resume Consultancy">Resume Consultancy</option>
          <option value="Other">Other</option>
        </select>
        {errors.subject && <span className="form-error">{errors.subject}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="message">Message</label>
        <textarea
          id="message" name="message" rows={5}
          placeholder="Tell me about your project, deadline, or what you need help with..."
          value={form.message} onChange={change}
        />
        {errors.message && <span className="form-error">{errors.message}</span>}
      </div>

      <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', justifyContent: 'center' }}>
        {loading ? '⏳ Sending...' : '📨 Send Message'}
      </button>
      <p className={styles.alt}>
        Or WhatsApp directly: <a href="https://wa.me/919346929001" target="_blank" rel="noopener">Click here</a>
      </p>
    </form>
  );
}
