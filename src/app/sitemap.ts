import type { MetadataRoute } from "next";
import { CATEGORIES } from "@/domain/catalog";
import { site } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/portfolio", "/services", "/classes", "/about", "/book"];
  return [
    ...pages.map((p) => ({ url: `${site.url}${p}`, priority: p === "" ? 1 : 0.8 })),
    ...CATEGORIES.map((c) => ({ url: `${site.url}/portfolio?category=${c.id}`, priority: 0.6 })),
  ];
}
