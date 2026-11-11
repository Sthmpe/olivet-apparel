import { describe, expect, it } from "vitest";
import { fabrics } from "@/content/fabrics";
import { collections, looks, relatedLooks } from "@/content/looks";
import { garmentGeometry } from "@/lib/garment";

describe("portfolio content", () => {
  it("has unique slugs", () => {
    expect(new Set(looks.map((l) => l.slug)).size).toBe(looks.length);
    expect(new Set(collections.map((c) => c.slug)).size).toBe(collections.length);
  });

  it("links every style to a real collection and real fabrics", () => {
    const collectionSlugs = new Set(collections.map((c) => c.slug));
    const fabricIds = new Set(fabrics.map((f) => f.id));
    for (const look of looks) {
      expect(collectionSlugs.has(look.collection), look.slug).toBe(true);
      expect(look.fabrics.length, look.slug).toBeGreaterThan(0);
      for (const f of look.fabrics) expect(fabricIds.has(f), `${look.slug}: ${f}`).toBe(true);
    }
  });

  it("gives every collection at least one style", () => {
    for (const c of collections) expect(looks.some((l) => l.collection === c.slug), c.slug).toBe(true);
  });

  it("never recommends a style as related to itself", () => {
    for (const look of looks) expect(relatedLooks(look).map((l) => l.slug)).not.toContain(look.slug);
  });
});

describe("garmentGeometry", () => {
  it("draws every style with valid SVG paths", () => {
    for (const look of looks) {
      const g = garmentGeometry(look.silhouette, look.neckline, look.train);
      const paths = [...g.pieces, ...g.lines, ...g.marks, ...(g.ribbon ? [g.ribbon] : [])];
      expect(g.pieces.length, look.slug).toBeGreaterThan(0);
      for (const d of paths) {
        expect(d, look.slug).toMatch(/^M /);
        expect(d, look.slug).not.toMatch(/NaN|undefined/);
      }
    }
  });

  it("adds a train only when asked", () => {
    expect(garmentGeometry("aline", "v", true).ribbon).toBeDefined();
    expect(garmentGeometry("aline", "v", false).ribbon).toBeUndefined();
  });
});
