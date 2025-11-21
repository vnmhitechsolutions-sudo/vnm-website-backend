const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

router.post('/submit', async (req, res) => {
    try {
        // 1. Save to Database
        const newContact = new Contact(req.body);
        await newContact.save();

        // 2. HTML Email Template
        const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #333; border-radius: 8px; overflow: hidden; background-color: #121212; color: #e0e0e0;">
            
            <!-- Header -->
            <div style="background-color: #1e1e2f; padding: 20px; text-align: center; border-bottom: 3px solid #d63384;">
                <h2 style="color: #d63384; margin: 0; font-size: 24px;">NEW LEAD: Contact Form</h2>
                <p style="color: #a0a0a0; margin: 5px 0 0; font-size: 14px;">A new visitor has submitted a message.</p>
            </div>

            <!-- Content Body -->
            <div style="padding: 20px;">
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; color: #e0e0e0;">
                    <tr style="border-bottom: 1px solid #333;">
                        <td style="padding: 10px; font-weight: bold; color: #888; width: 120px;">Name:</td>
                        <td style="padding: 10px;">${req.body.firstName} ${req.body.lastName}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #333;">
                        <td style="padding: 10px; font-weight: bold; color: #888;">Email:</td>
                        <td style="padding: 10px; color: #4da3ff;">${req.body.email}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #333;">
                        <td style="padding: 10px; font-weight: bold; color: #888;">Phone:</td>
                        <td style="padding: 10px;">${req.body.phoneNumber}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #333;">
                        <td style="padding: 10px; font-weight: bold; color: #888;">Country:</td>
                        <td style="padding: 10px;">${req.body.country}</td>
                    </tr>
                </table>

                <!-- Message Box -->
                <h3 style="color: #d63384; font-size: 18px; margin-bottom: 10px;">Message Details:</h3>
                <div style="background-color: #1e1e1e; padding: 15px; border: 1px solid #333; border-radius: 4px; color: #fff; line-height: 1.6;">
                    ${req.body.message.replace(/\n/g, '<br>')}
                </div>
            </div>

            <!-- Footer -->
            <div style="background-color: #1a1a1a; padding: 15px; text-align: center; border-top: 1px solid #333; font-size: 12px; color: #666;">
                <p style="margin: 0;">Sent via info@vnmhitechsolutions.com</p>
                <p style="margin: 5px 0 0;">Submitted on: ${new Date().toLocaleString()}</p>
            </div>
        </div>
        `;

        const mailOptions = {
            from: `"VNM Website Bot" <${process.env.EMAIL_USER}>`,
            to: 'vnmhitechsolutions@gmail.com', 
            subject: `New Inquiry: ${req.body.firstName} ${req.body.lastName}`,
            html: htmlContent
        };

        await transporter.sendMail(mailOptions);
        console.log(`✅ HTML Email sent for ${req.body.firstName}`);
        res.status(201).json({ message: 'Contact saved and email sent successfully!' });

    } catch (error) {
        console.error('❌ Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;