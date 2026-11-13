/**
 * Tells Bing, Yandex, Seznam, Naver and other IndexNow search engines that the
 * site's pages have changed, so they recrawl them quickly. Free, no account.
 * Google does not use IndexNow; it reads the sitemap through Search Console.
 *
 * Usage: node scripts/indexnow.mjs [siteUrl]
 */
import { readdirSync } from "node:fs";

const siteUrl = (process.argv[2] ?? process.env.SITE_URL ?? "https://olivet-apparel.vercel.app").replace(/\/$/, "");
const keyFile = readdirSync(new URL("../public", import.meta.url)).find((f) => /^[a-f0-9]{32}\.txt$/.test(f));
if (!keyFile) throw new Error("IndexNow key file not found in /public");
const key = keyFile.replace(".txt", "");

const sitemap = await (await fetch(`${siteUrl}/sitemap.xml`)).text();
const urlList = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
if (!urlList.length) throw new Error("No URLs found in the sitemap");

const response = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host: new URL(siteUrl).host, key, keyLocation: `${siteUrl}/${keyFile}`, urlList }),
});

console.log(`IndexNow: submitted ${urlList.length} URLs, response ${response.status}`);
if (response.status >= 400) process.exit(1);
