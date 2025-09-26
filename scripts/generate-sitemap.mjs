// ESM sitemap generator
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";

const ROOT = resolve(new URL(".", import.meta.url).pathname, "..");
const SITE = process.env.SITE_URL || "https://tdstudiosny.com";

// 1) Base URLs
const urls = new Set([
  "/",        // home
  "/mylars",  // listing
]);

// 2) Parse slugs from TS source
const srcPath = resolve(ROOT, "../src/data/mylarProducts.ts");
const ts = readFileSync(srcPath, "utf8");
// matches: slug: "3designs"
const slugRe = /slug\s*:\s*["'`]([^"'`]+)["'`]/g;
for (const m of ts.matchAll(slugRe)) urls.add(`/mylars/${m[1]}`);

// 3) Build XML
const now = new Date().toISOString();
const urlset = [...urls].map((path) => {
  const loc = `${SITE}${path.startsWith("/") ? path : `/${path}`}`;
  return `  <url>
    <loc>${loc}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${path === "/mylars" ? "0.9" : path === "/" ? "1.0" : "0.8"}</priority>
  </url>`;
}).join("\n");

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlset}
</urlset>
`;

// 4) Write to public/sitemap.xml
const outDir = resolve(ROOT, "../public");
mkdirSync(outDir, { recursive: true });
const outPath = resolve(outDir, "sitemap.xml");
writeFileSync(outPath, xml, "utf8");
console.log(`Wrote ${outPath} with ${urls.size} URLs`);
