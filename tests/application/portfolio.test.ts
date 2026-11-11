import { describe, expect, it } from "vitest";
import { addStudioPhoto, listPortfolio, removeStudioPhoto } from "@/application/portfolio";
import type { PortfolioPhoto } from "@/domain/catalog";
import { MemoryFileStorage, image } from "../fakes";

const seed: PortfolioPhoto = { id: "seed", src: "/seed.jpg", category: "bridal", title: "Seed", alt: "Seed", width: 1, height: 1, origin: "catalog" };

describe("portfolio use cases", () => {
  it("lists studio uploads newest first, then the shipped catalog", async () => {
    const files = new MemoryFileStorage();
    await addStudioPhoto(files, image(), "prom", "Older", 1000);
    await addStudioPhoto(files, image(), "ankara", "Newer", 2000);
    const photos = await listPortfolio([seed], files);
    expect(photos.map((p) => p.title)).toEqual(["Newer", "Older", "Seed"]);
    expect(photos[0]).toMatchObject({ category: "ankara", origin: "studio" });
  });

  it("falls back to the catalog when storage is missing or failing", async () => {
    expect(await listPortfolio([seed], null)).toEqual([seed]);
    const broken = new MemoryFileStorage();
    broken.list = async () => {
      throw new Error("down");
    };
    expect(await listPortfolio([seed], broken)).toEqual([seed]);
  });

  it("refuses non-images and removal outside the portfolio folder", async () => {
    const files = new MemoryFileStorage();
    await expect(addStudioPhoto(files, image(10, "text/plain"), "prom", "x")).rejects.toThrow();
    await expect(removeStudioPhoto(files, "https://x", "inspiration/OA-1/1.jpg")).rejects.toThrow();
  });
});
