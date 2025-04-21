const express = require("express");
const axios = require("axios");

const router = express.Router();

router.post("/", async (req, res) => {
    const { text, role } = req.body;

    if (!text || !role) {
        return res.status(400).json({ message: "Missing text or role" });
    }

    const prompt = `
        You are an AI assistant designed to analyze resumes and provide summaries in a specific JSON format.

        Generate a summary and give a brief description of the person based on the provided resume details. Analyze their education, experience, and how well they match the ${role} role. Calculate a match rate percentage based on their qualifications and the job requirements.

        In the end, conclude whether the person is suitable for the ${role} role. Only consider the candidate for acceptance if they possess relevant skills or passion for the job role; otherwise, reject them. Provide strong reasons for whether you accept or reject the candidate.

        The conclusion should be clear and concise and start with a heading 'Conclusion'. Also, based on the resume in context, generate 7 questions that need to be asked for better understanding, totally in context with the provided information to assess the candidate.

        Here is the candidate information:
        ${text}

        **Response Format:**
        Your final response MUST be a valid JSON string with the following keys:
        * "summary" (string): A summary of the candidate's qualifications.
        * "questions" (array of strings): An array of 7 interview questions.
        * "name" (string): The candidate's first name.
        * "phone_no" (string): The candidate's phone number with the country code.
        * "education" (string): The candidate's highest education level and field.
        * "experience" (string): A brief summary of the candidate's relevant experience.
        * "match_rate" (string): A percentage indicating how well the candidate matches the job role requirements.

        **Example JSON Response:**
        \`\`\`json
        {
            "summary": "Summary of Candidate: ...\\n\\nConclusion: ...",
            "questions": ["Question 1...", "Question 2...", ...],
            "name": "John",
            "phone_no": "+15551234567",
            "education": "Master's in Computer Science",
            "experience": "5 years of software development experience",
            "match_rate": "85%"
        }
        \`\`\`
    `;

    try {
        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GOOGLE_API_KEY}`,
            {
                contents: [{ parts: [{ text: prompt }] }]
            },
            {
                headers: { "Content-Type": "application/json" }
            }
        );

        console.log("🔹 AI Response:", JSON.stringify(response.data, null, 2));

        let rawContent = response.data?.candidates[0]?.content?.parts[0]?.text || "{}";
        rawContent = rawContent.replace(/```json/g, "").replace(/```/g, "").trim();
        let summary = JSON.parse(rawContent);

        return res.json({
            role: role,
            text: text,
            analysis: summary
        });

    } catch (error) {
        console.error("❌ JSON Parsing Error:", error);
        return res.status(500).json({
            message: "Error analyzing resume",
            error: error.message
        });
    }
});

module.exports = router;
