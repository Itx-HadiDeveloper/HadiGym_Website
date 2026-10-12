# Abdullah Mall Gym — Full Website Project

A premium, responsive gym website with a real Node.js/Express backend for the
Contact form and Newsletter signup.

```
amg-project/
├── frontend/              Static website (HTML, CSS, JS)
│   ├── index.html
│   ├── css/style.css
│   └── js/main.js
├── backend/                Node.js + Express API
│   ├── server.js           Entry point (serves API + the frontend)
│   ├── routes/
│   │   ├── contact.js       POST/GET /api/contact
│   │   └── newsletter.js    POST/GET /api/newsletter
│   ├── utils/
│   │   ├── storage.js        JSON file storage helper
│   │   └── mailer.js         Optional email notifications (nodemailer)
│   ├── data/                 contacts.json / subscribers.json (auto-created)
│   ├── .env.example
│   └── package.json
└── README.md               You are here
```

## Quick start

```bash
cd backend
npm install
cp .env.example .env      # edit values if you want email notifications
npm start                 # → http://localhost:5000
```

That single server serves **both** the API and the website — just open
`http://localhost:5000` in your browser. There is nothing else to run.

## How the forms work

- **Contact / Free Trial form** → `POST /api/contact`
  Validates name, phone, email. Saves every submission to
  `backend/data/contacts.json`. If SMTP credentials are set in `.env`, it also
  emails the gym owner a notification (optional — the form still works
  perfectly without it).

- **Newsletter form** → `POST /api/newsletter`
  Validates email, prevents duplicate subscriptions, saves to
  `backend/data/subscribers.json`.

- Both endpoints are rate-limited (20 requests / 15 min per IP) to stop spam.

You can view raw submissions any time with:
```
GET /api/contact
GET /api/newsletter
```
(Add authentication before exposing these publicly in production — see
"Going to production" below.)

## Editing the site

- Colors, fonts, animations → `frontend/css/style.css`
- Interactivity (menu, dark mode, BMI calculator, forms, sliders) →
  `frontend/js/main.js`
- Page content/sections → `frontend/index.html`

## Going to production

1. Replace placeholder phone/email/photos in `index.html` with real ones.
2. Put the backend behind HTTPS (e.g. Nginx reverse proxy, or host on
   Render/Railway/VPS).
3. Set `CLIENT_ORIGIN` in `.env` to your real domain instead of `*`.
4. Protect `GET /api/contact` and `GET /api/newsletter` with an admin
   password or move them behind a login before deploying publicly.
5. Consider swapping the JSON file storage for a real database (MongoDB /
   PostgreSQL) once submission volume grows — `utils/storage.js` is the only
   file you'd need to change, since routes call it through a small interface.

## Owner

**M. Karrar Hussain** — Abdullah Mall, Qasimabad, Hyderabad, Sindh, Pakistan
