"use server";

import type { FieldErrors } from "@/domain/booking";
import { submitBooking } from "@/application/submit-booking";
import { courses } from "@/content/courses";
import { bookingRepository, fileStorage } from "@/infrastructure/container";

export type BookingFormState =
  | { status: "idle" }
  | { status: "invalid"; errors: FieldErrors }
  | { status: "sent"; reference: string; brief: string; stored: boolean };

/** Server Action adapter: translates the form post into the submitBooking use case. */
export async function sendBookingRequest(_previous: BookingFormState, form: FormData): Promise<BookingFormState> {
  // Spam guard: bots fill the hidden "website" field.
  if (String(form.get("website") ?? "")) return { status: "invalid", errors: {} };

  const photos = form.getAll("inspiration").filter((f): f is File => f instanceof File);
  const result = await submitBooking(form, photos, {
    courses,
    bookings: bookingRepository(),
    files: fileStorage(),
    log: (message, error) => console.error(`[booking] ${message}`, error),
  });

  return result.ok ? { status: "sent", reference: result.reference, brief: result.brief, stored: result.stored } : { status: "invalid", errors: result.errors };
}
