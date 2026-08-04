// Single source of truth for every crawlable route on the site.
// Used by both scripts/prerender.ts and scripts/generate-seo-files.ts so the
// prerendered HTML, sitemap.xml, and robots.txt can never drift out of sync
// with each other or with the actual seo/blog data.
import { allSeoPages } from "../src/seo/index";
import { blogPosts } from "../src/blogData";

export interface RouteEntry {
  path: string;
  priority: string;
  changefreq: string;
}

export const CORE_ROUTES: RouteEntry[] = [
  { path: "/", priority: "1.0", changefreq: "weekly" },
  { path: "/buy", priority: "0.9", changefreq: "weekly" },
  { path: "/properties/jumeirah-residences", priority: "0.9", changefreq: "weekly" },
  { path: "/properties/al-maryah-island", priority: "0.9", changefreq: "weekly" },
  { path: "/golden-visa-property-abu-dhabi", priority: "0.9", changefreq: "monthly" },
  { path: "/off-plan-properties-abu-dhabi", priority: "0.9", changefreq: "monthly" },
  { path: "/branded-residences-abu-dhabi", priority: "0.8", changefreq: "monthly" },
  { path: "/blog", priority: "0.8", changefreq: "daily" },
  { path: "/about", priority: "0.7", changefreq: "monthly" },
  { path: "/contact", priority: "0.7", changefreq: "monthly" },
  { path: "/faq", priority: "0.7", changefreq: "monthly" },
];

async function getDbBlogRoutes(): Promise<RouteEntry[]> {
  if (!process.env.DATABASE_URL) return [];
  try {
    const { sql } = await import("../db");
    const posts = await sql`SELECT slug FROM blog_posts WHERE status = 'published'`;
    return (posts as { slug: string }[]).map((p) => ({
      path: `/blog/${p.slug}`,
      priority: "0.7",
      changefreq: "monthly",
    }));
  } catch (e) {
    console.warn("[routes] DB unreachable at build time, using static blog posts only:", (e as Error).message);
    return [];
  }
}

export async function getAllRoutes(): Promise<RouteEntry[]> {
  const seoRoutes: RouteEntry[] = allSeoPages.map((p) => ({
    path: `/${p.slug}`,
    priority: "0.8",
    changefreq: "monthly",
  }));
  const staticBlogRoutes: RouteEntry[] = blogPosts.map((p) => ({
    path: `/blog/${p.slug}`,
    priority: "0.7",
    changefreq: "monthly",
  }));
  const dbBlogRoutes = await getDbBlogRoutes();

  const combined = [...CORE_ROUTES, ...seoRoutes, ...staticBlogRoutes, ...dbBlogRoutes];
  const seen = new Set<string>();
  return combined.filter((r) => {
    if (seen.has(r.path)) return false;
    seen.add(r.path);
    return true;
  });
}
