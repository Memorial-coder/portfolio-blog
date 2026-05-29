import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faLaptopCode, faKeyboard, faMicrochip } from '@fortawesome/free-solid-svg-icons';
import styles from '../styles/Uses.module.css';
import { useAppContext } from '../context/AppContext';
import { getCopy } from '../data/i18n';

const Uses = () => {
    const { language, siteConfig } = useAppContext();
    const copy = getCopy(language);
    const { hardware, peripherals, software } = copy.uses.categories;

    useEffect(() => {
        document.title = `${copy.uses.title} | ${siteConfig.name}`;
        window.scrollTo(0, 0);
    }, [copy.uses.title, siteConfig.name]);

    return (
        <div className={styles.usesPage}>
            <div className={styles.container}>
                <Link to="/" className={styles.backBtn}>
                    <FontAwesomeIcon icon={faArrowLeft} /> {copy.common.backToHome}
                </Link>

                <div className={styles.header}>
                    <h1>{copy.uses.title}</h1>
                    <p>{copy.uses.description}</p>
                </div>

                <div className={styles.grid}>
                    <div className={styles.category}>
                        <h2><FontAwesomeIcon icon={faLaptopCode} /> {hardware.title}</h2>
                        <ul>
                            {hardware.items.map(([label, value]) => (
                                <li key={label}>
                                    <strong>{label}</strong>
                                    <span>{value}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className={styles.category}>
                        <h2><FontAwesomeIcon icon={faKeyboard} /> {peripherals.title}</h2>
                        <ul>
                            {peripherals.items.map(([label, value]) => (
                                <li key={label}>
                                    <strong>{label}</strong>
                                    <span>{value}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className={styles.category}>
                        <h2><FontAwesomeIcon icon={faMicrochip} /> {software.title}</h2>
                        <ul>
                            {software.items.map(([label, value]) => (
                                <li key={label}>
                                    <strong>{label}</strong>
                                    <span>{value}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Uses;
