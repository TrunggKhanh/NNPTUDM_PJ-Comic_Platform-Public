import { useState } from 'react';

const SendEmail = () => {
    const [email, setEmail] = useState('');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [template, setTemplate] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:5000/api/emails/send-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    toEmail: email,
                    subject: subject,
                    body: message,
                    templateName: template,
                }),
            });

            const data = await response.json();
            if (response.ok) {
                alert('Email sent successfully!');
            } else {
                alert(`Failed to send email: ${data.message}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while sending the email.');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Email:</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div>
                <label>Subject:</label>
                <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} required />
            </div>
            <div>
                <label>Message:</label>
                <textarea value={message} onChange={(e) => setMessage(e.target.value)} required />
            </div>
            <div>
                <label>Template (optional):</label>
                <input type="text" value={template} onChange={(e) => setTemplate(e.target.value)} />
            </div>
            <button type="submit">Send Email</button>
        </form>
    );
};

export default SendEmail;
