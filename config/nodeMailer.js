const  nodemailer = require('nodemailer');

const getTransporter = async () => {
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_SMTP_PASSWORD,
      },
    });
    return transporter;
  };

module.exports.getTransporter = getTransporter;