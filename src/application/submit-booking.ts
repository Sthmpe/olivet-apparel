import { bookingBrief, createReference, validateBookingRequest, type FieldErrors, type FieldSource } from "@/domain/booking";
import type { Course } from "@/domain/courses";
import type { BookingRepository, FileStorage } from "./ports";

export type SubmitBookingDeps = {
  courses: readonly Pick<Course, "id" | "title">[];
  bookings: BookingRepository | null;
  files: FileStorage | null;
  log?: (message: string, error?: unknown) => void;
};

export type SubmitBookingResult =
  | { ok: true; reference: string; brief: string; stored: boolean }
  | { ok: false; errors: FieldErrors };

const MAX_PHOTOS = 3;
const MAX_PHOTO_BYTES = 1.5 * 1024 * 1024;

/**
 * Use case: a visitor sends a booking request.
 * Validate, keep any inspiration photos, save the request, and return a brief
 * the visitor can forward. Storage steps are optional and never block the brief.
 */
export async function submitBooking(input: FieldSource, photos: readonly Blob[], deps: SubmitBookingDeps): Promise<SubmitBookingResult> {
  const result = validateBookingRequest(input, deps.courses.map((c) => c.id));
  if (!result.ok) return result;

  const request = result.value;
  const reference = createReference();
  const log = deps.log ?? (() => {});

  const inspirationUrls: string[] = [];
  if (deps.files) {
    const usable = photos.filter((p) => p.size > 0 && p.size <= MAX_PHOTO_BYTES && p.type.startsWith("image/")).slice(0, MAX_PHOTOS);
    for (const [i, photo] of usable.entries()) {
      try {
        const saved = await deps.files.put(`inspiration/${reference}/${i + 1}.jpg`, photo);
        inspirationUrls.push(saved.url);
      } catch (error) {
        log("inspiration upload failed", error);
      }
    }
  }

  let stored = false;
  if (deps.bookings) {
    try {
      await deps.bookings.save(reference, request, inspirationUrls);
      stored = true;
    } catch (error) {
      log("booking save failed", error);
    }
  }

  const courseTitle = deps.courses.find((c) => c.id === request.courseId)?.title ?? null;
  return { ok: true, reference, brief: bookingBrief(reference, request, { courseTitle, inspirationUrls }), stored };
}
