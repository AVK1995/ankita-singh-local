# tgo-ankita

Bindwithyoga · 2-Day Fertility Reset Masterclass (₹97, one live Zoom session
per day, 12:00–2:00 PM IST). Set both days with two env values:
NEXT_PUBLIC_DATES="12, Mar 2027, 13, Mar 2027" and
NEXT_PUBLIC_TIMES="12:00 PM – 2:00 PM, 12:00 PM – 2:00 PM" (Day 1 first).

A masterclass funnel: landing page, checkout, thank-you, three policy pages,
Razorpay, Meta CAPI, GA4 and the Pabbly fulfilment hand-off.

- `COPY-SOURCE.md` is the sole source of truth for every string on the page.
- `app/_landing/offer.ts` is the only file permitted to declare a price, a
  date, a session time or a destination.
- `app/_landing/legal.ts` holds every business fact the policy pages need.
  Anything still reading `[TODO]` renders as `[TODO]` on the live site.
- `.env.example` lists every variable, what it is for and what breaks without
  it. Copy it to `.env.local` and fill it.

Scaffolded from `tgo-peeyush`, which carries the current reporting layer
(`middleware.ts`, flat order notes, the `notes.kind` webhook gate).
# tgo-ankita
