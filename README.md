# Zelela Trading PLC — Website (Frontend)

A static, dependency-free HTML/CSS/JS frontend implementing the Zelela Trading PLC
brief: home, about, services, consultants, projects, insights, contact and privacy
pages, a consultant carousel, a validated contact form, and responsive/accessible
design.

## Running it

No build step needed. Open `index.html` directly in a browser, or serve the folder
with any static server, e.g.:

```bash
npx serve .
# or
python3 -m http.server 8080
```

## Structure

```
zelela-trading/
├── index.html          Home
├── about.html
├── services.html
├── consultants.html
├── projects.html
├── insights.html
├── contact.html
├── privacy.html
├── css/style.css        Design tokens + all component styles
├── js/main.js            Consultant data, carousel, modal, nav, form validation
└── README.md
```

Consultant content lives in one place — the `CONSULTANTS` array at the top of
`js/main.js` — and drives both the homepage carousel and the `/consultants`
grid + modal.

### Adding consultant photos

Each consultant record already has a `photo` field pointing at
`images/consultants/<name>.png`. To add real photos:

1. Drop your five PNG files into `images/consultants/`, named exactly:
   `mulugeta.png`, `arega.png`, `seid.png`, `yosef.png`, `naod.png`.
2. That's it — no code or format changes needed. PNG works fine (no need to
   convert to JPG); JPG would also work if you rename the `photo` paths in
   `js/main.js` to match.

If a file is missing or fails to load, the site automatically falls back to
the navy initials placeholder, so nothing breaks if you add photos one at a
time. For best results, crop photos close to a 4:5 portrait ratio — the CSS
uses `object-fit: cover` so slightly different crops still fill the frame
cleanly, but a portrait-oriented source avoids awkward cropping.

## Contact form — wiring real email delivery

The form in `contact.html` validates fully client-side (required fields, email
format, honeypot spam field, message length) and currently **simulates** a
successful submission — it does not send real email yet. To make it functional,
add a small backend endpoint and point the form at it.

Recommended architecture:

```
Browser form → POST /api/contact → validate + sanitize → SMTP/Resend → your inbox
```

### Option A — Node/Express + Nodemailer

```js
// server/index.js
import express from "express";
import nodemailer from "nodemailer";
import rateLimit from "express-rate-limit";

const app = express();
app.use(express.json());
app.use("/api/contact", rateLimit({ windowMs: 15 * 60 * 1000, max: 10 }));

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD },
});

app.post("/api/contact", async (req, res) => {
  const { fullName, organization, email, phone, service, subject, message, consent, company_website } = req.body;

  // honeypot: silently accept but drop bots
  if (company_website) return res.json({ ok: true });

  if (!fullName || !email || !service || !subject || !message || !consent) {
    return res.status(400).json({ ok: false, error: "Missing required fields." });
  }

  await transporter.sendMail({
    from: process.env.MAIL_FROM,
    to: process.env.MAIL_TO, // zelelatradingplc@gmail.com
    replyTo: email,
    subject: `New Zelela Website Inquiry — ${service}`,
    text: `NEW WEBSITE INQUIRY\n===================\n\nName: ${fullName}\nOrganization: ${organization || "-"}\nEmail: ${email}\nPhone: ${phone || "-"}\nService: ${service}\nSubject: ${subject}\n\nMESSAGE\n-------\n${message}\n\nSubmitted: ${new Date().toISOString()}\nSource: Zelela Trading Website`,
  });

  res.json({ ok: true });
});

app.listen(3000);
```

`.env` (never commit, never expose to the frontend):

```env
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASSWORD=
MAIL_FROM=
MAIL_TO=zelelatradingplc@gmail.com
```

### Option B — Resend / SendGrid / Mailgun / SES

Swap the Nodemailer transporter for the provider's SDK; the request/response
shape above stays the same.

### Wiring the frontend to the endpoint

In `js/main.js`, inside `initContactForm()`, replace the simulated
`await new Promise(res => setTimeout(res, 700));` with a real request:

```js
const response = await fetch("/api/contact", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(Object.fromEntries(new FormData(form))),
});
if (!response.ok) throw new Error("Request failed");
```

Keep all other validation, honeypot, and success/error UI as-is.

## Deployment

Any static host works (Nginx, Netlify, Vercel static, S3 + CloudFront). If you
add the Node backend above, deploy it separately (or as an API route) and set
the environment variables on the host — never in frontend JavaScript.

## Content accuracy

Per the brief, no clients, contracts, statistics, certifications, or project
outcomes have been fabricated. Placeholders are marked directly in
`projects.html` and `insights.html` and should be replaced with verified
content only.
