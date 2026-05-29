import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { projects } from '../data/projects';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faBookOpen, faGlobe } from '@fortawesome/free-solid-svg-icons';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import styles from '../styles/ProjectDetail.module.css';

import SEO from './SEO';
import ImageWithFallback from './ImageWithFallback';
import RichText from './RichText';
import { useAppContext } from '../context/AppContext';
import { getCopy } from '../data/i18n';

import { getLocalizedProject, getManagedProjects } from '../services/projectStorage';
const ProjectDetail = () => {
    const { language } = useAppContext();
    const copy = getCopy(language);
    const { id } = useParams();
    const [project, setProject] = useState(() => projects.find(p => String(p.id) === String(id)) || null);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    useEffect(() => {
        let isMounted = true;

        getManagedProjects()
            .then((items) => {
                if (!isMounted) return;
                const managedProject = items.find((item) => String(item.id) === String(id));
                if (managedProject) {
                    setProject(getLocalizedProject(managedProject, language));
                    return;
                }
                setProject(projects.find(p => String(p.id) === String(id)) || null);
            })
            .catch(() => {
                if (isMounted) setProject(projects.find(p => String(p.id) === String(id)) || null);
            });

        return () => {
            isMounted = false;
        };
    }, [id, language]);

    if (!project) {
        return <div className="project-not-found">{copy.projectDetail.notFound}</div>;
    }

    const projectName = language === 'zh' ? project.nameZh || project.name : project.name;
    const projectDescription = language === 'zh' ? project.desZh || project.des : project.des;
    const projectMission = language === 'zh' ? project.missionZh || project.mission : project.mission;

    return (
        <div className={styles.projectDetail}>
            <SEO
                title={projectName}
                description={projectDescription}
                type="article"
            />
            <div className={styles.container}>
                <Link to="/" className={styles.backBtn}>
                    <FontAwesomeIcon icon={faArrowLeft} /> {copy.common.backToHome}
                </Link>

                <div className={styles.header}>
                    <h1>{projectName}</h1>
                    <div className={styles.meta}>
                        <span>{projectMission}</span>
                    </div>
                </div>

                <div className={styles.showcase}>
                    <ImageWithFallback src={project.images} alt={project.name} className="main-image" />
                </div>

                <div className={styles.content}>
                    <div className="description">
                        <h2>{copy.projectDetail.overview}</h2>
                        <RichText className={styles.descriptionText} content={projectDescription} />
                    </div>

                    <div className={styles.techStack}>
                        <h2>{copy.projectDetail.technologies}</h2>
                        <p>{project.language}</p>
                    </div>

                    <div className={styles.actions}>
                        <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className={styles.btnPrimary}>
                            <FontAwesomeIcon icon={faGlobe} /> {copy.common.liveDemo}
                        </a>
                        <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className={styles.btnSecondary}>
                            <FontAwesomeIcon icon={faGithub} /> {copy.common.sourceCode}
                        </a>
                        {project.blogSlug && (
                            <Link to={`/blog/${project.blogSlug}`} className={styles.btnSecondary}>
                                <FontAwesomeIcon icon={faBookOpen} /> {copy.projectDetail.relatedPost}
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectDetail;
