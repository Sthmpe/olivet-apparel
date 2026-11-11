import { getLook } from "@/content/looks";

export const STATUSES = ["new", "contacted", "fitting_booked", "in_progress", "delivered", "cancelled"] as const;

export const OCCASIONS = [
  { value: "bridal", label: "Wedding / bridal" },
  { value: "celebration", label: "Owambe / party / asoebi" },
  { value: "evening", label: "Evening / gala / dinner" },
  { value: "everyday", label: "Everyday / work / church" },
  { value: "other", label: "Something else" },
] as const;

export const BUDGETS = ["Under ₦150k", "₦150k to ₦350k", "₦350k to ₦750k", "₦750k to ₦1.5m", "₦1.5m and above", "Not sure yet"] as const;

export const FITS = [
  { value: "in_person_fitting", label: "Book an in-person fitting", hint: "We measure you at the studio" },
  { value: "send_measurements", label: "I'll send my measurements", hint: "Guided fields below" },
  { value: "unsure", label: "Not sure yet", hint: "We'll advise on your call" },
] as const;

export const CONTACTS = [
  { value: "whatsapp", label: "WhatsApp" },
  { value: "call", label: "Phone call" },
  { value: "email", label: "Email" },
] as const;

export type BookingInput = {
  fullName: string;
  phone: string;
  email: string | null;
  preferredContact: string;
  occasion: string;
  eventDate: string | null;
  fit: string;
  measurements: Record<string, string> | null;
  delivery: string;
  budget: string;
  notes: string;
  looks: string[];
  style: string | null;
};

export type FieldErrors = Partial<Record<"fullName" | "phone" | "email" | "occasion" | "eventDate" | "notes", string>>;

const str = (v: FormDataEntryValue | null, max = 500) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const oneOf = <T extends string>(v: string, allowed: readonly T[], fallback: T): T => ((allowed as readonly string[]).includes(v) ? (v as T) : fallback);

export function parseBooking(fd: FormData): { data?: BookingInput; errors?: FieldErrors } {
  const errors: FieldErrors = {};
  const fullName = str(fd.get("fullName"), 120);
  const phone = str(fd.get("phone"), 40);
  const emailRaw = str(fd.get("email"), 160);
  const occasion = oneOf(str(fd.get("occasion")), OCCASIONS.map((o) => o.value), "other");
  const eventDate = str(fd.get("eventDate"), 10) || null;
  const fit = oneOf(str(fd.get("fit")), FITS.map((f) => f.value), "unsure");

  if (fullName.length < 2) errors.fullName = "Please tell us your name.";
  if (phone.replace(/\D/g, "").length < 7) errors.phone = "Please add a phone / WhatsApp number we can reach you on.";
  if (emailRaw && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailRaw)) errors.email = "That email doesn't look quite right.";
  if (eventDate && !/^\d{4}-\d{2}-\d{2}$/.test(eventDate)) errors.eventDate = "Please choose a valid date.";

  const measurements =
    fit === "send_measurements"
      ? Object.fromEntries(
          ["bust", "waist", "hips", "height", "shoulder", "length"]
            .map((k) => [k, str(fd.get(`m_${k}`), 20)] as const)
            .filter(([, v]) => v),
        )
      : null;

  const looks = str(fd.get("looks"), 400)
    .split(",")
    .map((s) => s.trim())
    .filter((s) => getLook(s))
    .slice(0, 6);

  if (Object.keys(errors).length) return { errors };
  return {
    data: {
      fullName,
      phone,
      email: emailRaw || null,
      preferredContact: oneOf(str(fd.get("preferredContact")), CONTACTS.map((c) => c.value), "whatsapp"),
      occasion,
      eventDate,
      fit,
      measurements: measurements && Object.keys(measurements).length ? measurements : null,
      delivery: oneOf(str(fd.get("delivery")), ["pickup", "delivery"] as const, "pickup"),
      budget: oneOf(str(fd.get("budget")), BUDGETS, "Not sure yet"),
      notes: str(fd.get("notes"), 2000),
      looks,
      style: str(fd.get("style"), 200) || null,
    },
  };
}

export function newReference() {
  const alphabet = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  const bytes = crypto.getRandomValues(new Uint8Array(5));
  return "OA-" + Array.from(bytes, (b) => alphabet[b % alphabet.length]).join("");
}

export function labelFor<T extends { value: string; label: string }>(list: readonly T[], v: string) {
  return list.find((x) => x.value === v)?.label ?? v;
}

/** Plain-text brief used for WhatsApp and as the email's text version. */
export function briefText(ref: string, b: BookingInput) {
  const lines = [
    `New Olivet Apparel booking ${ref}`,
    `Name: ${b.fullName}`,
    `Phone: ${b.phone}`,
    b.email ? `Email: ${b.email}` : null,
    `Occasion: ${labelFor(OCCASIONS, b.occasion)}`,
    b.eventDate ? `Event date: ${b.eventDate}` : null,
    b.looks.length ? `Styles: ${b.looks.map((s) => getLook(s)?.title ?? s).join(", ")}` : null,
    `Fit: ${labelFor(FITS, b.fit)}`,
    b.measurements ? `Measurements: ${Object.entries(b.measurements).map(([k, v]) => `${k} ${v}`).join(", ")}` : null,
    `Delivery: ${b.delivery}`,
    `Budget: ${b.budget}`,
    b.style ? `Style Finder: ${b.style.replaceAll("|", ", ")}` : null,
    b.notes ? `Notes: ${b.notes}` : null,
  ];
  return lines.filter(Boolean).join("\n");
}
