import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/NotFound.css';
import { useAppContext } from '../context/AppContext';
import { getCopy } from '../data/i18n';

const NotFound = () => {
    const { language, siteConfig } = useAppContext();
    const copy = getCopy(language);

    React.useEffect(() => {
        document.title = `404 ${copy.notFound.title} | ${siteConfig.name}`;
    }, [copy.notFound.title, siteConfig.name]);

    return (
        <div className="not-found-container">
            <div className="glitch-wrapper">
                <h1 className="glitch" data-text="404">404</h1>
            </div>
            <h2>{copy.notFound.title}</h2>
            <p>{copy.notFound.description}</p>
            <Link to="/" className="home-btn">
                {copy.notFound.cta}
            </Link>
        </div>
    );
};

export default NotFound;
