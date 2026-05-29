import { config as defaultConfig } from '../data/config';
import { authHeaders, handleAuthFailure } from './auth';

export const getDefaultSiteConfig = () => ({
    ...defaultConfig,
    avatarUrl: defaultConfig.avatarUrl || '/avatar.jpg',
    home: {
        introPhrases: {
            en: ['MY NAME IS', 'I BUILD WEB APPS', 'WELCOME'],
            zh: ['我的名字是', '我构建 Web 应用', '欢迎来到这里']
        },
        cta: {
            en: 'View GitHub',
            zh: '查看 GitHub'
        },
        ctaLink: defaultConfig.cvLink || '',
        heroAutoSwitch: true,
        heroAutoSwitchInterval: 5000,
        heroAutoSwitchResumeDelay: 2500
    }
});

const mergeSiteConfig = (base, override = {}) => ({
    ...base,
    ...override,
    descriptions: { ...(base.descriptions || {}), ...(override.descriptions || {}) },
    roles: { ...(base.roles || {}), ...(override.roles || {}) },
    focuses: { ...(base.focuses || {}), ...(override.focuses || {}) },
    locations: { ...(base.locations || {}), ...(override.locations || {}) },
    socials: { ...(base.socials || {}), ...(override.socials || {}) },
    seo: { ...(base.seo || {}), ...(override.seo || {}) },
    home: {
        ...(base.home || {}),
        ...(override.home || {}),
        introPhrases: {
            ...(base.home?.introPhrases || {}),
            ...(override.home?.introPhrases || {})
        },
        cta: {
            ...(base.home?.cta || {}),
            ...(override.home?.cta || {})
        }
    }
});

export const normalizeSiteConfig = (config = {}) => mergeSiteConfig(getDefaultSiteConfig(), config);

export const getSiteConfig = async () => {
    const response = await fetch('/api/site-config');
    if (!response.ok) return getDefaultSiteConfig();
    const data = await response.json();
    return normalizeSiteConfig(data || {});
};

export const saveSiteConfig = async (siteConfig) => {
    const response = await fetch('/api/site-config', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...authHeaders()
        },
        body: JSON.stringify(siteConfig)
    });

    if (!response.ok) {
        handleAuthFailure(response);
        const message = await response.text();
        throw new Error(message || 'Failed to save site config');
    }

    const data = await response.json();
    return normalizeSiteConfig(data || {});
};
