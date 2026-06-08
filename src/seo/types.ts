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
  schemaType?: string;
  heroImg?: string;
  cluster?: string;
}
