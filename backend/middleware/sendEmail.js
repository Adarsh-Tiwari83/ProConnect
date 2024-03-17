const nodeMailer = require("nodemailer");

const sendEmail = async (options) => {
  var transporter = nodeMailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USERNAME,
      pass: process.env.SMTP_PASSWORD,
    },
  });
  const mailOptions = {
    from: process.env.SMTP_EMAIL,
    to:options.to,
    subject:options.subject,
    html: options.text,
  };
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
