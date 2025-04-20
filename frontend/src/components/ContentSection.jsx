import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';



function ContentSection({ content }) {
  const [activeSection, setActiveSection] = useState(null);

  // Function to calculate estimated read time
  const calculateReadTime = (text) => {
    const wordsPerMinute = 200;
    const wordCount = text.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  };

  // Extract headings from markdown content for the table of contents
  const extractHeadings = (markdownText) => {
    const headingRegex = /^(#{1,3})\s+(.+)$/gm;
    const headings = [];
    let match;
    
    while ((match = headingRegex.exec(markdownText)) !== null) {
      const level = match[1].length;
      const text = match[2].trim();
      const id = text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
      
      headings.push({ level, text, id });
    }
    
    return headings;
  };

  const headings = extractHeadings(content.educationalContent);
  const readTime = calculateReadTime(content.educationalContent);

  // Custom components for ReactMarkdown
  const components = {
    code({ node, inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || '');
      return !inline && match ? (
        <SyntaxHighlighter
          style={vscDarkPlus}
          language={match[1]}
          PreTag="div"
          {...props}
        >
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      ) : (
        <code className={className} {...props}>
          {children}
        </code>
      );
    },
    h1: ({ node, ...props }) => <h1 id={props.children.toString().toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')} {...props} />,
    h2: ({ node, ...props }) => <h2 id={props.children.toString().toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')} {...props} />,
    h3: ({ node, ...props }) => <h3 id={props.children.toString().toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')} {...props} />
  };

  // Toggle section collapse
  const toggleSection = (id) => {
    if (activeSection === id) {
      setActiveSection(null);
    } else {
      setActiveSection(id);
      // Scroll to the section
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="content-section">
      <div className="content-header">
        <h1>{content.topicName}</h1>
        <div className="read-time-badge">
          <span>{readTime} min read</span>
        </div>
      </div>

      <div className="content-layout">
        {/* Table of Contents Sidebar */}
        <div className="toc-sidebar">
          <div className="toc-header">
            <h3>Table of Contents</h3>
          </div>
          <ul className="toc-list">
            {headings.map((heading, index) => (
              <li 
                key={index} 
                className={`toc-item level-${heading.level} ${activeSection === heading.id ? 'active' : ''}`}
                style={{ paddingLeft: `${(heading.level - 1) * 15}px` }}
              >
                <button onClick={() => toggleSection(heading.id)}>
                  {heading.text}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Main Content */}
        <div className="main-content">
          <div className="markdown-container">
            <ReactMarkdown components={components}>
              {content.educationalContent}
            </ReactMarkdown>
          </div>

          <div className="action-buttons">
            <button 
              className="next-button"
              onClick={() => window.location.hash = "#quiz"} // Navigate to quiz section
            >
              Take the Quiz →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContentSection;