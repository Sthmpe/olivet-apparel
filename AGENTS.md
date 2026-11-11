# Olivet Apparel: Agent Instructions

A portfolio and booking site for the fashion designer behind Olivet Apparel. Read `README.md`, `docs/ARCHITECTURE.md`, `docs/DECISIONS.md` and `docs/ROADMAP.md` before writing code.

## Rules

1. Keep copy short and plain. A first-time visitor must understand in five seconds that this is a fashion designer who makes custom outfits you can book. No em dashes in site copy.
2. Booking is the first job. Never ship a change that makes booking slower or less reliable.
3. A booking is saved before any email is sent. Email failure must never lose a lead.
4. Brand colours are black and gold. Use the semantic tokens in `src/app/globals.css` (`bg-page`, `bg-card`, `text-fg`, `text-muted`, `border-edge`, `text-gold`); do not hard-code theme colours in components. Both light and dark mode must look right.
5. Restrained motion only. No texture overlays, shimmer or scroll-linked fades. Respect `prefers-reduced-motion`.
6. Mobile first. No horizontal scrolling at phone width.
7. Use plain, parameterised SQL through `src/lib/db.ts`.
8. Keep secrets on the server. Never expose database, email or studio secrets to the browser.
9. AI try-on goes through `src/lib/tryon.ts` and the server route. Do not store visitor photos.
10. Stay within free tiers and do not add dependencies without a clear need.
11. Every image needs meaningful alt text.
12. Run `npm run check` before committing. Add or update tests in `tests/` when changing logic in `src/lib`.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
