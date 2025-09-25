import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const base = process.env.SITE_URL?.replace(/\/$/, "") || "https://tdstudioshq.com";

const sourcePath = resolve("src/data/mylarProducts.ts");
const source = readFileSync(sourcePath, "utf-8");
const slugMatches = [...source.matchAll(/slug:\s*"([^"]+)"/g)];
const productSlugs = slugMatches.map(([, slug]) => slug);

const urls = [
  `${base}/`,
  `${base}/mylars`,
  ...productSlugs.map((slug) => `${base}/mylars/${slug}`),
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${u}</loc></url>`).join("\n")}
</urlset>`;

writeFileSync("public/sitemap.xml", xml);
console.log(`sitemap.xml written with ${urls.length} entries.`);
