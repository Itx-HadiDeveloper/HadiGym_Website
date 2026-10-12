require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const rateLimit = require('express-rate-limit');

const contactRoutes = require('./routes/contact');
const newsletterRoutes = require('./routes/newsletter');

const app = express();
const PORT = process.env.PORT || 5000;

// --- Core middleware ---
app.use(express.json({ limit: '100kb' }));
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN ? process.env.CLIENT_ORIGIN.split(',') : '*',
  })
);

// Basic rate limiting on the public form endpoints to stop spam/abuse
const formLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { ok: false, message: 'Too many requests, please try again later.' },
});

// --- API routes ---
app.use('/api/contact', formLimiter, contactRoutes);
app.use('/api/newsletter', formLimiter, newsletterRoutes);

app.get('/api/health', (req, res) => {
  res.json({ ok: true, service: 'Abdullah Mall Gym API', time: new Date().toISOString() });
});

// --- Serve the frontend (static site) ---
const FRONTEND_DIR = path.join(__dirname, '..', 'frontend');
app.use(express.static(FRONTEND_DIR));

// Fallback: any non-API GET request returns the SPA's index.html
app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.join(FRONTEND_DIR, 'index.html'));
});

// --- Error handler ---
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ ok: false, message: 'Something went wrong on the server.' });
});

app.listen(PORT, () => {
  console.log(`Abdullah Mall Gym server running → http://localhost:${PORT}`);
});
