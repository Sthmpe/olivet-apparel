# Olivet Apparel

The portfolio and booking website for **Olivet Apparel**, a bespoke fashion house. Black and gold, built around one signature idea: **Follow the Thread**. A gold thread leaves the needle in the Olivet mark and sews the whole page together as you scroll, ending at the booking form.

## What's inside

| Page | What it does |
|---|---|
| `/` | Landing page with the scroll thread, collections hung on the line, the Fitting Room, the Swatch Drawer, the process and booking |
| `/collections` | Every look, filterable by occasion and fabric |
| `/collections/[slug]` | One collection |
| `/looks/[slug]` | One look: the **Fitting Room** slider (sketch → fabric → fitting → final), details, "Wear it" AI try-on, book, WhatsApp |
| `/style-finder` | 4 visual questions → best-matching looks (deterministic, no AI cost) |
| `/atelier` | Brand story, values, FAQ, studio |
| `/book` | Booking request with a live "atelier ticket" that fills as you type, lead-time check, inspiration uploads |
| `/studio` | Private booking inbox for the designer (password protected) |

Until the photoshoot is done, every look is drawn in code as a gold atelier sketch, matching the logo. When photos arrive, add them in `src/content/looks.ts` (see the comment at the top of the file) and the site switches to photography automatically.

## Stack

Next.js 16 (App Router), TypeScript, Tailwind CSS 4, PostgreSQL (plain SQL via `postgres`), Resend (email over HTTP), WhatsApp click-to-chat, and an open-source virtual try-on model on Hugging Face (`@gradio/client`). It is hosted on Vercel, and every service has a free tier.

## Run locally

```bash
npm install
cp .env.example .env.local   # fill in what you have; everything is optional
npm run dev                  # http://localhost:3000
```

## Configuration (Vercel → Project → Settings → Environment Variables)

The site works with **no** variables set: bookings then hand off to WhatsApp. Add these to switch features on:

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Her WhatsApp, digits only in international format, e.g. `2348012345678` |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Public contact email |
| `NEXT_PUBLIC_INSTAGRAM` | Instagram handle without `@` |
| `NEXT_PUBLIC_STUDIO_CITY` | e.g. `Lagos, Nigeria` |
| `NEXT_PUBLIC_SITE_URL` | Final domain, e.g. `https://olivetapparel.com` |
| `DATABASE_URL` | Postgres connection string (free [Neon](https://neon.tech) or Supabase). Tables are created automatically on the first booking. |
| `RESEND_API_KEY` | From [resend.com](https://resend.com) (free, 3,000 emails/month) |
| `BOOKING_TO_EMAIL` | Where booking alerts go (her Gmail). Comma-separate several addresses. |
| `EMAIL_FROM` | Sender, e.g. `Olivet Apparel <bookings@olivetapparel.com>` once the domain is verified in Resend. Until then leave it unset: alerts still reach the Resend account owner, and client confirmations are skipped. |
| `STUDIO_PASSWORD` | Password for `/studio` |
| `STUDIO_SECRET` | Optional extra signing key for the studio session |
| `HF_TOKEN` | Optional Hugging Face token: raises the free try-on quota |
| `TRYON_SPACE` | Optional: a different try-on Space (default `yisol/IDM-VTON`) |

### How a booking travels

1. Validated on the server (with a honeypot and a minimum-time check against spam).
2. **Saved to Postgres first**, so a lead is never lost to an email failure.
3. Emailed to her with a one-tap "Reply on WhatsApp" button, inspiration photos attached, and a confirmation sent to the client when a domain is verified.
4. The client gets a "Send on WhatsApp" button with the whole brief pre-typed.

### AI try-on ("Wear it")

Each look needs a clean garment-only photo, set as `tryOnGarment` in `src/content/looks.ts`. Without one, the "Wear it" dialog invites the visitor to book instead. Try-on runs through `/api/tryon` on our server, which calls the free IDM-VTON Space. Free Spaces queue and sometimes sleep, so the UI handles waits and failures gracefully. Photos are processed in memory and never stored.

## Project layout

```
src/
  app/                 pages, booking + studio server actions, /api/tryon
  components/
    thread/            the signature scroll thread
    garment/           code-drawn garments, Fitting Room, fabric swatches, look cards
    booking/ style-finder/ tryon/ home/ layout/ ui/
  content/             site settings, looks & collections, fabrics  ← edit content here
  lib/                 db (SQL), email, booking validation, studio auth, try-on, garment geometry
db/schema.sql          reference schema (created automatically at runtime)
docs/                  vision, experience, architecture, roadmap, decisions
```
