const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
    try {
        if (req.method !== 'POST') {
            res.status(405).json({ success: false, message: 'Method not allowed' });
            return;
        }

        // Ensure the request body is parsed as JSON
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            const { name, email, message } = JSON.parse(body);

            // Log incoming request body for debugging
            console.log('Incoming request:', { name, email, message });

            if (!name || !email || !message) {
                res.status(400).json({ success: false, message: 'All fields are required' });
                return;
            }

            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: '', // your email
                    pass: '' // app password
                }
            });

            const mailOptions = {
                from: email,
                to: '',
                subject: `New message from ${name}`,
                text: message
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error('Error sending email:', error);
                    res.status(500).json({ success: false, message: 'Message sending failed', error: error.message });
                } else {
                    console.log('Email sent:', info.response);
                    res.status(200).json({ success: true, message: 'Message sent successfully!' });
                }
            });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        res.status(500).json({ success: false, message: 'Unexpected error', error: error.message });
    }
};
