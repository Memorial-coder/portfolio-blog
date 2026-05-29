import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import '../styles/BlogPost.css';
import { useAppContext } from '../context/AppContext';
import { getCopy } from '../data/i18n';
import { getCustomPostBySlug, getLocalizedPost } from '../services/blogStorage';
import RichText from './RichText';

const BlogPost = () => {
    const { language, siteConfig } = useAppContext();
    const copy = getCopy(language);
    const { slug } = useParams();
    const [content, setContent] = useState('');
    const [meta, setMeta] = useState({});

    useEffect(() => {
        let isMounted = true;
        window.scrollTo(0, 0);

        getCustomPostBySlug(slug)
            .then((customPost) => {
                const localized = getLocalizedPost(customPost, language);
                if (!isMounted) return;
                setMeta({ title: localized.title, date: localized.date });
                setContent(localized.content);
                document.title = `${localized.title} | ${siteConfig.name} ${copy.blog.title}`;
            })
            .catch(() => {
                const postPath = language === 'zh' ? `/posts/zh/${slug}.md` : `/posts/${slug}.md`;
                return fetch(postPath)
                    .then(res => {
                        if (!res.ok) throw new Error("Post not found");
                        return res.text();
                    })
                    .then(text => {
                        const parts = text.split('---');
                        if (parts.length >= 3) {
                            const frontmatter = parts[1];
                            const body = parts.slice(2).join('---');
                            const metaObj = {};

                            frontmatter.split('\n').forEach(line => {
                                const [key, ...val] = line.split(':');
                                if (key && val) metaObj[key.trim()] = val.join(':').trim().replace(/"/g, '');
                            });

                            if (!isMounted) return;
                            setMeta(metaObj);
                            setContent(body);
                            if (metaObj.title) {
                                document.title = `${metaObj.title} | ${siteConfig.name} ${copy.blog.title}`;
                            }
                        } else {
                            if (!isMounted) return;
                            setContent(text);
                        }
                    })
                    .catch(err => {
                        if (!isMounted) return;
                        setMeta({});
                        setContent(copy.blogPost.notFound);
                    });
            });

        return () => {
            isMounted = false;
        };
    }, [slug, language, copy.blog.title, copy.blogPost.notFound, siteConfig.name]);

    return (
        <div className="blog-post-page">
            <div className="container">
                <Link to="/blog" className="back-btn">
                    <FontAwesomeIcon icon={faArrowLeft} /> {copy.blogPost.back}
                </Link>

                <article className="markdown-body">
                    {meta.title && (
                        <div className="post-header">
                            <h1>{meta.title}</h1>
                            <div className="meta">
                                <span><FontAwesomeIcon icon={faCalendarAlt} /> {meta.date}</span>
                            </div>
                        </div>
                    )}

                    <RichText
                        content={content}
                        components={{
                            code({ node, inline, className, children, ...props }) {
                                const match = /language-(\w+)/.exec(className || '')
                                return !inline && match ? (
                                    <SyntaxHighlighter
                                        children={String(children).replace(/\n$/, '')}
                                        style={dracula}
                                        language={match[1]}
                                        PreTag="div"
                                        {...props}
                                    />
                                ) : (
                                    <code className={className} {...props}>
                                        {children}
                                    </code>
                                )
                            }
                        }}
                    />
                </article>
            </div>
        </div>
    );
};

export default BlogPost;
