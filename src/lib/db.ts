import "server-only";
import postgres from "postgres";

/**
 * PostgreSQL (plain SQL). Works with Neon, Supabase or any Postgres.
 * Set DATABASE_URL on Vercel. If it's missing, bookings still reach the
 * designer by email/WhatsApp, but nothing is stored.
 */

declare global {
  var __olivetSql: postgres.Sql | undefined;
  var __olivetSchemaReady: Promise<void> | undefined;
}

export function hasDatabase() {
  return Boolean(process.env.DATABASE_URL);
}

export function sql() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not set");
  globalThis.__olivetSql ??= postgres(process.env.DATABASE_URL, {
    ssl: process.env.DATABASE_URL.includes("localhost") ? false : "require",
    max: 3,
    idle_timeout: 20,
    prepare: false, // safe with poolers (Neon / Supabase pgbouncer)
  });
  return globalThis.__olivetSql;
}

/** Creates the tables on first use, so a fresh database needs no manual setup. Mirrors db/schema.sql. */
export function ensureSchema() {
  globalThis.__olivetSchemaReady ??= (async () => {
    const db = sql();
    await db`
      create table if not exists bookings (
        id                bigserial primary key,
        reference         text not null unique,
        full_name         text not null,
        email             text,
        phone             text not null,
        preferred_contact text not null default 'whatsapp',
        occasion          text,
        event_date        date,
        fit               text not null default 'unsure',
        measurements      jsonb,
        delivery          text,
        budget_range      text,
        notes             text,
        look_slugs        text[] not null default '{}',
        style_finder      text,
        attachment_count  int not null default 0,
        status            text not null default 'new',
        admin_notes       text,
        emailed_at        timestamptz,
        created_at        timestamptz not null default now()
      )`;
    await db`create index if not exists bookings_status_created on bookings (status, created_at desc)`;
  })().catch((e) => {
    globalThis.__olivetSchemaReady = undefined;
    throw e;
  });
  return globalThis.__olivetSchemaReady;
}
