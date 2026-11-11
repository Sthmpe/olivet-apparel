-- Olivet Apparel: database schema (PostgreSQL)
--
-- Created automatically on the first request by PostgresBookingRepository
-- (src/infrastructure/postgres/booking-repository.ts). Kept here as the reference.
-- Portfolio photos are not in the database: they live in Vercel Blob, and each
-- photo's category and title are encoded in its storage path.

create table if not exists requests (
  id               bigserial primary key,
  reference        text not null unique,          -- e.g. OA-7K3PQ
  kind             text not null,                 -- outfit | class
  category         text,                          -- bridal | prom | dinner | corporate | everyday | ankara | trousers
  course_id        text,                          -- set when kind = class
  style_ref        text,                          -- portfolio style the client picked
  full_name        text not null,
  phone            text not null,
  email            text,
  contact_method   text not null,                 -- whatsapp | call | email
  event_date       date,
  budget           text not null,
  notes            text not null default '',
  inspiration_urls text[] not null default '{}',  -- photos the client attached (Vercel Blob URLs)
  status           text not null default 'new',   -- new | contacted | confirmed | in_progress | delivered | cancelled
  admin_notes      text,
  created_at       timestamptz not null default now()
);

create index if not exists requests_created on requests (created_at desc);
