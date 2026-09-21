// Content audit: run with `npm run audit`.
// 1. duplicate URLs, 2. internal links that point nowhere, 3. long paragraphs repeated across pages.
import { allSeoPages } from "../src/seo/index";
import { blogPosts } from "../src/blogData";
import { CORE_ROUTES } from "./routes";

const routes = new Set<string>([
  ...CORE_ROUTES.map((r) => r.path),
  ...allSeoPages.map((p) => `/${p.slug}`),
  ...blogPosts.map((p) => `/blog/${p.slug}`),
  "/properties/jumeirah-residences",
  "/properties/al-maryah-island",
]);

let problems = 0;
const fail = (msg: string) => { problems++; console.log("  x " + msg); };

// 1. duplicate slugs
const seen = new Map<string, number>();
for (const p of allSeoPages) seen.set(p.slug, (seen.get(p.slug) ?? 0) + 1);
console.log("Duplicate page URLs");
for (const [slug, n] of seen) if (n > 1) fail(`/${slug} is defined ${n} times`);

// 2. dead internal links
console.log("Dead internal links");
const linkSets: { from: string; hrefs: string[] }[] = [];
for (const p of allSeoPages) {
  const hrefs = [
    ...(p.relatedPages ?? []).map((l) => l.href),
    ...(p.relatedLinks ?? []).map((l) => `/${l.slug}`),
    ...(p.linkGroups ?? []).flatMap((g) => g.links.map((l) => l.href)),
    ...(p.cards ?? []).map((c) => c.href),
    ...(p.unitRows ?? []).map((u) => u.href).filter(Boolean) as string[],
  ];
  linkSets.push({ from: `/${p.slug}`, hrefs });
}
for (const b of blogPosts) linkSets.push({ from: `/blog/${b.slug}`, hrefs: (b.relatedLinks ?? []).map((l) => l.href) });
for (const { from, hrefs } of linkSets) for (const h of hrefs) if (!routes.has(h)) fail(`${from} links to missing ${h}`);

// 3. repeated paragraphs
console.log("Repeated paragraphs (over 140 characters, on 2 or more pages)");
const paras = new Map<string, Set<string>>();
const note = (text: string, page: string) => {
  for (const chunk of text.split(/\n{2,}/)) {
    const t = chunk.trim();
    if (t.length < 140) continue;
    const key = t.toLowerCase().replace(/\s+/g, " ");
    if (!paras.has(key)) paras.set(key, new Set());
    paras.get(key)!.add(page);
  }
};
for (const p of allSeoPages) {
  note(p.intro, `/${p.slug}`);
  for (const s of p.sections) note(s.body, `/${p.slug}`);
}
for (const b of blogPosts) for (const c of b.content) note(c, `/blog/${b.slug}`);
let dupes = 0;
for (const [text, pages] of paras) {
  if (pages.size > 1) { dupes++; if (dupes <= 25) fail(`${[...pages].slice(0, 3).join(", ")}${pages.size > 3 ? ` +${pages.size - 3}` : ""} :: ${text.slice(0, 90)}...`); }
}
if (dupes > 25) console.log(`  (${dupes - 25} more repeated paragraphs not shown)`);

console.log(`\n${allSeoPages.length} SEO pages, ${blogPosts.length} articles, ${problems} problems`);
process.exit(problems ? 1 : 0);
