const mongoose = require("mongoose");

const ResumeSchema = new mongoose.Schema({
    name: String,
    phone: String,
    text: String,
    analysis: Object,
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Resume", ResumeSchema);
