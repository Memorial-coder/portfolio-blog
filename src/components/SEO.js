import React from 'react';
import { Helmet } from 'react-helmet-async';
import PropTypes from 'prop-types';
import { useAppContext } from '../context/AppContext';

const SEO = ({ title, description, type = 'website' }) => {
    const { siteConfig } = useAppContext();
    const siteTitle = siteConfig.seo?.title || siteConfig.name;
    const siteDescription = siteConfig.seo?.description || siteConfig.description;
    const siteKeywords = siteConfig.seo?.keywords || '';
    const siteUrl = window.location.origin;
    const ogImage = siteConfig.seo?.ogImage || siteConfig.avatarUrl || '/avatar.jpg';
    const siteImage = ogImage.startsWith('http') ? ogImage : siteUrl + ogImage;

    const currentTitle = title ? `${title} | ${siteConfig.name}` : siteTitle;
    const currentDescription = description || siteDescription;

    return (
        <Helmet>
            {/* Standard metadata */}
            <title>{currentTitle}</title>
            <meta name='description' content={currentDescription} />
            <meta name='keywords' content={siteKeywords} />

            {/* Open Graph / Facebook */}
            <meta property='og:type' content={type} />
            <meta property='og:title' content={currentTitle} />
            <meta property='og:description' content={currentDescription} />
            <meta property='og:image' content={siteImage} />

            {/* Twitter */}
            <meta name='twitter:card' content='summary_large_image' />
            <meta name='twitter:title' content={currentTitle} />
            <meta name='twitter:description' content={currentDescription} />
            <meta name='twitter:image' content={siteImage} />
        </Helmet>
    );
};

SEO.propTypes = {
    title: PropTypes.string,
    description: PropTypes.string,
    type: PropTypes.string,
};

export default SEO;
