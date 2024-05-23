const nodemailer = require('nodemailer');

export default async (req, res) => {
  if (req.method === 'POST') {
    const { name, email, message } = req.body;

    // Configure your SMTP transporter
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: 'Ibrahim.2003.aldarraji@gmail.com', // your email
        pass: 'Ibrahim@20032003', // your email password
      },
    });

    // Email options
    const mailOptions = {
      from: email,
      to: 'Ibrahim.2003.aldarraji@gmail.com', // your email
      subject: 'New Contact Form Submission',
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    };

    try {
      // Send the email
      await transporter.sendMail(mailOptions);
      res.status(200).json({ success: true, message: 'Message sent successfully!' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Message sending failed.', error: error.message });
    }
  } else {
    res.status(405).json({ success: false, message: 'Invalid request method.' });
  }
};
