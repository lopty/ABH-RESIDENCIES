export interface SeoStat {
  label: string;
  value: string;
}

export interface SeoSection {
  heading: string;
  body: string;
}

export interface SeoTableRow {
  cells: string[];
}

export interface SeoTable {
  headers: string[];
  rows: SeoTableRow[];
}

export interface SeoFaq {
  question: string;
  answer: string;
}

export interface RelatedPage {
  label: string;
  href: string;
}

export interface RelatedLink {
  label: string;
  slug: string;
}

export interface SeoPageData {
  slug: string;
  title: string;
  description: string;
  keywords: string;
  headline: string;
  subheadline: string;
  eyebrow?: string;
  stats?: SeoStat[];
  intro: string;
  sections: SeoSection[];
  table?: SeoTable;
  faq?: SeoFaq[];
  relatedPages?: RelatedPage[];
  relatedLinks?: RelatedLink[];
  schemaType?: string;
  heroImg?: string;
  heroImage?: string;
  category?: string;
  ctaHeadline?: string;
  ctaBody?: string;
  ctaLabel?: string;
  cluster?: string;
}
