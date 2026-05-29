import { authHeaders, handleAuthFailure } from './auth';

export const createSlug = (value) => {
    const base = value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');

    return base || `post-${Date.now()}`;
};

const requestJson = async (url, options = {}) => {
    const response = await fetch(url, options);

    if (!response.ok) {
        handleAuthFailure(response);
        const message = await response.text();
        throw new Error(message || `Request failed: ${response.status}`);
    }

    if (response.status === 204) return null;
    return response.json();
};

export const getCustomPosts = async () => requestJson('/api/posts');

export const getCustomPostBySlug = async (slug) => requestJson(`/api/posts/${encodeURIComponent(slug)}`);

export const upsertCustomPost = async (post) => requestJson('/api/posts', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        ...authHeaders()
    },
    body: JSON.stringify(post)
});

export const deleteCustomPost = async (id) => requestJson(`/api/posts/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: authHeaders()
});

export const getLocalizedPost = (post, language = 'en') => {
    const localized = post.locales?.[language] || post.locales?.en || {};
    const fallback = post.locales?.en || {};

    return {
        id: post.id,
        slug: post.slug,
        title: localized.title || fallback.title || 'Untitled',
        excerpt: localized.excerpt || fallback.excerpt || '',
        date: localized.date || fallback.date || post.updatedAt || '',
        readTime: localized.readTime || fallback.readTime || '3 min read',
        tags: localized.tags || fallback.tags || [],
        content: localized.content || fallback.content || '',
        source: 'custom'
    };
};

export const getCustomPostSummaries = async (language = 'en') => {
    const posts = await getCustomPosts();
    return posts.map((post) => getLocalizedPost(post, language));
};
