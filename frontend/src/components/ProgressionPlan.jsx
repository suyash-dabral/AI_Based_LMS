import React, { useState } from 'react';

function ProgressionPlan({ plan }) {
  const [activeWeek, setActiveWeek] = useState(1);

  if (!plan || !plan.weeklyPlan) {
    return <div className="progression-plan-empty">No progression plan available</div>;
  }

  return (
    <div className="progression-plan">
      <h2>Weekly Learning Progression</h2>
      
      <div className="week-tabs">
        {plan.weeklyPlan.map((week) => (
          <button
            key={week.week}
            className={activeWeek === week.week ? 'active' : ''}
            onClick={() => setActiveWeek(week.week)}
          >
            Week {week.week}
          </button>
        ))}
      </div>
      
      {plan.weeklyPlan.map((week) => (
        <div 
          key={week.week} 
          className={`week-content ${activeWeek === week.week ? 'active' : 'hidden'}`}
        >
          <h3>Week {week.week}: {week.focus}</h3>
          
          <div className="plan-section">
            <h4>Topics to Study</h4>
            <ul>
              {week.topics.map((topic, index) => (
                <li key={index}>{topic}</li>
              ))}
            </ul>
          </div>
          
          <div className="plan-section">
            <h4>Practice Problems</h4>
            <ul>
              {week.practiceProblems.map((problem, index) => (
                <li key={index}>{problem}</li>
              ))}
            </ul>
          </div>
          
          <div className="plan-section">
            <h4>Learning Objectives</h4>
            <ul>
              {week.objectives.map((objective, index) => (
                <li key={index}>{objective}</li>
              ))}
            </ul>
          </div>
        </div>
      ))}
      
      <div className="recommended-topics">
        <h4>Recommended Next Topics</h4>
        <div className="topic-tags">
          {plan.recommendedNextTopics.map((topic, index) => (
            <span key={index} className="topic-tag">{topic}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProgressionPlan;