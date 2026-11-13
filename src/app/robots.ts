import type { MetadataRoute } from "next";
import { site } from "@/content/site";

/** Search engines and AI assistants may read every public page; the studio and API stay private. */
export default function robots(): MetadataRoute.Robots {
  const disallow = ["/studio", "/api"];
  const aiCrawlers = ["GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "Claude-SearchBot", "PerplexityBot", "Google-Extended", "Applebot-Extended", "CCBot"];
  return {
    rules: [{ userAgent: "*", allow: "/", disallow }, ...aiCrawlers.map((userAgent) => ({ userAgent, allow: "/", disallow }))],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
