/**
 * Booking domain: what a client can request, how a request is validated, and
 * the plain-text brief sent to the designer. Pure functions only.
 */

import { getCategory, isCategoryId, type CategoryId } from "./catalog";

export const REQUEST_KINDS = [
  { value: "outfit", label: "An outfit" },
  { value: "class", label: "A sewing class" },
] as const;
export type RequestKind = (typeof REQUEST_KINDS)[number]["value"];

export const BUDGETS = ["Under ₦100k", "₦100k to ₦250k", "₦250k to ₦500k", "₦500k and above", "Not sure yet"] as const;
export type Budget = (typeof BUDGETS)[number];

export const CONTACT_METHODS = [
  { value: "whatsapp", label: "WhatsApp" },
  { value: "call", label: "Phone call" },
  { value: "email", label: "Email" },
] as const;
export type ContactMethod = (typeof CONTACT_METHODS)[number]["value"];

export const BOOKING_STATUSES = ["new", "contacted", "confirmed", "in_progress", "delivered", "cancelled"] as const;
export type BookingStatus = (typeof BOOKING_STATUSES)[number];

export type BookingRequest = {
  kind: RequestKind;
  category: CategoryId | null;
  courseId: string | null;
  styleRef: string | null;
  fullName: string;
  phone: string;
  email: string | null;
  contactMethod: ContactMethod;
  eventDate: string | null;
  budget: Budget;
  notes: string;
};

export type BookingField = "fullName" | "phone" | "email" | "eventDate" | "category" | "courseId";
export type FieldErrors = Partial<Record<BookingField, string>>;

/** Minimal read-only view of form input, so the domain does not depend on the DOM FormData type. */
export type FieldSource = { get(name: string): unknown };

export type ValidationResult = { ok: true; value: BookingRequest } | { ok: false; errors: FieldErrors };

const text = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const oneOf = <T extends string>(v: string, allowed: readonly T[], fallback: T): T =>
  (allowed as readonly string[]).includes(v) ? (v as T) : fallback;

export function validateBookingRequest(input: FieldSource, courseIds: readonly string[]): ValidationResult {
  const errors: FieldErrors = {};
  const kind = oneOf(text(input.get("kind"), 10), REQUEST_KINDS.map((k) => k.value), "outfit");
  const fullName = text(input.get("fullName"), 120);
  const phone = text(input.get("phone"), 40);
  const email = text(input.get("email"), 160);
  const eventDate = text(input.get("eventDate"), 10);
  const categoryRaw = text(input.get("category"), 20);
  const courseRaw = text(input.get("courseId"), 60);

  if (fullName.length < 2) errors.fullName = "Please enter your name.";
  if (phone.replace(/\D/g, "").length < 7) errors.phone = "Please enter a phone or WhatsApp number.";
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Please check your email address.";
  if (eventDate && !/^\d{4}-\d{2}-\d{2}$/.test(eventDate)) errors.eventDate = "Please choose a valid date.";
  if (kind === "class" && !courseIds.includes(courseRaw)) errors.courseId = "Please choose a class.";

  if (Object.keys(errors).length) return { ok: false, errors };

  return {
    ok: true,
    value: {
      kind,
      category: kind === "outfit" && isCategoryId(categoryRaw) ? categoryRaw : null,
      courseId: kind === "class" ? courseRaw : null,
      styleRef: text(input.get("styleRef"), 300) || null,
      fullName,
      phone,
      email: email || null,
      contactMethod: oneOf(text(input.get("contactMethod"), 10), CONTACT_METHODS.map((c) => c.value), "whatsapp"),
      eventDate: kind === "outfit" ? eventDate || null : null,
      budget: oneOf(text(input.get("budget"), 40), BUDGETS, "Not sure yet"),
      notes: text(input.get("notes"), 2000),
    },
  };
}

/** Booking reference such as OA-7K3PQ. Excludes look-alike characters (0/O, 1/I/L). */
export function createReference(random: (n: number) => Uint8Array = (n) => crypto.getRandomValues(new Uint8Array(n))): string {
  const alphabet = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  return "OA-" + Array.from(random(5), (b) => alphabet[b % alphabet.length]).join("");
}

export function categoryLabel(id: CategoryId | null): string | null {
  return id ? getCategory(id).label : null;
}

/** The request as plain text, used for the WhatsApp hand-off and email. */
export function bookingBrief(
  reference: string,
  request: BookingRequest,
  extras: { courseTitle?: string | null; inspirationUrls?: readonly string[] } = {},
): string {
  const lines = [
    `New request from the Olivet Apparel website (${reference})`,
    "",
    `Name: ${request.fullName}`,
    `Phone: ${request.phone}`,
    request.email ? `Email: ${request.email}` : null,
    `Best contact: ${CONTACT_METHODS.find((c) => c.value === request.contactMethod)?.label}`,
    request.kind === "class" ? `Interested in: ${extras.courseTitle ?? "a sewing class"}` : `Interested in: ${categoryLabel(request.category) ?? "an outfit"}`,
    request.styleRef ? `Style: ${request.styleRef}` : null,
    request.eventDate ? `Event date: ${request.eventDate}` : null,
    request.kind === "outfit" ? `Budget: ${request.budget}` : null,
    request.notes ? `Notes: ${request.notes}` : null,
    extras.inspirationUrls?.length ? `Inspiration photos:\n${extras.inspirationUrls.join("\n")}` : null,
  ];
  return lines.filter((l) => l !== null).join("\n");
}

/** WhatsApp chat link to a client. Local Nigerian numbers (080...) are converted to +234. */
export function whatsappLinkTo(phone: string, message: string): string {
  const digits = phone.replace(/\D/g, "").replace(/^0/, "234");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}
