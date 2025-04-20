import React, { useState } from 'react';

function QuizSection({ questions }) {
  const [currentAnswers, setCurrentAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  const handleAnswerSelect = (questionIndex, option) => {
    setCurrentAnswers({
      ...currentAnswers,
      [questionIndex]: option.charAt(0),
    });
  };

  const handleSubmit = () => {
    let totalScore = 0;
    
    questions.forEach((question, index) => {
      if (currentAnswers[index] === question.correctAnswer) {
        totalScore += 1;
      }
    });
    
    setScore(totalScore);
    setShowResults(true);
  };

  const resetQuiz = () => {
    setCurrentAnswers({});
    setShowResults(false);
    setScore(0);
  };

  // Calculate completion percentage
  const completionPercentage = Object.keys(currentAnswers).length / questions.length * 100;

  return (
    <div className="quiz-section">
      <h2>Quiz - Test Your Knowledge</h2>
      
      {showResults ? (
        <div className="quiz-results">
          <h3>Your Score: {score} / {questions.length}</h3>
          <p>{Math.round((score / questions.length) * 100)}%</p>
          
          <button onClick={resetQuiz} className="reset-btn">
            Retake Quiz
          </button>
          
          <div className="results-breakdown">
            <h4>Results Breakdown:</h4>
            {questions.map((question, index) => {
              const isCorrect = currentAnswers[index] === question.correctAnswer;
              
              return (
                <div key={index} className={`question-result ${isCorrect ? 'correct' : 'incorrect'}`}>
                  <p><strong>Question {index + 1}:</strong> {question.question}</p>
                  <p>Your answer: {currentAnswers[index] ? `${currentAnswers[index]}. ${question.options.find(opt => opt.startsWith(currentAnswers[index])).substring(3)}` : 'No answer'}</p>
                  <p>Correct answer: {question.correctAnswer}. {question.options.find(opt => opt.startsWith(question.correctAnswer)).substring(3)}</p>
                  <p><strong>Explanation:</strong> {question.explanation}</p>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <>
          <div className="progress-bar" style={{ 
            height: '6px', 
            background: '#eee', 
            borderRadius: '3px', 
            marginBottom: '20px',
            overflow: 'hidden'
          }}>
            <div style={{ 
              width: `${completionPercentage}%`, 
              height: '100%', 
              background: 'var(--gradient)', 
              transition: 'width 0.3s ease' 
            }}></div>
          </div>
          
          <div className="progress-text" style={{ 
            textAlign: 'right', 
            fontSize: '14px', 
            marginBottom: '20px', 
            color: '#666' 
          }}>
            {Object.keys(currentAnswers).length} of {questions.length} questions answered
          </div>
          
          <div className="questions-list">
            {questions.map((question, index) => (
              <div key={index} className="question-card">
                <p className="question-text"><strong>Question {index + 1}:</strong> {question.question}</p>
                <div className="options-list">
                  {question.options.map((option, optIndex) => (
                    <div key={optIndex} className="option">
                      <input
                        type="radio"
                        id={`q${index}-opt${optIndex}`}
                        name={`question-${index}`}
                        checked={currentAnswers[index] === option.charAt(0)}
                        onChange={() => handleAnswerSelect(index, option)}
                      />
                      <label htmlFor={`q${index}-opt${optIndex}`}>{option}</label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          <button 
            onClick={handleSubmit} 
            disabled={Object.keys(currentAnswers).length !== questions.length}
            className="submit-btn"
          >
            Submit Quiz
          </button>
        </>
      )}
    </div>
  );
}

export default QuizSection;