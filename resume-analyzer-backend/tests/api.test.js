const request = require('supertest');
const express = require('express');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Import routes
const uploadRoutes = require('../routes/upload');
const analyzeRoutes = require('../routes/analyze');
const interviewRoutes = require('../routes/interview');
const callRoutes = require('../routes/calls');
const transcribeRoutes = require('../routes/transcribe');
const finalEvaluationRoute = require('../routes/finalevaluation');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use routes
app.use('/api/upload', uploadRoutes);
app.use('/api/analyze', analyzeRoutes);
app.use('/api/interview', interviewRoutes);
app.use('/api/calls', callRoutes);
app.use('/api/transcribe', transcribeRoutes);
app.use('/api/finaleval', finalEvaluationRoute);

describe('API Endpoints', () => {
    // Test Upload Endpoint
    describe('POST /api/upload', () => {
        it('should upload and parse a PDF resume', async () => {
            const filePath = path.join(__dirname, 'test-files', 'Boggarapu Dhanush RESUME.pdf');
            const response = await request(app)
                .post('/api/upload')
                .attach('resume', filePath);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('text');
        });

        it('should return 400 if no file is uploaded', async () => {
            const response = await request(app)
                .post('/api/upload');

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('message', 'No file uploaded');
        });
    });

    // Test Analyze Endpoint
    describe('POST /api/analyze', () => {
        it('should analyze resume text and return analysis', async () => {
            const testData = {
                text: 'Sample resume text',
                role: 'Software Engineer',
                requiredSkills: ['JavaScript', 'Node.js'],
                experienceLevel: 'Mid-level',
                additionalRequirements: 'Remote work capability'
            };

            const response = await request(app)
                .post('/api/analyze')
                .send(testData);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('analysis');
            expect(response.body.analysis).toHaveProperty('summary');
            expect(response.body.analysis).toHaveProperty('questions');
        });

        it('should return 400 if required fields are missing', async () => {
            const response = await request(app)
                .post('/api/analyze')
                .send({});

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('message', 'Missing text or role');
        });
    });

    // Test Interview Endpoint
    describe('POST /api/interview', () => {
        it('should initiate an interview call', async () => {
            const testData = {
                summary: 'Candidate summary',
                candidate_name: 'John Doe',
                job_role: 'Software Engineer',
                phone_no: '+1234567890',
                questions: ['What is your experience with Node.js?']
            };

            const response = await request(app)
                .post('/api/interview')
                .send(testData);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('message', 'Call initiated successfully!');
        });

        it('should return 400 if required fields are missing', async () => {
            const response = await request(app)
                .post('/api/interview')
                .send({});

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('message', 'Missing required fields');
        });
    });

    // Test Transcribe Endpoint
    describe('POST /api/transcribe', () => {
        it('should transcribe audio file', async () => {
            const filePath = path.join(__dirname, 'test-files', 'sample-audio.mp3');
            const response = await request(app)
                .post('/api/transcribe')
                .attach('audio', filePath);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('conversation');
        });

        it('should return 400 if no file is uploaded', async () => {
            const response = await request(app)
                .post('/api/transcribe');

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error', 'No file uploaded');
        });
    });

    // Test Final Evaluation Endpoint
    describe('POST /api/finaleval', () => {
        it('should evaluate interview conversation', async () => {
            const testData = {
                conversation: [
                    { speaker: 'AI_HR', text: 'Hello' },
                    { speaker: 'Candidate', text: 'Hi' }
                ],
                summary: 'Interview summary'
            };

            const response = await request(app)
                .post('/api/finaleval')
                .send(testData);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('evaluation');
        });

        it('should return 400 if required fields are missing', async () => {
            const response = await request(app)
                .post('/api/finaleval')
                .send({});

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('message');
        });
    });

    // Test Calls Endpoint
    describe('GET /api/calls', () => {
        it('should fetch call recordings', async () => {
            const response = await request(app)
                .get('/api/calls');

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('message', 'Download complete');
        });
    });
   
}); 