const express = require('express');
const router = express.Router();
const { JobListing, Application } = require('../models/Job');
const nodemailer = require('nodemailer');

// ✅ UPDATED: Transporter using Port 465 (SSL) to fix Render Timeout errors
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// GET all job listings
router.get('/jobs', async (req, res) => {
    try {
        const jobs = await JobListing.find();
        res.json(jobs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST new application
router.post('/apply', async (req, res) => {
    try {
        // 1. Save to Database
        const newApp = new Application(req.body);
        await newApp.save();

        // 2. HTML Email Template (Dark Mode Design)
        const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #333; border-radius: 8px; overflow: hidden; background-color: #121212; color: #e0e0e0;">
            
            <div style="background-color: #1e1e2f; padding: 20px; text-align: center; border-bottom: 3px solid #d63384;">
                <h2 style="color: #d63384; margin: 0; font-size: 24px;">NEW JOB APPLICATION</h2>
                <p style="color: #a0a0a0; margin: 5px 0 0; font-size: 14px;">A candidate has applied for a position.</p>
            </div>

            <div style="padding: 20px;">
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; color: #e0e0e0;">
                    <tr style="border-bottom: 1px solid #333;">
                        <td style="padding: 10px; font-weight: bold; color: #888; width: 130px;">Candidate Name:</td>
                        <td style="padding: 10px;">${req.body.name}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #333;">
                        <td style="padding: 10px; font-weight: bold; color: #888;">Email:</td>
                        <td style="padding: 10px; color: #4da3ff;">${req.body.email}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #333;">
                        <td style="padding: 10px; font-weight: bold; color: #888;">Mobile:</td>
                        <td style="padding: 10px;">${req.body.mobile}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #333;">
                        <td style="padding: 10px; font-weight: bold; color: #888;">Location:</td>
                        <td style="padding: 10px;">${req.body.location}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #333;">
                        <td style="padding: 10px; font-weight: bold; color: #888;">Applied Position:</td>
                        <td style="padding: 10px; color: #d63384; font-weight: bold;">${req.body.position}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #333;">
                        <td style="padding: 10px; font-weight: bold; color: #888;">Resume Link:</td>
                        <td style="padding: 10px;">
                            <a href="${req.body.resumeLink}" style="color: #4da3ff; text-decoration: none;">View Resume / CV</a>
                        </td>
                    </tr>
                </table>

                <h3 style="color: #d63384; font-size: 18px; margin-bottom: 10px;">Cover Letter / Message:</h3>
                <div style="background-color: #1e1e1e; padding: 15px; border: 1px solid #333; border-radius: 4px; color: #fff; line-height: 1.6;">
                    ${req.body.message ? req.body.message.replace(/\n/g, '<br>') : 'No message provided.'}
                </div>
            </div>

            <div style="background-color: #1a1a1a; padding: 15px; text-align: center; border-top: 1px solid #333; font-size: 12px; color: #666;">
                <p style="margin: 0;">Sent via info@vnmhitechsolutions.com</p>
                <p style="margin: 5px 0 0;">Submitted on: ${new Date().toLocaleString()}</p>
            </div>
        </div>
        `;

        await transporter.sendMail({
            from: `"VNM Careers" <${process.env.EMAIL_USER}>`,
            to: 'vnmhitechsolutions@gmail.com', 
            subject: `New Application: ${req.body.name} - ${req.body.position}`,
            html: htmlContent 
        });

        console.log(`✅ HTML Email sent for Application: ${req.body.name}`);
        res.status(201).json({ message: 'Application submitted successfully!' });

    } catch (err) {
        console.error('❌ Error in application:', err);
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
// Updated email settings for Render