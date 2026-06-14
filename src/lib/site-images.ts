/** Real project photography — client downloads in /public/project-gallery */
import { FEATURED_IMAGES } from "./project-gallery";

export const SITE_IMAGES = {
  homeHero: FEATURED_IMAGES.kitchenHero,
  homeBrand: FEATURED_IMAGES.kitchenAccent,
  aboutHero: FEATURED_IMAGES.livingRoomHero,
  contactHero: FEATURED_IMAGES.contactHero,
  servicesHero: FEATURED_IMAGES.deckHero,
  financingHero: FEATURED_IMAGES.commercialDetail,
  ogDefault: FEATURED_IMAGES.kitchenHero,
} as const;
