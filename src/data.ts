import { Property, StatItem, LifestyleItem } from "./types";

export const propertiesData: Property[] = [
  {
    id: "prop-1",
    name: "The Grove Beachfront Penthouse",
    location: "Saadiyat Island, Abu Dhabi",
    price: "AED 4,800,000",
    priceNumeric: 4800000,
    type: "Penthouse",
    area: "Saadiyat Island",
    badge: "Off-Plan",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=80",
    bedrooms: 3,
    bathrooms: 4,
    sizeSqFt: 3450,
    description: "Nestled in the prestigious cultural district of Saadiyat Island, this beachfront haven features floor-to-ceiling windows with unobstructed Louvre Abu Dhabi and Arabian Gulf views."
  },
  {
    id: "prop-2",
    name: "Yas Azure Waterfront Villa",
    location: "Yas Island, Abu Dhabi",
    price: "AED 8,500,000",
    priceNumeric: 8500000,
    type: "Villa",
    area: "Yas Island",
    badge: "Ready",
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&auto=format&fit=crop&q=80",
    bedrooms: 5,
    bathrooms: 6,
    sizeSqFt: 6200,
    description: "An architecturally stunning 5-bedroom villa on the canal edge. Highlights include a private yacht berth, custom infinity pool, state-of-the-art cinema, and premium marble finishes."
  },
  {
    id: "prop-3",
    name: "Marina Height Sky Mansion",
    location: "Al Reem Island, Abu Dhabi",
    price: "AED 12,200,000",
    priceNumeric: 12200000,
    type: "Mansion",
    area: "Al Reem Island",
    badge: "Ready",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&auto=format&fit=crop&q=80",
    bedrooms: 6,
    bathrooms: 7,
    sizeSqFt: 8900,
    description: "A crowning architectural achievement soaring over Al Reem Island. Triplex mansion featuring 360-degree skyline views, personal elevator, private rooftop helipad access, and wellness spa."
  },
  {
    id: "prop-4",
    name: "The Sanctuary Lagoon Estate",
    location: "Ramhan Island, Abu Dhabi",
    price: "AED 14,500,000",
    priceNumeric: 14500000,
    type: "Villa",
    area: "Ramhan Island",
    badge: "Off-Plan",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&auto=format&fit=crop&q=80",
    bedrooms: 5,
    bathrooms: 6,
    sizeSqFt: 7500,
    description: "An absolute masterwork of natural luxury. This private island estate features custom sand estuaries, private private beach cove, infinity edge water access, and lush exotic gardens."
  },
  {
    id: "prop-5",
    name: "Jumeirah Residences",
    location: "Al Maryah Island, Abu Dhabi",
    price: "AED 7,200,000",
    priceNumeric: 7200000,
    type: "Penthouse",
    area: "Al Maryah Island",
    badge: "Off-Plan",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&auto=format&fit=crop&q=80",
    bedrooms: 3,
    bathrooms: 3.5,
    sizeSqFt: 3100,
    description: "A breathtaking masterpiece of architectural sophistication located on the exclusive Al Maryah Island waterfront. Built in partnership with elite visionaries, offering bespoke glass balconies, high-end private wellness services, and legendary Jumeirah hospitality."
  },
  {
    id: "prop-6",
    name: "Al Raha Cove Townhomes",
    location: "Al Raha Beach, Abu Dhabi",
    price: "AED 3,950,000",
    priceNumeric: 3950000,
    type: "Apartment",
    area: "Al Raha Beach",
    badge: "Ready",
    image: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=1200&auto=format&fit=crop&q=80",
    bedrooms: 2,
    bathrooms: 3,
    sizeSqFt: 2100,
    description: "A tranquil sanctuary overlooking Al Raha's tranquil blue inlets. Walkout terrace, European kitchen appliances, master suite walk-in closet, and premium direct access to beach walks."
  }
];

export const statItems: StatItem[] = [
  { number: "500+", label: "PROPERTIES IN PORTFOLIO" },
  { number: "AED 2B+", label: "ACTIVE TRANSACTION PORTFOLIO" },
  { number: "98%", label: "DISCERNING CLIENT SATISFACTION" },
  { number: "12+", label: "YEARS OF ADVISORY EXCELLENCE" }
];

export const lifestyleItems: LifestyleItem[] = [
  {
    id: "life-1",
    title: "PRIVATE MARINA & CANAL LIFE",
    location: "YAS ISLAND",
    image: "https://images.unsplash.com/photo-1519449556851-5720b33024e7?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: "life-2",
    title: "DISCERNING PRIVATE DINING",
    location: "AL MARYAH ISLAND",
    image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: "life-3",
    title: "EXQUISITE CULTURAL LANDMARKS",
    location: "SAADIYAT ISLAND",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: "life-4",
    title: "WELLNESS & SPA SANCTUARY",
    location: "RAMHAN ISLAND",
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: "life-5",
    title: "ARCHITECTURAL STATEMENTS",
    location: "AL REEM HEIGHTS",
    image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&auto=format&fit=crop&q=80"
  }
];
