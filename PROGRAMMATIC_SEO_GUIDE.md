// File: IMPLEMENTATION_GUIDE.md
// Complete setup instructions for the programmatic SEO system

# Programmatic SEO Implementation Guide

## ✅ What You Have Now

**Database Schema:**
- ✅ 10 tables created with 20 locations, 10 property types, 5 price tiers
- ✅ 40 high-priority keywords seeded
- ✅ 5 content templates defined
- ✅ Indexes created for performance

**Code Files Added:**
- ✅ `src/lib/seo-generator.ts` - Content generation engine
- ✅ `src/api-endpoints-seo.ts` - API endpoints (add to api-server.ts)
- ✅ `pages/guides/[slug].tsx` - Dynamic guide page route
- ✅ `pages/guides/index.tsx` - Guides listing page

---

## 🔧 Integration Steps

### Step 1: Update api-server.ts

**Copy all code from `src/api-endpoints-seo.ts` and paste it into your `api-server.ts` AFTER the existing routes but BEFORE the cron jobs.**

The file should be structured like:
```
api-server.ts
├─ imports
├─ express setup
├─ existing routes (upload, properties, blog)
├─ [NEW] SEO routes (generate-seo-page, batch-generate-seo, etc.)
├─ cron jobs (existing + NEW batch generation)
└─ server listen
```

### Step 2: Import the SEO Generator

At the top of your updated `api-server.ts`, add:
```typescript
import { generateContent, generateBatch, getGenerationStats } from "./src/lib/seo-generator.js";
```

### Step 3: Update Database Connection

The `seo-generator.ts` imports `sql` from `../../db.js`. Make sure the path is correct:
```typescript
import { sql } from "../../db.js";
```

### Step 4: Create pages directory

If you haven't migrated to Next.js yet:
```bash
mkdir -p pages/guides
```

Place these files:
- `pages/guides/[slug].tsx`
- `pages/guides/index.tsx`

---

## 🚀 Usage

### Single Page Generation

**Generate a buying guide for 1BR apartments in Al Maryah Island:**

```bash
curl -X POST http://localhost:3001/api/generate-seo-page \
  -H "Content-Type: application/json" \
  -d '{
    "content_type": "buying_guide",
    "location": "Al Maryah Island",
    "property_type": "1 Bedroom Apartment",
    "price_tier": "mid-range"
  }'
```

**Response:**
```json
{
  "success": true,
  "page": {
    "slug": "buy-1-bedroom-apartment-al-maryah-island",
    "url_path": "/guides/buy-1-bedroom-apartment-al-maryah-island",
    "title": "How to Buy 1 Bedroom Apartment in Al Maryah Island: Complete 2026 Guide",
    "seo_score": 82,
    "word_count": 1284,
    "internal_links_count": 4
  },
  "url": "https://residenceabudhabi.com/guides/buy-1-bedroom-apartment-al-maryah-island"
}
```

### Batch Generation

**Generate 50 high-priority pages:**

```bash
curl -X POST http://localhost:3001/api/batch-generate-seo \
  -H "Content-Type: application/json" \
  -d '{
    "count": 50,
    "priority_filter": 3
  }'
```

The system will queue them and process in background. Check progress:

```bash
curl http://localhost:3001/api/seo-stats
```

**Response:**
```json
{
  "generation_progress": {
    "total_pages": 45,
    "published_pages": 45,
    "avg_seo_score": 76.8,
    "avg_word_count": 1250,
    "seeds_generated": 35
  },
  "next_batch_estimate": "~0 days to 100% (with 25 pages/day)"
}
```

### Get All Available Data

```bash
# List all locations
curl http://localhost:3001/api/locations

# List all property types
curl http://localhost:3001/api/property-types

# List all price tiers
curl http://localhost:3001/api/price-tiers

# List generated pages
curl http://localhost:3001/api/seo-pages?location=Al%20Maryah%20Island&published=true

# Get specific page
curl http://localhost:3001/api/seo-pages/buy-1-bedroom-apartment-al-maryah-island
```

---

## 📅 Automatic Generation Schedule

**Once deployed, these run automatically:**

| Time (UTC) | Time (GST) | Task | Volume |
|------------|------------|------|--------|
| 04:00 | 08:00 | Daily Blog Article | 1 |
| 06:00 | 10:00 | Batch SEO Generation | 50 pages |
| 18:00 | 22:00 | Priority Content | 25 pages |

**Daily Output: 75 new pages/day**  
**Monthly: ~2,250 pages**  
**Yearly: ~27,000 pages** 🚀

---

## 📊 Scaling to 10,000+ Pages

### Phase 1: Current Setup (Weeks 1-2)
- ✅ Database ready
- ✅ Content engine ready
- ✅ 40 seed keywords

**Action:** Generate first 100 pages
```bash
curl -X POST http://localhost:3001/api/batch-generate-seo \
  -d '{"count": 100, "priority_filter": 3}'
```

### Phase 2: Expand Keywords (Weeks 2-3)
Add 200+ more keywords to `seo_content_seeds` table:

```sql
-- Example: Add more location + property type combinations
INSERT INTO seo_content_seeds (id, keyword, intent, content_type, location, property_type, priority) 
VALUES 
('seed-100', 'best 2 bedroom apartments downtown abu dhabi 2026', 'commercial', 'buying_guide', 'Downtown Abu Dhabi', '2 Bedroom Apartment', 4),
('seed-101', 'jumeirah residences luxury villas golden visa', 'commercial', 'investment_guide', 'Jumeirah Residences', 'Villa', 5),
-- ... add 200+ more
```

### Phase 3: Generate at Scale (Weeks 3-8)
- Week 1-2: 200 pages (catch up)
- Week 3-4: 500 pages
- Week 5-6: 1,000 pages
- Week 7-8: 2,000+ pages

### Phase 4: Optimization (Week 8+)
- Monitor rankings
- Adjust templates based on performance
- Focus on high-intent keywords
- Build topical clusters

---

## 🔍 Monitoring & Analytics

### Check Generation Progress
```bash
curl http://localhost:3001/api/seo-stats
```

### View Generated Pages
```bash
curl "http://localhost:3001/api/seo-pages?published=true&limit=50"
```

### View Specific Page
```bash
curl http://localhost:3001/api/seo-pages/buy-1-bedroom-apartment-al-maryah-island
```

### Check Queue Status
```sql
SELECT status, COUNT(*) as count 
FROM content_generation_queue 
GROUP BY status;
```

---

## ⚠️ Important Notes

### Performance
- Each page takes ~30-60 seconds to generate (GPT-4o API call)
- Batch of 50 pages = ~25-50 minutes
- Stagger batches to avoid rate limiting

### SEO Quality
- Only pages with SEO score ≥ 70 are indexed
- Thin content (<800 words) gets `noindex`
- All pages have proper canonical tags and schema markup

### Content Uniqueness
- Each page is uniquely generated based on:
  - Location context
  - Property type details
  - Price tier information
  - Keyword variations
- No duplicate content issues

### Rate Limiting
- OpenAI API: 500 requests/min
- Add delays between batches if needed

---

## 🎯 Expected Results

### SEO Impact (6 months)
- **Indexed Pages:** 2,000-3,000
- **Keywords Ranking:** 2,500-5,000
- **Organic Traffic:** 15,000-25,000/month
- **Domain Authority:** 35-45

### Content Clusters
- **Buying Guides:** 200+ (location × property type combinations)
- **Area Guides:** 50+ (neighborhoods)
- **Investment Guides:** 150+ (strategies + locations)
- **Comparisons:** 100+ (property/location contrasts)
- **FAQ Pages:** 50+ (common questions)

### Keyword Coverage
- **Commercial Intent:** 40% (buying guides, investment)
- **Informational Intent:** 40% (guides, lifestyle)
- **Navigational:** 20% (location/property specific)

---

## 🐛 Troubleshooting

### Generation Fails with API Error
**Problem:** OpenAI rate limit hit  
**Solution:** Reduce batch size, add delays

### Pages Not Showing Up
**Problem:** Check published flag  
**Solution:**
```sql
SELECT COUNT(*) FROM generated_seo_pages WHERE published = true;
```

### Low SEO Scores
**Problem:** Content too short or missing links  
**Solution:** Check template is generating 1200+ words

### Database Connection Error
**Problem:** DATABASE_URL not set  
**Solution:** Verify .env.local has correct Neon URL

---

## 📞 Next Steps

1. ✅ Update api-server.ts with new endpoints
2. ✅ Create pages/guides directory
3. ✅ Test single page generation
4. ✅ Monitor first batch
5. ✅ Deploy to production
6. ✅ Submit sitemap to Google Search Console

---

**You're now set up to generate 10,000+ SEO pages automatically! 🚀**
