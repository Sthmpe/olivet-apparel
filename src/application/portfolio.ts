import { parseStudioPhotoPath, studioPhotoPath, STUDIO_PHOTO_PREFIX, type CategoryId, type PortfolioPhoto } from "@/domain/catalog";
import type { FileStorage } from "./ports";

/**
 * Use cases for the portfolio: list every photo (curated set plus studio
 * uploads, newest uploads first) and let the designer add or remove uploads.
 */

export async function listPortfolio(catalog: readonly PortfolioPhoto[], files: FileStorage | null): Promise<PortfolioPhoto[]> {
  if (!files) return [...catalog];
  try {
    const uploads = (await files.list(STUDIO_PHOTO_PREFIX))
      .map((f) => ({ file: f, meta: parseStudioPhotoPath(f.pathname) }))
      .filter((x): x is { file: typeof x.file; meta: NonNullable<typeof x.meta> } => x.meta !== null)
      .sort((a, b) => b.meta.timestamp - a.meta.timestamp)
      .map<PortfolioPhoto>(({ file, meta }) => ({
        id: file.pathname,
        src: file.url,
        category: meta.category,
        title: meta.title,
        alt: `${meta.title}, made by Olivet Apparel`,
        width: 1200,
        height: 1500,
        origin: "studio",
      }));
    return [...uploads, ...catalog];
  } catch {
    return [...catalog];
  }
}

export async function addStudioPhoto(files: FileStorage, photo: Blob, category: CategoryId, title: string, now = Date.now()) {
  if (!photo.type.startsWith("image/")) throw new Error("Please choose an image file.");
  return files.put(studioPhotoPath(category, title, now), photo);
}

export async function removeStudioPhoto(files: FileStorage, url: string, pathname: string) {
  if (!pathname.startsWith(STUDIO_PHOTO_PREFIX)) throw new Error("Only studio uploads can be removed.");
  await files.remove(url);
}
