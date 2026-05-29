import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faCalendarAlt, faClock, faMagnifyingGlass, faPenNib, faTag, faTrash } from '@fortawesome/free-solid-svg-icons';
import styles from '../styles/Blog.module.css';

import SEO from './SEO';
import { useAppContext } from '../context/AppContext';
import { getCopy } from '../data/i18n';
import { deleteCustomPost, getCustomPostSummaries } from '../services/blogStorage';
import { isAuthenticated } from '../services/auth';
import RichText from './RichText';

const normalizeText = (value = '') => value.toString().trim().toLowerCase();

const getSearchText = (post) => [
    post.title,
    post.excerpt,
    post.slug,
    ...(post.tags || [])
].filter(Boolean).join(' ').toLowerCase();

const Blog = () => {
    const { language } = useAppContext();
    const copy = getCopy(language);
    const [customPosts, setCustomPosts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTag, setSelectedTag] = useState('');
    const [message, setMessage] = useState('');
    const authenticated = isAuthenticated();

    useEffect(() => {
        window.scrollTo(0, 0);
        let isMounted = true;

        getCustomPostSummaries(language)
            .then((posts) => {
                if (isMounted) setCustomPosts(posts);
            })
            .catch((error) => {
                console.error('Failed to load custom posts:', error);
                if (isMounted) setCustomPosts([]);
            });

        return () => {
            isMounted = false;
        };
    }, [language]);

    const posts = useMemo(() => (customPosts.length > 0 ? customPosts : copy.blog.posts), [customPosts, copy.blog.posts]);

    const tags = useMemo(() => {
        const uniqueTags = new Map();
        posts.forEach((post) => {
            (post.tags || []).forEach((tag) => {
                const key = normalizeText(tag);
                if (key && !uniqueTags.has(key)) uniqueTags.set(key, tag);
            });
        });
        return Array.from(uniqueTags.values()).sort((a, b) => a.localeCompare(b));
    }, [posts]);

    const filteredPosts = useMemo(() => {
        const query = normalizeText(searchTerm);
        const activeTag = normalizeText(selectedTag);

        return posts.filter((post) => {
            const matchesSearch = !query || getSearchText(post).includes(query);
            const matchesTag = !activeTag || (post.tags || []).some((tag) => normalizeText(tag) === activeTag);
            return matchesSearch && matchesTag;
        });
    }, [posts, searchTerm, selectedTag]);

    const clearFilters = () => {
        setSearchTerm('');
        setSelectedTag('');
    };

    const removePost = async (post) => {
        if (!post?.id || post.source !== 'custom') return;
        if (!window.confirm(copy.blog.deleteConfirm)) return;

        try {
            await deleteCustomPost(post.id);
            setCustomPosts((current) => current.filter((item) => item.id !== post.id));
            setMessage(copy.blog.deleted);
        } catch (error) {
            console.error('Failed to delete post:', error);
            setMessage(copy.blog.deleteFailed);
        }
    };

    return (
        <div className={styles.blogPage}>
            <SEO
                title={copy.blog.title}
                description={copy.blog.description}
            />
            <div className={styles.container}>
                <Link to="/" className={styles.backBtn}>
                    <FontAwesomeIcon icon={faArrowLeft} /> {copy.common.backToHome}
                </Link>

                <div className={styles.header}>
                    <h1>{copy.blog.title}</h1>
                    <p>{copy.blog.description}</p>
                    {authenticated && (
                        <Link to="/admin" className={styles.writeButton}>
                            <FontAwesomeIcon icon={faPenNib} /> {copy.blog.writeBlog}
                        </Link>
                    )}
                </div>

                <section className={styles.controls} aria-label={copy.blog.filterLabel}>
                    <label className={styles.searchBox}>
                        <FontAwesomeIcon icon={faMagnifyingGlass} />
                        <input
                            value={searchTerm}
                            onChange={(event) => setSearchTerm(event.target.value)}
                            placeholder={copy.blog.searchPlaceholder}
                        />
                    </label>

                    <div className={styles.tagFilters}>
                        <button type="button" className={!selectedTag ? styles.activeTag : ''} onClick={() => setSelectedTag('')}>
                            <FontAwesomeIcon icon={faTag} /> {copy.blog.allTags}
                        </button>
                        {tags.map((tag) => (
                            <button
                                type="button"
                                key={tag}
                                className={normalizeText(selectedTag) === normalizeText(tag) ? styles.activeTag : ''}
                                onClick={() => setSelectedTag(tag)}
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                </section>

                {message && <div className={styles.statusMessage}>{message}</div>}

                <div className={styles.grid}>
                    {filteredPosts.map(post => (
                        <div key={`${post.source || 'static'}-${post.id}`} className={styles.card}>
                            <div className={styles.meta}>
                                <span><FontAwesomeIcon icon={faCalendarAlt} /> {post.date}</span>
                                <span><FontAwesomeIcon icon={faClock} /> {post.readTime}</span>
                            </div>
                            <h2>{post.title}</h2>
                            <RichText className={styles.excerpt} compact content={post.excerpt} />
                            <div className={styles.tags}>
                                {(post.tags || []).map((tag, i) => (
                                    <button type="button" key={i} className={styles.tag} onClick={() => setSelectedTag(tag)}>{tag}</button>
                                ))}
                            </div>
                            <div className={styles.cardActions}>
                                <Link to={`/blog/${post.slug}`} className={styles.readMore}>{copy.blog.readMore} &rarr;</Link>
                                {authenticated && post.source === 'custom' && (
                                    <button type="button" className={styles.deleteButton} onClick={() => removePost(post)}>
                                        <FontAwesomeIcon icon={faTrash} /> {copy.blog.deletePost}
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {filteredPosts.length === 0 && (
                    <div className={styles.emptyState}>
                        <p>{copy.blog.noResults}</p>
                        <button type="button" onClick={clearFilters}>{copy.blog.clearFilters}</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Blog;
