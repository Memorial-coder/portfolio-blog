import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faLinkedin, faXTwitter } from '@fortawesome/free-brands-svg-icons';
import styles from '../styles/Footer.module.css';

import { useAppContext } from '../context/AppContext';
import { getCopy } from '../data/i18n';

const Footer = () => {
    const { language, siteConfig } = useAppContext();
    const copy = getCopy(language);

    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.logo}>
                    <h2>{siteConfig.nickname}</h2>
                    <p>{siteConfig.descriptions?.[language] || siteConfig.description}</p>
                </div>

                <div className={styles.links}>
                    <h3>{copy.footer.explore}</h3>
                    <ul>
                        <li><Link to="/blog">{copy.nav.blog}</Link></li>
                        <li><Link to="/uses">{copy.footer.uses}</Link></li>
                        <li><a href="#projects">{copy.footer.projects}</a></li>
                        <li><a href="#contacts">{copy.footer.contact}</a></li>
                        <li><Link to="/admin/login">{copy.footer.admin}</Link></li>
                    </ul>
                </div>

                <div className={styles.social}>
                    <h3>{copy.footer.connect}</h3>
                    <div className={styles.socialIcons}>
                        <a href={siteConfig.socials.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                            <FontAwesomeIcon icon={faGithub} />
                        </a>
                        <a href={siteConfig.socials.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                            <FontAwesomeIcon icon={faLinkedin} />
                        </a>
                        <a href={siteConfig.socials.twitter} target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                            <FontAwesomeIcon icon={faXTwitter} />
                        </a>
                    </div>
                </div>
            </div>
            <div className={styles.bottom}>
                <p>&copy; {new Date().getFullYear()} {siteConfig.nickname}. {copy.footer.rights}</p>
            </div>
        </footer>
    );
};

export default Footer;
