import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const ImageWithFallback = ({ src, alt, fallbackSrc = '/placeholder.webp', ...props }) => {
    const [imgSrc, setImgSrc] = useState(src);
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        setImgSrc(src);
        setHasError(false);
    }, [src]);

    const handleError = () => {
        if (!hasError) {
            setHasError(true);
            setImgSrc(fallbackSrc);
        }
    };

    return (
        <img
            src={imgSrc}
            alt={alt}
            onError={handleError}
            {...props}
        />
    );
};

ImageWithFallback.propTypes = {
    src: PropTypes.string.isRequired,
    alt: PropTypes.string.isRequired,
    fallbackSrc: PropTypes.string,
};

export default ImageWithFallback;
