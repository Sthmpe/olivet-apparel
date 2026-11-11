import { describe, expect, it } from "vitest";
import { submitBooking } from "@/application/submit-booking";
import { MemoryBookingRepository, MemoryFileStorage, form, image } from "../fakes";

const courses = [{ id: "foundation-studio", title: "Foundation Sewing" }];
const valid = form({ kind: "outfit", fullName: "Ada Obi", phone: "08012345678", category: "dinner" });

describe("submitBooking", () => {
  it("returns a brief even with no storage configured", async () => {
    const result = await submitBooking(valid, [], { courses, bookings: null, files: null });
    expect(result.ok && result.stored).toBe(false);
    expect(result.ok && result.brief).toContain("Dinner");
  });

  it("stores the request and up to three inspiration photos", async () => {
    const bookings = new MemoryBookingRepository();
    const files = new MemoryFileStorage();
    const photos = [image(), image(), image(), image(), image(10, "text/plain")];
    const result = await submitBooking(valid, photos, { courses, bookings, files });
    expect(result.ok && result.stored).toBe(true);
    expect(bookings.saved[0].inspirationUrls).toHaveLength(3);
    expect(result.ok && result.brief).toContain("inspiration/");
  });

  it("still succeeds when storage fails, so the client can send the brief", async () => {
    const bookings = new MemoryBookingRepository();
    bookings.failSaves = true;
    const files = new MemoryFileStorage();
    files.failPuts = true;
    const result = await submitBooking(valid, [image()], { courses, bookings, files });
    expect(result.ok).toBe(true);
    expect(result.ok && result.stored).toBe(false);
  });

  it("names the class in the brief", async () => {
    const result = await submitBooking(form({ kind: "class", courseId: "foundation-studio", fullName: "Ada Obi", phone: "08012345678" }), [], { courses, bookings: null, files: null });
    expect(result.ok && result.brief).toContain("Foundation Sewing");
  });

  it("returns field errors without touching storage", async () => {
    const bookings = new MemoryBookingRepository();
    const result = await submitBooking(form({ fullName: "" }), [], { courses, bookings, files: null });
    expect(result.ok).toBe(false);
    expect(bookings.saved).toHaveLength(0);
  });
});
