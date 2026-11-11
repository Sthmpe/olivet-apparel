# Olivet Apparel: Agent Instructions

This project is a portfolio and booking site for the fashion designer behind Olivet Apparel. Read `docs/VISION.md`, `docs/EXPERIENCE.md`, `docs/ARCHITECTURE.md`, `docs/ROADMAP.md` and `docs/DECISIONS.md` before writing code. They are the source of truth.

## Rules

0. Keep copy short and plain. A first-time visitor must understand in five seconds that this is a fashion designer who makes custom outfits you can book. No em dashes in site copy.

1. Booking is the #1 job. Never ship a change that makes booking slower or less reliable.
2. Clothes first: UI must make the garments look better, never compete with them.
3. "Follow the Thread" is the only signature effect. Keep everything else restrained.
4. No generic dashboard, template or chatbot styling. Premium, editorial and calm. Brand colours are **black and gold**, taken from the logo in `public/brand/`. The site follows the device theme: black and gold in dark mode, ivory and deep gold in light mode (tokens in `src/app/globals.css`).
5. Mobile-first. Pages must be fast on mobile data (Lighthouse ≥ 90 mobile).
6. Respect `prefers-reduced-motion`; booking and browsing must work without JS.
7. Use SQL (PostgreSQL) with plain, parameterised queries (tagged templates in `src/lib/db.ts`). Never build queries by string concatenation.
8. A booking is saved before any email is sent. Email failure must never lose a lead.
9. All secrets stay server-side. Never expose DB, Resend, Cloudinary or admin secrets to the browser.
10. The AI try-on must go through the `TryOnProvider` interface and our server proxy. Don't store visitor photos unless they're attached to a booking.
11. Stay free-tier friendly. Don't add paid services without approval.
12. Don't add dependencies unless the current milestone needs them.
13. Don't build features outside the current ROADMAP milestone.
14. Every image needs meaningful alt text.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
