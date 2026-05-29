import React, { forwardRef } from 'react';
import BorderGlow from './BorderGlow';

const DEFAULT_COLORS = ['#c084fc', '#f472b6', '#38bdf8'];

const GlowCard = forwardRef(({
    children,
    className = '',
    borderRadius = 20,
    glowRadius = 32,
    edgeSensitivity = 24,
    glowIntensity = 0.65,
    fillOpacity = 0.18,
    animated = false,
    colors = DEFAULT_COLORS,
    ...props
}, ref) => (
    <BorderGlow
        ref={ref}
        className={className}
        borderRadius={borderRadius}
        glowRadius={glowRadius}
        edgeSensitivity={edgeSensitivity}
        glowIntensity={glowIntensity}
        fillOpacity={fillOpacity}
        backgroundColor="var(--bg-color)"
        glowColor="270 95 75"
        colors={colors}
        animated={animated}
        {...props}
    >
        {children}
    </BorderGlow>
));

GlowCard.displayName = 'GlowCard';

export default GlowCard;
