const nodemailer = require("nodemailer");
require("dotenv").config();

function sendMail(toEmail, subject, content) {
  const mailSubject = subject || "Mail subject with nodemailer";
  const mailContent =
    content ||
    `
    <div style="padding: 10px; background-color: #003375">
    <div style="padding: 10px; background-color: white;">
        <h4 style="color: #0085ff">Gửi mail với nodemailer và express</h4>
        <span style="color: black">Đây là mail test</span>
    </div>
</div>
    `;
  const transporter = nodemailer.createTransport({
    // config mail server
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_NAME,
      pass: process.env.EMAIL_PASSWORD,
    },
    tls: {
      // do not fail on invalid certs
      rejectUnauthorized: false,
    },
  });
  const mainOptions = {
    from: process.env.EMAIL_NAME,
    to: toEmail,
    subject: mailSubject,
    html: mailContent,
  };
  transporter.sendMail(mainOptions, function (err, info) {
    if (err) {
      console.log(err);
      console.log("Send mail fail");
    } else {
      console.log("Send mail success: " + info.response);
    }
  });
}
module.exports = sendMail;
