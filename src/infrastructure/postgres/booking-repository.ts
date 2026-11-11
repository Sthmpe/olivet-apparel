import "server-only";
import postgres from "postgres";
import type { BookingRequest, BookingStatus } from "@/domain/booking";
import type { BookingRecord, BookingRepository } from "@/application/ports";

/**
 * BookingRepository backed by PostgreSQL (Neon, Supabase or any Postgres).
 * Plain parameterised SQL. The table is created on first use; see db/schema.sql.
 */

declare global {
  var __olivetSql: postgres.Sql | undefined;
  var __olivetSchema: Promise<void> | undefined;
}

type Row = {
  id: number;
  reference: string;
  kind: BookingRequest["kind"];
  category: BookingRequest["category"];
  course_id: string | null;
  style_ref: string | null;
  full_name: string;
  phone: string;
  email: string | null;
  contact_method: BookingRequest["contactMethod"];
  event_date: Date | null;
  budget: BookingRequest["budget"];
  notes: string;
  inspiration_urls: string[];
  status: BookingStatus;
  admin_notes: string | null;
  created_at: Date;
};

export class PostgresBookingRepository implements BookingRepository {
  constructor(private readonly url: string) {}

  private sql() {
    globalThis.__olivetSql ??= postgres(this.url, {
      ssl: this.url.includes("localhost") ? false : "require",
      max: 3,
      idle_timeout: 20,
      prepare: false,
    });
    return globalThis.__olivetSql;
  }

  private ready() {
    const db = this.sql();
    globalThis.__olivetSchema ??= (async () => {
      await db`
        create table if not exists requests (
          id               bigserial primary key,
          reference        text not null unique,
          kind             text not null,
          category         text,
          course_id        text,
          style_ref        text,
          full_name        text not null,
          phone            text not null,
          email            text,
          contact_method   text not null,
          event_date       date,
          budget           text not null,
          notes            text not null default '',
          inspiration_urls text[] not null default '{}',
          status           text not null default 'new',
          admin_notes      text,
          created_at       timestamptz not null default now()
        )`;
      await db`create index if not exists requests_created on requests (created_at desc)`;
    })().catch((error) => {
      globalThis.__olivetSchema = undefined;
      throw error;
    });
    return globalThis.__olivetSchema;
  }

  async save(reference: string, r: BookingRequest, inspirationUrls: readonly string[]) {
    await this.ready();
    await this.sql()`
      insert into requests (reference, kind, category, course_id, style_ref, full_name, phone, email,
        contact_method, event_date, budget, notes, inspiration_urls)
      values (${reference}, ${r.kind}, ${r.category}, ${r.courseId}, ${r.styleRef}, ${r.fullName}, ${r.phone},
        ${r.email}, ${r.contactMethod}, ${r.eventDate}, ${r.budget}, ${r.notes}, ${[...inspirationUrls]})`;
  }

  async list(limit: number): Promise<BookingRecord[]> {
    await this.ready();
    const rows = (await this.sql()`select * from requests order by created_at desc limit ${limit}`) as unknown as Row[];
    return rows.map((row) => ({
      id: Number(row.id),
      reference: row.reference,
      kind: row.kind,
      category: row.category,
      courseId: row.course_id,
      styleRef: row.style_ref,
      fullName: row.full_name,
      phone: row.phone,
      email: row.email,
      contactMethod: row.contact_method,
      eventDate: row.event_date ? new Date(row.event_date).toISOString().slice(0, 10) : null,
      budget: row.budget,
      notes: row.notes,
      inspirationUrls: row.inspiration_urls,
      status: row.status,
      adminNotes: row.admin_notes,
      createdAt: new Date(row.created_at),
    }));
  }

  async update(id: number, status: BookingStatus, adminNotes: string) {
    await this.ready();
    await this.sql()`update requests set status = ${status}, admin_notes = ${adminNotes} where id = ${id}`;
  }
}
