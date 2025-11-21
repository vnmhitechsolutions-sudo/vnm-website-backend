const path = require('path');
// Point directly to the .env file in the root directory
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Initialize App
const app = express();

// Middleware
app.use(cors()); 
app.use(express.json()); 

// Debugging: Check if variables are loaded
console.log("Debug: MONGO_URI is", process.env.MONGO_URI ? "Loaded" : "UNDEFINED");

// Connect Database
connectDB();

// Define Routes
app.use('/api/contact', require('./routes/contactRoutes'));
app.use('/api/careers', require('./routes/careerRoutes'));
app.use('/api/courses', require('./routes/courseRoutes'));

// Simple Home Route
app.get('/', (req, res) => {
    res.send('VNM Hitech Solutions Node.js Backend is Running!');
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
});