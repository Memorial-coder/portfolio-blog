import React, { useEffect, useState, useRef, forwardRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPersonCircleQuestion, faEarthAmericas } from '@fortawesome/free-solid-svg-icons';
import useScrollAnimation from '../hooks/useScrollAnimation';
import { projects } from '../data/projects';
import styles from '../styles/Projects.module.css';
import ProjectModal from './ProjectModal';
import ImageWithFallback from './ImageWithFallback';
import RichText from './RichText';
import { useAppContext } from '../context/AppContext';
import { getCopy } from '../data/i18n';
import GlowCard from './GlowCard';
import { getManagedProjects, mapManagedProjects } from '../services/projectStorage';

const Projects = forwardRef((props, ref) => {
  const { language } = useAppContext();
  const copy = getCopy(language);
  const [listProjects, setListProjects] = useState(projects);
  const [selectedProject, setSelectedProject] = useState(null);
  const divs = useRef([]);

  // Custom hook to handle scroll animations
  useScrollAnimation(ref, divs);

  useEffect(() => {
    let isMounted = true;

    getManagedProjects()
      .then((items) => {
        if (!isMounted) return;
        const homepageProjects = items
          .filter((project) => project.showOnHomepage !== false)
          .sort((a, b) => (a.homepageOrder ?? a.order ?? 0) - (b.homepageOrder ?? b.order ?? 0));

        setListProjects(items.length > 0 ? mapManagedProjects(homepageProjects, language) : projects);
      })
      .catch((error) => {
        console.error('Failed to load managed projects:', error);
        if (isMounted) setListProjects(projects);
      });

    return () => {
      isMounted = false;
    };
  }, [language]);

  return (
    <section className={styles.projects} ref={ref} id='projects'>
      <div className={styles.title} ref={(el) => (divs.current[0] = el)}>
        {copy.projects.title}
      </div>
      <div className={styles.sectionDes} ref={(el) => (divs.current[1] = el)}>
        {copy.projects.description}
      </div>
      <div className={styles.list}>
        {
          listProjects.map((value, key) => (
            <div
              className={styles.item}
              key={key}
              ref={(el) => (divs.current[key + 2] = el)}
              onClick={() => setSelectedProject(value)}
              style={{ cursor: 'pointer' }}
            >
              <GlowCard className={styles.images} borderRadius={20} glowRadius={38} edgeSensitivity={18}>
                <div className={styles.imageFrame}>
                  <ImageWithFallback src={value.images} alt={value.name} />
                </div>
              </GlowCard>
              <div className={styles.content}>
                <h3>{language === 'zh' ? value.nameZh || value.name : value.name}</h3>
                <RichText className={styles.des} compact content={language === 'zh' ? value.desZh || value.des : value.des} />
                <GlowCard className={styles.mission} borderRadius={15} glowRadius={28} edgeSensitivity={22}>
                  <div><FontAwesomeIcon icon={faPersonCircleQuestion} /></div>
                  <div>
                    <h4>{copy.projects.mission}</h4>
                    <div className={styles.des}>{language === 'zh' ? value.missionZh || value.mission : value.mission}</div>
                  </div>
                </GlowCard>
                <GlowCard className={styles.mission} borderRadius={15} glowRadius={28} edgeSensitivity={22}>
                  <div><FontAwesomeIcon icon={faEarthAmericas} /></div>
                  <div>
                    <h4>{copy.projects.languages}</h4>
                    <div className={styles.des}>{value.language}</div>
                  </div>
                </GlowCard>
              </div>
            </div>
          ))
        }
      </div>

      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          language={language}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </section>
  )
})
export default Projects
