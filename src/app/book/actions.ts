"use server";

import { briefText, newReference, parseBooking, type FieldErrors } from "@/lib/booking";
import { ensureSchema, hasDatabase, sql } from "@/lib/db";
import { hasEmail, sendBookingEmails, type Attachment } from "@/lib/email";

export type BookingState =
  | { status: "idle" }
  | { status: "error"; message: string; errors?: FieldErrors }
  | { status: "sent"; reference: string; brief: string; delivered: boolean };

const MAX_FILES = 3;
const MAX_FILE_BYTES = 1.5 * 1024 * 1024;

export async function submitBooking(_prev: BookingState, fd: FormData): Promise<BookingState> {
  // Spam guards: hidden honeypot field + a minimum time on the form.
  if (String(fd.get("company") ?? "")) return { status: "error", message: "Something went wrong. Please try again." };
  const started = Number(fd.get("started") ?? 0);
  if (started && Date.now() - started < 2500) return { status: "error", message: "That was quick! Please try again." };

  const { data, errors } = parseBooking(fd);
  if (!data) return { status: "error", message: "Please check the highlighted fields.", errors };

  const files = fd
    .getAll("inspiration")
    .filter((f): f is File => f instanceof File && f.size > 0 && f.type.startsWith("image/"))
    .slice(0, MAX_FILES);
  const attachments: Attachment[] = [];
  for (const f of files) {
    if (f.size > MAX_FILE_BYTES) continue;
    attachments.push({ filename: f.name.replace(/[^\w.\-]/g, "_") || "inspiration.jpg", content: Buffer.from(await f.arrayBuffer()).toString("base64") });
  }

  const reference = newReference();
  const brief = briefText(reference, data);
  let saved = false;
  let emailed = false;

  // 1. Save first: a lead must never be lost because an email failed.
  if (hasDatabase()) {
    try {
      await ensureSchema();
      const db = sql();
      await db`
        insert into bookings (reference, full_name, email, phone, preferred_contact, occasion, event_date, fit,
          measurements, delivery, budget_range, notes, look_slugs, style_finder, attachment_count)
        values (${reference}, ${data.fullName}, ${data.email}, ${data.phone}, ${data.preferredContact}, ${data.occasion},
          ${data.eventDate}, ${data.fit}, ${data.measurements ? db.json(data.measurements) : null}, ${data.delivery},
          ${data.budget}, ${data.notes}, ${data.looks}, ${data.style}, ${attachments.length})`;
      saved = true;
    } catch (e) {
      console.error("[booking] database save failed", e);
    }
  }

  // 2. Notify the designer (and the client, when a sending domain is verified).
  if (hasEmail()) {
    try {
      await sendBookingEmails(reference, data, brief, attachments);
      emailed = true;
      if (saved) await sql()`update bookings set emailed_at = now() where reference = ${reference}`;
    } catch (e) {
      console.error("[booking] email failed", e);
    }
  }

  if (!saved && !emailed) console.warn(`[booking] ${reference} was not stored or emailed: configure DATABASE_URL / RESEND_API_KEY.\n${brief}`);

  return { status: "sent", reference, brief, delivered: saved || emailed };
}
