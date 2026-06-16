import { neon } from "@neondatabase/serverless";

export const sql = neon(process.env.DATABASE_URL!);

export async function initDb() {
  await sql`
    CREATE TABLE IF NOT EXISTS properties (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      location TEXT NOT NULL,
      price TEXT NOT NULL,
      price_numeric NUMERIC DEFAULT 0,
      type TEXT DEFAULT 'Apartment',
      area TEXT DEFAULT 'Al Maryah Island',
      badge TEXT DEFAULT 'Off-Plan',
      image_url TEXT DEFAULT '',
      video_url TEXT DEFAULT '',
      bedrooms INTEGER DEFAULT 1,
      bathrooms NUMERIC DEFAULT 1,
      size_sqft INTEGER DEFAULT 0,
      description TEXT DEFAULT '',
      featured BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS blog_posts (
      id SERIAL PRIMARY KEY,
      slug TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      category TEXT DEFAULT 'Market News',
      published_date TEXT,
      read_time TEXT DEFAULT '5 min read',
      image_url TEXT DEFAULT '',
      video_url TEXT DEFAULT '',
      summary TEXT DEFAULT '',
      content TEXT NOT NULL DEFAULT '',
      status TEXT DEFAULT 'published',
      ai_generated BOOLEAN DEFAULT FALSE,
      source_url TEXT DEFAULT '',
      source_name TEXT DEFAULT '',
      author TEXT DEFAULT 'AB Residences Editorial',
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS leads (
      id SERIAL PRIMARY KEY,
      type TEXT,
      data JSONB,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  console.log("Database tables ready");
}
