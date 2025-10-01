// ESM sitemap generator
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";

const ROOT = resolve(new URL(".", import.meta.url).pathname, "..");
const SITE = process.env.SITE_URL || "https://tdstudioshq.com";

// 1) Base URLs
const urls = new Set([
  "/",        // home
  "/shop",    // shop listing
  "/mylars",  // mylar listing
]);

// 2) Parse mylar slugs from TS source
const mylarPath = resolve(ROOT, "src/data/mylarProducts.ts");
const mylarTs = readFileSync(mylarPath, "utf8");
// matches: slug: "3designs"
const slugRe = /slug\s*:\s*["'`]([^"'`]+)["'`]/g;
for (const m of mylarTs.matchAll(slugRe)) urls.add(`/mylars/${m[1]}`);

// 3) Parse product IDs from TS source
const productPath = resolve(ROOT, "src/data/products.ts");
const productTs = readFileSync(productPath, "utf8");
// matches: id: "product-id"
const idRe = /id\s*:\s*["'`]([^"'`]+)["'`]/g;
for (const m of productTs.matchAll(idRe)) urls.add(`/shop/${m[1]}`);

// 4) Build XML
const now = new Date().toISOString();
const urlset = [...urls].map((path) => {
  const loc = `${SITE}${path.startsWith("/") ? path : `/${path}`}`;
  let priority = "0.8";
  if (path === "/") priority = "1.0";
  else if (path === "/shop" || path === "/mylars") priority = "0.9";
  else if (path.startsWith("/shop/") || path.startsWith("/mylars/")) priority = "0.7";

  return `  <url>
    <loc>${loc}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>
  </url>`;
}).join("\n");

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlset}
</urlset>
`;

// 5) Write to public/sitemap.xml
const outDir = resolve(ROOT, "public");
mkdirSync(outDir, { recursive: true });
const outPath = resolve(outDir, "sitemap.xml");
writeFileSync(outPath, xml, "utf8");
console.log(`Wrote ${outPath} with ${urls.size} URLs`);
