// Coordinates geocoded from OpenStreetMap (Nominatim) on 2026-09-21. Used only to compute
// straight-line distances for proximity pages. Missing entries (Arc Tower, Najmat towers,
// Pixel, Hydra Avenue, Al Maryah Vista) could not be geocoded and are never given a distance.
export const coords: Record<string, { lat: number; lon: number }> = {
  sorbonne: { lat: 24.4888403, lon: 54.4119207 },
  "reem-mall": { lat: 24.4884209, lon: 54.4005842 },
  "reem-central-park": { lat: 24.5058487, lon: 54.4085019 },
  "makers-district": { lat: 24.5053355, lon: 54.4163837 },
  "galleria-al-maryah": { lat: 24.501449, lon: 54.3890553 },
  "cleveland-clinic": { lat: 24.4970572, lon: 54.3878835 },
  "adgm-square": { lat: 24.4994642, lon: 54.3887379 },
  // projects (keys are project slugs)
  "the-gate-towers-shams-abu-dhabi": { lat: 24.4941349, lon: 54.4076169 },
  "sun-and-sky-towers-shams-abu-dhabi": { lat: 24.4961278, lon: 54.4076828 },
  "mangrove-place-shams-abu-dhabi": { lat: 24.497037, lon: 54.4087952 },
  "park-view-tower-shams-abu-dhabi": { lat: 24.5043735, lon: 54.4093291 },
  "tala-tower-marina-square": { lat: 24.4917428, lon: 54.3927249 },
  "burooj-views-marina-square": { lat: 24.4922573, lon: 54.3940111 },
  "sigma-towers-city-of-lights": { lat: 24.4991223, lon: 54.4042335 },
  "reem-hills": { lat: 24.4812763, lon: 54.4188794 },
};

export function km(a: { lat: number; lon: number }, b: { lat: number; lon: number }): number {
  const R = 6371;
  const rad = (d: number) => (d * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat);
  const dLon = rad(b.lon - a.lon);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

// Straight-line distance in km from a landmark to a project, or null when we have no coordinates.
export function distanceKm(landmark: string, projectSlug: string): number | null {
  const a = coords[landmark];
  const b = coords[projectSlug];
  return a && b ? Math.round(km(a, b) * 10) / 10 : null;
}
