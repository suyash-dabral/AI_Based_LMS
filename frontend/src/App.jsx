import React, { useState, useEffect } from 'react';
import './App.css';
import ContentForm from './components/ContentForm';
import ContentSection from './components/ContentSection';
import QuizSection from './components/QuizSection';
import ProgressionPlan from './components/ProgressionPlan';

function App() {
  const [activeTab, setActiveTab] = useState('form');
  const [generatedData, setGeneratedData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [topicHistory, setTopicHistory] = useState([]);

  // Fetch topic history on component mount
  useEffect(() => {
    const fetchTopicHistory = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/topic-history');
        if (response.ok) {
          const data = await response.json();
          setTopicHistory(data.topicHistory || []);
        }
      } catch (err) {
        console.error("Error fetching topic history:", err);
      }
    };

    fetchTopicHistory();
  }, []);

  const generateContent = async (topicName, topicDescription, difficultyLevel = 'intermediate') => {
    setIsLoading(true);
    setError(null);
    
    try {
      // First test if the API is accessible with a simple request
      const statusCheck = await fetch('http://localhost:5000/api/status', {
        method: 'GET',
      }).catch(err => {
        throw new Error(`API server not accessible: ${err.message}. Make sure your Flask server is running.`);
      });
      
      // If status check passes, proceed with the content generation
      const response = await fetch('http://localhost:5000/api/generate-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topicName, topicDescription, difficultyLevel }),
        credentials: 'include',
        mode: 'cors'
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Server error (${response.status}): ${errorData.error || 'Unknown error'}`);
      }
      
      const data = await response.json();
      setGeneratedData(data);
      setActiveTab('content');
      
      // Update local topic history
      fetchTopicHistory();
    } catch (err) {
      setError(`Error: ${err.message}`);
      console.error('Error details:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to fetch topic history
  const fetchTopicHistory = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/topic-history');
      if (response.ok) {
        const data = await response.json();
        setTopicHistory(data.topicHistory || []);
      }
    } catch (err) {
      console.error("Error fetching topic history:", err);
    }
  };

  // Function to determine active tab styling
  const getTabClass = (tabName) => {
    return activeTab === tabName ? 'active' : '';
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>DSA Educational Content Generator</h1>
        
        <div className="tab-navigation">
          <button 
            className={getTabClass('form')} 
            onClick={() => setActiveTab('form')}
          >
            Generate Content
          </button>
          
          <button 
            className={getTabClass('content')} 
            onClick={() => setActiveTab('content')}
            disabled={!generatedData}
          >
            Educational Content
          </button>
          
          <button 
            className={getTabClass('quiz')} 
            onClick={() => setActiveTab('quiz')}
            disabled={!generatedData}
          >
            Take Quiz
          </button>
          
          <button 
            className={getTabClass('progression')} 
            onClick={() => setActiveTab('progression')}
            disabled={!generatedData}
          >
            Weekly Plan
          </button>
        </div>
      </header>
      
      <main>
        {isLoading && <div className="loading">Generating content, please wait...</div>}
        
        {error && (
          <div className="error-container">
            <h3>Error Occurred</h3>
            <div className="error-message">{error}</div>
            <div className="error-help">
              <p>Common fixes:</p>
              <ul>
                <li>Make sure your Flask server is running on port 5000</li>
                <li>Check if your GEMINI_API_KEY is correctly set in the .env file</li>
                <li>Verify that Flask-CORS is correctly installed and configured</li>
              </ul>
            </div>
          </div>
        )}
        
        {activeTab === 'form' && (
          <>
            <ContentForm onGenerateContent={generateContent} isLoading={isLoading} />
            
            {topicHistory.length > 0 && (
              <div className="topic-history-section">
                <h3>Previously Generated Topics</h3>
                <div className="topic-history-list">
                  {topicHistory.map((item, index) => (
                    <div key={index} className="topic-history-item">
                      <h4>{item.topic}</h4>
                      <p className="topic-date">{formatDate(item.date)}</p>
                      {item.description && <p className="topic-description">{item.description}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
        
        {activeTab === 'content' && generatedData && (
          <ContentSection content={generatedData} />
        )}
        
        {activeTab === 'quiz' && generatedData && (
          <QuizSection questions={generatedData.testQuestions} />
        )}
        
        {activeTab === 'progression' && generatedData && (
          <ProgressionPlan plan={generatedData.progressionPlan} />
        )}
      </main>
    </div>
  );
}

export default App;