import { describe, expect, it } from "vitest";
import { matchLooks } from "@/lib/style-finder";

describe("matchLooks", () => {
  it("puts styles for the chosen occasion first", () => {
    const results = matchLooks({ occasion: "bridal" });
    expect(results).toHaveLength(3);
    expect(results.every((r) => r.look.occasion === "bridal")).toBe(true);
  });

  it("gives a full match 100% and never exceeds it", () => {
    const [best] = matchLooks({ occasion: "bridal", shape: "flowing", mood: "light", feel: "light" });
    expect(best.look.slug).toBe("the-aurelia");
    expect(best.pct).toBe(100);
  });

  it("is deterministic: the same answers always give the same order", () => {
    const answers = { occasion: "evening", mood: "dark" } as const;
    const slugs = () => matchLooks(answers, 5).map((r) => r.look.slug);
    expect(slugs()).toEqual(slugs());
  });

  it("still returns suggestions when nothing was answered", () => {
    expect(matchLooks({}, 4)).toHaveLength(4);
  });
});
