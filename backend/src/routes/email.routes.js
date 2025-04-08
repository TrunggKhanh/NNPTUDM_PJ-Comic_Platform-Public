const express = require('express');
const { sendEmail, readTemplate } = require('../services/emailService');

const router = express.Router();

// Endpoint gửi email
router.post('/send-email', async (req, res) => {
    const { toEmail, subject, body, templateName } = req.body;

    try {
        let html = body;
        if (templateName) {
            html = await readTemplate(templateName);
        }

        // Gửi email
        const result = await sendEmail(toEmail, subject, body, html);

        if (result.success) {
            res.status(200).json({ message: 'Email sent successfully!' });
        } else {
            throw new Error(result.error);
        }
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ message: 'Failed to send email', error: error.message });
    }
});

module.exports = router;
