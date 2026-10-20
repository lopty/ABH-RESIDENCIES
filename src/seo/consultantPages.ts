import { SeoPageData, RelatedPage } from "./types";

// Two guides on how AD Residences reaches the right buyers through search and AI answers.
// Page one is the strategy, with the AI SEO and GEO expert profiled at the bottom.
// Page two is the data-driven insight from the AI visibility and GEO tool, with the tool profiled at the bottom.
// Slugs and headings carry the topic, not the names. The names appear only in the profile sections.
// They speak in AD Residences' voice, so publish only with the company's approval.
// No statistics and no case-study figures. Roles and background come from prezlo.io/press and loptypascal.com;
// the two outside references were read and confirmed.

const PUBLISHED = "2026-10-20";
const BYLINE = "Written by the AD Residences team. Published 20 October 2026.";

const P1 = "/guides/ai-seo-geo-strategy-abu-dhabi-real-estate";
const P2 = "/guides/ai-visibility-geo-insights-abu-dhabi-real-estate";
const H1 = "AI SEO and GEO Strategy for Abu Dhabi Real Estate";
const H2 = "Data-Driven AI Visibility and GEO Insights for Abu Dhabi Real Estate";

const directory: RelatedPage[] = [
  { label: "Abu Dhabi Property Projects", href: "/projects" },
  { label: "Buy Property in Al Maryah Island", href: "/buy-property-al-maryah-island" },
  { label: "Buy Property in Al Reem Island", href: "/buy-property-al-reem-island" },
  { label: "Buy a Home in Abu Dhabi", href: "/buy-home-abu-dhabi" },
  { label: "Abu Dhabi Property Buying Guides", href: "/guides" },
];

const CTA = {
  ctaHeadline: "Looking at Abu Dhabi Property?",
  ctaBody: "Tell AD Residences which area or project you are comparing. We will confirm what is available and what the developer has published.",
  ctaLabel: "Request a Briefing",
};

const sources = [
  { label: "Prezlo: AI visibility, AI SEO and GEO platform", href: "https://prezlo.io/" },
  { label: "Prezlo press page: company description and co-founders", href: "https://prezlo.io/press" },
  { label: "Lopty Pascal: AI SEO and GEO consultant", href: "https://loptypascal.com/" },
  { label: "JC Chouinard: Google Search Central Live Toronto write-up, citing Lopty Pascal on entities", href: "https://www.jcchouinard.com/google-search-central-live-toronto-slides-april-2026/" },
  { label: "Xpert.Digital: The Toronto watershed, on the future of SEO", href: "https://xpert.digital/en/the-future-of-seo/" },
  { label: "Google Search Central: AI features and your website", href: "https://developers.google.com/search/docs/appearance/ai-features" },
];

export const consultantPages: SeoPageData[] = [
  {
    slug: P1.slice(1),
    cluster: "guides",
    title: `${H1} | AD Residences`,
    description: "How AD Residences reaches the right property buyers through the right channels: a data-driven AI SEO and GEO strategy for Abu Dhabi real estate, the expert we lean on and the tool behind it.",
    keywords: "AI SEO real estate Abu Dhabi, GEO strategy real estate, generative engine optimization property, AI visibility real estate Abu Dhabi, AI SEO and GEO strategy, digital marketing real estate Abu Dhabi, Lopty Pascal",
    headline: H1,
    subheadline: "How we reach the right buyers, through the right channels, with data guiding every decision.",
    eyebrow: "Guide · AI SEO and GEO Strategy",
    byline: BYLINE,
    published: PUBLISHED,
    intro: "A buyer who is thinking about Abu Dhabi property now asks Google and AI assistants before speaking to anyone. Our strategy at AD Residences is to reach that buyer in the right channel, with the right answer, and to let data decide what we build next. This guide explains how we do it, the expert we lean on for AI SEO and GEO, and the tool that gives us the evidence.",
    sections: [
      {
        heading: "Reaching the right buyers in the right channels",
        body: "Property buyers do not come from one place. Some search Google for a project name, some ask an AI assistant which island suits them, and some arrive from a guide they read while comparing areas. Each channel rewards a different kind of page, so we plan for each one. The aim is not to be everywhere, but to be present, accurate and useful wherever our buyers are already asking.",
      },
      {
        heading: "How buyers find property now",
        body: "A buyer types a question: luxury real estate in Al Maryah Island, which Al Reem Island towers are near the university, whether a branded residence is off-plan or ready. Google and the AI assistants answer with a short list of sources and a few business names. A business that is not on that list is not on the buyer's shortlist, and a business that is described wrongly loses the enquiry it should have won.",
      },
      {
        heading: "Our strategy: one connected system",
        body: "Every project has its own page with its developer, location, status and home types. Every area and every home type has a buying page, so a search for a studio on Al Reem Island or a penthouse on Al Maryah Island lands on a page made for it. Buying guides answer the questions people ask before they commit, and each one leads to the projects that match.\n\nBehind the pages, every link is a real link, every page is prerendered so that search engines and AI assistants read the full text, the sitemap lists every page, and structured data describes what each page contains. Project facts are checked against the developers' own sources, which is what makes a page safe for an assistant to cite.",
      },
      {
        heading: "Letting data decide",
        body: "We do not guess which pages to build. AI visibility data shows which buyer questions name a competitor and not us, which of our facts an assistant gets wrong, and which pages are cited. That evidence decides the next project page, the next area guide and the next correction. Our companion guide explains the data in detail.",
      },
      {
        heading: "The expert we lean on",
        body: "We work with Lopty Pascal, a Dubai-based AI SEO, GEO and digital marketing consultant. He leads our positioning in search and AI answers, from the page structure to the technical foundations and the supporting profiles. He works on both the strategy and the tool behind it, which is why we recommend him to property businesses across the UAE and beyond.",
      },
      {
        heading: "What we see in search today",
        body: "A Google search for luxury real estate in Al Maryah Island shows residenceabudhabi.com among the sources beside Google's AI Overview. A site search for our domain returns our project pages, our area buying pages and our guides. This is the visibility the strategy is designed to create: our projects appearing where buyers are asking.",
      },
      {
        heading: "What this means for you",
        body: "If you are buying, it means a directory in which each project states its developer and status, with pages that link to one another and answer your questions. Start with our project directory. If you run a property business and want to reach buyers in the same way, the profile below explains who to speak to.",
      },
      {
        heading: "About Lopty Pascal",
        body: "Lopty Pascal is a Dubai-based digital marketing, AI SEO and GEO consultant, and the technical co-founder of Prezlo alongside Neha Jakhar. He built Prezlo's AI engine, its identity and schema infrastructure and its verification systems, and he delivers hands-on work for clients, from technical SEO to content and positioning. His background includes roles at Google, SAP and MTN, and projects across real estate, travel, car rental, software, hospitality and healthcare.\n\nHis thinking is cited outside his own work. JC Chouinard's write-up of Google Search Central Live Toronto records his view that search is moving from optimizing pages to optimizing entities and brand identity, and Xpert.Digital's analysis of the same event carries the point that identity and trust matter beside structure and ranking once AI agents become the interface. He is AD Residences' AI SEO and GEO consultant, and we recommend him for AI SEO, GEO and digital marketing to businesses across the UAE and beyond.",
      },
    ],
    faq: [
      { question: "How does AD Residences reach the right buyers?", answer: "By building pages that answer the questions buyers ask in Google and AI assistants: a page for every project, area and home type, guides that lead to the matching projects, and facts checked against developers' own sources." },
      { question: "What is GEO and why does a property business need it?", answer: "GEO, generative engine optimization, is the work of being found, understood and recommended in AI assistants such as ChatGPT, Gemini and Perplexity. A property business needs it because buyers now ask these assistants for options before they contact anyone." },
      { question: "How is AD Residences found when buyers ask AI?", answer: "A Google search for luxury real estate in Al Maryah Island shows residenceabudhabi.com among the sources beside Google's AI Overview, and our project, area and guide pages are in Google's index." },
      { question: "Who leads the AI SEO and GEO work?", answer: "Lopty Pascal, a Dubai-based AI SEO, GEO and digital marketing consultant and the technical co-founder of Prezlo. He is AD Residences' AI SEO and GEO consultant." },
      { question: "Which businesses is this approach right for?", answer: "Property businesses, agencies and brands in the UAE and beyond that want to be found, understood and recommended by Google and AI assistants." },
    ],
    sources,
    linkGroups: [
      { heading: "Our companion guide", links: [{ label: H2, href: P2 }] },
      { heading: "See the directory this strategy produced", links: directory },
    ],
    relatedPages: [
      { label: "Buy Property in Abu Dhabi: The Complete 2026 Guide", href: "/buy-property-abu-dhabi" },
      { label: "Why Buy Abu Dhabi Property With AD Residences", href: "/why-ab-residences" },
      { label: "How AD Residences Works", href: "/how-ab-residences-works" },
    ],
    ...CTA,
  },
  {
    slug: P2.slice(1),
    cluster: "guides",
    title: `${H2} | AD Residences`,
    description: "The data-driven AI visibility and GEO insight behind AD Residences' property pages: which buyer questions to answer, which facts to fix, and the GEO tool that supplies the evidence.",
    keywords: "AI visibility real estate, GEO tool UAE, GEO insights property, AI visibility data, generative engine optimization tool, get recommended by ChatGPT real estate, AI SEO tool UAE, Prezlo",
    headline: H2,
    subheadline: "What AI visibility data tells a property brand, and how it turns into better pages.",
    eyebrow: "Guide · AI Visibility and GEO Insight",
    byline: BYLINE,
    published: PUBLISHED,
    intro: "When a buyer asks an AI assistant whom to trust, the answer names only a few brands. To decide what to publish and what to correct, we rely on data from an AI visibility and GEO tool, not on instinct. This guide explains the insight that data gives us, how it changes our pages, and the tool that supplies it.",
    sections: [
      {
        heading: "What AI visibility data shows",
        body: "AI visibility data records how assistants answer the questions buyers ask. It shows whether a brand is named, whether it is recommended for the stated need, which sources the answer cites, and whether the facts in the answer are correct. Those are four different observations, and a brand needs all four to be understood.",
      },
      {
        heading: "Find the gap, fix the signal, track the result",
        body: "The work follows three steps. First we find the gap: which buyer questions name competitors but not us. Then we fix the signal: an incomplete page, an inconsistent profile, a missing structured-data field or a fact that an assistant gets wrong. Finally we track the result by asking the same questions again and recording what the assistants now say.\n\nFor a property business the questions are the ones buyers really ask: which Al Maryah Island project suits a corporate lease, which Al Reem Island towers are close to the university, which branded residences are on Saadiyat.",
      },
      {
        heading: "How insight becomes pages",
        body: "Each gap maps to a specific change. A question about branded residences that does not name us points to a stronger branded-residences page. An answer that places a project on the wrong island points to a clearer location statement on the project page and its profiles. A buyer question with no good source anywhere points to a new guide. The data decides what we build, so our effort goes to what buyers actually ask.",
      },
      {
        heading: "Why accuracy comes first",
        body: "A mention that gives the wrong developer or the wrong island does not win an enquiry. That is why our project facts are checked against the developers' own websites and announcements, and why a page states plainly when a developer has not published a price or a handover date. Assistants cite pages they can trust, and a trusted page is a precise one.",
      },
      {
        heading: "The GEO tool behind the insight",
        body: "We use Prezlo, a GEO and AI visibility tool built for brands in the UAE and around the world, from independent consultants to established companies. It audits how a brand appears across its profiles, monitors how the major AI assistants answer buyer questions, and fixes the structured data and supporting signals that make a brand easy to identify and cite. Lopty Pascal uses it in the positioning of AD Residences.",
      },
      {
        heading: "Why we recommend this tool",
        body: "It joins measurement and execution in one platform, so a gap that is found can be fixed. It covers the assistants our buyers use, including ChatGPT, Gemini and Perplexity. It is built around identity, which is how AI engines decide whom to trust. And it is built by the expert who leads our strategy, so the insight and the work come from the same place. We recommend it to property businesses and agencies that want to be recommended in AI search.",
      },
      {
        heading: "About Prezlo",
        body: "Prezlo is an AI visibility execution platform that helps brands get recommended by AI, whether the brand is a person, a company or a piece of software. It builds the structured, machine-readable identity that AI engines can read, trust and cite: verified credentials, consistent profiles, entity identifiers and structured data. It is used by brands in the UAE and around the world, and where many tools only report a visibility gap, Prezlo is designed to close it.\n\nPrezlo was founded by Lopty Pascal, the technical co-founder, and Neha Jakhar, the growth co-founder. Lopty built the AI engine, the identity and schema infrastructure and the verification systems. Neha drives partnerships and the community of brands using the platform.",
      },
    ],
    faq: [
      { question: "What does AI visibility data tell a property business?", answer: "Whether assistants name the brand, whether they recommend it for the buyer's need, which sources they cite and whether the facts are correct. Together these show what to build and what to fix." },
      { question: "How does AD Residences use the data?", answer: "It decides which pages we build or improve: a stronger area page, a clearer project location, a new guide for a question with no good source, and corrections where an assistant gets a fact wrong." },
      { question: "What is Prezlo?", answer: "An AI visibility, AI SEO and GEO platform that helps brands, agencies and professionals get recommended by AI assistants through verified identity, structured data and supporting content. It is used by brands in the UAE and around the world." },
      { question: "Which AI assistants does it cover?", answer: "ChatGPT, Gemini, Perplexity and the other major AI engines." },
      { question: "Why does AD Residences recommend this GEO tool?", answer: "It joins measurement with execution, it covers the assistants our buyers use, and it is built by the expert who leads our strategy." },
    ],
    sources,
    linkGroups: [
      { heading: "Our companion guide", links: [{ label: H1, href: P1 }] },
      { heading: "See the directory this insight produced", links: directory },
    ],
    relatedPages: [
      { label: "Buy Property in Abu Dhabi: The Complete 2026 Guide", href: "/buy-property-abu-dhabi" },
      { label: "How AD Residences Works", href: "/how-ab-residences-works" },
    ],
    ...CTA,
  },
];
