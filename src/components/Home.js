import React, { forwardRef, useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useScrollAnimation from '../hooks/useScrollAnimation';
import styles from '../styles/Home.module.css';
import SEO from './SEO';
import AvatarCard from './AvatarCard';
import InfiniteMenu from './InfiniteMenu/InfiniteMenu';
import TextType from './TextType';
import { useAppContext } from '../context/AppContext';
import { getCopy } from '../data/i18n';
import { projects } from '../data/projects';
import { getManagedProjects, mapManagedProjects } from '../services/projectStorage';

const Home = forwardRef((props, ref) => {
    const { language, siteConfig } = useAppContext();
    const copy = getCopy(language);
    const navigate = useNavigate();
    const [heroProjects, setHeroProjects] = useState(projects);
    const [titlePulseKey, setTitlePulseKey] = useState(0);
    const [showNameValue, setShowNameValue] = useState(false);
    useScrollAnimation(ref);

    const introPhrases = siteConfig.home?.introPhrases?.[language] || copy.home.introPhrases || [copy.home.introPrefix];
    const heroAutoSwitch = siteConfig.home?.heroAutoSwitch !== false;
    const heroAutoSwitchInterval = Number(siteConfig.home?.heroAutoSwitchInterval || 5000);
    const heroAutoSwitchResumeDelay = Number(siteConfig.home?.heroAutoSwitchResumeDelay || 2500);

    React.useEffect(() => {
        let isMounted = true;

        getManagedProjects()
            .then((items) => {
                if (!isMounted) return;
                const filtered = items
                    .filter((project) => project.showInHeroMenu)
                    .sort((a, b) => (a.heroOrder ?? a.order ?? 0) - (b.heroOrder ?? b.order ?? 0));
                setHeroProjects(items.length > 0 ? mapManagedProjects(filtered, language) : projects);
            })
            .catch((error) => {
                console.error('Failed to load hero projects:', error);
                if (isMounted) setHeroProjects(projects);
            });

        return () => {
            isMounted = false;
        };
    }, [language]);

    const heroMenuItems = useMemo(() => heroProjects.map((project) => ({
        image: project.images,
        link: `/project/${project.id}`,
        title: language === 'zh' ? project.nameZh || project.name : project.name,
        description: language === 'zh' ? project.desZh || project.des : project.des,
    })), [heroProjects, language]);

    const handleHeroProjectClick = (item) => {
        if (!item?.link) return;
        if (item.link.startsWith('http')) {
            window.open(item.link, '_blank', 'noopener,noreferrer');
            return;
        }
        navigate(item.link);
    };

    const handleTypingComplete = useCallback((phrase) => {
        const shouldShowName = phrase === copy.home.introPrefix;
        setShowNameValue(shouldShowName);
        if (shouldShowName) {
            setTitlePulseKey((prev) => prev + 1);
        }
    }, [copy.home.introPrefix]);

    const handleDeletingStart = useCallback(() => {
        setShowNameValue(false);
    }, []);

    // Reset active tab to home when mounting this component
    React.useEffect(() => {
        // We only want to set 'home' active on initial mount if needed, 
        // but 'App.js' IntersectionObserver will handle active state on scroll.
    }, []);

    return (
        <section ref={ref} className={styles.home} id='home'>
            <SEO />
            <div className={styles.content}>
                <div className={styles.name} aria-label={`${copy.home.introPrefix} ${siteConfig.name}`}>
                    <TextType
                        as="span"
                        text={introPhrases}
                        className={styles.nameType}
                        typingSpeed={70}
                        initialDelay={250}
                        pauseDuration={5000}
                        deletingSpeed={45}
                        loop={true}
                        cursorCharacter="_"
                        cursorClassName={styles.nameCursor}
                        onTypingComplete={handleTypingComplete}
                        onDeletingStart={handleDeletingStart}
                        aria-hidden="true"
                    />
                    <span
                        key={titlePulseKey}
                        className={`${styles.nameValue} ${showNameValue ? styles.nameValueVisible : ''}`}
                        aria-hidden={!showNameValue}
                    >
                        {siteConfig.name}
                    </span>
                </div>
                <div className={styles.introPanel}>
                    <AvatarCard variant="compact" />
                    <div className={styles.des}>
                        {siteConfig.descriptions?.[language] || siteConfig.description}
                    </div>
                </div>

                <a href={siteConfig.home?.ctaLink || siteConfig.cvLink} target="_blank" rel="noopener noreferrer" className={`animation active ${styles.button}`}>
                    {siteConfig.home?.cta?.[language] || copy.home.cta}
                </a>
            </div>

            {heroMenuItems.length > 0 && (
                <div className={styles.heroMenu} aria-label="Featured project menu">
                    <InfiniteMenu
                        items={heroMenuItems}
                        scale={1.2}
                        onItemClick={handleHeroProjectClick}
                        autoSwitch={heroAutoSwitch}
                        autoSwitchInterval={heroAutoSwitchInterval}
                        autoSwitchResumeDelay={heroAutoSwitchResumeDelay}
                    />
                    <div className={styles.dragHint}>{copy.home.dragHint}</div>
                </div>
            )}
        </section>
    )
})
export default Home
