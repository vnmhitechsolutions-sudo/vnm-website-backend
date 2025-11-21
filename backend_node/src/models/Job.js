const mongoose = require('mongoose');

// Schema for Job Listings (Positions you are hiring for)
const jobListingSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    type: String, // e.g., "Full-time"
    skills: [String]
});

// Schema for Applications (People applying)
const applicationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    mobile: String,
    location: String,
    position: String,
    resumeLink: String,
    message: String,
    date: { type: Date, default: Date.now }
});

module.exports = {
    JobListing: mongoose.model('JobListing', jobListingSchema),
    Application: mongoose.model('Application', applicationSchema)
};