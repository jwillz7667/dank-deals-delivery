// URL-friendly city slugs
export const cities = [
  "minneapolis",
  "st-paul",
  "bloomington",
  "edina",
  "minnetonka",
  "plymouth",
  "maple-grove",
  "eden-prairie",
  "burnsville",
  "woodbury",
  "eagan",
  "coon-rapids",
  // Additional cities for expanded reach:
  "lakeville",
  "shakopee",
  "chanhassen",
  "stillwater",
  "white-bear-lake",
  "richfield",
  "roseville",
  "brooklyn-park",
]

// Helper to format slugs for display (e.g., "st-paul" -> "St. Paul")
export function formatCityName(slug: string): string {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}
