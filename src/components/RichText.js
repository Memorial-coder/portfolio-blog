import React from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import '../styles/RichText.css';

const RichText = ({ content = '', className = '', compact = false, components = {} }) => {
    const classes = ['rich-text', compact ? 'rich-text--compact' : '', className].filter(Boolean).join(' ');

    return (
        <div className={classes}>
            <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkBreaks]}
                rehypePlugins={[rehypeRaw]}
                components={components}
            >
                {content || ''}
            </ReactMarkdown>
        </div>
    );
};

RichText.propTypes = {
    content: PropTypes.string,
    className: PropTypes.string,
    compact: PropTypes.bool,
    components: PropTypes.object,
};

export default RichText;
