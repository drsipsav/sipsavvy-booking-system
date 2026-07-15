const nodemailer = require("nodemailer");
const { defineSecret } = require("firebase-functions/params");

// Define secrets (replace functions.config())
const EMAIL_USER = defineSecret("skbabs");
const EMAIL_PASS = defineSecret("AcesWild12~!");

// Gmail SMTP using App Password
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL_USER.value(),
    pass: EMAIL_PASS.value()
  }
});

// Send email helper
async function sendEmail(to, subject, html) {
  await transporter.sendMail({
    from: `"SipSavvy Mobile Bartending" <${EMAIL_USER.value()}>`,
    to,
    subject,
    html
  });
}

module.exports = { sendEmail };
