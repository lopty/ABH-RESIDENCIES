import { imageManifest } from "./imageManifest";

export type AreaKey = "al-reem-island" | "al-maryah-island" | "saadiyat-island" | "yas-island" | "al-raha-beach";
export type UnitType = "studio" | "apartment" | "penthouse" | "villa" | "townhouse";
export type Status = "off-plan" | "secondary";

export interface Project {
  slug: string;
  name: string;
  area: AreaKey;
  community?: string;
  developer: string;
  brand?: string;
  status: Status;
  branded: boolean;
  units: UnitType[];
  beds: number[]; // 0 = studio; only bedroom counts stated by a source
  bedroomsText: string;
  handover?: string;
  startingPrice?: string;
  priceSource?: string;
  facts: string[];
  overview: string;
  amenities: string[];
  suits: string;
  officialUrl?: string;
  existingHref?: string;
  // First image is the cover. Use paths like /projects/<slug>/1.jpg once files are in public/projects/<slug>/
  images?: string[];
  unitRows?: ProjectUnit[];
  sizeRange?: string; // e.g. "351 to 3,894 sq ft", only when a developer states it
}

export interface ProjectUnit {
  label: string; // e.g. "1 Bedroom Apartment"
  beds: number; // 0 = studio
  baths?: string;
  size?: string; // e.g. "1,218 to 2,199 sq ft"
  price?: string; // only when a developer or authorised price list states it
  priceSource?: string;
}

export interface AreaInfo {
  name: string;
  short: string;
  blurb: string;
  pillar: { label: string; href: string };
  articles: { label: string; href: string }[];
}

export const areas: Record<AreaKey, AreaInfo> = {
  "al-reem-island": {
    name: "Al Reem Island",
    short: "Reem",
    blurb:
      "Al Reem Island sits just off the main island of Abu Dhabi and is the emirate's largest freehold residential market. Its communities include Shams Abu Dhabi, Marina Square, City of Lights, Makers District and Najmat, so two towers on the same island can differ a lot in age, layout and price.",
    pillar: { label: "Al Reem Island Apartments and Property Guide", href: "/al-reem-island-apartments-abu-dhabi" },
    articles: [
      { label: "Al Reem Island Property Prices 2026", href: "/blog/al-reem-island-property-prices-2026" },
      { label: "The Best Towers to Buy on Al Reem Island", href: "/blog/best-towers-to-buy-al-reem-island" },
      { label: "Al Reem Island Rental Yields 2026", href: "/blog/al-reem-island-rental-yields-2026" },
      { label: "Off-Plan vs Ready on Al Reem Island", href: "/blog/off-plan-vs-ready-al-reem-island" },
      { label: "Living on Al Reem Island: Lifestyle Guide", href: "/blog/living-on-al-reem-island-guide" },
    ],
  },
  "al-maryah-island": {
    name: "Al Maryah Island",
    short: "Al Maryah",
    blurb:
      "Al Maryah Island is Abu Dhabi's financial district and the home of ADGM. The Galleria Al Maryah Island and Cleveland Clinic Abu Dhabi are on the island, and residential stock is almost entirely high-rise apartments, which keeps supply tight.",
    pillar: { label: "Al Maryah Island Real Estate: Complete Guide", href: "/al-maryah-island-real-estate" },
    articles: [
      { label: "The Secondary Market on Al Maryah Island", href: "/blog/al-maryah-island-secondary-market-resale" },
      { label: "Studios and 1-Bedrooms: Entry-Level Guide", href: "/blog/al-maryah-island-studio-1-bedroom-guide" },
      { label: "Financing a Purchase on Al Maryah Island", href: "/blog/financing-purchase-al-maryah-island" },
      { label: "Buy Property in ADGM", href: "/buy-property-adgm-abu-dhabi" },
    ],
  },
  "saadiyat-island": {
    name: "Saadiyat Island",
    short: "Saadiyat",
    blurb:
      "Saadiyat Island is Abu Dhabi's cultural and beachfront district, home to the Louvre Abu Dhabi and NYU Abu Dhabi. It is where most of the emirate's ultra-luxury branded residences are being built.",
    pillar: { label: "Saadiyat Island Property Guide", href: "/saadiyat-island-property-guide" },
    articles: [
      { label: "Saadiyat Island vs Al Maryah Island: Lifestyle Versus Yield", href: "/blog/saadiyat-island-vs-al-maryah-island-lifestyle-yield" },
      { label: "Best Areas to Buy in Abu Dhabi by Budget", href: "/blog/best-areas-buy-property-abu-dhabi-by-budget" },
    ],
  },
  "yas-island": {
    name: "Yas Island",
    short: "Yas",
    blurb:
      "Yas Island is Abu Dhabi's leisure and entertainment island, home to Yas Marina Circuit and Yas Links Golf Course, and a popular choice for family and lifestyle buyers.",
    pillar: { label: "Yas Island Real Estate Guide", href: "/yas-island-real-estate" },
    articles: [{ label: "Best Areas to Buy in Abu Dhabi by Budget", href: "/blog/best-areas-buy-property-abu-dhabi-by-budget" }],
  },
  "al-raha-beach": {
    name: "Al Raha Beach",
    short: "Al Raha",
    blurb:
      "Al Raha Beach is a waterfront community on the Abu Dhabi coast toward the airport, with sea and canal frontage and a family-oriented feel.",
    pillar: { label: "Best Areas to Invest in Abu Dhabi 2026", href: "/best-investment-areas-abu-dhabi-2026" },
    articles: [{ label: "Best Areas to Buy in Abu Dhabi by Budget", href: "/blog/best-areas-buy-property-abu-dhabi-by-budget" }],
  },
};

const baseProjects: Project[] = [
  // ---------------- AL MARYAH ISLAND ----------------
  {
    slug: "jumeirah-residences-al-maryah-island",
    name: "Jumeirah Residences Al Maryah Island",
    area: "al-maryah-island",
    developer: "Emirates Developments",
    brand: "Jumeirah",
    status: "off-plan",
    branded: true,
    units: ["apartment", "penthouse"],
    beds: [1, 2, 3, 4, 5],
    bedroomsText: "One to four bedroom apartments and five bedroom penthouses",
    facts: [],
    overview: "Branded waterfront residences on Al Maryah Island by Emirates Developments with Jumeirah: one to four bedroom apartments and five bedroom penthouses.",
    amenities: [],
    suits: "",
    existingHref: "/jumeirah-residences-al-maryah-island",
  },
  {
    slug: "w-residences-al-maryah-island",
    name: "W Residences Al Maryah Island",
    area: "al-maryah-island",
    developer: "Taraf",
    brand: "W Hotels (Marriott International)",
    status: "off-plan",
    branded: true,
    units: ["apartment"],
    beds: [1, 2, 3, 4],
    bedroomsText: "One to four bedroom apartments",
    facts: [
      "Announced on 11 September 2024 by Taraf and Marriott International as the first W Hotels branded residences in Abu Dhabi",
      "Taraf is the real estate division of Yas Holding",
      "Groundbreaking took place on 22 January 2025, with NSCC International appointed as contractor",
      "Residents receive W Hotels' Whatever/Whenever concierge service",
    ],
    overview:
      "W Residences Abu Dhabi is the second big branded launch on Al Maryah Island and the first time the W brand has put its name on homes in the capital. It brings a younger, design-led hospitality identity to an island otherwise known for banks, hospitals and formal retail.",
    amenities: ["Signature W Hotels concierge service", "Branded interiors and hospitality-managed amenities", "Location inside the ADGM financial district"],
    suits:
      "Buyers who want a branded residence on Al Maryah Island at a different design language from Jumeirah, and investors comfortable with an off-plan timeline. Confirm the current handover date and payment plan with Taraf before reserving.",
    officialUrl: "https://www.tarafholding.com/en/project/w-residences",
  },
  {
    slug: "al-maryah-vista",
    name: "Al Maryah Vista",
    area: "al-maryah-island",
    developer: "Reportage Properties",
    status: "secondary",
    branded: false,
    units: ["studio", "apartment", "penthouse"],
    beds: [0, 1, 2, 3, 4],
    bedroomsText: "Studios, junior one bedrooms, one to three bedroom apartments and lofts, four bedroom apartments and penthouses",
    handover: "Ready to move",
    startingPrice: "AED 620,000",
    priceSource: "Reportage's Al Maryah Vista website",
    sizeRange: "351 to 3,894 sq ft",
    facts: [
      "Homes range from 351 sq ft to 3,894 sq ft",
      "Reportage lists the project as ready to move",
      "The project is close to Cleveland Clinic Abu Dhabi, The Galleria Al Maryah Island and the Four Seasons Hotel",
    ],
    overview:
      "Al Maryah Vista is the most accessible way onto Al Maryah Island. It is a completed, non-branded development with studios from about 351 sq ft, which makes it the entry point for buyers who want the island address without a branded-residence budget.",
    amenities: ["Resort-style swimming pools for adults and children", "Fully equipped gym", "Landscaped gardens", "Retail outlets and restaurants", "Covered parking and high-speed elevators", "Social lounges"],
    suits:
      "First-time investors and professionals who work on the island and want a smaller unit close to ADGM. Compare service charges and resale pricing against other Al Maryah stock before deciding.",
    officialUrl: "https://almaryahvista.com/",
  },
  {
    slug: "al-maryah-vista-2",
    name: "Al Maryah Vista 2",
    area: "al-maryah-island",
    developer: "Reportage Properties",
    status: "off-plan",
    branded: false,
    units: ["studio", "apartment", "penthouse"],
    beds: [0, 1, 2, 3, 4],
    bedroomsText: "Studios, one to four bedroom apartments, lofts and duplexes",
    handover: "Announced for Q4 2026 at launch. Confirm the current date with Reportage.",
    facts: [
      "A 29-floor tower with 588 apartments, according to the launch announcement",
      "Includes a commercial area, offices, a covered car park for 810 cars, a mosque, a pool, a gym and a children's play area",
    ],
    overview:
      "Al Maryah Vista 2 is the second phase of Reportage's Al Maryah Island scheme. It adds a large block of mostly compact units to an island where supply is otherwise limited to a few towers.",
    amenities: ["Swimming pool", "Gym", "Children's play area", "Mosque", "Covered parking for 810 cars", "Commercial and office space in the podium"],
    suits:
      "Buyers who want a lower-ticket entry to Al Maryah Island and can accept a handover date that has moved before. Ask Reportage for the current delivery schedule.",
    officialUrl: "https://reportagegroup.com/projects/residential-apartments/al-maryah-vista-2/",
  },

  // ---------------- AL REEM ISLAND ----------------
  {
    slug: "the-gate-towers-shams-abu-dhabi",
    name: "The Gate Towers",
    area: "al-reem-island",
    community: "Shams Abu Dhabi",
    developer: "Aldar Properties (originally Sorouh Real Estate)",
    status: "secondary",
    branded: false,
    units: ["studio", "apartment", "penthouse", "townhouse"],
    beds: [0, 1, 2, 3, 4],
    bedroomsText: "Studios and one to four bedroom apartments, plus penthouses and townhouses",
    facts: [
      "Developed by Sorouh Real Estate, which merged into Aldar in 2013",
      "Gate Tower 1 has 66 floors above ground",
      "The wider complex was completed in 2013",
      "The complex is reported to hold about 3,500 residential units alongside offices, retail and a hotel",
    ],
    overview:
      "The Gate Towers are the best-known skyline group on Al Reem Island and the reference point for resale pricing in Shams Abu Dhabi. Because they were completed over a decade ago, there is a deep pool of resale units and a long price history to compare against.",
    amenities: ["Sky bridge link between towers", "Residential, office, retail and hotel uses in one complex", "Direct access to the wider Shams Abu Dhabi community"],
    suits:
      "Buyers who want the most liquid and best-documented resale market on the island, and who value proximity to the crossing towards Al Maryah Island. Check unit condition and service charges building by building.",
  },
  {
    slug: "sun-and-sky-towers-shams-abu-dhabi",
    name: "Sun and Sky Towers",
    area: "al-reem-island",
    community: "Shams Abu Dhabi",
    developer: "Aldar Properties (originally Sorouh Real Estate)",
    status: "secondary",
    branded: false,
    units: ["apartment"],
    beds: [],
    bedroomsText: "Apartments in a 65-storey residential tower and a 74-storey mixed-use tower",
    facts: [
      "Sun Tower has 65 storeys and about 680 units, and is exclusively residential",
      "Sky Tower has 74 storeys with about 474 residential units and office space",
      "Both towers were completed around 2010 and 2011",
    ],
    overview:
      "Sun Tower and Sky Tower were among the first high-rises delivered on Al Reem Island and still set its skyline. Sky Tower mixes offices with homes, while Sun Tower is entirely residential, so the two feel different to live in.",
    amenities: ["Views over the Al Reem Island canals and Abu Dhabi skyline", "Mixed-use podium in Sky Tower", "Access to the wider Shams Abu Dhabi community"],
    suits:
      "Buyers looking for high-floor views at older-generation prices. Because the buildings are around fifteen years old, inspect fit-out condition and ask about recent maintenance spending.",
    officialUrl: "https://www.aldar.com/en/explore-aldar/businesses/development/residential/reem-island/sun-and-sky-towers",
  },
  {
    slug: "arc-tower-shams-abu-dhabi",
    name: "Arc Tower",
    area: "al-reem-island",
    community: "Shams Abu Dhabi",
    developer: "Aldar Properties",
    status: "secondary",
    branded: false,
    units: ["studio", "apartment"],
    beds: [0, 1, 2],
    bedroomsText: "Studios and one to two bedroom apartments",
    facts: [
      "Aldar lists the Arc Towers as studios and one and two bedroom apartments",
      "Market records describe three linked buildings around a central courtyard, completed after construction began in 2014",
    ],
    overview:
      "Arc Tower is one of Aldar's Shams Abu Dhabi buildings and a common choice for smaller units on the island. Its amenities are unusually family-friendly for a studio and one bedroom building.",
    amenities: ["Two public pools", "Children's playground", "Lazy river or channel pool", "Movie theatre hall", "Design for environmental sustainability"],
    suits: "Investors and young professionals who want a compact unit from a large listed developer, and who value having a lazy river pool and a cinema hall in the building.",
    officialUrl: "https://www.aldar.com/en/explore-aldar/businesses/development/residential/reem-island/arc-towers",
  },
  {
    slug: "park-view-tower-shams-abu-dhabi",
    name: "Park View Tower",
    area: "al-reem-island",
    community: "Shams Abu Dhabi",
    developer: "Mesab Limited",
    status: "secondary",
    branded: false,
    units: ["apartment"],
    beds: [2, 3],
    bedroomsText: "Two and three bedroom apartments and three bedroom duplexes",
    facts: [
      "A 35-storey tower with 128 apartments",
      "Two bedroom homes range from about 1,218 to 2,199 sq ft, and three bedroom homes from about 3,258 to 3,856 sq ft",
      "Located next to Al Reem Central Park in Shams Abu Dhabi",
    ],
    overview:
      "Park View Tower is a small, large-format building. With only 128 apartments and no studios or one bedrooms, it appeals to families and end users more than to yield-hunting investors.",
    amenities: ["Tropical swimming pool", "Panoramic gym", "Jacuzzi and sauna", "Kids play area", "Four elevators", "187 parking spaces"],
    suits: "Families who want big two and three bedroom layouts beside Al Reem Central Park, and buyers who prefer a quiet, low-unit-count building.",
    officialUrl: "https://www.parkview.ae/",
    sizeRange: "1,218 to 3,856 sq ft",
    unitRows: [
      { label: "2 Bedroom Apartment", beds: 2, size: "1,218 to 2,199 sq ft" },
      { label: "3 Bedroom Apartment", beds: 3, size: "3,258 to 3,856 sq ft" },
      { label: "3 Bedroom Duplex", beds: 3, size: "2,460 sq ft" },
    ],
  },
  {
    slug: "mangrove-place-shams-abu-dhabi",
    name: "Mangrove Place",
    area: "al-reem-island",
    community: "Shams Abu Dhabi",
    developer: "Federal Properties Limited",
    status: "secondary",
    branded: false,
    units: ["apartment", "townhouse", "penthouse"],
    beds: [1, 2, 3],
    bedroomsText: "One to three bedroom apartments, three bedroom townhouses and a penthouse",
    facts: [
      "A 29-storey building with 481 units, completed in 2013 according to market records",
      "Overlooks the mangroves, the canal and downtown Abu Dhabi",
    ],
    overview:
      "Mangrove Place is one of the few Shams Abu Dhabi buildings that mixes apartments with townhouse-style homes, and it looks out over the island's mangrove reserve rather than the city.",
    amenities: ["Swimming pool", "Jacuzzi", "Children's play area", "Fully equipped gym"],
    suits: "Families who want a green outlook and larger layouts, and buyers open to a building that is more than a decade old.",
  },
  {
    slug: "burooj-views-marina-square",
    name: "Burooj Views",
    area: "al-reem-island",
    community: "Marina Square",
    developer: "Burooj Properties",
    status: "secondary",
    branded: false,
    units: ["studio", "apartment"],
    beds: [],
    bedroomsText: "Apartments in a 45-storey residential tower",
    facts: ["A 45-storey residential tower delivered around 2012", "One of the towers that make up the Marina Square development"],
    overview:
      "Burooj Views is one of the Marina Square towers, close to the waterfront and to the island's retail. It regularly appears in the lower price bands of Al Reem Island resale listings.",
    amenities: ["High-rise waterfront views", "Access to Marina Square retail and dining"],
    suits: "Budget-conscious buyers and investors looking for an entry price on Al Reem Island, who are comfortable with an older building.",
  },
  {
    slug: "tala-tower-marina-square",
    name: "Tala Tower",
    area: "al-reem-island",
    community: "Marina Square",
    developer: "Aldar Properties",
    status: "secondary",
    branded: false,
    units: ["apartment"],
    beds: [1, 2, 3],
    bedroomsText: "One to three bedroom apartments",
    facts: ["375 residences", "Fully completed in 2011"],
    overview:
      "Tala Tower is an Aldar building in Marina Square with 375 apartments. Its size makes it easy to compare unit for unit, and its age means buyers should focus on condition and service charges.",
    amenities: ["Marina Square waterfront setting", "Access to island retail and dining"],
    suits: "Buyers who prefer an Aldar-developed building in Marina Square and want one to three bedroom layouts.",
  },
  {
    slug: "pixel-makers-district",
    name: "Pixel",
    area: "al-reem-island",
    community: "Makers District",
    developer: "IMKAN",
    status: "secondary",
    branded: false,
    units: ["studio", "apartment"],
    beds: [],
    bedroomsText: "Studios and apartments",
    facts: [
      "The first project completed in Makers District, IMKAN's 18-hectare waterfront neighbourhood",
      "Reported to include 525 apartments across seven mixed-use towers, with about 3,500 sq m of food, retail and office space",
      "Makers District also includes a 300-metre accessible beach and padel courts",
    ],
    overview:
      "Pixel is the pixelated, MVRDV-designed anchor of Makers District, the creative-industries neighbourhood on the north of Al Reem Island. It is newer than Shams Abu Dhabi or Marina Square and sits in a district that is still filling in.",
    amenities: ["Pedestrianised central plaza", "Food, retail and office space on site", "Beach and padel courts within Makers District"],
    suits: "Buyers who want a newer building and are comfortable with a district that is still maturing, in return for a lower entry price than Shams.",
    officialUrl: "https://www.imkan.ae/projects/makers-district",
  },
  {
    slug: "reem-hills",
    name: "Reem Hills",
    area: "al-reem-island",
    community: "Reem Hills",
    developer: "Modon",
    status: "off-plan",
    branded: false,
    units: ["villa", "townhouse", "apartment"],
    beds: [1],
    bedroomsText: "Villas, townhouses and apartments, with one bedroom apartments the entry point",
    handover: "Villas Q2 2026 and apartments Q2 2027, as stated on Modon's website. Confirm current status with Modon.",
    startingPrice: "AED 1.5 million (one bedroom apartment)",
    priceSource: "Modon's Reem Hills page",
    facts: [
      "Modon lists a 50/50 payment plan",
      "The gated community is built around a man-made hill",
      "Modon states that properties of AED 2 million or more qualify for the UAE Golden Visa",
      "Freehold for all nationalities",
    ],
    overview:
      "Reem Hills is the villa and townhouse community of Al Reem Island. In an island otherwise made of towers, it offers gated, low-rise living with private gardens and beach access.",
    amenities: ["Community centre", "Jogging trails", "Swimming pool", "Mosque", "Gym and clubhouse", "Luxury retail, restaurant and supermarket", "Tennis courts", "Sandy beaches and water features"],
    suits: "Families who want a villa or townhouse on Al Reem Island, and Golden Visa buyers looking at homes above AED 2 million.",
    officialUrl: "https://www.modon.com/real-estate/reem-hills",
    unitRows: [{ label: "1 Bedroom Apartment", beds: 1, price: "AED 1.5 million", priceSource: "Modon's Reem Hills page" }],
  },
  {
    slug: "najmat-towers-al-reem-island",
    name: "Najmat Towers",
    area: "al-reem-island",
    community: "Najmat Abu Dhabi",
    developer: "Reem Developers and Mismak Properties",
    status: "secondary",
    branded: false,
    units: ["studio", "apartment", "penthouse"],
    beds: [],
    bedroomsText: "Studios to four bedroom apartments across the community's towers",
    facts: [
      "Najmat Tower C10 is a 40-storey building by Reem Developers, completed in 2020",
      "Najmat Residential Tower is two 29-storey towers by Mismak Properties, also completed in 2020",
    ],
    overview:
      "Najmat Abu Dhabi is one of the newer residential communities on Al Reem Island, and its towers are among the most recently completed on the island, which usually means fewer maintenance surprises than Shams Abu Dhabi.",
    amenities: ["Community-level retail and services within Najmat", "Waterfront and canal outlook"],
    suits: "Buyers who want a building from around 2020 rather than 2010, and are happy to trade Shams' central location for a newer specification.",
  },

  {
    slug: "hydra-avenue-towers-city-of-lights",
    name: "Hydra Avenue Towers",
    area: "al-reem-island",
    community: "City of Lights",
    developer: "Hydra Properties",
    status: "secondary",
    branded: false,
    units: ["studio", "apartment", "townhouse"],
    beds: [],
    bedroomsText: "Studios, apartments and townhouses across six towers",
    facts: [
      "Six towers ranging from 24 to 29 storeys, completed in December 2014",
      "The first three towers (C4, C5 and C6) sit on a five-storey mixed-use platform",
    ],
    overview:
      "Hydra Avenue Towers is the largest apartment cluster in City of Lights and is widely regarded as one of the more affordable residential complexes on Al Reem Island. Six towers on a shared platform make it a good place to compare like-for-like units.",
    amenities: ["Shared podium platform with mixed-use space", "City of Lights setting close to the island's waterfront"],
    suits: "Buyers and investors who want a lower entry price on Al Reem Island and are happy to buy in a building completed around 2014.",
  },
  {
    slug: "sigma-towers-city-of-lights",
    name: "Sigma Towers",
    area: "al-reem-island",
    community: "City of Lights",
    developer: "Mismak Properties",
    status: "secondary",
    branded: false,
    units: ["studio", "apartment"],
    beds: [],
    bedroomsText: "Studios and apartments",
    facts: ["A 28-floor development with about 299 units, completed in June 2015"],
    overview:
      "Sigma Towers is a mid-sized City of Lights building by Mismak Properties. At about 299 units it is smaller than Hydra Avenue, so there are fewer resale listings at any time and each unit is easier to compare.",
    amenities: ["City of Lights location", "Access to the island's retail and waterfront"],
    suits: "Buyers who want a City of Lights address in a smaller building and are comfortable with a property completed around 2015.",
  },
  {
    slug: "elie-saab-waterfront-al-reem-island",
    name: "Elie Saab Waterfront",
    area: "al-reem-island",
    developer: "Ohana Development",
    brand: "Elie Saab",
    status: "off-plan",
    branded: true,
    units: ["apartment", "penthouse"],
    beds: [],
    bedroomsText: "Apartments and penthouses in a 35-storey tower",
    handover: "Announced for 2027. Confirm the current date with Ohana Development.",
    facts: [
      "A 35-storey residential tower with about 174 units, according to the developer's announcement",
      "Design concept described as sculpture in motion, with fluid curves",
      "Amenities include a children's playground, outdoor pool, gym, EV charging and a padel court",
    ],
    overview:
      "Elie Saab Waterfront by Ohana Development is a branded residential tower on Al Reem Island. It is a fashion-branded project rather than a hotel-branded one, and at about 174 units it is a small collection for the island.",
    amenities: ["Outdoor pool", "Landscaped gardens", "Fully equipped gym", "Children's playground", "Padel court", "EV charging station"],
    suits: "Buyers who want a branded, off-plan home on Al Reem Island and are comfortable with a handover that is still some time away.",
  },

  // ---------------- SAADIYAT ISLAND ----------------
  {
    slug: "nobu-residences-saadiyat-island",
    name: "Nobu Residences",
    area: "saadiyat-island",
    community: "Mamsha Al Saadiyat",
    developer: "Aldar Properties",
    brand: "Nobu",
    status: "off-plan",
    branded: true,
    units: ["apartment", "penthouse"],
    beds: [1, 2, 3],
    bedroomsText: "One, two and three bedroom apartments, two bedroom lofts, penthouses and sky villas",
    facts: [
      "A limited collection of 88 residences",
      "On the beachfront at Mamsha Al Saadiyat, near the Louvre Abu Dhabi and the Zayed National Museum",
      "The development spans about 50,000 sqm including a hotel and retail",
    ],
    overview:
      "Nobu Residences is one of the smallest and most exclusive branded projects in Abu Dhabi. With only 88 homes on the Saadiyat beachfront, it is closer to a private club than a conventional tower.",
    amenities: ["Beachfront setting", "Nobu hospitality services", "Hotel and retail within the development"],
    suits: "Buyers who want a small, beachfront branded address on Saadiyat and value scarcity over unit count.",
  },
  {
    slug: "mandarin-oriental-residences-saadiyat-island",
    name: "Mandarin Oriental Residences",
    area: "saadiyat-island",
    community: "Saadiyat Cultural District",
    developer: "Aldar Properties",
    brand: "Mandarin Oriental",
    status: "off-plan",
    branded: true,
    units: ["apartment", "penthouse"],
    beds: [1, 2, 3, 4],
    bedroomsText: "One to four bedroom apartments and five bedroom penthouses",
    facts: [
      "Mandarin Oriental's first branded residences in the UAE",
      "Around 226 to 228 homes, depending on the source",
      "Located in the Saadiyat Cultural District",
    ],
    overview:
      "Mandarin Oriental Residences is the brand's first residential project in the UAE and sits in the heart of Saadiyat's cultural district, close to the island's museums.",
    amenities: ["Mandarin Oriental services", "Cultural District location"],
    suits: "Buyers who want a culturally central Saadiyat address with a globally recognised hospitality brand.",
    officialUrl: "https://press.mandarinoriental.com/residences-abu-dhabi",
  },
  {
    slug: "four-seasons-private-residences-saadiyat-beach",
    name: "Four Seasons Private Residences Abu Dhabi at Saadiyat Beach",
    area: "saadiyat-island",
    community: "Saadiyat Beach",
    developer: "ALAIN",
    brand: "Four Seasons",
    status: "off-plan",
    branded: true,
    units: ["villa", "penthouse"],
    beds: [5, 6],
    bedroomsText: "Five and six bedroom villas, beach mansions, suites and penthouses",
    handover: "2029, per the Four Seasons announcement",
    facts: [
      "Announced by Four Seasons and ALAIN, an Abu Dhabi asset management company",
      "A gated, beachfront community on the first shoreline of Saadiyat Beach",
      "Villas are grouped into four collections: Golf, Garden, Sea and Royal",
    ],
    overview:
      "This is a standalone, gated beachfront community rather than a tower. It is one of the most expensive residential launches in Abu Dhabi, aimed at buyers looking for a villa or beach mansion with Four Seasons service.",
    amenities: ["Private beachfront", "Four Seasons service", "Gated community with villas, mansions, suites and penthouses"],
    suits: "Ultra-high-net-worth buyers and family offices looking for a private beachfront villa in Abu Dhabi.",
    officialUrl: "https://www.fourseasons.com/residences/private_residences/abu-dhabi-at-saadiyat-beach/",
  },

  // ---------------- YAS ISLAND ----------------
  {
    slug: "waldorf-astoria-residences-yas-island",
    name: "Waldorf Astoria Residences Yas Island",
    area: "yas-island",
    community: "Yas Links",
    developer: "Aldar Properties",
    brand: "Waldorf Astoria (Hilton)",
    status: "off-plan",
    branded: true,
    units: ["apartment", "penthouse"],
    beds: [],
    bedroomsText: "Furnished apartments and penthouses",
    facts: [
      "Announced by Aldar and Hilton as Abu Dhabi's first Waldorf Astoria branded residences",
      "Located along the Yas Links Golf Course with views of the fairways and Yas Marina Circuit",
    ],
    overview:
      "Waldorf Astoria Residences is on Yas Island beside the Yas Links Golf Course. It is Abu Dhabi's first branded residence under the Waldorf Astoria name, and it is on Yas Island, not on Al Maryah Island.",
    amenities: ["Furnished residences", "Golf course frontage", "Waldorf Astoria hospitality services"],
    suits: "Buyers who want a branded residence with golf and circuit views on Yas Island.",
  },
  {
    slug: "stellar-by-elie-saab-yas-island",
    name: "Stellar by Elie Saab",
    area: "yas-island",
    developer: "Emirates Developments",
    brand: "Elie Saab",
    status: "off-plan",
    branded: true,
    units: ["villa", "apartment", "penthouse"],
    beds: [],
    bedroomsText: "Garden villas and signature apartments, including penthouses",
    facts: ["Interiors use furniture and decor from the ELIE SAAB Maison collection"],
    overview:
      "Stellar by Elie Saab is a fashion-branded residential project on Yas Island by Emirates Developments, the same developer behind Jumeirah Residences Al Maryah Island.",
    amenities: ["Gym", "Kids area", "Outdoor lounge and lounge bar", "Cinema room", "Pool facilities", "Conference spaces"],
    suits: "Buyers who want a design-led branded home on Yas Island and who like the option of a garden villa.",
    officialUrl: "https://emiratesdevelopments.com/community/stellar-by-elie-saab/",
  },

  // ---------------- AL RAHA BEACH ----------------
  {
    slug: "hilton-residences-al-raha",
    name: "Hilton Residences Al Raha",
    area: "al-raha-beach",
    developer: "Emirates Developments",
    brand: "Hilton",
    status: "off-plan",
    branded: true,
    units: ["apartment", "townhouse"],
    beds: [1, 2, 3, 4, 5],
    bedroomsText: "One to four bedroom apartments and three to five bedroom townhouses",
    facts: [
      "On the Al Raha shoreline, about 10 minutes from Abu Dhabi International Airport",
      "About 14 minutes from Yas Island, 21 minutes from Downtown Abu Dhabi and 22 minutes from Saadiyat Island",
      "Sea-facing homes with terraces over the sea and canal",
    ],
    overview:
      "Hilton Residences Al Raha puts a branded, sea-facing community on the Al Raha shoreline, with both apartments and townhouses. It is the most airport-convenient branded project in this portfolio.",
    amenities: ["Wellness and fitness spaces", "Sea and canal-facing terraces", "Hilton hospitality services"],
    suits: "Families and frequent flyers who want a branded home with quick airport access, and buyers who prefer a townhouse to a tower.",
    officialUrl: "https://emiratesdevelopments.com/community/hilton-residences-al-raha/",
  },
];

export const projects: Project[] = baseProjects.map((p) => ({ ...p, images: p.images ?? imageManifest[p.slug] }));
