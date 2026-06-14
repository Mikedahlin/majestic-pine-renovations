export const SITE_NAME = "Majestic Pine Renovations";
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://majesticpinerenovations.com";

export const CONTACT = {
  headquarters: "196 Carling Ave SE, Buffalo, MN 55313",
  serviceArea: "Buffalo, the Twin Cities, and the Whitefish Chain area",
  phone: "(612) 363-2614",
  email: "majesticpinerenovations@gmail.com",
} as const;

export const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about-us" },
  { label: "Commercial", href: "/commercial-contracting-minnesota" },
  { label: "Services", href: "/services" },
  { label: "Contact", href: "/contact" },
] as const;

export const TRUST_BADGES = [
  "30+ Years of Hands-On Experience",
  "Experience You Can Trust",
  "Built for Minnesota Weather",
] as const;

export const CUSTOM_BUDGET_RANGE = "Other / Custom";

export const BUDGET_RANGES = [
  "$10k-$25k",
  "$25k-$50k",
  "$50k-$100k",
  "$100k-$250k",
  "$250k+",
  CUSTOM_BUDGET_RANGE,
] as const;

export const PROJECT_CATEGORIES = [
  "Residential",
  "Commercial",
  "Exterior",
  "Cabin / Lake Home",
] as const;
