const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

// GET /api/recordings/:filename
// Serves the audio recording file
router.get('/:filename', (req, res) => {
    try {
        const filename = req.params.filename;
        
        // Sanitize filename to prevent directory traversal
        const sanitizedFilename = path.basename(filename);
        const filePath = path.join(__dirname, '..', 'recordings', sanitizedFilename);

        // Check if file exists
        if (!fs.existsSync(filePath)) {
            console.error(`❌ Recording file not found: ${sanitizedFilename}`);
            return res.status(404).json({ error: 'Recording not found' });
        }

        // Get file stats
        const stat = fs.statSync(filePath);

        // Set headers for audio streaming
        res.writeHead(200, {
            'Content-Type': 'audio/wav',
            'Content-Length': stat.size,
            'Accept-Ranges': 'bytes'
        });

        // Create read stream and pipe to response
        const readStream = fs.createReadStream(filePath);
        readStream.pipe(res);

        readStream.on('error', (error) => {
            console.error(`❌ Error streaming file: ${error.message}`);
            if (!res.headersSent) {
                res.status(500).json({ error: 'Error streaming recording' });
            }
        });
    } catch (error) {
        console.error(`❌ Error serving recording: ${error.message}`);
        if (!res.headersSent) {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
});

module.exports = router; 