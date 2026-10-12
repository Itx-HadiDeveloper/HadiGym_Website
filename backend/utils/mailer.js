const nodemailer = require('nodemailer');

// Email sending is entirely optional. If SMTP_USER / SMTP_PASS are not set in
// .env, sendMail() simply resolves without doing anything, so the API keeps
// working (and submissions are still saved to disk) even with zero email
// configuration.
let transporter = null;

function getTransporter() {
  if (transporter) return transporter;
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) return null;

  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
  return transporter;
}

async function sendMail({ subject, text, html }) {
  const t = getTransporter();
  if (!t) return { sent: false, reason: 'SMTP not configured' };

  const to = process.env.GYM_NOTIFY_EMAIL || process.env.SMTP_USER;
  await t.sendMail({
    from: `"Abdullah Mall Gym Website" <${process.env.SMTP_USER}>`,
    to,
    subject,
    text,
    html,
  });
  return { sent: true };
}

module.exports = { sendMail };
