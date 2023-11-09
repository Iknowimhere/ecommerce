const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: "bridie.friesen@ethereal.email",
    pass: "G2yX4NR2fw1R4GpYtj",
  },
});

async function sendEmail(options) {
  await transporter.sendMail({
    from: "bridie.friesen@ethereal.email",
    to: options.userEmail,
    subject: options.subject,
    text: options.message,
    html: "<b>Hello world?</b>",
  });
}

module.exports = sendEmail;
