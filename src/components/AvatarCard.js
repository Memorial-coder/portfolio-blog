import React, { useRef, useState } from 'react';
import styles from '../styles/Home.module.css';
import ImageWithFallback from './ImageWithFallback';
import { useAppContext } from '../context/AppContext';
import { getCopy } from '../data/i18n';
import GlowCard from './GlowCard';

const AvatarCard = ({ variant = 'default' }) => {
    const { language, siteConfig } = useAppContext();
    const copy = getCopy(language);
    const isCompact = variant === 'compact';
    const cardRef = useRef(null);
    const [rotation, setRotation] = useState({ x: 0, y: 0 });
    const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });
    const [imageLoaded, setImageLoaded] = useState(false);

    const handleMouseMove = (e) => {
        const card = cardRef.current;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -10; // Max rotation 10deg
        const rotateY = ((x - centerX) / centerX) * 10;

        setRotation({ x: rotateX, y: rotateY });
        setGlare({ x: (x / rect.width) * 100, y: (y / rect.height) * 100, opacity: 1 });
    };

    const handleMouseLeave = () => {
        setRotation({ x: 0, y: 0 });
        setGlare(prev => ({ ...prev, opacity: 0 }));
    };

    return (
        <div className={`${styles.avatar} ${isCompact ? styles.avatarCompact : ''}`}>
            <GlowCard
                className={`${styles.card} ${isCompact ? styles.cardCompact : ''}`}
                ref={cardRef}
                onMouseMove={isCompact ? undefined : handleMouseMove}
                onMouseLeave={isCompact ? undefined : handleMouseLeave}
                borderRadius={isCompact ? 18 : 30}
                glowRadius={isCompact ? 26 : 45}
                edgeSensitivity={isCompact ? 14 : 18}
                animated={!isCompact}
                style={{
                    transform: isCompact
                        ? undefined
                        : `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
                }}
            >
                {/* Glare Effect */}
                <div
                    className={styles.glare}
                    style={{
                        background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,0.3) 0%, transparent 80%)`,
                        opacity: glare.opacity
                    }}
                ></div>

                {!imageLoaded && (
                    <div
                        className={styles.skeletonLoading}
                        style={{ height: isCompact ? '120px' : '450px', width: '100%', borderRadius: isCompact ? '14px' : '20px' }}
                    ></div>
                )}
                <ImageWithFallback
                    src={siteConfig.avatarUrl || '/avatar.jpg'}
                    alt="Portfolio avatar"
                    onLoad={() => setImageLoaded(true)}
                    style={{ display: imageLoaded ? 'block' : 'none' }}
                />
                <div className={styles.info}>
                    <div>{copy.home.cardLabels.role}</div>
                    <div>{siteConfig.roles?.[language] || siteConfig.role}</div>
                    <div>{copy.home.cardLabels.focus}</div>
                    <div>{siteConfig.focuses?.[language] || siteConfig.focus}</div>
                    <div>{copy.home.cardLabels.project}</div>
                    <div>{siteConfig.featuredProject}</div>
                </div>
            </GlowCard>
        </div>
    );
};

export default AvatarCard;
