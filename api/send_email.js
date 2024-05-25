const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'ibrahim.2003.aldarraji@gmail.com',
    pass: 'hjuxyvmgfokimtgg' // Replace this with the generated app password
  }
});

module.exports = (req, res) => {
  const { name, email, message } = req.body;

  const mailOptions = {
    from: email,
    to: 'ibrahim.2003.aldarraji@gmail.com',
    subject: `Contact form submission from ${name}`,
    text: message
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      res.status(500).json({ success: false, message: 'Message sending failed.', error });
    } else {
      res.status(200).json({ success: true, message: 'Message sent successfully!' });
    }
  });
};

