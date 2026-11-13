import type { MetadataRoute } from "next";
import { site } from "@/content/site";

export const SITEMAP_PATHS = ["", "/portfolio", "/services", "/classes", "/about", "/book"] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return SITEMAP_PATHS.map((path) => ({
    url: `${site.url}${path}`,
    changeFrequency: path === "" || path === "/portfolio" ? "weekly" : "monthly",
    priority: path === "" ? 1 : path === "/portfolio" ? 0.9 : 0.7,
  }));
}
