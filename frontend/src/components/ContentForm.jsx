import React, { useState } from 'react';

function ContentForm({ onGenerateContent, isLoading }) {
  const [topicName, setTopicName] = useState('');
  const [topicDescription, setTopicDescription] = useState('');
  const [difficultyLevel, setDifficultyLevel] = useState('intermediate');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (topicName.trim()) {
      onGenerateContent(topicName, topicDescription, difficultyLevel);
    }
  };

  return (
    <div className="content-form">
      <h2>Generate DSA Content</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="topicName">Topic Name: *</label>
          <input
            type="text"
            id="topicName"
            value={topicName}
            onChange={(e) => setTopicName(e.target.value)}
            placeholder="e.g., Binary Search Trees"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="difficultyLevel">Difficulty Level:</label>
          <select
            id="difficultyLevel"
            value={difficultyLevel}
            onChange={(e) => setDifficultyLevel(e.target.value)}
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="topicDescription">Additional Details (optional):</label>
          <textarea
            id="topicDescription"
            value={topicDescription}
            onChange={(e) => setTopicDescription(e.target.value)}
            placeholder="Add specific aspects you want covered, focus areas..."
            rows={5}
          />
        </div>
        
        <button type="submit" disabled={isLoading || !topicName.trim()}>
          {isLoading ? 'Generating...' : 'Generate Content'}
        </button>
      </form>
    </div>
  );
}

export default ContentForm;