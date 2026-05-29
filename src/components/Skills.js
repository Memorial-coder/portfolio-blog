import React, { useRef, useState, forwardRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useScrollAnimation from '../hooks/useScrollAnimation';
import { skills } from '../data/skills';
import styles from '../styles/Skills.module.css';
import { useAppContext } from '../context/AppContext';
import { getCopy } from '../data/i18n';
import GlowCard from './GlowCard';

const Skills = forwardRef((props, ref) => {
  const { language } = useAppContext();
  const copy = getCopy(language);
  const divs = useRef([]);
  useScrollAnimation(ref, divs);
  const [listSkills] = useState(skills);

  return (
    <section className={styles.skills} ref={ref} id='skills'>
      <div className={styles.title} ref={(el) => (divs.current[0] = el)}>
        {copy.skills.title}
      </div>
      <div className={styles.des} ref={(el) => (divs.current[1] = el)}>
        {copy.skills.description}
      </div>
      <div className={styles.list}>
        {
          listSkills.map((value, key) => (
            <GlowCard
              className={styles.item}
              key={key}
              ref={(el) => (divs.current[key + 2] = el)}
              borderRadius={20}
            >
              <FontAwesomeIcon icon={value.icon} />
              <h3>{value.name}</h3>
              <div className={styles.des}>{language === 'zh' ? value.desZh : value.des}</div>
            </GlowCard>
          ))
        }
      </div>
    </section>
  )
})

export default Skills


