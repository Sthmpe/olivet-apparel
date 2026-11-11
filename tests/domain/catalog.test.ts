import { describe, expect, it } from "vitest";
import { CATEGORIES, coverPhotos, filterByCategory, parseStudioPhotoPath, slugify, studioPhotoPath, type PortfolioPhoto } from "@/domain/catalog";

const photo = (id: string, category: PortfolioPhoto["category"]): PortfolioPhoto => ({ id, src: `/${id}.jpg`, category, title: id, alt: id, width: 1, height: 1, origin: "studio" });

describe("catalog", () => {
  it("covers every service the designer offers", () => {
    expect(CATEGORIES.map((c) => c.id)).toEqual(["bridal", "prom", "dinner", "corporate", "everyday", "ankara", "trousers"]);
  });

  it("round-trips studio photo paths so no database is needed for metadata", () => {
    const path = studioPhotoPath("prom", "Gold Sequin Gown!", 1700000000000);
    expect(path).toBe("portfolio/prom/1700000000000-gold-sequin-gown.jpg");
    expect(parseStudioPhotoPath(path)).toEqual({ category: "prom", title: "Gold Sequin Gown", timestamp: 1700000000000 });
  });

  it("rejects paths outside the portfolio or with unknown categories", () => {
    expect(parseStudioPhotoPath("inspiration/OA-1/1.jpg")).toBeNull();
    expect(parseStudioPhotoPath("portfolio/shoes/1-x.jpg")).toBeNull();
  });

  it("slugifies accents and punctuation", () => {
    expect(slugify("Àdìrẹ Wrap / Dress")).toBe("adire-wrap-dress");
  });

  it("filters and picks one cover per category", () => {
    const photos = [photo("a", "bridal"), photo("b", "prom"), photo("c", "bridal")];
    expect(filterByCategory(photos, "bridal").map((p) => p.id)).toEqual(["a", "c"]);
    expect(filterByCategory(photos, null)).toHaveLength(3);
    expect(coverPhotos(photos).get("bridal")?.id).toBe("a");
  });
});
