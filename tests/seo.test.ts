import { describe, expect, it } from "vitest";
import { CATEGORIES } from "@/domain/catalog";
import { courses } from "@/content/courses";
import { seo, site } from "@/content/site";
import { businessSchema, coursesSchema } from "@/components/seo/structured-data";
import { existsSync, readFileSync } from "node:fs";

describe("search engine data", () => {
  it("describes the business with every service category", () => {
    const data = businessSchema(CATEGORIES);
    expect(data["@type"]).toBe("ClothingStore");
    expect(data.address).toMatchObject({ addressLocality: "Ilorin", addressRegion: "Kwara State", addressCountry: "NG" });
    expect(data.founder.name).toBe(site.designerFullName);
    expect(data.sameAs).toHaveLength(3);
    expect(data.hasOfferCatalog.itemListElement).toHaveLength(CATEGORIES.length);
  });

  it("lists every class with a price in naira", () => {
    const data = coursesSchema(courses);
    expect(data.itemListElement).toHaveLength(courses.length);
    expect(data.itemListElement[0].item.offers.priceCurrency).toBe("NGN");
  });

  it("ships the IndexNow key file that matches the configured key", () => {
    const file = `public/${seo.indexNowKey}.txt`;
    expect(existsSync(file)).toBe(true);
    expect(readFileSync(file, "utf8")).toBe(seo.indexNowKey);
  });
});
