# 🧠 Pathinfy - Personalized AI-Powered Learning Platform for DSA

Pathinfy is an AI-driven Learning Management System (LMS) that helps users master Data Structures and Algorithms through personalized learning paths, dynamic quizzes, and topic recommendations — all powered by Google's Gemini API and hosted on Google Cloud.

> 🌐 [Live Demo](https://react-frontend-1003322454840.us-west4.run.app)  
> ✨ Built using **React**, **Flask**, **Gemini API**, and **Google Cloud**

---

## 🧩 Problem Statement

In today's fast-paced tech world, students and self-learners often struggle with:
- A **lack of structure** in online resources.
- **Overwhelming content** that’s not personalized.
- No clear learning path for mastering DSA.
- Limited tools to **test progress** or receive feedback.

---

## 🎯 What Pathinfy Solves

Pathinfy aims to enhance learning by:
- Providing **custom AI-generated content** on any DSA topic.
- Offering **quizzes with explanations** to test understanding.
- Delivering a **4-week learning roadmap** tailored to the user’s level.
- Suggesting the **next logical topics** to learn.
- Keeping track of the user’s **learning history**.

---

## 🚀 Features

### 1️⃣ Topic-Based Input
Users enter:
- **Topic Name** (e.g., Trees, Graphs)
- **Difficulty Level** (Beginner, Intermediate, Advanced)
- Any **additional focus points** (e.g., "Tree traversal only")

---

### 2️⃣ Gemini API-Powered Content
- Auto-generates structured learning material
- Includes **theory**, **code examples**, and **real-life applications**
- Content is accurate, focused, and simplified

---

### 3️⃣ Auto-Generated Quiz
- Generated from the AI content
- Tests user’s understanding
- Shows:
  - Score
  - Right/wrong answers
  - **Explanation** for each question

---

### 4️⃣ 4-Week Personalized Learning Plan
- Topic-specific roadmap
- Weekly schedule with subtopics
- **Practice questions and coding tasks** provided each week

---

### 5️⃣ Next Topic Recommendations
- Suggests what to learn next
- Builds a **natural progression** in the DSA journey

---

### 6️⃣ Previous Search History
- Lists previously generated topics
- Users can revisit older content
- History is shown on the homepage

---

## 🛠️ Tech Stack

| Layer      | Technology              |
|------------|--------------------------|
| Frontend   | React.js                 |
| Backend    | Flask (Python)           |
| AI Engine  | Gemini API (Google AI)   |
| Hosting    | Google Cloud Run         |
| Styling    | CSS3 / Tailwind (Optional) |

---

## 🧪 How It Works

1. User submits a topic, difficulty, and focus.
2. Flask backend sends this info to Gemini API.
3. Gemini responds with:
   - Learning content
   - Quiz
   - Learning path
   - Recommendations
4. Backend formats this and sends to React frontend.
5. Frontend displays the:
   - Topic overview
   - AI-generated quiz and results
   - 4-week plan
   - Suggested next topics
6. History of previous topics is stored and shown on homepage.

---

## 🛣️ Future Improvements

- 🔐 Add user authentication & progress tracking
- 📊 Dashboard with user analytics
- 📽️ Integrate YouTube tutorials based on topic
- 🗃️ Use Firestore/SQLite to persist user sessions
- 🎯 Add goal-setting and reminder features
- 🧑‍🏫 Introduce a mentor/assistant bot powered by LLMs

---



