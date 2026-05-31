---
name: AB Residencies Architecture
description: Full-stack setup for residenceabudhabi.com — key files, routing, and data flow
---

# AB Residencies Architecture

**Why:** Custom luxury real estate SPA with SEO requirements and programmatic blog.

## Stack
- React 19 + Vite 6 + TypeScript + Tailwind CSS v4 on port 5000
- Express API server (api-server.ts) on port 3001, proxied via Vite `/api` prefix
- Neon PostgreSQL via `@neondatabase/serverless` (neon HTTP transport, not WebSocket)
- OpenAI GPT-4o for article generation (lazy import to avoid startup crash)
- Tavily API for news search
- node-cron for daily article scheduling

## Key Files
- `api-server.ts` — All backend logic (CRUD, email, AI generation, cron, sitemap)
- `db.ts` — Schema init (properties, blog_posts, leads tables)
- `src/App.tsx` — SPA router using pushState/popstate (NOT react-router)
- `src/components/AdminPanel.tsx` — Password-protected admin (rad2026admin), API-backed
- `src/components/BlogPage.tsx` — Fetches from /api/blog, merges with static blogData.ts

## Routing Pattern
- Uses `currentPath` state + `setBlogSlug` for /blog/:slug routes
- Blog slugs: `currentPath="/blog"`, `blogSlug="the-slug"`
- Admin: `/admin` hides nav and footer via `currentPath !== "/admin"` conditionals

## Database Tables
- `properties` — id (TEXT PK), name, location, price, price_numeric, type, area, badge, image_url, video_url, bedrooms, bathrooms, size_sqft, description, featured
- `blog_posts` — id (SERIAL), slug (UNIQUE), title, category, published_date, read_time, image_url, video_url, summary, content (TEXT, HTML or plain), status, ai_generated, source_url, source_name, author
- `leads` — id, type, data (JSONB)

## Admin Password
- Hardcoded: `rad2026admin` (in AdminPanel.tsx)

## Important: OpenAI initialization
- Must use lazy/dynamic import pattern (`let _openai = null; async function getOpenAI()`) 
- Direct import at module level crashes the tsx server on startup

## Sitemap
- Dynamic via `/api/sitemap` endpoint, proxied from `/sitemap.xml` in Vite config

## Email
- SMTP_USER + SMTP_PASS env vars needed for real email delivery to pranav@residenceabudhabi.com
- Falls back to console.log if not set
