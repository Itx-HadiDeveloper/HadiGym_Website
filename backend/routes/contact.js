const express = require('express');
const router = express.Router();
const { appendEntry, readAll } = require('../utils/storage');
const { sendMail } = require('../utils/mailer');

const FILE = 'contacts.json';

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email || '');
}

// POST /api/contact  -> save a contact / free-trial request
router.post('/', async (req, res) => {
  const { name, phone, email, plan, message } = req.body || {};

  if (!name || !name.trim()) {
    return res.status(400).json({ ok: false, message: 'Please enter your full name.' });
  }
  if (!phone || !phone.trim()) {
    return res.status(400).json({ ok: false, message: 'Please enter a phone number.' });
  }
  if (!isValidEmail(email)) {
    return res.status(400).json({ ok: false, message: 'Please enter a valid email address.' });
  }

  const entry = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
    name: name.trim(),
    phone: phone.trim(),
    email: email.trim(),
    plan: plan || 'Not specified',
    message: (message || '').trim(),
    createdAt: new Date().toISOString(),
  };

  appendEntry(FILE, entry);

  try {
    await sendMail({
      subject: `New Gym Inquiry — ${entry.name}`,
      text: `Name: ${entry.name}\nPhone: ${entry.phone}\nEmail: ${entry.email}\nPlan: ${entry.plan}\nMessage: ${entry.message}`,
      html: `<h3>New Gym Inquiry</h3>
             <p><strong>Name:</strong> ${entry.name}</p>
             <p><strong>Phone:</strong> ${entry.phone}</p>
             <p><strong>Email:</strong> ${entry.email}</p>
             <p><strong>Plan:</strong> ${entry.plan}</p>
             <p><strong>Message:</strong> ${entry.message || '—'}</p>`,
    });
  } catch (err) {
    // Email is best-effort only; the submission is already saved to disk.
    console.error('Email notification failed:', err.message);
  }

  return res.status(201).json({ ok: true, message: 'Message received. We will contact you shortly.' });
});

// GET /api/contact -> list all submissions (basic admin use, protect in production!)
router.get('/', (req, res) => {
  res.json({ ok: true, data: readAll(FILE) });
});

module.exports = router;
