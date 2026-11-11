import type { MetadataRoute } from "next";
import { collections, looks } from "@/content/looks";
import { site } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/styles", "/style-finder", "/about", "/book"];
  return [
    ...pages.map((p) => ({ url: `${site.url}${p}`, priority: p === "" ? 1 : 0.8 })),
    ...collections.map((c) => ({ url: `${site.url}/styles/${c.slug}`, priority: 0.7 })),
    ...looks.map((l) => ({ url: `${site.url}/looks/${l.slug}`, priority: 0.6 })),
  ];
}
