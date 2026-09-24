# Hive Akshat — Photography Website

A wedding & event photography website for **Hive Akshat**, Ajmer.
Built with **Next.js (App Router)**, **Tailwind CSS**, and **Framer Motion**.

---

## Run it locally

You need [Node.js](https://nodejs.org) 18.17+ installed.

```bash
npm install
npm run dev
```

Then open **http://localhost:3000**.

To build for production:

```bash
npm run build
npm start
```

---

## Folder structure

```
hive-akshat/
├── app/                     # Pages + API (Next.js App Router)
│   ├── page.js              # Home
│   ├── about/page.js
│   ├── work/page.js         # Portfolio: showreel + filterable gallery
│   ├── services/page.js
│   ├── testimonials/page.js
│   ├── contact/page.js      # Contact form
│   ├── api/contact/route.js # Handles form submissions (email/DB hooks inside)
│   ├── layout.js            # Shared shell: navbar, footer, fonts
│   └── globals.css
│
├── components/
│   ├── layout/              # Navbar, Footer, WhatsApp button
│   ├── sections/            # Home + page building blocks (Hero, Process, etc.)
│   ├── ui/                  # Small reusable pieces (Button, Container, Reveal...)
│   ├── gallery/             # Filterable grid + full-screen lightbox
│   └── forms/               # Contact form
│
├── data/                    # ← EDIT YOUR CONTENT HERE (no coding needed)
│   ├── site.js              # Name, phone, email, WhatsApp, nav links
│   ├── portfolio.js         # Gallery images + categories
│   ├── services.js          # Services + the how-it-works steps
│   ├── testimonials.js      # Client quotes
│   └── clients.js           # "Trusted by" names
│
├── public/images/           # Put real photos here
└── ...config files
```

> **The idea:** almost everything you'll want to change lives in `/data`.
> Update those files and the whole site updates — no need to touch the components.

---

## How to customise

**Text, contact details, links** → edit `data/site.js`.

**Photos** → drop images into `public/images/`, then point to them in
`data/portfolio.js` (e.g. `src: "/images/wedding-01.jpg"`). The starter uses
sample photos from picsum.photos so it looks real immediately.

**Showreel video** → open `components/sections/Showreel.js` and replace
`VIDEO_ID` with your YouTube video ID.

**Colours & fonts** → `tailwind.config.js` (colours) and `app/layout.js` (fonts).

---

## Contact form: email + database

Out of the box, the form **works locally** — submissions are validated and
printed to your terminal, so you can test it right away.

To make it actually email Akshat and/or save to a database:

1. Copy `.env.example` to `.env.local` and fill in the values.
2. Open `app/api/contact/route.js` — the two commented blocks show exactly
   where to add **Resend** (email) and a **database** (Supabase/Neon).
3. Install whichever you use, e.g. `npm install resend`.

The form already includes a hidden honeypot field to block spam bots.

---

## Deploy

Easiest path is **Vercel**:

1. Push this folder to a GitHub repo.
2. Import it at [vercel.com](https://vercel.com).
3. Add your `.env` values in the Vercel dashboard.
4. Connect the custom domain (e.g. hiveakshat.com).

Done.
