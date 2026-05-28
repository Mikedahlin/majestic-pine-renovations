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
      addressLocality: "Buffalo",
      addressRegion: "MN",
      addressCountry: "US",
    },
    areaServed: [
      "Minneapolis",
      "Saint Paul",
      "Buffalo",
      "Twin Cities Metro",
      "Greater Minnesota",
    ],
    priceRange: "$$$$",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "5",
      reviewCount: "47",
      bestRating: "5",
    },
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

export function reviewSchema(
  reviews: {
    author: string;
    rating: number;
    text: string;
    date: string;
  }[],
) {
  return reviews.map((review) => ({
    "@context": "https://schema.org",
    "@type": "Review",
    author: { "@type": "Person", name: review.author },
    reviewRating: {
      "@type": "Rating",
      ratingValue: review.rating,
      bestRating: 5,
    },
    reviewBody: review.text,
    datePublished: review.date,
    itemReviewed: {
      "@type": "ConstructionCompany",
      name: SITE_NAME,
    },
  }));
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
