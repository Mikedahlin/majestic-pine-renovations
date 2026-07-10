import {
  FEATURED_IMAGES,
  galleryFor,
  galleryForService,
  photoList,
} from "./project-gallery";

export type ServiceDefinition = {
  slug: string;
  title: string;
  headline: string;
  description: string;
  process: string[];
  benefits: string[];
  heroImage: string;
  galleryImage: string;
  photos: {
    image: string;
    position?: string;
  }[];
  beforeAfter?: {
    before: string;
    after: string;
    beforeLabel?: string;
    afterLabel?: string;
  }[];
  imagePosition?: string;
  galleryTitle?: string;
  gallerySubtitle?: string;
  galleryVariant?: "standard" | "premium";
  keyword: string;
  metaDescription: string;
  featured?: boolean;
};

export const CORE_SERVICES = [
  {
    title: "Luxury Remodeling",
    description:
      "Kitchens, bathrooms, and whole-home transformations.",
    href: "/services/kitchen-remodeling",
    icon: "remodel",
    image: FEATURED_IMAGES.kitchenHero,
  },
  {
    title: "Commercial Build-Outs",
    description:
      "Hospitals, retail, and office renovations engineered for operational flow.",
    href: "/commercial-contracting-minnesota",
    icon: "commercial",
    image: FEATURED_IMAGES.commercialHero,
  },
  {
    title: "Custom Additions & Garages",
    description:
      "Expanding your footprint with seamless architectural integration.",
    href: "/services/additions",
    icon: "addition",
    image: FEATURED_IMAGES.additionHero,
  },
  {
    title: "Outdoor Living",
    description:
      "Premium decks, patios, and exterior renovations built for the Minnesota climate.",
    href: "/services/decks-outdoor-living",
    icon: "outdoor",
    image: FEATURED_IMAGES.deckHero,
  },
] as const;

export const SERVICES: ServiceDefinition[] = [
  {
    slug: "kitchen-remodeling",
    title: "Kitchen Remodeling",
    headline: "KITCHENS DESIGNED FOR HOW YOU LIVE.",
    description:
      "From custom cabinetry to premium appliance integration, we transform kitchens into the heart of your home with commercial-grade precision and artisan finish work.",
    process: [
      "In-home consultation and spatial assessment",
      "3D design visualization and material selection",
      "Permitting, demolition, and structural coordination",
      "Custom build, inspection, and final walkthrough",
    ],
    benefits: [
      "Custom cabinetry and millwork",
      "Premium countertop and tile installation",
      "Lighting and electrical upgrades",
      "Seamless appliance integration",
    ],
    heroImage: FEATURED_IMAGES.kitchenHero,
    galleryImage: FEATURED_IMAGES.kitchenDetail,
    photos: photoList(galleryForService("kitchen-remodeling")),
    imagePosition: "center center",
    keyword: "kitchen remodeling Minneapolis",
    metaDescription:
      "Luxury kitchen remodeling in Minneapolis and the Twin Cities. Custom cabinetry, premium finishes, and transparent project management.",
    featured: true,
  },
  {
    slug: "bathroom-remodeling",
    title: "Bathroom Remodeling",
    headline: "SPA-QUALITY BATHROOMS, ENGINEERED TO LAST.",
    description:
      "We deliver watertight, code-compliant bathroom renovations with heated floors, custom tile, and fixtures selected for both beauty and durability in Minnesota climates.",
    process: [
      "Scope definition and moisture assessment",
      "Design layout and fixture specification",
      "Plumbing, electrical, and waterproofing",
      "Tile, trim, and final commissioning",
    ],
    benefits: [
      "Walk-in showers and soaking tubs",
      "Heated flooring systems",
      "Custom vanity and storage solutions",
      "Ventilation and moisture control",
    ],
    heroImage: FEATURED_IMAGES.bathroomHero,
    galleryImage: FEATURED_IMAGES.bathroomDetail,
    photos: photoList(galleryFor("bathroom")),
    imagePosition: "center center",
    keyword: "bathroom remodeling Twin Cities",
    metaDescription:
      "Premium bathroom remodeling across Minneapolis, Buffalo, and the Twin Cities. Spa-quality finishes with rigorous waterproofing standards.",
    featured: true,
  },
  {
    slug: "basement-finishing",
    title: "Basement Finishing",
    headline: "UNLOCK YOUR HOME'S FULL POTENTIAL.",
    description:
      "Transform unfinished basements into livable square footage — home theaters, guest suites, and multi-generational spaces built with proper insulation and egress compliance.",
    process: [
      "Moisture testing and structural review",
      "Egress planning and permit submission",
      "Framing, insulation, and mechanical rough-in",
      "Drywall, flooring, and finish carpentry",
    ],
    benefits: [
      "Egress windows and code compliance",
      "Soundproofing and insulation upgrades",
      "Wet bar and entertainment builds",
      "In-floor heat and humidity control",
    ],
    heroImage: FEATURED_IMAGES.basementHero,
    galleryImage: FEATURED_IMAGES.basementHero,
    photos: photoList(galleryForService("basement-finishing")),

    imagePosition: "center center",
    keyword: "basement finishing Minnesota",
    metaDescription:
      "Professional basement finishing in Minnesota. Egress-compliant builds, entertainment spaces, and guest suites with premium craftsmanship.",
    featured: true,
  },
  {
    slug: "decks-outdoor-living",
    title: "Decks & Outdoor Living",
    headline: "OUTDOOR SPACES BUILT FOR MINNESOTA SEASONS.",
    description:
      "Composite decking, covered patios, pergolas, and outdoor kitchens engineered to withstand freeze-thaw cycles while extending your living space year-round.",
    process: [
      "Site survey and drainage evaluation",
      "Material selection and structural engineering",
      "Footings, framing, and weatherproofing",
      "Railings, lighting, and finishing details",
    ],
    benefits: [
      "Composite and hardwood decking",
      "Covered patios and pergolas",
      "Outdoor kitchens and fire features",
      "Snow-load rated structural design",
    ],
    heroImage: FEATURED_IMAGES.deckHero,
    galleryImage: FEATURED_IMAGES.deckDetail,
    photos: photoList([
      ...galleryFor("deck"),
      ...galleryFor("docks"),
      ...galleryFor("lake-cabin"),
    ]),

    imagePosition: "center center",
    keyword: "deck builder Twin Cities",
    metaDescription:
      "Premium deck and outdoor living construction in the Twin Cities. Built for Minnesota weather with composite, hardwood, and covered patio options.",
    featured: true,
  },
  {
    slug: "roofing",
    title: "Roofing",
    headline: "PROTECTION THAT PERFORMS IN EVERY SEASON.",
    description:
      "Architectural shingle, metal, and flat roofing systems installed with ice-and-water shield, proper ventilation, and manufacturer warranty compliance.",
    process: [
      "Roof inspection and material recommendation",
      "Tear-off and decking repair as needed",
      "Underlayment, flashing, and installation",
      "Final inspection and warranty registration",
    ],
    benefits: [
      "Architectural and designer shingles",
      "Metal and standing seam options",
      "Ice dam prevention systems",
      "Manufacturer-backed warranties",
    ],
    heroImage: FEATURED_IMAGES.roofingHero,
    galleryImage: FEATURED_IMAGES.roofingDetail,
    photos: photoList(galleryFor("roofing")),
    imagePosition: "center center",
    keyword: "roofing contractor Minnesota",
    metaDescription:
      "Expert roofing services in Minnesota. Architectural shingles, metal roofing, and ice-dam prevention for Twin Cities homes.",
  },
  {
    slug: "siding",
    title: "Siding",
    headline: "CURB APPEAL WITH LASTING PROTECTION.",
    description:
      "Fiber cement, engineered wood, and premium siding systems that elevate aesthetics while defending against Minnesota's harsh weather.",
    process: [
      "Exterior assessment and material selection",
      "Sheathing repair and weather barrier",
      "Siding installation and trim detailing",
      "Paint, caulk, and final quality check",
    ],
    benefits: [
      "Fiber cement and engineered wood",
      "Custom trim and accent details",
      "Insulated siding options",
      "Color-matched finishing",
    ],
    heroImage: FEATURED_IMAGES.sidingHero,
    galleryImage: FEATURED_IMAGES.sidingDetail,
    photos: photoList(galleryFor("siding")),
    imagePosition: "center center",
    keyword: "siding installation Minneapolis",
    metaDescription:
      "Premium siding installation in Minneapolis and Buffalo, MN. Fiber cement, engineered wood, and custom trim for lasting curb appeal.",
  },
  {
    slug: "custom-carpentry",
    title: "Custom Carpentry",
    headline: "ARTISAN DETAIL IN EVERY JOINT.",
    description:
      "Built-ins, mantels, wainscoting, and bespoke woodwork crafted by skilled carpenters who treat every detail as a signature element.",
    process: [
      "Design consultation and shop drawings",
      "Material sourcing and milling",
      "On-site fabrication and installation",
      "Sanding, staining, and final adjustment",
    ],
    benefits: [
      "Built-in shelving and media walls",
      "Custom mantels and trim packages",
      "Staircase and railing fabrication",
      "Historic restoration carpentry",
    ],
    heroImage: FEATURED_IMAGES.cabinetryHero,
    galleryImage: FEATURED_IMAGES.cabinetryDetail,
    photos: photoList(galleryForService("custom-carpentry")),
    imagePosition: "center center",
    keyword: "custom carpentry Minnesota",
    metaDescription:
      "Custom carpentry and millwork in the Twin Cities. Built-ins, mantels, trim packages, and artisan woodwork for luxury homes.",
  },
  {
    slug: "additions",
    title: "Home Additions",
    headline: "EXPAND YOUR FOOTPRINT WITHOUT COMPROMISE.",
    description:
      "Second-story additions, bump-outs, and full-scale expansions designed to blend seamlessly with your existing architecture.",
    process: [
      "Feasibility study and zoning review",
      "Architectural plans and permitting",
      "Foundation, framing, and envelope work",
      "Interior finish matching existing home",
    ],
    benefits: [
      "Second-story and bump-out additions",
      "Structural engineering coordination",
      "Seamless exterior matching",
      "Full interior finish integration",
    ],
    heroImage: FEATURED_IMAGES.additionHero,
    galleryImage: FEATURED_IMAGES.additionDetail,
    photos: photoList(galleryForService("additions")),
    imagePosition: "center center",
    keyword: "home additions Minneapolis",
    metaDescription:
      "Luxury home additions in Minneapolis and the Twin Cities. Second-story builds, bump-outs, and seamless architectural integration.",
  },
  {
    slug: "garage-builds",
    title: "Garage Builds",
    headline: "PREMIUM GARAGES BUILT TO YOUR SPEC.",
    description:
      "Detached and attached garages with heated floors, workshop layouts, and EV-ready electrical — built with the same standards as our residential projects.",
    process: [
      "Site planning and utility routing",
      "Foundation and slab preparation",
      "Framing, roofing, and envelope",
      "Electrical, insulation, and finishes",
    ],
    benefits: [
      "Heated slab and insulation packages",
      "Workshop and storage layouts",
      "EV charger pre-wiring",
      "Overhead door and opener install",
    ],
    heroImage: FEATURED_IMAGES.additionHero,
    galleryImage: FEATURED_IMAGES.cabinetryDetail,
    photos: photoList(galleryForService("garage-builds")),
    imagePosition: "center center",
    keyword: "garage builder Minnesota",
    metaDescription:
      "Custom garage construction in Minnesota. Heated floors, workshop layouts, and EV-ready builds for Twin Cities homeowners.",
  },
];

export function getServiceBySlug(slug: string): ServiceDefinition | undefined {
  return SERVICES.find((s) => s.slug === slug);
}

export function getAllServiceSlugs(): string[] {
  return SERVICES.map((s) => s.slug);
}
