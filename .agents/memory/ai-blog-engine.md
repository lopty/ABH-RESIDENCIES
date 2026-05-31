---
name: AI Blog Engine
description: Daily AI article generation system using Tavily + OpenAI GPT-4o
---

# AI Blog Engine

**Why:** Programmatic SEO — publish one long-form article per day targeting Abu Dhabi real estate keywords.

## How It Runs
- Cron: `0 4 * * *` UTC = 08:00 GST daily
- Trigger manually via `POST /api/generate-article` with optional `{ type: "..." }` body
- Admin panel has AI Generate button with type dropdown

## Article Types (6 types)
- `news_rewrite` — Rewrites today's Abu Dhabi real estate news from Tavily
- `investment_analysis` — Why Abu Dhabi RE offers superior returns
- `project_jumeirah` — Jumeirah Residences Abu Dhabi spotlight
- `project_almaryah` — Al Maryah Island area guide
- `economy_lifestyle` — Why HNW individuals move to Abu Dhabi
- `market_opportunity` — Why now is the right entry point

Day rotation: Sun=news_rewrite, Mon=investment_analysis, Tue=project_jumeirah, Wed=economy_lifestyle, Thu=project_almaryah, Fri=market_opportunity, Sat=news_rewrite

## Content Rules (in prompts)
- Min 1000 words, no em/en dashes, no AI cliches
- Senior property consultant voice
- Internal links to /buy, /contact, /properties/jumeirah-residences, /properties/al-maryah-island
- External links to ADREC, JLL, CBRE, The National
- Returns full HTML (h2, p, strong, a tags) — stored in `content` field as-is

## News Sources (via Tavily)
- Query: "Abu Dhabi real estate property market news 2026"
- Top sources: thenationalnews.com, arabianbusiness.com, adrec.gov.ae, propertyfinder.ae

## Article Storage
- Saved to `blog_posts` table with `ai_generated=true`, `status='published'`
- Image: uses first Tavily result image or Unsplash fallback
- Source credited in `source_url` and `source_name` fields

## Frontend Display
- AI posts shown with purple "AI" badge on blog grid
- BlogPage.tsx fetches from /api/blog, merges with static blogData.ts posts
- Static posts shown if they don't have the same slug in DB
