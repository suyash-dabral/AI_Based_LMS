import React from 'react';
import ReactMarkdown from 'react-markdown';

function ContentDisplay({ content }) {
  // Function to create the estimated read time
  const calculateReadTime = (text) => {
    const wordsPerMinute = 200;
    const wordCount = text.split(/\s+/).length;
    const readTime = Math.ceil(wordCount / wordsPerMinute);
    return readTime;
  };

  const readTime = calculateReadTime(content.educationalContent);

  return (
    <div className="content-display">
      <div className="content-header" style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '20px',
        borderBottom: '1px solid #eee',
        paddingBottom: '15px'
      }}>
        <h2>{content.topicName}</h2>
        <div className="read-time" style={{ 
          backgroundColor: 'rgba(108, 99, 255, 0.1)', 
          color: 'var(--primary)', 
          padding: '6px 12px', 
          borderRadius: '20px', 
          fontSize: '14px',
          fontWeight: '600' 
        }}>
          {readTime} min read
        </div>
      </div>
      <div className="markdown-content">
        <ReactMarkdown>{content.educationalContent}</ReactMarkdown>
      </div>
    </div>
  );
}

export default ContentDisplay;