# Decisions

| # | Decision | Reason |
|---|---|---|
| 1 | The portfolio is the centre of the site, followed by services, classes and booking. | Clients choose a designer by her work. |
| 2 | Seven categories: Bridal, Prom, Dinner, Corporate, Everyday, Ankara, Trousers. Defined once in the domain. | Matches what the designer makes. One source of truth for filters, services and the booking form. |
| 3 | Clean Architecture with ports and adapters. | Business rules stay testable and independent of Vercel, Postgres and Next.js. Adapters can be swapped. |
| 4 | Portfolio photos live in Vercel Blob, with category and title encoded in the storage path. | Fast, free at this scale, managed by the designer from the studio, and no database needed for photos. |
| 5 | Booking emails go through FormSubmit, with WhatsApp and `mailto:` buttons always shown. | Free, no account or API key, and a request can never be lost to a missing configuration. |
| 6 | Requests are saved to Postgres only when a database is connected. | The site works before every service is set up. |
| 7 | Plain, short copy; no em dashes; restrained design with few borders. | Owner feedback on earlier versions. |
| 8 | Automatic light and dark mode: ivory and deep gold, black and gold. | Owner request; both stay true to the brand. |
| 9 | No texture overlays, scroll-linked animation or full-page SVG effects. | An earlier full-page animated SVG caused flicker on phones. |
| 10 | Class prices are placeholders between ₦100,000 and ₦230,000. | Agreed range until the designer confirms. |
| 11 | Portfolio images must be the designer's own work or properly licensed, and are labelled as styles she makes rather than as past client work unless they are. | Clients trust a portfolio. Misattributed images are a legal and reputational risk. |
