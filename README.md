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
git clone <repository-url>
cd Monday-Duplicate
```

### 2. Frontend Setup
```bash
cd frontend
npm install
ng serve
```
The frontend will be available at `http://localhost:4200`

### 3. Backend Setup
```bash
cd resume-analyzer-backend
npm install
node server.js
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

### Evaluation
```javascript
// Submit Evaluation
POST /api/finaleval
Content-Type: application/json

Request:
{
  "interviewId": "int_456",
  "transcript": "...",
  "audioUrl": "https://...",
  "evaluationType": "technical"
}

Response:
{
  "evaluationId": "eval_789",
  "status": "completed",
  "results": {
    "technicalScore": 4.5,
    "communicationScore": 4.8,
    "strengths": ["..."],
    "improvements": ["..."],
    "recommendation": "hire"
  }
}
```

## 📊 Database Schemas

### Interview Schema
```javascript
const InterviewSchema = new Schema({
  candidateId: { type: String, required: true },
  position: { type: String, required: true },
  startTime: { type: Date, default: Date.now },
  endTime: { type: Date },
  status: {
    type: String,
    enum: ['scheduled', 'in-progress', 'completed', 'cancelled'],
    default: 'scheduled'
  },
  recordingUrl: String,
  transcriptUrl: String,
  questions: [{
    text: String,
    timestamp: Date,
    response: String,
    analysis: {
      clarity: Number,
      relevance: Number,
      technicalAccuracy: Number
    }
  }]
});
```

### Evaluation Schema
```javascript
const EvaluationSchema = new Schema({
  interviewId: { type: Schema.Types.ObjectId, ref: 'Interview' },
  timestamp: { type: Date, default: Date.now },
  technicalEvaluation: {
    score: Number,
    strengths: [String],
    weaknesses: [String],
    skillAssessments: [{
      skill: String,
      score: Number,
      comments: String
    }]
  },
  communicationEvaluation: {
    score: Number,
    clarity: Number,
    confidence: Number,
    articulation: Number
  },
  finalDecision: {
    recommendation: {
      type: String,
      enum: ['hire', 'reject', 'consider']
    },
    confidenceScore: Number,
    justification: String
  },
  metadata: {
    evaluator: String,
    duration: Number,
    modelVersion: String
  }
});
```

## 🚀 Deployment

### Local Development
```bash
# Frontend
cd frontend
npm install
ng serve --configuration=development

# Backend
cd resume-analyzer-backend
npm install
nodemon server.js
```

### Production Deployment

#### Frontend (Angular Universal SSR)
```bash
# Build for production
ng build --configuration=production

# Start SSR server
npm run serve:ssr:frontend

# Or using PM2
pm2 start npm --name "frontend" -- run serve:ssr:frontend
```

#### Backend (PM2 Process Manager)
```bash
# Install PM2 globally
npm install -g pm2

# Start backend server
pm2 start server.js --name "hire-ai-backend"

# Configure auto-restart
pm2 startup
pm2 save

# Monitor processes
pm2 monit
```

#### Docker Deployment
```dockerfile
# Frontend Dockerfile
FROM node:19-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 4200
CMD ["npm", "run", "serve:ssr:frontend"]

# Backend Dockerfile
FROM node:19-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 4000
CMD ["node", "server.js"]
```

```yaml
# docker-compose.yml
version: '3.8'
services:
  frontend:
    build: ./frontend
    ports:
      - "4200:4200"
    environment:
      - NODE_ENV=production
    depends_on:
      - backend

  backend:
    build: ./resume-analyzer-backend
    ports:
      - "4000:4000"
    environment:
      - NODE_ENV=production
      - MONGO_URI=${MONGO_URI}
      - GOOGLE_API_KEY=${GOOGLE_API_KEY}
    volumes:
      - recordings:/app/recordings

  mongodb:
    image: mongo:6.0
    volumes:
      - mongodb_data:/data/db

volumes:
  recordings:
  mongodb_data:
```

## ⚙️ Advanced Configuration

### Frontend Configuration (angular.json)
```json
{
  "projects": {
    "frontend": {
      "architect": {
        "build": {
          "configurations": {
            "production": {
              "optimization": true,
              "outputHashing": "all",
              "sourceMap": false,
              "extractCss": true,
              "namedChunks": false,
              "aot": true,
              "extractLicenses": true,
              "vendorChunk": false,
              "buildOptimizer": true
            }
          }
        }
      }
    }
  }
}
```

### Backend Configuration
```javascript
// config/database.js
module.exports = {
  mongoOptions: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    retryWrites: true,
    w: "majority",
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000
  },
  
  corsOptions: {
    origin: process.env.FRONTEND_URL || 'http://localhost:4200',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  },
  
  rateLimiting: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
  }
};
```

### Monitoring & Logging
```javascript
// config/winston.js
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

module.exports = logger;
```

## 🔧 Troubleshooting

1. **Audio Issues**
   ```bash
   # Check FFmpeg installation
   ffmpeg -version
   
   # Verify browser permissions
   chrome://settings/content/microphone
   
   # Clear browser cache
   chrome://settings/clearBrowserData
   ```

2. **Connection Issues**
   ```bash
   # Test MongoDB connection
   mongosh "your_mongodb_uri"
   
   # Check Node.js version
   node --version
   
   # Verify environment variables
   echo $MONGO_URI
   ```

3. **API Issues**
   ```bash
   # Test Twilio credentials
   twilio verify:services:create
   
   # Check Deepgram API
   curl -X POST -H "Authorization: Token $DEEPGRAM_API_KEY" \
        "https://api.deepgram.com/v1/listen"
   ```

## 📞 Support

For support:
1. Create an issue in the repository
2. Check the error logs in:
   - Frontend: `frontend/logs/`
   - Backend: `resume-analyzer-backend/logs/`
3. Review documentation in the `docs/` directory

## 🧪 Testing

```bash
# Frontend Tests
cd frontend
ng 
ng e2e

# Backend Tests
cd resume-analyzer-backend
npm run test
npm run test:coverage
```

## 🙏 Acknowledgments

- Google Cloud Platform for AI services
- Twilio for SMS capabilities
- MongoDB Atlas for database services
- Angular team for the framework
- Deepgram for speech recognition
- HuggingFace for ML models 