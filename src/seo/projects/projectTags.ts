// Verified attributes used to build the lifestyle inventory pages. A project is only
// tagged when a developer page, a press release or a named map source supports it.
export const projectTags: Record<string, string[]> = {
  // Reem Mall sits in Najmat Abu Dhabi
  "najmat-towers-al-reem-island": ["near-reem-mall"],
  // Next to Al Reem Central Park (Park View's own site) and Makers District (adjacent to the park)
  "park-view-tower-shams-abu-dhabi": ["near-central-park"],
  "pixel-makers-district": ["near-central-park"],
  // Terraces stated by the developer
  "hilton-residences-al-raha": ["terraces", "waterfront", "low-rise"],
  "jumeirah-residences-al-maryah-island": ["terraces", "waterfront"],
  // Waterfront settings stated by the developer or master developer
  "al-maryah-vista": ["waterfront"],
  "w-residences-al-maryah-island": ["waterfront"],
  "nobu-residences-saadiyat-island": ["waterfront"],
  "four-seasons-private-residences-saadiyat-beach": ["waterfront", "low-rise"],
  // Low-rise homes (villas, townhouses) rather than towers
  "reem-hills": ["low-rise"],
  "mangrove-place-shams-abu-dhabi": ["low-rise"],
  "stellar-by-elie-saab-yas-island": ["low-rise"],
};

export const hasTag = (slug: string, tag: string) => (projectTags[slug] ?? []).includes(tag);
