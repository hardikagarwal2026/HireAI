const express = require("express");
const axios = require("axios");

const router = express.Router();

router.post("/", async (req, res) => {
    const { summary, candidate_name, job_role, phone_no, questions } = req.body;

    if (!summary || !candidate_name || !job_role || !phone_no || !questions) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    const prompt = `
        The main objective of this phone interview is to gather additional information about the candidate who has been shortlisted based on their resume.
        Always let the other person finish their sentence before responding. Ensure you ask all the main questions and only ask follow-up questions based on conditions.
        Always acknowledge the candidate's answer with phrases like "Okay, great!", "Okay" or "Got it."

        After you introduce yourself, if the user says they have time, continue with the interview. Otherwise, say:  
        "Okay, no worries. You can hang up the call." and stop.

        **Interview Questions:**
        1. "Do you have a notice period? How long? How soon can you join?"
        2. "What is your current compensation?"
        - **Follow-up 1:** If the candidate is a fresher, ask: "What is your salary expectation?"
        - **Follow-up 2:** If the expected salary is greater than ₹25,000, say:  
          "Our current compensation is ₹25,000 per month. Would you be okay with that?"

        **Next Steps:**  
        - Ask the following **context-based** questions related to their resume:  
          ${questions.map((q, index) => `Question ${index + 3}: "${q}"`).join("\n")}

        **Ending:**  
        - Summarize everything once you've gathered enough information.  
        - Then say: "That's it from my side. Thank you for your time. We'll get back to you if we decide to move ahead. You can hang up the call."

        **Candidate Details:**
        Name: ${candidate_name}
        Role: ${job_role}
        Resume Summary: ${summary}

        **Important:**  
        - Never hang up the call without permission from the candidate.
        - Always follow the question order strictly.
    `;


    const first_sentence = `
    Hey ${candidate_name}... I am Neo, an AI HR Representative calling from Proton2364, led by Mr. Hardik Agarwal. 
    It's the company with the yellow lighthouse logo? You recently applied for a ${job_role} role at the company. 
    Just wanted to talk about that.

    ...Yes... I know... I know. I am an actual AI... it's a little weird.  
    I'm still experimental... I might take a few seconds to respond, the call might get dropped, and I might talk over you...  
    Please try to be patient & talk slightly faster than usual with fewer pauses.  
    This will only take about 5 minutes. Is this a good time to talk?
    `;

 
    const payload = {
        phone_number: phone_no,
        task: prompt,
        first_sentence: first_sentence,
        wait_for_greeting: true,
        model: "base",
        tools: [],
        record: true,
        voice_settings: {},
        language: "eng",
        answered_by_enabled: true,
        interruption_threshold: 170,
        temperature: 0.5,
        amd: false,
        max_duration: 7,
        summary_prompt: "Summarize the call in English.",
        analysis_prompt: "Find the candidate's notice period and current compensation.",
        analysis_schema: { notice_period: "notice_period", current_compensation: "current_compensation" }
    };

   
    try {
        const response = await axios.post("https://api.bland.ai/v1/calls", payload, {
            headers: {
                Authorization: `Bearer ${process.env.BLAND_API_KEY}`,
                "Content-Type": "application/json"
            }
        });

        return res.json({ message: "Call initiated successfully!", response: response.data });

    } catch (error) {
        console.error("❌ Error Initiating Call:", error.response?.data || error.message);
        return res.status(500).json({ message: "Error initiating call", error: error.response?.data || error.message });
    }
});

module.exports = router;
