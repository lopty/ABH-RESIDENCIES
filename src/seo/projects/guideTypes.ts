import { SeoFaq, RelatedPage } from "../types";

export type GuideGroup = "reem" | "maryah" | "abu-dhabi" | "lifestyle";

export interface GuideSpec {
  slug: string; // served at /guides/<slug>
  group: GuideGroup;
  keyword: string; // the search term this guide targets
  title: string;
  description: string;
  headline: string;
  subheadline: string;
  intro: string;
  sections: { heading: string; body: string }[];
  faq: SeoFaq[]; // covers information, comparison and buying questions
  inventoryHref: string; // the page that shows what is for sale
  inventoryLabel: string;
  projectSlugs: string[]; // project cards shown at the bottom
  related?: RelatedPage[];
}
