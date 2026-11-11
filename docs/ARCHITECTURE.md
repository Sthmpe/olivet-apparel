# Architecture

Olivet Apparel follows Clean Architecture. This document explains the layers, the rules between them, and where each feature lives.

## Dependency rule

```
presentation  ──▶  application  ──▶  domain
      │                 ▲
      ▼                 │ implements ports
infrastructure ─────────┘
```

- **Domain** (`src/domain`) imports nothing outside itself.
- **Application** (`src/application`) imports the domain and defines ports (interfaces) in `ports.ts`.
- **Infrastructure** (`src/infrastructure`) implements those ports and wires them up in `container.ts`.
- **Presentation** (`src/app`, `src/components`) calls use cases and gets adapters from the container. It never talks to Postgres or Blob directly.

## Layers

### Domain

| File | Contents |
|---|---|
| `catalog.ts` | The seven categories, the `PortfolioPhoto` entity, filtering, cover selection, and the storage-path encoding for studio uploads. |
| `booking.ts` | Request kinds, budgets, contact methods, statuses, `validateBookingRequest`, `createReference`, `bookingBrief`, `whatsappLinkTo`. |
| `courses.ts` | The `Course` entity, price formatting, filtering by format. |

### Application

| File | Contents |
|---|---|
| `ports.ts` | `BookingRepository`, `FileStorage`, `TryOnService`. |
| `submit-booking.ts` | Validate a request, store inspiration photos, save the request, return the brief. Storage failures are logged and never block the client. |
| `portfolio.ts` | `listPortfolio`, `addStudioPhoto`, `removeStudioPhoto`. |

### Infrastructure

| File | Port | Notes |
|---|---|---|
| `postgres/booking-repository.ts` | `BookingRepository` | Creates its table on first use. |
| `blob/file-storage.ts` | `FileStorage` | Vercel Blob, public access. |
| `tryon/huggingface-try-on.ts` | `TryOnService` | IDM-VTON on a Hugging Face Space. |
| `notify/formsubmit.ts` | (browser helper) | Free email delivery of requests; `mailto:` link builder. |
| `auth/studio-session.ts` | (session) | Single-password studio sign-in with a signed cookie. |
| `portfolio-query.ts` | (query) | Cached portfolio listing tagged `portfolio`. |
| `container.ts` | (composition root) | Returns an adapter per port, or `null` when its environment variable is missing. |

### Presentation

| Route | Rendering | Purpose |
|---|---|---|
| `/` | Static, revalidated hourly | Hero, categories, recent styles, services, classes, ordering steps |
| `/portfolio` | Static, revalidated hourly | Category filter, gallery, full-screen viewer, try-on |
| `/services` | Static, revalidated hourly | One section per category |
| `/classes` | Static | Course list with format filter |
| `/about` | Static | Story, values, FAQ |
| `/book` | Static shell, Server Action | Booking form |
| `/studio` | Dynamic | Photo manager and request inbox |
| `/api/tryon` | Dynamic | Try-on proxy |
| `/api/studio/photos` | Dynamic | Scripted photo upload, authenticated with the studio password |

Photo uploads call `updateTag("portfolio")`, so the next page view shows the change.

## Testing

Tests in `tests/` cover the domain rules and the use cases. Use cases run against in-memory fakes from `tests/fakes.ts`, which shows the value of the ports: no database, storage or network is needed.
