import express from "express";
import nodemailer from "nodemailer";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import cron from "node-cron";
import { initDb, sql } from "./db.js";
import { getAllRoutes } from "./scripts/routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: "10mb" }));

const uploadsDir = path.join(process.cwd(), "public", "uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: uploadsDir,
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`);
  },
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

let _openai: any = null;
async function getOpenAI() {
  if (!_openai) {
    const { default: OpenAI } = await import("openai");
    _openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return _openai;
}

const RECIPIENT_EMAIL = "pranav@residenceabudhabi.com";
const SITE_URL = "https://residenceabudhabi.com";

const mailer = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.hostinger.com",
  port: parseInt(process.env.SMTP_PORT || "465", 10),
  secure: (process.env.SMTP_SECURE || "true") === "true",
  auth: { user: process.env.SMTP_USER || "", pass: process.env.SMTP_PASS || "" },
  tls: { rejectUnauthorized: false },
});

function buildEmailHtml(subject: string, data: Record<string, any>): string {
  const rows = Object.entries(data)
    .filter(([k]) => !["type", "consent"].includes(k))
    .map(([k, v]) =>
      `<tr><td style="padding:8px 14px;font-weight:bold;background:#f8f6f2;border:1px solid #ddd;text-transform:capitalize;white-space:nowrap">${k.replace(/_/g, " ")}</td><td style="padding:8px 14px;border:1px solid #ddd">${v ?? ""}</td></tr>`
    ).join("");
  return `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
    <div style="background:#1C2B4A;padding:24px;text-align:center">
      <h2 style="color:#C9A96E;margin:0;font-size:22px;letter-spacing:2px">AD Residences</h2>
      <p style="color:#fff;margin:8px 0 0;font-size:13px;opacity:0.8">${subject}</p>
    </div>
    <table style="width:100%;border-collapse:collapse;margin:20px 0">${rows}</table>
    <div style="background:#f8f6f2;padding:16px;text-align:center;border-top:2px solid #C9A96E">
      <p style="color:#999;font-size:11px;margin:0">Captured from residenceabudhabi.com</p>
    </div></div>`;
}

app.post("/api/upload-image", upload.single("image"), (req, res) => {
  if (!req.file) { res.status(400).json({ error: "No file" }); return; }
  res.json({ url: `/uploads/${req.file.filename}` });
});

app.get("/api/properties", async (_req, res) => {
  try {
    const rows = await sql`SELECT * FROM properties ORDER BY created_at DESC`;
    res.json(rows);
  } catch (e) { res.status(500).json({ error: String(e) }); }
});

app.post("/api/properties", async (req, res) => {
  const { name, location, price, price_numeric, type, area, badge, image_url, video_url, bedrooms, bathrooms, size_sqft, description, featured } = req.body;
  const id = `prop-${Date.now()}`;
  try {
    const rows = await sql`
      INSERT INTO properties (id, name, location, price, price_numeric, type, area, badge, image_url, video_url, bedrooms, bathrooms, size_sqft, description, featured)
      VALUES (${id}, ${name}, ${location}, ${price}, ${price_numeric || 0}, ${type || "Apartment"}, ${area || "Al Maryah Island"}, ${badge || "Off-Plan"}, ${image_url || ""}, ${video_url || ""}, ${bedrooms || 1}, ${bathrooms || 1}, ${size_sqft || 0}, ${description || ""}, ${featured || false})
      RETURNING *`;
    res.json(rows[0]);
  } catch (e) { res.status(500).json({ error: String(e) }); }
});

app.put("/api/properties/:id", async (req, res) => {
  const { name, location, price, price_numeric, type, area, badge, image_url, video_url, bedrooms, bathrooms, size_sqft, description, featured } = req.body;
  try {
    const rows = await sql`
      UPDATE properties SET name=${name}, location=${location}, price=${price}, price_numeric=${price_numeric || 0}, type=${type}, area=${area}, badge=${badge}, image_url=${image_url || ""}, video_url=${video_url || ""}, bedrooms=${bedrooms || 1}, bathrooms=${bathrooms || 1}, size_sqft=${size_sqft || 0}, description=${description || ""}, featured=${featured || false}
      WHERE id=${req.params.id} RETURNING *`;
    res.json(rows[0]);
  } catch (e) { res.status(500).json({ error: String(e) }); }
});

app.delete("/api/properties/:id", async (req, res) => {
  try {
    await sql`DELETE FROM properties WHERE id=${req.params.id}`;
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: String(e) }); }
});

app.get("/api/blog", async (req, res) => {
  try {
    const showAll = req.query.all === "true";
    const rows = showAll
      ? await sql`SELECT * FROM blog_posts ORDER BY created_at DESC`
      : await sql`SELECT * FROM blog_posts WHERE status='published' ORDER BY created_at DESC`;
    res.json(rows);
  } catch (e) { res.status(500).json({ error: String(e) }); }
});

app.get("/api/blog/:slug", async (req, res) => {
  try {
    const rows = await sql`SELECT * FROM blog_posts WHERE slug=${req.params.slug} AND status='published' LIMIT 1`;
    if (!rows.length) { res.status(404).json({ error: "Not found" }); return; }
    res.json(rows[0]);
  } catch (e) { res.status(500).json({ error: String(e) }); }
});

app.post("/api/blog", async (req, res) => {
  const { title, category, published_date, read_time, image_url, video_url, summary, content, status, source_url, source_name, author } = req.body;
  const slug = title.toLowerCase().replace(/[^a-z0-9\s]/g, "").replace(/\s+/g, "-").slice(0, 90) + "-" + Date.now().toString(36);
  try {
    const rows = await sql`
      INSERT INTO blog_posts (slug, title, category, published_date, read_time, image_url, video_url, summary, content, status, source_url, source_name, author)
      VALUES (${slug}, ${title}, ${category || "Market News"}, ${published_date || new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}, ${read_time || "5 min read"}, ${image_url || ""}, ${video_url || ""}, ${summary || ""}, ${content || ""}, ${status || "published"}, ${source_url || ""}, ${source_name || ""}, ${author || "AD Residences Editorial"})
      RETURNING *`;
    res.json(rows[0]);
  } catch (e) { res.status(500).json({ error: String(e) }); }
});

app.put("/api/blog/:id", async (req, res) => {
  const { title, category, published_date, read_time, image_url, video_url, summary, content, status, source_url, source_name, author } = req.body;
  try {
    const rows = await sql`
      UPDATE blog_posts SET title=${title}, category=${category}, published_date=${published_date}, read_time=${read_time || "5 min read"}, image_url=${image_url || ""}, video_url=${video_url || ""}, summary=${summary || ""}, content=${content || ""}, status=${status || "published"}, source_url=${source_url || ""}, source_name=${source_name || ""}, author=${author || "AD Residences Editorial"}
      WHERE id=${req.params.id} RETURNING *`;
    res.json(rows[0]);
  } catch (e) { res.status(500).json({ error: String(e) }); }
});

app.delete("/api/blog/:id", async (req, res) => {
  try {
    await sql`DELETE FROM blog_posts WHERE id=${req.params.id}`;
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: String(e) }); }
});

app.post("/api/submit-lead", async (req, res) => {
  const data = req.body || {};
  const typeMap: Record<string, string> = {
    general_consultation: "New Consultation Request",
    property_inquiry: "Property Inquiry",
    callback_request: "VIP Callback Request",
    interest_popup: "Interest Form (Popup)",
    contact_form: "Contact Form Submission",
  };
  const subject = typeMap[data.type] || "New Lead Submission";
  try {
    await sql`INSERT INTO leads (type, data) VALUES (${data.type}, ${JSON.stringify(data)})`;
  } catch (_) {}
  try {
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      await mailer.sendMail({
        from: `"AD Residences" <${process.env.SMTP_USER}>`,
        to: RECIPIENT_EMAIL,
        subject: `[Lead] ${subject}`,
        html: buildEmailHtml(subject, data),
      });
    } else {
      console.log(`[LEAD - ${subject}]`, JSON.stringify(data));
    }
    res.json({ success: true });
  } catch (e) { res.json({ success: false, error: "Email failed" }); }
});

const ARTICLE_TYPES = [
  "news_rewrite",
  "investment_analysis",
  "project_jumeirah",
  "economy_lifestyle",
  "project_almaryah",
  "market_opportunity",
  "news_rewrite",
];

const CATEGORIES: Record<string, string> = {
  news_rewrite: "Market News",
  investment_analysis: "Investment Guides",
  project_jumeirah: "Off Plan",
  project_almaryah: "Area Profiles",
  economy_lifestyle: "Area Profiles",
  market_opportunity: "Investment Guides",
};

async function searchTavilyNews(): Promise<{ title: string; url: string; content: string; image?: string }[]> {
  const res = await fetch("https://api.tavily.com/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      api_key: process.env.TAVILY_API_KEY,
      query: "Abu Dhabi real estate property market news 2026",
      search_depth: "advanced",
      max_results: 6,
      include_images: true,
      topic: "news",
    }),
  });
  const data = (await res.json()) as any;
  return data.results || [];
}

function buildArticlePrompt(type: string, newsItems: { title: string; url: string; content: string }[]): string {
  const internalLinks = `
Internal links to naturally weave in where relevant:
- Buy properties: ${SITE_URL}/buy
- Contact us: ${SITE_URL}/contact
- Jumeirah Residences guide: ${SITE_URL}/properties/jumeirah-residences
- Al Maryah Island guide: ${SITE_URL}/properties/al-maryah-island
- Blog: ${SITE_URL}/blog`;

  const rules = `
Writing rules (strictly follow all):
- Minimum 1000 words
- No em dashes or en dashes. Use commas, periods, or colons instead.
- No AI cliches: never start with "In today", "In the ever-evolving", "In conclusion", "It's worth noting", etc.
- Write as a senior property consultant at a boutique Abu Dhabi agency, first person plural ("we", "our advisors")
- Use short paragraphs (2-4 sentences each)
- Include at least 2 internal links using <a href="URL">anchor text</a> format
- Include 2-3 external links to authoritative sources (ADREC, JLL, CBRE, The National, Arabian Business)
- Use <h2> subheadings every 200-300 words
- Return full valid HTML starting with <h2> (no <html>, <body>, or <h1> tags, the title is handled separately)
- The article should clearly promote Abu Dhabi real estate investment while feeling genuinely informative`;

  const prompts: Record<string, string> = {
    news_rewrite: `You are writing a 1000+ word editorial article for AD Residences, a luxury real estate agency in Abu Dhabi.

Rewrite and expand upon this recent news in Abu Dhabi real estate:
Title: ${newsItems[0]?.title || "Abu Dhabi Real Estate Market Continues Strong Growth in 2026"}
Content excerpt: ${newsItems[0]?.content?.slice(0, 800) || "Abu Dhabi property transactions hit record highs."}
Source: ${newsItems[0]?.url || ""}

Transform this into a rich editorial piece. Add context, what it means for investors, what buyers should know, and insights from our team.
${rules}
${internalLinks}`,

    investment_analysis: `You are writing a 1000+ word investment analysis article for AD Residences, a luxury real estate agency in Abu Dhabi.

Write a compelling deep-dive on why Abu Dhabi real estate offers superior returns compared to other global markets. Cover: tax-free income, capital appreciation data (reference ADREC's AED 94 billion transaction volume in 2025), golden visa eligibility, specific projects like Jumeirah Residences on Al Maryah Island, and the 7-8% net rental yield profile.
${rules}
${internalLinks}`,

    project_jumeirah: `You are writing a 1000+ word property spotlight article for AD Residences, a luxury real estate agency in Abu Dhabi.

Write a complete investor and buyer guide to Jumeirah Residences Abu Dhabi on Al Maryah Island. Cover: the Jumeirah brand heritage, what makes this development unique, the 1-3 bedroom layouts and penthouses, payment plan structure (50/50), amenities (infinity pool, concierge, fitness, wellness), the Al Maryah Island address advantage, pricing starting from AED 3,000,000, and rental yield potential. Be specific and detailed.
${rules}
${internalLinks}`,

    project_almaryah: `You are writing a 1000+ word area guide for AD Residences, a luxury real estate agency in Abu Dhabi.

Write a complete guide to living and investing on Al Maryah Island, Abu Dhabi. Cover: its status as Abu Dhabi's financial district (ADGM), The Galleria Mall luxury retail, Cleveland Clinic Abu Dhabi, dining (Zuma, LPM, Roberto's), connectivity, the freehold zones, residential towers, rental yields, price per sqft compared to Dubai's DIFC, and who this area attracts. Reference data from ADREC and JLL.
${rules}
${internalLinks}`,

    economy_lifestyle: `You are writing a 1000+ word lifestyle and economy article for AD Residences, a luxury real estate agency in Abu Dhabi.

Write about why Abu Dhabi is attracting high-net-worth individuals and families from Europe, Asia, and the broader Middle East. Cover: the UAE's political stability, zero income tax, golden visa program, world-class healthcare and education, F1 Grand Prix and culture (Louvre Abu Dhabi), cost of living vs London or Singapore, quality of life, and how this migration is fueling the real estate market. Use recent context: ${newsItems[1]?.content?.slice(0, 400) || ""}
${rules}
${internalLinks}`,

    market_opportunity: `You are writing a 1000+ word market opportunity article for AD Residences, a luxury real estate agency in Abu Dhabi.

Write a compelling piece about why right now (mid-2026) is a strategic entry point for property investment in Abu Dhabi. Cover: pre-handover pricing advantage, off-plan payment flexibility, projected capital appreciation, comparison with mature markets like London or Dubai, specific zones (Al Maryah Island, Saadiyat Island), and what our advisory team recommends. Reference real data: transaction volume up 48% YoY, residential prices up 17.8% in Q1 2026.
${rules}
${internalLinks}`,
  };

  return prompts[type] || prompts.investment_analysis;
}

async function generateArticle(forceType?: string): Promise<{ success: boolean; slug?: string; error?: string }> {
  try {
    const day = new Date().getDay();
    const type = forceType || ARTICLE_TYPES[day];
    const category = CATEGORIES[type] || "Market News";

    console.log(`Generating article type: ${type}`);

    const newsItems = await searchTavilyNews();
    const prompt = buildArticlePrompt(type, newsItems);

    const ai = await getOpenAI();
    const completion = await ai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a senior real estate editorial writer specializing in Abu Dhabi luxury property. You write authoritative, detailed articles that rank well in Google and convert readers into leads. Your writing is clear, confident, and specific, never generic.",
        },
        { role: "user", content: prompt },
      ],
      max_tokens: 3000,
    });

    const content = completion.choices[0].message.content || "";

    const titleMatch = content.match(/<h2[^>]*>([^<]+)<\/h2>/);
    let title = titleMatch ? titleMatch[1] : `Abu Dhabi Real Estate: ${category} Update ${new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}`;

    const summaryCompletion = await ai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: `Write a single sentence meta description (under 160 characters) for this article: "${title}". Abu Dhabi real estate context.` }],
      max_tokens: 60,
    });
    const summary = summaryCompletion.choices[0].message.content?.replace(/^"|"$/g, "") || title;

    const wordCount = content.replace(/<[^>]*>/g, "").split(/\s+/).length;
    const readTime = `${Math.max(5, Math.ceil(wordCount / 200))} min read`;

    const imageUrl = newsItems[0]?.image || "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=1200&auto=format&fit=crop&q=80";
    const sourceUrl = newsItems[0]?.url || "";
    const sourceName = sourceUrl ? new URL(sourceUrl).hostname.replace("www.", "") : "";
    const slug = title.toLowerCase().replace(/[^a-z0-9\s]/g, "").replace(/\s+/g, "-").slice(0, 80) + "-" + Date.now().toString(36);
    const dateStr = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

    await sql`
      INSERT INTO blog_posts (slug, title, category, published_date, read_time, image_url, summary, content, status, ai_generated, source_url, source_name, author)
      VALUES (${slug}, ${title}, ${category}, ${dateStr}, ${readTime}, ${imageUrl}, ${summary}, ${content}, 'published', true, ${sourceUrl}, ${sourceName}, 'AD Residences Editorial')
    `;

    console.log(`Article published: ${title}`);
    return { success: true, slug };
  } catch (e: any) {
    console.error("Article generation failed:", e.message);
    return { success: false, error: e.message };
  }
}

app.post("/api/generate-article", async (req, res) => {
  const type = req.body?.type;
  const result = await generateArticle(type);
  res.json(result);
});

async function buildSitemap(): Promise<string> {
  // Single source of truth shared with the build-time prerender/sitemap
  // generator (scripts/routes.ts) — covers core routes, all seo/index.ts
  // pages, and blog posts (static + DB), so this can't drift out of sync
  // with what actually gets shipped the way the old hardcoded list here did.
  const routes = await getAllRoutes();
  const today = new Date().toISOString().slice(0, 10);
  const urls = routes
    .map((r) => `<url><loc>${SITE_URL}${r.path}</loc><lastmod>${today}</lastmod><changefreq>${r.changefreq}</changefreq><priority>${r.priority}</priority></url>`)
    .join("\n  ");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  ${urls}\n</urlset>`;
}

/* Serve sitemap at both /sitemap.xml (production) and /api/sitemap (dev proxy) */
app.get("/sitemap.xml", async (_req, res) => {
  try {
    res.set("Content-Type", "application/xml");
    res.set("Cache-Control", "public, max-age=3600");
    res.send(await buildSitemap());
  } catch (e) { res.status(500).send("Sitemap error"); }
});

app.get("/api/sitemap", async (_req, res) => {
  try {
    res.set("Content-Type", "application/xml");
    res.send(await buildSitemap());
  } catch (e) { res.status(500).send("Error"); }
});

app.get("/api/health", (_req, res) => res.json({ ok: true, time: new Date().toISOString() }));

cron.schedule("0 4 * * *", async () => {
  console.log("Cron: generating daily article...");
  await generateArticle();
}, { timezone: "UTC" });

// Serve built frontend (always — works in any NODE_ENV)
const distDir = path.join(__dirname, "dist");
if (fs.existsSync(distDir)) {
  app.use(express.static(distDir));
  app.get("*", (_req, res) => {
    res.sendFile(path.join(distDir, "index.html"));
  });
}

const PORT = parseInt(process.env.PORT || "3001", 10);
const HOST = "0.0.0.0";

initDb()
  .then(() => {
    app.listen(PORT, HOST, () => {
      console.log(`API server running on http://${HOST}:${PORT}`);
      console.log("Daily article cron scheduled at 08:00 GST (04:00 UTC)");
    });
  })
  .catch((e) => {
    console.error("DB init failed:", e);
    app.listen(PORT, HOST, () => {
      console.log(`API server running (DB unavailable): http://${HOST}:${PORT}`);
    });
  });
