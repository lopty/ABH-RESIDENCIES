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

export interface CatalogCard {
  title: string;
  href: string;
  image?: string;
  location: string;
  developer: string;
  badge: string;
  priceLabel: string;
  facts: string[];
}

export interface UnitRow {
  label: string;
  size?: string;
  price?: string;
  baths?: string;
  href?: string;
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
  linkGroups?: { heading: string; links: RelatedPage[] }[];
  cards?: CatalogCard[];
  gallery?: string[];
  unitRows?: UnitRow[];
  schemaType?: string;
  byline?: string; // e.g. "Written by the AD Residences team. Published 20 October 2026."
  published?: string; // ISO date, used for Article structured data
  sources?: { label: string; href: string }[]; // external references, shown as "Sources and further reading"
  heroImg?: string;
  heroImage?: string;
  category?: string;
  ctaHeadline?: string;
  ctaBody?: string;
  ctaLabel?: string;
  cluster?: string;
}
