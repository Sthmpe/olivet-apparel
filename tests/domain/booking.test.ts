import { describe, expect, it } from "vitest";
import { bookingBrief, createReference, validateBookingRequest, whatsappLinkTo } from "@/domain/booking";
import { form } from "../fakes";

const courses = ["foundation-studio"];
const outfit = { kind: "outfit", fullName: "Ada Obi", phone: "08012345678", category: "bridal" };

describe("validateBookingRequest", () => {
  it("accepts a minimal outfit request and applies defaults", () => {
    const result = validateBookingRequest(form(outfit), courses);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value).toMatchObject({ kind: "outfit", category: "bridal", contactMethod: "whatsapp", budget: "Not sure yet", email: null, courseId: null });
  });

  it("reports every invalid field at once", () => {
    const result = validateBookingRequest(form({ fullName: "A", phone: "12", email: "nope", eventDate: "tomorrow" }), courses);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(Object.keys(result.errors).sort()).toEqual(["email", "eventDate", "fullName", "phone"]);
  });

  it("requires a real class for class requests and ignores outfit-only fields", () => {
    expect(validateBookingRequest(form({ ...outfit, kind: "class", courseId: "unknown" }), courses).ok).toBe(false);
    const result = validateBookingRequest(form({ ...outfit, kind: "class", courseId: "foundation-studio", eventDate: "2027-01-01" }), courses);
    expect(result.ok && result.value).toMatchObject({ courseId: "foundation-studio", category: null, eventDate: null });
  });

  it("replaces values outside the allowed lists with safe defaults", () => {
    const result = validateBookingRequest(form({ ...outfit, kind: "hack", category: "<script>", budget: "lots", contactMethod: "pigeon" }), courses);
    expect(result.ok && result.value).toMatchObject({ kind: "outfit", category: null, budget: "Not sure yet", contactMethod: "whatsapp" });
  });

  it("truncates long notes", () => {
    const result = validateBookingRequest(form({ ...outfit, notes: "x".repeat(5000) }), courses);
    expect(result.ok && result.value.notes).toHaveLength(2000);
  });
});

describe("booking helpers", () => {
  it("creates references without look-alike characters", () => {
    for (let i = 0; i < 200; i++) expect(createReference()).toMatch(/^OA-[A-HJKMNP-Z2-9]{5}$/);
  });

  it("writes a brief with the client, the category and inspiration links", () => {
    const result = validateBookingRequest(form({ ...outfit, styleRef: "Lace mermaid gown" }), courses);
    if (!result.ok) throw new Error("invalid");
    const brief = bookingBrief("OA-TEST1", result.value, { inspirationUrls: ["https://x/1.jpg"] });
    for (const part of ["OA-TEST1", "Ada Obi", "Bridal", "Lace mermaid gown", "https://x/1.jpg"]) expect(brief).toContain(part);
  });

  it("builds WhatsApp links from local Nigerian numbers", () => {
    expect(whatsappLinkTo("0801 234 5678", "Hi").startsWith("https://wa.me/2348012345678?text=Hi")).toBe(true);
  });
});
