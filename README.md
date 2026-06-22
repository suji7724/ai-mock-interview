# 🎯 AI Mock Interview Platform

An AI-powered mock interview platform that helps students, job seekers, and professionals prepare for technical and HR interviews through AI-generated questions, resume analysis, and personalized feedback.

---

## 🚀 Live Demo

**Frontend:** https://ai-mock-interview-alpha-cyan.vercel.app/

**Backend API:** https://ai-mock-interview-s5ou.onrender.com/

---

## 📌 Overview

The AI Mock Interview Platform simulates real interview experiences by generating role-specific interview questions, analyzing resumes, evaluating responses, and providing AI-driven feedback.
<img width="1366" height="768" alt="2026-06-21 (3)" src="https://github.com/user-attachments/assets/152f6ff3-4ba2-4e8c-a251-93a5aa06d9bc" />
<img width="1366" height="768" alt="2026-06-21 (2)" src="https://github.com/user-attachments/assets/fa3b10bd-90d1-4359-a66f-dc5cf82240e8" />
<img width="1366" height="768" alt="2026-06-21 (1)" src="https://github.com/user-attachments/assets/44fa0d00-f56a-4804-a377-79dcc5d87608" />
<img width="1366" height="768" alt="2026-06-21 (5)" src="https://github.com/user-attachments/assets/85490d3e-91e9-4fdc-888e-6262bdac3c60" />




The platform helps users:


* Practice technical and HR interviews
* Analyze resumes using AI
* Receive personalized interview feedback
* Track interview performance
* Improve communication and technical skills

---

## ✨ Features

### 🔐 Authentication

* User Registration
* Secure Login & Logout
* JWT Authentication
* Protected Routes

### 📄 Resume Analysis

* Upload Resume (PDF)
* AI-powered Resume Review
* Strength & Weakness Detection
* Improvement Suggestions
* Resume Analysis History

### 🎤 AI Mock Interview

* Role-based Interview Questions
* Dynamic AI Question Generation
* Realistic Interview Experience
* Technical & Behavioral Questions

### 📊 Performance Tracking

* Interview History
* Feedback Dashboard
* Performance Insights

### 📬 Contact Support

* User Contact Form
* Feedback Collection

---

## 🏗️ System Architecture

Frontend (React + Tailwind CSS)
↓
REST API (Django REST Framework)
↓
PostgreSQL Database
↓
AI Services
├── Google Gemini API
└── OpenRouter API

---

## 🛠️ Tech Stack

### Frontend

* React.js
* Tailwind CSS
* Axios
* React Router

### Backend

* Django
* Django REST Framework
* JWT Authentication
* Django CORS Headers

### Database

* PostgreSQL

### AI Integration

* Google Gemini API
* OpenRouter API

### Deployment

* Frontend: Vercel
* Backend: Render
* Database: Render PostgreSQL

---

## 📂 Project Architecture

┌─────────────────────────────────────────────────────────┐
│                        Client                           │
│          React.js + Vite + Tailwind CSS                 │
│     (Axios with JWT interceptors for token refresh)     │
└─────────────────────┬───────────────────────────────────┘
                      │ REST API (JSON)
┌─────────────────────▼───────────────────────────────────┐
│                       Backend                           │
│          Django + Django REST Framework                 │
│     SimpleJWT Auth | Gunicorn | WhiteNoise              │
│                                                         │
│   ┌─────────────────────────────────────────────────┐   │
│   │              AI Service Layer                   │   │
│   │  Primary: Google Gemini (gemini-2.0-flash)      │   │
│   │  Fallback: OpenRouter → DeepSeek-R1-Distill     │   │
│   └─────────────────────────────────────────────────┘   │
└─────────────────────┬───────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────┐
│                      Database                           │
│         SQLite (Dev) / PostgreSQL (Production)          │
└─────────────────────────────────────────────────────────┘


## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/your-username/your-repository.git
cd your-repository
```

### Frontend Setup

```bash
cd Frontend

npm install

npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

### Backend Setup

```bash
cd Backend

python -m venv venv

# Windows
venv\Scripts\activate

pip install -r requirements.txt

python manage.py migrate

python manage.py runserver
```

Backend runs on:

```text
http://127.0.0.1:8000
```

---



## 🔗 API Endpoints

### Authentication

```http
POST /api/users/register/
POST /api/users/login/
GET  /api/users/profile/
```

### Dashboard

```http
GET /api/users/dashboard/
```

### Resume Analysis

```http
POST /api/users/upload-resume/
POST /api/users/analyze-resume/
GET  /api/users/past-analyses/
```

### Contact

```http
POST /api/users/contact/
```

---

## 📈 Future Enhancements

* AI Voice Interviews
* Speech-to-Text Integration
* Interview Score Prediction
* Coding Assessment Module
* Video Interview Support
* Detailed Analytics Dashboard
* Admin Panel

---

## 🎯 Learning Outcomes

This project demonstrates:

* Full Stack Development
* REST API Development
* Authentication & Authorization
* AI Integration
* PostgreSQL Database Management
* Cloud Deployment
* Real-world Software Architecture

---

## 👨‍💻 Author

Sujit Shah

LinkedIn: https://www.linkedin.com/in/sujitshah-dev/

GitHub: https://github.com/suji7724

---

## 📜 License

This project is developed for educational and portfolio purposes.
