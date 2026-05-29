import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faExternalLinkAlt, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import '../styles/ProjectModal.css';
import PropTypes from 'prop-types';
import { getCopy } from '../data/i18n';
import RichText from './RichText';

const ProjectModal = ({ project, language = 'en', onClose }) => {
    const copy = getCopy(language);
    // Close on Escape key
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    // Prevent background scroll
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => document.body.style.overflow = 'unset';
    }, []);

    if (!project) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <button className="close-btn" onClick={onClose} aria-label="Close modal">
                    <FontAwesomeIcon icon={faTimes} />
                </button>

                <div className="modal-body">
                    <div className="modal-image">
                        <img src={project.images} alt={project.name} />
                    </div>

                    <div className="modal-info">
                        <h2>{language === 'zh' ? project.nameZh || project.name : project.name}</h2>
                        <div className="tags">
                            {project.language.split(',').map((tech, index) => (
                                <span key={index} className="tech-tag">{tech.trim()}</span>
                            ))}
                        </div>

                        <RichText className="description" compact content={language === 'zh' ? project.desZh || project.des : project.des} />

                        <div className="meta">
                            <div>
                                <strong>{copy.modal.role}:</strong> {language === 'zh' ? project.missionZh || project.mission : project.mission}
                            </div>
                        </div>

                        <div className="links">
                            {project.demoUrl && (
                                <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                                    <FontAwesomeIcon icon={faExternalLinkAlt} /> {copy.common.liveDemo}
                                </a>
                            )}
                            <Link to={`/project/${project.id}`} className="btn btn-secondary">
                                <FontAwesomeIcon icon={faArrowRight} /> {copy.common.fullDetails}
                            </Link>
                            {project.githubUrl && (
                                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
                                    <FontAwesomeIcon icon={faGithub} /> {copy.common.sourceCode}
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

ProjectModal.propTypes = {
    project: PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        images: PropTypes.string.isRequired,
        language: PropTypes.string.isRequired,
        mission: PropTypes.string.isRequired,
        des: PropTypes.string.isRequired,
        demoUrl: PropTypes.string,
        githubUrl: PropTypes.string,
    }),
    language: PropTypes.string,
    onClose: PropTypes.func.isRequired,
};

export default ProjectModal;
