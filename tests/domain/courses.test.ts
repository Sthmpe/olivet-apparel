import { describe, expect, it } from "vitest";
import { coursesByFormat, formatNaira } from "@/domain/courses";
import { courses } from "@/content/courses";

describe("courses", () => {
  it("formats naira prices", () => {
    expect(formatNaira(150000)).toBe("₦150,000");
  });

  it("keeps placeholder prices within the agreed range", () => {
    for (const c of courses) {
      expect(c.priceNaira).toBeGreaterThanOrEqual(100_000);
      expect(c.priceNaira).toBeLessThanOrEqual(230_000);
    }
  });

  it("filters by format and has unique ids", () => {
    expect(coursesByFormat(courses, "online").every((c) => c.format === "online")).toBe(true);
    expect(new Set(courses.map((c) => c.id)).size).toBe(courses.length);
  });
});
