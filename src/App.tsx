import React, { useState, useEffect, useRef, FormEvent } from "react";
import { 
  Menu, 
  X, 
  Phone, 
  MessageCircle, 
  MapPin, 
  Bed, 
  Bath, 
  Maximize2, 
  ArrowRight, 
  Check, 
  ChevronDown, 
  ChevronLeft, 
  ChevronRight, 
  Loader2, 
  Building2, 
  Clock, 
  DollarSign, 
  SlidersHorizontal,
  ThumbsUp,
  Award,
} from "lucide-react";

import { propertiesData, statItems, lifestyleItems } from "./data";
import { faqItems } from "./blogData";
import { Property, LeadFormData } from "./types";

// Dynamic sub-page modules
import FAQPage from "./components/FAQPage";
import AboutPage from "./components/AboutPage";
import ContactPage from "./components/ContactPage";
import BlogPage from "./components/BlogPage";
import JumeirahResidencesPage from "./components/JumeirahResidencesPage";
import AlMaryahIslandPage from "./components/AlMaryahIslandPage";
import BuyPage from "./components/BuyPage";
import AdminPanel from "./components/AdminPanel";
import InterestPopup from "./components/InterestPopup";
import LandingPage from "./components/LandingPage";
import SeoPage from "./components/SeoPage";
import { seoPageMap } from "./seo/index";

const WHATSAPP_NUMBER = "971554226593";

async function submitLeadToAPI(data: Record<string, any>) {
  try {
    await fetch("/api/submit-lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  } catch (_) {
    console.log("[Lead]", data);
  }
}

export default function App() {
  // --- CORE SYSTEM ROUTING ---
  const [currentPath, setCurrentPath] = useState<string>("/");
  const [blogSlug, setBlogSlug] = useState<string>("");

  useEffect(() => {
    // Setup initial path and popstate synchronization
    const handleLocationChange = () => {
      let pathname = window.location.pathname;
      // Normalize trailing slash
      if (pathname.length > 1 && pathname.endsWith("/")) {
        pathname = pathname.slice(0, -1);
      }
      
      // Check for deep blog slugs e.g., /blog/some-post-slug
      if (pathname.startsWith("/blog/") && pathname.length > 6) {
        setBlogSlug(pathname.slice(6));
        setCurrentPath("/blog");
      } else {
        setBlogSlug("");
        setCurrentPath(pathname || "/");
      }

      // Smooth scroll to top instantly on routing
      window.scrollTo({ top: 0, behavior: "instant" });
      setIsMobileMenuOpen(false);
    };

    window.addEventListener("popstate", handleLocationChange);
    // Trigger on boot
    handleLocationChange();

    return () => {
      window.removeEventListener("popstate", handleLocationChange);
    };
  }, []);

  // Standard safe navigator helper
  const navigate = (path: string) => {
    let normalized = path;
    if (normalized.length > 1 && normalized.endsWith("/")) {
      normalized = normalized.slice(0, -1);
    }
    window.history.pushState({}, "", normalized);
    
    // Trigger manual popstate listeners
    if (normalized.startsWith("/blog/") && normalized.length > 6) {
      setBlogSlug(normalized.slice(6));
      setCurrentPath("/blog");
    } else {
      setBlogSlug("");
      setCurrentPath(normalized || "/");
    }
    window.scrollTo({ top: 0, behavior: "instant" });
    setIsMobileMenuOpen(false);
  };

  // --- GENERAL STATE & DIALOGS ---
  const [isHeaderScrolled, setIsHeaderScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Custom property detail state
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isCallbackModalOpen, setIsCallbackModalOpen] = useState(false);
  const [callbackNumber, setCallbackNumber] = useState("");
  const [callbackSubmitted, setCallbackSubmitted] = useState(false);
  const [callbackError, setCallbackError] = useState(false);

  // Property Modal Form lead state
  const [propertyFormData, setPropertyFormData] = useState({
    name: "",
    email: "",
    phone: "",
    consent: true
  });
  const [propertyFormErrors, setPropertyFormErrors] = useState<Record<string, boolean>>({});
  const [isSubmittingPropertyLead, setIsSubmittingPropertyLead] = useState(false);
  const [isSubmitPropertyLeadSuccess, setIsSubmitPropertyLeadSuccess] = useState(false);

  // General Consultation form state (for contact / homepage forms)
  const [generalFormData, setGeneralFormData] = useState<LeadFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    nationality: "",
    budgetRange: "",
    propertyInterest: "",
    message: "",
    consent: true,
  });
  const [generalFormErrors, setGeneralFormErrors] = useState<Record<string, boolean>>({});
  const [isSubmittingGeneral, setIsSubmittingGeneral] = useState(false);
  const [isSubmitGeneralSuccess, setIsSubmitGeneralSuccess] = useState(false);

  // Search logic state (passed to BuyPage)
  const [searchType, setSearchType] = useState<string>("");
  const [searchLocation, setSearchLocation] = useState<string>("");
  const [searchBudget, setSearchBudget] = useState<string>("");
  const [allProperties, setAllProperties] = useState<Property[]>(propertiesData);
  const allPropertiesRef = useRef<Property[]>(propertiesData);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>(propertiesData);
  const [activeTab, setActiveTab] = useState<string>("All");

  // Fetch properties from DB on mount; fall back to static if DB is empty
  useEffect(() => {
    (async () => {
      try {
        const r = await fetch("/api/properties");
        if (r.ok) {
          const data = await r.json();
          if (Array.isArray(data) && data.length > 0) {
            const mapped: Property[] = data.map((p: any) => ({
              id: p.id,
              name: p.name,
              location: p.location,
              price: p.price,
              priceNumeric: p.price_numeric || 0,
              type: p.type,
              area: p.area,
              badge: p.badge,
              image: p.image_url || "",
              bedrooms: p.bedrooms || 1,
              bathrooms: p.bathrooms || 1,
              sizeSqFt: p.size_sqft || 0,
              description: p.description || "",
            }));
            allPropertiesRef.current = mapped;
            setAllProperties(mapped);
            setFilteredProperties(mapped);
          }
        }
      } catch (_) {}
    })();
  }, []);

  // Comprehensive SEO — per-route meta, OG/Twitter, JSON-LD structured data
  useEffect(() => {
    const SITE = "https://residenceabudhabi.com";
    const heroImg = `${SITE}/jumeirah-hero.png`;

    // ── Helpers ──────────────────────────────────────────────────────────────
    const setMeta = (selector: string, val: string) => {
      let el = document.querySelector(selector) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        const m = selector.match(/\[([a-z:_-]+)="([^"]+)"\]/);
        if (m) el.setAttribute(m[1], m[2]);
        document.head.appendChild(el);
      }
      el.setAttribute("content", val);
    };
    const setLink = (rel: string, val: string) => {
      let el = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
      if (!el) { el = document.createElement("link"); el.setAttribute("rel", rel); document.head.appendChild(el); }
      el.setAttribute("href", val);
    };
    const setJsonLd = (id: string, data: object) => {
      let el = document.getElementById(id);
      if (!el) { el = document.createElement("script"); el.id = id; el.setAttribute("type", "application/ld+json"); document.head.appendChild(el); }
      el.textContent = JSON.stringify(data);
    };
    const breadcrumb = (items: { name: string; url: string }[]) => ({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": SITE },
        ...items.map((it, i) => ({ "@type": "ListItem", "position": i + 2, "name": it.name, "item": it.url }))
      ]
    });

    // ── Shared organisation entity ─────────────────────────────────────────
    const orgSchema = {
      "@context": "https://schema.org",
      "@type": "RealEstateAgent",
      "@id": `${SITE}/#organization`,
      "name": "AD Residences",
      "alternateName": "AD Residences",
      "url": SITE,
      "logo": `${SITE}/favicon.svg`,
      "image": heroImg,
      "telephone": "+971554226593",
      "email": "pranav@residenceabudhabi.com",
      "priceRange": "AED 3,000,000+",
      "address": { "@type": "PostalAddress", "streetAddress": "Al Maryah Island", "addressLocality": "Abu Dhabi", "addressCountry": "AE" },
      "areaServed": { "@type": "City", "name": "Abu Dhabi" },
      "openingHours": "Mo-Sa 09:00-19:00"
    };

    let title = "";
    let description = "";
    let keywords = "";
    let ogImage = heroImg;
    const path = currentPath;
    const canonicalUrl = `${SITE}${path === "/" ? "" : path}`;
    let schemas: object[] = [orgSchema];

    // ── Per-route SEO data ─────────────────────────────────────────────────
    if (path === "/") {
      title = "AD Residences | Luxury Real Estate Abu Dhabi – Jumeirah Residences Al Maryah Island";
      description = "AD Residences is Abu Dhabi's premium real estate gateway. Jumeirah Residences Al Maryah Island — branded waterfront residences, Golden Visa–eligible, off-plan investment. Book a private briefing.";
      keywords = "luxury real estate Abu Dhabi, Jumeirah Residences Al Maryah Island, off-plan property Abu Dhabi 2026, Golden Visa property UAE, branded residences Abu Dhabi, buy apartment Abu Dhabi";
      schemas = [{
        "@context": "https://schema.org",
        "@graph": [
          orgSchema,
          { "@type": "WebSite", "@id": `${SITE}/#website`, "url": SITE, "name": "AD Residences",
            "potentialAction": { "@type": "SearchAction", "target": `${SITE}/buy?q={search_term_string}`, "query-input": "required name=search_term_string" }
          }
        ]
      }];

    } else if (path === "/properties/jumeirah-residences") {
      title = "Jumeirah Residences Al Maryah Island Abu Dhabi | Prices, Floors & Availability";
      description = "Jumeirah Residences Al Maryah Island — ultra-luxury branded apartments & penthouses from AED 3M. Five-star hotel amenities, waterfront views, Golden Visa–eligible. Enquire with AD Residences.";
      keywords = "Jumeirah Residences Al Maryah Island, Jumeirah Residences Abu Dhabi price, Jumeirah Residences apartments for sale, buy Jumeirah Residences Abu Dhabi, Jumeirah branded residences UAE, Jumeirah Residences floor plan";
      schemas = [
        orgSchema,
        { "@context": "https://schema.org", "@type": "Apartment",
          "name": "Jumeirah Residences Al Maryah Island",
          "description": "Ultra-luxury branded residences on Al Maryah Island, Abu Dhabi, by Aldar Properties in partnership with Jumeirah Group. 1–4 bedroom apartments and penthouses.",
          "url": `${SITE}/properties/jumeirah-residences`,
          "image": heroImg,
          "address": { "@type": "PostalAddress", "streetAddress": "Al Maryah Island", "addressLocality": "Abu Dhabi", "addressCountry": "AE" },
          "geo": { "@type": "GeoCoordinates", "latitude": "24.4967", "longitude": "54.3779" },
          "offers": { "@type": "Offer", "priceCurrency": "AED", "price": "3000000", "availability": "https://schema.org/InStock" }
        },
        breadcrumb([{ name: "Jumeirah Residences", url: `${SITE}/properties/jumeirah-residences` }])
      ];

    } else if (path === "/properties/al-maryah-island") {
      title = "Al Maryah Island Abu Dhabi | Property Guide, Investment & Lifestyle";
      description = "Al Maryah Island — Abu Dhabi's premier financial and residential district. Luxury apartments, 7–8.5% rental yields, direct waterfront access. Expert guide by AD Residences.";
      keywords = "Al Maryah Island property for sale, buy apartment Al Maryah Island Abu Dhabi, Al Maryah Island real estate, Al Maryah Island rental yield, luxury properties Al Maryah Island, invest Al Maryah Island";
      schemas = [
        orgSchema,
        { "@context": "https://schema.org", "@type": "Place",
          "name": "Al Maryah Island", "description": "Abu Dhabi's premier financial hub and residential island, home to Jumeirah Residences, luxury hotels, and global financial institutions.",
          "geo": { "@type": "GeoCoordinates", "latitude": "24.4967", "longitude": "54.3779" },
          "address": { "@type": "PostalAddress", "streetAddress": "Al Maryah Island", "addressLocality": "Abu Dhabi", "addressCountry": "AE" }
        },
        breadcrumb([{ name: "Al Maryah Island", url: `${SITE}/properties/al-maryah-island` }])
      ];

    } else if (path === "/buy") {
      title = "Buy Luxury Property Abu Dhabi | Off-Plan & Ready Apartments | AD Residences";
      description = "Browse luxury apartments and penthouses for sale in Abu Dhabi. Off-plan and ready properties across Al Maryah Island & Jumeirah Residences. Talk to an AD Residences advisor today.";
      keywords = "buy luxury property Abu Dhabi, off-plan apartments Abu Dhabi 2026, ready properties Abu Dhabi, apartments for sale Abu Dhabi, luxury penthouses Abu Dhabi, best off-plan investment Abu Dhabi";
      schemas = [orgSchema, breadcrumb([{ name: "Buy Property", url: `${SITE}/buy` }])];

    } else if (path === "/faq") {
      title = "Abu Dhabi Real Estate FAQ | Foreigners, Golden Visa & Off-Plan | AD Residences";
      description = "Answers to buying property in Abu Dhabi as a foreigner: freehold zones, Golden Visa eligibility, off-plan payment plans, fees, and Jumeirah Residences. Expert Q&A by AD Residences.";
      keywords = "can foreigners buy property Abu Dhabi, Golden Visa UAE property AED 2 million, off-plan property Abu Dhabi explained, Abu Dhabi property buying fees 2026, freehold investment zones Abu Dhabi, Jumeirah Residences FAQ";
      schemas = [
        orgSchema,
        { "@context": "https://schema.org", "@type": "FAQPage",
          // Single source of truth shared with FAQPage.tsx — see src/blogData.ts's faqItems.
          "mainEntity": faqItems.map((item) => ({
            "@type": "Question", "name": item.question,
            "acceptedAnswer": { "@type": "Answer", "text": item.answer }
          }))
        },
        breadcrumb([{ name: "FAQ", url: `${SITE}/faq` }])
      ];

    } else if (path === "/about") {
      title = "About AD Residences | Abu Dhabi Luxury Real Estate Advisors";
      description = "Meet Pranav Chaudhary, AD Residences' lead advisor — Abu Dhabi's premier luxury real estate agency. Expert in Jumeirah Residences, Al Maryah Island, and Golden Visa property investment.";
      keywords = "Pranav Chaudhary real estate Abu Dhabi, AD Residences about, luxury real estate agency Abu Dhabi, Al Maryah Island property agency, Jumeirah Residences agent Abu Dhabi, real estate advisory UAE";
      schemas = [
        orgSchema,
        { "@context": "https://schema.org", "@type": "Person",
          "name": "Pranav Chaudhary", "jobTitle": "Real Estate Advisor",
          "worksFor": { "@id": `${SITE}/#organization` },
          "url": `${SITE}/about`, "image": `${SITE}/pranav-portrait.png`
        },
        breadcrumb([{ name: "About", url: `${SITE}/about` }])
      ];

    } else if (path === "/contact") {
      title = "Contact AD Residences | Book a Private Briefing in Abu Dhabi";
      description = "Get in touch with AD Residences on Al Maryah Island, Abu Dhabi. Book a private property briefing, arrange a viewing, or receive Golden Visa consultation. WhatsApp, call, or email.";
      keywords = "contact real estate agent Abu Dhabi, book property viewing Abu Dhabi, Golden Visa consultation Abu Dhabi, AD Residences contact, WhatsApp real estate Abu Dhabi";
      schemas = [orgSchema, breadcrumb([{ name: "Contact", url: `${SITE}/contact` }])];

    } else if (path === "/blog") {
      title = "Abu Dhabi Real Estate Blog | Market Insights & Investment Guides";
      description = "Expert insights on the Abu Dhabi property market. In-depth investment guides, area profiles, off-plan project news, and market analysis updated daily by AD Residences.";
      keywords = "Abu Dhabi real estate market 2026, off-plan investment Abu Dhabi, Al Maryah Island property news, Jumeirah Residences update, Abu Dhabi property prices 2026, real estate blog Abu Dhabi";
      schemas = [
        orgSchema,
        { "@context": "https://schema.org", "@type": "Blog",
          "name": "AD Residences Real Estate Blog", "url": `${SITE}/blog`,
          "publisher": { "@id": `${SITE}/#organization` },
          "description": "Daily AI-powered market insights and investment guides for Abu Dhabi real estate."
        },
        breadcrumb([{ name: "Blog", url: `${SITE}/blog` }])
      ];

    } else if (path === "/golden-visa-property-abu-dhabi") {
      title = "Golden Visa Property Abu Dhabi | AED 2M+ Eligible Homes | AD Residences";
      description = "Secure a UAE Golden Visa through Abu Dhabi property. AED 2M minimum, 10-year residency, freehold zones. Jumeirah Residences Al Maryah Island qualifies. Expert guidance by AD Residences.";
      keywords = "Golden Visa property Abu Dhabi, UAE Golden Visa real estate, buy property Golden Visa UAE 2026, AED 2 million Golden Visa, 10 year residency UAE property, Golden Visa Abu Dhabi eligibility, how to get Golden Visa UAE";
      schemas = [orgSchema, breadcrumb([{ name: "Golden Visa Property", url: `${SITE}/golden-visa-property-abu-dhabi` }])];

    } else if (path === "/off-plan-properties-abu-dhabi") {
      title = "Off-Plan Properties Abu Dhabi 2026 | New Launches & Payment Plans | AD Residences";
      description = "Invest in Abu Dhabi's top off-plan developments. Flexible payment plans, below-market launch prices, and high ROI. Abu Dhabi's leading agency for Al Maryah Island and Jumeirah Residences.";
      keywords = "off-plan property Abu Dhabi 2026, new off-plan launches Abu Dhabi, buy off-plan apartment Abu Dhabi, best off-plan projects Abu Dhabi, off-plan payment plan UAE, off-plan investment ROI Abu Dhabi";
      schemas = [orgSchema, breadcrumb([{ name: "Off-Plan Properties", url: `${SITE}/off-plan-properties-abu-dhabi` }])];

    } else if (path === "/branded-residences-abu-dhabi") {
      title = "Branded Residences Abu Dhabi | Jumeirah Five-Star Managed Homes | AD Residences";
      description = "Discover Abu Dhabi's finest branded residences — hotel-managed luxury apartments with five-star amenities. Jumeirah Residences Al Maryah Island is the flagship branded project in the UAE capital.";
      keywords = "branded residences Abu Dhabi, luxury branded apartments UAE, hotel managed residences Abu Dhabi, Jumeirah branded residences, five-star residences Abu Dhabi, best branded properties UAE 2026";
      schemas = [orgSchema, breadcrumb([{ name: "Branded Residences", url: `${SITE}/branded-residences-abu-dhabi` }])];
    } else {
      // ── Dynamic SEO pages lookup ─────────────────────────────────────
      const slug = path.startsWith("/") ? path.slice(1) : path;
      const seoPage = seoPageMap[slug];
      if (seoPage) {
        title = seoPage.title;
        description = seoPage.description;
        keywords = seoPage.keywords;
        const faqSchema = seoPage.faq && seoPage.faq.length > 0
          ? [{
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": seoPage.faq.map(f => ({
                "@type": "Question",
                "name": f.question,
                "acceptedAnswer": { "@type": "Answer", "text": f.answer }
              }))
            }]
          : [];
        schemas = [
          orgSchema,
          ...faqSchema,
          breadcrumb([{ name: seoPage.headline, url: `${SITE}${path}` }])
        ];
      }
    }

    // ── Apply everything to document.head ────────────────────────────────
    document.title = title;
    setMeta('meta[name="description"]', description);
    setMeta('meta[name="keywords"]', keywords);
    setLink("canonical", canonicalUrl);

    // Open Graph — update on every navigation
    setMeta('meta[property="og:title"]', title);
    setMeta('meta[property="og:description"]', description);
    setMeta('meta[property="og:url"]', canonicalUrl);
    setMeta('meta[property="og:image"]', ogImage);

    // Twitter Card — update on every navigation
    setMeta('meta[name="twitter:title"]', title);
    setMeta('meta[name="twitter:description"]', description);
    setMeta('meta[name="twitter:image"]', ogImage);

    // JSON-LD — one <script> tag per schema object
    schemas.forEach((schema, i) => setJsonLd(`jsonld-schema-${i}`, schema));

  }, [currentPath, blogSlug]);

  // Handle sticky scrolling on scroll thresholds
  useEffect(() => {
    const handleScroll = () => {
      setIsHeaderScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Sync Search Filters (for homepage or buy pages)
  // Uses ref so allProperties stays out of the dependency array (avoids stale-closure warning)
  useEffect(() => {
    let result = allPropertiesRef.current;
    if (searchType) {
      result = result.filter(p => p.type.toLowerCase() === searchType.toLowerCase());
    }
    if (searchLocation) {
      result = result.filter(p => p.area.toLowerCase() === searchLocation.toLowerCase());
    }
    if (searchBudget === "Under AED 5M") {
      result = result.filter(p => p.priceNumeric < 5000000);
    } else if (searchBudget === "AED 5M - 10M") {
      result = result.filter(p => p.priceNumeric >= 5000000 && p.priceNumeric <= 10000000);
    } else if (searchBudget === "Over AED 10M") {
      result = result.filter(p => p.priceNumeric > 10000000);
    }
    setFilteredProperties(result);
  }, [searchType, searchLocation, searchBudget]);

  const handleCatalogSearch = (e: FormEvent) => {
    e.preventDefault();
    navigate("/buy");
  };

  const handleResetSearch = () => {
    setSearchType("");
    setSearchLocation("");
    setSearchBudget("");
    setActiveTab("All");
  };

  // Keep tab highlight in sync when type dropdown changes directly
  useEffect(() => {
    const valid = ["Apartment", "Penthouse", "Villa", "Mansion"];
    setActiveTab(valid.includes(searchType) ? searchType : "All");
  }, [searchType]);

  // Tabs set the type filter directly — keeps everything in sync
  const handleTabChange = (tabName: string) => {
    setSearchType(tabName === "All" ? "" : tabName);
  };

  // WhatsApp helper
  const handleWhatsAppClick = (message = "Hello, I am reviewing properties at AD Residences and wish to speak to an expert.") => {
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`, "_blank");
  };

  // Lead submission handlers
  const handleGeneralSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const errors: Record<string, boolean> = {};

    if (!generalFormData.firstName.trim()) errors.firstName = true;
    if (!generalFormData.lastName.trim()) errors.lastName = true;
    if (!generalFormData.email.trim() || !generalFormData.email.includes("@")) errors.email = true;
    if (!generalFormData.phone.trim()) errors.phone = true;
    if (!generalFormData.nationality.trim()) errors.nationality = true;
    if (!generalFormData.budgetRange) errors.budgetRange = true;
    if (!generalFormData.propertyInterest) errors.propertyInterest = true;
    if (!generalFormData.consent) errors.consent = true;

    if (Object.keys(errors).length > 0) {
      setGeneralFormErrors(errors);
      setTimeout(() => setGeneralFormErrors({}), 3000);
      return;
    }

    setGeneralFormErrors({});
    setIsSubmittingGeneral(true);
    await submitLeadToAPI({ type: "general_consultation", ...generalFormData });
    setIsSubmittingGeneral(false);
    setIsSubmitGeneralSuccess(true);
  };

  const handleResetGeneralForm = () => {
    setGeneralFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      nationality: "",
      budgetRange: "",
      propertyInterest: "",
      message: "",
      consent: true,
    });
    setIsSubmitGeneralSuccess(false);
  };

  const handlePropertyInquirySubmit = async (e: FormEvent) => {
    e.preventDefault();
    const errors: Record<string, boolean> = {};

    if (!propertyFormData.name.trim()) errors.name = true;
    if (!propertyFormData.email.trim() || !propertyFormData.email.includes("@")) errors.email = true;
    if (!propertyFormData.phone.trim()) errors.phone = true;
    if (!propertyFormData.consent) errors.consent = true;

    if (Object.keys(errors).length > 0) {
      setPropertyFormErrors(errors);
      setTimeout(() => setPropertyFormErrors({}), 3000);
      return;
    }

    setPropertyFormErrors({});
    setIsSubmittingPropertyLead(true);
    await submitLeadToAPI({
      type: "property_inquiry",
      ...propertyFormData,
      propertyId: selectedProperty?.id,
      propertyName: selectedProperty?.name,
      propertyPrice: selectedProperty?.price,
    });
    setIsSubmittingPropertyLead(false);
    setIsSubmitPropertyLeadSuccess(true);
  };

  const handleResetPropertyInquiry = () => {
    setPropertyFormData({
      name: "",
      email: "",
      phone: "",
      consent: true
    });
    setIsSubmitPropertyLeadSuccess(false);
  };

  const handleCallbackSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!callbackNumber.trim() || callbackNumber.length < 7) {
      setCallbackError(true);
      setTimeout(() => setCallbackError(false), 3000);
      return;
    }
    
    setCallbackError(false);
    await submitLeadToAPI({ type: "callback_request", phone: callbackNumber });
    setCallbackSubmitted(true);
    setTimeout(() => {
      setIsCallbackModalOpen(false);
      setCallbackSubmitted(false);
      setCallbackNumber("");
    }, 3500);
  };

  const handleTargetSelectionFromPage = (propId: string) => {
    const match = allProperties.find(p => p.id === propId);
    if (match) {
      setSelectedProperty(match);
      handleResetPropertyInquiry();
    }
  };

  // Lifestyle horiz slider
  const sliderRef = useRef<HTMLDivElement>(null);
  const scrollSlider = (direction: "left" | "right") => {
    if (sliderRef.current) {
      const scrollAmount = 360;
      sliderRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth"
      });
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#1A1A1A] font-sans antialiased selection:bg-[#C9A96E] selection:text-white relative">
      {currentPath !== "/admin" && <div className="h-1 bg-[#C9A96E] w-full z-50 fixed top-0 left-0" />}

      {/* --- TOP HEADER NAVIGATION (hidden on admin) --- */}
      {currentPath !== "/admin" && <nav 
        className={`fixed top-1 left-0 right-0 z-40 transition-all duration-300 ${
          isHeaderScrolled 
            ? "bg-white/95 backdrop-blur-md border-b border-[#EAE6DF] shadow-md py-3" 
            : "bg-white/84 backdrop-blur-sm border-b border-[#EAE6DF]/40 py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-1 text-[#1A1A1A] hover:text-[#C9A96E] transition-colors focus:outline-none cursor-pointer"
              aria-label="Toggle navigation"
            >
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
            
            <button onClick={() => navigate("/")} className="flex flex-col text-left focus:outline-none cursor-pointer">
              <span className="font-serif text-base sm:text-xl font-bold tracking-[0.08em] text-[#1A1A1A] hover:opacity-90 whitespace-nowrap">
                AD Residences
              </span>
              <span className="text-[7px] font-sans tracking-[0.2em] text-[#C9A96E] uppercase font-bold leading-none mt-0.5 whitespace-nowrap">
                Luxury Real Estate
              </span>
            </button>
          </div>

          {/* Desktop navigation links — single line */}
          <div className="hidden xl:flex items-center" style={{gap: "20px"}}>
            {[
              { label: "Buy", path: "/buy" },
              { label: "Jumeirah", path: "/properties/jumeirah-residences" },
              { label: "Al Maryah", path: "/properties/al-maryah-island" },
              { label: "Blog", path: "/blog" },
              { label: "About", path: "/about" },
              { label: "Contact", path: "/contact" },
              { label: "FAQ", path: "/faq" },
            ].map(({ label, path }) => (
              <button
                key={path}
                onClick={() => navigate(path)}
                className={`text-[10px] uppercase font-bold tracking-widest cursor-pointer whitespace-nowrap ${currentPath === path ? "text-[#C9A96E]" : "text-gray-600 hover:text-[#C9A96E]"}`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setIsCallbackModalOpen(true)}
              className="p-2 border border-[#EAE6DF] hover:border-[#C9A96E] hover:bg-[#F8F6F2] text-[#1A1A1A] transition-all rounded-none cursor-pointer"
              title="Request VIP Call Back"
            >
              <Phone size={16} className="text-[#1C2B4A]" />
            </button>
            
            <button 
              onClick={() => navigate("/contact")}
              className="hidden sm:inline-block bg-[#1C2B4A] hover:bg-[#131E33] text-white text-[10px] font-bold tracking-widest uppercase px-4 py-2.5 transition-all select-none cursor-pointer"
            >
              VIP MEETING
            </button>
          </div>

        </div>

        {/* Mobile menu drawer panel */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 top-[60px] bg-black/40 backdrop-blur-sm z-30 lg:hidden" onClick={() => setIsMobileMenuOpen(false)}>
            <div className="bg-white max-w-[280px] w-full h-[100dvh] p-6 shadow-2xl flex flex-col justify-between" onClick={(e) => e.stopPropagation()}>
              <div className="space-y-6">
                <div className="border-b border-[#EAE6DF] pb-4">
                  <span className="font-serif text-base font-bold text-[#1A1A1A] tracking-wider">AD Residences</span>
                  <span className="text-[8px] text-[#C9A96E] uppercase tracking-widest block font-bold">DISCREET REALTY ADVISORY</span>
                </div>

                <div className="flex flex-col space-y-3.5 text-xs font-semibold uppercase tracking-widest">
                  <button onClick={() => navigate("/")} className="text-left hover:text-[#C9A96E] py-1">Home Portal</button>
                  <button onClick={() => navigate("/buy")} className="text-left hover:text-[#C9A96E] py-1">Buy Collection</button>
                  <button onClick={() => navigate("/properties/jumeirah-residences")} className="text-left hover:text-[#C9A96E] py-1">Jumeirah Residences</button>
                  <button onClick={() => navigate("/properties/al-maryah-island")} className="text-left hover:text-[#C9A96E] py-1">Al Maryah Guide</button>
                  <button onClick={() => navigate("/blog")} className="text-left hover:text-[#C9A96E] py-1">Advisor Blogs</button>
                  <button onClick={() => navigate("/about")} className="text-left hover:text-[#C9A96E] py-1">Our Story</button>
                  <button onClick={() => navigate("/contact")} className="text-left hover:text-[#C9A96E] py-1">Contact Headquarters</button>
                  <button onClick={() => navigate("/faq")} className="text-left hover:text-[#C9A96E] py-1">FAQ Matrix</button>
                </div>
              </div>

              <div className="border-t border-[#EAE6DF] pt-6 space-y-3.5 pb-20">
                <span className="text-[10px] text-gray-400 leading-relaxed font-light block">
                  Connect instantaneously with our direct bridge channel.
                </span>
                <button 
                  onClick={() => handleWhatsAppClick("Hello, please connect me immediately to the Abu Dhabi advisory team.")}
                  className="w-full bg-[#25D366] text-white py-2 text-[10px] font-bold tracking-widest uppercase flex items-center justify-center space-x-1"
                >
                  <MessageCircle size={12} />
                  <span>WHATSAPP SUPPORT</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>}

      {/* --- INTEREST POPUP (blog, about, faq pages) --- */}
      {["/blog", "/about", "/faq"].includes(currentPath) && (
        <InterestPopup pageName={currentPath.replace("/", "")} />
      )}

      {/* --- CORE PAGE SWITCHER ROUTING --- */}
      <main className="z-10 relative">
        {currentPath === "/admin" && (
          <AdminPanel onNavigate={navigate} />
        )}
        {currentPath !== "/admin" && currentPath === "/" && (
          <div>
            {/* 1. Hero — background anchored from top (cuts bottom), logo overlaid */}
            <section className="relative h-screen overflow-hidden">
              {/* Background photo: top anchored, never crops the dome */}
              <img
                src="/jumeirah-hero.png"
                alt="Jumeirah Residences Al Maryah Island Abu Dhabi"
                className="absolute inset-0 w-full h-full object-cover object-top"
              />
              {/* Dark gradient at bottom for CTA legibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />

              {/* Jumeirah logo — centered, uses mix-blend-mode to drop the black bg */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <img
                  src="/jumeirah-logo.png"
                  alt="Jumeirah Residences Al Maryah Island"
                  className="w-[70vw] sm:w-[50vw] md:w-[40vw] lg:w-[32vw] max-w-[520px]"
                  style={{ mixBlendMode: "screen" }}
                />
              </div>

              {/* CTA buttons pinned to bottom */}
              <div className="absolute bottom-0 left-0 right-0 z-20">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 border-t border-white/20">
                  <button
                    onClick={() => navigate("/buy")}
                    className="flex items-center justify-between py-5 px-6 sm:px-10 bg-transparent text-white font-semibold text-xs tracking-[0.25em] uppercase hover:bg-white hover:text-gray-900 transition-colors cursor-pointer border-r border-white/10"
                  >
                    <span>DISCOVER HOLDINGS</span>
                    <ChevronRight size={16} />
                  </button>
                  <button
                    onClick={() => navigate("/contact")}
                    className="flex items-center justify-between py-5 px-6 sm:px-10 bg-[#1C2B4A]/90 text-white font-semibold text-xs tracking-[0.25em] uppercase hover:bg-[#131E33] transition-colors cursor-pointer"
                  >
                    <span>VIP SPECIFICATION SUBMIT</span>
                    <ArrowRight size={16} className="text-[#C9A96E]" />
                  </button>
                </div>
              </div>
            </section>

            {/* 2. Horizontal Search Bar */}
            <section className="bg-[#F8F6F2] py-8 border-b border-[#EAE6DF] relative z-20">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <form onSubmit={handleCatalogSearch} className="bg-white p-5 border border-[#EAE6DF] grid grid-cols-1 md:grid-cols-4 gap-4 items-end shadow-lg">
                  <div className="space-y-1.5">
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">Unit Classification</span>
                    <select 
                      value={searchType} 
                      onChange={(e) => setSearchType(e.target.value)}
                      className="w-full bg-[#F8F6F2] text-xs font-semibold py-2.5 px-3 border border-[#EAE6DF] focus:border-[#C9A96E] focus:outline-none appearance-none rounded-none text-slate-900 cursor-pointer"
                    >
                      <option value="">All Types</option>
                      <option value="Apartment">Apartment</option>
                      <option value="Penthouse">Penthouse</option>
                      <option value="Villa">Villa</option>
                      <option value="Mansion">Mansion</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">Geographic Quadrant</span>
                    <select 
                      value={searchLocation} 
                      onChange={(e) => setSearchLocation(e.target.value)}
                      className="w-full bg-[#F8F6F2] text-xs font-semibold py-2.5 px-3 border border-[#EAE6DF] focus:border-[#C9A96E] focus:outline-none appearance-none rounded-none text-slate-900 cursor-pointer"
                    >
                      <option value="">All Territories</option>
                      <option value="Saadiyat Island">Saadiyat Island</option>
                      <option value="Yas Island">Yas Island</option>
                      <option value="Al Reem Island">Al Reem Island</option>
                      <option value="Ramhan Island">Ramhan Island</option>
                      <option value="Al Maryah Island">Al Maryah Island</option>
                      <option value="Al Raha Beach">Al Raha Beach</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">Investment Pricing</span>
                    <select 
                      value={searchBudget} 
                      onChange={(e) => setSearchBudget(e.target.value)}
                      className="w-full bg-[#F8F6F2] text-xs font-semibold py-2.5 px-3 border border-[#EAE6DF] focus:border-[#C9A96E] focus:outline-none appearance-none rounded-none text-slate-900 cursor-pointer"
                    >
                      <option value="">Any Budget</option>
                      <option value="Under AED 5M">Under AED 5,000,000</option>
                      <option value="AED 5M - 10M">AED 5,000,000 – AED 10,000,000</option>
                      <option value="Over AED 10M">Over AED 10,000,000</option>
                    </select>
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-[#1C2B4A] hover:bg-[#131E33] text-white text-[10px] font-bold tracking-widest uppercase py-3.5 px-4 text-center select-none transition-colors rounded-none cursor-pointer"
                  >
                    SEARCH HOLDINGS
                  </button>
                </form>
              </div>
            </section>

            {/* 3. Featured Marquee Projects (Jumeirah Residences + Al Maryah Island) */}
            <section className="py-20 bg-white">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16 space-y-3">
                  <span className="text-[#C9A96E] text-xs font-semibold tracking-[0.4em] uppercase block">FLAGSHIP MASTER ARCHITECTURES</span>
                  <h2 className="font-serif text-3xl sm:text-5xl font-light text-[#1A1A1A] tracking-tight">Featured Capital Ventures</h2>
                  <p className="text-xs sm:text-sm text-gray-500 max-w-lg mx-auto leading-relaxed font-light">
                    An inside view of the target properties positioning capital yields, sovereign legal protections and Golden Residences for buyers.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                  {/* Card 1: Jumeirah Residences */}
                  <div className="bg-[#F8F6F2]/30 border border-[#EAE6DF] flex flex-col justify-between overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-500 group">
                    <div className="aspect-[16/10] bg-gray-100 overflow-hidden relative">
                      <img 
                        src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop&q=80" 
                        alt="Jumeirah Residences Exterior tower views" 
                        className="w-full h-full object-cover transform group-hover:scale-102 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute top-4 left-4 z-10">
                        <span className="bg-[#1C2B4A] text-white text-[9px] font-bold uppercase tracking-widest py-1 px-3">BRANDED SELECTION</span>
                      </div>
                    </div>
                    <div className="p-6 sm:p-8 space-y-4">
                      <h3 className="font-serif text-2xl font-light text-slate-900 leading-tight">Jumeirah Residences Abu Dhabi</h3>
                      <p className="text-xs leading-relaxed text-gray-650 font-light font-sans">
                        Luxury waterfront apartments and triplex penthouses on Al Maryah Island under absolute Jumeirah branded management. Starting from AED 3,000,000.
                      </p>
                      <button 
                        onClick={() => navigate("/properties/jumeirah-residences")}
                        className="group flex items-center space-x-2 text-xs font-bold text-[#1A1A1A] tracking-widest uppercase hover:text-[#C9A96E] transition-colors"
                      >
                        <span>EXPLORE PROJECT SHEET</span>
                        <ArrowRight size={14} className="text-[#C9A96E] group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>

                  {/* Card 2: Al Maryah Island */}
                  <div className="bg-[#F8F6F2]/30 border border-[#EAE6DF] flex flex-col justify-between overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-500 group">
                    <div className="aspect-[16/10] bg-gray-100 overflow-hidden relative">
                      <img 
                        src="https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800&auto=format&fit=crop&q=80" 
                        alt="Al Maryah Island global freezone layout" 
                        className="w-full h-full object-cover transform group-hover:scale-102 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute top-4 left-4 z-10">
                        <span className="bg-[#C9A96E] text-white text-[9px] font-bold uppercase tracking-widest py-1 px-3">ADGM FREEHOLD ZONE</span>
                      </div>
                    </div>
                    <div className="p-6 sm:p-8 space-y-4">
                      <h3 className="font-serif text-2xl font-light text-slate-900 leading-tight">Al Maryah Island Area Guide</h3>
                      <p className="text-xs leading-relaxed text-gray-650 font-light font-sans">
                        An analyst overview mapping out commercial density, ADGM structures, Rosewood hotels, Michelin-starred corridors, and capital yields.
                      </p>
                      <button 
                        onClick={() => navigate("/properties/al-maryah-island")}
                        className="group flex items-center space-x-2 text-xs font-bold text-[#1A1A1A] tracking-widest uppercase hover:text-[#C9A96E] transition-colors"
                      >
                        <span>EXPLORE CAPITAL MAP</span>
                        <ArrowRight size={14} className="text-[#C9A96E] group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* 4. Core Numbers Stat Strip */}
            <section className="bg-[#1C2B4A] py-14 text-white border-b-4 border-[#C9A96E]">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                  <div className="text-center space-y-1">
                    <div className="text-3xl sm:text-5xl font-light font-serif text-[#C9A96E]">500+</div>
                    <div className="text-[9px] font-semibold text-gray-300 uppercase tracking-widest font-sans">Vetted Holdings</div>
                  </div>
                  <div className="text-center space-y-1">
                    <div className="text-3xl sm:text-5xl font-light font-serif text-[#C9A96E]">AED 2B+</div>
                    <div className="text-[9px] font-semibold text-gray-300 uppercase tracking-widest font-sans">Sovereign Transactions</div>
                  </div>
                  <div className="text-center space-y-1">
                    <div className="text-3xl sm:text-5xl font-light font-serif text-[#C9A96E]">98%</div>
                    <div className="text-[9px] font-semibold text-gray-300 uppercase tracking-widest font-sans">Referral Rate</div>
                  </div>
                  <div className="text-center space-y-1">
                    <div className="text-3xl sm:text-5xl font-light font-serif text-[#C9A96E]">12+ Yrs</div>
                    <div className="text-[9px] font-semibold text-gray-300 uppercase tracking-widest font-sans">Accredited Advisory</div>
                  </div>
                </div>
              </div>
            </section>

            {/* 4b. Project Video Section */}
            <section className="py-20 bg-white border-b border-[#EAE6DF]">
              <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-10 space-y-3">
                  <span className="text-xs font-semibold text-[#C9A96E] tracking-[0.4em] uppercase block">EXCLUSIVE DEVELOPMENT PREVIEW</span>
                  <h2 className="font-serif text-2xl sm:text-4xl font-light text-[#1A1A1A]">Jumeirah Residences — Al Maryah Island</h2>
                  <p className="text-xs sm:text-sm text-gray-500 font-light max-w-lg mx-auto leading-relaxed">
                    An aerial and architectural walkthrough of Abu Dhabi's most anticipated branded residence launch.
                  </p>
                </div>
                <div className="border border-[#EAE6DF] overflow-hidden shadow-xl">
                  <video
                    controls
                    playsInline
                    poster="/jumeirah-hero.png"
                    className="w-full aspect-video bg-black"
                  >
                    <source src="/hero-bg.mp4" type="video/mp4" />
                  </video>
                </div>
                <div className="flex justify-center mt-8">
                  <button
                    onClick={() => navigate("/properties/jumeirah-residences")}
                    className="bg-[#1C2B4A] hover:bg-[#131E33] text-white text-[10px] font-bold tracking-widest uppercase px-8 py-3.5 transition-colors cursor-pointer"
                  >
                    VIEW FULL PROJECT DETAILS →
                  </button>
                </div>
              </div>
            </section>

            {/* 5. 3 Top Curated Properties Selection */}
            <section className="py-20 bg-[#F8F6F2]/30">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
                  <div>
                    <span className="text-xs font-semibold text-[#C9A96E] tracking-[0.4em] uppercase block mb-2">CURATED SELECTIONS</span>
                    <h2 className="font-serif text-3xl sm:text-5xl font-light text-slate-850">Outstanding Residences</h2>
                  </div>
                  <button 
                    onClick={() => navigate("/buy")}
                    className="text-xs font-bold tracking-widest uppercase text-[#1C2B4A] hover:text-[#C9A96E] border-b border-[#C9A96E] pb-0.5 mt-4 md:mt-0 select-none cursor-pointer"
                  >
                    VIEW ENTIRE CATALOG ({allProperties.length} units) →
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {allProperties.slice(0, 3).map((property) => (
                    <article 
                      key={property.id}
                      onClick={() => handleTargetSelectionFromPage(property.id)}
                      className="bg-white border border-[#EAE6DF] hover:shadow-xl transition-shadow duration-300 cursor-pointer flex flex-col justify-between group"
                    >
                      <div className="aspect-[4/3] bg-gray-50 overflow-hidden relative">
                        <img 
                          src={property.image} 
                          alt={property.name}
                          className="w-full h-full object-cover transform group-hover:scale-102 transition-transform duration-500"
                        />
                        <div className="absolute top-4 left-4 z-10">
                          <span className="bg-[#C9A96E] text-white text-[9px] font-bold uppercase tracking-widest py-1 px-2.5 shadow-sm">
                            {property.badge}
                          </span>
                        </div>
                      </div>

                      <div className="p-6 space-y-4">
                        <div className="flex items-center space-x-1.5 text-[9px] font-bold text-gray-500 font-sans uppercase tracking-widest">
                          <MapPin size={10} className="text-[#C9A96E]" />
                          <span>{property.location}</span>
                        </div>
                        <h4 className="font-serif text-lg font-normal text-slate-950 group-hover:text-[#C9A96E] transition-colors">{property.name}</h4>
                        <p className="text-xs text-gray-500 font-light leading-relaxed line-clamp-2">{property.description}</p>
                        
                        <div className="pt-4 border-t border-[#F8F6F2] flex justify-between items-baseline">
                          <div>
                            <span className="text-[8px] text-gray-400 block uppercase font-bold tracking-wider">Prices from</span>
                            <span className="text-sm font-serif font-semibold text-gray-950">{property.price}</span>
                          </div>
                          <span className="text-[9px] font-bold tracking-widest text-[#C9A96E] uppercase border-b border-[#C9A96E]/40">ENQUIRE</span>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </section>

            {/* 6. Editorial About block */}
            <section className="py-24 bg-white border-t border-[#EAE6DF]/40">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                  <div className="lg:col-span-6 relative">
                    <div className="aspect-[4/5] sm:aspect-[16/10] lg:aspect-[4/5] bg-gray-50 border border-[#EAE6DF] overflow-hidden">
                      <img 
                        src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&auto=format&fit=crop&q=80" 
                        alt="Curated elegant Abu Dhabi yacht harbor and luxury pool" 
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  </div>

                  <div className="lg:col-span-6 space-y-6">
                    <div className="w-16 h-1 bg-[#C9A96E]" />
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest block font-sans">
                      DISCREET SOVEREIGN INTEL DESK
                    </span>
                    <h2 className="font-serif text-3xl sm:text-5xl font-light text-slate-900 leading-tight">
                      Where Honesty Meets <span className="italic font-normal">Privileged</span> Alignment.
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-750 font-light leading-relaxed font-sans">
                      We are not a simple listings directory. AD Residences acts as a discrete broker intelligence desk specifically engineered to coordinate first-tier off-market allocations for sovereign corporate professionals and international trust funds alike.
                    </p>
                    <p className="text-xs sm:text-sm text-gray-750 font-light leading-relaxed font-sans">
                      By prioritizing direct developer alignments and keeping our margins clean of secondary commissions, we secure pristine golden residency codes, off-plan payment optimizations, and zero-bureaucracy closes.
                    </p>

                    <div className="pt-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      <button 
                        onClick={() => navigate("/about")}
                        className="group inline-flex items-center space-x-2 text-xs font-bold text-gray-950 tracking-[0.2em] uppercase border-b border-[#C9A96E] pb-1 hover:text-[#C9A96E] transition-colors cursor-pointer"
                      >
                        <span>OUR ADVISORY CHARTER</span>
                        <ArrowRight size={14} className="text-[#C9A96E]" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* 7. Carousel client quotes */}
            <section className="bg-[#F8F6F2]/50 py-16 border-t border-b border-[#EAE6DF]">
              <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6">
                <div className="inline-flex p-2 rounded-none bg-white border border-[#EAE6DF] text-[#C9A96E]">
                  <Award size={20} />
                </div>
                <blockquote className="font-serif text-lg sm:text-2xl font-light text-slate-850 italic leading-relaxed">
                  "The transparency and off-market priorities secured for our sovereign wealth relocation was exemplary. We bypassed land registry blocks and closed Jumeirah Residences floor buys in 48 hours."
                </blockquote>
                <div className="space-y-0.5">
                  <cite className="not-italic text-[10px] font-bold tracking-widest uppercase text-slate-900 font-sans block">Sovereign Asset Trustee</cite>
                  <span className="text-[9px] text-[#C9A96E] uppercase tracking-wider block font-sans">GENEVA, SWITZERLAND</span>
                </div>
              </div>
            </section>

            {/* 8. Private Consultation lead booking form */}
            <section className="py-20 bg-white">
              <div className="max-w-4xl mx-auto px-4 sm:px-6">
                <div className="text-center mb-12 space-y-2">
                  <span className="text-[#C9A96E] text-xs font-semibold tracking-[0.4em] uppercase block">SECURE AN ACCREDITED VISUAL BRIEF</span>
                  <h3 className="font-serif text-2xl sm:text-4xl font-light text-slate-900">Request a Private Consultation</h3>
                  <p className="text-xs text-gray-400 font-light uppercase tracking-widest font-sans">
                    Our registered advisory desk will package custom PDF details and dispatch options in under 24 hours.
                  </p>
                </div>

                <div className="bg-white p-7 sm:p-12 border border-[#EAE6DF] shadow-2xl relative">
                  <div className="absolute top-0 left-0 h-1.5 w-full bg-[#1C2B4A]" />
                  
                  {!isSubmitGeneralSuccess ? (
                    <form onSubmit={handleGeneralSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-1 relative">
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">First Name <span className="text-[#C9A96E]">*</span></label>
                          <input 
                            type="text" 
                            placeholder="e.g., Charles"
                            value={generalFormData.firstName}
                            onChange={(e) => setGeneralFormData({...generalFormData, firstName: e.target.value})}
                            className={`w-full bg-white text-xs py-2 px-1 border-b ${generalFormErrors.firstName ? "border-red-500" : "border-[#EAE6DF]"} focus:border-[#C9A96E] focus:outline-none rounded-none`}
                          />
                        </div>
                        <div className="space-y-1 relative">
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Last Name <span className="text-[#C9A96E]">*</span></label>
                          <input 
                            type="text" 
                            placeholder="e.g., de-Bordeau"
                            value={generalFormData.lastName}
                            onChange={(e) => setGeneralFormData({...generalFormData, lastName: e.target.value})}
                            className={`w-full bg-white text-xs py-2 px-1 border-b ${generalFormErrors.lastName ? "border-red-500" : "border-[#EAE6DF]"} focus:border-[#C9A96E] focus:outline-none rounded-none`}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-1 relative">
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Email Address <span className="text-[#C9A96E]">*</span></label>
                          <input 
                            type="email" 
                            placeholder="e.g., charles@de-bordeau.cloud"
                            value={generalFormData.email}
                            onChange={(e) => setGeneralFormData({...generalFormData, email: e.target.value})}
                            className={`w-full bg-white text-xs py-2 px-1 border-b ${generalFormErrors.email ? "border-red-500" : "border-[#EAE6DF]"} focus:border-[#C9A96E] focus:outline-none rounded-none`}
                          />
                        </div>
                        <div className="space-y-1 relative">
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Contact Line <span className="text-[#C9A96E]">*</span></label>
                          <input 
                            type="tel" 
                            placeholder="e.g., +33 700 900 888"
                            value={generalFormData.phone}
                            onChange={(e) => setGeneralFormData({...generalFormData, phone: e.target.value})}
                            className={`w-full bg-white text-xs py-2 px-1 border-b ${generalFormErrors.phone ? "border-red-500" : "border-[#EAE6DF]"} focus:border-[#C9A96E] focus:outline-none rounded-none`}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <div className="space-y-1 relative">
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Buyer Nationality <span className="text-[#C9A96E]">*</span></label>
                          <input 
                            type="text" 
                            placeholder="e.g., Canadian"
                            value={generalFormData.nationality}
                            onChange={(e) => setGeneralFormData({...generalFormData, nationality: e.target.value})}
                            className={`w-full bg-white text-xs py-2 px-1 border-b ${generalFormErrors.nationality ? "border-red-500" : "border-[#EAE6DF]"} focus:border-[#C9A96E] focus:outline-none rounded-none`}
                          />
                        </div>
                        
                        <div className="space-y-1 relative">
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Intake Budget Range <span className="text-[#C9A96E]">*</span></label>
                          <select 
                            value={generalFormData.budgetRange}
                            onChange={(e) => setGeneralFormData({...generalFormData, budgetRange: e.target.value})}
                            className="w-full bg-white text-xs py-2 px-1 border-b border-[#EAE6DF] focus:border-[#C9A96E] focus:outline-none appearance-none rounded-none cursor-pointer text-slate-900"
                          >
                            <option value="">Choose Budget</option>
                            <option value="Under AED 5M">Under AED 5,000,000</option>
                            <option value="AED 5M - 10M">AED 5,000,000 – 10,000,000</option>
                            <option value="Over AED 10M">Over AED 10,000,000</option>
                          </select>
                        </div>

                        <div className="space-y-1 relative">
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Interests <span className="text-[#C9A96E]">*</span></label>
                          <select 
                            value={generalFormData.propertyInterest}
                            onChange={(e) => setGeneralFormData({...generalFormData, propertyInterest: e.target.value})}
                            className="w-full bg-white text-xs py-2 px-1 border-b border-[#EAE6DF] focus:border-[#C9A96E] focus:outline-none appearance-none rounded-none cursor-pointer text-slate-900"
                          >
                            <option value="">Choose Project</option>
                            <option value="Jumeirah Residences Selection">Jumeirah Residences</option>
                            <option value="Al Maryah Island Canal Plots">Al Maryah Island General</option>
                            <option value="Saadiyat Cultural Villas">Saadiyat Island</option>
                            <option value="Off-market Private Penthouse Desk">Private Off-market Desk</option>
                          </select>
                        </div>
                      </div>

                      <label className="flex items-start space-x-2 pt-2 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={generalFormData.consent}
                          onChange={(e) => setGeneralFormData({...generalFormData, consent: e.target.checked})}
                          className="mt-0.5 border-gray-300 rounded-none text-[#1C2B4A] focus:ring-[#C9A96E]"
                        />
                        <span className="text-[9px] text-gray-550 font-light leading-normal font-sans">
                          Agree to AD Residences coordinating off-market catalogs and scheduling direct video briefings in complete data compliance.
                        </span>
                      </label>

                      <div className="pt-2">
                        <button 
                          type="submit"
                          disabled={isSubmittingGeneral}
                          className="w-full bg-[#1C2B4A] hover:bg-[#131E33] text-white text-[10px] font-bold tracking-widest uppercase py-4 transition-colors rounded-none flex items-center justify-center space-x-1 cursor-pointer"
                        >
                          {isSubmittingGeneral ? (
                            <>
                              <Loader2 size={12} className="animate-spin text-[#C9A96E]" />
                              <span>PACKAGING SPECIAL FOLDERS...</span>
                            </>
                          ) : (
                            <span>REQUEST ALLOCATION ENVELOPE</span>
                          )}
                        </button>
                      </div>

                    </form>
                  ) : (
                    <div className="text-center py-10 space-y-6">
                      <div className="inline-flex p-3 bg-[#F4FAF6] border border-[#E1F0E3] text-[#25D366]">
                        <Check size={28} />
                      </div>
                      <h4 className="font-serif text-2xl font-light text-slate-900">Advisory Briefing Reserved</h4>
                      <p className="text-xs text-gray-500 max-w-md mx-auto leading-relaxed font-light">
                        Thank you. Your parameters have been matched. Let our registered Al Maryah headquarters dispatch specialized floor plans and Golden Visa guides to <span className="font-semibold text-gray-800">{generalFormData.email}</span>.
                      </p>
                      <button 
                        onClick={handleResetGeneralForm}
                        className="bg-[#F8F6F2] hover:bg-[#EAE6DF] text-[9.5px] text-[#1A1A1A] font-bold tracking-widest uppercase py-2.5 px-6 border border-[#EAE6DF] rounded-none mt-4 inline-block select-none"
                      >
                        SUBMIT ANOTHER REGISTER
                      </button>
                    </div>
                  )}

                </div>
              </div>
            </section>
          </div>
        )}

        {/* --- DYNAMIC SUBPAGES ROUTING PANEL --- */}
        {currentPath === "/faq" && (
          <FAQPage onRequestCallback={() => setIsCallbackModalOpen(true)} />
        )}
        {currentPath === "/about" && (
          <AboutPage onShowConsultation={() => { navigate("/contact"); }} />
        )}
        {currentPath === "/contact" && (
          <ContactPage onShowCallback={() => setIsCallbackModalOpen(true)} />
        )}
        {currentPath === "/blog" && (
          <BlogPage 
            onShowConsultation={() => { navigate("/contact"); }} 
            onNavigate={(path) => navigate(path)}
            initialSlug={blogSlug} 
          />
        )}
        {currentPath === "/properties/jumeirah-residences" && (
          <JumeirahResidencesPage 
            onShowConsultation={() => { navigate("/contact"); }}
            onShowCallback={() => setIsCallbackModalOpen(true)}
            onSelectPropertyById={(id) => handleTargetSelectionFromPage(id)}
          />
        )}
        {currentPath === "/properties/al-maryah-island" && (
          <AlMaryahIslandPage 
            onShowConsultation={() => navigate("/contact")}
            onNavigate={(path) => navigate(path)}
          />
        )}
        {currentPath === "/buy" && (
          <BuyPage 
            searchType={searchType}
            setSearchType={setSearchType}
            searchLocation={searchLocation}
            setSearchLocation={setSearchLocation}
            searchBudget={searchBudget}
            setSearchBudget={setSearchBudget}
            filteredProperties={filteredProperties}
            activeTab={activeTab}
            onTabChange={handleTabChange}
            onSearch={handleCatalogSearch}
            onReset={handleResetSearch}
            onSelectProperty={(p) => { setSelectedProperty(p); handleResetPropertyInquiry(); }}
          />
        )}
        {currentPath === "/golden-visa-property-abu-dhabi" && (
          <LandingPage
            slug="golden-visa"
            headline="UAE Golden Visa Through Abu Dhabi Property"
            subheadline="Secure 10-year UAE residency with a qualifying AED 2M+ investment in a designated freehold zone."
            heroImg="/jumeirah-hero.png"
            ctaLabel="Book a Golden Visa Consultation"
            onCta={() => navigate("/contact")}
            sections={[
              { heading: "What is the UAE Golden Visa?", body: "The UAE Golden Visa is a long-term residency programme granting 10-year renewable residency to property investors who purchase real estate valued at AED 2,000,000 or above in a designated freehold investment zone. The visa covers the buyer, spouse, and dependent children — with no requirement for a local sponsor or employer." },
              { heading: "Does Abu Dhabi Property Qualify?", body: "Yes. Freehold properties purchased in Abu Dhabi's designated investment zones — including Al Maryah Island, Saadiyat Island, Yas Island, Al Reem Island, and Ramhan Island — fully qualify. The property must be registered in your name with the Abu Dhabi Department of Municipalities and Transport and be either fully paid or mortgaged above the AED 2M threshold." },
              { heading: "Jumeirah Residences: A Golden Visa Asset", body: "Jumeirah Residences Al Maryah Island is a flagship Golden Visa–eligible development. Starting prices from AED 3,000,000 exceed the threshold with comfortable margin. As a branded residence managed by Jumeirah Group, it combines investment credibility with five-star lifestyle — making it one of the most sought-after Golden Visa properties in Abu Dhabi in 2026." },
              { heading: "The Application Process", body: "1. Purchase and register the property (Oqood or Title Deed). 2. Submit documents via the ICA (Federal Authority for Identity and Citizenship) or through an authorised typing centre. 3. Receive visa in 2–4 weeks. AD Residences can guide you through every step from property selection to visa application." },
              { heading: "Why Abu Dhabi Over Dubai for Golden Visa?", body: "Abu Dhabi offers superior capital preservation, lower price-per-sqft in comparable luxury assets, stronger corporate tenancy (ADGM, Mubadala, government entities), and a quieter, higher-quality lifestyle. Al Maryah Island specifically delivers 7–8.5% net rental yields — among the highest in the UAE for corporate-grade tenancies." }
            ]}
          />
        )}
        {currentPath === "/off-plan-properties-abu-dhabi" && (
          <LandingPage
            slug="off-plan"
            headline="Off-Plan Properties in Abu Dhabi 2026"
            subheadline="Lock in below-market prices on Abu Dhabi's most anticipated new launches with developer payment plans."
            heroImg="/jumeirah-hero.png"
            ctaLabel="View Available Off-Plan Listings"
            onCta={() => navigate("/buy")}
            sections={[
              { heading: "Why Buy Off-Plan in Abu Dhabi?", body: "Off-plan purchases allow you to secure a property at today's price with a small upfront deposit — typically 10–20% — and pay the remainder across construction milestones. This means you benefit from capital appreciation throughout the build period while your capital outlay remains low. Abu Dhabi's off-plan market has delivered 15–30% price growth from launch to handover on premium projects in recent years." },
              { heading: "How Off-Plan Payment Plans Work", body: "A typical Abu Dhabi off-plan plan looks like: 10% on booking, 10% on SPA signing, then 40–60% spread across quarterly construction milestones, with 10–20% due on handover. Some developers offer post-handover payment plans extending 1–3 years beyond completion. AD Residences only recommends projects with escrow-protected payments registered with the Abu Dhabi Department of Municipalities and Transport." },
              { heading: "Jumeirah Residences: The Premier Off-Plan Opportunity", body: "Jumeirah Residences Al Maryah Island is the most anticipated off-plan branded residence in Abu Dhabi in 2026. Developed by Aldar Properties (the UAE's largest listed developer) in partnership with Jumeirah Group, it offers institutional-grade build quality, a guaranteed hospitality management brand on handover, and a location in the heart of Abu Dhabi's financial and luxury district." },
              { heading: "Off-Plan vs Ready Properties in Abu Dhabi", body: "Off-plan: lower entry price, higher upside potential, newer specification, flexible payment terms. Ready: immediate rental income, Golden Visa on day one, no construction risk. AD Residences advises a mixed strategy — off-plan for capital growth, ready for income generation — with Al Maryah Island assets anchoring both positions." },
              { heading: "Risks and How We Protect You", body: "All projects we recommend are by ADGM or Abu Dhabi government-backed developers with escrow accounts. We review SPA terms, construction timelines, and developer track record before making any recommendation. Our advisory is buyer-only: we do not act for developers, eliminating conflicts of interest." }
            ]}
          />
        )}
        {currentPath === "/branded-residences-abu-dhabi" && (
          <LandingPage
            slug="branded"
            headline="Branded Residences in Abu Dhabi"
            subheadline="Hotel-managed luxury homes combining five-star amenities with premium residential ownership."
            heroImg="/jumeirah-hero.png"
            ctaLabel="Enquire About Branded Residences"
            onCta={() => navigate("/contact")}
            sections={[
              { heading: "What Are Branded Residences?", body: "Branded residences are privately owned apartments or villas managed by a luxury hotel brand — think Jumeirah, Four Seasons, Ritz-Carlton, or Rosewood. Owners enjoy hotel-calibre services (concierge, housekeeping, in-room dining, spa access) as part of their everyday residence. When not in residence, units can be placed in the hotel's rental pool, generating passive income." },
              { heading: "Why Branded Residences Command a Premium", body: "Global data shows branded residences command a 30–40% price premium over comparable non-branded assets in the same location. The brand provides quality assurance, ongoing maintenance standards, and a globally recognised identity that attracts premium tenants and resale buyers. In Abu Dhabi's market, this premium is reinforced by constrained supply: there are very few branded residence developments on the island." },
              { heading: "Jumeirah Residences: Abu Dhabi's Flagship Branded Project", body: "Jumeirah Residences Al Maryah Island is the only Jumeirah-branded residence in Abu Dhabi. The Jumeirah Group — operator of the iconic Burj Al Arab — brings its ultra-luxury service standards directly to residential living. Residents enjoy five-star concierge, access to hotel facilities, and the assurance of the Jumeirah brand maintaining the building to the highest international standard." },
              { heading: "Branded Residences as Investment Assets", body: "For investors, branded residences offer a premium tenant profile (senior executives, diplomats, high-net-worth individuals), stronger capital preservation, and easier resale liquidity. Al Maryah Island's corporate tenancy base — anchored by ADGM, major banks, and government entities — underpins the demand for premium branded accommodation." },
              { heading: "Comparing Branded Residence Projects in Abu Dhabi", body: "Abu Dhabi's branded residence landscape in 2026 includes Jumeirah Residences Al Maryah Island, Four Seasons Private Residences Jumeirah at Saadiyat Island, and a small number of Rosewood-affiliated units. Of these, Jumeirah Residences Al Maryah Island offers the strongest combination of financial district proximity, rental yield potential, and brand recognition." }
            ]}
          />
        )}

        {/* --- DYNAMIC PROGRAMMATIC SEO PAGES --- */}
        {(() => {
          const slug = currentPath.startsWith("/") ? currentPath.slice(1) : currentPath;
          const seoPage = seoPageMap[slug];
          if (!seoPage) return null;
          return (
            <SeoPage
              page={seoPage}
              onCta={() => navigate("/contact")}
            />
          );
        })()}
      </main>

      {/* --- ELITE FOOTER (hidden on admin) --- */}
      {currentPath !== "/admin" && <footer className="bg-[#1A1A1A] text-white pt-20 pb-12 border-t-2 border-[#C9A96E] z-10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-white/10">
            {/* Column 1: Identity */}
            <div className="md:col-span-3 space-y-4">
              <span className="font-serif text-xl sm:text-2xl font-bold tracking-wider text-white">AD Residences</span>
              <p className="text-[11px] text-gray-400 font-light leading-relaxed max-w-sm">
                Premium real estate advisory specializing in curated, high-yield off-plan and ready properties across Abu Dhabi's elite designated freehold investment zones.
              </p>
              <p className="text-[9px] text-[#C9A96E] tracking-widest uppercase font-mono font-bold pt-2">
                Licensed Real Estate Advisory AE
              </p>
            </div>

            {/* Column 2: Navigation Map */}
            <div className="md:col-span-2 space-y-4">
              <span className="text-[10px] font-bold text-[#C9A96E] uppercase tracking-widest block">Portfolio</span>
              <div className="flex flex-col space-y-2 text-xs text-gray-300 font-light">
                <button onClick={() => navigate("/buy")} className="text-left hover:text-[#C9A96E] cursor-pointer">Buy Properties</button>
                <button onClick={() => navigate("/properties/jumeirah-residences")} className="text-left hover:text-[#C9A96E] cursor-pointer">Jumeirah Residences</button>
                <button onClick={() => navigate("/properties/al-maryah-island")} className="text-left hover:text-[#C9A96E] cursor-pointer">Al Maryah Guide</button>
                <button onClick={() => navigate("/blog")} className="text-left hover:text-[#C9A96E] cursor-pointer">Market Blog</button>
              </div>
            </div>

            {/* Column 3: Guides */}
            <div className="md:col-span-2 space-y-4">
              <span className="text-[10px] font-bold text-[#C9A96E] uppercase tracking-widest block">Investor Guides</span>
              <div className="flex flex-col space-y-2 text-xs text-gray-300 font-light">
                <button onClick={() => navigate("/golden-visa-abu-dhabi")} className="text-left hover:text-[#C9A96E] cursor-pointer">UAE Golden Visa</button>
                <button onClick={() => navigate("/off-plan-investment-guide-abu-dhabi")} className="text-left hover:text-[#C9A96E] cursor-pointer">Off-Plan Guide</button>
                <button onClick={() => navigate("/abu-dhabi-property-market-2026")} className="text-left hover:text-[#C9A96E] cursor-pointer">Market 2026</button>
                <button onClick={() => navigate("/rental-yields-abu-dhabi-2026")} className="text-left hover:text-[#C9A96E] cursor-pointer">Rental Yields</button>
                <button onClick={() => navigate("/how-to-buy-property-in-abu-dhabi")} className="text-left hover:text-[#C9A96E] cursor-pointer">How to Buy</button>
                <button onClick={() => navigate("/freehold-areas-abu-dhabi")} className="text-left hover:text-[#C9A96E] cursor-pointer">Freehold Zones</button>
              </div>
            </div>

            {/* Column 3b: Area Guides */}
            <div className="md:col-span-2 space-y-4">
              <span className="text-[10px] font-bold text-[#C9A96E] uppercase tracking-widest block">Area Guides</span>
              <div className="flex flex-col space-y-2 text-xs text-gray-300 font-light">
                <button onClick={() => navigate("/saadiyat-island-property-guide")} className="text-left hover:text-[#C9A96E] cursor-pointer">Saadiyat Island</button>
                <button onClick={() => navigate("/yas-island-real-estate")} className="text-left hover:text-[#C9A96E] cursor-pointer">Yas Island</button>
                <button onClick={() => navigate("/al-reem-island-apartments-abu-dhabi")} className="text-left hover:text-[#C9A96E] cursor-pointer">Al Reem Island</button>
                <button onClick={() => navigate("/best-investment-areas-abu-dhabi-2026")} className="text-left hover:text-[#C9A96E] cursor-pointer">Best Areas 2026</button>
                <button onClick={() => navigate("/about")} className="text-left hover:text-[#C9A96E] cursor-pointer">About Us</button>
                <button onClick={() => navigate("/faq")} className="text-left hover:text-[#C9A96E] cursor-pointer">FAQ Center</button>
              </div>
            </div>

            {/* Column 4: Location */}
            <div className="md:col-span-3 space-y-4">
              <span className="text-[10px] font-bold text-[#C9A96E] uppercase tracking-widest block">Address</span>
              <div className="text-xs text-gray-300 font-light space-y-2">
                <p>Tamouh Tower, Al Reem Island, Floor 7</p>
                <p>Abu Dhabi, United Arab Emirates</p>
                <p>PO BOX 38761</p>
                <p className="text-[#C9A96E] hover:underline cursor-pointer block pt-1" onClick={() => navigate("/contact")}>Find us on visual maps →</p>
              </div>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[10px] text-gray-400 font-light gap-4">
            <p>© 2026 AD Residences. All sovereign registry rights reserved.</p>
            <div className="flex items-center space-x-6">
              <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" className="hover:text-[#25D366] transition-colors flex items-center space-x-1">
                <MessageCircle size={12} />
                <span>WhatsApp</span>
              </a>
              <a href="https://www.instagram.com/abresidencies" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Instagram</a>
              <a href="https://www.facebook.com/abresidencies" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Facebook</a>
              <span className="hover:text-white cursor-pointer">Privacy Policy</span>
            </div>
          </div>
        </div>
      </footer>}
      {/* END FOOTER */}

      {/* --- TARGET PROPERTY SPECIFICATION POP-OVER --- */}
      {selectedProperty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedProperty(null)} />
          <div className="relative bg-white w-full max-w-4xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12 max-h-[90vh] md:max-h-[85vh] z-10">
            
            <button 
              onClick={() => { setSelectedProperty(null); handleResetPropertyInquiry(); }}
              className="absolute top-4 right-4 z-20 p-2 bg-white/90 hover:bg-white text-gray-900 border border-[#EAE6DF] rounded-none focus:outline-none cursor-pointer"
              aria-label="Close"
            >
              <X size={15} />
            </button>

            {/* Left Specs Panel: Photo & Sizing (7 cols) */}
            <div className="md:col-span-7 bg-[#F8F6F2] overflow-y-auto flex flex-col justify-between max-h-[45vh] md:max-h-[85vh]">
              <div className="relative aspect-[16/10] md:h-72 lg:h-96">
                <img src={selectedProperty.image} alt={selectedProperty.name} className="w-full h-full object-cover" />
                <div className="absolute bottom-4 left-4">
                  <span className="bg-[#C9A96E] text-white text-[9.5px] font-bold uppercase tracking-widest py-1 px-3">
                    {selectedProperty.badge} Allocation
                  </span>
                </div>
              </div>

              <div className="p-6 sm:p-8 space-y-4">
                <div className="flex items-center space-x-1.5 text-xs text-gray-500 uppercase tracking-widest font-semibold">
                  <MapPin size={12} className="text-[#C9A96E]" />
                  <span>{selectedProperty.location}</span>
                </div>
                <h3 className="font-serif text-2xl font-light text-slate-800 leading-tight">{selectedProperty.name}</h3>
                <p className="text-xs text-gray-600 font-light leading-relaxed">{selectedProperty.description}</p>

                <div className="grid grid-cols-3 gap-2 text-center pt-2">
                  <div className="bg-white py-3 border border-[#EAE6DF] space-y-1">
                    <Bed size={14} className="text-[#C9A96E] mx-auto" />
                    <span className="text-[9px] uppercase text-gray-400 block font-bold">Suites</span>
                    <span className="text-xs font-bold text-gray-950">{selectedProperty.bedrooms} Beds</span>
                  </div>
                  <div className="bg-white py-3 border border-[#EAE6DF] space-y-1">
                    <Bath size={14} className="text-[#C9A96E] mx-auto" />
                    <span className="text-[9px] uppercase text-gray-400 block font-bold">Baths</span>
                    <span className="text-xs font-bold text-gray-950">{selectedProperty.bathrooms} Baths</span>
                  </div>
                  <div className="bg-white py-3 border border-[#EAE6DF] space-y-1">
                    <Maximize2 size={14} className="text-[#C9A96E] mx-auto" />
                    <span className="text-[9px] uppercase text-gray-400 block font-bold font-sans">Area Sizing</span>
                    <span className="text-xs font-bold text-gray-950">{selectedProperty.sizeSqFt.toLocaleString()} sqft</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#EAE6DF] text-right font-sans">
                  <span className="text-[9px] text-gray-400 uppercase tracking-wider block font-bold">Exclusive Premium starting from</span>
                  <span className="text-xl font-serif text-[#C9A96E] font-medium block">{selectedProperty.price}</span>
                </div>
              </div>
            </div>

            {/* Right Forms Panel: Submit Lead Inquiry (5 cols) */}
            <div className="md:col-span-5 p-6 sm:p-8 bg-white border-t md:border-t-0 md:border-l border-[#EAE6DF] flex flex-col justify-between overflow-y-auto max-h-[45vh] md:max-h-[85vh]">
              <div className="space-y-4">
                <div className="space-y-1 border-b border-[#F8F6F2] pb-3">
                  <span className="text-[9px] font-bold text-[#C9A96E] uppercase tracking-widest block font-sans">OFF-MARKET ENQUIRY REGISTER</span>
                  <h4 className="font-serif text-base font-normal text-slate-900 leading-tight">Secure Private Layout Sheets</h4>
                  <p className="text-[10px] text-gray-500 font-light font-sans mt-0.5">Receive floor-plans, exact booking rates, and financing structures.</p>
                </div>

                {!isSubmitPropertyLeadSuccess ? (
                  <form onSubmit={handlePropertyInquirySubmit} className="space-y-4">
                    <div className="space-y-1 relative">
                      <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">Full Name *</label>
                      <input 
                        type="text" 
                        placeholder="e.g., Alexander Romanov"
                        value={propertyFormData.name}
                        onChange={(e) => setPropertyFormData({...propertyFormData, name: e.target.value})}
                        className={`w-full bg-white text-xs py-2 px-1 border-b ${propertyFormErrors.name ? "border-red-500" : "border-[#EAE6DF]"} focus:border-[#C9A96E] focus:outline-none rounded-none text-slate-900`}
                      />
                    </div>
                    <div className="space-y-1 relative">
                      <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">Email Address *</label>
                      <input 
                        type="email" 
                        placeholder="e.g., alexander@romanov-realty.ch"
                        value={propertyFormData.email}
                        onChange={(e) => setPropertyFormData({...propertyFormData, email: e.target.value})}
                        className={`w-full bg-white text-xs py-2 px-1 border-b ${propertyFormErrors.email ? "border-red-500" : "border-[#EAE6DF]"} focus:border-[#C9A96E] focus:outline-none rounded-none text-slate-900`}
                      />
                    </div>
                    <div className="space-y-1 relative">
                      <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">Contact Line *</label>
                      <input 
                        type="tel" 
                        placeholder="e.g., +41 22 999 0011"
                        value={propertyFormData.phone}
                        onChange={(e) => setPropertyFormData({...propertyFormData, phone: e.target.value})}
                        className={`w-full bg-white text-xs py-2 px-1 border-b ${propertyFormErrors.phone ? "border-red-500" : "border-[#EAE6DF]"} focus:border-[#C9A96E] focus:outline-none rounded-none text-slate-900`}
                      />
                    </div>

                    <label className="flex items-start space-x-1.5 cursor-pointer pt-1">
                      <input 
                        type="checkbox" 
                        checked={propertyFormData.consent}
                        onChange={(e) => setPropertyFormData({...propertyFormData, consent: e.target.checked})}
                        className="mt-0.5 border border-gray-300 rounded-none text-[#1C2B4A] focus:ring-[#C9A96E]"
                      />
                      <span className="text-[9px] text-gray-400 font-light leading-snug">Agree to portfolio advisors coordinating files.</span>
                    </label>

                    <button 
                      type="submit"
                      disabled={isSubmittingPropertyLead}
                      className="w-full bg-[#1C2B4A] hover:bg-[#131E33] text-white text-[9.5px] font-bold tracking-widest uppercase py-3 border border-[#1C2B4A] transition-all rounded-none mt-2 flex items-center justify-center space-x-1 cursor-pointer"
                    >
                      {isSubmittingPropertyLead ? (
                        <>
                          <Loader2 size={12} className="animate-spin text-[#C9A96E]" />
                          <span>DISPATCHING BRIEF...</span>
                        </>
                      ) : (
                        <span>SECURE BRIEF</span>
                      )}
                    </button>
                  </form>
                ) : (
                  <div className="text-center py-6 space-y-4">
                    <div className="inline-flex p-2 bg-[#F4FAF6] text-[#25D366] border border-[#E1F0E3]">
                      <Check size={20} />
                    </div>
                    <p className="text-xs font-bold text-slate-800">Unit Coordinates Reserved</p>
                    <p className="text-[10px] text-gray-500 font-light leading-relaxed">
                      Floor sheets and reservation forms are packaged. Let our designated officer transmit files to {propertyFormData.email} shortly.
                    </p>
                    <button 
                      onClick={handleResetPropertyInquiry}
                      className="bg-[#F8F6F2] hover:bg-[#EAE6DF] text-[9px] text-[#1A1A1A] font-bold tracking-widest uppercase py-2 px-4 border border-[#EAE6DF] rounded-none w-full"
                    >
                      SUBMIT OTHER LINE
                    </button>
                  </div>
                )}
              </div>

              <div className="border-t border-[#F8F6F2] pt-4 mt-6">
                <span className="text-[8px] text-gray-400 uppercase tracking-widest block mb-2 text-center font-bold">Instant Video view via Whatsapp</span>
                <button 
                  onClick={() => handleWhatsAppClick(`Hello, I am interested in property: ${selectedProperty.name} priced at ${selectedProperty.price}. Please schedule a video brief.`)}
                  className="w-full bg-[#25D366] hover:bg-[#20ba59] text-white text-[9px] font-bold tracking-widest uppercase py-2 flex items-center justify-center space-x-2 rounded-none cursor-pointer"
                >
                  <MessageCircle size={12} />
                  <span>BOOK DIGITAL WALKTHROUGH</span>
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* --- CALL BACK QUICK DIALOG POP-OVER --- */}
      {isCallbackModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setIsCallbackModalOpen(false)} />
          <div className="relative bg-white w-full max-w-[360px] p-6 shadow-2xl border-t-4 border-[#C9A96E] z-10">
            <button onClick={() => setIsCallbackModalOpen(false)} className="absolute top-3 right-3 text-gray-400 hover:text-gray-900 focus:outline-none cursor-pointer">
              <X size={15} />
            </button>

            <div className="space-y-4">
              <div className="text-center space-y-1">
                <Phone size={24} className="mx-auto text-[#1C2B4A] mb-1" />
                <h4 className="font-serif text-xl font-normal text-slate-900">VIP Call Back Channel</h4>
                <p className="text-[10px] text-gray-500 font-light font-sans font-light leading-normal">
                  Our direct patch bridge connects your line with our head advisor in under 5 minutes.
                </p>
              </div>

              {!callbackSubmitted ? (
                <form onSubmit={handleCallbackSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">Active Line Number with Country Code</label>
                    <input 
                      type="tel"
                      placeholder="e.g., +971 50 000 0000"
                      value={callbackNumber}
                      onChange={(e) => setCallbackNumber(e.target.value)}
                      className={`w-full text-xs text-center font-medium bg-[#F8F6F2] py-2 px-3 border-b-2 ${callbackError ? "border-red-500" : "border-[#EAE6DF] focus:border-[#C9A96E]"} focus:outline-none rounded-none text-slate-900`}
                      autoFocus
                    />
                    {callbackError && <p className="text-[8px] text-red-500 text-center font-semibold">Please enter a valid line number</p>}
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-[#1C2B4A] hover:bg-[#131E33] text-white text-[10px] font-bold tracking-widest uppercase py-2.5 rounded-none transition-colors cursor-pointer"
                  >
                    PATCH CALL TO MOBILE
                  </button>
                </form>
              ) : (
                <div className="text-center py-4 space-y-3">
                  <div className="inline-flex p-2 bg-[#F4FAF6] border border-[#E1F0E3] text-[#25D366]">
                    <Check size={16} />
                  </div>
                  <p className="text-xs font-bold text-slate-900">Connecting Patch Line...</p>
                  <p className="text-[10px] text-gray-500 leading-normal font-light">
                    Your request is patched. Keep your line open. Our broker coordinator will reach out immediately.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
