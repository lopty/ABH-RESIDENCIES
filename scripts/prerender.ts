// Snapshots every route in the app to real, static HTML so that crawlers which
// never execute JavaScript (most AI answer-engine bots included) receive the
// exact same title, meta tags, JSON-LD, and visible page text a browser would
// render. Human visitors get the identical file; React then boots on top of it
// exactly as it does today (src/main.tsx uses createRoot().render(), not
// hydrateRoot(), so it simply replaces the DOM — there is no hydration mismatch
// risk from serving fully-rendered markup).
import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { chromium } from "playwright";
import { getAllRoutes } from "./routes";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(__dirname, "..", "dist");

function outputPathFor(routePath: string): string {
  if (routePath === "/") return path.join(distDir, "index.html");
  const clean = routePath.replace(/^\//, "");
  return path.join(distDir, clean, "index.html");
}

async function main() {
  if (!fs.existsSync(path.join(distDir, "index.html"))) {
    console.error("[prerender] dist/index.html not found — run `vite build` first.");
    process.exit(1);
  }

  // Preserve the original client-only shell as the SPA fallback for any route
  // not covered by the manifest below, before we start overwriting index.html.
  const originalShell = fs.readFileSync(path.join(distDir, "index.html"), "utf-8");
  fs.writeFileSync(path.join(distDir, "404.html"), originalShell);

  const app = express();
  app.use(express.static(distDir));
  app.get("*", (_req, res) => res.sendFile(path.join(distDir, "index.html")));
  const server = app.listen(0);
  const port = (server.address() as { port: number }).port;
  const base = `http://127.0.0.1:${port}`;

  const routes = await getAllRoutes();
  console.log(`[prerender] Snapshotting ${routes.length} routes...`);

  const browser = await chromium.launch();
  const page = await browser.newPage();

  const homeMeta = { title: "", jsonLdCount: 0 };
  const issues: string[] = [];
  let ok = 0;

  for (const [i, route] of routes.entries()) {
    const url = `${base}${route.path}`;
    try {
      await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });
      // The SEO useEffect in App.tsx runs on mount/route change; networkidle
      // already implies React has committed, but give it one more tick.
      await page.waitForTimeout(120);
      const html = await page.content();

      const titleMatch = html.match(/<title>([^<]*)<\/title>/);
      const title = titleMatch ? titleMatch[1].trim() : "";
      const jsonLdCount = (html.match(/application\/ld\+json/g) || []).length;

      if (route.path === "/") {
        homeMeta.title = title;
        homeMeta.jsonLdCount = jsonLdCount;
      } else if (!title || title === homeMeta.title) {
        issues.push(`${route.path} — title missing or identical to homepage ("${title}")`);
      } else if (jsonLdCount === 0) {
        issues.push(`${route.path} — no JSON-LD schema block found`);
      }

      const outPath = outputPathFor(route.path);
      fs.mkdirSync(path.dirname(outPath), { recursive: true });
      fs.writeFileSync(outPath, html);
      ok++;
    } catch (e) {
      issues.push(`${route.path} — ${(e as Error).message}`);
    }
    if ((i + 1) % 20 === 0) console.log(`[prerender]   ${i + 1}/${routes.length}...`);
  }

  await browser.close();
  await new Promise<void>((resolve) => server.close(() => resolve()));

  console.log(`[prerender] Done: ${ok}/${routes.length} routes written to dist/.`);
  if (issues.length) {
    console.warn(`[prerender] ${issues.length} route(s) with possible issues:`);
    for (const issue of issues) console.warn(`  - ${issue}`);
    // Non-fatal: don't fail the whole build over one flaky route, but make it loud.
  }
}

main().catch((e) => {
  console.error("[prerender] Fatal error:", e);
  process.exit(1);
});
