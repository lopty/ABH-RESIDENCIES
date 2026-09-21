import { Property } from "../../types";
import { areas, projects, UnitType } from "./projectsData";

const label: Record<UnitType, string> = {
  studio: "Studio",
  apartment: "Apartment",
  penthouse: "Penthouse",
  villa: "Villa",
  townhouse: "Townhouse",
};

function bedsLabel(beds: number[]): string {
  const b = [...new Set(beds)].sort((x, y) => x - y);
  if (b.length === 0) return "Layouts on request";
  const fmt = (n: number) => (n === 0 ? "Studio" : `${n}`);
  if (b.length === 1) return b[0] === 0 ? "Studio" : `${b[0]} Bed`;
  return `${fmt(b[0])} to ${b[b.length - 1]} Beds`;
}

// The /buy catalogue is generated from the same verified project data as the
// project pages, so every card links to a real, indexable page.
export const catalogueProperties: Property[] = projects.map((p) => {
  const a = areas[p.area];
  return {
    id: p.slug,
    name: p.name,
    location: p.community ? `${p.community}, ${a.name}` : a.name,
    price: p.startingPrice ? `From ${p.startingPrice}` : "Price on request",
    priceNumeric: 0,
    type: p.units.includes("villa") ? "Villa" : p.units.includes("apartment") ? "Apartment" : label[p.units[0]],
    area: a.name,
    badge: p.status === "off-plan" ? "Off-Plan" : "Ready",
    image: p.images?.[0] ?? "",
    bedrooms: p.beds.length ? Math.max(...p.beds) : 0,
    bathrooms: 0,
    sizeSqFt: 0,
    description: p.overview || p.bedroomsText,
    href: p.existingHref ?? `/projects/${p.slug}`,
    developer: p.developer.split(" (")[0],
    bedsLabel: bedsLabel(p.beds),
    sizeLabel: p.sizeRange ?? "On request",
    unitTypes: p.units.map((u) => label[u]),
    branded: p.branded,
  };
});
