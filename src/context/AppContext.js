import React, { createContext, useEffect, useState, useContext, useMemo, useCallback } from 'react';
import { LAYOUT } from '../config/constants';
import { getDefaultSiteConfig, getSiteConfig, normalizeSiteConfig } from '../services/siteConfig';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [activeTab, setActiveTab] = useState('home');
    const [theme, setTheme] = useState('dark');
    const [language, setLanguage] = useState(() => localStorage.getItem('language') || 'en');
    const [siteConfig, setSiteConfig] = useState(() => getDefaultSiteConfig());

    useEffect(() => {
        let isMounted = true;

        getSiteConfig()
            .then((config) => {
                if (isMounted) setSiteConfig(config);
            })
            .catch((error) => {
                console.error('Failed to load site config:', error);
            });

        return () => {
            isMounted = false;
        };
    }, []);

    const updateSiteConfig = useCallback((nextConfig) => {
        setSiteConfig(normalizeSiteConfig(nextConfig));
    }, []);

    const changeTabActive = useCallback((tab) => {
        setActiveTab(tab);
    }, []);

    const changeTheme = useCallback((newTheme) => {
        setTheme(newTheme);
    }, []);

    const changeLanguage = useCallback((newLanguage) => {
        setLanguage(newLanguage);
        localStorage.setItem('language', newLanguage);
    }, []);

    const toggleLanguage = useCallback(() => {
        setLanguage((current) => {
            const next = current === 'en' ? 'zh' : 'en';
            localStorage.setItem('language', next);
            return next;
        });
    }, []);

    const sections = React.useRef({});

    const registerSection = useCallback((id, ref) => {
        sections.current[id] = ref;
    }, []);

    const scrollToSection = useCallback((id) => {
        const element = sections.current[id]?.current;
        if (element) {
            const headerOffset = LAYOUT.SCROLL_OFFSET;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });
        }
    }, []);

    const value = useMemo(() => ({
        activeTab,
        changeTabActive,
        theme,
        changeTheme,
        language,
        changeLanguage,
        toggleLanguage,
        siteConfig,
        updateSiteConfig,
        registerSection,
        scrollToSection
    }), [activeTab, theme, language, siteConfig, changeTabActive, changeTheme, changeLanguage, toggleLanguage, updateSiteConfig, registerSection, scrollToSection]);

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};
