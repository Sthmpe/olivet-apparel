# Architecture

## Overview

A Next.js App Router application deployed on Vercel. Public pages are prerendered. Dynamic work happens in three places: the booking server action, the `/studio` inbox and the `/api/tryon` route.

```
Visitor ──► Next.js (Vercel) ──► static pages
                │
                ├─ server action: submitBooking ──► PostgreSQL (bookings)
                │                               ──► Resend (email to designer, confirmation to client)
                │                               ──► WhatsApp link with the brief (always available)
                ├─ /studio (password) ──► PostgreSQL
                └─ /api/tryon ──► open-source try-on model on Hugging Face
```

## Routes

| Route | Rendering | Purpose |
|---|---|---|
| `/` | Static | Home: what the business is, what it makes, how it works, book |
| `/styles`, `/styles/[slug]` | Static | Browse styles by occasion and fabric |
| `/looks/[slug]` | Static | One style: slider, details, try-on, book |
| `/style-finder` | Static + client state | Four questions, deterministic matching |
| `/about` | Static | Designer, values, FAQ |
| `/book` | Static + server action | Booking request |
| `/studio` | Dynamic | Private booking inbox |
| `/api/tryon` | Dynamic | Proxy to the try-on model |

Old URLs (`/collections`, `/atelier`) redirect permanently; see `next.config.ts`.

## Content

Styles, collections and fabrics are typed data in `src/content/`. Styles render as code-drawn SVG (`src/lib/garment.ts` produces the geometry, `GarmentArt` draws it) until photos are listed for them.

## Booking pipeline

`src/app/book/actions.ts`:

1. Reject spam (honeypot field, minimum time on the form).
2. Validate and sanitise with `parseBooking` (`src/lib/booking.ts`). Free-text fields are trimmed and length-limited; choice fields must match an allow-list.
3. Insert into `bookings` if `DATABASE_URL` is set. The table is created on first use (`ensureSchema`).
4. Email the designer through Resend if configured, attaching inspiration photos. Confirm to the client when a sender domain is verified.
5. Return the reference and a plain-text brief. The confirmation screen offers a WhatsApp link carrying that brief.

A failure in step 3 or 4 is logged and does not stop the next step.

## Studio auth

One password (`STUDIO_PASSWORD`). On sign-in the server sets an httpOnly, `SameSite=Lax` cookie scoped to `/studio` holding an HMAC of the password. Comparisons are constant-time and sign-in is delayed to slow guessing. Every studio action re-checks the session.

## Theming

`src/app/globals.css` defines semantic tokens as CSS variables (`--page`, `--panel`, `--card`, `--fg`, `--muted`, `--edge`, `--gold`). Light values are the default, dark values apply under `prefers-color-scheme: dark`, and the `.on-dark` class pins the dark values for surfaces that stay black in both themes (garment panels, footer). Tailwind exposes the tokens as utilities such as `bg-page` and `text-fg`.

## Try-on

`src/lib/tryon.ts` calls a Hugging Face Space (default IDM-VTON) with the visitor's photo and the style's `tryOnGarment` image, then returns the result as a data URL so the browser never contacts the third party. Photos are not stored. The route is rate-limited per IP and per instance.

## Quality gates

`npm run check` runs ESLint, `next typegen` plus `tsc`, and Vitest. GitHub Actions runs the same checks and a production build on every push and pull request.
