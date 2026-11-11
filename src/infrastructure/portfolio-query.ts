import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { listPortfolio } from "@/application/portfolio";
import { catalogPhotos } from "@/content/catalog";
import { fileStorage } from "./container";

export const PORTFOLIO_TAG = "portfolio";

/** Cached portfolio listing. Studio uploads expire the cache through the "portfolio" tag. */
export async function getPortfolio() {
  "use cache";
  cacheTag(PORTFOLIO_TAG);
  cacheLife("hours");
  return listPortfolio(catalogPhotos, fileStorage());
}
