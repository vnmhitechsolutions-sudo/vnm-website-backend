const path = require('path');
// Load .env file
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Initialize App
const app = express();

// ⭐ ADD PROPER CORS CONFIG HERE ⭐
const allowedOrigins = [
    "http://localhost:3003",   // local React
    "https://www.vnmhitechsolutions.com",  // main domain
    "https://vnm-website-git-main-vnmhitechsolutions-sudos-projects.vercel.app",
    "https://vnm-website-f8ms13oec-vnmhitechsolutions-sudos-projects.vercel.app"
];

app.use(
    cors({
        origin: function (origin, callback) {
            // Allow requests with no origin (like Postman)
            if (!origin) return callback(null, true);

            if (allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error("CORS blocked for origin: " + origin), false);
            }
        },
        methods: ["GET", "POST"],
        credentials: true,
    })
);

// Body parser
app.use(express.json());

// Debug env
console.log("Debug: MONGO_URI is", process.env.MONGO_URI ? "Loaded" : "UNDEFINED");

// Connect Database
connectDB();

// Routes
app.use('/api/contact', require('./routes/contactRoutes'));
app.use('/api/careers', require('./routes/careerRoutes'));
app.use('/api/courses', require('./routes/courseRoutes'));

// Home route
app.get('/', (req, res) => {
    res.send('VNM Hitech Solutions Node.js Backend is Running!');
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(Server, `Server started on port ${PORT}`);
});