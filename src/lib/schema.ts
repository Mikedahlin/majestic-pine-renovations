import { CONTACT, SITE_NAME, SITE_URL } from "./constants";

export function localBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "ConstructionCompany"],
    name: SITE_NAME,
    url: SITE_URL,
    telephone: CONTACT.phone,
    email: CONTACT.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: "196 Carling Ave SE",
      addressLocality: "Buffalo",
      addressRegion: "MN",
      postalCode: "55313",
      addressCountry: "US",
    },
    areaServed: [
      "Minneapolis",
      "Saint Paul",
      "Buffalo",
      "Whitefish Chain of Lakes",
      "Twin Cities Metro",
    ],
    priceRange: "$$-$$$$",
    sameAs: [],
  };
}

export function serviceSchema(name: string, description: string, url: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    provider: {
      "@type": "ConstructionCompany",
      name: SITE_NAME,
      url: SITE_URL,
    },
    areaServed: {
      "@type": "State",
      name: "Minnesota",
    },
    url: `${SITE_URL}${url}`,
  };
}

export function faqSchema(
  items: { question: string; answer: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function contactPageSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact Majestic Pine Renovations",
    url: `${SITE_URL}/contact`,
    mainEntity: {
      "@type": "ConstructionCompany",
      name: SITE_NAME,
      telephone: CONTACT.phone,
      email: CONTACT.email,
    },
  };
}
