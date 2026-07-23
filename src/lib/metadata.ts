import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "./constants";
import { SITE_IMAGES } from "./site-images";

type PageMeta = {
  title: string;
  description: string;
  keyword: string;
  path: string;
};

export function buildMetadata({
  title,
  description,
  keyword,
  path,
}: PageMeta): Metadata {
  const url = `${SITE_URL}${path}`;
  const fullTitle =
    path === "/" ? title : `${title} | ${SITE_NAME}`;

  return {
    // absolute: the root layout already has a `%s | SITE_NAME` template, which
    // was double-appending the brand ("… | Majestic Pine | Majestic Pine")
    title: { absolute: fullTitle },
    description,
    keywords: [keyword, "Minnesota contractor", "Twin Cities remodeling"],
    alternates: { canonical: url },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: SITE_NAME,
      locale: "en_US",
      type: "website",
      images: [
        {
          url: `${SITE_URL}${SITE_IMAGES.ogDefault}`,
          width: 1200,
          height: 630,
          alt: SITE_NAME,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [`${SITE_URL}${SITE_IMAGES.ogDefault}`],
    },
  };
}

export const PAGE_META = {
  home: {
    title: "Majestic Pine Renovations",
    description: "Luxury General Contractor in Minneapolis",
    keyword: "Twin Cities home renovation",
    path: "/",
  },
  about: {
    title: "About Jeremy Stoesz & Majestic Pine Renovations",
    description:
      "Discover the craftsmanship, integrity, and Minnesota roots behind Majestic Pine Renovations.",
    keyword: "Buffalo MN remodeling company",
    path: "/about-us",
  },
  commercial: {
    title: "Commercial Construction & Remodeling Minneapolis, MN",
    description:
      "Scalable commercial construction and remodeling for medical, office, retail, and multi-unit projects.",
    keyword: "Commercial contractor Minnesota",
    path: "/commercial-contracting-minnesota",
  },
  ourWork: {
    title: "Our Project Gallery",
    description:
      "Browse real Majestic Pine Renovations project photos — kitchens, bathrooms, basements, decks, lake homes, roofing, siding, and more across Minnesota.",
    keyword: "Majestic Pine project gallery",
    path: "/our-work",
  },
  services: {
    title: "Comprehensive Construction Solutions",
    description:
      "Explore luxury remodeling, additions, outdoor living, and specialty construction services.",
    keyword: "construction services Minnesota",
    path: "/services",
  },
  financing: {
    title: "Luxury Remodeling, Intelligently Financed",
    description:
      "Flexible financing options for residential remodels and commercial build-outs.",
    keyword: "home remodeling financing Minnesota",
    path: "/financing",
  },
  contact: {
    title: "Initiate Your Project",
    description:
      "Start your project with Majestic Pine Renovations in Buffalo, Minneapolis, and the Twin Cities.",
    keyword: "Minneapolis contractor contact",
    path: "/contact",
  },
} as const;
