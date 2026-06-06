# SEO and Site Structure Improvements

## Overview
This PR implements comprehensive SEO improvements and migrates from Vite + React (client-side only) to **Next.js** with Server-Side Rendering (SSR), enabling Google to properly index your site and display sitelinks.

## Key Changes

### 1. **Migration from Vite to Next.js**
- **Why**: Next.js provides SSR by default, ensuring Google sees fully-rendered HTML for each page
- **Benefit**: Crawlers receive actual page content, not just an empty React mounting point
- **Files Changed**:
  - Replaced `vite.config.ts` with `next.config.js`
  - Updated `package.json` with Next.js dependencies
  - Updated `tsconfig.json` for Next.js

### 2. **Dynamic Sitemap Generation**
- **New Files**:
  - `pages/api/sitemap.ts` - Generates dynamic XML sitemap from pages data
  - `lib/pages.ts` - Centralized page management for sitemap
  
- **Benefits**:
  - Automatically updates when you add new properties/pages
  - Resolves conflict between static and API sitemaps
  - Fresh sitemap ensures Google discovers new content immediately

### 3. **Enhanced Schema Markup**
- **New Files**:
  - `lib/schema.ts` - Schema.org structured data generator
  
- **Added Schemas**:
  - ✅ Organization schema (with SearchAction for sitelinks)
  - ✅ SearchAction (enables Google to show site search in sitelinks)
  - ✅ RealEstateAgent schema
  - ✅ Breadcrumb schema (for hierarchy)
  - ✅ Apartment/Property schema
  
- **Impact**: Google uses these to generate rich snippets and sitelinks

### 4. **Improved robots.txt**
- **Location**: `pages/api/robots.ts` (dynamic) and `public/robots.txt` (static backup)
- **Additions**:
  - Explicit allow rules for Google and Bing
  - Disallow rules for sensitive paths
  - Both sitemap URLs (index + main)

### 5. **SSR Page Structure**
- **New File**: `pages/index.tsx`
- **Features**:
  - Server-side rendering for SEO
  - Next.js `getStaticProps` with ISR (Incremental Static Regeneration)
  - Comprehensive meta tags
  - Automatic schema markup inclusion

### 6. **Next.js Configuration**
- **File**: `next.config.js`
- **Features**:
  - Rewrites `/sitemap.xml` to `/api/sitemap` endpoint
  - Custom headers for sitemap caching
  - Image optimization config
  - SWC minification for performance

## Migration Steps

1. **Install Next.js**:
   ```bash
   npm install next@latest react@latest react-dom@latest
   npm install -D @types/node typescript
   ```

2. **Update dependencies**:
   ```bash
   npm install
   ```

3. **Test locally**:
   ```bash
   npm run dev
   # Visit http://localhost:3000
   # Check http://localhost:3000/sitemap.xml
   # Check http://localhost:3000/robots.txt
   ```

4. **Build for production**:
   ```bash
   npm run build
   npm start
   ```

## TODO: Complete Implementation

### High Priority (Before Launch)
- [ ] Convert all existing React pages to Next.js pages/components
- [ ] Update all routes in `lib/pages.ts` to match your actual pages
- [ ] Connect `getAllPages()` to your database/API to fetch dynamic properties
- [ ] Create `/pages/properties/[slug].tsx` for individual property pages
- [ ] Create `/pages/blog/[slug].tsx` for blog posts
- [ ] Update schema markup to use dynamic data from database

### Medium Priority
- [ ] Add Open Graph image generation (`/pages/api/og.ts`)
- [ ] Implement search functionality (`/pages/search.tsx`)
- [ ] Add breadcrumb navigation component
- [ ] Create sitemap index for large property catalogs (`/pages/api/sitemap-index.ts`)
- [ ] Add JSON-LD for LocalBusiness/GoogleBusiness integration

### Low Priority (Nice to Have)
- [ ] Add hreflang tags for multilingual support (if needed)
- [ ] Implement Google Analytics integration
- [ ] Add Yoast SEO monitoring
- [ ] Create SEO-optimized blog infrastructure
- [ ] Add image alt text management system

## Testing Checklist

- [ ] Verify `sitemap.xml` is accessible and properly formatted
- [ ] Verify `robots.txt` is accessible
- [ ] Check sitemap with Google Search Console
- [ ] Verify all pages render with meta tags
- [ ] Test schema markup with Google's Rich Results Test
- [ ] Check page load performance (Core Web Vitals)
- [ ] Verify breadcrumbs appear in search results
- [ ] Test sitelinks display in Google Search after indexing

## Google Search Console Actions

After deployment:
1. Submit sitemap at `https://residenceabudhabi.com/sitemap.xml`
2. Request indexing for key pages
3. Monitor "Enhancements" for rich results
4. Check Coverage report for crawl errors
5. Monitor Performance metrics

## File Structure

```
ABH-RESIDENCIES/
├── pages/
│   ├── index.tsx                 (Home page - SSR)
│   ├── api/
│   │   ├── sitemap.ts           (Dynamic sitemap)
│   │   ├── robots.ts            (Dynamic robots.txt)
│   │   └── og.ts                (TODO: OpenGraph images)
│   ├── properties/
│   │   ├── index.tsx            (TODO: Properties listing)
│   │   └── [slug].tsx           (TODO: Individual property)
│   ├── blog/
│   │   ├── index.tsx            (TODO: Blog listing)
│   │   └── [slug].tsx           (TODO: Blog post)
│   └── ...other pages...
├── lib/
│   ├── schema.ts                (Schema markup generator)
│   └── pages.ts                 (Page management for sitemap)
├── public/
│   ├── robots.txt               (Static fallback)
│   ├── sitemap.xml              (Static fallback)
│   └── ...assets...
├── next.config.js               (Next.js configuration)
├── tsconfig.json                (TypeScript config)
└── package.json                 (Dependencies)
```

## Performance Notes

- **ISR (Incremental Static Regeneration)**: Pages revalidate every 1 hour by default
- **Sitemap Caching**: Cached for 1 hour with 1-day stale-while-revalidate
- **Image Optimization**: Next.js Image component automatically optimizes images
- **Bundle Size**: Next.js Code Splitting reduces initial load time

## References

- [Next.js Documentation](https://nextjs.org/docs)
- [Schema.org Markup Guide](https://schema.org)
- [Google Search Central](https://developers.google.com/search)
- [Core Web Vitals](https://web.dev/vitals/)
