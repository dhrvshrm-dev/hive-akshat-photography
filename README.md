# Hive Akshat — Travel, Heritage & Spiritual Photography

Portfolio site for **Hive Akshat**, a photographer based in Ajmer, Rajasthan —
temples, landscapes, architecture, people and wildlife across India.
Built with **Next.js (App Router)**, **Tailwind CSS**, **Framer Motion**, **three.js** and **Lenis**.

The whole site is designed as if you are looking through a camera:

| Where | What happens |
| --- | --- |
| First visit to `/` | **Diya intro** — the page is dark, the cursor (or finger) is a lamp that reveals the Varanasi aarti. Press & hold to light it. Add `?intro=1` to any home URL to force it. |
| Home hero | **Viewfinder** — WebGL rack-focus between photos, an AF box that hunts and locks on the subject, real EXIF + GPS readouts. |
| Cursor (desktop) | An **AF point** that locks onto links and buttons. |
| Touch (phones) | **Tap-to-focus** — a focus box appears and locks wherever you tap. |
| Page changes | A **camera aperture** closes and opens between routes. |
| `/journeys` | Self-drawing **map of India** with the route, chapters with a sticky refocusing viewfinder, and the filterable archive with a review-screen lightbox (EXIF + live histogram). |

---

## Run it locally

Node.js 22 (see `.nvmrc`).

```bash
npm install
npm run dev
```

Open **http://localhost:3000** (and **http://localhost:3000/?intro=1** to see the intro again).

Production build: `npm run build && npm start`.

---

## Where things live

```
app/                      Pages (App Router) + /api/contact
components/
  intro/DiyaIntro.js      The lamp intro
  layout/                 Navbar, Footer, SmoothScroll (Lenis), ShutterTransition, WhatsApp
  sections/               Home + page building blocks (Hero, JourneyReel, Disciplines, …)
  journeys/               Map + chapter components for /journeys
  gallery/                Archive grid + lightbox
  webgl/                  Everything drawn on the one shared WebGL canvas
  ui/                     Cursor, TouchFocus, Readout, FocusImage, Button, …
data/                     ← EDIT CONTENT HERE
  photos.js               Every photo: file, title, place, GPS, altitude, EXIF, focus point, credit
  journeys.js             The journeys (map pins + chapters), in route order
  services.js             Services, process, photo-walk departures
  testimonials.js         Quotes
  site.js                 Contact details, nav, manifesto text
  indiaMap.js             India outline (Government of India boundary) + projection
lib/                      Motion tokens, GL stage, formatters, focus timeline, scroll lock
public/images/photos/     The photographs
```

---

## Replacing the placeholder photos

The photos in `public/images/photos/` are **Creative Commons placeholders from
Wikimedia Commons** (credited at `/credits`). To use Akshat's own:

1. Drop the file into `public/images/photos/` (JPG, ~2200px on the long side, ~400 KB).
2. In `data/photos.js`, point `src` at it and update `w`/`h`, `title`, `place`,
   `lat`/`lon`, `alt`, `exif`, and `focus` (where the AF box should lock, as 0–1 fractions).
3. Update or remove the `credit` once the photo is his.

Copy marked **PLACEHOLDER** in `data/` (field notes, testimonials, stats, kit
list, departure dates) is written to show the tone — confirm it with Akshat.

---

## Contact form

Works locally out of the box (submissions are logged in the terminal). To email
and/or store enquiries, copy `.env.example` to `.env.local` and fill in the
commented Resend / database blocks in `app/api/contact/route.js`.

---

## Deploy

Push to GitHub, import on [Vercel](https://vercel.com), add the `.env` values,
connect the domain.
