import { describe, expect, it } from "vitest";
import { briefText, clientWhatsappLink, newReference, parseBooking } from "@/lib/booking";

function form(fields: Record<string, string>) {
  const fd = new FormData();
  for (const [k, v] of Object.entries(fields)) fd.set(k, v);
  return fd;
}

const valid = { fullName: "Ada Obi", phone: "08012345678", occasion: "bridal", fit: "unsure" };

describe("parseBooking", () => {
  it("accepts a minimal valid request and applies defaults", () => {
    const { data, errors } = parseBooking(form(valid));
    expect(errors).toBeUndefined();
    expect(data).toMatchObject({
      fullName: "Ada Obi",
      occasion: "bridal",
      preferredContact: "whatsapp",
      delivery: "pickup",
      budget: "Not sure yet",
      email: null,
      measurements: null,
    });
  });

  it("rejects a missing name, a short phone number and a malformed email", () => {
    const { data, errors } = parseBooking(form({ fullName: "A", phone: "123", email: "not-an-email" }));
    expect(data).toBeUndefined();
    expect(Object.keys(errors ?? {}).sort()).toEqual(["email", "fullName", "phone"]);
  });

  it("falls back to safe values for fields outside the allowed lists", () => {
    const { data } = parseBooking(form({ ...valid, occasion: "<script>", fit: "nope", budget: "a million" }));
    expect(data).toMatchObject({ occasion: "other", fit: "unsure", budget: "Not sure yet" });
  });

  it("keeps only styles that exist", () => {
    const { data } = parseBooking(form({ ...valid, looks: "the-aurelia, does-not-exist ,noir-sash" }));
    expect(data?.looks).toEqual(["the-aurelia", "noir-sash"]);
  });

  it("only records measurements when the client chose to send them", () => {
    const withFit = parseBooking(form({ ...valid, fit: "send_measurements", m_bust: "36", m_waist: "28" }));
    expect(withFit.data?.measurements).toEqual({ bust: "36", waist: "28" });
    const without = parseBooking(form({ ...valid, fit: "in_person_fitting", m_bust: "36" }));
    expect(without.data?.measurements).toBeNull();
  });

  it("truncates over-long input instead of storing it", () => {
    const { data } = parseBooking(form({ ...valid, notes: "x".repeat(5000) }));
    expect(data?.notes).toHaveLength(2000);
  });
});

describe("booking helpers", () => {
  it("generates references in the OA-XXXXX format without ambiguous characters", () => {
    for (let i = 0; i < 200; i++) expect(newReference()).toMatch(/^OA-[A-HJKMNP-Z2-9]{5}$/);
  });

  it("writes a brief that names the client and the chosen styles", () => {
    const { data } = parseBooking(form({ ...valid, looks: "the-aurelia" }));
    const brief = briefText("OA-TEST1", data!);
    expect(brief).toContain("OA-TEST1");
    expect(brief).toContain("Ada Obi");
    expect(brief).toContain("The Aurelia");
  });

  it("builds a WhatsApp link from a local Nigerian number", () => {
    const url = clientWhatsappLink("0801 234 5678", "Ada Obi", "OA-TEST1");
    expect(url.startsWith("https://wa.me/2348012345678?text=")).toBe(true);
    expect(decodeURIComponent(url)).toContain("Hello Ada");
  });
});
