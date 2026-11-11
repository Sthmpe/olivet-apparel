# Case study: Olivet Apparel

**Client:** Olivet Apparel, a bespoke fashion house in Lagos
**Role:** Design and full-stack development
**Stack:** Next.js 16, TypeScript, Tailwind CSS 4, Vercel Blob, PostgreSQL, Vitest, GitHub Actions, Vercel
**Live:** https://olivet-apparel.vercel.app

## The problem

The designer had a strong brand (a black and gold logo) but no website. New clients found her through WhatsApp and word of mouth, so there was no single place to see her range, understand her services, or book. She also teaches sewing and had no way to present her classes.

She needed a site that:

- shows her work first, organised the way clients think (bridal, prom, dinner, corporate, everyday, Ankara, trousers);
- turns interest into booking requests with as little effort as possible;
- she can update herself, from her phone, without a developer;
- costs nothing to run.

## What I built

- A **portfolio** with category filters and a full-screen viewer. Every photo leads straight to a booking for that style.
- A **booking flow** for outfits and classes in one short form. Requests reach her through a free email relay, WhatsApp and email, and are stored when a database is connected.
- A **private studio** where she uploads photos (compressed on her phone before upload), chooses a category, and manages requests.
- A **classes** section with levels, formats and prices.
- **AI try-on** so a client can preview a style on a photo of herself.
- **Automatic light and dark mode** in the brand colours.

## Engineering highlights

- **Clean Architecture.** Business rules (validation, categories, the request brief) are pure TypeScript with no framework imports. Use cases depend on interfaces, and adapters for Postgres, Vercel Blob and Hugging Face implement them. The use cases are tested against in-memory fakes.
- **No database for photos.** Each upload's category, title and timestamp are encoded in its storage path, so the portfolio is just a cached listing of a Blob folder.
- **Graceful degradation.** Every external service is optional. With nothing configured, the site still takes bookings through WhatsApp.
- **Caching.** Pages are prerendered and the portfolio listing is cached with `use cache`. Uploading or deleting a photo invalidates the cache tag, so changes appear immediately.
- **Iterating on feedback.** The first version was visually ambitious (a scroll-drawn SVG thread). Client feedback showed it was confusing and flickered on phones. I replaced it with a simpler, photo-first layout and plain copy, which made the purpose of the site clear in seconds.

## Results

- One link the designer can share everywhere, with her full range and services.
- Booking requests arrive with everything she needs: occasion, style, date, budget and contact details.
- She manages her own portfolio without technical help.
- Hosting and services run on free tiers.
