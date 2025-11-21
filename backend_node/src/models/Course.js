const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    title: String,
    duration: String,
    mode: String,
    image: String
});

const enrollmentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    mobile: String,
    location: String,
    courseName: String,
    linkedProfile: String,
    message: String,
    date: { type: Date, default: Date.now }
});

module.exports = {
    Course: mongoose.model('Course', courseSchema),
    Enrollment: mongoose.model('Enrollment', enrollmentSchema)
};