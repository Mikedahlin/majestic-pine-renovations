import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "./constants";

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
    title: fullTitle,
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
          url: `${SITE_URL}/og-default.jpg`,
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
      images: [`${SITE_URL}/og-default.jpg`],
    },
  };
}

export const PAGE_META = {
  home: {
    title: "Majestic Pine Renovations",
    description:
      "Remodeling and construction for homes, cabins, and commercial spaces across Buffalo, the Twin Cities, and the Whitefish Chain area.",
    keyword: "Buffalo MN remodeling contractor",
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
    title: "Commercial Construction & Remodeling in Minnesota",
    description:
      "Scalable commercial construction and remodeling for medical, office, retail, and multi-unit projects.",
    keyword: "Commercial contractor Minnesota",
    path: "/commercial-contracting-minnesota",
  },
  services: {
    title: "Remodeling, Exterior Work & Custom Builds",
    description:
      "Explore remodeling, additions, outdoor living, cabin-focused upgrades, and specialty construction services.",
    keyword: "construction services Minnesota",
    path: "/services",
  },
  contact: {
    title: "Talk With Majestic Pine Renovations",
    description:
      "Start your project with Majestic Pine Renovations in Buffalo, the Twin Cities, and the Whitefish Chain area.",
    keyword: "Buffalo contractor contact",
    path: "/contact",
  },
} as const;
