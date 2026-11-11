/**
 * Catalog domain: the categories Olivet Apparel works in and the photos shown
 * in the portfolio. Pure TypeScript with no framework or I/O dependencies.
 */

export const CATEGORIES = [
  { id: "bridal", label: "Bridal", summary: "Wedding gowns, reception dresses and bridal party outfits." },
  { id: "prom", label: "Prom", summary: "Statement gowns for prom night and graduation." },
  { id: "dinner", label: "Dinner", summary: "Elegant dresses for dinners, galas and celebrations." },
  { id: "corporate", label: "Corporate", summary: "Tailored suits, dresses and two-piece sets for work." },
  { id: "everyday", label: "Everyday", summary: "Easy, polished pieces for church, outings and weekends." },
  { id: "ankara", label: "Ankara", summary: "Bold African print styles, from casual wear to owambe." },
  { id: "trousers", label: "Trousers", summary: "Palazzos, tailored trousers and trouser sets." },
] as const;

export type CategoryId = (typeof CATEGORIES)[number]["id"];
export type Category = (typeof CATEGORIES)[number];

/** Where a photo comes from: the curated set shipped with the site, or an upload from the studio. */
export type PhotoOrigin = "catalog" | "studio";

export type PortfolioPhoto = {
  id: string;
  src: string;
  category: CategoryId;
  title: string;
  alt: string;
  width: number;
  height: number;
  origin: PhotoOrigin;
};

const CATEGORY_IDS = new Set<string>(CATEGORIES.map((c) => c.id));

export function isCategoryId(value: unknown): value is CategoryId {
  return typeof value === "string" && CATEGORY_IDS.has(value);
}

export function getCategory(id: CategoryId): Category {
  return CATEGORIES.find((c) => c.id === id)!;
}

export function filterByCategory(photos: readonly PortfolioPhoto[], category?: CategoryId | null): PortfolioPhoto[] {
  return category ? photos.filter((p) => p.category === category) : [...photos];
}

/** First photo of each category, in category order. Used for category tiles. */
export function coverPhotos(photos: readonly PortfolioPhoto[]): Map<CategoryId, PortfolioPhoto> {
  const covers = new Map<CategoryId, PortfolioPhoto>();
  for (const p of photos) if (!covers.has(p.category)) covers.set(p.category, p);
  return covers;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

/**
 * Studio uploads keep their metadata in the storage path, so no database is
 * needed: portfolio/<category>/<timestamp>-<title-slug>.<ext>
 */
export const STUDIO_PHOTO_PREFIX = "portfolio/";

export function studioPhotoPath(category: CategoryId, title: string, timestamp: number, extension = "jpg"): string {
  const slug = slugify(title) || "outfit";
  return `${STUDIO_PHOTO_PREFIX}${category}/${timestamp}-${slug}.${extension}`;
}

export function parseStudioPhotoPath(pathname: string): { category: CategoryId; title: string; timestamp: number } | null {
  const match = /^portfolio\/([a-z]+)\/(\d+)-([a-z0-9-]+)\.[a-z0-9]+$/.exec(pathname);
  if (!match || !isCategoryId(match[1])) return null;
  const words = match[3].split("-").filter(Boolean);
  const title = words.map((w) => w[0].toUpperCase() + w.slice(1)).join(" ");
  return { category: match[1], title, timestamp: Number(match[2]) };
}
