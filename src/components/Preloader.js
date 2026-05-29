import React, { useEffect, useState } from 'react';
import styles from '../styles/Preloader.module.css';
import { useAppContext } from '../context/AppContext';
import { getCopy } from '../data/i18n';

const Preloader = () => {
    const { language } = useAppContext();
    const copy = getCopy(language);
    const [isLoading, setIsLoading] = useState(true);
    const [fadeResult, setFadeResult] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setFadeResult(true);
            setTimeout(() => setIsLoading(false), 500); // Complete removal after fade out
        }, 2000); // Duration of the loader

        return () => clearTimeout(timer);
    }, []);

    if (!isLoading) return null;

    return (
        <div className={`${styles.preloader} ${fadeResult ? styles.fadeOut : ''}`}>
            <div className={styles.content}>
                <div className={styles.hexagon} aria-label="Loading animation">
                    <div className={styles.inner}></div>
                </div>
                <div className={styles.text}>
                    {copy.common.loading.split('').map((letter, index) => (
                        <span key={`${letter}-${index}`}>{letter}</span>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Preloader;
