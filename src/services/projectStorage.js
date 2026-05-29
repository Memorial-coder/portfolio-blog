import { authHeaders, handleAuthFailure } from './auth';

const requestJson = async (url, options = {}) => {
    const response = await fetch(url, options);

    if (!response.ok) {
        handleAuthFailure(response);
        const message = await response.text();
        throw new Error(message || `Request failed: ${response.status}`);
    }

    return response.json();
};

export const getManagedProjects = async () => requestJson('/api/projects');

export const upsertManagedProject = async (project) => requestJson('/api/projects', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        ...authHeaders()
    },
    body: JSON.stringify(project)
});

export const deleteManagedProject = async (id) => requestJson(`/api/projects/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: authHeaders()
});

export const getLocalizedProject = (project, language = 'en') => {
    const localized = project.locales?.[language] || project.locales?.en || {};
    const fallback = project.locales?.en || {};
    const projectImage = (!project.images || project.images === '/avatar.jpg' || project.images === '/featured-project.jpg')
        ? '/project1.webp'
        : project.images;

    return {
        id: project.id,
        order: project.order || 0,
        showOnHomepage: project.showOnHomepage !== false,
        showInHeroMenu: project.showInHeroMenu !== false,
        homepageOrder: Number(project.homepageOrder ?? project.order ?? 0),
        heroOrder: Number(project.heroOrder ?? project.order ?? 0),
        name: localized.name || fallback.name || 'Untitled Project',
        nameZh: project.locales?.zh?.name || localized.name || fallback.name || 'Untitled Project',
        des: localized.des || fallback.des || '',
        desZh: project.locales?.zh?.des || localized.des || fallback.des || '',
        mission: localized.mission || fallback.mission || '',
        missionZh: project.locales?.zh?.mission || localized.mission || fallback.mission || '',
        language: project.language || '',
        images: projectImage,
        demoUrl: project.demoUrl || '',
        githubUrl: project.githubUrl || '',
        blogSlug: project.blogSlug || '',
        source: 'managed'
    };
};

export const mapManagedProjects = (projects, language = 'en') => projects.map((project) => getLocalizedProject(project, language));
