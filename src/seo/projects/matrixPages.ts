import { SeoPageData, RelatedPage, SeoFaq } from "../types";
import { areas, projects, AreaKey, Project } from "./projectsData";
import { card, CTA, FREEHOLD, GOLDEN, href, statusLabel, where, homeTypes, cap, typeHubLinks } from "./projectPages";
import { distanceKm } from "./geo";
import { buyerGuidePages } from "../buyerGuides";
import { alMaryahPages } from "../alMaryahPages";
import { areaGuidePages } from "../areaGuides";

// "Buy ..." pages for the head searches: buy property in <area>, buy <home type> in <area or Abu Dhabi>.
// Every count, name, developer and status below is computed from the project data, so a page can
// only say what the directory actually holds. A page with fewer than two matching projects is not built.

type Pred = (p: Project) => boolean;
type TypeKey = "apartment" | "studio" | "1br" | "2br" | "3br" | "villa" | "townhouse" | "penthouse" | "off-plan" | "ready" | "branded";

const hasBeds = (p: Project, n: number) => p.beds.includes(n) || (p.unitRows ?? []).some((u) => u.beds === n);
const TYPES: Record<TypeKey, { label: string; slugPart: string; pred: Pred; keyword: string }> = {
  apartment: { label: "apartments", slugPart: "apartment", pred: (p) => p.units.includes("apartment"), keyword: "apartment" },
  studio: { label: "studios", slugPart: "studio", pred: (p) => p.units.includes("studio") || p.beds.includes(0), keyword: "studio" },
  "1br": { label: "1 bedroom apartments", slugPart: "1-bedroom-apartment", pred: (p) => hasBeds(p, 1), keyword: "1 bedroom apartment" },
  "2br": { label: "2 bedroom apartments", slugPart: "2-bedroom-apartment", pred: (p) => hasBeds(p, 2), keyword: "2 bedroom apartment" },
  "3br": { label: "3 bedroom apartments", slugPart: "3-bedroom-apartment", pred: (p) => hasBeds(p, 3), keyword: "3 bedroom apartment" },
  villa: { label: "villas", slugPart: "villa", pred: (p) => p.units.includes("villa"), keyword: "villa" },
  townhouse: { label: "townhouses", slugPart: "townhouse", pred: (p) => p.units.includes("townhouse"), keyword: "townhouse" },
  penthouse: { label: "penthouses", slugPart: "penthouse", pred: (p) => p.units.includes("penthouse"), keyword: "penthouse" },
  "off-plan": { label: "off-plan property", slugPart: "off-plan-property", pred: (p) => p.status === "off-plan", keyword: "off plan property" },
  ready: { label: "ready property", slugPart: "ready-property", pred: (p) => p.status === "secondary", keyword: "ready property" },
  branded: { label: "branded residences", slugPart: "branded-residence", pred: (p) => p.branded, keyword: "branded residence" },
};

// Advice that depends on the home type. It is written per type and never reused across types.
const shortAdvice: Record<TypeKey, string> = {
  apartment: "Compare square feet and service charge per square foot, not the bedroom label.",
  studio: "Check the size in square feet and whether the building allows your intended letting model.",
  "1br": "Ask whether the balcony is counted in the size and what a one bedroom last sold for in the same building.",
  "2br": "Ask about en-suites, the maid's room and parking bays for each two bedroom layout.",
  "3br": "Ask about parking bays, storage, the maid's room and whether the layout is a duplex.",
  villa: "Ask for plot area and built-up area separately, and for the community fee.",
  townhouse: "Ask for the plot area, the built-up area and the community fee.",
  penthouse: "Ask for the terrace area, the parking allocation and the service charge.",
  "off-plan": "Ask each developer for the payment plan, the handover date and the escrow details in writing.",
  ready: "Ask each seller for the service charge history and any planned maintenance spending.",
  branded: "Ask which services the charge covers and who operates the building.",
};
const projectTail = (list: Project[]) =>
  list.map((p) => `${p.name}: ${p.status === "off-plan" ? `off-plan, so ask ${dev(p)} for the payment plan and handover date` : "completed, so ask the seller for the service charge history"}`).join("; ") + ".";

const typeAdvice = (t: TypeKey, place: string): string => {
  switch (t) {
    case "apartment":
      return `When you compare apartments in ${place}, compare the size in square feet rather than the bedroom label, because the same label covers very different areas in different towers. Ask each seller for the service charge per square foot and the date of the last increase, since it is a running cost that the price does not show.`;
    case "studio":
      return `A studio is the smallest layout and usually the lowest entry price in a building, and it is most often bought to rent out. Check the size in square feet, whether the kitchen is closed or open, and whether the building allows the letting model you have in mind. A studio in one tower can be larger than a one bedroom in another, so do not rely on the label.`;
    case "1br":
      return `A one bedroom suits a single owner, a couple or an investor renting to one professional. Ask for the size, whether the balcony is included in that size, and whether the bedroom and living room face the view or an adjoining tower. Ask what a one bedroom in the same building last sold for, not only what is advertised.`;
    case "2br":
      return `Two bedroom homes are the layout most often bought by small families and by sharers, so the bedroom sizes and the number of bathrooms matter as much as the total area. Ask whether both bedrooms have an en-suite, whether a maid's room is included, and how many parking bays the unit is allocated.`;
    case "3br":
      return `Three bedroom homes are family homes, so check the total area, the number of parking bays, the storage, and whether a maid's room is part of the layout. Some three bedroom homes are duplexes or have terraces, which changes both the price and the running cost, so ask for the exact floor plan of the unit.`;
    case "villa":
      return `A villa is bought differently from an apartment: ask for the plot area and the built-up area separately, the number of floors, the community fee, and what the fee covers. Villas are sold in far fewer projects than apartments, so the choice on this list is smaller than for apartments.`;
    case "townhouse":
      return `A townhouse sits between an apartment and a villa: it has its own entrance and usually a small plot or terrace, but shares walls and community services. Ask for the plot and built-up areas, the community fee, and whether the community has its own parking rules.`;
    case "penthouse":
      return `A penthouse is priced unit by unit, so there is no list price to anchor on. Ask for the terrace area, the parking allocation, the service charge and whether the home is sold furnished. In a branded building, ask which hotel services are included in the charge and which are billed separately.`;
    case "off-plan":
      return `Off-plan means you commit before the building is finished. You sign a Sales and Purchase Agreement, pay in stages, and receive the home on a handover date that can move. Ask for the payment plan in writing, the escrow arrangements, the handover date and the developer's completed projects, and read the SPA before paying a deposit.`;
    case "ready":
      return `A ready home is completed, so you can view the actual unit, check the condition, and rent it out immediately. The purchase runs through an offer, a memorandum of understanding, the developer's no-objection certificate and registration of the transfer. Ask for the service charge history and any planned maintenance spending before you offer.`;
    case "branded":
      return `A branded residence carries a hotel or fashion name and is managed to that brand's standard, which usually means higher service charges than a non-branded tower. Ask which services the charge covers, who operates the building, and what the brand agreement says about the length of the partnership.`;
  }
};

const plural = (n: number, one: string, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;
const names = (ps: Project[]) => {
  const n = ps.map((p) => p.name);
  return n.length <= 1 ? n.join("") : `${n.slice(0, -1).join(", ")} and ${n[n.length - 1]}`;
};
const uniq = <T,>(xs: T[]) => [...new Set(xs)];
const dev = (p: Project) => p.developer.split(" (")[0];

// A price quoted for one layout is only used on pages about that layout.
const priceFits = (p: Project, t?: TypeKey) => !t || !/one bedroom/i.test(p.startingPrice ?? "") || t === "apartment" || t === "1br";

function summary(list: Project[], label: string, place: string, t?: TypeKey) {
  const off = list.filter((p) => p.status === "off-plan");
  const ready = list.filter((p) => p.status === "secondary");
  const devs = uniq(list.map(dev));
  const withPrice = list.filter((p) => p.startingPrice && priceFits(p, t));
  const communities = uniq(list.map((p) => p.community).filter(Boolean) as string[]);
  const status =
    off.length && ready.length
      ? `${plural(off.length, "project is", "projects are")} off-plan (${names(off)}) and ${plural(ready.length, "is", "are")} completed (${names(ready)}).`
      : off.length
        ? `All are off-plan, so none can be viewed as a finished home yet.`
        : `All are completed buildings, so the homes are sold on the resale market and can be viewed now.`;
  const price = withPrice.length
    ? `${plural(withPrice.length, "developer or authorised source publishes", "developers or authorised sources publish")} a starting price for the project (${withPrice.map((p) => `${p.name}, ${p.startingPrice}`).join("; ")}); for the others, price is confirmed unit by unit.`
    : `No developer in this group publishes a starting price, so price is confirmed unit by unit with the seller.`;
  return { off, ready, devs, communities, status, price };
}

function tableFor(list: Project[]) {
  return {
    headers: ["Project", "Location", "Status", "Developer", "Homes"],
    rows: list.map((p) => ({
      cells: [
        p.name,
        p.community ? `${p.community}, ${areas[p.area].short}` : areas[p.area].name,
        p.branded ? `${statusLabel(p)}, ${p.brand ? p.brand.split(" (")[0] : "branded"}` : statusLabel(p),
        dev(p),
        p.beds.length ? p.bedroomsText : cap(homeTypes(p)),
      ],
    })),
  };
}

// Measured straight-line distances, only for projects that were geocoded. Names the nearest project
// in this page's own list, so the sentence differs from page to page.
function distanceNote(list: Project[], label: string): string | null {
  const nearest = (landmark: string, name: string) => {
    const d = list.map((p) => ({ p, d: distanceKm(landmark, p.slug) })).filter((x): x is { p: Project; d: number } => x.d !== null).sort((a, b) => a.d - b.d)[0];
    return d ? `${d.p.name} is the closest to ${name} at ${d.d} km` : null;
  };
  const bits = [nearest("reem-mall", "Reem Mall"), nearest("sorbonne", "Sorbonne University Abu Dhabi"), nearest("reem-central-park", "Reem Central Park")].filter(Boolean);
  return bits.length ? `Of the ${label} listed here, ${bits.join("; ")}. These are straight-line distances measured from map coordinates, not walking routes, and only projects we could geocode are compared.` : null;
}

interface Page {
  spec: { area?: AreaKey; type?: TypeKey; hub?: boolean };
  page: SeoPageData;
}
const built: Page[] = [];

// ---------------------------------------------------------------- area hubs
const AREA_HUB: Record<
  AreaKey,
  { slug: string; keywords: string; role: string; ownership: string; faq: (list: Project[]) => SeoFaq[] }
> = {
  "al-maryah-island": {
    slug: "buy-property-al-maryah-island",
    keywords: "buy property in Al Maryah Island, buy property Al Maryah Island Abu Dhabi, Al Maryah Island property, buy apartment Al Maryah Island, buy home Al Maryah Island",
    role: "Al Maryah Island is where Abu Dhabi Global Market sits, with The Galleria Al Maryah Island and Cleveland Clinic Abu Dhabi on the same island. The island is small, and its residential stock is almost entirely high-rise apartments, so the number of homes on sale at any time is limited and each building matters.",
    ownership: "Al Maryah Island is a designated freehold zone, so a buyer of any nationality can own a home outright. Because ADGM is here, many buyers are professionals and companies, and the island also has an active rental market.",
    faq: (l) => [
      { question: "Are there villas for sale on Al Maryah Island?", answer: `No project in our directory sells villas on Al Maryah Island. Its ${plural(l.length, "residential project")} ${l.length === 1 ? "is" : "are"} apartment towers with penthouses. Buyers who want a villa usually look at Reem Hills on Al Reem Island, or at Saadiyat and Yas.` },
      { question: "Which developers sell on Al Maryah Island?", answer: `${uniq(l.map(dev)).join(", ")} sell the projects in our directory (${names(l)}).` },
    ],
  },
  "al-reem-island": {
    slug: "buy-property-al-reem-island",
    keywords: "buy property in Al Reem Island, buy property Al Reem Island Abu Dhabi, Al Reem Island property, buy apartment Al Reem Island, buy home Al Reem Island",
    role: "Al Reem Island is a short distance across the water from Abu Dhabi's main island and is the emirate's largest freehold residential market. It has several communities, including Shams Abu Dhabi, Marina Square, City of Lights, Makers District and Najmat, and the towers differ a lot in age, layout and price.",
    ownership: "Al Reem Island is a designated freehold zone, so a buyer of any nationality can own a home outright. It is the island with the widest range of ready apartments, and it also has a villa and townhouse community at Reem Hills.",
    faq: (l) => [
      { question: "Which communities are on Al Reem Island?", answer: `Our directory covers ${uniq(l.map((p) => p.community).filter(Boolean) as string[]).join(", ")}.` },
      { question: "Is there a villa community on Al Reem Island?", answer: `Yes. Reem Hills is a villa and townhouse community by Modon on Al Reem Island, and Mangrove Place in Shams Abu Dhabi lists townhouses.` },
    ],
  },
  "saadiyat-island": {
    slug: "buy-property-saadiyat-island",
    keywords: "buy property in Saadiyat Island, buy property Saadiyat Island Abu Dhabi, Saadiyat Island property, buy apartment Saadiyat Island, buy home Saadiyat Island",
    role: "Saadiyat Island is Abu Dhabi's cultural and beachfront district, home to the Louvre Abu Dhabi and NYU Abu Dhabi. It is where most of the emirate's ultra-luxury branded residences are being built, so the list here is short and mostly off-plan.",
    ownership: "Saadiyat Island is a designated freehold zone, so a buyer of any nationality can own a home outright. Homes here are priced one by one, and a Golden Visa needs a purchase of AED 2,000,000 or more.",
    faq: (l) => [
      { question: "Which branded residences are on Saadiyat Island?", answer: `${names(l.filter((p) => p.branded))} are branded projects on Saadiyat Island in our directory.` },
    ],
  },
  "yas-island": {
    slug: "buy-property-yas-island",
    keywords: "buy property in Yas Island, buy property Yas Island Abu Dhabi, Yas Island property, buy apartment Yas Island, buy home Yas Island",
    role: "Yas Island is Abu Dhabi's leisure and entertainment island, home to Yas Marina Circuit and Yas Links Golf Course, and a common choice for family and lifestyle buyers. The projects in our directory here are branded and off-plan.",
    ownership: "Yas Island is a designated freehold zone, so a buyer of any nationality can own a home outright.",
    faq: (l) => [{ question: "Which projects are on Yas Island?", answer: `${names(l)} are on Yas Island in our directory.` }],
  },
  "al-raha-beach": {
    slug: "buy-property-al-raha-beach",
    keywords: "buy property in Al Raha Beach, buy property Al Raha Beach Abu Dhabi, Al Raha Beach property, buy apartment Al Raha Beach",
    role: "Al Raha Beach is a waterfront community on the Abu Dhabi coast toward the airport, with sea and canal frontage and a family-oriented feel.",
    ownership: "Al Raha Beach is a designated freehold zone, so a buyer of any nationality can own a home outright.",
    faq: (l) => [{ question: "Which projects are on Al Raha Beach?", answer: `${names(l)} ${l.length === 1 ? "is" : "are"} on Al Raha Beach in our directory.` }],
  },
};

// The type pages that exist for each area. A candidate is only kept if two or more projects match.
const AREA_TYPES: Record<AreaKey, TypeKey[]> = {
  "al-maryah-island": ["studio", "1br", "2br", "3br", "penthouse", "off-plan", "ready", "branded"],
  "al-reem-island": ["penthouse", "townhouse", "ready", "branded", "apartment"],
  "saadiyat-island": ["apartment", "villa", "branded", "penthouse"],
  "yas-island": ["apartment", "villa", "penthouse"],
  "al-raha-beach": ["apartment", "townhouse"],
};
// Pages that already exist under other slugs; do not duplicate them.
const EXISTING = new Set(["al-reem-island:apartment", "al-reem-island:branded"]);
const ABU_DHABI_TYPES: TypeKey[] = ["apartment", "studio", "1br", "2br", "3br", "villa", "townhouse", "off-plan", "ready", "branded"];

const typeSlug = (t: TypeKey, area?: AreaKey) => `buy-${TYPES[t].slugPart}-${area ? areas[area].name.toLowerCase().replace(/ /g, "-") : "abu-dhabi"}`;

// ---------------------------------------------------------------- type pages
const seenSets = new Map<string, SeoPageData>();
function typePage(t: TypeKey, area?: AreaKey): SeoPageData | null {
  const T = TYPES[t];
  const pool = area ? projects.filter((p) => p.area === area) : projects;
  const list = pool.filter(T.pred);
  if (list.length < 2) return null;
  const place = area ? areas[area].name : "Abu Dhabi";
  const sig = list.map((p) => p.slug).sort().join("|");
  const twin = seenSets.get(sig);
  if (twin) {
    // Same projects as an existing page: that page also answers this search.
    twin.keywords += `, buy ${T.keyword} ${place}, ${T.label} ${place}`;
    twin.faq = [...(twin.faq ?? []), { question: `Are there ${T.label} in ${place}?`, answer: `Yes. The projects on this page also sell ${T.label} in ${place}: ${names(list)}.` }];
    return null;
  }
  const s = summary(list, T.label, place, t);
  const unknownBeds = (["1br", "2br", "3br"] as TypeKey[]).includes(t) ? pool.filter((p) => p.beds.length === 0 && p.units.includes("apartment")) : [];
  const dn = distanceNote(list, `${T.label} in ${place}`);

  const glance =
    `${plural(list.length, "project")} in our directory ${list.length === 1 ? "sells" : "sell"} ${T.label} in ${place}: ${names(list)}. ${s.status} ` +
    `${plural(s.devs.length, "developer")} ${s.devs.length === 1 ? "is" : "are"} involved (${s.devs.join(", ")}). ${s.price}`;

  const bySpread = !area
    ? uniq(list.map((p) => p.area))
        .map((k) => {
          const inK = list.filter((p) => p.area === k);
          return `${cap(T.label)} in ${areas[k].name}: ${plural(inK.length, "project")} (${names(inK)}).`;
        })
        .join("\n\n")
    : `${s.communities.length ? `${cap(T.label)} here are in ${s.communities.join(", ")}. ` : ""}${plural(list.length, "project")} in ${areas[area].name} ${list.length === 1 ? "matches" : "match"}; the buying page for ${areas[area].name} lists the rest.`;

  const sections = [
    { heading: `${cap(T.label)} on sale in ${place}`, body: glance },
    { heading: area ? `Where in ${areas[area].name}` : `Where ${T.label} are, by area`, body: `${bySpread}${dn ? `\n\n${dn}` : ""}` },
    { heading: `Buying ${T.label} in ${place}`, body: area ? `${shortAdvice[t]} Project by project: ${projectTail(list)}` : typeAdvice(t, place) },
    ...(unknownBeds.length
      ? [{ heading: "Projects where the bedroom mix is not published", body: `${names(unknownBeds)} ${unknownBeds.length === 1 ? "does" : "do"} not publish a bedroom breakdown, so ${unknownBeds.length === 1 ? "it is" : "they are"} not counted among the ${T.label} above. AD Residences can ask the developer or the seller which layouts are on sale.` }]
      : []),
    {
      heading: "Ownership and Golden Visa",
      body: `${cap(T.label)} in ${place} can be bought by a buyer of any nationality with full freehold title and no local sponsor. ${GOLDEN}`,
    },
  ];

  const faq: SeoFaq[] = [
    { question: `Which projects sell ${T.label} in ${place}?`, answer: `${names(list)}. ${s.status}` },
    { question: `Are there off-plan ${T.label} in ${place}?`, answer: s.off.length ? `Yes: ${names(s.off)}.` : `Not in our directory at the moment. All matching projects are completed buildings.` },
    { question: `Can foreigners buy ${T.label} in ${place}?`, answer: `Yes, a buyer of any nationality can own freehold in Abu Dhabi's designated investment zones.` },
    { question: `What does it cost to buy ${T.label} in ${place}?`, answer: s.price },
  ];

  const page: SeoPageData = {
    slug: typeSlug(t, area),
    cluster: "projects",
    title: `Buy ${cap(T.label)} in ${place} | ${plural(list.length, "Project")}, Developers and Status`,
    description: `Buy ${T.label} in ${place}: ${plural(list.length, "project")} (${names(list).slice(0, 110)}), with developer, status and how to buy with AD Residences.`.slice(0, 300),
    keywords: `buy ${T.keyword} ${place}, buy ${T.keyword} in ${place}, ${T.keyword} for sale ${place}, ${T.label} ${place}`,
    headline: `Buy ${cap(T.label)} in ${place}`,
    subheadline: `${plural(list.length, "project")} in our directory: ${s.off.length} off-plan, ${s.ready.length} ready.`,
    eyebrow: `${place} · ${cap(T.label)}`,
    stats: [
      { label: "Projects", value: `${list.length}` },
      { label: "Off-Plan", value: `${s.off.length}` },
      { label: "Ready", value: `${s.ready.length}` },
      { label: "Developers", value: `${s.devs.length}` },
    ],
    intro: `${cap(T.label)} in ${place} are sold in ${plural(list.length, "project")} in our directory, ${s.off.length ? `${s.off.length} off-plan` : "none off-plan"} and ${s.ready.length ? `${s.ready.length} ready` : "none ready"}. The table and cards below show each project's developer, status and home types, and AD Residences confirms what is available on the day you enquire.`,
    sections,
    table: tableFor(list),
    faq,
    cards: list.map(card),
    linkGroups: [],
    relatedPages: [],
    ...CTA,
  };
  seenSets.set(sig, page);
  return page;
}

// ---------------------------------------------------------------- hubs
// Title words come from the home types actually listed, so a page never advertises a type it does not have.
const homeWords = (l: Project[]) => {
  const w: [string, string][] = [["apartment", "Apartments"], ["villa", "Villas"], ["townhouse", "Townhouses"], ["penthouse", "Penthouses"]];
  const present = w.filter(([u]) => l.some((p) => p.units.includes(u as never))).map(([, n]) => n);
  return present.length > 1 ? `${present.slice(0, -1).join(", ")} and ${present[present.length - 1]}` : present[0] ?? "Homes";
};

function hubPage(area: AreaKey): SeoPageData {
  const H = AREA_HUB[area];
  const a = areas[area];
  const list = projects.filter((p) => p.area === area);
  const s = summary(list, "homes", a.name);
  const typeCounts = (["apartment", "studio", "penthouse", "villa", "townhouse"] as const)
    .map((u) => ({ u, n: list.filter((p) => p.units.includes(u)).length }))
    .filter((x) => x.n > 0)
    .map((x) => `${x.u === "studio" ? "studios" : x.u === "penthouse" ? "penthouses" : x.u === "villa" ? "villas" : x.u === "townhouse" ? "townhouses" : "apartments"} in ${plural(x.n, "project")}`);
  const dn = distanceNote(list, `homes on ${a.name}`);
  return {
    slug: H.slug,
    cluster: "projects",
    title: `Buy Property in ${a.name} | ${homeWords(list)} for Sale`,
    description: `Buy property in ${a.name}: ${plural(list.length, "project")} (${names(list).slice(0, 120)}), by developer, status and home type, with how to buy with AD Residences.`.slice(0, 300),
    keywords: H.keywords,
    headline: `Buy Property in ${a.name}`,
    subheadline: `${plural(list.length, "project")} on the market, ${s.off.length} off-plan and ${s.ready.length} ready.`,
    eyebrow: `${a.name} · Buy`,
    stats: [
      { label: "Projects", value: `${list.length}` },
      { label: "Off-Plan", value: `${s.off.length}` },
      { label: "Ready", value: `${s.ready.length}` },
      { label: "Developers", value: `${s.devs.length}` },
    ],
    intro: `${H.role} Our directory lists ${plural(list.length, "project")} on ${a.name}: ${names(list)}.`,
    sections: [
      { heading: `What is on sale in ${a.name}`, body: `${s.status} The home types on offer are ${typeCounts.join(", ")}. ${s.price}${dn ? `\n\n${dn}` : ""}` },
      { heading: `Buying in ${a.name}`, body: `${H.ownership} ${GOLDEN}` },
      {
        heading: "Choosing between off-plan and ready here",
        body: s.off.length && s.ready.length
          ? `${a.name} has both. Off-plan projects (${names(s.off)}) are cheaper to enter and paid in stages, but the handover date can move. Ready projects (${names(s.ready)}) can be viewed, financed and rented immediately, and their price is set by each owner rather than a developer list.`
          : s.off.length
            ? `Every project we list on ${a.name} is off-plan, so you buy from a developer's plan and take handover later. Ask each developer for the payment plan, the handover date and the escrow arrangements.`
            : `Every project we list on ${a.name} is completed, so you buy on the resale market and can view the actual home.`,
      },
    ],
    table: tableFor(list),
    faq: [
      ...H.faq(list),
      { question: `Which bedroom counts are on sale in ${a.name}?`, answer: (() => { const rows = [0, 1, 2, 3, 4, 5, 6].map((n) => ({ n, l: list.filter((p) => hasBeds(p, n)) })).filter((x) => x.l.length); return rows.length ? rows.map((x) => `${x.n === 0 ? "Studios" : `${x.n} bedroom`}: ${names(x.l)}`).join(". ") + ". Projects that do not publish a bedroom mix are not counted." : "No project in our directory publishes a bedroom mix for this area, so ask for current availability."; })() },
      { question: `Can foreigners buy property in ${a.name}?`, answer: `Yes. ${FREEHOLD}` },
      { question: `Does property in ${a.name} qualify for the Golden Visa?`, answer: GOLDEN },
    ],
    cards: list.map(card),
    linkGroups: [],
    relatedPages: [],
    ...CTA,
  };
}

function abuDhabiHub(): SeoPageData {
  const rows = (Object.keys(areas) as AreaKey[]).map((k) => {
    const l = projects.filter((p) => p.area === k);
    const s = summary(l, "homes", areas[k].name);
    return { k, l, s };
  });
  return {
    slug: "buy-home-abu-dhabi",
    cluster: "projects",
    title: "Buy a Home in Abu Dhabi | Apartments, Villas and Penthouses by Area",
    description: "Buy a home in Abu Dhabi: where apartments, villas, townhouses and penthouses are on sale across Al Reem, Al Maryah, Saadiyat, Yas and Al Raha, with developer, status and how to buy.",
    keywords: "buy home Abu Dhabi, buy a home in Abu Dhabi, buy house Abu Dhabi, buy apartment Abu Dhabi, buy property Abu Dhabi, homes for sale Abu Dhabi",
    headline: "Buy a Home in Abu Dhabi",
    subheadline: `${projects.length} projects across five freehold areas, by area, status and home type.`,
    eyebrow: "Abu Dhabi · Buy a Home",
    stats: [
      { label: "Projects", value: `${projects.length}` },
      { label: "Off-Plan", value: `${projects.filter((p) => p.status === "off-plan").length}` },
      { label: "Ready", value: `${projects.filter((p) => p.status === "secondary").length}` },
      { label: "Areas", value: `${rows.length}` },
    ],
    intro: `A home in Abu Dhabi means choosing an area first, because the areas differ more than the buildings do. Our directory holds ${projects.length} projects across ${rows.length} freehold areas. This page shows what is on sale in each, and links to the buying page for every area and home type.`,
    sections: [
      { heading: "What is on sale, area by area", body: rows.map((r) => `${areas[r.k].name}: ${plural(r.l.length, "project")}, ${r.s.off.length} off-plan and ${r.s.ready.length} ready (${names(r.l)}).`).join("\n\n") },
      {
        heading: "Which area suits which buyer",
        body: `Al Reem Island has the widest choice of ready apartments and the only villa and townhouse communities within reach of the city. Al Maryah Island is small and financial-district focused, with branded launches and one ready tower. Saadiyat Island is where the beachfront branded residences are. Yas Island suits leisure and family buyers. Al Raha Beach is a quieter coastal community toward the airport.`,
      },
      { heading: "Ownership and Golden Visa", body: `${FREEHOLD} ${GOLDEN}` },
    ],
    table: tableFor(projects),
    faq: [
      { question: "Can a foreigner buy a home in Abu Dhabi?", answer: `Yes. ${FREEHOLD}` },
      { question: "Should I buy a home in Abu Dhabi off-plan or ready?", answer: `Off-plan is bought from the developer and paid in stages, with a handover date that can move. Ready is completed and can be viewed and rented at once. Our directory lists ${projects.filter((p) => p.status === "off-plan").length} off-plan and ${projects.filter((p) => p.status === "secondary").length} ready projects.` },
      { question: "Which area is best to buy a home in Abu Dhabi?", answer: "It depends on the use. Al Reem Island has the widest choice of ready apartments, Al Maryah Island is the financial district, Saadiyat Island has the beachfront branded residences, and Yas Island is the leisure island." },
    ],
    cards: projects.map(card),
    linkGroups: [],
    relatedPages: [],
    ...CTA,
  };
}

// ---------------------------------------------------------------- assemble
built.push({ spec: { hub: true }, page: abuDhabiHub() });
for (const k of Object.keys(areas) as AreaKey[]) if (projects.filter((p) => p.area === k).length >= 2) built.push({ spec: { area: k, hub: true }, page: hubPage(k) });
for (const t of ABU_DHABI_TYPES) {
  const p = typePage(t);
  if (p) built.push({ spec: { type: t }, page: p });
}
for (const k of Object.keys(AREA_TYPES) as AreaKey[]) {
  for (const t of AREA_TYPES[k]) {
    if (EXISTING.has(`${k}:${t}`)) continue;
    const p = typePage(t, k);
    if (p) built.push({ spec: { area: k, type: t }, page: p });
  }
}

const hrefOf = (p: SeoPageData) => `/${p.slug}`;
const labelOf = (b: Page) => b.page.headline;

// Existing keyword pages that belong to each area, so the new pages join the existing cluster.
const EXISTING_AREA_LINKS: Partial<Record<AreaKey, RelatedPage[]>> = {
  "al-reem-island": [
    { label: "Apartments for Sale in Al Reem Island", href: "/apartments-for-sale-al-reem-island" },
    { label: "Studio for Sale in Al Reem Island", href: "/studio-for-sale-al-reem-island" },
    { label: "1 Bedroom Apartment for Sale in Al Reem Island", href: "/1-bedroom-apartment-for-sale-al-reem-island" },
    { label: "2 Bedroom Apartment for Sale in Al Reem Island", href: "/2-bedroom-apartment-for-sale-al-reem-island" },
    { label: "3 Bedroom Apartment for Sale in Al Reem Island", href: "/3-bedroom-apartment-for-sale-al-reem-island" },
    { label: "Villas for Sale in Al Reem Island", href: "/villas-for-sale-al-reem-island" },
    { label: "Off-Plan Property in Al Reem Island", href: "/off-plan-property-al-reem-island" },
  ],
  "al-maryah-island": [
    { label: "Property for Sale on Al Maryah Island", href: "/property-for-sale-al-maryah-island" },
    { label: "Luxury Apartments on Al Maryah Island", href: "/luxury-apartments-al-maryah-island" },
    { label: "Luxury Branded Residences on Al Maryah Island", href: "/luxury-branded-residences-al-maryah-island" },
    { label: "Apartments Near ADGM", href: "/apartments-near-adgm-abu-dhabi" },
    { label: "Buy Property in ADGM", href: "/buy-property-adgm-abu-dhabi" },
  ],
};
const EXISTING_TYPE_LINKS: RelatedPage[] = [
  { label: "Penthouses for Sale in Abu Dhabi", href: "/penthouses-for-sale-abu-dhabi" },
  { label: "Waterfront Property in Abu Dhabi", href: "/waterfront-property-abu-dhabi" },
  { label: "Ready to Move Apartments in Abu Dhabi", href: "/ready-apartments-abu-dhabi" },
];

const hubOf = (k: AreaKey) => built.find((b) => b.spec.hub && b.spec.area === k)?.page;
const hubAreas = (Object.keys(areas) as AreaKey[]).filter((k) => hubOf(k));
const adHub = built.find((b) => b.spec.hub && !b.spec.area)!.page;

for (const b of built) {
  const { area, type, hub } = b.spec;
  const groups: { heading: string; links: RelatedPage[] }[] = [];
  if (hub && !area) {
    groups.push({ heading: "Buy by area", links: hubAreas.map((k) => ({ label: `Buy Property in ${areas[k].name}`, href: hrefOf(hubOf(k)!) })) });
    groups.push({ heading: "Buy by home type in Abu Dhabi", links: built.filter((x) => x.spec.type && !x.spec.area).map((x) => ({ label: labelOf(x), href: hrefOf(x.page) })) });
  } else if (hub && area) {
    groups.push({ heading: `Buy by home type in ${areas[area].name}`, links: built.filter((x) => x.spec.area === area && x.spec.type).map((x) => ({ label: labelOf(x), href: hrefOf(x.page) })) });
    if (EXISTING_AREA_LINKS[area]) groups.push({ heading: `More ${areas[area].name} pages`, links: EXISTING_AREA_LINKS[area]! });
    groups.push({ heading: "Buy in other areas", links: hubAreas.filter((k) => k !== area).map((k) => ({ label: `Buy Property in ${areas[k].name}`, href: hrefOf(hubOf(k)!) })) });
  } else if (type && area) {
    groups.push({ heading: `More ways to buy in ${areas[area].name}`, links: [{ label: `Buy Property in ${areas[area].name}`, href: hrefOf(hubOf(area)!) }, ...built.filter((x) => x.spec.area === area && x.spec.type && x.spec.type !== type).map((x) => ({ label: labelOf(x), href: hrefOf(x.page) }))] });
    groups.push({ heading: `${cap(TYPES[type].label)} in other areas`, links: [...built.filter((x) => x.spec.type === type && x.spec.area !== area).map((x) => ({ label: labelOf(x), href: hrefOf(x.page) })), { label: "Buy a Home in Abu Dhabi", href: hrefOf(adHub) }] });
    if (EXISTING_AREA_LINKS[area]) groups.push({ heading: `More ${areas[area].name} pages`, links: EXISTING_AREA_LINKS[area]! });
  } else if (type) {
    groups.push({ heading: "Buy a home in Abu Dhabi by type", links: [{ label: "Buy a Home in Abu Dhabi", href: hrefOf(adHub) }, ...built.filter((x) => x.spec.type && !x.spec.area && x.spec.type !== type).map((x) => ({ label: labelOf(x), href: hrefOf(x.page) }))] });
    groups.push({ heading: `${cap(TYPES[type].label)} by area`, links: built.filter((x) => x.spec.type === type && x.spec.area).map((x) => ({ label: labelOf(x), href: hrefOf(x.page) })) });
    groups.push({ heading: "Buy by area", links: hubAreas.map((k) => ({ label: `Buy Property in ${areas[k].name}`, href: hrefOf(hubOf(k)!) })) });
  }
  b.page.linkGroups = [...groups.filter((g) => g.links.length), { heading: "Browse projects by type", links: typeHubLinks }];
  b.page.relatedPages = [
    ...(area ? [{ label: areas[area].pillar.label, href: areas[area].pillar.href }, ...areas[area].articles] : []),
    { label: "Buy Property in Abu Dhabi: The Complete 2026 Guide", href: "/buy-property-abu-dhabi" },
    ...(type && !area ? EXISTING_TYPE_LINKS : []),
  ];
}

export const matrixPages: SeoPageData[] = built.map((b) => b.page);

// ---------------------------------------------------------------- link the new pages from the existing pillars and hubs
const areaHubLinks = hubAreas.map((k) => ({ label: `Buy Property in ${areas[k].name}`, href: hrefOf(hubOf(k)!) }));
const matrixGroup = { heading: "Buy by area and home type", links: [{ label: "Buy a Home in Abu Dhabi", href: hrefOf(adHub) }, ...areaHubLinks] };
const push = (pages: SeoPageData[], slug: string, extra: { heading: string; links: RelatedPage[] }) => {
  const p = pages.find((x) => x.slug === slug);
  if (p) p.linkGroups = [...(p.linkGroups ?? []), extra];
};
push(buyerGuidePages, "buy-property-abu-dhabi", matrixGroup);
push(alMaryahPages, "buy-property-adgm-abu-dhabi", { heading: "Buy on Al Maryah Island", links: [{ label: "Buy Property in Al Maryah Island", href: hrefOf(hubOf("al-maryah-island")!) }] });
push(alMaryahPages, "al-maryah-island-real-estate", { heading: "Buy on Al Maryah Island", links: built.filter((x) => x.spec.area === "al-maryah-island").map((x) => ({ label: labelOf(x), href: hrefOf(x.page) })) });
push(areaGuidePages, "al-reem-island-apartments-abu-dhabi", { heading: "Buy on Al Reem Island", links: built.filter((x) => x.spec.area === "al-reem-island").map((x) => ({ label: labelOf(x), href: hrefOf(x.page) })) });

// The shared "Browse projects by type" block is on every project page, so add the head hubs there.
typeHubLinks.push({ label: "Buy a Home in Abu Dhabi", href: hrefOf(adHub) }, { label: "Buy Property in Al Maryah Island", href: hrefOf(hubOf("al-maryah-island")!) }, { label: "Buy Property in Al Reem Island", href: hrefOf(hubOf("al-reem-island")!) }, { label: "Buy Property in Saadiyat Island", href: hrefOf(hubOf("saadiyat-island")!) });
