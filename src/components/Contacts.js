import React, { useState, useRef, forwardRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faExternalLinkAlt, faCodeBranch, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { faInstagram, faLinkedin, faGithub } from '@fortawesome/free-brands-svg-icons';
import useScrollAnimation from '../hooks/useScrollAnimation';
import Toast from './Toast';
import styles from '../styles/Contacts.module.css';
import env from '../config/env';
import emailjs from '@emailjs/browser';
import { useAppContext } from '../context/AppContext';
import { getCopy } from '../data/i18n';
import GlowCard from './GlowCard';
import ChromaGrid from './ChromaGrid/ChromaGrid';

const partnerPalette = [
  ['#7C3AED', 'linear-gradient(145deg, #7C3AED, #050505)'],
  ['#06B6D4', 'linear-gradient(200deg, #06B6D4, #050505)'],
  ['#22C55E', 'linear-gradient(165deg, #22C55E, #050505)'],
  ['#F97316', 'linear-gradient(210deg, #F97316, #050505)'],
  ['#EC4899', 'linear-gradient(150deg, #EC4899, #050505)'],
  ['#EAB308', 'linear-gradient(220deg, #EAB308, #050505)']
];

const getPartnerItems = (siteConfig, copy) => {
  const githubUrl = siteConfig.socials?.github || '';
  const projectUrl = siteConfig.featuredProjectUrl || siteConfig.projectUrl || '';
  const partnerText = copy.contacts.partners?.items || [];
  const partners = [
    ['Open Source Partners', 'Public repositories, review, and shared project work', '@github', '/avatar.jpg', githubUrl],
    ['Frontend Collaborators', 'React interfaces, motion details, and component polish', '@frontend', '/project2.webp', ''],
    ['Game Systems Team', 'Game-like web flows, data loops, and interaction design', '@systems', '/featured-project.jpg', projectUrl],
    ['Tooling Partners', 'Build pipelines, deployment checks, and automation support', '@tooling', '/project1.webp', ''],
    ['Design Review Circle', 'UX critique, visual direction, and product feedback', '@design', '/avatar.webp', ''],
    ['Community Builders', 'Docs, discussions, and long-term maintenance support', '@community', '/project1.webp', githubUrl]
  ];

  return partners.map(([title, subtitle, handle, image, url], index) => ({
    title: partnerText[index]?.title || title,
    subtitle: partnerText[index]?.subtitle || subtitle,
    handle,
    image,
    url,
    borderColor: partnerPalette[index][0],
    gradient: partnerPalette[index][1]
  }));
};

const Contacts = forwardRef((props, ref) => {
  const { language, siteConfig } = useAppContext();
  const copy = getCopy(language);
  const partnerItems = getPartnerItems(siteConfig, copy);
  const divs = useRef([]);
  useScrollAnimation(ref, divs);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const [toast, setToast] = useState(null);
  const [isSending, setIsSending] = useState(false);

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    let newErrors = {};
    if (formData.name.trim().length < 2) {
      newErrors.name = copy.contacts.errors.name;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = copy.contacts.errors.email;
    }
    if (formData.message.trim().length < 10) {
      newErrors.message = copy.contacts.errors.message;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const SERVICE_ID = env.emailjs.serviceId;
    const TEMPLATE_ID = env.emailjs.templateId;
    const PUBLIC_KEY = env.emailjs.publicKey;

    if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
      setToast({ message: copy.contacts.toast.missingEmail, type: 'error' });
      return;
    }

    setIsSending(true);

    const templateParams = {
      from_name: formData.name,
      from_email: formData.email,
      message: formData.message,
      to_name: siteConfig.name,
    };

    emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY)
      .then((result) => {
        setToast({ message: copy.contacts.toast.success, type: 'success' });
        setFormData({ name: '', email: '', message: '' });
      }, (error) => {
        console.error("EmailJS Error:", error);
        if (error.status === 412) {
          setToast({ message: copy.contacts.toast.configError, type: 'error' });
        } else {
          setToast({ message: copy.contacts.toast.failed, type: 'error' });
        }
      })
      .finally(() => {
        setIsSending(false);
      });
  }

  return (
    <section className={styles.contacts} ref={ref} id='contacts'>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      <div className={styles.title} ref={(el) => (divs.current[0] = el)}>
        {copy.contacts.title}
      </div>
      <div className={styles.sectionDes} ref={(el) => (divs.current[1] = el)}>
        {copy.contacts.description}
      </div>

      <div className={styles.container}>
        {/* Left Side: Contact Info */}
        <GlowCard className={styles.info} ref={(el) => (divs.current[2] = el)} borderRadius={30} glowRadius={42} edgeSensitivity={18}>
          <h3>{copy.contacts.infoTitle}</h3>
          <p>{copy.contacts.infoBody}</p>

            <div className={styles.item}>
            <div className={styles.icon}><FontAwesomeIcon icon={faCodeBranch} /></div>
            <div className={styles.text}>
              <span>{copy.contacts.github}</span>
              <p>{siteConfig.nickname}</p>
            </div>
          </div>

          <div className={styles.item}>
            <div className={styles.icon}><FontAwesomeIcon icon={faExternalLinkAlt} /></div>
            <div className={styles.text}>
              <span>{copy.contacts.featuredProject}</span>
              <p>{siteConfig.featuredProject}</p>
            </div>
          </div>

          <div className={styles.item}>
            <div className={styles.icon}><FontAwesomeIcon icon={faMapMarkerAlt} /></div>
            <div className={styles.text}>
              <span>{copy.contacts.location}</span>
              <p>{siteConfig.locations?.[language] || siteConfig.location}</p>
            </div>
          </div>

          <div className={styles.socialLinks}>
            <a href={siteConfig.socials.github} className={styles.socialIcon} aria-label="Github"><FontAwesomeIcon icon={faGithub} /></a>
            <a href={siteConfig.socials.linkedin} className={styles.socialIcon} aria-label="LinkedIn"><FontAwesomeIcon icon={faLinkedin} /></a>
            <a href={siteConfig.socials.instagram} className={styles.socialIcon} aria-label="Instagram"><FontAwesomeIcon icon={faInstagram} /></a>
          </div>
        </GlowCard>

        {/* Right Side: Form */}
        <form className={styles.form} onSubmit={handleSubmit} ref={(el) => (divs.current[3] = el)}>
          <div className={styles.formGroup}>
            <label>{copy.contacts.yourName}</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? styles.errorInput : ''}
              required
              placeholder={copy.contacts.namePlaceholder}
            />
            {errors.name && <span className={styles.errorText}>{errors.name}</span>}
          </div>

          <div className={styles.formGroup}>
            <label>{copy.contacts.yourEmail}</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? styles.errorInput : ''}
              required
              placeholder={copy.contacts.emailPlaceholder}
            />
            {errors.email && <span className={styles.errorText}>{errors.email}</span>}
          </div>

          <div className={styles.formGroup}>
            <label>{copy.contacts.message}</label>
            <textarea
              name="message"
              rows="5"
              value={formData.message}
              onChange={handleChange}
              className={errors.message ? styles.errorInput : ''}
              required
              placeholder={copy.contacts.messagePlaceholder}
            ></textarea>
            {errors.message && <span className={styles.errorText}>{errors.message}</span>}
          </div>

          <button type="submit" className={styles.button} disabled={isSending}>
            {isSending ? copy.contacts.sending : copy.contacts.send} <FontAwesomeIcon icon={faPaperPlane} />
          </button>
        </form>
      </div>

      <div className={styles.partners} ref={(el) => (divs.current[4] = el)}>
        <div className={styles.partnersHeader}>
          <span className={styles.eyebrow}>{copy.contacts.partners.eyebrow}</span>
          <h3>{copy.contacts.partners.title}</h3>
          <p>{copy.contacts.partners.description}</p>
        </div>
        <div className={styles.partnersGrid}>
          <ChromaGrid
            items={partnerItems}
            columns={3}
            rows={2}
            radius={360}
            damping={0.45}
            fadeOut={0.85}
            ease="power3.out"
          />
        </div>
      </div>
    </section>
  )
})
export default Contacts
