import { SeoPageData, SeoFaq, RelatedPage } from "../types";
import { projects, areas } from "./projectsData";
import { card, CTA, GOLDEN, FREEHOLD } from "./projectPages";

// Every statement here comes from Emirates Developments' own Jumeirah Residences page
// (developer, brand partner, unit types, amenities) or from a named press source.
// No prices, yields, payment schedules or sizes are stated, because the developer has not published them.
const J = projects.find((p) => p.slug === "jumeirah-residences-al-maryah-island")!;
const images = J.images ?? [];
const P = "/jumeirah-residences-al-maryah-island";

const cardsFor = (...slugs: string[]) => slugs.map((s) => projects.find((p) => p.slug === s)).filter(Boolean).map((p) => card(p!));
const maryahCards = cardsFor("jumeirah-residences-al-maryah-island", "w-residences-al-maryah-island", "al-maryah-vista", "al-maryah-vista-2");

const jLinks: RelatedPage[] = [
  { label: "Jumeirah Residences Al Maryah Island: Overview", href: P },
  { label: "Floor Plans and Layouts", href: `${P}-floor-plans` },
  { label: "Payment Plan: What to Ask", href: `${P}-payment-plan` },
  { label: "Investment Return", href: `${P}-investment-return` },
  { label: "Golden Visa", href: `${P}-golden-visa` },
  { label: "1 Bedroom Apartments", href: `${P}-1-bedroom` },
  { label: "2 Bedroom Apartments", href: `${P}-2-bedroom` },
  { label: "Penthouses", href: `${P}-penthouse` },
  { label: "Price and Availability", href: `${P}-price` },
  { label: "Honest Review", href: `${P}-review` },
];
const areaLinks: RelatedPage[] = [
  { label: areas["al-maryah-island"].pillar.label, href: areas["al-maryah-island"].pillar.href },
  { label: "Property for Sale on Al Maryah Island", href: "/property-for-sale-al-maryah-island" },
  { label: "Luxury Branded Residences on Al Maryah Island", href: "/luxury-branded-residences-al-maryah-island" },
  { label: "Buy Property in ADGM", href: "/buy-property-adgm-abu-dhabi" },
];

const AMENITIES =
  "Emirates Developments lists personalised wellness experiences, private dining, concierge services, floating terraces, sky-high gardens, an elevated pool, luxury retail, fine dining and leisure experiences.";

interface Spec {
  slug: string;
  title: string;
  description: string;
  keywords: string;
  headline: string;
  subheadline: string;
  intro: string;
  sections: { heading: string; body: string }[];
  faq: SeoFaq[];
  cards?: ReturnType<typeof card>[];
  extra?: RelatedPage[];
}

function page(s: Spec): SeoPageData {
  return {
    slug: s.slug,
    cluster: "jumeirah",
    title: s.title,
    description: s.description,
    keywords: s.keywords,
    headline: s.headline,
    subheadline: s.subheadline,
    eyebrow: "Branded Residence · Al Maryah Island",
    heroImg: images[0],
    gallery: images.length > 1 ? images.slice(1) : undefined,
    stats: [
      { label: "Developer", value: "Emirates Developments" },
      { label: "Brand", value: "Jumeirah" },
      { label: "Status", value: "Off-Plan" },
      { label: "Homes", value: "1 to 5 BR" },
    ],
    intro: s.intro,
    sections: s.sections,
    faq: s.faq,
    cards: s.cards ?? maryahCards,
    linkGroups: [{ heading: "More on Jumeirah Residences", links: jLinks.filter((l) => l.href !== `/${s.slug}`) }],
    relatedPages: [...(s.extra ?? []), ...areaLinks],
    ctaHeadline: "Request Current Availability at Jumeirah Residences",
    ctaBody: "Emirates Developments has not published a price list. AD Residences can request current availability, layouts and pricing on your behalf and arrange a briefing.",
    ctaLabel: "Request Availability",
  };
}

const golden: SeoFaq = { question: "Does Jumeirah Residences qualify for the UAE Golden Visa?", answer: GOLDEN };
const developerFaq: SeoFaq = { question: "Who develops Jumeirah Residences Al Maryah Island?", answer: "Emirates Developments, in partnership with Jumeirah, which is the brand partner." };

export const jumeirahClusterPages: SeoPageData[] = [
  page({
    slug: "jumeirah-residences-al-maryah-island",
    title: "Jumeirah Residences Al Maryah Island | Branded Apartments and Penthouses",
    description: "Jumeirah Residences Al Maryah Island by Emirates Developments with Jumeirah: one to four bedroom apartments and five bedroom penthouses, amenities, ownership and how to enquire.",
    keywords: "Jumeirah Residences Al Maryah Island, Jumeirah Residences Abu Dhabi, Emirates Developments Jumeirah Residences, branded residences Al Maryah Island, buy Jumeirah Residences",
    headline: "Jumeirah Residences Al Maryah Island",
    subheadline: "Branded apartments and penthouses on Abu Dhabi's financial island, by Emirates Developments with Jumeirah.",
    intro: "Jumeirah Residences Al Maryah Island is a branded residential project by Emirates Developments in partnership with Jumeirah. It offers one to four bedroom apartments and five bedroom penthouses on Al Maryah Island, the home of ADGM. The design is credited to Killa Design, and Emirates Developments and Jumeirah announced the partnership in January 2026.",
    sections: [
      { heading: "At a glance", body: "Developer: Emirates Developments. Brand partner: Jumeirah. Location: Al Maryah Island, Abu Dhabi. Status: off-plan. Home types: one to four bedroom apartments and five bedroom penthouses. Ownership: freehold, open to buyers of any nationality." },
      { heading: "What the developer lists", body: AMENITIES + " Emirates Developments has not published prices, sizes, a payment plan or a handover date on its project page, so those need to be requested for each unit." },
      { heading: "Where it sits", body: "Al Maryah Island is Abu Dhabi's financial district under ADGM jurisdiction, with The Galleria Al Maryah Island and Cleveland Clinic Abu Dhabi on the island. It is one of the smallest freehold islands in Abu Dhabi, and its residential stock is almost entirely high-rise." },
      { heading: "How buying works", body: `Off-plan purchases are made through a reservation and a Sales and Purchase Agreement with the developer, and paid in stages. ${FREEHOLD} Ask for the payment plan, handover date and SPA in writing before paying any deposit.` },
      { heading: "How it compares on the island", body: "Jumeirah Residences and W Residences are the two branded projects on Al Maryah Island, and Al Maryah Vista and Vista 2 by Reportage Properties are the non-branded options. The branded projects are off-plan, while Al Maryah Vista is described by its developer as ready to move." },
    ],
    faq: [developerFaq, { question: "What home types are at Jumeirah Residences?", answer: "One to four bedroom apartments and five bedroom penthouses." }, golden, { question: "Where can I see current availability?", answer: "Emirates Developments does not publish a price list. AD Residences can request current availability, layouts and pricing on your behalf." }],
    extra: [{ label: "Emirates Developments and Jumeirah Residences", href: "/emirates-developments-jumeirah-residences" }],
  }),
  page({
    slug: "jumeirah-residences-al-maryah-island-floor-plans",
    title: "Jumeirah Residences Al Maryah Island Floor Plans and Layouts",
    description: "Floor plans and layouts at Jumeirah Residences Al Maryah Island: one to four bedroom apartments and five bedroom penthouses, and how to read and request the plan for a specific unit.",
    keywords: "Jumeirah Residences floor plans, Jumeirah Residences Al Maryah Island layouts, Jumeirah Residences unit sizes, Jumeirah Residences brochure",
    headline: "Floor Plans and Layouts at Jumeirah Residences",
    subheadline: "Layout types, and how to read the plan for the unit you are considering.",
    intro: "Emirates Developments describes the layouts at Jumeirah Residences as one to four bedroom apartments and five bedroom penthouses. It has not published unit sizes on its project page, so the floor plan of the specific unit is the document that matters.",
    sections: [
      { heading: "The layout range", body: "The range runs from one bedroom apartments up to five bedroom penthouses, with two, three and four bedroom apartments in between. Which layouts are still available depends on the release, so ask for the current availability list." },
      { heading: "How to read a plan", body: "Check the internal area and the terrace area separately, the position of the living room relative to the terrace, the number of bathrooms, and where the kitchen sits. The developer describes floating terraces and sky-high gardens, so the terrace is worth studying." },
      { heading: "Floor and orientation", body: "On a waterfront island the same layout can have very different views depending on floor and which side of the tower it faces. Ask which direction the unit faces, and for off-plan units, what the master plan shows in front of the building." },
      { heading: "What to request", body: "Ask for the unit's floor plan, the schedule of finishes, the parking allocation and the storage allocation. Keep these with your Sales and Purchase Agreement." },
    ],
    faq: [
      { question: "What layouts are offered at Jumeirah Residences?", answer: "One to four bedroom apartments and five bedroom penthouses, according to Emirates Developments." },
      { question: "Are unit sizes published?", answer: "Not on the developer's project page. Request the plan for the specific unit." },
      { question: "How can I get the floor plan for a unit?", answer: "AD Residences can request the plan and current availability from the developer for the unit you are considering." },
    ],
  }),
  page({
    slug: "jumeirah-residences-al-maryah-island-payment-plan",
    title: "Jumeirah Residences Al Maryah Island Payment Plan: What to Ask the Developer",
    description: "The payment plan for Jumeirah Residences Al Maryah Island: what the developer has and has not published, how off-plan plans are structured, and the questions to ask before reserving.",
    keywords: "Jumeirah Residences payment plan, Jumeirah Residences Al Maryah Island payment schedule, off-plan payment plan Abu Dhabi, Emirates Developments payment plan",
    headline: "Payment Plan at Jumeirah Residences: What to Ask",
    subheadline: "The developer has not published one, so here is how to get it right.",
    intro: "Emirates Developments has not published a payment plan for Jumeirah Residences on its project page. Payment schedules for off-plan homes are usually set per release and can change, so the plan that applies to your unit is the one written into your Sales and Purchase Agreement.",
    sections: [
      { heading: "How off-plan plans are usually structured", body: "A common structure is a deposit on reservation, a further payment on signing the SPA, staged payments linked to construction milestones, and a balance at handover. Some projects add a post-handover period. Which of these applies is a decision for each project, not a rule." },
      { heading: "Questions to ask", body: "What triggers each instalment, and who certifies the construction milestone? What happens if handover is delayed? How is the money held in escrow? Is there a fee to assign the contract to a new buyer, and does the developer need to consent?" },
      { heading: "What to get in writing", body: "The full schedule with dates or milestones, the escrow account details, the handover date and the remedy for delay, and the SPA itself. Do not pay a deposit until you have read the SPA." },
      { heading: "Related pages", body: "Our pages on property payment plans and off-plan projects compare how other developers in Abu Dhabi describe their plans." },
    ],
    faq: [
      { question: "What is the payment plan for Jumeirah Residences?", answer: "Emirates Developments has not published one. Ask for the plan that applies to your unit and get it in writing." },
      { question: "Are off-plan payments protected?", answer: "Registered off-plan projects hold buyer payments in escrow. Review the SPA and the payment schedule before paying a deposit." },
      { question: "Can I sell before handover?", answer: "It depends on the developer's consent rules in the SPA. Ask before you sign." },
    ],
    extra: [{ label: "Property Payment Plans in Abu Dhabi", href: "/property-payment-plans-abu-dhabi" }, { label: "Off-Plan Projects", href: "/projects/off-plan" }],
  }),
  page({
    slug: "jumeirah-residences-al-maryah-island-investment-return",
    title: "Jumeirah Residences Al Maryah Island: Investment Return and How to Judge It",
    description: "How to judge the investment return on Jumeirah Residences Al Maryah Island: what drives rent and resale on the island, the costs to model, and why no yield is quoted here.",
    keywords: "Jumeirah Residences investment, Jumeirah Residences rental yield, Jumeirah Residences ROI, Al Maryah Island investment",
    headline: "Investment Return at Jumeirah Residences",
    subheadline: "What drives the return, and how to calculate it for your unit.",
    intro: "We do not quote a yield for Jumeirah Residences because the project is off-plan, the developer has not published prices, and no rental history exists yet for the building. What we can do is set out what drives the return on Al Maryah Island and how to calculate it once you have a real price and a real rent.",
    sections: [
      { heading: "What supports rent on the island", body: "Al Maryah Island is the home of ADGM, with The Galleria Al Maryah Island and Cleveland Clinic Abu Dhabi on the island. Professionals who work there value a short walk to the office, which supports demand for homes on the island." },
      { heading: "The costs to model", body: "Deduct the annual service charge and any management fee from the rent, and divide by the total purchase cost including registration and agency fees. Branded buildings usually carry higher service charges than non-branded ones, so ask for the estimated charge before you buy." },
      { heading: "Off-plan timing", body: "An off-plan buyer earns no rent until handover, and handover dates can move. Any return calculation should include the wait, and the cost of capital tied up during construction." },
      { heading: "Resale", body: "Branded stock can support resale demand, but resale before handover depends on the developer's consent rules. Compare the exit options with the ready alternatives on the island, such as Al Maryah Vista." },
    ],
    faq: [
      { question: "What rental yield does Jumeirah Residences offer?", answer: "There is no rental history yet and no published price list, so no reliable yield can be quoted. Calculate it from the unit's price and a current rent for comparable homes." },
      { question: "Is off-plan or ready better for income?", answer: "Ready homes earn rent immediately. Off-plan usually costs less per square foot but earns nothing until handover." },
      golden,
    ],
    extra: [{ label: "High ROI Apartments in Abu Dhabi", href: "/high-roi-apartments-abu-dhabi" }],
  }),
  page({
    slug: "jumeirah-residences-al-maryah-island-golden-visa",
    title: "Golden Visa Through Jumeirah Residences Al Maryah Island",
    description: "How the UAE Golden Visa works for a purchase at Jumeirah Residences Al Maryah Island: the AED 2 million threshold, off-plan rules to confirm, and the documents to keep.",
    keywords: "Golden Visa Jumeirah Residences, Golden Visa Al Maryah Island, Golden Visa off-plan Abu Dhabi, UAE Golden Visa property",
    headline: "Golden Visa Through Jumeirah Residences",
    subheadline: "How the AED 2 million rule applies, and what to confirm for an off-plan unit.",
    intro: "A property purchase of AED 2,000,000 or more qualifies the buyer and immediate family for the 10-year UAE Golden Visa. Jumeirah Residences is a branded, off-plan project, so the question is not only the price of the unit but how the authorities treat off-plan payments.",
    sections: [
      { heading: "The threshold", body: "For a purchase at Jumeirah Residences the rule is the same as anywhere in Abu Dhabi. " + GOLDEN },
      { heading: "The off-plan point", body: "Off-plan property can qualify, but the rules on how much must have been paid, and how a mortgage affects the calculation, are set by the authorities and can change. Confirm the current rule at the time you buy rather than relying on this page." },
      { heading: "Documents to keep", body: "The Sales and Purchase Agreement, proof of payments, the developer's payment receipts and, once available, the title deed or the Oqood registration. Your advisor can confirm what the authority will ask for at that stage." },
      { heading: "Family and duration", body: "The visa can extend to immediate family, and it is valid for ten years and renewable. Ask about the conditions that keep it valid." },
    ],
    faq: [golden, { question: "Can I use an off-plan purchase for the Golden Visa?", answer: "It can qualify, but the payment rules must be met. Confirm the current rule with your advisor." }, { question: "Does the visa cover my family?", answer: "It can extend to immediate family members." }],
    extra: [{ label: "Golden Visa Property in Abu Dhabi", href: "/golden-visa-eligible-property-abu-dhabi" }, { label: "UAE Golden Visa Abu Dhabi", href: "/golden-visa-abu-dhabi" }],
  }),
  page({
    slug: "jumeirah-residences-al-maryah-island-1-bedroom",
    title: "1 Bedroom Apartments at Jumeirah Residences Al Maryah Island",
    description: "One bedroom apartments at Jumeirah Residences Al Maryah Island: what the developer lists, who they suit, and what to check on layout, floor and terrace before reserving.",
    keywords: "Jumeirah Residences 1 bedroom, one bedroom apartment Al Maryah Island branded, Jumeirah Residences studio and 1BR",
    headline: "1 Bedroom Apartments at Jumeirah Residences",
    subheadline: "The smallest home in the project, and how to choose one.",
    intro: "Emirates Developments lists one bedroom apartments as the entry layout at Jumeirah Residences, up to five bedroom penthouses. The one bedroom is the layout most buyers ask about first, because it is the lowest-ticket way into a branded building on the island.",
    sections: [
      { heading: "Who a one bedroom suits", body: "Single professionals working in ADGM, investors who want a smaller branded unit, and buyers who want a lock-up-and-leave base in Abu Dhabi. It is less suited to families or anyone who needs space for guests." },
      { heading: "What to check", body: "The internal area and the terrace area, the floor and orientation, and whether the bedroom and living room both open to the terrace. Ask about the service charge, because a smaller unit in a branded building can carry a high charge per square foot." },
      { heading: "Golden Visa", body: "A one bedroom may or may not reach AED 2,000,000, depending on the unit. " + GOLDEN },
      { heading: "Compare before you decide", body: "Compare the one bedroom here against a one bedroom at W Residences and against ready options such as Al Maryah Vista, on price, handover, service charge and what each brand adds." },
    ],
    faq: [
      { question: "Does Jumeirah Residences have one bedroom apartments?", answer: "Yes. Emirates Developments lists one to four bedroom apartments and five bedroom penthouses." },
      { question: "Will a one bedroom qualify for the Golden Visa?", answer: "Only if the unit's price reaches AED 2,000,000. Confirm the exact price." },
      { question: "How do I get the current price?", answer: "The developer has not published a price list. AD Residences can request current availability and pricing." },
    ],
  }),
  page({
    slug: "jumeirah-residences-al-maryah-island-2-bedroom",
    title: "2 Bedroom Apartments at Jumeirah Residences Al Maryah Island",
    description: "Two bedroom apartments at Jumeirah Residences Al Maryah Island: who they suit, what to check on layout and terrace, and how they compare with other Al Maryah homes.",
    keywords: "Jumeirah Residences 2 bedroom, two bedroom apartment Al Maryah Island branded, Jumeirah Residences 2BR",
    headline: "2 Bedroom Apartments at Jumeirah Residences",
    subheadline: "The layout for couples, small families and sharers.",
    intro: "Two bedroom apartments sit in the middle of the range at Jumeirah Residences, between the one bedroom entry layout and the four bedroom apartments and five bedroom penthouses. They suit buyers who need a second room for family, guests or a home office.",
    sections: [
      { heading: "Who a two bedroom suits", body: "Couples, small families and sharers who want a branded address on the island. For many buyers it is also the layout that is easiest to let, because it serves both individuals and small households." },
      { heading: "What to check", body: "The bedroom sizes and whether both have bathrooms, the storage, the position of the terrace, and the floor and view. Ask for the plan of the exact unit rather than a typical plan." },
      { heading: "Family practicalities", body: "Al Maryah Island has healthcare on the island, but families should check school options and the commute for their situation. Our Al Maryah Island guide covers schools and daily life." },
      { heading: "Compare", body: "Compare against two bedroom homes at W Residences and Al Maryah Vista 2, on handover, service charge and how each project is managed." },
    ],
    faq: [
      { question: "Does Jumeirah Residences have two bedroom apartments?", answer: "Yes, within the one to four bedroom apartment range Emirates Developments lists." },
      { question: "Is a two bedroom eligible for the Golden Visa?", answer: "It can be, if the unit's price reaches AED 2,000,000. Confirm the exact figure." },
      { question: "Can I see a floor plan?", answer: "AD Residences can request the plan for a specific unit from the developer." },
    ],
  }),
  page({
    slug: "jumeirah-residences-al-maryah-island-penthouse",
    title: "Penthouses at Jumeirah Residences Al Maryah Island",
    description: "Five bedroom penthouses at Jumeirah Residences Al Maryah Island: what the developer lists, who buys penthouses, and what to ask about terraces, parking and service.",
    keywords: "Jumeirah Residences penthouse, penthouse Al Maryah Island, five bedroom penthouse Abu Dhabi, branded penthouse Abu Dhabi",
    headline: "Penthouses at Jumeirah Residences",
    subheadline: "The five bedroom homes at the top of the project.",
    intro: "Emirates Developments lists five bedroom penthouses at Jumeirah Residences. Penthouses are usually released last and in the smallest numbers, and each is priced individually, which makes the questions you ask more important than any typical figure.",
    sections: [
      { heading: "Who buys a penthouse", body: "Families who want the largest layout in the building, buyers who want the most private position, and investors who want a scarce unit. Penthouses are the hardest to compare, because no two are identical." },
      { heading: "What to ask", body: "The internal and terrace areas, the ceiling height, the number of parking spaces and storage rooms, whether a private lift lobby is included, and which services from the Jumeirah brand are included in the service charge." },
      { heading: "View and outlook", body: "A penthouse sells on its outlook. For an off-plan unit ask for the master plan, and confirm what can be built in front of the tower." },
      { heading: "Golden Visa", body: "A five bedroom penthouse is the layout most likely to clear the threshold comfortably, but confirm it for the exact unit. " + GOLDEN },
    ],
    faq: [
      { question: "How many bedrooms are the penthouses?", answer: "Emirates Developments lists five bedroom penthouses." },
      { question: "Are penthouses priced individually?", answer: "Typically yes. Ask for the price and floor plan of the exact unit." },
      { question: "Where else are penthouses in Abu Dhabi?", answer: "See our penthouses page for projects that list them." },
    ],
    extra: [{ label: "Penthouses for Sale in Abu Dhabi", href: "/penthouses-for-sale-abu-dhabi" }],
  }),
  page({
    slug: "jumeirah-residences-al-maryah-island-price",
    title: "Jumeirah Residences Al Maryah Island Price and Availability",
    description: "How pricing works at Jumeirah Residences Al Maryah Island, what Emirates Developments has published, and how to get the current price list for the unit you want.",
    keywords: "Jumeirah Residences price, Jumeirah Residences Al Maryah Island price list, how much Jumeirah Residences, Jumeirah Residences availability",
    headline: "Jumeirah Residences: Price and Availability",
    subheadline: "How the price is set, and how to get the current list.",
    intro: "Emirates Developments has not published a price list for Jumeirah Residences on its project page, and prices for off-plan homes are set unit by unit and can change with each release. Quoting a single number would be guesswork, so this page explains how the price is set and how to get the real one.",
    sections: [
      { heading: "What sets the price", body: "Layout and internal area, terrace area, floor, orientation and view, and the release the unit belongs to. Penthouses and the highest floors are priced individually." },
      { heading: "How to get the current list", body: "Ask for the availability and price list for the layouts you are considering, the payment plan that applies, and the reservation terms. AD Residences can request these from the developer on your behalf." },
      { heading: "Costs beyond the price", body: "Budget for the registration fee, any agency fee, and the annual service charge once the building is complete. Ask for the estimated service charge, because branded buildings usually cost more to run than non-branded ones." },
      { heading: "Be careful with quoted prices", body: "Figures on third-party sites can be out of date or refer to a single unit. Treat a price as real only when it comes with a written offer for a specific unit." },
    ],
    faq: [
      { question: "How much is Jumeirah Residences?", answer: "It depends on the unit. Emirates Developments has not published a price list, so ask for the price of the specific unit in writing." },
      { question: "Why do prices differ between websites?", answer: "Sites quote different units and dates. A price is only reliable when it is attached to a written offer." },
      golden,
    ],
  }),
  page({
    slug: "jumeirah-residences-al-maryah-island-review",
    title: "Jumeirah Residences Al Maryah Island Review: What Stands Out and What to Check",
    description: "An honest review of Jumeirah Residences Al Maryah Island: the strengths of the location and brand, and the points every buyer of an off-plan branded home should check.",
    keywords: "Jumeirah Residences review, is Jumeirah Residences a good investment, Jumeirah Residences pros and cons, Jumeirah Residences Al Maryah Island honest review",
    headline: "Jumeirah Residences: An Honest Review",
    subheadline: "What stands out, and what to check.",
    intro: "This is a buyer-side view. AD Residences advises buyers, and we point out what to verify as clearly as what is attractive. Everything below rests on what the developer has stated or on what is generally true of off-plan branded homes.",
    sections: [
      { heading: "What stands out", body: "The location is the main point: Al Maryah Island is the home of ADGM, with The Galleria and Cleveland Clinic Abu Dhabi on the island. The brand partner is Jumeirah, and the developer describes wellness experiences, private dining, concierge, floating terraces and an elevated pool." },
      { heading: "What to check", body: "The developer has not published prices, sizes, a payment plan or a handover date, so all four need to be confirmed in writing. Also check the estimated service charge, the developer's completed projects, and the SPA's terms on delay and on resale before handover." },
      { heading: "Off-plan realities", body: "You will wait for handover, you will hold an Oqood registration rather than a title deed until then, and you earn no rent during construction. That is normal for off-plan, but it should be priced into the decision." },
      { heading: "Who it suits", body: "Buyers who value a branded building on the island and can accept an off-plan timeline. Buyers who want to rent immediately may prefer a ready building on the island." },
    ],
    faq: [
      { question: "Is Jumeirah Residences a good investment?", answer: "That depends on the unit, its price, the payment plan and your horizon. We can help you compare it with other Al Maryah Island options." },
      { question: "What are the main risks?", answer: "Handover delay, cost of service charges in a branded building, and limited resale before handover." },
      developerFaq,
    ],
  }),
  page({
    slug: "jumeirah-residences-investment-case",
    title: "Jumeirah Residences Investment Case: How to Build One",
    description: "Building the investment case for Jumeirah Residences Al Maryah Island: the questions to answer on price, rent, service charge, handover and exit before you commit.",
    keywords: "Jumeirah Residences investment case, invest in Jumeirah Residences, branded residence investment Abu Dhabi",
    headline: "Building the Investment Case for Jumeirah Residences",
    subheadline: "The five questions to answer with real numbers.",
    intro: "An investment case is a set of numbers, and the numbers for Jumeirah Residences have to come from the developer and from current rents, not from a page like this one. Here are the five questions to answer before you commit.",
    sections: [
      { heading: "1. What is the price of this exact unit?", body: "Get a written price for the specific unit, with the payment schedule attached." },
      { heading: "2. What will it rent for?", body: "Ask for current rents of comparable homes on Al Maryah Island, for example in ready buildings, and remember the unit will not earn rent until handover." },
      { heading: "3. What will it cost to hold?", body: "Ask for the estimated service charge and any fees for management or for using brand services." },
      { heading: "4. When will it be handed over?", body: "The developer has not published a handover date on its project page. Ask for the date and for the remedy if it slips." },
      { heading: "5. How will you exit?", body: "Ask what the SPA says about selling before handover, and compare it with the resale market for ready homes on the island." },
    ],
    faq: [{ question: "Where do I get the numbers?", answer: "From the developer for price, payment plan and handover, and from current listings and agents for rents. AD Residences can help you gather both." }, developerFaq, golden],
    extra: [{ label: "Jumeirah Residences Investment Return", href: `${P}-investment-return` }],
  }),
  page({
    slug: "jumeirah-residences-vs-al-reem-island",
    title: "Jumeirah Residences vs Al Reem Island: Two Different Ways to Buy in Abu Dhabi",
    description: "Comparing Jumeirah Residences on Al Maryah Island with buying on Al Reem Island: size of market, building age, off-plan versus ready, and who each suits.",
    keywords: "Jumeirah Residences vs Al Reem Island, Al Maryah Island vs Al Reem Island, branded vs non-branded Abu Dhabi",
    headline: "Jumeirah Residences vs Al Reem Island",
    subheadline: "A branded off-plan project against Abu Dhabi's largest freehold market.",
    intro: "This is not a like-for-like comparison. Jumeirah Residences is one off-plan branded project on a small island, while Al Reem Island is a large market of completed towers with a few off-plan projects. The choice is really between a specific branded product and a broad, liquid market.",
    sections: [
      { heading: "Market size", body: "Al Reem Island is the largest freehold residential market in Abu Dhabi, with communities such as Shams Abu Dhabi, Marina Square, City of Lights, Makers District and Najmat. Al Maryah Island has only a handful of residential projects." },
      { heading: "Off-plan against ready", body: "Jumeirah Residences is off-plan. Most of Al Reem Island is ready, so you can view, finance and rent a home within weeks. Reem Hills and Elie Saab Waterfront are the off-plan alternatives on Al Reem Island." },
      { heading: "Brand against choice", body: "The Jumeirah brand brings hospitality services to the building. Al Reem Island offers far more choice of building, size and price, but no comparable hotel-branded service in the older towers." },
      { heading: "Who each suits", body: "Jumeirah Residences suits buyers who want the brand, the island and an off-plan timeline. Al Reem Island suits buyers who want choice, a lower entry price or an immediate rental." },
    ],
    faq: [{ question: "Which is better for rental income?", answer: "Ready buildings earn immediately, and Al Reem Island has many. An off-plan branded home earns nothing until handover." }, developerFaq, { question: "Can foreigners buy on both islands?", answer: FREEHOLD }],
    cards: cardsFor("jumeirah-residences-al-maryah-island", "reem-hills", "elie-saab-waterfront-al-reem-island", "the-gate-towers-shams-abu-dhabi"),
    extra: [{ label: areas["al-reem-island"].pillar.label, href: areas["al-reem-island"].pillar.href }, { label: "Al Maryah Island vs Al Reem Island", href: "/al-maryah-island-vs-al-reem-island" }],
  }),
  page({
    slug: "emirates-developments-jumeirah-residences",
    title: "Emirates Developments and Jumeirah Residences: The Developer Explained",
    description: "Who Emirates Developments is, what it is building in Abu Dhabi alongside Jumeirah Residences, and how to check a developer before you buy off-plan.",
    keywords: "Emirates Developments, Emirates Developments Abu Dhabi, Emirates Developments Jumeirah Residences, Hilton Residences Al Raha developer",
    headline: "Emirates Developments and Jumeirah Residences",
    subheadline: "The developer behind Jumeirah Residences, and how to check any developer.",
    intro: "Jumeirah Residences Al Maryah Island is developed by Emirates Developments in partnership with Jumeirah. The developer's own website lists three Abu Dhabi projects: Jumeirah Residences on Al Maryah Island, Hilton Residences Al Raha, and Stellar by Elie Saab on Yas Island.",
    sections: [
      { heading: "The Abu Dhabi projects", body: "Jumeirah Residences on Al Maryah Island is branded by Jumeirah. Hilton Residences Al Raha offers one to four bedroom apartments and three to five bedroom townhouses on the Al Raha shoreline. Stellar by Elie Saab on Yas Island offers garden villas and signature apartments. All three carry a hospitality or fashion brand." },
      { heading: "How to check a developer", body: "Ask what the developer has completed and handed over, visit finished buildings if there are any, read the SPA for delay and assignment terms, and confirm that payments go into an escrow account." },
      { heading: "Brand partner and developer", body: "The brand partner sets the service and design standard, but the developer builds and delivers the project. Assess both separately." },
    ],
    faq: [developerFaq, { question: "What other projects does Emirates Developments have in Abu Dhabi?", answer: "Hilton Residences Al Raha and Stellar by Elie Saab on Yas Island, according to its website." }, { question: "How do I check a developer?", answer: "Look at completed and delivered projects, the SPA terms and the escrow arrangements." }],
    cards: cardsFor("jumeirah-residences-al-maryah-island", "hilton-residences-al-raha", "stellar-by-elie-saab-yas-island"),
  }),
  page({
    slug: "jumeirah-residences-vs-waldorf-astoria-residences-abu-dhabi",
    title: "Jumeirah Residences vs Waldorf Astoria Residences Abu Dhabi | Branded Comparison",
    description: "Jumeirah Residences on Al Maryah Island compared with Waldorf Astoria Residences on Yas Island: developer, location, brand and what each offers.",
    keywords: "Jumeirah Residences vs Waldorf Astoria Abu Dhabi, Waldorf Astoria Residences Yas Island, branded residences comparison Abu Dhabi",
    headline: "Jumeirah Residences vs Waldorf Astoria Residences",
    subheadline: "Two branded projects on two different islands.",
    intro: "Waldorf Astoria Residences is on Yas Island, beside the Yas Links Golf Course, and is developed by Aldar with Hilton. Jumeirah Residences is on Al Maryah Island and is developed by Emirates Developments with Jumeirah. They are often compared, but they sit in different districts and serve different lifestyles.",
    sections: [
      { heading: "Location", body: "Al Maryah Island is the financial district and the home of ADGM, with The Galleria and Cleveland Clinic Abu Dhabi. Yas Island is Abu Dhabi's leisure island, home to Yas Marina Circuit and Yas Links Golf Course." },
      { heading: "Developer and brand", body: "Jumeirah Residences: Emirates Developments with Jumeirah. Waldorf Astoria Residences: Aldar with Hilton's Waldorf Astoria brand, announced as Abu Dhabi's first Waldorf Astoria branded residences." },
      { heading: "What each offers", body: "Jumeirah lists one to four bedroom apartments and five bedroom penthouses. Waldorf Astoria offers furnished apartments and penthouses with golf course and circuit views." },
      { heading: "Who each suits", body: "Jumeirah suits buyers who want to be on the financial island. Waldorf Astoria suits buyers who want leisure, golf and circuit views on Yas." },
    ],
    faq: [{ question: "Where is Waldorf Astoria Residences in Abu Dhabi?", answer: "On Yas Island, along the Yas Links Golf Course." }, developerFaq, { question: "Which is better?", answer: "They serve different buyers. Compare location, handover, service charge and the brand's services for your use." }],
    cards: cardsFor("jumeirah-residences-al-maryah-island", "waldorf-astoria-residences-yas-island"),
  }),
  page({
    slug: "jumeirah-residences-vs-nobu-residences-abu-dhabi",
    title: "Jumeirah Residences vs Nobu Residences Abu Dhabi | Which Branded Project to Buy?",
    description: "Jumeirah Residences on Al Maryah Island compared with Nobu Residences on Saadiyat Island: location, developer, size of the collection and what each offers.",
    keywords: "Jumeirah Residences vs Nobu Residences Abu Dhabi, Nobu Residences Saadiyat, branded apartments comparison Abu Dhabi",
    headline: "Jumeirah Residences vs Nobu Residences",
    subheadline: "A financial-island tower against a small beachfront collection.",
    intro: "Nobu Residences is a limited collection of 88 residences on the beachfront at Mamsha Al Saadiyat, developed by Aldar. Jumeirah Residences is a larger tower on Al Maryah Island, developed by Emirates Developments with Jumeirah. The contrast is location, scale and brand.",
    sections: [
      { heading: "Location", body: "Nobu Residences is on Saadiyat Island, near the Louvre Abu Dhabi and the Zayed National Museum. Jumeirah Residences is on Al Maryah Island, near ADGM, The Galleria and Cleveland Clinic Abu Dhabi." },
      { heading: "Scale", body: "Nobu is limited to 88 residences, including apartments, two bedroom lofts, penthouses and sky villas. Jumeirah lists one to four bedroom apartments and five bedroom penthouses." },
      { heading: "Brand", body: "Nobu is a restaurant and hospitality brand. Jumeirah is a hotel brand, with wellness, dining and concierge described by the developer." },
      { heading: "Who each suits", body: "Nobu suits buyers who want a small beachfront collection on Saadiyat. Jumeirah suits buyers who want the financial island." },
    ],
    faq: [{ question: "Where is Nobu Residences in Abu Dhabi?", answer: "On the beachfront at Mamsha Al Saadiyat, Saadiyat Island." }, developerFaq, { question: "How many homes are in Nobu Residences?", answer: "About 88 residences." }],
    cards: cardsFor("jumeirah-residences-al-maryah-island", "nobu-residences-saadiyat-island"),
  }),
  page({
    slug: "jumeirah-residences-vs-four-seasons-residences-abu-dhabi",
    title: "Jumeirah Residences vs Four Seasons Private Residences Abu Dhabi | Comparison",
    description: "Jumeirah Residences on Al Maryah Island compared with Four Seasons Private Residences at Saadiyat Beach: tower or villa, developer, location and scale.",
    keywords: "Jumeirah Residences vs Four Seasons Residences Abu Dhabi, Four Seasons Private Residences Saadiyat Beach, luxury residences comparison Abu Dhabi",
    headline: "Jumeirah Residences vs Four Seasons Private Residences",
    subheadline: "A tower on the financial island against a gated beachfront villa community.",
    intro: "Four Seasons Private Residences Abu Dhabi at Saadiyat Beach is a standalone, gated beachfront community of villas, beach mansions, suites and penthouses, announced by Four Seasons and ALAIN. Jumeirah Residences is a tower project on Al Maryah Island. They are different products for different buyers.",
    sections: [
      { heading: "Product", body: "Four Seasons offers five and six bedroom villas in four collections (Golf, Garden, Sea and Royal), plus beach mansions, suites and penthouses. Jumeirah offers one to four bedroom apartments and five bedroom penthouses." },
      { heading: "Location", body: "Saadiyat Beach is the first shoreline of Saadiyat Island. Al Maryah Island is the financial district. The Four Seasons Hotel is on Al Maryah Island, but the Private Residences are at Saadiyat Beach." },
      { heading: "Timeline", body: "Four Seasons announced a handover in 2029. Jumeirah Residences has not published a handover date." },
      { heading: "Who each suits", body: "Four Seasons suits buyers of a private villa or mansion. Jumeirah suits buyers who want an apartment or penthouse on the financial island." },
    ],
    faq: [{ question: "Are Four Seasons Private Residences on Al Maryah Island?", answer: "No. They are at Saadiyat Beach on Saadiyat Island. The Four Seasons Hotel is on Al Maryah Island." }, developerFaq, { question: "Who develops the Four Seasons residences?", answer: "ALAIN, an Abu Dhabi asset management company, announced them with Four Seasons." }],
    cards: cardsFor("jumeirah-residences-al-maryah-island", "four-seasons-private-residences-saadiyat-beach"),
  }),
];
