const express = require("express");
const fs = require("fs");
const path = require("path");
const axios = require("axios");
const { createClient } = require("@deepgram/sdk");
require("dotenv").config();

const router = express.Router();
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

// Get call status
router.get("/status", async (req, res) => {
    try {
        console.log("🔍 Checking call status...");
        const response = await axios.get("https://api.bland.ai/v1/calls", {
            headers: {
                authorization: process.env.BLAND_API_KEY
            }
        });

        console.log("📞 Bland.ai response:", JSON.stringify(response.data?.calls?.[0], null, 2));
        const latestCall = response.data?.calls?.[0];
        
        if (!latestCall) {
            console.log("❌ No call found in Bland.ai response");
            return res.json({ status: 'failed', error: 'No call found' });
        }

        // Map Bland.ai status to our status
        let status;
        switch (latestCall.status) {
            case 'completed':
                status = 'completed';
                break;
            case 'failed':
            case 'error':
                status = 'failed';
                break;
            case 'in_progress':
            case 'queued':
                status = 'in_progress';
                break;
            default:
                status = 'initiating';
        }

        console.log(`✅ Mapped status: ${status}`);
        res.json({
            status,
            error: latestCall.error || null,
            call_id: latestCall.call_id
        });

    } catch (error) {
        console.error("❌ Error checking call status:", error);
        res.status(500).json({
            status: 'failed',
            error: 'Failed to check call status'
        });
    }
});

// Get call recording and transcript
router.get("/", async (req, res) => {
    try {
        console.log("🔍 Getting latest completed call...");
        const blandRes = await axios.get("https://api.bland.ai/v1/calls", {
            headers: {
                authorization: process.env.BLAND_API_KEY
            }
        });

        // Find the latest completed call
        const completedCall = blandRes.data?.calls?.find(call => call.status === 'completed');
        console.log("📞 Latest completed call:", JSON.stringify(completedCall, null, 2));

        if (!completedCall?.recording_url) {
            console.log("❌ No recording URL found for completed call");
            return res.status(404).json({ error: "No completed call recording found." });
        }

        // Create recordings directory if it doesn't exist
        const recordingsDir = path.join(__dirname, "..", "recordings");
        if (!fs.existsSync(recordingsDir)) {
            fs.mkdirSync(recordingsDir, { recursive: true });
        }

        const filePath = path.join(recordingsDir, `${completedCall.call_id}.wav`);
        console.log("💾 Saving recording to:", filePath);

        const writer = fs.createWriteStream(filePath);

        const audioRes = await axios({
            url: completedCall.recording_url,
            method: "GET",
            responseType: "stream"
        });

        audioRes.data.pipe(writer);

        await new Promise((resolve, reject) => {
            writer.on("finish", resolve);
            writer.on("error", reject);
        });

        console.log("🎤 Transcribing audio...");
        const audioStream = fs.createReadStream(filePath);
        const { result } = await deepgram.listen.prerecorded.transcribeFile(audioStream, {
            model: "nova-3",
            smart_format: true,
            language: "en",
            punctuate: true,
            utterances: true
        });

        console.log("✅ Transcription completed");

        // Extract raw transcription
        const rawTranscription = result?.results?.channels[0]?.alternatives[0]?.transcript;
        
        if (!rawTranscription) {
            throw new Error("No transcription generated from audio");
        }

        console.log("🎯 Raw transcription:", rawTranscription);

        // Structure the conversation
        console.log("🤖 Structuring conversation...");
        const structuredConversation = await structureConversation(rawTranscription);
        console.log("✅ Structured conversation:", JSON.stringify(structuredConversation, null, 2));

        // Keep the audio file for frontend playback
        const recordingFilename = `${completedCall.call_id}.wav`;

        res.json({
            call_id: completedCall.call_id,
            recording_file: recordingFilename,
            raw_transcription: rawTranscription,
            structured_conversation: structuredConversation
        });

    } catch (err) {
        console.error("❌ Error:", err.message);
        res.status(500).json({
            error: "Something went wrong",
            details: err.message
        });
    }
});

module.exports = router;
