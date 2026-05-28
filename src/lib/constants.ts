export const SITE_NAME = "Majestic Pine Renovations";
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://majesticpinerenovations.com";

export const CONTACT = {
  headquarters: "Buffalo, MN",
  serviceArea:
    "Minneapolis, Saint Paul, Twin Cities Metro, Greater Minnesota",
  phone: "(612) 555-0147",
  email: "hello@majesticpinerenovations.com",
} as const;

export const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about-us" },
  { label: "Commercial", href: "/commercial-contracting-minnesota" },
  { label: "Services", href: "/services" },
  { label: "Financing", href: "/financing" },
  { label: "Contact", href: "/contact" },
] as const;

export const TRUST_BADGES = [
  "Fully Licensed & Insured",
  "5-Star Google Rated",
  "Serving Greater Minnesota",
] as const;

export const BUDGET_RANGES = [
  "$50k–$100k",
  "$100k–$250k",
  "$250k+",
] as const;

export const PROJECT_CATEGORIES = [
  "Residential",
  "Commercial",
  "Exterior",
] as const;
