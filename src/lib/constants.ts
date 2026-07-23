export const SITE_NAME = "Majestic Pine Renovations";
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://majesticpinerenovations.com";

export const CONTACT = {
  headquarters: "Buffalo, MN",
  streetAddress: "196 Carling Ave SE",
  serviceArea:
    "Minneapolis, Saint Paul, Twin Cities Metro, Greater Minnesota",
  phone: "(612) 363-2614",
  email: "majesticpinerenovations@gmail.com",
} as const;

/** Official Facebook Page (Majestic Pine Renovations llc) */
export const FACEBOOK_URL =
  "https://www.facebook.com/profile.php?id=100039631675960";

export const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "Our Work", href: "/our-work" },
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
] as const;
