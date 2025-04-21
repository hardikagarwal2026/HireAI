const express = require("express");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const fs = require("fs");
const path = require("path");
const Resume = require("../models/Resume");

const router = express.Router();

// Configure multer
const upload = multer({ storage: multer.memoryStorage() });

router.post("/", upload.single("resume"), async (req, res) => {
    console.log("⏳ Upload route hit");

    if (!req.file) {
        console.log("❌ No file received");
        return res.status(400).json({ message: "No file uploaded" });
    }

    try {
        console.log("✅ File received:", req.file.originalname);
        const pdfText = await pdfParse(req.file.buffer);

        const dataToSave = {
            filename: req.file.originalname,
            text: pdfText.text,
            uploadedAt: new Date().toISOString()
        };

        const filePath = path.join(__dirname, "../data/pdfText.json");

        // Ensure directory exists
        fs.mkdir(path.dirname(filePath), { recursive: true }, (dirErr) => {
            if (dirErr) {
                console.error("❌ Directory creation failed:", dirErr);
                return res.status(500).json({ message: "Directory creation failed", error: dirErr });
            }

            fs.writeFile(filePath, JSON.stringify(dataToSave, null, 2), (err) => {
                if (err) {
                    console.error("❌ Failed to write JSON file:", err);
                    return res.status(500).json({ message: "Failed to save text to file", error: err });
                }

                console.log("✅ PDF text saved to JSON file");
                return res.json(dataToSave);
            });
        });

    } catch (error) {
        console.error("❌ PDF parse error", error);
        return res.status(500).json({ message: "Error processing PDF", error });
    }
});

module.exports = router;



