const  nodemailer = require('nodemailer');
const {config} = require("./config.js")

const getTransporter = async () => {
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: config.get("EMAIL"),
        pass: config.get("EMAIL_SMTP_PASSWORD"),
      },
    });
    return transporter;
  };

module.exports.getTransporter = getTransporter;