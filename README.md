# HireAI - AI-Powered Interview Platform

HireAI is a cutting-edge interview platform that leverages artificial intelligence to conduct, analyze, and evaluate technical interviews. The platform combines real-time voice interaction, natural language processing, and machine learning to provide a seamless and objective interview experience.

## 🌟 Features

### 1. Resume Analysis
- Automated parsing and analysis of candidate resumes using PDF-parse
- ML-powered extraction of key skills, experience, and qualifications
- Dynamic question generation based on candidate profile
- Support for multiple document formats

### 2. AI-Powered Interviews
- Real-time voice-based interviews using Deepgram SDK
- Dynamic question adaptation using HuggingFace transformers
- Natural conversation flow with context awareness
- High-quality audio recording with fluent-ffmpeg
- Real-time transcription with advanced speech recognition

### 3. Automated Evaluation
- ML-based comprehensive evaluation of technical skills
- Multi-dimensional assessment of communication abilities
- Real-time sentiment analysis using @xenova/transformers
- Confidence-scored decision making
- Automated SMS notifications via Twilio API

### 4. Modern UI/UX
- Angular 19-powered responsive design
- Sleek dark theme with glass-morphism effects
- Real-time progress tracking with RxJS observables
- Interactive chat interface with WebSocket support
- Dynamic rating system with Angular animations
- Cross-browser compatible UI components

## 🛠️ Technology Stack

### Frontend (Angular 19.1.0)
```json
{
  "dependencies": {
    "@angular/animations": "^19.1.0",
    "@angular/common": "^19.1.0",
    "@angular/core": "^19.1.0",
    "@angular/forms": "^19.1.0",
    "@angular/platform-browser": "^19.1.0",
    "@angular/router": "^19.1.0",
    "rxjs": "~7.8.0",
    "zone.js": "~0.15.0"
  }
}
```

### Backend (Node.js)
```json
{
  "dependencies": {
    "@deepgram/sdk": "^3.11.2",
    "@huggingface/inference": "^3.6.1",
    "@xenova/transformers": "^2.17.2",
    "express": "^4.21.2",
    "mongoose": "^8.12.2",
    "twilio": "^5.5.2",
    "fluent-ffmpeg": "^2.1.3",
    "pdf-parse": "^1.1.1"
  }
}
```

## 📋 Prerequisites

- Node.js (v14.0.0 or higher)
- npm (v6.0.0 or higher)
- Angular CLI (v19.1.6)
- MongoDB (v6.0.0 or higher)
- FFmpeg for audio processing
- Git for version control

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/hardikagarwal2026/HireAI
```

### 2. Frontend Setup
```bash
cd frontend
npm i
npm start
```
The frontend will be available at `http://localhost:4200`

### 3. Backend Setup
```bash
cd resume-analyzer-backend
npm i
npm start
```
The backend will be available at `http://localhost:4000`

### 4. Environment Configuration

Create a `.env` file in the resume-analyzer-backend directory with:
```env
PORT=4000
MONGO_URI=your_mongodb_uri
GOOGLE_API_KEY=your_google_api_key
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone
DEEPGRAM_API_KEY=your_deepgram_key
HUGGINGFACE_API_KEY=your_huggingface_key
```

## 📁 Project Structure

### Frontend Structure
```
frontend/
├── src/
│   ├── pages/
│   │   ├── ai-interview/
│   │   └── interview-results/
│   ├── assets/
│   │   ├── icons/
│   │   └── styles/
│   ├── services/
│   │   ├── interview.service.ts
│   │   ├── audio.service.ts
│   │   └── evaluation.service.ts
│   └── shared/
│       ├── components/
│       └── models/
├── angular.json
├── package.json
├── tsconfig.json
└── tsconfig.app.json
```

### Backend Structure
```
resume-analyzer-backend/
├── routes/
│   ├── upload.js
│   ├── analyze.js
│   ├── interview.js
│   ├── calls.js
│   ├── transcribe.js
│   ├── finalevaluation.js
│   └── recordings.js
├── models/
│   ├── Interview.js
│   └── Evaluation.js
├── services/
│   ├── deepgram.js
│   ├── huggingface.js
│   └── twilio.js
├── recordings/
├── data/
├── server.js
├── package.json
└── .env
```

## 🔄 Application Flow

1. **Interview Process**
   - Audio capture using WebRTC
   - Real-time streaming to Deepgram
   - ML-based question generation
   - Response analysis using transformers
   - Audio recording with FFmpeg

2. **Evaluation Pipeline**
   - Speech-to-text conversion
   - Sentiment analysis
   - Technical assessment
   - Response quality evaluation
   - Decision confidence scoring

3. **Results & Notification**
   - Comprehensive evaluation report
   - Strengths and areas for improvement
   - ML-generated feedback
   - Final decision with ratings
   - Automated SMS via Twilio

## 📡 API Endpoints & Examples

### Upload & Analysis
```javascript
// Upload Resume
POST /api/upload
Content-Type: multipart/form-data

Request:
{
  "file": <PDF/DOCX file>,
  "candidateId": "12345"
}

Response:
{
  "success": true,
  "fileId": "file_789",
  "fileName": "resume.pdf",
  "uploadDate": "2024-03-20T10:30:00Z"
}

// Analyze Resume
POST /api/analyze
Content-Type: application/json

Request:
{
  "fileId": "file_789",
  "analysisType": "technical"
}

Response:
{
  "success": true,
  "analysis": {
    "skills": ["JavaScript", "Python", "AWS"],
    "experience": 5,
    "education": ["B.S. Computer Science"],
    "suggestedQuestions": [
      "Describe your experience with AWS services",
      "Explain your JavaScript project architecture"
    ]
  }
}
```

### Interview Management
```javascript
// Start Interview
POST /api/interview/start
Content-Type: application/json

Request:
{
  "candidateId": "12345",
  "position": "Senior Developer",
  "type": "technical"
}

Response:
{
  "interviewId": "int_456",
  "startTime": "2024-03-20T11:00:00Z",
  "questions": ["..."],
  "websocketUrl": "wss://..."
}

// Record Interview
POST /api/calls/record
Content-Type: application/json

Request:
{
  "interviewId": "int_456",
  "format": "wav",
  "quality": "high"
}

Response:
{
  "recordingId": "rec_123",
  "status": "recording",
  "startTime": "2024-03-20T11:00:00Z"
}
```

## 📞 Support

For support:
1. Create an issue in the repository
2. Check the error logs in:
   - Frontend: `frontend/logs/`
   - Backend: `resume-analyzer-backend/logs/`
3. Review documentation in the `docs/` directory

## 🙏 Acknowledgments

- Google Cloud Platform for AI services
- Twilio for SMS capabilities
- Deepgram for speech recognition
- HuggingFace for ML models 
