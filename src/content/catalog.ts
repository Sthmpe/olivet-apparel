import type { PortfolioPhoto } from "@/domain/catalog";

/**
 * Photos shipped with the site. The live portfolio is managed from /studio and
 * stored in Vercel Blob; anything listed here is shown after those uploads.
 */
export const catalogPhotos: PortfolioPhoto[] = [];
