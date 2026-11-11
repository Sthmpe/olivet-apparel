-- Olivet Apparel: database schema (PostgreSQL)
--
-- The app creates this automatically on the first booking (src/lib/db.ts → ensureSchema),
-- so you never need to run it by hand. It's kept here as the reference.
--
-- Portfolio content (looks, collections, fabrics) lives in src/content/*.ts for v1.
-- Moving it into tables, so she can edit looks from /studio, is planned for a later milestone.

create table if not exists bookings (
  id                bigserial primary key,
  reference         text not null unique,          -- e.g. OA-7K3PQ
  full_name         text not null,
  email             text,
  phone             text not null,                 -- WhatsApp number
  preferred_contact text not null default 'whatsapp', -- whatsapp | call | email
  occasion          text,                          -- bridal | celebration | evening | everyday | other
  event_date        date,
  fit               text not null default 'unsure', -- in_person_fitting | send_measurements | unsure
  measurements      jsonb,                         -- { bust, waist, hips, shoulder, length, height }
  delivery          text,                          -- pickup | delivery
  budget_range      text,
  notes             text,
  look_slugs        text[] not null default '{}',  -- looks the client chose
  style_finder      text,                          -- "occasion:bridal|shape:flowing|…"
  attachment_count  int not null default 0,        -- inspiration photos (sent by email, not stored)
  status            text not null default 'new',   -- new | contacted | fitting_booked | in_progress | delivered | cancelled
  admin_notes       text,
  emailed_at        timestamptz,                   -- null = the email alert did not go out
  created_at        timestamptz not null default now()
);

create index if not exists bookings_status_created on bookings (status, created_at desc);
