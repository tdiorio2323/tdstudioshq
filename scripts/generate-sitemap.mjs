import { writeFileSync } from "node:fs";
const base = "https://tdstudioshq.com";
const urls = [`${base}/`];
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u=>`  <url><loc>${u}</loc></url>`).join("\n")}
</urlset>`;
writeFileSync("public/sitemap.xml", xml);
console.log("sitemap.xml written");
