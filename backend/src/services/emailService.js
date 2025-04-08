const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs/promises');

// Cấu hình SMTP
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'nguyenphong.210703@gmail.com',
        pass: 'vscc gzee odsq goet',
    },
});

// Đọc và thay thế placeholder trong template
const renderTemplate = async (templateName, placeholders) => {
    const filePath = path.join(__dirname, 'templates', templateName);
    try {
        let content = await fs.readFile(filePath, 'utf-8');
        for (const [key, value] of Object.entries(placeholders)) {
            const regex = new RegExp(`{{${key}}}`, 'g');
            content = content.replace(regex, value);
        }
        return content;
    } catch (error) {
        console.error('Error reading template:', error);
        throw new Error('Could not read email template');
    }
};

// Gửi email
const sendEmail = async (toEmail, subject, placeholders, templateName) => {
    try {
        const html = await renderTemplate(templateName, placeholders);
        const mailOptions = {
            from: 'nguyenphong.210703@gmail.com',
            to: toEmail,
            subject: subject,
            html: html,
        };
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.response);
        return { success: true, info };
    } catch (error) {
        console.error('Error sending email:', error);
        return { success: false, error };
    }
};

module.exports = { sendEmail };
