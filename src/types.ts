export interface Property {
  id: string;
  name: string;
  location: string;
  price: string;
  priceNumeric: number; // For search/filter
  type: "Apartment" | "Penthouse" | "Villa" | "Mansion";
  area: "Saadiyat Island" | "Yas Island" | "Al Reem Island" | "Ramhan Island" | "Al Maryah Island" | "Al Raha Beach";
  badge: "Off-Plan" | "Ready";
  image: string;
  bedrooms: number;
  bathrooms: number;
  sizeSqFt: number;
  description: string;
}

export interface StatItem {
  number: string;
  label: string;
}

export interface LifestyleItem {
  id: string;
  title: string;
  location: string;
  image: string;
}

export interface LeadFormData {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  nationality: string;
  budgetRange: string;
  propertyInterest: string;
  message?: string;
  consent: boolean;
  createdAt?: string;
}
