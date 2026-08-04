// Generates dist/sitemap.xml and dist/robots.txt from the same route manifest
// used by scripts/prerender.ts, so these files can never drift from what's
// actually deployed the way public/sitemap.xml (hand-maintained, 74 static
// entries, no blog posts) and api-server.ts's buildSitemap() (DB-only,
// duplicated route list) previously could.
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { getAllRoutes } from "./routes";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(__dirname, "..", "dist");
const SITE_URL = "https://residenceabudhabi.com";

async function main() {
  const routes = await getAllRoutes();
  const today = new Date().toISOString().slice(0, 10);

  const urls = routes
    .map(
      (r) =>
        `  <url><loc>${SITE_URL}${r.path}</loc><lastmod>${today}</lastmod><changefreq>${r.changefreq}</changefreq><priority>${r.priority}</priority></url>`
    )
    .join("\n");

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;

  const robots = `User-agent: *
Allow: /
Disallow: /admin

# AI answer-engine and research crawlers are explicitly welcome.
User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: anthropic-ai
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: Applebot-Extended
Allow: /

User-agent: CCBot
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`;

  fs.mkdirSync(distDir, { recursive: true });
  fs.writeFileSync(path.join(distDir, "sitemap.xml"), sitemap);
  fs.writeFileSync(path.join(distDir, "robots.txt"), robots);
  console.log(`[generate-seo-files] Wrote sitemap.xml with ${routes.length} URLs and robots.txt to dist/.`);
}

main().catch((e) => {
  console.error("[generate-seo-files] Fatal error:", e);
  process.exit(1);
});
