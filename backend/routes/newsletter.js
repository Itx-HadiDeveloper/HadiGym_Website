const express = require('express');
const router = express.Router();
const { appendEntry, readAll } = require('../utils/storage');

const FILE = 'subscribers.json';

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email || '');
}

// POST /api/newsletter -> subscribe an email
router.post('/', (req, res) => {
  const { email } = req.body || {};

  if (!isValidEmail(email)) {
    return res.status(400).json({ ok: false, message: 'Please enter a valid email address.' });
  }

  const existing = readAll(FILE);
  const already = existing.some((s) => s.email.toLowerCase() === email.toLowerCase());
  if (already) {
    return res.status(200).json({ ok: true, message: "You're already subscribed!" });
  }

  const entry = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
    email: email.trim(),
    subscribedAt: new Date().toISOString(),
  };
  appendEntry(FILE, entry);

  return res.status(201).json({ ok: true, message: 'Thanks for subscribing!' });
});

// GET /api/newsletter -> list all subscribers (basic admin use, protect in production!)
router.get('/', (req, res) => {
  res.json({ ok: true, data: readAll(FILE) });
});

module.exports = router;
