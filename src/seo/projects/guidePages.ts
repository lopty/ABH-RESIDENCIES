import { SeoPageData, RelatedPage } from "../types";
import { projects, areas } from "./projectsData";
import { card, CTA } from "./projectPages";
import { projectPages } from "./projectPages";
import { inventoryPages } from "./inventoryPages";
import { GuideSpec, GuideGroup } from "./guideTypes";
import { guidesReem } from "./guidesReem";
import { guidesMaryah } from "./guidesMaryah";
import { guidesAbuDhabi } from "./guidesAbuDhabi";

export const allGuides: GuideSpec[] = [...guidesReem, ...guidesMaryah, ...guidesAbuDhabi];

const groupInfo: Record<GuideGroup, { label: string; pillar: RelatedPage; more: RelatedPage[] }> = {
  reem: { label: "Al Reem Island", pillar: areas["al-reem-island"].pillar, more: areas["al-reem-island"].articles },
  maryah: { label: "Al Maryah Island", pillar: areas["al-maryah-island"].pillar, more: areas["al-maryah-island"].articles },
  "abu-dhabi": { label: "Abu Dhabi", pillar: { label: "Buy Property in Abu Dhabi: The Complete 2026 Guide", href: "/buy-property-abu-dhabi" }, more: [{ label: "Abu Dhabi Property Projects", href: "/projects" }] },
  lifestyle: { label: "Abu Dhabi Lifestyle", pillar: { label: "Buy Property in Abu Dhabi: The Complete 2026 Guide", href: "/buy-property-abu-dhabi" }, more: [{ label: "Abu Dhabi Property Projects", href: "/projects" }] },
};

const guideHref = (g: GuideSpec) => `/guides/${g.slug}`;

function buildGuide(g: GuideSpec): SeoPageData {
  const info = groupInfo[g.group];
  const siblings = allGuides.filter((x) => x.group === g.group && x.slug !== g.slug);
  const cards = g.projectSlugs.map((s) => projects.find((p) => p.slug === s)).filter(Boolean).map((p) => card(p!));
  return {
    slug: `guides/${g.slug}`,
    cluster: "guides",
    title: g.title,
    description: g.description,
    keywords: `${g.keyword}, ${g.keyword} guide, how to buy ${g.keyword}, ${info.label} property`,
    headline: g.headline,
    subheadline: g.subheadline,
    eyebrow: `Buying Guide · ${info.label}`,
    intro: g.intro,
    sections: g.sections,
    faq: g.faq,
    cards,
    linkGroups: [
      { heading: "See what is for sale", links: [{ label: g.inventoryLabel, href: g.inventoryHref }, { label: "All Abu Dhabi Property Projects", href: "/projects" }] },
      { heading: `More ${info.label} buying guides`, links: [...siblings.slice(0, 8).map((s) => ({ label: s.title.split(" | ")[0], href: guideHref(s) })), { label: "All buying guides", href: "/guides" }] },
    ],
    relatedPages: [info.pillar, ...info.more, ...(g.related ?? [])],
    ...CTA,
  };
}

const guidePagesOnly: SeoPageData[] = allGuides.map(buildGuide);

const hub: SeoPageData = {
  slug: "guides",
  cluster: "guides",
  title: "Abu Dhabi Property Buying Guides | Areas, Projects and Lifestyle",
  description: "Buying guides for Abu Dhabi property: Al Reem Island, Al Maryah Island, ADGM, penthouses, waterfront, payment plans, Golden Visa and more, each linked to what is for sale.",
  keywords: "Abu Dhabi property buying guide, how to buy property Abu Dhabi, Al Reem Island buying guide, Al Maryah Island buying guide",
  headline: "Abu Dhabi Property Buying Guides",
  subheadline: "Plain answers to what buyers ask, each linked to the projects that match.",
  eyebrow: "Buying Guides",
  intro: "Each guide answers the questions buyers ask about one search, such as apartments on Al Reem Island, property near ADGM or Golden Visa property, and links to the projects and inventory pages that match. Start with the area you are considering.",
  sections: [],
  linkGroups: (["reem", "maryah", "abu-dhabi"] as GuideGroup[]).map((grp) => ({
    heading: groupInfo[grp].label,
    links: allGuides.filter((x) => x.group === grp || (grp === "abu-dhabi" && x.group === "lifestyle")).map((x) => ({ label: x.title.split(" | ")[0], href: guideHref(x) })),
  })),
  relatedPages: [{ label: "Buy Property in Abu Dhabi", href: "/buy-property-abu-dhabi" }, { label: "Property Catalogue", href: "/buy" }],
  ...CTA,
};

// Link each inventory page (or project page) back to its guide.
const everything = [...projectPages, ...inventoryPages];
for (const g of allGuides) {
  const target = everything.find((p) => `/${p.slug}` === g.inventoryHref);
  if (!target) continue;
  const entry = { label: g.title.split(" | ")[0], href: guideHref(g) };
  const existing = target.linkGroups?.find((x) => x.heading === "Buying guides");
  if (existing) existing.links.push(entry);
  else target.linkGroups = [{ heading: "Buying guides", links: [entry] }, ...(target.linkGroups ?? [])];
}

export const guidePages: SeoPageData[] = [hub, ...guidePagesOnly];
