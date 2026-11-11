# Olivet Apparel: Agent Instructions

A portfolio and booking site for the fashion designer behind Olivet Apparel. Read `README.md`, `docs/ARCHITECTURE.md`, `docs/DECISIONS.md` and `docs/ROADMAP.md` before writing code.

## Rules

1. The portfolio comes first. A first-time visitor must understand in five seconds that this is a bespoke fashion designer whose work they can browse and book.
2. Keep copy short and plain. No em dashes anywhere in the code, copy or docs.
3. Follow the architecture in `docs/ARCHITECTURE.md`: domain rules in `src/domain` (no I/O, no framework), use cases and ports in `src/application`, adapters in `src/infrastructure`, UI in `src/app` and `src/components`. Presentation never talks to Postgres or Blob directly.
4. Every external service is optional and chosen in `src/infrastructure/container.ts`. A missing variable must switch a feature off, not break the site.
5. Use the semantic colour tokens in `src/app/globals.css` (`bg-page`, `bg-panel`, `bg-card`, `text-fg`, `text-muted`, `text-gold`). Both light and dark mode must look right.
6. Restrained design: few borders, no texture overlays, no scroll-linked or full-page animation.
7. Mobile first. No horizontal scrolling at phone width.
8. Portfolio images must be the designer's own or properly licensed.
9. Keep secrets on the server.
10. Run `npm run check` before committing, and add tests for new domain rules or use cases.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
