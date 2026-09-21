import { SeoPageData, RelatedPage, SeoFaq, CatalogCard, UnitRow } from "../types";
import { areas, projects, Project, ProjectUnit, UnitType } from "./projectsData";
import { distanceKm } from "./geo";

export const href = (p: Project) => p.existingHref ?? `/projects/${p.slug}`;
export const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const unitSlug = (u: ProjectUnit) => u.label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
const unitHref = (p: Project, u: ProjectUnit) => `/projects/${p.slug}/${unitSlug(u)}`;

function bedsLabel(p: Project): string {
  const b = [...new Set(p.beds)].sort((x, y) => x - y);
  if (b.length === 0) return cap(p.units[0]);
  const fmt = (n: number) => (n === 0 ? "Studio" : `${n}`);
  if (b.length === 1) return b[0] === 0 ? "Studio" : `${b[0]} BR`;
  return `${fmt(b[0])} to ${b[b.length - 1]} BR`;
}

export function card(p: Project): CatalogCard {
  const a = areas[p.area];
  const facts = [p.beds.length ? bedsLabel(p) : "Layouts on request", cap(homeTypesShort(p))];
  return {
    title: p.name,
    href: href(p),
    image: p.images?.[0],
    location: p.community ? `${p.community}, ${a.name}` : a.name,
    developer: p.developer.split(" (")[0],
    badge: p.branded ? `${p.status === "off-plan" ? "Off-Plan" : "Ready"} · Branded` : p.status === "off-plan" ? "Off-Plan" : "Ready",
    priceLabel: p.startingPrice ? `From ${p.startingPrice}` : "Price on request",
    facts,
  };
}
function homeTypesShort(p: Project) {
  return p.units.slice(0, 3).map((u) => plural[u]).join(", ");
}
export const statusLabel = (p: Project) => (p.status === "off-plan" ? "Off-Plan" : "Ready (Secondary)");
const plural: Record<UnitType, string> = {
  studio: "studios",
  apartment: "apartments",
  penthouse: "penthouses",
  villa: "villas",
  townhouse: "townhouses",
};
export const link = (p: Project): RelatedPage => ({ label: `${p.name}, ${areas[p.area].name}`, href: href(p) });
export const homeTypes = (p: Project) => p.units.map((u) => plural[u]).join(", ");
export const where = (p: Project) => (p.community ? `${p.community}, ${areas[p.area].name}` : areas[p.area].name);

export const GOLDEN = "A purchase of AED 2,000,000 or more qualifies the buyer and immediate family for the 10-year UAE Golden Visa. Whether a particular home reaches that level depends on the unit, floor and view, so check the exact price before assuming eligibility.";
export const FREEHOLD = "Buyers of any nationality can own property with full freehold title in Abu Dhabi's designated investment zones, with no local sponsor required.";

export const typeHubLinks: RelatedPage[] = [
  { label: "All Abu Dhabi Property Projects", href: "/projects" },
  { label: "Off-Plan Projects", href: "/projects/off-plan" },
  { label: "Ready and Secondary Projects", href: "/projects/secondary" },
  { label: "Branded Residences", href: "/projects/branded" },
  { label: "Apartments", href: "/projects/apartments" },
  { label: "Penthouses", href: "/projects/penthouses" },
  { label: "Villas and Townhouses", href: "/projects/villas" },
  { label: "Studios", href: "/projects/studios" },
];

export const CTA = {
  ctaHeadline: "Ask About Availability and Current Pricing",
  ctaBody: "Prices, unit availability and payment plans change. AD Residences will confirm what is available today and arrange viewings or a briefing.",
  ctaLabel: "Request Current Availability",
};

// ------------------------------------------------------------------ project pages
function buildProjectPage(p: Project): SeoPageData {
  const a = areas[p.area];
  const siblings = projects.filter((x) => x.area === p.area && x.slug !== p.slug);
  const isOff = p.status === "off-plan";
  const mainType = p.units.includes("villa") ? "Villas" : p.units.includes("apartment") ? "Apartments" : "Homes";

  const faq: SeoFaq[] = [
    { question: `Who is the developer of ${p.name}?`, answer: `${p.name} is developed by ${p.developer}${p.brand ? ` in partnership with ${p.brand}` : ""}.` },
    { question: `Where is ${p.name} located?`, answer: `${p.name} is in ${where(p)}, Abu Dhabi.` },
    {
      question: `Is ${p.name} off-plan or ready?`,
      answer: isOff
        ? `${p.name} is an off-plan project.${p.handover ? ` Handover: ${p.handover}` : " Ask the developer for the current handover date before reserving."}`
        : `${p.name} is a completed building, so homes are sold on the ready (secondary) market and can be viewed, financed and rented like any ready property.`,
    },
    { question: `What home types are available in ${p.name}?`, answer: `${p.bedroomsText}.` },
    { question: `Can foreigners buy in ${p.name}?`, answer: `Yes. ${a.name} is a designated freehold zone. ${FREEHOLD}` },
    { question: `Does ${p.name} qualify for the UAE Golden Visa?`, answer: GOLDEN },
    {
      question: `What is the price of ${p.name}?`,
      answer: p.startingPrice
        ? `${p.priceSource ?? "The developer"} lists homes from ${p.startingPrice}. Prices change by unit, floor and view, so ask AD Residences for current availability.`
        : `Prices depend on the unit, floor and view and change over time. AD Residences can share current availability and pricing for ${p.name}.`,
    },
  ];

  // Measured straight-line distances (from OpenStreetMap coordinates), only where we have them
  const near: string[] = [];
  const dMall = distanceKm("reem-mall", p.slug);
  const dSorb = distanceKm("sorbonne", p.slug);
  const dPark = distanceKm("reem-central-park", p.slug);
  if (dMall !== null) near.push(`${dMall} km from Reem Mall`);
  if (dSorb !== null) near.push(`${dSorb} km from Sorbonne University Abu Dhabi`);
  if (dPark !== null) near.push(`${dPark} km from Reem Central Park`);
  const completedFact = p.facts.find((f) => /complet|deliver|handed/i.test(f));

  const statusBody = isOff
    ? `${p.name} is sold off-plan by ${p.developer}${p.brand ? ` with ${p.brand} as the brand partner` : ""}. ${p.handover ? `Handover: ${p.handover}` : `A handover date was not published in the sources we reviewed, so ask ${p.developer} for the current date.`} ${p.startingPrice ? `${p.priceSource ?? "The developer"} lists homes from ${p.startingPrice}.` : `${p.developer} has not published a price list for ${p.name}, so pricing is confirmed unit by unit.`} Ask for the payment plan, the escrow details and the full SPA before you pay a deposit.`
    : `${p.name} is a completed building${completedFact ? `: ${completedFact.replace(/\.$/, "")}` : ""}, so homes are sold on the resale market by their owners. ${p.startingPrice ? `${p.priceSource ?? "The developer"} lists homes from ${p.startingPrice}. ` : ""}Two identical layouts here can price differently by floor, view and condition, so compare recent sales in ${p.name} itself, and ask for its service charge history and recent maintenance spending before you offer.`;

  const sections = [
    { heading: `About ${p.name}`, body: `${p.overview}\n\n${p.facts.map((f) => `${f}.`).join(" ")}`.trim() },
    { heading: `Homes and layouts in ${p.name}`, body: `${p.bedroomsText}. The home types in ${p.name} are ${homeTypes(p)}. Ask for the floor plan of the specific unit, because layouts and sizes differ by floor.` },
    { heading: "Amenities and lifestyle", body: p.amenities.map((x) => `${x}.`).join(" ") },
    { heading: isOff ? "Status, handover and price" : "Status and price", body: statusBody },
    {
      heading: `Buying ${p.name}: ownership and Golden Visa`,
      body: `${where(p)} is a designated freehold zone, so a buyer of any nationality can own a home in ${p.name} outright. ${p.brand ? `Homes here carry the ${p.brand} name, which usually means a higher service charge than a non-branded building, so ask for the estimate. ` : ""}A home qualifies for the 10-year Golden Visa only if its price reaches AED 2,000,000, so confirm the exact price of the unit you want.`,
    },
    { heading: `Who ${p.name} suits`, body: p.suits },
    {
      heading: `Location`,
      body: `${p.name} is in ${where(p)}. ${near.length ? `By straight-line distance it is ${near.join(", ")}, measured from map coordinates rather than walking routes. ` : ""}${a.blurb}`,
    },
  ];

  return {
    slug: `projects/${p.slug}`,
    cluster: "projects",
    title: `${p.name} | ${statusLabel(p)} ${mainType} for Sale in ${a.short}`.slice(0, 90),
    description: `${p.name} in ${where(p)}, by ${p.developer}. ${p.bedroomsText}. Home types, ownership rules, Golden Visa eligibility and how to buy with AD Residences.`.slice(0, 300),
    keywords: `${p.name}, ${p.name} ${a.name}, ${p.name} for sale, ${p.name} price, ${p.name} ${a.short}, ${a.name} ${homeTypes(p)} for sale${isOff ? `, ${p.name} payment plan` : ""}`,
    headline: p.name,
    subheadline: `${p.bedroomsText} in ${where(p)}, by ${p.developer}.`,
    eyebrow: `${statusLabel(p)} · ${a.name}${p.branded ? " · Branded Residence" : ""}`,
    heroImg: p.images?.[0],
    gallery: p.images && p.images.length > 1 ? p.images.slice(1) : undefined,
    unitRows: p.unitRows?.map((u): UnitRow => ({ label: u.label, size: u.size, price: u.price, baths: u.baths, href: u.price ? unitHref(p, u) : undefined })),
    stats: [
      { label: "Developer", value: p.developer.split(" (")[0] },
      { label: "Status", value: isOff ? "Off-Plan" : "Ready" },
      { label: "Area", value: a.short },
      { label: p.brand ? "Brand" : "Homes", value: p.brand ? p.brand.split(" (")[0] : cap(homeTypes(p).split(",")[0]) },
    ],
    intro: `${p.overview} ${a.blurb}`,
    sections,
    table: {
      headers: ["Detail", "Information"],
      rows: [
        { cells: ["Developer", p.developer] },
        ...(p.brand ? [{ cells: ["Brand partner", p.brand] }] : []),
        { cells: ["Location", where(p)] },
        { cells: ["Status", isOff ? "Off-plan" : "Ready, resale market"] },
        { cells: ["Home types", cap(homeTypes(p))] },
        { cells: ["Bedrooms", p.bedroomsText] },
        { cells: ["Handover", p.handover ?? (isOff ? "Ask the developer" : "Completed")] },
        { cells: ["Starting price", p.startingPrice ? `${p.startingPrice} (${p.priceSource})` : "On request"] },
      ],
    },
    faq,
    linkGroups: [
      { heading: `More projects in ${a.name}`, links: siblings.map(link) },
      { heading: "Browse projects by type", links: typeHubLinks },
    ],
    relatedPages: [
      { label: a.pillar.label, href: a.pillar.href },
      { label: "Buy Property in Abu Dhabi: The Complete 2026 Guide", href: "/buy-property-abu-dhabi" },
      ...a.articles,
    ],
    ...CTA,
  };
}

// ------------------------------------------------------------------ list / keyword pages
export interface ListSpec {
  slug: string;
  title: string;
  description: string;
  keywords: string;
  headline: string;
  subheadline: string;
  eyebrow: string;
  intro: string;
  sections: { heading: string; body: string }[];
  list: Project[];
  faq: SeoFaq[];
  extra?: RelatedPage[];
  groups?: { heading: string; links: RelatedPage[] }[];
}

export function listPage(s: ListSpec): SeoPageData {
  return {
    slug: s.slug,
    cluster: "projects",
    title: s.title,
    description: s.description,
    keywords: s.keywords,
    headline: s.headline,
    subheadline: s.subheadline,
    eyebrow: s.eyebrow,
    intro: s.intro,
    sections: s.sections,
    cards: s.list.map(card),
    faq: s.faq,
    linkGroups: [
      ...(s.groups ?? []),
      { heading: "Browse projects by type", links: typeHubLinks },
    ],
    relatedPages: s.extra ?? [],
    ...CTA,
  };
}

const inArea = (k: Project["area"]) => projects.filter((p) => p.area === k);
const reem = inArea("al-reem-island");
const maryah = inArea("al-maryah-island");
const reemPillar: RelatedPage[] = [
  { label: areas["al-reem-island"].pillar.label, href: areas["al-reem-island"].pillar.href },
  ...areas["al-reem-island"].articles,
  { label: "Buy Property in Abu Dhabi", href: "/buy-property-abu-dhabi" },
];
const maryahPillar: RelatedPage[] = [
  { label: areas["al-maryah-island"].pillar.label, href: areas["al-maryah-island"].pillar.href },
  ...areas["al-maryah-island"].articles,
  { label: "Buy Property in Abu Dhabi", href: "/buy-property-abu-dhabi" },
];

const reemFaq = (q: string, a: string): SeoFaq[] => [
  { question: q, answer: a },
  { question: "Can foreigners buy property on Al Reem Island?", answer: `Yes. Al Reem Island is a designated freehold zone. ${FREEHOLD}` },
  { question: "Does property on Al Reem Island qualify for the Golden Visa?", answer: GOLDEN },
];

const listPages: SeoPageData[] = [
  // ---------- hubs
  listPage({
    slug: "projects",
    title: "Abu Dhabi Property Projects | Off-Plan, Ready and Branded Residences",
    description: "Browse real Abu Dhabi property projects by area, status and type: off-plan launches, ready towers, branded residences, villas, penthouses and studios on Al Reem, Al Maryah, Saadiyat and Yas.",
    keywords: "Abu Dhabi property projects, Abu Dhabi developments, new projects Abu Dhabi, off-plan projects Abu Dhabi, ready apartments Abu Dhabi, branded residences Abu Dhabi",
    headline: "Abu Dhabi Property Projects",
    subheadline: "Real developments across Al Reem, Al Maryah, Saadiyat, Yas and Al Raha, grouped by status and home type.",
    eyebrow: "Project Directory",
    intro: "This directory lists real Abu Dhabi developments, each linked to its own page with the developer, location, home types and buying notes. Projects are grouped by area, by status (off-plan or ready) and by type, so you can go from a search like 'branded residences Saadiyat' or '2 bedroom Al Reem Island' straight to the buildings that match.\n\nAD Residences is a buyer-side advisor. Project facts come from developer websites and official announcements, and pricing is shown only where a developer publishes it. For current availability, ask us.",
    sections: [
      { heading: "How the directory is organised", body: "Off-plan projects are still being built or launched by the developer and are bought through a Sales and Purchase Agreement. Ready projects are completed buildings where homes are sold on the resale market. Branded residences carry a hotel or fashion brand and are managed to that brand's standards." },
    ],
    list: projects,
    faq: [
      { question: "What is the difference between off-plan and ready property in Abu Dhabi?", answer: "Off-plan homes are bought before the building is finished, usually with a staged payment plan, and carry a handover date. Ready homes are completed and can be viewed, financed and rented immediately." },
      { question: "Can foreigners buy the projects listed here?", answer: FREEHOLD },
    ],
    extra: [{ label: "Buy Property in Abu Dhabi: The Complete 2026 Guide", href: "/buy-property-abu-dhabi" }],
    groups: [
      { heading: "Al Reem Island", links: reem.map(link) },
      { heading: "Al Maryah Island", links: maryah.map(link) },
      { heading: "Saadiyat, Yas and Al Raha", links: projects.filter((p) => !["al-reem-island", "al-maryah-island"].includes(p.area)).map(link) },
    ],
  }),
  listPage({
    slug: "projects/off-plan",
    title: "Off-Plan Projects in Abu Dhabi | Launches, Handover and Payment Plans",
    description: "Off-plan projects in Abu Dhabi across Al Maryah Island, Al Reem Island, Saadiyat, Yas and Al Raha, with developer, handover notes and how to buy.",
    keywords: "off plan projects Abu Dhabi, off plan property Abu Dhabi, new launches Abu Dhabi, off plan apartments Abu Dhabi, off plan villas Abu Dhabi",
    headline: "Off-Plan Projects in Abu Dhabi",
    subheadline: "Projects still under construction or in launch phase, with the developer and handover information we could verify.",
    eyebrow: "Off-Plan",
    intro: "Off-plan buyers commit to a home before it is finished, usually with a small deposit and staged payments. The trade-off is a lower entry price against a handover date that can move. This page lists off-plan projects with the developer's stated handover where one is published.",
    sections: [
      { heading: "What to check before reserving off-plan", body: "Ask for the payment plan in writing, the handover date and what happens if it slips, the escrow arrangements, and a complete copy of the Sales and Purchase Agreement. Compare the developer's completed projects, not only the brochure." },
    ],
    list: projects.filter((p) => p.status === "off-plan"),
    faq: [{ question: "Are off-plan payments protected in Abu Dhabi?", answer: "Registered off-plan projects hold buyer payments in escrow accounts. You should still review the SPA, the payment schedule and the developer's track record before paying a deposit." }],
    extra: [{ label: "Off-Plan Investment Guide Abu Dhabi", href: "/off-plan-investment-guide-abu-dhabi" }, { label: "Off-Plan Payment Plans Abu Dhabi", href: "/off-plan-payment-plans-abu-dhabi" }, { label: "Best Off-Plan Projects in Abu Dhabi 2026", href: "/best-off-plan-projects-abu-dhabi-2026" }],
  }),
  listPage({
    slug: "projects/secondary",
    title: "Ready and Secondary Property in Abu Dhabi | Completed Towers and Resale",
    description: "Completed Abu Dhabi towers where homes are sold on the resale market: Al Reem Island, Al Maryah Island and more, with developer and building facts.",
    keywords: "secondary property Abu Dhabi, resale apartments Abu Dhabi, ready to move apartments Abu Dhabi, ready property Abu Dhabi",
    headline: "Ready and Secondary Property in Abu Dhabi",
    subheadline: "Completed buildings where you can view, finance and rent a home immediately.",
    eyebrow: "Ready · Secondary",
    intro: "Ready properties are completed buildings. They cost more per square foot than an off-plan launch in the same area, but you can inspect the home, finance it with a standard mortgage and rent it out within weeks. This page lists completed projects covered in our directory.",
    sections: [
      { heading: "How a resale purchase works", body: "An offer is agreed with the seller, a memorandum of understanding is signed, the developer issues a no-objection certificate, and the transfer is registered. Check the service charge history and the building's maintenance record before offering." },
    ],
    list: projects.filter((p) => p.status === "secondary"),
    faq: [{ question: "Is the resale market thin in Abu Dhabi?", answer: "It is smaller than Dubai's, so the best-known buildings on Al Reem Island have the deepest resale pools, while newer or smaller buildings can have few units for sale at any time." }],
    extra: [{ label: "The Secondary Resale Market in Abu Dhabi 2026", href: "/blog/secondary-resale-market-abu-dhabi-2026" }, { label: "Buy Property in Abu Dhabi", href: "/buy-property-abu-dhabi" }],
  }),
  listPage({
    slug: "projects/branded",
    title: "Branded Residences in Abu Dhabi | Jumeirah, W, Nobu, Four Seasons and More",
    description: "Branded residences in Abu Dhabi by area: Jumeirah and W on Al Maryah Island, Nobu, Mandarin Oriental and Four Seasons on Saadiyat, Waldorf Astoria and Elie Saab on Yas, Hilton at Al Raha.",
    keywords: "branded residences Abu Dhabi, luxury branded residences Abu Dhabi, hotel branded apartments Abu Dhabi, Four Seasons private residences Abu Dhabi, Nobu Residences Abu Dhabi",
    headline: "Branded Residences in Abu Dhabi",
    subheadline: "Homes carrying a hotel or fashion brand, listed with their real locations and developers.",
    eyebrow: "Branded Residences",
    intro: "Branded residences are private homes managed to a hotel or luxury brand's standards. In Abu Dhabi they are spread across islands: Jumeirah and W on Al Maryah Island, Nobu, Mandarin Oriental and Four Seasons on Saadiyat, Waldorf Astoria and Elie Saab on Yas, and Hilton at Al Raha. Note that Waldorf Astoria Residences is on Yas Island, and Four Seasons Private Residences is on Saadiyat Beach.",
    sections: [{ heading: "What a brand adds", body: "The brand sets service and maintenance standards and can support resale demand, and buyers usually pay a premium for it. Service charges are typically higher than in non-branded buildings, so compare total running costs, not only the purchase price." }],
    list: projects.filter((p) => p.branded),
    faq: [{ question: "Which branded residence is on Al Maryah Island?", answer: "Jumeirah Residences Al Maryah Island (Emirates Developments with Jumeirah) and W Residences Al Maryah Island (Taraf with W Hotels) are the two branded projects on the island in this directory." }],
    extra: [{ label: "Best Branded Residences in Abu Dhabi 2026", href: "/best-branded-residences-abu-dhabi-2026" }, { label: "Branded Residences Abu Dhabi", href: "/branded-residences-abu-dhabi" }],
  }),
  listPage({
    slug: "projects/apartments",
    title: "Apartments for Sale in Abu Dhabi | Projects by Area",
    description: "Abu Dhabi apartment projects by area and status, from studios to penthouses, with developer and building details.",
    keywords: "apartments for sale Abu Dhabi, Abu Dhabi apartments, buy apartment Abu Dhabi",
    headline: "Apartments for Sale in Abu Dhabi",
    subheadline: "Apartment projects across Al Reem, Al Maryah, Saadiyat, Yas and Al Raha.",
    eyebrow: "Apartments",
    intro: "Most homes sold to investors in Abu Dhabi are apartments in high-rise towers. This page lists apartment projects across the emirate's freehold islands so you can compare them by area, developer and status.",
    sections: [{ heading: "Choosing between areas", body: "Al Reem Island has the widest range and the most resale activity. Al Maryah Island is smaller and centred on ADGM. Saadiyat and Yas are lifestyle-led and are where most new branded apartments are launching." }],
    list: projects.filter((p) => p.units.includes("apartment")),
    faq: [{ question: "Where are the cheapest apartments in this directory?", answer: "Al Reem Island resale towers and Al Maryah Vista are the entry points in this directory. Branded projects on Saadiyat and Yas sit at the top of the market." }],
    extra: [{ label: "Best Areas to Buy in Abu Dhabi by Budget", href: "/blog/best-areas-buy-property-abu-dhabi-by-budget" }],
  }),
  listPage({
    slug: "projects/penthouses",
    title: "Penthouses for Sale in Abu Dhabi | Projects with Penthouse Homes",
    description: "Abu Dhabi projects that include penthouses, from Al Maryah Island and Al Reem Island to Saadiyat and Yas.",
    keywords: "penthouses for sale Abu Dhabi, Abu Dhabi penthouse, luxury penthouse Abu Dhabi, sky villa Abu Dhabi",
    headline: "Penthouses for Sale in Abu Dhabi",
    subheadline: "Projects whose developers list penthouses or sky villas.",
    eyebrow: "Penthouses",
    intro: "Penthouses are usually released last and in the smallest numbers. This page lists the projects where a developer or an official source mentions penthouses, so you know where to ask first.",
    sections: [{ heading: "What to ask about a penthouse", body: "Ask for the exact floor plan, terrace area, parking allocation and service charge, because penthouses are priced individually and are rarely comparable between buildings." }],
    list: projects.filter((p) => p.units.includes("penthouse")),
    faq: [{ question: "Do penthouses qualify for the Golden Visa?", answer: GOLDEN }],
  }),
  listPage({
    slug: "projects/villas",
    title: "Villas and Townhouses for Sale in Abu Dhabi | Projects",
    description: "Abu Dhabi projects that offer villas or townhouses, including Reem Hills on Al Reem Island, Yas and Saadiyat.",
    keywords: "villas for sale Abu Dhabi, townhouses for sale Abu Dhabi, Reem Hills villas, Abu Dhabi villa communities",
    headline: "Villas and Townhouses in Abu Dhabi",
    subheadline: "Low-rise and gated projects in the directory.",
    eyebrow: "Villas · Townhouses",
    intro: "Abu Dhabi's freehold islands are mostly towers, so villas and townhouses are a small set of communities. This page lists the ones in our directory, from Reem Hills on Al Reem Island to beachfront villas at Saadiyat Beach.",
    sections: [{ heading: "Where villas are available", body: "Reem Hills on Al Reem Island offers villas and townhouses with a stated 50/50 payment plan. On Saadiyat Beach and Yas Island the villa offer is at a much higher price level and is branded." }],
    list: projects.filter((p) => p.units.includes("villa") || p.units.includes("townhouse")),
    faq: [{ question: "Are there villas on Al Maryah Island?", answer: "Not in this directory. Al Maryah Island is a dense financial district of high-rise buildings." }],
  }),
  listPage({
    slug: "projects/studios",
    title: "Studios for Sale in Abu Dhabi | Projects with Studio Homes",
    description: "Abu Dhabi projects that include studios, from Al Maryah Vista to Al Reem Island's Arc Tower and Pixel.",
    keywords: "studio for sale Abu Dhabi, studio apartments Abu Dhabi, buy studio Abu Dhabi, studio Al Reem Island",
    headline: "Studios for Sale in Abu Dhabi",
    subheadline: "The lowest-ticket way into Abu Dhabi's freehold islands.",
    eyebrow: "Studios",
    intro: "Studios are the entry point for first-time investors. This page lists projects where studios are stated, on Al Reem Island and on Al Maryah Island.",
    sections: [{ heading: "What to weigh up", body: "A studio is cheaper to buy but often carries a higher service charge per square foot. Compare net yield after service charges, and check the building's resale pool before you buy." }],
    list: projects.filter((p) => p.units.includes("studio")),
    faq: [{ question: "Do studios qualify for the Golden Visa?", answer: "Studios are usually well below AED 2,000,000, so they normally do not qualify on their own." }],
  }),

  // ---------- Al Reem Island keyword pages
  listPage({
    slug: "apartments-for-sale-al-reem-island",
    title: "Apartments for Sale in Al Reem Island Abu Dhabi | Towers and Projects",
    description: "Apartments for sale on Al Reem Island: Shams Abu Dhabi, Marina Square, Makers District and Najmat towers, with developers, unit types and how to buy.",
    keywords: "apartments for sale Al Reem Island Abu Dhabi, Al Reem Island apartments, buy apartment Reem Island, Reem Island flats for sale",
    headline: "Apartments for Sale on Al Reem Island",
    subheadline: "The towers and communities where Al Reem Island apartments are sold.",
    eyebrow: "Al Reem Island · Apartments",
    intro: "Al Reem Island has the largest stock of apartments in Abu Dhabi, spread over several communities. This page lists the towers in our directory, so you can compare age, developer and layout before you shortlist viewings.",
    sections: [
      { heading: "How the island's communities differ", body: "Shams Abu Dhabi has the oldest and most liquid towers, including The Gate Towers and Sun and Sky Towers. Marina Square has a cluster of waterfront towers. Makers District and Najmat are newer. In general, newer buildings command higher prices per square foot and older ones offer more resale choice." },
      { heading: "Price bands", body: "Our Al Reem Island guide puts one bedroom apartments at roughly AED 700,000 to AED 1.8 million, two bedrooms at AED 1.2 million to AED 3 million, and three bedrooms at AED 1.8 million to AED 5 million, depending on tower, floor and fit-out." },
    ],
    list: reem.filter((p) => p.units.includes("apartment") || p.units.includes("studio")),
    faq: reemFaq("Which Al Reem Island community is best for apartments?", "It depends on your priority. Shams Abu Dhabi offers the deepest resale market, Marina Square offers waterfront towers at lower prices, and Makers District and Najmat offer newer buildings."),
    extra: reemPillar,
    groups: [{ heading: "By unit size on Al Reem Island", links: [
      { label: "Studios on Al Reem Island", href: "/studio-for-sale-al-reem-island" },
      { label: "1 Bedroom Apartments", href: "/1-bedroom-apartment-for-sale-al-reem-island" },
      { label: "2 Bedroom Apartments", href: "/2-bedroom-apartment-for-sale-al-reem-island" },
      { label: "3 Bedroom Apartments", href: "/3-bedroom-apartment-for-sale-al-reem-island" },
      { label: "Villas and Townhouses", href: "/villas-for-sale-al-reem-island" },
      { label: "Off-Plan on Al Reem Island", href: "/off-plan-property-al-reem-island" },
    ] }],
  }),
  listPage({
    slug: "studio-for-sale-al-reem-island",
    title: "Studio for Sale in Al Reem Island Abu Dhabi | Buildings with Studios",
    description: "Studios for sale on Al Reem Island: buildings that offer studio homes, what to check on service charges, and how to buy as a first-time investor.",
    keywords: "studio for sale Abu Dhabi Al Reem, studio apartment Al Reem Island, studio for sale Reem Island, cheap apartment Reem Island",
    headline: "Studios for Sale on Al Reem Island",
    subheadline: "Where studio homes are available on the island.",
    eyebrow: "Al Reem Island · Studios",
    intro: "A studio on Al Reem Island is the cheapest way to own freehold property in Abu Dhabi's largest residential market. The buildings below are where a source states that studios exist.",
    sections: [
      { heading: "What to check before buying a studio", body: "Compare the annual service charge per square foot, the size of the unit after common areas, the floor and view, and how many similar units are for sale in the same building. A studio in a building with many identical listings will be harder to price at a premium." },
      { heading: "Golden Visa", body: "Studios on Al Reem Island are normally well below AED 2,000,000, so they do not qualify for the Golden Visa on their own. " + GOLDEN },
    ],
    list: reem.filter((p) => p.units.includes("studio")),
    faq: reemFaq("Where can I buy a studio on Al Reem Island?", "Studios are stated in Arc Tower, Najmat Abu Dhabi's towers and The Gate Towers in our directory, and in Pixel in Makers District."),
    extra: reemPillar,
  }),
  listPage({
    slug: "1-bedroom-apartment-for-sale-al-reem-island",
    title: "1 Bedroom Apartment for Sale in Al Reem Island | Buildings and Buying Guide",
    description: "One bedroom apartments for sale on Al Reem Island: buildings with 1 bedroom homes, typical prices, service charge checks and buying process.",
    keywords: "1 bedroom apartment for sale Al Reem Island, 1BHK for sale Reem Island, one bedroom apartment Reem Island Abu Dhabi",
    headline: "1 Bedroom Apartments for Sale on Al Reem Island",
    subheadline: "Buildings where one bedroom homes are available.",
    eyebrow: "Al Reem Island · 1 Bedroom",
    intro: "The one bedroom is the most searched unit on Al Reem Island. It suits single professionals and buy-to-let investors, and it is the layout with the most resale listings in most buildings.",
    sections: [
      { heading: "Price and yield context", body: "Our Al Reem Island guide places one bedroom apartments at roughly AED 700,000 to AED 1.8 million depending on tower, floor and fit-out. Reem Hills lists a one bedroom apartment from AED 1.5 million on Modon's website." },
      { heading: "What to compare", body: "Compare size in square feet, floor and view, the annual service charge, and how many similar units are listed in the same building. In older buildings, ask about recent fit-out and maintenance work." },
    ],
    list: reem.filter((p) => p.beds.includes(1)),
    faq: reemFaq("How much is a 1 bedroom apartment on Al Reem Island?", "Our guide puts one bedroom apartments at roughly AED 700,000 to AED 1.8 million depending on tower, floor and fit-out. Reem Hills lists one bedroom apartments from AED 1.5 million on Modon's website."),
    extra: reemPillar,
  }),
  listPage({
    slug: "2-bedroom-apartment-for-sale-al-reem-island",
    title: "2 Bedroom Apartment for Sale in Al Reem Island | 2 BHK Buildings and Guide",
    description: "Two bedroom (2 BHK) apartments for sale on Al Reem Island: which buildings offer them, typical prices and what to check before you buy.",
    keywords: "2 bedroom apartment for sale Al Reem Island, 2 BHK for sale Reem Island, two bedroom apartment Reem Island Abu Dhabi",
    headline: "2 Bedroom Apartments for Sale on Al Reem Island",
    subheadline: "Two bedroom homes across the island's towers.",
    eyebrow: "Al Reem Island · 2 Bedroom",
    intro: "Two bedroom apartments are the workhorse of Al Reem Island. They serve couples, small families and sharers, and they are widely available across Shams Abu Dhabi and Marina Square.",
    sections: [
      { heading: "Price and size", body: "Our Al Reem Island guide places two bedroom apartments at roughly AED 1.2 million to AED 3 million. Park View Tower lists two bedroom homes of about 1,218 to 2,199 sq ft, which is large for the island, while smaller buildings offer more compact layouts." },
      { heading: "Golden Visa", body: "A two bedroom apartment on Al Reem Island can approach the AED 2,000,000 threshold at the top of its price range, but most sit below it. " + GOLDEN },
    ],
    list: reem.filter((p) => p.beds.includes(2)),
    faq: reemFaq("How much is a 2 BHK on Al Reem Island?", "Our guide puts two bedroom apartments at roughly AED 1.2 million to AED 3 million, depending on the tower, floor and fit-out."),
    extra: reemPillar,
  }),
  listPage({
    slug: "3-bedroom-apartment-for-sale-al-reem-island",
    title: "3 Bedroom Apartment for Sale in Al Reem Island | Family Homes and Duplexes",
    description: "Three bedroom apartments for sale on Al Reem Island: buildings with 3 bedroom homes and duplexes, typical prices and buying notes for families.",
    keywords: "3 bedroom apartment Al Reem Island, 3 bedroom apartment for sale Abu Dhabi Reem Island, three bedroom duplex Reem Island",
    headline: "3 Bedroom Apartments for Sale on Al Reem Island",
    subheadline: "Family-sized homes in the island's towers.",
    eyebrow: "Al Reem Island · 3 Bedroom",
    intro: "Three bedroom apartments on Al Reem Island are a family product. They are fewer than one and two bedrooms, and the best layouts are concentrated in a small number of buildings.",
    sections: [
      { heading: "Price and where to look", body: "Our Al Reem Island guide puts three bedroom apartments at roughly AED 1.8 million to AED 5 million. Park View Tower is a good example of a large-format building, with three bedroom homes of about 3,258 to 3,856 sq ft and three bedroom duplexes." },
      { heading: "Golden Visa", body: "Three bedroom homes are the layout most likely to reach AED 2,000,000 on Al Reem Island. " + GOLDEN },
    ],
    list: reem.filter((p) => p.beds.includes(3)),
    faq: reemFaq("Which Al Reem Island buildings have 3 bedroom apartments?", "Park View Tower, Mangrove Place, Tala Tower and The Gate Towers all list three bedroom homes in our directory."),
    extra: reemPillar,
  }),
  listPage({
    slug: "villas-for-sale-al-reem-island",
    title: "Villas and Townhouses for Sale on Al Reem Island | Reem Hills",
    description: "Villas and townhouses on Al Reem Island: Reem Hills by Modon and Mangrove Place's townhouses, with handover, payment plan and Golden Visa notes.",
    keywords: "Reem Hills villas for sale, villas for sale Al Reem Island, townhouses Al Reem Island, villa Reem Island Abu Dhabi",
    headline: "Villas and Townhouses on Al Reem Island",
    subheadline: "The island's low-rise homes.",
    eyebrow: "Al Reem Island · Villas",
    intro: "Al Reem Island is a tower island, so villas are a small niche. Reem Hills is the main villa and townhouse community, and Mangrove Place adds three bedroom townhouse-style homes in a tower setting.",
    sections: [
      { heading: "Reem Hills", body: "Modon states villas at Reem Hills for Q2 2026 handover and apartments for Q2 2027, a 50/50 payment plan, and a starting price of AED 1.5 million for a one bedroom apartment. Confirm current status with Modon, because these dates may already have moved." },
    ],
    list: reem.filter((p) => p.units.includes("villa") || p.units.includes("townhouse")),
    faq: reemFaq("Who develops Reem Hills?", "Reem Hills is developed by Modon."),
    extra: reemPillar,
  }),
  listPage({
    slug: "off-plan-property-al-reem-island",
    title: "Off-Plan Property on Al Reem Island | Reem Hills and New Launches",
    description: "Off-plan property on Al Reem Island: Reem Hills by Modon, how off-plan works on the island and how it compares with buying a ready tower.",
    keywords: "off-plan property Al Reem Island, off plan Reem Island, new launches Al Reem Island, Reem Hills off plan",
    headline: "Off-Plan Property on Al Reem Island",
    subheadline: "What is still being built on the island, and how to buy it.",
    eyebrow: "Al Reem Island · Off-Plan",
    intro: "Most of Al Reem Island is built, so off-plan supply is limited to a few communities. Reem Hills is the clearest example in our directory, and newer districts such as Makers District have delivered their first towers.",
    sections: [
      { heading: "Off-plan versus ready on the island", body: "A ready tower in Shams Abu Dhabi gives you a home to view and rent now. An off-plan home gives a lower entry and a later handover. Our guide on off-plan versus ready on Al Reem Island walks through both." },
    ],
    list: reem.filter((p) => p.status === "off-plan"),
    faq: reemFaq("Is there off-plan property on Al Reem Island?", "Yes. Reem Hills by Modon is off-plan in our directory. Other communities on the island are mostly completed."),
    extra: [{ label: "Off-Plan vs Ready on Al Reem Island", href: "/blog/off-plan-vs-ready-al-reem-island" }, ...reemPillar],
  }),
  listPage({
    slug: "shams-abu-dhabi-properties-for-sale",
    title: "Shams Abu Dhabi Properties for Sale | Gate Towers, Sun, Sky, Arc and More",
    description: "Properties for sale in Shams Abu Dhabi on Al Reem Island: The Gate Towers, Sun and Sky Towers, Arc Tower, Park View Tower and Mangrove Place.",
    keywords: "Shams Abu Dhabi properties for sale, Shams Abu Dhabi apartments, The Gate Towers apartment for sale, Arc Tower Al Reem Island, Park View Tower Reem Island",
    headline: "Shams Abu Dhabi Properties for Sale",
    subheadline: "The established Al Reem Island community around Al Reem Central Park.",
    eyebrow: "Al Reem Island · Shams Abu Dhabi",
    intro: "Shams Abu Dhabi is the master community developed by Sorouh, now part of Aldar. It holds many of Al Reem Island's best-known towers and has the deepest resale market on the island.",
    sections: [{ heading: "Buying in Shams", body: "Compare buildings on age, service charge, layout efficiency and resale depth. The towers were delivered between roughly 2010 and 2020, so condition varies more than you might expect from the address." }],
    list: reem.filter((p) => p.community === "Shams Abu Dhabi"),
    faq: reemFaq("Which towers are in Shams Abu Dhabi?", "The Gate Towers, Sun and Sky Towers, Arc Tower, Park View Tower and Mangrove Place are in Shams Abu Dhabi in our directory."),
    extra: reemPillar,
  }),
  listPage({
    slug: "marina-square-abu-dhabi-apartments",
    title: "Marina Square Abu Dhabi Apartments for Sale | Al Reem Island",
    description: "Marina Square apartments on Al Reem Island: Burooj Views, Tala Tower and the wider cluster of waterfront towers, with developers and buying notes.",
    keywords: "Marina Square Abu Dhabi apartments, Marina Square Al Reem Island, Burooj Views Al Reem, Tala Tower Al Reem Island",
    headline: "Marina Square Apartments for Sale",
    subheadline: "The waterfront tower cluster on Al Reem Island.",
    eyebrow: "Al Reem Island · Marina Square",
    intro: "Marina Square was developed by Tamouh and is reported to include 14 towers and about 3,440 residential units. Towers include RAK Tower, Al Durrah, Ocean Terrace, Tala Tower, Maha, Burooj Views, Marina Blue and Marina Heights.",
    sections: [{ heading: "Buying in Marina Square", body: "Marina Square towers were mostly delivered in the early 2010s. Focus on condition, service charges and how many comparable units are on the market." }],
    list: reem.filter((p) => p.community === "Marina Square"),
    faq: reemFaq("How many towers are in Marina Square?", "Market records describe Marina Square as a development of about 14 towers, developed by Tamouh."),
    extra: reemPillar,
  }),
  listPage({
    slug: "najmat-abu-dhabi-apartments",
    title: "Najmat Abu Dhabi Apartments for Sale | Al Reem Island Towers",
    description: "Najmat Abu Dhabi apartments on Al Reem Island: towers by Reem Developers and Mismak Properties, completed around 2020.",
    keywords: "Najmat Abu Dhabi apartments, Najmat Al Reem Island, Najmat Tower for sale, Najmat Abu Dhabi",
    headline: "Najmat Abu Dhabi Apartments for Sale",
    subheadline: "One of Al Reem Island's newer residential communities.",
    eyebrow: "Al Reem Island · Najmat",
    intro: "Najmat Abu Dhabi is a newer community on Al Reem Island. Its towers, such as the 40-storey Najmat Tower C10 by Reem Developers and the two-tower Najmat Residential Tower by Mismak Properties, were completed around 2020.",
    sections: [{ heading: "Why Najmat", body: "Buyers choose Najmat for a newer building than most of Shams Abu Dhabi offers. Compare price per square foot, service charge and distance to the retail and schools you use." }],
    list: reem.filter((p) => p.community === "Najmat Abu Dhabi"),
    faq: reemFaq("Who develops Najmat Abu Dhabi?", "Najmat Tower C10 is by Reem Developers and Najmat Residential Tower is by Mismak Properties, according to market records."),
    extra: reemPillar,
  }),

  // ---------- Al Maryah Island keyword pages
  listPage({
    slug: "property-for-sale-al-maryah-island",
    title: "Property for Sale on Al Maryah Island Abu Dhabi | Projects and Developers",
    description: "Property for sale on Al Maryah Island: Jumeirah Residences, W Residences, Al Maryah Vista and Vista 2, with developers, status and buying notes.",
    keywords: "property for sale Al Maryah Island, Al Maryah Island apartments for sale, buy property Al Maryah Island, Maryah Vista for sale",
    headline: "Property for Sale on Al Maryah Island",
    subheadline: "Every project in our directory on Abu Dhabi's financial island.",
    eyebrow: "Al Maryah Island",
    intro: "Al Maryah Island is small, so the number of residential projects is limited. This page lists each one in our directory with its developer, status and home types, from branded launches to more accessible towers.",
    sections: [
      { heading: "Branded and non-branded", body: "Jumeirah Residences and W Residences are the branded projects. Al Maryah Vista and Vista 2, by Reportage Properties, are non-branded and start from smaller homes." },
      { heading: "Ownership", body: `Al Maryah Island is a designated freehold zone. ${FREEHOLD} ${GOLDEN}` },
    ],
    list: maryah,
    faq: [
      { question: "Can foreigners buy on Al Maryah Island?", answer: `Yes. ${FREEHOLD}` },
      { question: "Which developers sell on Al Maryah Island?", answer: "Emirates Developments (Jumeirah Residences), Taraf (W Residences) and Reportage Properties (Al Maryah Vista and Vista 2) in our directory." },
    ],
    extra: maryahPillar,
    groups: [{ heading: "More Al Maryah Island guides", links: [
      { label: "Luxury Apartments on Al Maryah Island", href: "/luxury-apartments-al-maryah-island" },
      { label: "Luxury Branded Residences on Al Maryah Island", href: "/luxury-branded-residences-al-maryah-island" },
      { label: "Apartments Near ADGM", href: "/apartments-near-adgm-abu-dhabi" },
    ] }],
  }),
  listPage({
    slug: "luxury-apartments-al-maryah-island",
    title: "Luxury Apartments on Al Maryah Island | Branded and Non-Branded",
    description: "Luxury apartments on Al Maryah Island: how branded projects compare with non-branded towers, and what each is aimed at.",
    keywords: "luxury apartments Al Maryah Island, luxury property Al Maryah Island, high end apartments Abu Dhabi, premium apartments Al Maryah",
    headline: "Luxury Apartments on Al Maryah Island",
    subheadline: "From branded launches to well-located non-branded towers.",
    eyebrow: "Al Maryah Island · Luxury",
    intro: "Luxury on Al Maryah Island comes in two forms: branded residences with hotel-managed services, and non-branded towers whose value is the location. Both share the island's ADGM setting, Galleria retail and Cleveland Clinic access.",
    sections: [{ heading: "Which is right for you", body: "Choose branded if you want service and a brand to support resale. Choose non-branded if you want the island address at a lower entry price and lower running costs." }],
    list: maryah,
    faq: [{ question: "What makes an apartment on Al Maryah Island luxury?", answer: "The address, the ADGM setting, the Galleria and Cleveland Clinic nearby, and in branded projects the hospitality services." }],
    extra: maryahPillar,
  }),
  listPage({
    slug: "luxury-branded-residences-al-maryah-island",
    title: "Luxury Branded Residences on Al Maryah Island | Jumeirah and W",
    description: "Branded residences on Al Maryah Island: Jumeirah Residences by Emirates Developments and W Residences by Taraf, with how they differ.",
    keywords: "luxury branded residences Al Maryah Island, Jumeirah Residences Al Maryah Island, W Residences Al Maryah Island, branded apartments Abu Dhabi",
    headline: "Luxury Branded Residences on Al Maryah Island",
    subheadline: "Two brands, two developers, one island.",
    eyebrow: "Al Maryah Island · Branded",
    intro: "Al Maryah Island has two branded residence projects in our directory. Jumeirah Residences is by Emirates Developments with the Jumeirah brand. W Residences is by Taraf with Marriott's W Hotels. They target different tastes: Jumeirah is classic luxury hospitality, W is design-led.",
    sections: [{ heading: "Comparing them", body: "Compare handover dates, payment plans, unit mix and service charge. Both are off-plan, so confirm current status with each developer." }],
    list: maryah.filter((p) => p.branded),
    faq: [{ question: "Is Four Seasons Private Residences on Al Maryah Island?", answer: "No. Four Seasons Private Residences Abu Dhabi is at Saadiyat Beach on Saadiyat Island. The Four Seasons Hotel is on Al Maryah Island." }],
    extra: maryahPillar,
  }),
  listPage({
    slug: "apartments-near-adgm-abu-dhabi",
    title: "Apartments Near ADGM Abu Dhabi | Al Maryah Island Homes",
    description: "Apartments near ADGM, Abu Dhabi's financial free zone: the Al Maryah Island projects within walking distance of the district.",
    keywords: "apartments near ADGM Abu Dhabi, ADGM apartments, homes near ADGM, corporate housing Al Maryah Island, live near ADGM",
    headline: "Apartments Near ADGM",
    subheadline: "Homes on the island where ADGM sits.",
    eyebrow: "Al Maryah Island · ADGM",
    intro: "ADGM, Abu Dhabi Global Market, is on Al Maryah Island. The most direct way to live near it is to buy or rent on the island itself, which is why the projects below are all on Al Maryah Island.",
    sections: [{ heading: "Buying for corporate tenants", body: "Investors often buy near ADGM to rent to professionals working in the district. Compare yields and service charges, and see our ADGM guide for how the jurisdiction works." }],
    list: maryah,
    faq: [{ question: "What is ADGM?", answer: "Abu Dhabi Global Market is Abu Dhabi's financial free zone on Al Maryah Island, operating under English common law." }],
    extra: [{ label: "Buy Property in ADGM", href: "/buy-property-adgm-abu-dhabi" }, ...maryahPillar],
  }),

  // ---------- cross-area keyword pages
  listPage({
    slug: "penthouses-for-sale-abu-dhabi",
    title: "Penthouses for Sale in Abu Dhabi | Al Maryah, Reem, Saadiyat and Yas",
    description: "Penthouses for sale in Abu Dhabi: projects where developers list penthouses and sky villas across Al Maryah Island, Al Reem Island, Saadiyat and Yas.",
    keywords: "penthouses for sale Abu Dhabi, luxury penthouse Abu Dhabi, Abu Dhabi penthouse for sale, sky villa Abu Dhabi",
    headline: "Penthouses for Sale in Abu Dhabi",
    subheadline: "Where the top-floor homes are.",
    eyebrow: "Abu Dhabi · Penthouses",
    intro: "Penthouses in Abu Dhabi are priced one by one. This page maps where they exist by area and status, so you can ask developers and resale agents about the right buildings.",
    sections: [{ heading: "Buying a penthouse", body: "Ask about the terrace area, parking, service charge and whether the home is sold furnished. In branded projects, ask about the services included." }],
    list: projects.filter((p) => p.units.includes("penthouse")),
    faq: [{ question: "Do penthouses qualify for the Golden Visa?", answer: GOLDEN }],
  }),
  listPage({
    slug: "waterfront-property-abu-dhabi",
    title: "Waterfront Property in Abu Dhabi | Beachfront, Canal and Marina Homes",
    description: "Waterfront property in Abu Dhabi: beachfront residences at Saadiyat, canal and marina homes on Al Reem and Al Maryah Islands, and Al Raha's shoreline.",
    keywords: "waterfront property Abu Dhabi, beachfront apartments Abu Dhabi, waterfront apartments Abu Dhabi, sea view apartments Abu Dhabi",
    headline: "Waterfront Property in Abu Dhabi",
    subheadline: "Beach, canal and marina living across the islands.",
    eyebrow: "Abu Dhabi · Waterfront",
    intro: "Abu Dhabi's freehold areas are islands and shorelines, so waterfront is common. The type of water differs: open beach on Saadiyat, canal and marina on Al Reem and Al Maryah, and the Al Raha shoreline.",
    sections: [{ heading: "Choosing a waterfront type", body: "Beachfront homes on Saadiyat are the most expensive and the most scarce. Canal and marina views on Al Reem and Al Maryah are far more available. Views can be blocked by later construction, so check the master plan around the unit." }],
    list: projects.filter((p) => ["Mamsha Al Saadiyat", "Saadiyat Beach", "Makers District", "Marina Square"].includes(p.community ?? "") || p.area === "al-raha-beach" || p.area === "al-maryah-island"),
    faq: [{ question: "Are views guaranteed?", answer: "No. Ask the developer for the master plan and check what can be built in front of your unit." }],
  }),
  listPage({
    slug: "ready-apartments-abu-dhabi",
    title: "Ready to Move Apartments in Abu Dhabi | Completed Buildings",
    description: "Ready to move apartments in Abu Dhabi: completed buildings on Al Reem Island and Al Maryah Island where you can view and rent immediately.",
    keywords: "ready to move apartments Abu Dhabi, ready apartments Abu Dhabi, completed apartments Abu Dhabi, resale apartments Abu Dhabi",
    headline: "Ready to Move Apartments in Abu Dhabi",
    subheadline: "Completed buildings with immediate occupancy.",
    eyebrow: "Abu Dhabi · Ready",
    intro: "Ready apartments have no construction risk and can be rented from day one. This page lists completed buildings in our directory.",
    sections: [{ heading: "Ready versus off-plan", body: "Ready homes cost more per square foot but remove the handover uncertainty and allow a standard mortgage immediately." }],
    list: projects.filter((p) => p.status === "secondary"),
    faq: [{ question: "Can I get a Golden Visa on a ready apartment?", answer: GOLDEN }],
    extra: [{ label: "Off-Plan vs Ready Property Abu Dhabi", href: "/off-plan-vs-ready-property-abu-dhabi" }],
  }),
];

// One page per priced layout, e.g. "Reem Hills 1 bedroom apartment". Only generated
// where a developer or authorised price list gives a starting price.
function buildUnitPage(p: Project, u: ProjectUnit): SeoPageData {
  const a = areas[p.area];
  const isOff = p.status === "off-plan";
  return {
    slug: unitHref(p, u).slice(1),
    cluster: "projects",
    title: `${u.label} in ${p.name}, ${a.short} | Price and Details`,
    description: `${u.label} in ${p.name}, ${where(p)}, by ${p.developer}. Starting price ${u.price}${u.priceSource ? ` (${u.priceSource})` : ""}. Layout, ownership rules and how to buy.`.slice(0, 300),
    keywords: `${p.name} ${u.label}, ${u.label} ${a.name}, ${u.label} for sale ${a.name}, ${p.name} price`,
    headline: `${u.label} in ${p.name}`,
    subheadline: `Starting from ${u.price} in ${where(p)}.`,
    eyebrow: `${statusLabel(p)} · ${a.name}`,
    heroImg: p.images?.[0],
    intro: `${p.overview} ${u.label} homes in ${p.name} start from ${u.price}${u.priceSource ? ` according to ${u.priceSource}` : ""}. Final prices depend on the unit, floor and view.`,
    sections: [
      { heading: `About the ${u.label.toLowerCase()}`, body: `${p.bedroomsText}. ${u.size ? `Size: ${u.size}. ` : ""}Ask for the floor plan of the specific unit, because layouts differ by floor and building.` },
      { heading: "Buying this home", body: `${isOff ? `Off-plan purchases with ${p.developer} are made through a Sales and Purchase Agreement and paid in stages. Request the payment plan, handover date and full SPA before paying a deposit. ` : "Resale purchases run through an offer, a memorandum of understanding, the developer's no-objection certificate and registration of the transfer. "}${FREEHOLD} ${GOLDEN}` },
    ],
    faq: [
      { question: `How much is a ${u.label.toLowerCase()} in ${p.name}?`, answer: `It starts from ${u.price}${u.priceSource ? ` according to ${u.priceSource}` : ""}. Final prices depend on the unit, floor and view.` },
      { question: `Who develops ${p.name}?`, answer: `${p.developer}${p.brand ? ` with ${p.brand}` : ""}.` },
      { question: "Does it qualify for the Golden Visa?", answer: GOLDEN },
    ],
    linkGroups: [
      { heading: `About ${p.name}`, links: [{ label: `${p.name}: full project page`, href: href(p) }, ...projects.filter((x) => x.area === p.area && x.slug !== p.slug).slice(0, 5).map(link)] },
      { heading: "Browse projects by type", links: typeHubLinks },
    ],
    relatedPages: [{ label: a.pillar.label, href: a.pillar.href }, ...a.articles],
    ...CTA,
  };
}

const unitPages: SeoPageData[] = projects
  .filter((p) => !p.existingHref)
  .flatMap((p) => (p.unitRows ?? []).filter((u) => u.price).map((u) => buildUnitPage(p, u)));

export const projectPages: SeoPageData[] = [
  ...projects.filter((p) => !p.existingHref).map(buildProjectPage),
  ...unitPages,
  ...listPages,
];
