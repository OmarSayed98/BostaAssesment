const nodemailer = require("nodemailer");

exports.sendMail = async (text, email) => {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.VERIFICATION_EMAIL,
      pass: process.env.VERIFICATION_EMAIL_PASS,
    },
  });
  await transporter.sendMail({
    from: "Bosta Assessment", // sender address
    to: email, // list of receivers
    subject: "Bosta Assessment notification", // Subject line
    text: text,
  });
};
