import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faArrowLeft,
    faBullseye,
    faEye,
    faFilePen,
    faFolderOpen,
    faGlobe,
    faGrip,
    faHouse,
    faImage,
    faLayerGroup,
    faLink,
    faMagnifyingGlass,
    faPlus,
    faRightFromBracket,
    faTrash
} from '@fortawesome/free-solid-svg-icons';
import SEO from './SEO';
import { isAuthenticated, logout } from '../services/auth';
import ImageWithFallback from './ImageWithFallback';
import RichText from './RichText';
import { createSlug, deleteCustomPost, getCustomPosts, upsertCustomPost } from '../services/blogStorage';
import { deleteManagedProject, getManagedProjects, upsertManagedProject } from '../services/projectStorage';
import { useAppContext } from '../context/AppContext';
import { getDefaultSiteConfig, getSiteConfig, saveSiteConfig } from '../services/siteConfig';
import { uploadImage } from '../services/upload';

import styles from '../styles/Admin.module.css';

const today = () => new Date().toISOString().slice(0, 10);

const emptyPost = () => ({
    id: '',
    slug: '',
    status: 'published',
    locales: {
        en: { title: '', excerpt: '', date: today(), readTime: '3 min read', tags: [], content: '# New Post\n\nStart writing here.' },
        zh: { title: '', excerpt: '', date: today(), readTime: '3 分钟阅读', tags: [], content: '# 新文章\n\n从这里开始写中文内容。' }
    }
});

const emptyProject = () => ({
    id: '',
    order: 0,
    homepageOrder: 0,
    heroOrder: 0,
    showOnHomepage: true,
    showInHeroMenu: true,
    images: '/project1.webp',
    language: '',
    demoUrl: '',
    githubUrl: '',
    blogSlug: '',
    locales: {
        en: { name: '', des: '', mission: 'Project Maintainer' },
        zh: { name: '', des: '', mission: '项目维护者' }
    }
});

const tagsToString = (tags = []) => tags.join(', ');
const arrayToLines = (items = []) => (Array.isArray(items) ? items.join('\n') : '');
const linesToArray = (value) => value.split('\n').map((item) => item.trim()).filter(Boolean);
const stringToTags = (value) => value.split(',').map((item) => item.trim()).filter(Boolean);
const normalizeText = (value = '') => value.toString().trim().toLowerCase();

const getPostDisplayTitle = (post) => post.locales?.zh?.title || post.locales?.en?.title || '未命名文章';

const getAllPostTags = (post) => Object.values(post.locales || {})
    .flatMap((locale) => locale.tags || [])
    .filter(Boolean);

const getPostSearchText = (post) => Object.values(post.locales || {})
    .flatMap((locale) => [
        locale.title,
        locale.excerpt,
        locale.content,
        ...(locale.tags || [])
    ])
    .concat(post.slug || '', post.id || '')
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

const getImageAltText = (filename = 'image') => {
    const basename = filename.replace(/\.[^.]+$/, '').replace(/\[|\]|\r|\n/g, ' ').trim();
    return basename || 'image';
};

const mergeSite = (siteConfig) => {
    const defaults = getDefaultSiteConfig();

    return {
        ...defaults,
        ...siteConfig,
        descriptions: { ...(defaults.descriptions || {}), ...(siteConfig.descriptions || {}) },
        roles: { ...(defaults.roles || {}), ...(siteConfig.roles || {}) },
        focuses: { ...(defaults.focuses || {}), ...(siteConfig.focuses || {}) },
        locations: { ...(defaults.locations || {}), ...(siteConfig.locations || {}) },
        socials: { ...(defaults.socials || {}), ...(siteConfig.socials || {}) },
        seo: { ...(defaults.seo || {}), ...(siteConfig.seo || {}) },
        home: {
            ...defaults.home,
            ...(siteConfig.home || {}),
            introPhrases: {
                ...defaults.home?.introPhrases,
                ...(siteConfig.home?.introPhrases || {})
            },
            cta: {
                ...defaults.home?.cta,
                ...(siteConfig.home?.cta || {})
            }
        }
    };
};

const mergePost = (post) => ({
    ...emptyPost(),
    ...post,
    locales: {
        ...emptyPost().locales,
        ...(post.locales || {}),
        en: { ...emptyPost().locales.en, ...(post.locales?.en || {}) },
        zh: { ...emptyPost().locales.zh, ...(post.locales?.zh || {}) }
    }
});

const mergeProject = (project) => ({
    ...emptyProject(),
    ...project,
    locales: {
        ...emptyProject().locales,
        ...(project.locales || {}),
        en: { ...emptyProject().locales.en, ...(project.locales?.en || {}) },
        zh: { ...emptyProject().locales.zh, ...(project.locales?.zh || {}) }
    }
});

const moduleNav = [
    { id: 'site', label: '站点设置', icon: faHouse, description: '首页简介、头像、SEO' },
    { id: 'projects', label: '项目管理', icon: faFolderOpen, description: '项目内容、链接、首页展示' },
    { id: 'hero', label: '首屏滑动', icon: faGrip, description: '右侧按住滑动项目' },
    { id: 'blog', label: '博客管理', icon: faFilePen, description: '文章编辑与预览' }
];

const siteTabs = [
    { id: 'profile', label: '首页资料' },
    { id: 'heroCopy', label: '首屏文案' },
    { id: 'socials', label: '社交链接' },
    { id: 'seo', label: 'SEO' }
];

const projectTabs = [
    { id: 'content', label: '基础内容' },
    { id: 'media', label: '图片与链接' },
    { id: 'homepage', label: '首页展示' }
];

const heroTabs = [
    { id: 'heroList', label: '展示列表' },
    { id: 'heroEdit', label: '项目配置' }
];

const blogTabs = [
    { id: 'meta', label: '文章信息' },
    { id: 'write', label: '正文编辑' },
    { id: 'preview', label: '预览' }
];

const getProjectName = (project, locale = 'zh') => {
    const localized = project.locales?.[locale]?.name;
    const fallback = project.locales?.en?.name;
    return localized || fallback || '未命名项目';
};

const AdminDashboard = () => {
    const navigate = useNavigate();
    const { updateSiteConfig } = useAppContext();
    const postContentRef = useRef(null);
    const [activePanel, setActivePanel] = useState('site');
    const [activeLocale, setActiveLocale] = useState('en');
    const [activeSiteTab, setActiveSiteTab] = useState('profile');
    const [activeProjectTab, setActiveProjectTab] = useState('content');
    const [activeHeroTab, setActiveHeroTab] = useState('heroList');
    const [activeBlogTab, setActiveBlogTab] = useState('meta');
    const [posts, setPosts] = useState([]);
    const [projects, setProjects] = useState([]);
    const [postDraft, setPostDraft] = useState(() => emptyPost());
    const [projectDraft, setProjectDraft] = useState(() => emptyProject());
    const [message, setMessage] = useState('');
    const [siteDraft, setSiteDraft] = useState(() => mergeSite(getDefaultSiteConfig()));
    const [isUploading, setIsUploading] = useState(false);
    const [postSearchTerm, setPostSearchTerm] = useState('');
    const [postTagFilter, setPostTagFilter] = useState('');

    const activePostContent = postDraft.locales[activeLocale];
    const activeProjectContent = projectDraft.locales[activeLocale];
    const isEditingPost = Boolean(postDraft.id);
    const isEditingProject = Boolean(projectDraft.id);

    const sortedProjects = useMemo(() => [...projects].sort((a, b) => (a.order || 0) - (b.order || 0)), [projects]);
    const homepageProjects = useMemo(() => [...projects]
        .filter((project) => project.showOnHomepage !== false)
        .sort((a, b) => (a.homepageOrder ?? a.order ?? 0) - (b.homepageOrder ?? b.order ?? 0)), [projects]);
    const heroProjects = useMemo(() => [...projects]
        .filter((project) => project.showInHeroMenu !== false)
        .sort((a, b) => (a.heroOrder ?? a.order ?? 0) - (b.heroOrder ?? b.order ?? 0)), [projects]);
    const postTags = useMemo(() => {
        const uniqueTags = new Map();
        posts.forEach((post) => {
            getAllPostTags(post).forEach((tag) => {
                const key = normalizeText(tag);
                if (key && !uniqueTags.has(key)) uniqueTags.set(key, tag);
            });
        });
        return Array.from(uniqueTags.values()).sort((a, b) => a.localeCompare(b));
    }, [posts]);
    const filteredPosts = useMemo(() => {
        const query = normalizeText(postSearchTerm);
        const activeTag = normalizeText(postTagFilter);

        return posts.filter((post) => {
            const matchesSearch = !query || getPostSearchText(post).includes(query);
            const matchesTag = !activeTag || getAllPostTags(post).some((tag) => normalizeText(tag) === activeTag);
            return matchesSearch && matchesTag;
        });
    }, [posts, postSearchTerm, postTagFilter]);

    const previewMeta = useMemo(() => ({
        title: activePostContent.title || '未命名文章',
        excerpt: activePostContent.excerpt || '这里会显示文章摘要。',
        date: activePostContent.date,
        tags: activePostContent.tags
    }), [activePostContent]);

    useEffect(() => {
        let isMounted = true;

        Promise.all([getCustomPosts(), getManagedProjects(), getSiteConfig()])
            .then(([postItems, projectItems, siteConfig]) => {
                if (!isMounted) return;
                setPosts(postItems);
                setProjects(projectItems);
                setSiteDraft(mergeSite(siteConfig));
                if (projectItems[0]) setProjectDraft(mergeProject(projectItems[0]));
                if (postItems[0]) setPostDraft(mergePost(postItems[0]));
            })
            .catch((error) => {
                console.error('Failed to load admin data:', error);
                if (isMounted) setMessage('后台数据加载失败，请确认服务已启动。');
            });

        return () => {
            isMounted = false;
        };
    }, []);

    if (!isAuthenticated()) {
        return <Navigate to="/admin/login" replace state={{ from: '/admin' }} />;
    }

    const setPostField = (field, value) => {
        setPostDraft((current) => ({
            ...current,
            locales: {
                ...current.locales,
                [activeLocale]: {
                    ...current.locales[activeLocale],
                    [field]: field === 'tags' ? stringToTags(value) : value
                }
            }
        }));
        setMessage('');
    };

    const setProjectField = (field, value) => {
        if (['order', 'homepageOrder', 'heroOrder'].includes(field)) {
            setProjectDraft((current) => ({ ...current, [field]: Number(value || 0) }));
        } else if (['images', 'language', 'demoUrl', 'githubUrl', 'blogSlug'].includes(field)) {
            setProjectDraft((current) => ({ ...current, [field]: value }));
        } else if (['showOnHomepage', 'showInHeroMenu'].includes(field)) {
            setProjectDraft((current) => ({ ...current, [field]: Boolean(value) }));
        } else {
            setProjectDraft((current) => ({
                ...current,
                locales: {
                    ...current.locales,
                    [activeLocale]: {
                        ...current.locales[activeLocale],
                        [field]: value
                    }
                }
            }));
        }
        setMessage('');
    };

    const setSiteField = (path, value) => {
        const [section, localeOrField, maybeField] = path;
        setSiteDraft((current) => {
            if (path.length === 1) {
                return { ...current, [section]: value };
            }

            if (path.length === 2) {
                return {
                    ...current,
                    [section]: {
                        ...(current[section] || {}),
                        [localeOrField]: value
                    }
                };
            }

            return {
                ...current,
                [section]: {
                    ...(current[section] || {}),
                    [localeOrField]: {
                        ...(current[section]?.[localeOrField] || {}),
                        [maybeField]: value
                    }
                }
            };
        });
        setMessage('');
    };

    const setSiteIntroPhrases = (locale, value) => {
        setSiteField(['home', 'introPhrases', locale], linesToArray(value));
    };

    const newPost = () => {
        setPostDraft(emptyPost());
        setActiveLocale('en');
        setActivePanel('blog');
        setActiveBlogTab('meta');
        setMessage('');
    };

    const newProject = () => {
        setProjectDraft(emptyProject());
        setActiveLocale('en');
        setActivePanel('projects');
        setActiveProjectTab('content');
        setMessage('');
    };

    const loadPost = (post) => {
        setPostDraft(mergePost(post));
        setActivePanel('blog');
        setActiveLocale('en');
        setMessage('');
    };

    const loadProject = (project, panel = 'projects') => {
        setProjectDraft(mergeProject(project));
        setActivePanel(panel);
        setActiveLocale('en');
        if (panel === 'hero') setActiveHeroTab('heroEdit');
        setMessage('');
    };

    const savePost = async (event) => {
        event.preventDefault();
        const title = postDraft.locales.en.title.trim();
        if (!title) {
            setMessage('保存文章前需要填写英文标题。');
            return;
        }

        const nextDraft = { ...postDraft, id: postDraft.id || `post-${Date.now()}`, slug: postDraft.slug || createSlug(title) };

        try {
            const nextPosts = await upsertCustomPost(nextDraft);
            setPosts(nextPosts);
            setPostDraft(nextDraft);
            setMessage('文章已保存。');
        } catch (error) {
            console.error('Failed to save post:', error);
            setMessage('文章保存失败，请重新登录后再试。');
        }
    };

    const saveProject = async (event) => {
        event.preventDefault();
        const name = projectDraft.locales.en.name.trim();
        if (!name) {
            setMessage('保存项目前需要填写英文项目名称。');
            return;
        }

        const nextDraft = { ...projectDraft, id: projectDraft.id || `project-${Date.now()}` };

        try {
            const nextProjects = await upsertManagedProject(nextDraft);
            setProjects(nextProjects);
            setProjectDraft(nextDraft);
            setMessage('项目已保存，首页展示和首屏滑动会按当前开关生效。');
        } catch (error) {
            console.error('Failed to save project:', error);
            setMessage('项目保存失败，请重新登录后再试。');
        }
    };

    const saveSite = async (event) => {
        event.preventDefault();
        try {
            const saved = await saveSiteConfig(siteDraft);
            setSiteDraft(mergeSite(saved));
            updateSiteConfig(saved);
            setMessage('站点设置已保存，刷新首页即可看到最新内容。');
        } catch (error) {
            console.error('Failed to save site settings:', error);
            setMessage('站点设置保存失败，请重新登录后再试。');
        }
    };

    const handleImageUpload = async (event, target) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        setMessage('图片上传中...');
        try {
            const result = await uploadImage(file);
            if (target === 'avatar') {
                setSiteField(['avatarUrl'], result.url);
            } else {
                setProjectField('images', result.url);
            }
            setMessage('图片已上传，保存当前表单后会正式生效。');
        } catch (error) {
            console.error('Failed to upload image:', error);
            setMessage('图片上传失败，原图片地址已保留。');
        } finally {
            setIsUploading(false);
            event.target.value = '';
        }
    };

    const insertPostContent = (snippet, selectionStart, selectionEnd) => {
        setPostDraft((current) => {
            const localeContent = current.locales[activeLocale] || {};
            const content = localeContent.content || '';
            const start = Number.isInteger(selectionStart) ? selectionStart : content.length;
            const end = Number.isInteger(selectionEnd) ? selectionEnd : start;
            const prefix = content.slice(0, start);
            const suffix = content.slice(end);
            const needsLeadingBreak = prefix && !prefix.endsWith('\n') ? '\n\n' : '';
            const needsTrailingBreak = suffix && !suffix.startsWith('\n') ? '\n\n' : '';

            return {
                ...current,
                locales: {
                    ...current.locales,
                    [activeLocale]: {
                        ...localeContent,
                        content: `${prefix}${needsLeadingBreak}${snippet}${needsTrailingBreak}${suffix}`
                    }
                }
            };
        });
        setMessage('图片已插入正文，保存文章后会正式生效。');
    };

    const handlePostImageUpload = async (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const textarea = postContentRef.current;
        const selectionStart = textarea?.selectionStart;
        const selectionEnd = textarea?.selectionEnd;

        setIsUploading(true);
        setMessage('文章图片上传中...');
        try {
            const result = await uploadImage(file);
            const snippet = `![${getImageAltText(file.name)}](${result.url})`;
            insertPostContent(snippet, selectionStart, selectionEnd);
            window.requestAnimationFrame(() => {
                postContentRef.current?.focus();
            });
        } catch (error) {
            console.error('Failed to upload post image:', error);
            setMessage('文章图片上传失败，正文未改变。');
        } finally {
            setIsUploading(false);
            event.target.value = '';
        }
    };

    const removePost = async (id) => {
        if (!window.confirm('确定删除这篇文章吗？此操作无法撤销。')) return;

        try {
            const nextPosts = await deleteCustomPost(id);
            setPosts(nextPosts);
            if (postDraft.id === id) newPost();
            setMessage('文章已删除。');
        } catch (error) {
            console.error('Failed to delete post:', error);
            setMessage('文章删除失败。');
        }
    };

    const removeProject = async (id) => {
        try {
            const nextProjects = await deleteManagedProject(id);
            setProjects(nextProjects);
            if (projectDraft.id === id) newProject();
            setMessage('项目已删除。');
        } catch (error) {
            console.error('Failed to delete project:', error);
            setMessage('项目删除失败。');
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/admin/login', { replace: true });
    };

    const renderLocaleSwitch = () => (
        <div className={styles.segmentedControl} aria-label="内容语言">
            <button type="button" className={activeLocale === 'en' ? styles.activeSegment : ''} onClick={() => setActiveLocale('en')}>英文</button>
            <button type="button" className={activeLocale === 'zh' ? styles.activeSegment : ''} onClick={() => setActiveLocale('zh')}>中文</button>
        </div>
    );

    const renderTabButtons = (tabs, activeTab, setActiveTab) => (
        <div className={styles.subTabs}>
            {tabs.map((tab) => (
                <button key={tab.id} type="button" className={activeTab === tab.id ? styles.activeSubTab : ''} onClick={() => setActiveTab(tab.id)}>
                    {tab.label}
                </button>
            ))}
        </div>
    );

const renderBadges = (project) => (
    <div className={styles.badgeRow}>
            <span>{project.showOnHomepage !== false ? '首页展示' : '首页隐藏'}</span>
            <span>{project.showInHeroMenu !== false ? '首屏滑动展示' : '首屏滑动隐藏'}</span>
            <span>首页 {project.homepageOrder ?? project.order ?? 0}</span>
            <span>滑动 {project.heroOrder ?? project.order ?? 0}</span>
        </div>
    );

    const renderSitePanel = () => (
        <form className={styles.editorPanel} onSubmit={saveSite}>
            <div className={styles.editorTopbar}>
                <div>
                    <div className={styles.kicker}>站点设置</div>
                    <h2>首页与全站内容</h2>
                </div>
                <button type="submit" className={styles.primaryButton}><FontAwesomeIcon icon={faFilePen} /> 保存站点</button>
            </div>

            {renderTabButtons(siteTabs, activeSiteTab, setActiveSiteTab)}

            {activeSiteTab === 'profile' && (
                <div className={styles.sectionStack}>
                    <div className={styles.panelSection}>
                        <div className={styles.sectionTitle}><FontAwesomeIcon icon={faHouse} /><span>首页资料</span></div>
                        <div className={styles.fieldGrid}>
                            <label>站点名<input value={siteDraft.name || ''} onChange={(event) => setSiteField(['name'], event.target.value)} /></label>
                            <label>昵称<input value={siteDraft.nickname || ''} onChange={(event) => setSiteField(['nickname'], event.target.value)} /></label>
                            <label>代表项目<input value={siteDraft.featuredProject || ''} onChange={(event) => setSiteField(['featuredProject'], event.target.value)} /></label>
                            <label>首页按钮链接<input value={siteDraft.home?.ctaLink || ''} onChange={(event) => setSiteField(['home', 'ctaLink'], event.target.value)} /></label>
                            <label>头像 URL<input value={siteDraft.avatarUrl || ''} onChange={(event) => setSiteField(['avatarUrl'], event.target.value)} /></label>
                            <label>上传头像<input type="file" accept="image/*" onChange={(event) => handleImageUpload(event, 'avatar')} disabled={isUploading} /></label>
                        </div>

                        <div className={styles.imagePreviewRow}>
                            <ImageWithFallback src={siteDraft.avatarUrl || '/avatar.jpg'} alt="头像预览" />
                            <span>{siteDraft.avatarUrl || '/avatar.jpg'}</span>
                        </div>
                    </div>

                    <div className={styles.panelSection}>
                        <div className={styles.sectionTitle}><FontAwesomeIcon icon={faBullseye} /><span>个人简介</span></div>
                        <div className={styles.fieldGrid}>
                            <label>角色（英文）<input value={siteDraft.roles?.en || ''} onChange={(event) => setSiteField(['roles', 'en'], event.target.value)} /></label>
                            <label>角色（中文）<input value={siteDraft.roles?.zh || ''} onChange={(event) => setSiteField(['roles', 'zh'], event.target.value)} /></label>
                            <label>方向（英文）<input value={siteDraft.focuses?.en || ''} onChange={(event) => setSiteField(['focuses', 'en'], event.target.value)} /></label>
                            <label>方向（中文）<input value={siteDraft.focuses?.zh || ''} onChange={(event) => setSiteField(['focuses', 'zh'], event.target.value)} /></label>
                            <label>地点（英文）<input value={siteDraft.locations?.en || ''} onChange={(event) => setSiteField(['locations', 'en'], event.target.value)} /></label>
                            <label>地点（中文）<input value={siteDraft.locations?.zh || ''} onChange={(event) => setSiteField(['locations', 'zh'], event.target.value)} /></label>
                        </div>
                        <label>首页简介（英文）<textarea value={siteDraft.descriptions?.en || ''} onChange={(event) => setSiteField(['descriptions', 'en'], event.target.value)} rows="4" /></label>
                        <label>首页简介（中文）<textarea value={siteDraft.descriptions?.zh || ''} onChange={(event) => setSiteField(['descriptions', 'zh'], event.target.value)} rows="4" /></label>
                    </div>
                </div>
            )}

            {activeSiteTab === 'heroCopy' && (
                <div className={styles.panelSection}>
                    <div className={styles.sectionTitle}><FontAwesomeIcon icon={faLayerGroup} /><span>首屏文案</span></div>
                    <p className={styles.sectionHint}>打字文案按行录入，首页会自动轮播。英文默认展示，访客切换中文后显示中文版本。</p>
                    <div className={styles.fieldGrid}>
                        <label>打字文案（英文）<textarea value={arrayToLines(siteDraft.home?.introPhrases?.en)} onChange={(event) => setSiteIntroPhrases('en', event.target.value)} rows="6" /></label>
                        <label>打字文案（中文）<textarea value={arrayToLines(siteDraft.home?.introPhrases?.zh)} onChange={(event) => setSiteIntroPhrases('zh', event.target.value)} rows="6" /></label>
                        <label>按钮文案（英文）<input value={siteDraft.home?.cta?.en || ''} onChange={(event) => setSiteField(['home', 'cta', 'en'], event.target.value)} /></label>
                        <label>按钮文案（中文）<input value={siteDraft.home?.cta?.zh || ''} onChange={(event) => setSiteField(['home', 'cta', 'zh'], event.target.value)} /></label>
                    </div>
                </div>
            )}

            {activeSiteTab === 'socials' && (
                <div className={styles.panelSection}>
                    <div className={styles.sectionTitle}><FontAwesomeIcon icon={faLink} /><span>社交链接</span></div>
                    <div className={styles.fieldGrid}>
                        <label>GitHub<input value={siteDraft.socials?.github || ''} onChange={(event) => setSiteField(['socials', 'github'], event.target.value)} /></label>
                        <label>LinkedIn<input value={siteDraft.socials?.linkedin || ''} onChange={(event) => setSiteField(['socials', 'linkedin'], event.target.value)} /></label>
                        <label>Twitter / X<input value={siteDraft.socials?.twitter || ''} onChange={(event) => setSiteField(['socials', 'twitter'], event.target.value)} /></label>
                        <label>Instagram<input value={siteDraft.socials?.instagram || ''} onChange={(event) => setSiteField(['socials', 'instagram'], event.target.value)} /></label>
                    </div>
                </div>
            )}

            {activeSiteTab === 'seo' && (
                <div className={styles.panelSection}>
                    <div className={styles.sectionTitle}><FontAwesomeIcon icon={faMagnifyingGlass} /><span>SEO</span></div>
                    <div className={styles.fieldGrid}>
                        <label>SEO 标题<input value={siteDraft.seo?.title || ''} onChange={(event) => setSiteField(['seo', 'title'], event.target.value)} /></label>
                        <label>SEO 关键词<input value={siteDraft.seo?.keywords || ''} onChange={(event) => setSiteField(['seo', 'keywords'], event.target.value)} /></label>
                        <label>分享图 URL<input value={siteDraft.seo?.ogImage || ''} onChange={(event) => setSiteField(['seo', 'ogImage'], event.target.value)} /></label>
                    </div>
                    <label>SEO 描述<textarea value={siteDraft.seo?.description || ''} onChange={(event) => setSiteField(['seo', 'description'], event.target.value)} rows="4" /></label>
                </div>
            )}

            {message && <div className={styles.statusMessage}>{message}</div>}
        </form>
    );

    const renderProjectEditor = ({ heroMode = false } = {}) => (
        <form className={styles.editorPanel} onSubmit={saveProject}>
            <div className={styles.editorTopbar}>
                <div>
                    <div className={styles.kicker}>{heroMode ? '首屏滑动配置' : '项目管理'}</div>
                    <h2>{isEditingProject ? getProjectName(projectDraft, 'zh') : '新建项目'}</h2>
                </div>
                <div className={styles.editorActions}>
                    {renderLocaleSwitch()}
                    {isEditingProject && <button type="button" className={styles.dangerButton} onClick={() => removeProject(projectDraft.id)}><FontAwesomeIcon icon={faTrash} /> 删除项目</button>}
                    <button type="submit" className={styles.primaryButton}><FontAwesomeIcon icon={faFolderOpen} /> 保存项目</button>
                </div>
            </div>

            {heroMode ? renderTabButtons(heroTabs, activeHeroTab, setActiveHeroTab) : renderTabButtons(projectTabs, activeProjectTab, setActiveProjectTab)}

            {heroMode && activeHeroTab === 'heroList' && (
                <div className={styles.panelSection}>
                    <div className={styles.sectionTitle}><FontAwesomeIcon icon={faGrip} /><span>首屏滑动展示列表</span></div>
                    <p className={styles.sectionHint}>这里控制首页右侧按住滑动的项目。打开“显示在首屏滑动”并设置滑动排序后，首页会按这个顺序展示。</p>
                    <div className={styles.compactList}>
                        {heroProjects.length === 0 && <p className={styles.emptyState}>当前没有项目被设置为首屏滑动展示。</p>}
                        {heroProjects.map((project) => (
                            <button type="button" key={project.id} className={styles.compactListItem} onClick={() => loadProject(project, 'hero')}>
                                <ImageWithFallback src={project.images || '/project1.webp'} alt={getProjectName(project)} />
                                <span>{getProjectName(project)}</span>
                                <small>滑动排序 {project.heroOrder ?? project.order ?? 0}</small>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {(!heroMode && activeProjectTab === 'content') || (heroMode && activeHeroTab === 'heroEdit') ? (
                <div className={styles.panelSection}>
                    <div className={styles.sectionTitle}><FontAwesomeIcon icon={faFilePen} /><span>{heroMode ? '滑动项目内容' : '项目基础内容'}</span></div>
                    <div className={styles.fieldGrid}>
                        <label>项目名称<input value={activeProjectContent.name} onChange={(event) => setProjectField('name', event.target.value)} placeholder="Project name" /></label>
                        <label>基础排序<input type="number" value={projectDraft.order} onChange={(event) => setProjectField('order', event.target.value)} placeholder="0" /></label>
                        <label>职责 / 角色<input value={activeProjectContent.mission} onChange={(event) => setProjectField('mission', event.target.value)} placeholder="Project Maintainer" /></label>
                        <label>技术栈<input value={projectDraft.language} onChange={(event) => setProjectField('language', event.target.value)} placeholder="React, Vue, Docker" /></label>
                    </div>
                    <label>项目描述 / Markdown + HTML<textarea value={activeProjectContent.des} onChange={(event) => setProjectField('des', event.target.value)} rows="7" placeholder="项目介绍，支持 Markdown、HTML 和单次回车换行" /></label>
                </div>
            ) : null}

            {(!heroMode && activeProjectTab === 'media') || (heroMode && activeHeroTab === 'heroEdit') ? (
                <div className={styles.panelSection}>
                    <div className={styles.sectionTitle}><FontAwesomeIcon icon={faImage} /><span>图片与链接</span></div>
                    <div className={styles.fieldGrid}>
                        <label>图片 URL<input value={projectDraft.images} onChange={(event) => setProjectField('images', event.target.value)} placeholder="/project1.webp 或 https://..." /></label>
                        <label>上传项目图片<input type="file" accept="image/*" onChange={(event) => handleImageUpload(event, 'project')} disabled={isUploading} /></label>
                        <label>体验链接<input value={projectDraft.demoUrl} onChange={(event) => setProjectField('demoUrl', event.target.value)} placeholder="https://..." /></label>
                        <label>GitHub 链接<input value={projectDraft.githubUrl} onChange={(event) => setProjectField('githubUrl', event.target.value)} placeholder="https://github.com/..." /></label>
                        <label>关联文章 Slug<input value={projectDraft.blogSlug} onChange={(event) => setProjectField('blogSlug', event.target.value.trim())} placeholder="monochrome-portfolio" /></label>
                    </div>

                    <div className={styles.imagePreviewRow}>
                        <ImageWithFallback src={projectDraft.images || '/project1.webp'} alt="项目图片预览" />
                        <span>{projectDraft.images || '/project1.webp'}</span>
                    </div>
                </div>
            ) : null}

            {(!heroMode && activeProjectTab === 'homepage') || (heroMode && activeHeroTab === 'heroEdit') ? (
                <div className={styles.panelSection}>
                    <div className={styles.sectionTitle}><FontAwesomeIcon icon={faGlobe} /><span>展示开关与排序</span></div>
                    <div className={styles.switchGrid}>
                        <label className={styles.switchField}><input type="checkbox" checked={projectDraft.showOnHomepage !== false} onChange={(event) => setProjectField('showOnHomepage', event.target.checked)} /> 显示在首页项目区</label>
                        <label className={styles.switchField}><input type="checkbox" checked={projectDraft.showInHeroMenu !== false} onChange={(event) => setProjectField('showInHeroMenu', event.target.checked)} /> 显示在首屏滑动</label>
                    </div>
                    <div className={styles.fieldGrid}>
                        <label>首页展示排序<input type="number" value={projectDraft.homepageOrder} onChange={(event) => setProjectField('homepageOrder', event.target.value)} placeholder="0" /></label>
                        <label>首屏滑动排序<input type="number" value={projectDraft.heroOrder} onChange={(event) => setProjectField('heroOrder', event.target.value)} placeholder="0" /></label>
                    </div>
                    <div className={styles.displayPreview}>
                        <div>
                            <strong>首页项目区</strong>
                            <span>{projectDraft.showOnHomepage !== false ? `显示，排序 ${projectDraft.homepageOrder}` : '不显示'}</span>
                        </div>
                        <div>
                            <strong>首屏滑动</strong>
                            <span>{projectDraft.showInHeroMenu !== false ? `显示，排序 ${projectDraft.heroOrder}` : '不显示'}</span>
                        </div>
                    </div>
                    <p className={styles.sectionHint}>
                        当前组合：{projectDraft.showOnHomepage !== false ? '首页展示' : '首页不展示'} / {projectDraft.showInHeroMenu !== false ? '首屏滑动展示' : '首屏滑动不展示'}。
                    </p>
                </div>
            ) : null}

            <section className={styles.previewPanel}>
                <div className={styles.previewHeader}><span><FontAwesomeIcon icon={faEye} /> 项目预览</span><small>{projectDraft.language}</small></div>
                <h2>{activeProjectContent.name || '未命名项目'}</h2>
                <RichText content={activeProjectContent.des || '项目描述预览。'} />
                <div className={styles.previewTags}>{projectDraft.language.split(',').map((tag) => tag.trim()).filter(Boolean).map((tag) => <span key={tag}>{tag}</span>)}</div>
                <p><strong>图片：</strong>{projectDraft.images || '未设置'}</p>
                <p><strong>体验：</strong>{projectDraft.demoUrl || '未设置'}</p>
                <p><strong>源码：</strong>{projectDraft.githubUrl || '未设置'}</p>
                <p><strong>关联文章：</strong>{projectDraft.blogSlug ? `/blog/${projectDraft.blogSlug}` : '未设置'}</p>
            </section>

            {message && <div className={styles.statusMessage}>{message}</div>}
        </form>
    );

    const renderProjectsPanel = () => renderProjectEditor({ heroMode: false });

    const renderHeroPanel = () => (
        <div className={styles.panelColumn}>
            <form className={styles.editorPanel} onSubmit={saveSite}>
                <div className={styles.editorTopbar}>
                    <div>
                        <div className={styles.kicker}>首屏滑动</div>
                        <h2>自动切换设置</h2>
                    </div>
                    <button type="submit" className={styles.primaryButton}><FontAwesomeIcon icon={faFilePen} /> 保存自动切换</button>
                </div>

                <div className={styles.panelSection}>
                    <div className={styles.sectionTitle}><FontAwesomeIcon icon={faGrip} /><span>空闲时自动切到下一个项目</span></div>
                    <p className={styles.sectionHint}>这里控制首屏右侧按住滑动区域。它会按项目顺序一项一项自动切换，不是持续慢慢旋转。</p>
                    <div className={styles.switchGrid}>
                        <label className={styles.switchField}>
                            <input
                                type="checkbox"
                                checked={siteDraft.home?.heroAutoSwitch !== false}
                                onChange={(event) => setSiteField(['home', 'heroAutoSwitch'], event.target.checked)}
                            />
                            启用自动切换
                        </label>
                    </div>
                    <div className={styles.fieldGrid}>
                        <label>
                            自动切换间隔（毫秒）
                            <input
                                type="number"
                                min="1500"
                                step="500"
                                value={siteDraft.home?.heroAutoSwitchInterval ?? 5000}
                                onChange={(event) => setSiteField(['home', 'heroAutoSwitchInterval'], Number(event.target.value || 5000))}
                            />
                        </label>
                        <label>
                            松手后恢复延迟（毫秒）
                            <input
                                type="number"
                                min="0"
                                step="500"
                                value={siteDraft.home?.heroAutoSwitchResumeDelay ?? 2500}
                                onChange={(event) => setSiteField(['home', 'heroAutoSwitchResumeDelay'], Number(event.target.value || 2500))}
                            />
                        </label>
                    </div>
                </div>

                {message && <div className={styles.statusMessage}>{message}</div>}
            </form>

            {renderProjectEditor({ heroMode: true })}
        </div>
    );

    const renderBlogPanel = () => (
        <form className={styles.editorPanel} onSubmit={savePost}>
            <div className={styles.editorTopbar}>
                <div>
                    <div className={styles.kicker}>博客管理</div>
                    <h2>{isEditingPost ? activePostContent.title || '未命名文章' : '新建文章'}</h2>
                </div>
                <div className={styles.editorActions}>
                    {renderLocaleSwitch()}
                    {isEditingPost && <button type="button" className={styles.dangerButton} onClick={() => removePost(postDraft.id)}><FontAwesomeIcon icon={faTrash} /> 删除文章</button>}
                    <button type="submit" className={styles.primaryButton}><FontAwesomeIcon icon={faFilePen} /> 保存文章</button>
                </div>
            </div>

            {renderTabButtons(blogTabs, activeBlogTab, setActiveBlogTab)}

            {activeBlogTab === 'meta' && (
                <div className={styles.panelSection}>
                    <div className={styles.sectionTitle}><FontAwesomeIcon icon={faFilePen} /><span>文章信息</span></div>
                    <div className={styles.fieldGrid}>
                        <label>标题<input value={activePostContent.title} onChange={(event) => setPostField('title', event.target.value)} placeholder="文章标题" /></label>
                        <label>Slug<input value={postDraft.slug} onChange={(event) => setPostDraft((current) => ({ ...current, slug: createSlug(event.target.value) }))} placeholder="post-url-slug" /></label>
                        <label>发布日期<input value={activePostContent.date} onChange={(event) => setPostField('date', event.target.value)} placeholder="2026-05-29" /></label>
                        <label>阅读时间<input value={activePostContent.readTime} onChange={(event) => setPostField('readTime', event.target.value)} placeholder="3 min read" /></label>
                    </div>
                    <label>摘要<textarea value={activePostContent.excerpt} onChange={(event) => setPostField('excerpt', event.target.value)} rows="3" placeholder="显示在博客列表里的简短摘要" /></label>
                    <label>标签<input value={tagsToString(activePostContent.tags)} onChange={(event) => setPostField('tags', event.target.value)} placeholder="React, Design, Notes" /></label>
                </div>
            )}

            {activeBlogTab === 'write' && (
                <div className={styles.liveEditorGrid}>
                    <div className={styles.markdownColumn}>
                        <div className={styles.editorInlineHeader}>
                            <span>Markdown 正文</span>
                            <label className={styles.uploadButton}>
                                <FontAwesomeIcon icon={faImage} /> {isUploading ? '上传中...' : '插入图片'}
                                <input type="file" accept="image/*" onChange={handlePostImageUpload} disabled={isUploading} />
                            </label>
                        </div>
                        <textarea
                            ref={postContentRef}
                            className={styles.markdownTextarea}
                            value={activePostContent.content}
                            onChange={(event) => setPostField('content', event.target.value)}
                            rows="22"
                        />
                    </div>
                    <section className={styles.livePreviewPanel}>
                        <div className={styles.previewHeader}><span><FontAwesomeIcon icon={faEye} /> 实时预览</span><small>{activeLocale === 'zh' ? '中文' : 'EN'}</small></div>
                        <div className={styles.markdownPreview}><RichText content={activePostContent.content} /></div>
                    </section>
                </div>
            )}

            {activeBlogTab === 'preview' && (
                <section className={styles.previewPanel}>
                    <div className={styles.previewHeader}><span><FontAwesomeIcon icon={faEye} /> 文章预览</span><small>{previewMeta.date}</small></div>
                    <h2>{previewMeta.title}</h2>
                    <RichText compact content={previewMeta.excerpt} />
                    <div className={styles.previewTags}>{previewMeta.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
                    <div className={styles.markdownPreview}><RichText content={activePostContent.content} /></div>
                </section>
            )}

            {message && <div className={styles.statusMessage}>{message}</div>}
        </form>
    );

    const renderSideList = () => {
        if (activePanel === 'site') {
            return (
                <aside className={styles.postList}>
                    <h2>配置范围</h2>
                    <p className={styles.emptyState}>首页资料、首屏文案、头像、SEO 和社交链接都会从这里读取。</p>
                    <div className={styles.statGrid}>
                        <div><strong>{siteDraft.name}</strong><span>站点名</span></div>
                        <div><strong>{siteDraft.nickname}</strong><span>昵称</span></div>
                    </div>
                </aside>
            );
        }

        if (activePanel === 'blog') {
            return (
                <aside className={styles.postList}>
                    <div className={styles.listHeader}>
                        <h2>文章</h2>
                        <button type="button" className={styles.iconButton} onClick={newPost} aria-label="新建文章"><FontAwesomeIcon icon={faPlus} /></button>
                    </div>

                    <label className={styles.sideSearch}>
                        <FontAwesomeIcon icon={faMagnifyingGlass} />
                        <input
                            value={postSearchTerm}
                            onChange={(event) => setPostSearchTerm(event.target.value)}
                            placeholder="搜索文章"
                        />
                    </label>

                    {postTags.length > 0 && (
                        <div className={styles.sideFilters}>
                            <button type="button" className={!postTagFilter ? styles.activeFilter : ''} onClick={() => setPostTagFilter('')}>全部</button>
                            {postTags.map((tag) => (
                                <button
                                    type="button"
                                    key={tag}
                                    className={normalizeText(postTagFilter) === normalizeText(tag) ? styles.activeFilter : ''}
                                    onClick={() => setPostTagFilter(tag)}
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>
                    )}

                    {posts.length === 0 && <p className={styles.emptyState}>还没有自定义文章。</p>}
                    {posts.length > 0 && filteredPosts.length === 0 && <p className={styles.emptyState}>没有符合筛选条件的文章。</p>}
                    {filteredPosts.map((post) => (
                        <button type="button" key={post.id} className={`${styles.postListItem} ${postDraft.id === post.id ? styles.activePost : ''}`} onClick={() => loadPost(post)}>
                            <span>{getPostDisplayTitle(post)}</span>
                            <small>/{post.slug}</small>
                            {getAllPostTags(post).length > 0 && (
                                <span className={styles.listTagLine}>{getAllPostTags(post).join(', ')}</span>
                            )}
                        </button>
                    ))}
                    {posts.length > 0 && (
                        <div className={styles.sideSummary}>当前显示 {filteredPosts.length} / {posts.length} 篇文章。</div>
                    )}
                </aside>
            );
        }

        return (
            <aside className={styles.postList}>
                <div className={styles.listHeader}>
                    <h2>{activePanel === 'hero' ? '滑动项目' : '项目'}</h2>
                    <button type="button" className={styles.iconButton} onClick={newProject} aria-label="新建项目"><FontAwesomeIcon icon={faPlus} /></button>
                </div>
                {projects.length === 0 && <p className={styles.emptyState}>还没有后台项目。首页会继续使用默认项目。</p>}
                {(activePanel === 'hero' ? sortedProjects : sortedProjects).map((project) => (
                    <button type="button" key={project.id} className={`${styles.postListItem} ${projectDraft.id === project.id ? styles.activePost : ''}`} onClick={() => loadProject(project, activePanel === 'hero' ? 'hero' : 'projects')}>
                        <span>{getProjectName(project)}</span>
                        <small>基础排序 {project.order || 0}</small>
                        {renderBadges(project)}
                    </button>
                ))}
                {activePanel === 'projects' && homepageProjects.length > 0 && (
                    <div className={styles.sideSummary}>首页当前展示 {homepageProjects.length} 个项目。</div>
                )}
                {activePanel === 'hero' && heroProjects.length > 0 && (
                    <div className={styles.sideSummary}>首屏滑动当前展示 {heroProjects.length} 个项目。</div>
                )}
            </aside>
        );
    };

    const renderActivePanel = () => {
        if (activePanel === 'site') return renderSitePanel();
        if (activePanel === 'projects') return renderProjectsPanel();
        if (activePanel === 'hero') return renderHeroPanel();
        return renderBlogPanel();
    };

    return (
        <div className={styles.adminPage}>
            <SEO title="内容管理后台" description="Portfolio Owner 的私有博客和项目管理后台。" />
            <div className={styles.shellWide}>
                <div className={styles.toolbar}>
                    <Link to="/" className={styles.backLink}>
                        <FontAwesomeIcon icon={faArrowLeft} /> 返回首页
                    </Link>
                    <button type="button" className={styles.ghostButton} onClick={handleLogout}>
                        <FontAwesomeIcon icon={faRightFromBracket} /> 退出登录
                    </button>
                </div>

                <header className={styles.studioHeader}>
                    <div>
                        <div className={styles.kicker}>内容管理中心</div>
                        <h1>后台管理</h1>
                        <p>管理首页、首屏滑动展示、项目和博客内容。注册入口已关闭。</p>
                    </div>
                    <div className={styles.editorActions}>
                        {activePanel === 'projects' && (
                            <button type="button" className={styles.primaryButton} onClick={newProject}>
                                <FontAwesomeIcon icon={faPlus} /> 新建项目
                            </button>
                        )}
                        {activePanel === 'blog' && (
                            <button type="button" className={styles.primaryButton} onClick={newPost}>
                                <FontAwesomeIcon icon={faPlus} /> 新建文章
                            </button>
                        )}
                    </div>
                </header>

                <div className={styles.adminShell}>
                    <nav className={styles.moduleNav} aria-label="后台模块">
                        {moduleNav.map((item) => (
                            <button key={item.id} type="button" className={activePanel === item.id ? styles.activeModule : ''} onClick={() => setActivePanel(item.id)}>
                                <FontAwesomeIcon icon={item.icon} />
                                <span>{item.label}</span>
                                <small>{item.description}</small>
                            </button>
                        ))}
                    </nav>

                    {renderSideList()}
                    {renderActivePanel()}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
