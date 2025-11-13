# Smart Exam Simulator

A comprehensive exam preparation application designed to help users practice and analyze their performance on multiple-choice questions. Built for personal use to assist family members in preparing for standardized examinations with detailed timing analytics and performance insights.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![Django](https://img.shields.io/badge/Django-5.x-092E20?logo=django)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?logo=tailwind-css)

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [System Requirements](#system-requirements)
- [Installation](#installation)
- [Project Structure](#project-structure)
- [Usage](#usage)
- [Database Schema](#database-schema)
- [API Endpoints](#api-endpoints)
- [Configuration](#configuration)
- [Development](#development)
- [Troubleshooting](#troubleshooting)
- [Future Enhancements](#future-enhancements)
- [License](#license)

## ✨ Features

### Core Functionality
- **225 Multiple Choice Questions**: Balanced distribution across 9 categories (25 questions per category)
- **4.5 Hour Examination Timer**: Countdown timer that stops when time expires
- **Per-Question Time Tracking**: Records time spent on each individual question
- **Pause/Resume Functionality**: Global pause button for both examination and question timers
- **Manual Category Correction**: Users can reassign questions to correct categories via dropdown
- **Timer Freeze During Categorization**: Both timers pause when correcting categories

### Reporting & Analytics
- **Comprehensive Final Report**:
  - Total questions attempted
  - Total questions not attempted
  - Total score (correct answers)
  - Percentage score
  - Category-wise performance bar graph
  - Detailed question review with:
    - All answer choices displayed
    - Correct answer highlighted in green
    - User's answer highlighted in red (if incorrect)
    - Detailed explanations for each question
    - Time spent per question

### User Experience
- **Material Design 3 Theme**: Clean, modern interface following Material You guidelines
- **Smooth Animations**: Framer Motion powered transitions and interactions
- **Responsive Design**: Tailwind CSS 4 for mobile-first, adaptive layouts
- **Progress Persistence**: SQLite database stores all attempt history

## 🛠 Tech Stack

### Frontend
- **React 19**: Latest React with concurrent features and improved performance
- **Tailwind CSS 4**: Utility-first CSS framework with new features
- **Framer Motion**: Production-ready motion library for React
- **Material Design 3**: Color system and design tokens
- **TanStack Router** (recommended): Type-safe routing solution

### Backend
- **Django 5.x**: High-level Python web framework
- **Django REST Framework**: Powerful and flexible toolkit for building Web APIs
- **SQLite**: Lightweight, file-based database (suitable for personal use)
- **Python 3.11+**: Modern Python with type hints support

### Development Tools
- **Vite**: Next-generation frontend build tool
- **TypeScript**: Type-safe JavaScript
- **ESLint & Prettier**: Code quality and formatting
- **Django Debug Toolbar**: Backend debugging

## 💻 System Requirements

- **Node.js**: v18.x or higher
- **Python**: 3.11 or higher
- **npm/pnpm/yarn**: Latest stable version
- **Git**: For version control
- **Operating System**: Windows, macOS, or Linux

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/exam-prep-tracker.git
cd exam-prep-tracker
```

### 2. Backend Setup (Django)

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env

# Run migrations
python manage.py makemigrations
python manage.py migrate

# Create superuser (optional)
python manage.py createsuperuser

# Load sample questions (if seed data exists)
python manage.py loaddata questions.json

# Start development server
python manage.py runserver
```

Backend will run on `http://localhost:8000`

### 3. Frontend Setup (React)

```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install
# or
pnpm install

# Create .env file
cp .env.example .env

# Start development server
npm run dev
# or
pnpm dev
```

Frontend will run on `http://localhost:5173`

## 📁 Project Structure

```
exam-prep-tracker/
├── backend/
│   ├── api/
│   │   ├── models.py          # Database models
│   │   ├── serializers.py     # DRF serializers
│   │   ├── views.py           # API views
│   │   ├── urls.py            # API routes
│   │   └── admin.py           # Django admin config
│   ├── core/
│   │   ├── settings.py        # Django settings
│   │   ├── urls.py            # Root URL config
│   │   └── wsgi.py
│   ├── manage.py
│   ├── requirements.txt
│   └── db.sqlite3
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ExamTimer.tsx
│   │   │   ├── QuestionCard.tsx
│   │   │   ├── CategorySelector.tsx
│   │   │   ├── ProgressBar.tsx
│   │   │   └── FinalReport.tsx
│   │   ├── pages/
│   │   │   ├── ExamPage.tsx
│   │   │   ├── ReportPage.tsx
│   │   │   └── HomePage.tsx
│   │   ├── hooks/
│   │   │   ├── useTimer.ts
│   │   │   ├── useExamState.ts
│   │   │   └── useQuestions.ts
│   │   ├── services/
│   │   │   └── api.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   ├── utils/
│   │   │   └── helpers.ts
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── public/
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── tsconfig.json
│
├── README.md
├── .gitignore
└── LICENSE
```

## 📖 Usage

### Starting an Exam

1. **Launch Application**: Open `http://localhost:5173`
2. **Start Exam**: Click "Begin Exam" button
3. **Timer Starts**: Both examination timer (4:30:00) and question timer (00:00:00) begin
4. **Answer Questions**: Select one of four choices for each question
5. **Navigate**: Use "Next" and "Previous" buttons to move between questions

### During the Exam

#### Correcting Question Categories
1. Click on the category dropdown above the question
2. Select the correct category from 9 options
3. Both timers automatically pause
4. After selection, timers resume automatically

#### Pausing the Exam
1. Click the "Pause" button in the header
2. Both examination and question timers freeze
3. Click "Resume" to continue
4. Time continues from where it stopped

#### Question Navigation
- **Next Button**: Moves to the next question, saves answer and time
- **Previous Button**: Returns to previous question
- **Question Grid**: Jump to any question directly (optional feature)

### Submitting the Exam

The exam can be submitted in two ways:
1. **Manual Submission**: Click "Submit Exam" button
2. **Automatic Submission**: When 4 hours 30 minutes expires

### Viewing the Report

After submission, the comprehensive report displays:

#### Summary Statistics
- Total Questions: 225
- Questions Attempted: [count]
- Questions Not Attempted: [count]
- Correct Answers: [count]
- Score Percentage: [XX.XX%]

#### Category Performance Graph
- Interactive bar chart showing performance across 9 categories
- Hover to see exact numbers
- Identifies weak areas needing improvement

#### Detailed Question Review
For each question:
- Question text and number
- All four answer choices
- ✅ Correct answer (highlighted in green)
- ❌ Your answer (highlighted in red if incorrect)
- 📝 Detailed explanation
- ⏱️ Time spent on question
- 🏷️ Category assigned

## 🗄️ Database Schema

### Question Model
```python
class Question(models.Model):
    id = models.AutoField(primary_key=True)
    question_text = models.TextField()
    option_a = models.CharField(max_length=500)
    option_b = models.CharField(max_length=500)
    option_c = models.CharField(max_length=500)
    option_d = models.CharField(max_length=500)
    correct_answer = models.CharField(max_length=1)  # 'a', 'b', 'c', or 'd'
    category = models.CharField(max_length=100)
    explanation = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
```

### ExamAttempt Model
```python
class ExamAttempt(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.CharField(max_length=100)  # Simple identifier
    start_time = models.DateTimeField(auto_now_add=True)
    end_time = models.DateTimeField(null=True, blank=True)
    total_time_seconds = models.IntegerField(default=0)
    is_completed = models.BooleanField(default=False)
```

### QuestionResponse Model
```python
class QuestionResponse(models.Model):
    exam_attempt = models.ForeignKey(ExamAttempt, on_delete=models.CASCADE)
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    user_answer = models.CharField(max_length=1, null=True)  # 'a', 'b', 'c', 'd', or None
    corrected_category = models.CharField(max_length=100, null=True)
    time_spent_seconds = models.IntegerField(default=0)
    is_correct = models.BooleanField(default=False)
    answered_at = models.DateTimeField(null=True, blank=True)
```

## 🔌 API Endpoints

### Questions

#### Get Exam Questions
```http
GET /api/questions/exam-set/
```
Returns 225 balanced questions (25 from each of 9 categories)

**Response:**
```json
{
  "questions": [
    {
      "id": 1,
      "question_text": "The best predictor of treatment outcome...",
      "option_a": "age",
      "option_b": "ethnicity",
      "option_c": "history of criminal behavior",
      "option_d": "severity of substance abuse problems",
      "correct_answer": "d",
      "category": "Substance Abuse",
      "explanation": "Most studies have found..."
    }
  ]
}
```

### Exam Attempts

#### Start New Exam
```http
POST /api/exam-attempts/start/
```

**Request Body:**
```json
{
  "user": "family_member_name"
}
```

**Response:**
```json
{
  "id": 1,
  "start_time": "2025-01-15T10:30:00Z",
  "questions": [...]
}
```

#### Submit Answer
```http
POST /api/exam-attempts/{attempt_id}/answer/
```

**Request Body:**
```json
{
  "question_id": 1,
  "user_answer": "d",
  "time_spent_seconds": 45,
  "corrected_category": "Substance Abuse"  // optional
}
```

#### Complete Exam
```http
POST /api/exam-attempts/{attempt_id}/complete/
```

**Request Body:**
```json
{
  "total_time_seconds": 16200
}
```

#### Get Report
```http
GET /api/exam-attempts/{attempt_id}/report/
```

**Response:**
```json
{
  "summary": {
    "total_questions": 225,
    "attempted": 220,
    "not_attempted": 5,
    "correct": 180,
    "percentage": 80.0
  },
  "category_performance": [
    {
      "category": "Substance Abuse",
      "correct": 20,
      "total": 25,
      "percentage": 80.0
    }
  ],
  "detailed_responses": [...]
}
```

## ⚙️ Configuration

### Backend (.env)
```env
# Django Settings
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Database (SQLite - no additional config needed)
DATABASE_NAME=db.sqlite3

# CORS Settings
CORS_ALLOWED_ORIGINS=http://localhost:5173

# Django REST Framework
REST_FRAMEWORK_PAGE_SIZE=225
```

### Frontend (.env)
```env
# API Configuration
VITE_API_BASE_URL=http://localhost:8000/api

# App Configuration
VITE_EXAM_DURATION_MINUTES=270
VITE_TOTAL_QUESTIONS=225
VITE_QUESTIONS_PER_CATEGORY=25
```

### Tailwind CSS 4 Theme (global.css)
```css
@import "tailwindcss";

@theme {
  /* Material Design 3 Color Tokens */
  --color-primary: #6750A4;
  --color-on-primary: #FFFFFF;
  --color-primary-container: #EADDFF;
  --color-on-primary-container: #21005D;
  
  --color-secondary: #625B71;
  --color-on-secondary: #FFFFFF;
  --color-secondary-container: #E8DEF8;
  --color-on-secondary-container: #1D192B;
  
  --color-tertiary: #7D5260;
  --color-on-tertiary: #FFFFFF;
  --color-tertiary-container: #FFD8E4;
  --color-on-tertiary-container: #31111D;
  
  --color-error: #B3261E;
  --color-on-error: #FFFFFF;
  --color-error-container: #F9DEDC;
  --color-on-error-container: #410E0B;
  
  --color-surface: #FEF7FF;
  --color-on-surface: #1D1B20;
  --color-surface-variant: #E7E0EC;
  --color-on-surface-variant: #49454F;
  
  --color-outline: #79747E;
  --color-outline-variant: #CAC4D0;
}
```

## 🔧 Development

### Running Tests

#### Backend Tests
```bash
cd backend
python manage.py test
```

#### Frontend Tests
```bash
cd frontend
npm run test
```

### Code Quality

#### Backend Linting
```bash
cd backend
flake8 .
black .
```

#### Frontend Linting
```bash
cd frontend
npm run lint
npm run format
```

### Building for Production

#### Backend
```bash
cd backend
python manage.py collectstatic
gunicorn core.wsgi:application
```

#### Frontend
```bash
cd frontend
npm run build
# Output in dist/ directory
```

## 🐛 Troubleshooting

### Common Issues

#### Port Already in Use
```bash
# Backend
lsof -ti:8000 | xargs kill -9

# Frontend
lsof -ti:5173 | xargs kill -9
```

#### Database Migrations Not Working
```bash
cd backend
python manage.py migrate --run-syncdb
python manage.py makemigrations --empty api
```

#### CORS Errors
- Verify `CORS_ALLOWED_ORIGINS` in backend `.env`
- Check `VITE_API_BASE_URL` in frontend `.env`
- Ensure Django CORS middleware is installed

#### Timer Not Pausing
- Check browser console for JavaScript errors
- Verify React state management in `useTimer` hook
- Ensure API calls are completing successfully

#### Questions Not Loading
- Verify backend server is running
- Check database has questions: `python manage.py shell`
  ```python
  from api.models import Question
  Question.objects.count()
  ```
- Seed database if empty: `python manage.py loaddata questions.json`

## 🚧 Future Enhancements

### Planned Features
- [ ] Multiple user profiles with authentication
- [ ] Practice mode (unlimited time, instant feedback)
- [ ] Question bookmarking for review
- [ ] Custom exam creation (select categories/count)
- [ ] Historical performance tracking over multiple attempts
- [ ] Export reports to PDF
- [ ] Dark mode toggle
- [ ] Offline mode with service workers
- [ ] Question difficulty rating
- [ ] Timed practice sets (30/60 minute sessions)

### Technical Improvements
- [ ] Migrate to PostgreSQL for production
- [ ] Add Redis for caching
- [ ] Implement WebSocket for real-time timer sync
- [ ] Add comprehensive test coverage (>80%)
- [ ] Docker containerization
- [ ] CI/CD pipeline with GitHub Actions
- [ ] Performance monitoring with Sentry
- [ ] Accessibility audit and improvements

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with love for family exam preparation
- Material Design 3 by Google
- React team for React 19
- Tailwind Labs for Tailwind CSS 4
- Django Software Foundation
- Framer Motion team

## 📞 Contact

For questions or issues, please open a GitHub issue or contact the repository maintainer.

---

**Note**: This is a personal application designed for family use. It is not intended for commercial deployment or large-scale distribution.
