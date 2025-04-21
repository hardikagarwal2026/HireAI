const express = require("express");
const router = express.Router();
const Resume = require("../models/Resume");

// Get all resumes
router.get("/", async (req, res) => {
    try {
        const resumes = await Resume.find().sort({ createdAt: -1 });
        res.json(resumes);
        console.log("resumes");
    } catch (error) {
        res.status(500).json({ message: "Error fetching resumes", error: error.message });
    }
});

// Get resume by ID
router.get("/:id", async (req, res) => {
    try {
        const resume = await Resume.findById(req.params.id);
        if (!resume) {
            return res.status(404).json({ message: "Resume not found" });
        }
        res.json(resume);
    } catch (error) {
        res.status(500).json({ message: "Error fetching resume", error: error.message });
    }
});

// Get resumes by name (search)
router.get("/search/:name", async (req, res) => {
    try {
        const resumes = await Resume.find({
            name: { $regex: req.params.name, $options: 'i' }
        }).sort({ createdAt: -1 });
        res.json(resumes);
    } catch (error) {
        res.status(500).json({ message: "Error searching resumes", error: error.message });
    }
});

module.exports = router; 