from flask import Flask, request, jsonify, make_response
import os
import google.generativeai as genai
from flask_cors import CORS
import json
from dotenv import load_dotenv
import datetime

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)

# Configure CORS - simplify configuration
CORS(app, resources={r"/*": {"origins": "http://localhost:3000", "supports_credentials": True}})

# Configure Gemini API
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel('gemini-1.5-pro')

# Store previously generated topics to inform future content
topic_history = []

@app.route('/api/generate-content', methods=['POST', 'OPTIONS'])
def generate_content():
    # Handle preflight OPTIONS request
    if request.method == 'OPTIONS':
        response = make_response()
        response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
        response.headers.add('Access-Control-Allow-Methods', 'POST')
        response.headers.add('Access-Control-Allow-Credentials', 'true')
        return response
    
    data = request.json
    topic_name = data.get('topicName', '')
    topic_description = data.get('topicDescription', '')
    difficulty_level = data.get('difficultyLevel', 'intermediate')  # Default to intermediate
    
    # Update topic history (keep last 5)
    global topic_history
    topic_history.append({"topic": topic_name, "description": topic_description, "date": datetime.datetime.now().isoformat()})
    if len(topic_history) > 5:
        topic_history = topic_history[-5:]
    
    # Generate educational content with improved prompt
    content_prompt = f"""
    You are a Data Structures and Algorithms expert creating comprehensive educational content for the topic: "{topic_name}".
    
    Additional details provided: {topic_description}
    
    Difficulty level: {difficulty_level}
    
    Previously covered topics (for reference): {json.dumps(topic_history[:-1]) if len(topic_history) > 1 else "None"}
    
    GUIDELINES FOR EXCELLENT CONTENT:
    
    1. STRUCTURE:
       - Start with a clear, concise introduction that explains what {topic_name} is and why it's important
       - Include a "Prerequisites" section listing concepts students should understand first
       - Organize content with clear headings and subheadings
       - Conclude with a summary and "Next Steps" section
    
    2. EXPLANATION:
       - Explain concepts using both formal definitions and intuitive analogies
       - Use real-world examples that demonstrate practical applications
       - Include visual descriptions (e.g., how a tree structure would look, how an algorithm processes data)
       - Explain the "why" behind each concept, not just the "what" and "how"
    
    3. CODE EXAMPLES:
       - Provide clean, well-commented Python implementations
       - Include step-by-step explanations of how the code works
       - Show both naive and optimized approaches when relevant
       - Include example usage with sample inputs and outputs
    
    4. COMPLEXITY ANALYSIS:
       - Provide detailed time and space complexity analyses
       - Explain the derivation of Big O notation clearly
       - Compare efficiency with alternative approaches
       - Discuss best, average, and worst-case scenarios
    
    5. COMMON PITFALLS:
       - Identify common mistakes and misconceptions
       - Provide debugging strategies for typical errors
       - Suggest best practices for implementation
    
    Format the response in markdown with proper code blocks, headings, lists, and emphasis where appropriate.
    Ensure code examples are complete, runnable, and thoroughly commented.
    """
    
    # Generate quiz questions with improved prompt
    questions_prompt = f"""
    Create 10 high-quality multiple-choice questions to test understanding of the Data Structures and Algorithms topic: "{topic_name}".
    
    Difficulty level: {difficulty_level}
    
    GUIDELINES FOR EFFECTIVE QUESTIONS:
    
    1. QUESTION DISTRIBUTION:
       - 3 questions testing recall and basic understanding
       - 4 questions requiring application of concepts
       - 3 questions demanding analysis or evaluation
    
    2. QUESTION QUALITY:
       - Ensure questions test conceptual understanding, not just memorization
       - Include questions about time/space complexity analysis
       - Include questions about edge cases and optimizations
       - Include questions about real-world applications
       - Include at least one question comparing this topic with related concepts
    
    3. ANSWER CHOICES:
       - Make all options plausible (no obviously wrong answers)
       - Include common misconceptions as incorrect options
       - Ensure only one answer is clearly correct
       - Make options of similar length and detail
    
    4. EXPLANATIONS:
       - Provide thorough explanations for why the correct answer is right
       - Explain why each incorrect option is wrong
       - Reference relevant concepts from the educational content
    
    Return the questions in the following JSON format:
    [
      {{
        "question": "Clear, specific question text",
        "options": ["A. Option A", "B. Option B", "C. Option C", "D. Option D"],
        "correctAnswer": "A",
        "explanation": "Detailed explanation of why A is correct and why B, C, and D are incorrect"
      }},
      ...
    ]
    
    Ensure the JSON is valid and properly formatted with exactly 10 questions.
    """
    
    try:
        # Generate content
        content_response = model.generate_content(content_prompt)
        educational_content = content_response.text
        
        # Generate questions
        questions_response = model.generate_content(questions_prompt)
        
        # Parse the response to extract JSON
        response_text = questions_response.text
        
        # Handle different markdown code block formats
        if "```json" in response_text:
            json_str = response_text.split("```json")[1].split("```")[0].strip()
        elif "```" in response_text:
            json_str = response_text.split("```")[1].split("```")[0].strip()
        else:
            json_str = response_text.strip()
        
        try:
            test_questions = json.loads(json_str)
        except json.JSONDecodeError:
            # If JSON parsing fails, create a structured error response
            return jsonify({
                "error": "Failed to parse AI response as JSON",
                "rawResponse": response_text
            }), 500
        
        # Generate progression plan based on topic
        progression_prompt = f"""
        Based on the Data Structures and Algorithms topic "{topic_name}", create a weekly progression plan for students.
        
        Previous topics covered (if any): {json.dumps(topic_history[:-1]) if len(topic_history) > 1 else "None"}
        
        Create a 4-week study plan that:
        1. Builds foundational knowledge in week 1
        2. Introduces advanced concepts in week 2
        3. Focuses on practical applications in week 3
        4. Covers optimization and related topics in week 4
        
        For each week, suggest:
        - Topics to study
        - Practice problems (2-3 specific examples)
        - Learning objectives
        
        Return the plan in JSON format:
        {{
          "weeklyPlan": [
            {{
              "week": 1,
              "focus": "Foundations",
              "topics": ["Topic 1", "Topic 2", ...],
              "practiceProblems": ["Problem description 1", "Problem description 2", ...],
              "objectives": ["Objective 1", "Objective 2", ...]
            }},
            ...
          ],
          "recommendedNextTopics": ["Topic 1", "Topic 2", "Topic 3"]
        }}
        """
        
        progression_response = model.generate_content(progression_prompt)
        
        # Parse progression plan JSON
        prog_response_text = progression_response.text
        
        if "```json" in prog_response_text:
            prog_json_str = prog_response_text.split("```json")[1].split("```")[0].strip()
        elif "```" in prog_response_text:
            prog_json_str = prog_response_text.split("```")[1].split("```")[0].strip()
        else:
            prog_json_str = prog_response_text.strip()
        
        try:
            progression_plan = json.loads(prog_json_str)
        except json.JSONDecodeError:
            # If parsing fails, create a simple progression plan
            progression_plan = {
                "weeklyPlan": [
                    {"week": 1, "focus": "Understanding Basics", "topics": [topic_name], "practiceProblems": ["Practice with examples"], "objectives": ["Master fundamentals"]}
                ],
                "recommendedNextTopics": ["Related topic 1", "Related topic 2"]
            }
        
        # Return combined content
        return jsonify({
            "topicName": topic_name,
            "educationalContent": educational_content,
            "testQuestions": test_questions,
            "progressionPlan": progression_plan,
            "generatedDate": datetime.datetime.now().isoformat()
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/topic-history', methods=['GET'])
def get_topic_history():
    return jsonify({"topicHistory": topic_history})

@app.route('/test-cors', methods=['GET', 'OPTIONS'])
def test_cors():
    return jsonify({"message": "CORS is working!"})

@app.route('/api/status', methods=['GET'])
def status():
    return jsonify({"status": "API is running"})

if __name__ == '__main__':
    app.run(debug=True, port=5000, host='0.0.0.0')