const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { createClient } = require("@deepgram/sdk");
require("dotenv").config();
const axios = require("axios");

const router = express.Router();

// Configure multer for audio file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = 'recordings';
        // Create directory if it doesn't exist
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        // Generate unique filename with timestamp
        cb(null, `interview-${Date.now()}${path.extname(file.originalname)}`);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedMimes = ['audio/wav', 'audio/mp3', 'audio/mpeg', 'audio/webm'];
    if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only WAV, MP3, and WebM audio files are allowed.'));
    }
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    }
});

// Initialize Deepgram client
const deepgram = createClient(process.env.DEEPGRAM_API_KEY);

// Function to structure conversation
const structureConversation = async (transcription) => {
    try {
        if (!transcription || typeof transcription !== 'string') {
            console.error("❌ Invalid transcription input:", transcription);
            return { conversation: [] };
        }

        const prompt = `
        Format the following conversation into a structured JSON format where each dialogue is classified as either 'AI_HR' or 'Candidate'.
        Rules for classification:
        1. Questions are typically from 'AI_HR'
        2. Answers and explanations are from 'Candidate'
        3. Greetings can be from either speaker based on context

        The JSON should be in the format:
        {
          "conversation": [
            {
              "speaker": "AI_HR",
              "text": "Hello, how are you?"
            },
            {
              "speaker": "Candidate",
              "text": "I'm good, thank you."
            }
          ]
        }

        **Raw Conversation:**
        ${transcription}
        `;

        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GOOGLE_API_KEY}`,
            {
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: {
                    temperature: 0.2,
                    maxOutputTokens: 2048
                }
            },
            {
                headers: { 
                    "Content-Type": "application/json"
                },
                timeout: 30000
            }
        );

        if (!response.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
            throw new Error("Invalid response from Gemini API");
        }

        let rawContent = response.data.candidates[0].content.parts[0].text;
        rawContent = rawContent.replace(/```json/g, "").replace(/```/g, "").trim();
        
        const parsedContent = JSON.parse(rawContent);
        if (!Array.isArray(parsedContent.conversation)) {
            throw new Error("Invalid conversation structure");
        }

        parsedContent.conversation = parsedContent.conversation.map(msg => ({
            speaker: ['AI_HR', 'Candidate'].includes(msg.speaker) ? msg.speaker : 'AI_HR',
            text: msg.text || ''
        }));

        return parsedContent;
    } catch (error) {
        console.error("❌ Error structuring conversation:", error);
        // Return a default structure with the raw transcription as a single message
        return { 
            conversation: [{
                speaker: 'AI_HR',
                text: transcription || ''
            }]
        };
    }
};

router.post("/", upload.single("audio"), async (req, res) => {
    let inputFile = null;
    
    try {
        if (!req.file) {
            return res.status(400).json({ 
                error: "No file uploaded",
                details: "Please provide an audio file for transcription"
            });
        }

        inputFile = req.file.path;
        console.log("📝 Processing audio file:", req.file.originalname);

        if (!fs.existsSync(inputFile)) {
            throw new Error("Uploaded file not found");
        }

        const audioStream = fs.createReadStream(inputFile);

        console.log("🎙️ Starting transcription with Deepgram...");
        const { result, error } = await deepgram.listen.prerecorded.transcribeFile(
            audioStream,
            {
                model: "nova-3",
                smart_format: true,
                language: "en",
                punctuate: true,
                utterances: true
            }
        );

        if (error) {
            throw new Error(`Deepgram transcription failed: ${error.message}`);
        }

        const transcription = result?.results?.channels[0]?.alternatives[0]?.transcript;
        
        if (!transcription) {
            throw new Error("No transcription generated");
        }

        console.log("✅ Transcription completed successfully");
        console.log("🎯 Raw transcription:", transcription);

        // Structure conversation using Gemini
        console.log("🤖 Structuring conversation with Gemini...");
        const structuredConversation = await structureConversation(transcription);

        // Return response with both raw and structured data
        res.json({
            success: true,
            recording_file: req.file.filename,
            raw_transcription: transcription,
            structured_conversation: structuredConversation,
            metadata: {
                originalFileName: req.file.originalname,
                duration: result?.results?.duration || 0,
                channels: result?.results?.channels?.length || 1
            }
        });

    } catch (error) {
        console.error("❌ Transcription Error:", error);
        res.status(500).json({ 
            error: "Transcription failed",
            details: error.message,
            type: error.name
        });
    } finally {
        // Cleanup: Always delete the uploaded file
        if (inputFile && fs.existsSync(inputFile)) {
            try {
                fs.unlinkSync(inputFile);
                console.log("🧹 Cleaned up temporary audio file");
            } catch (cleanupError) {
                console.error("⚠️ Failed to cleanup file:", cleanupError);
            }
        }
    }
});

module.exports = router; 