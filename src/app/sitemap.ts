import type { MetadataRoute } from "next";
import { collections, looks } from "@/content/looks";
import { site } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/collections", "/style-finder", "/atelier", "/book"];
  return [
    ...pages.map((p) => ({ url: `${site.url}${p}`, priority: p === "" ? 1 : 0.8 })),
    ...collections.map((c) => ({ url: `${site.url}/collections/${c.slug}`, priority: 0.7 })),
    ...looks.map((l) => ({ url: `${site.url}/looks/${l.slug}`, priority: 0.6 })),
  ];
}
