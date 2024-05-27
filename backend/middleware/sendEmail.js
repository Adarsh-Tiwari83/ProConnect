const nodemailer = require("nodemailer");

exports.sendEmail = async (options) => {
  try {
    let transporter = nodemailer.createTransport({
      host: process.env.SMPT_HOST,
      port: process.env.SMPT_PORT,
      auth: {
        user: process.env.SMPT_MAIL,
        pass: process.env.SMPT_PASSWORD,
      },
      service: process.env.SMPT_SERVICE,
      secure: false,
});

    let info = await transporter.sendMail({
      from: process.env.SMPT_HOST, // sender address
      to: options.email, // list of receivers
      subject: options.subject, // Subject line
      text: options.message, // html body
    });
    console.log(info.response);
    return info;
  } catch (error) {
    console.log(error.message);
    return error.message;
  }
};
