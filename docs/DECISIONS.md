# Decisions

| # | Decision | Reason |
|---|---|---|
| 1 | Booking is the first job of the site; showcase is second. | The site exists to win clients. |
| 2 | Plain, short copy. The home page states what the business is in one line. Sections use everyday names (Styles, About, Book now). No em dashes. | The first version was wordy and confusing for the owner. |
| 3 | Brand colours are black and gold, from the client's logo. The site follows the device theme: black and gold in dark mode, ivory and deep gold in light mode. | Client brand, plus an owner request for automatic light and dark mode. |
| 4 | No texture overlays, shimmer or scroll-linked fades. Motion is limited to the scroll thread and the sketch slider. | Earlier effects flickered and looked artificial. |
| 5 | Styles are drawn in code until photography exists. | Launch could not wait for a photoshoot, and stock photos would misrepresent her work. |
| 6 | Content lives in typed files. Only bookings are in SQL. | Fastest route to launch. Editing styles from the studio is on the roadmap. |
| 7 | PostgreSQL with plain parameterised SQL and no ORM. | One table does not justify an ORM. |
| 8 | Save the booking before sending email, and always offer the WhatsApp hand-off. | A lead must never be lost to an email failure or missing configuration. |
| 9 | Email through Resend's HTTP API with `fetch`. | No SDK dependency for one request. |
| 10 | Inspiration photos are compressed in the browser and emailed, not stored. | No storage cost and no client photos kept on a server. |
| 11 | Style Finder and "you may also like" use deterministic scoring. | Instant, free, predictable and testable. |
| 12 | AI try-on uses a free open-source model behind a server proxy, enabled per style. | No per-image cost. The provider can be swapped without touching the UI. |
| 13 | Every backend feature switches on with an environment variable. | The site works at each stage of setup. |

## Open questions for the client

1. Confirm what she makes, and the names and descriptions of the styles.
2. Show prices, price ranges, or price on request?
3. Real email address, Instagram handle and studio location.
4. Typical turnaround times, and whether rush orders are offered.
5. Photos of finished work, plus sketches and fittings if available.
6. Custom domain.
7. Online deposits later?
