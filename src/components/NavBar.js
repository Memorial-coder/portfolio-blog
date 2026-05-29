import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import { Link } from 'react-router-dom';
import styles from '../styles/NavBar.module.css';
import { useAppContext } from '../context/AppContext';
import { getCopy } from '../data/i18n';

const NavBar = () => {
    const { activeTab, changeTabActive, theme, changeTheme, language, toggleLanguage, scrollToSection, siteConfig } = useAppContext();
    const copy = getCopy(language);
    const [linkNav] = useState(['home', 'skills', 'projects', 'contacts']);
    const [statusNav, changeStatusNav] = useState(null);
    const isNavOpen = statusNav === 'active';

    useEffect(() => {
        document.body.classList.toggle('nav-open', isNavOpen);

        return () => {
            document.body.classList.remove('nav-open');
        };
    }, [isNavOpen]);


    const toggleNav = () => {
        changeStatusNav(isNavOpen ? null : 'active');
    }

    const closeNav = () => {
        changeStatusNav(null);
    }

    const changeTab = (value) => {
        changeTabActive(value);
        scrollToSection(value);
        closeNav();
    }

    const toggleTheme = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        changeTheme(newTheme);
    }

    return (
        <>
            <div className={`${styles.overlay} ${isNavOpen ? styles.active : ''}`} onClick={closeNav}></div>
            <header className={styles.header}>
                <div className={styles.container}>
                    <div className={styles.logo}>
                        <img src={theme === 'dark' ? "/logo-light.webp" : "/logo-dark.webp"} alt="Logo" />
                        {siteConfig.nickname}
                    </div>
                    <nav className={`${styles.nav} ${isNavOpen ? styles.active : ''}`}>
                        {
                            linkNav.map(value => (
                                <span key={value}
                                    className={activeTab === value ? styles.active : ''}
                                    onClick={() => changeTab(value)}>{copy.nav[value]}</span>
                            ))
                        }
                        <Link to="/blog" onClick={closeNav}>{copy.nav.blog}</Link>
                    </nav>
                    <div className={styles.actions}>
                        <button className={styles.languageToggle} onClick={toggleLanguage} aria-label="Toggle language">
                            {copy.nav.languageToggle}
                        </button>
                        <button className={styles.themeToggle} onClick={toggleTheme} aria-label="Toggle theme">
                            <FontAwesomeIcon icon={theme === 'dark' ? faSun : faMoon} />
                        </button>
                        <div className={styles.iconBar} onClick={toggleNav} aria-label="Toggle menu" role="button" tabIndex={0}>
                            <FontAwesomeIcon icon={faBars} />
                        </div>
                    </div>
                </div>
            </header>
        </>
    )
}
export default NavBar;
