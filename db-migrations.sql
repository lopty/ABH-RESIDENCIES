-- ============================================================================
-- DATABASE MIGRATIONS FOR PROGRAMMATIC SEO
-- Run this on your Neon dashboard: https://console.neon.tech/
-- ============================================================================

-- Table 1: Location Guides & Area Data
CREATE TABLE IF NOT EXISTS location_guides (
  id TEXT PRIMARY KEY,
  location TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT DEFAULT '',
  schools_count INTEGER,
  malls_nearby TEXT[] DEFAULT ARRAY[]::TEXT[],
  metro_distance_km NUMERIC,
  metro_access BOOLEAN DEFAULT FALSE,
  avg_rent_per_sqft NUMERIC,
  avg_sale_price_per_sqft NUMERIC,
  investor_score INTEGER DEFAULT 5,
  investment_highlights TEXT,
  lifestyle_highlights TEXT,
  seo_keywords TEXT[] DEFAULT ARRAY[]::TEXT[],
  content_generated BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table 2: Property Type Profiles
CREATE TABLE IF NOT EXISTS property_types (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  avg_price_range TEXT,
  target_buyer TEXT,
  investment_potential TEXT,
  seo_keywords TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table 3: Price Range Tiers
CREATE TABLE IF NOT EXISTS price_tiers (
  id TEXT PRIMARY KEY,
  tier_name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  min_aed NUMERIC NOT NULL,
  max_aed NUMERIC NOT NULL,
  target_segment TEXT,
  buyer_profile TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table 4: SEO Content Seeds (Keywords to target)
CREATE TABLE IF NOT EXISTS seo_content_seeds (
  id TEXT PRIMARY KEY,
  keyword TEXT NOT NULL,
  intent TEXT,
  search_volume NUMERIC DEFAULT 0,
  difficulty NUMERIC DEFAULT 0,
  content_type TEXT,
  location TEXT,
  property_type TEXT,
  price_tier TEXT,
  priority INTEGER DEFAULT 3,
  content_generated BOOLEAN DEFAULT FALSE,
  generated_slug TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table 5: Generated SEO Pages (Track what we generated)
CREATE TABLE IF NOT EXISTS generated_seo_pages (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  url_path TEXT NOT NULL,
  page_type TEXT,
  title TEXT NOT NULL,
  meta_description TEXT,
  h1 TEXT,
  content TEXT,
  keyword_target TEXT,
  location TEXT,
  property_type TEXT,
  price_tier TEXT,
  seo_score NUMERIC DEFAULT 0,
  internal_links_count INTEGER DEFAULT 0,
  word_count INTEGER DEFAULT 0,
  published BOOLEAN DEFAULT FALSE,
  indexed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table 6: Property Comparisons
CREATE TABLE IF NOT EXISTS property_comparisons (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  property_a_id TEXT NOT NULL,
  property_b_id TEXT NOT NULL,
  comparison_title TEXT NOT NULL,
  comparison_content TEXT,
  seo_keywords TEXT[] DEFAULT ARRAY[]::TEXT[],
  published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table 7: Internal Link Suggestions
CREATE TABLE IF NOT EXISTS internal_link_suggestions (
  id TEXT PRIMARY KEY,
  source_slug TEXT NOT NULL,
  target_slug TEXT NOT NULL,
  anchor_text TEXT NOT NULL,
  relevance_score NUMERIC DEFAULT 0,
  link_inserted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table 8: Content Templates (Store reusable templates)
CREATE TABLE IF NOT EXISTS content_templates (
  id TEXT PRIMARY KEY,
  template_name TEXT NOT NULL,
  template_type TEXT,
  title_template TEXT,
  meta_description_template TEXT,
  h1_template TEXT,
  content_structure TEXT,
  word_count_target INTEGER DEFAULT 1000,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table 9: Sub-Locations (Neighborhoods within areas)
CREATE TABLE IF NOT EXISTS sub_locations (
  id TEXT PRIMARY KEY,
  parent_location TEXT NOT NULL,
  sub_location_name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT DEFAULT '',
  avg_price_sqft NUMERIC,
  highlights TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  FOREIGN KEY (parent_location) REFERENCES location_guides(location) ON DELETE CASCADE
);

-- Table 10: Content Generation Queue (Track pending generation)
CREATE TABLE IF NOT EXISTS content_generation_queue (
  id TEXT PRIMARY KEY,
  content_type TEXT NOT NULL,
  location TEXT,
  property_type TEXT,
  price_tier TEXT,
  keyword TEXT,
  status TEXT DEFAULT 'pending',
  priority INTEGER DEFAULT 3,
  attempt_count INTEGER DEFAULT 0,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  processed_at TIMESTAMPTZ
);

-- Create Indexes for Performance
CREATE INDEX idx_location_guides_slug ON location_guides(slug);
CREATE INDEX idx_seo_seeds_location ON seo_content_seeds(location);
CREATE INDEX idx_seo_seeds_generated ON seo_content_seeds(content_generated);
CREATE INDEX idx_generated_pages_slug ON generated_seo_pages(slug);
CREATE INDEX idx_generated_pages_location ON generated_seo_pages(location);
CREATE INDEX idx_generated_pages_published ON generated_seo_pages(published);
CREATE INDEX idx_queue_status ON content_generation_queue(status);
CREATE INDEX idx_queue_priority ON content_generation_queue(priority);

-- ============================================================================
-- SEED DATA: LOCATIONS (20 Primary Abu Dhabi Locations)
-- ============================================================================

INSERT INTO location_guides (id, location, slug, description, metro_access, investor_score, seo_keywords) VALUES

('loc-almaryah', 'Al Maryah Island', 'al-maryah-island', 
 'Abu Dhabi''s financial and lifestyle hub. Home to Jumeirah Residences, The Galleria Mall, and Cleveland Clinic. Premium location for investors and expats.',
 true, 9, ARRAY['Al Maryah Island Abu Dhabi', 'financial district', 'luxury residences', 'best area Abu Dhabi']),

('loc-downtown', 'Downtown Abu Dhabi', 'downtown-abu-dhabi',
 'City center location with government offices, business hubs, and mixed-use developments. High foot traffic and accessibility.',
 true, 8, ARRAY['Downtown Abu Dhabi', 'city center', 'commercial hub', 'central location']),

('loc-jumeirah', 'Jumeirah Residences', 'jumeirah-residences',
 'Ultra-luxury branded residences by Jumeirah Group on Al Maryah Island. World-class amenities and services.',
 true, 10, ARRAY['Jumeirah Residences', 'luxury apartments', 'branded residences', 'premium living']),

('loc-saadiyat', 'Saadiyat Island', 'saadiyat-island',
 'Cultural and beachfront destination with art museums, galleries, and upscale residential areas. Growing expat community.',
 true, 8, ARRAY['Saadiyat Island', 'beachfront living', 'cultural hub', 'Abu Dhabi island']),

('loc-masdar', 'Masdar City', 'masdar-city',
 'Sustainable eco-friendly city development. Ideal for environmentally conscious investors and families.',
 true, 7, ARRAY['Masdar City', 'sustainable living', 'eco-friendly', 'green development']),

('loc-marina', 'Abu Dhabi Marina District', 'abu-dhabi-marina',
 'Waterfront living with modern apartments, marinas, and dining. Popular with young professionals.',
 true, 7, ARRAY['Abu Dhabi Marina', 'waterfront', 'beachfront apartments', 'marina district']),

('loc-yas', 'Yas Island', 'yas-island',
 'Entertainment and leisure destination. Home to Ferrari World, theme parks, golf courses, and resort-style living.',
 false, 6, ARRAY['Yas Island', 'entertainment hub', 'theme parks', 'resort living']),

('loc-reem', 'Reem Island', 'reem-island',
 'Mixed-use development with retail, office, and residential. Growing popularity among young professionals.',
 false, 7, ARRAY['Reem Island', 'mixed-use development', 'modern living', 'Abu Dhabi new development']),

('loc-khalifa', 'Khalifa City', 'khalifa-city',
 'Affordable residential area with good schools and family-friendly amenities. Value-focused investment.',
 false, 6, ARRAY['Khalifa City', 'family friendly', 'affordable living', 'Abu Dhabi residential']),

('loc-baniyas', 'Al Bani Yas Street', 'al-bani-yas-street',
 'Central commercial district with mixed-use spaces. High business activity and commercial potential.',
 true, 7, ARRAY['Al Bani Yas', 'commercial district', 'business hub', 'central Abu Dhabi']),

('loc-bateen', 'Al Bateen', 'al-bateen',
 'Upscale residential area favored by high-net-worth individuals. Exclusive villas and compounds.',
 false, 9, ARRAY['Al Bateen', 'luxury villas', 'exclusive area', 'premium neighborhood']),

('loc-bawabaa', 'Bawabaa', 'bawabaa',
 'Emerging residential community with planned infrastructure and affordable options for families.',
 false, 6, ARRAY['Bawabaa Abu Dhabi', 'family community', 'new development', 'affordable housing']),

('loc-shahama', 'Shahama', 'shahama',
 'Growing suburban area with spacious villas and family-oriented amenities. Good value proposition.',
 false, 5, ARRAY['Shahama Abu Dhabi', 'suburban living', 'villas', 'family homes']),

('loc-mussafah', 'Mussafah', 'mussafah',
 'Industrial and residential mixed area with industrial parks and affordable housing options.',
 false, 5, ARRAY['Mussafah', 'industrial area', 'affordable housing', 'Abu Dhabi outskirts']),

('loc-sweihan', 'Al Sweihan', 'al-sweihan',
 'Developing area with good transport links and mixed-use developments. Emerging investment opportunity.',
 false, 6, ARRAY['Al Sweihan', 'developing area', 'transport hub', 'emerging neighborhood']),

('loc-mina', 'Mina Zayed', 'mina-zayed',
 'Waterfront commercial and residential area near the harbor. Unique urban waterfront lifestyle.',
 true, 7, ARRAY['Mina Zayed', 'waterfront commercial', 'harbor area', 'urban living']),

('loc-garden', 'Garden City', 'garden-city',
 'Master-planned community with parks, schools, and recreational facilities. Family-focused development.',
 false, 7, ARRAY['Garden City Abu Dhabi', 'master planned', 'family community', 'parks and recreation']),

('loc-sports', 'Sports City', 'sports-city',
 'Community centered around sports and recreation with multipurpose facilities and residential options.',
 false, 6, ARRAY['Sports City', 'sports complex', 'recreation', 'active lifestyle']),

('loc-warsan', 'Warsan', 'warsan',
 'Affordable residential area with growing infrastructure. Popular with budget-conscious families.',
 false, 5, ARRAY['Warsan Abu Dhabi', 'affordable living', 'family area', 'residential community']),

('loc-zayed', 'Sheikh Zayed Street', 'sheikh-zayed-street',
 'Major commercial and residential corridor with modern high-rise developments and retail centers.',
 true, 7, ARRAY['Sheikh Zayed Street', 'commercial corridor', 'high-rise', 'modern development'])

ON CONFLICT (location) DO NOTHING;

-- ============================================================================
-- SEED DATA: PROPERTY TYPES
-- ============================================================================

INSERT INTO property_types (id, type, slug, description, avg_price_range, target_buyer, investment_potential) VALUES

('ptype-studio', 'Studio Apartment', 'studio-apartment', 'Compact living space perfect for singles and young professionals', '300K - 500K AED', 'Young professionals, students', 'High rental yield, low entry cost'),

('ptype-1br', '1 Bedroom Apartment', '1-bedroom-apartment', 'Ideal for couples or small families. Most popular category in Abu Dhabi', '400K - 800K AED', 'Couples, small families', 'Strong demand, excellent yield'),

('ptype-2br', '2 Bedroom Apartment', '2-bedroom-apartment', 'Perfect for growing families. Balanced space and affordability', '600K - 1.2M AED', 'Families, investors', 'High appreciation potential'),

('ptype-3br', '3 Bedroom Apartment', '3-bedroom-apartment', 'Spacious family living with dedicated spaces. Premium options available', '1M - 2M AED', 'Large families, executives', 'Strong capital growth'),

('ptype-4br', '4+ Bedroom Apartment', '4-bedroom-apartment', 'Luxury apartments for discerning buyers. Exclusive amenities', '2M - 5M AED', 'High-net-worth, executives', 'Prestige and appreciation'),

('ptype-villa', 'Villa', 'villa', 'Standalone property with outdoor space. Popular with families and investors', '1M - 10M AED', 'Families, investors', 'Land appreciation, high ROI'),

('ptype-townhouse', 'Townhouse', 'townhouse', 'Semi-detached modern living. Blend of privacy and community', '800K - 2M AED', 'Families, young professionals', 'Good appreciation, popular rental'),

('ptype-penthouse', 'Penthouse', 'penthouse', 'Ultra-luxury top-floor apartments with premium views and services', '3M - 15M AED', 'Ultra-high-net-worth', 'Status asset, strong capital growth'),

('ptype-offplan', 'Off-Plan Properties', 'off-plan-properties', 'Pre-launch investment opportunities with flexible payment plans', '300K - 10M AED', 'Investors, first-time buyers', 'Best pricing, high ROI potential'),

('ptype-branded', 'Branded Residences', 'branded-residences', 'Luxury properties under prestigious brands like Jumeirah, EMAAR', '1.5M - 20M AED', 'Luxury seekers, investors', 'Brand equity, premium yields')

ON CONFLICT (type) DO NOTHING;

-- ============================================================================
-- SEED DATA: PRICE TIERS
-- ============================================================================

INSERT INTO price_tiers (id, tier_name, slug, min_aed, max_aed, target_segment, buyer_profile) VALUES

('tier-budget', 'Budget Friendly', 'budget-friendly', 300000, 500000, 'Entry-level investors', 'First-time buyers, young professionals'),

('tier-mid', 'Mid-Range', 'mid-range', 500000, 1000000, 'Growing families', 'Established professionals, small investors'),

('tier-premium', 'Premium', 'premium', 1000000, 2000000, 'Affluent families', 'High-earning professionals, seasoned investors'),

('tier-luxury', 'Luxury', 'luxury', 2000000, 5000000, 'Ultra-high-net-worth', 'Executives, celebrities, luxury seekers'),

('tier-ultra', 'Ultra-Luxury', 'ultra-luxury', 5000000, 20000000, 'Billionaires and elite', 'Royal families, international magnates')

ON CONFLICT (tier_name) DO NOTHING;

-- ============================================================================
-- SEED DATA: SEO CONTENT SEEDS (Keywords to Generate Content For)
-- ============================================================================

INSERT INTO seo_content_seeds (id, keyword, intent, search_volume, difficulty, content_type, location, property_type, price_tier, priority) VALUES

-- High Priority: Location + Property Type Combinations (Buy Guides)
('seed-001', 'buy 1 bedroom apartment al maryah island abu dhabi', 'commercial', 120, 35, 'buying_guide', 'Al Maryah Island', '1 Bedroom Apartment', 'mid-range', 5),
('seed-002', 'luxury apartments al maryah island jumeirah residences', 'commercial', 85, 45, 'buying_guide', 'Al Maryah Island', 'Penthouse', 'luxury', 5),
('seed-003', 'off-plan properties abu dhabi investment 2026', 'commercial', 320, 55, 'investment_guide', NULL, 'Off-Plan Properties', NULL, 5),
('seed-004', 'buy villa abu dhabi under 2 million', 'commercial', 95, 38, 'buying_guide', NULL, 'Villa', 'premium', 5),
('seed-005', 'affordable studio apartments al bateen abu dhabi', 'commercial', 45, 32, 'buying_guide', 'Al Bateen', 'Studio Apartment', 'budget-friendly', 4),

-- High Priority: Golden Visa Content
('seed-006', 'golden visa property abu dhabi buy requirements', 'commercial', 540, 62, 'investment_guide', NULL, NULL, NULL, 5),
('seed-007', 'jumeirah residences golden visa eligible abu dhabi', 'commercial', 165, 48, 'investment_guide', 'Jumeirah Residences', 'Branded Residences', 'luxury', 5),
('seed-008', 'golden visa 500000 aed property abu dhabi', 'commercial', 220, 58, 'investment_guide', NULL, NULL, 'budget-friendly', 5),

-- High Priority: Area Guides
('seed-009', 'al maryah island living guide expats abu dhabi', 'informational', 180, 42, 'area_guide', 'Al Maryah Island', NULL, NULL, 5),
('seed-010', 'jumeirah residences area guide schools mall amenities', 'informational', 140, 40, 'area_guide', 'Jumeirah Residences', NULL, NULL, 5),
('seed-011', 'al bateen neighbourhood guide villas luxury living', 'informational', 75, 38, 'area_guide', 'Al Bateen', NULL, NULL, 4),
('seed-012', 'saadiyat island living family guide expats', 'informational', 110, 45, 'area_guide', 'Saadiyat Island', NULL, NULL, 4),

-- High Priority: Investment Analysis
('seed-013', 'best investment property abu dhabi 2026 returns', 'commercial', 280, 60, 'investment_analysis', NULL, NULL, NULL, 5),
('seed-014', 'rental yield comparison abu dhabi 2 bedroom vs 1 bedroom', 'commercial', 95, 50, 'investment_analysis', NULL, NULL, NULL, 4),
('seed-015', 'off-plan vs resale property abu dhabi investment comparison', 'commercial', 130, 55, 'investment_analysis', NULL, NULL, NULL, 5),

-- Medium Priority: Lifestyle & Comparison
('seed-016', 'jumeirah vs almaryah island which area better abu dhabi', 'commercial', 65, 42, 'comparison_guide', NULL, NULL, NULL, 4),
('seed-017', 'apartment vs villa abu dhabi investment pros cons', 'commercial', 85, 48, 'comparison_guide', NULL, NULL, NULL, 4),
('seed-018', 'expat lifestyle al maryah island family guide', 'informational', 120, 40, 'lifestyle_guide', 'Al Maryah Island', NULL, NULL, 4),

-- Medium Priority: Buying Process Guides
('seed-019', 'how to buy property abu dhabi complete guide first time buyers', 'informational', 250, 45, 'buying_process', NULL, NULL, NULL, 4),
('seed-020', 'financing property abu dhabi mortgage rates 2026', 'commercial', 175, 52, 'financing_guide', NULL, NULL, NULL, 4),
('seed-021', 'property inspection tips abu dhabi before buying', 'informational', 95, 38, 'buying_guide', NULL, NULL, NULL, 3),

-- Medium Priority: Market News & Trends
('seed-022', 'abu dhabi real estate market trends 2026', 'informational', 310, 58, 'market_report', NULL, NULL, NULL, 4),
('seed-023', 'property prices abu dhabi rising 2026 investment opportunity', 'commercial', 190, 55, 'market_report', NULL, NULL, NULL, 4),
('seed-024', 'dubai vs abu dhabi property prices investment comparison', 'commercial', 240, 62, 'comparison_guide', NULL, NULL, NULL, 4),

-- Medium Priority: Specific Projects
('seed-025', 'aldar properties abu dhabi new projects 2026', 'informational', 165, 48, 'project_spotlight', NULL, NULL, NULL, 4),
('seed-026', 'emaar abu dhabi development branded residences', 'informational', 140, 50, 'project_spotlight', NULL, NULL, NULL, 4),

-- Lower Priority: FAQ & Long-tail
('seed-027', 'can expats buy property abu dhabi regulations 2026', 'informational', 230, 40, 'faq_guide', NULL, NULL, NULL, 3),
('seed-028', 'property tax abu dhabi renewing registration cost', 'informational', 85, 35, 'faq_guide', NULL, NULL, NULL, 3),
('seed-029', 'rental income tax uae zero tax property investment', 'informational', 120, 42, 'faq_guide', NULL, NULL, NULL, 3),
('seed-030', 'buy second property abu dhabi as investor rules regulations', 'informational', 75, 45, 'faq_guide', NULL, NULL, NULL, 3),

-- Additional Location Combinations (30+ more seeds)
('seed-031', 'downtown abu dhabi 2 bedroom apartment buy', 'commercial', 110, 42, 'buying_guide', 'Downtown Abu Dhabi', '2 Bedroom Apartment', 'mid-range', 4),
('seed-032', 'saadiyat island villa investment family living', 'commercial', 85, 48, 'buying_guide', 'Saadiyat Island', 'Villa', 'premium', 4),
('seed-033', 'masdar city sustainable living eco-friendly apartments', 'commercial', 70, 50, 'lifestyle_guide', 'Masdar City', 'Apartment', NULL, 3),
('seed-034', 'garden city abu dhabi family community schools parks', 'informational', 95, 42, 'area_guide', 'Garden City', NULL, NULL, 4),
('seed-035', 'khalifa city affordable living family homes abu dhabi', 'commercial', 120, 38, 'buying_guide', 'Khalifa City', 'Villa', 'budget-friendly', 4),
('seed-036', 'abu dhabi marina waterfront apartments luxury living', 'commercial', 105, 45, 'buying_guide', 'Abu Dhabi Marina District', 'Apartment', 'premium', 4),
('seed-037', 'yas island resort living theme parks golf course', 'informational', 140, 50, 'lifestyle_guide', 'Yas Island', NULL, NULL, 3),
('seed-038', 'reem island new development modern living abu dhabi', 'informational', 110, 48, 'area_guide', 'Reem Island', NULL, NULL, 4),
('seed-039', 'sheikh zayed street apartment commercial hub abu dhabi', 'commercial', 130, 45, 'buying_guide', 'Sheikh Zayed Street', 'Apartment', 'mid-range', 4),
('seed-040', 'al bateen villa real estate investment luxury abu dhabi', 'commercial', 95, 52, 'investment_guide', 'Al Bateen', 'Villa', 'luxury', 5)

ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- SEED DATA: CONTENT TEMPLATES
-- ============================================================================

INSERT INTO content_templates (id, template_name, template_type, title_template, meta_description_template, h1_template, content_structure, word_count_target) VALUES

('tpl-buying-guide', 'Buying Guide Template', 'buying_guide', 
 'How to {action} {property_type} in {location}: Complete {year} Guide',
 'Expert guide to {action} {property_type} in {location}. Requirements, process, tips & {price_tier} options.',
 'The Complete Guide to {action} {property_type} in {location}',
 '{"sections": ["Introduction", "Market Overview", "Property Types", "Pricing", "Investment Potential", "Step-by-Step Guide", "Financing Options", "Legal Requirements", "Common Mistakes", "FAQ", "Conclusion"]}',
 1200),

('tpl-area-guide', 'Area Guide Template', 'area_guide',
 '{location} Abu Dhabi: Neighborhood Guide for {target_audience} in 2026',
 'Complete {location} guide: living costs, schools, malls, transport, investor ROI. Is {location} right for you?',
 'Living in {location}: Your Complete 2026 Guide',
 '{"sections": ["Overview", "Location Map", "Neighborhoods", "Schools & Education", "Healthcare", "Retail & Dining", "Transportation", "Rental Market", "Investment Potential", "Lifestyle", "Community Life", "FAQ"]}',
 1400),

('tpl-investment-guide', 'Investment Guide Template', 'investment_guide',
 '{investment_type} Investment Abu Dhabi: {property_type} Property Guide 2026',
 '{investment_type} guide: {property_type} in Abu Dhabi. Yields, ROI, regulations & golden visa eligibility.',
 'The {investment_type} Investment Guide: {property_type} in Abu Dhabi',
 '{"sections": ["Market Overview", "Investment Strategy", "Property Selection", "Financing", "Rental Yields", "Capital Appreciation", "Tax Benefits", "Risk Assessment", "Case Studies", "Action Steps", "FAQ"]}',
 1300),

('tpl-comparison', 'Comparison Guide Template', 'comparison_guide',
 '{option_a} vs {option_b}: Which {category} Better for Abu Dhabi {year}?',
 'Compare {option_a} and {option_b} for Abu Dhabi property investing. Pros, cons, costs & ROI analysis.',
 '{option_a} vs {option_b}: Complete Comparison',
 '{"sections": ["Overview", "Price Comparison", "Location Analysis", "ROI Potential", "Lifestyle", "Investment Strategy", "Pros & Cons", "Recommendation Matrix", "FAQ", "Conclusion"]}',
 1100),

('tpl-faq', 'FAQ Guide Template', 'faq_guide',
 '{topic} Abu Dhabi: Answered FAQs for {target_audience}',
 'Answers to {topic} in Abu Dhabi. Regulations, costs, processes & insider tips for {target_audience}.',
 'Frequently Asked Questions: {topic} in Abu Dhabi',
 '{"sections": ["Common Questions", "Detailed Answers", "Additional Resources", "Contact"]}',
 800)

ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- CONFIRMATION QUERIES (Run these to verify data was inserted)
-- ============================================================================

-- Verify locations inserted
SELECT COUNT(*) as location_count FROM location_guides;

-- Verify property types
SELECT COUNT(*) as property_types_count FROM property_types;

-- Verify price tiers
SELECT COUNT(*) as price_tiers_count FROM price_tiers;

-- Verify SEO seeds
SELECT COUNT(*) as seo_seeds_count FROM seo_content_seeds;

-- Verify templates
SELECT COUNT(*) as templates_count FROM content_templates;

-- Show all locations
SELECT location, slug FROM location_guides ORDER BY location;

-- Show all property types
SELECT type, slug FROM property_types ORDER BY type;

-- Show priority 5 keywords
SELECT keyword, content_type, location, priority FROM seo_content_seeds WHERE priority = 5 ORDER BY keyword;

-- ============================================================================
-- ALL TABLES CREATED AND SEEDED SUCCESSFULLY
-- ============================================================================
