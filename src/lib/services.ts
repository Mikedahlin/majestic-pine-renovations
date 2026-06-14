export type ServiceDefinition = {
  slug: string;
  title: string;
  headline: string;
  description: string;
  process: string[];
  benefits: string[];
  heroImage?: string;
  galleryImage?: string;
  photos: {
    image: string;
    position?: string;
    fit?: "cover" | "contain";
    caption?: string;
  }[];
  imagePosition?: string;
  galleryTitle?: string;
  gallerySubtitle?: string;
  galleryVariant?: "standard" | "premium";
  keyword: string;
  metaDescription: string;
  featured?: boolean;
};

export type CoreService = {
  title: string;
  description: string;
  href: string;
  icon: string;
  image?: string;
};

export const CORE_SERVICES: readonly CoreService[] = [
  {
    title: "Home Remodeling",
    description:
      "Kitchens, bathrooms, and practical whole-home improvements.",
    href: "/services/kitchen-remodeling",
    icon: "remodel",
    image: "/homepage-kitchen.jpg",
  },
  {
    title: "Commercial Build-Outs",
    description:
      "Medical, retail, office, and workspaces planned around daily operations.",
    href: "/commercial-contracting-minnesota",
    icon: "commercial",
  },
  {
    title: "Custom Additions & Garages",
    description:
      "More room for living, storage, vehicles, tools, and work.",
    href: "/services/additions",
    icon: "addition",
  },
  {
    title: "Outdoor Living",
    description:
      "Decks, covered spaces, and exterior improvements built for Minnesota weather.",
    href: "/services/decks-outdoor-living",
    icon: "outdoor",
  },
] as const;

export const SERVICES: ServiceDefinition[] = [
  {
    slug: "kitchen-remodeling",
    title: "Kitchen Remodeling",
    headline: "KITCHENS DESIGNED FOR HOW YOU LIVE.",
    description:
      "From cabinets and countertops to lighting and appliance layouts, we build kitchens around how your household cooks, gathers, and uses the space every day.",
    process: [
      "In-home consultation and spatial assessment",
      "Layout planning and material selection",
      "Permitting, demolition, and structural coordination",
      "Custom build, inspection, and final walkthrough",
    ],
    benefits: [
      "Custom cabinetry and millwork",
      "Premium countertop and tile installation",
      "Lighting and electrical upgrades",
      "Seamless appliance integration",
    ],
    heroImage: "/homepage-kitchen.jpg",
    galleryImage: "/project-photos/real-projects/kitchen-open-concept-island-remodel.webp",
    photos: [
      {
        image: "/project-photos/real-projects/kitchen-white-cabinets-blue-island.webp",
        caption: "White cabinetry with a contrasting island",
      },
      {
        image: "/project-photos/real-projects/kitchen-dark-cabinetry-custom-hood.webp",
        caption: "Custom cabinetry and range hood",
      },
      {
        image: "/project-photos/real-projects/kitchen-gray-island-window-shelves.webp",
        caption: "Kitchen island, storage, and natural light",
      },
    ],
    imagePosition: "center center",
    keyword: "kitchen remodeling Minneapolis",
    metaDescription:
      "Kitchen remodeling for Buffalo, the Twin Cities, and the Whitefish Chain area, with practical layouts, durable finishes, and clear project planning.",
    featured: true,
  },
  {
    slug: "bathroom-remodeling",
    title: "Bathroom Remodeling",
    headline: "BATHROOMS BUILT FOR COMFORT AND DAILY USE.",
    description:
      "We renovate bathrooms with careful waterproofing, practical storage, durable finishes, and fixture options that fit the household and the space.",
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
    heroImage: "/project-photos/real-projects/bathroom-herringbone-tile-walk-in-shower.webp",
    galleryImage: "/project-photos/real-projects/bathroom-blue-tub-vanity-wide.webp",
    photos: [
      {
        image: "/project-photos/real-projects/bathroom-herringbone-tile-vanity-detail.webp",
        caption: "Herringbone tile and vanity detail",
      },
      {
        image: "/project-photos/real-projects/bathroom-glass-shower-pebble-floor.webp",
        caption: "Glass shower and pebble floor",
      },
      {
        image: "/project-photos/real-projects/bathroom-white-double-vanity-storage.webp",
        caption: "Double vanity with built-in storage",
      },
    ],
    imagePosition: "center center",
    keyword: "bathroom remodeling Twin Cities",
    metaDescription:
      "Bathroom remodeling in Buffalo, the Twin Cities, and the Whitefish Chain area, including showers, tile, vanities, ventilation, and moisture protection.",
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
    heroImage: "/project-photos/basement/basement-before-after-05.png",
    galleryImage: "/project-photos/basement/basement-before-after-02.png",
    photos: [
      {
        image: "/project-photos/basement/basement-before-after-01.png",
        fit: "contain",
        caption: "Basement Before & After 1",
      },
      {
        image: "/project-photos/basement/basement-before-after-03.png",
        fit: "contain",
        caption: "Basement Before & After 3",
      },
      {
        image: "/project-photos/basement/basement-before-after-04.png",
        fit: "contain",
        caption: "Basement Before & After 4",
      },
      {
        image: "/project-photos/basement/basement-before-after-06.png",
        fit: "contain",
        caption: "Basement Before & After 6",
      },
      {
        image: "/project-photos/basement/basement-before-after-07.png",
        fit: "contain",
        caption: "Basement Before & After 7",
      },
      {
        image: "/project-photos/basement/basement-before-after-09.png",
        fit: "contain",
        caption: "Basement Before & After 9",
      },
      {
        image: "/project-photos/basement/basement-before-after-10.png",
        fit: "contain",
        caption: "Basement Before & After 10",
      },
    ],
    imagePosition: "center center",
    galleryTitle: "Basement Before & After Projects",
    gallerySubtitle:
      "Real basement transformations showing unfinished or outdated spaces beside the completed work.",
    galleryVariant: "premium",
    keyword: "basement finishing Minnesota",
    metaDescription:
      "Basement finishing in Minnesota for family rooms, guest spaces, storage, entertainment areas, insulation, and egress planning.",
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
    heroImage: "/project-photos/exteriors/decks/decks-04.webp",
    galleryImage: "/project-photos/exteriors/decks/decks-01.jpeg",
    photos: [
      { image: "/project-photos/exteriors/decks/decks-02.jpeg" },
      { image: "/project-photos/exteriors/decks/decks-03.jpeg" },
      { image: "/project-photos/exteriors/decks/decks-05.jpeg" },
      { image: "/project-photos/exteriors/docks/docks-01.avif" },
      { image: "/project-photos/exteriors/docks/docks-02.webp" },
      { image: "/project-photos/exteriors/docks/docks-03.webp" },
      { image: "/project-photos/exteriors/docks/docks-04.jpeg" },
    ],
    imagePosition: "center center",
    keyword: "deck builder Twin Cities",
    metaDescription:
      "Deck and outdoor living construction for Buffalo, the Twin Cities, and the Whitefish Chain area, with materials selected for Minnesota weather.",
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
    heroImage: "/project-photos/exteriors/roofing/roofing-01.jpg",
    galleryImage: "/project-photos/exteriors/roofing/roofing-03.jpg",
    photos: [
      { image: "/project-photos/exteriors/roofing/roofing-02.jpg" },
      { image: "/project-photos/exteriors/roofing/roofing-04.jpg" },
      { image: "/project-photos/exteriors/roofing/roofing-05.jpeg" },
    ],
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
    heroImage: "/project-photos/exteriors/siding/siding-02.webp",
    galleryImage: "/project-photos/exteriors/siding/siding-03.jpg",
    photos: [
      { image: "/project-photos/exteriors/siding/siding-01.jpeg" },
      { image: "/project-photos/exteriors/siding/siding-04.webp" },
      { image: "/project-photos/exteriors/siding/siding-05.jpeg" },
      { image: "/project-photos/exteriors/siding/siding-06.jpeg" },
    ],
    imagePosition: "center center",
    keyword: "siding installation Minneapolis",
    metaDescription:
      "Siding installation in Buffalo, the Twin Cities, and the Whitefish Chain area, including fiber cement, engineered wood, weather barriers, and trim.",
  },
  {
    slug: "custom-carpentry",
    title: "Custom Carpentry",
    headline: "CUSTOM WOODWORK BUILT FOR THE SPACE.",
    description:
      "Built-ins, mantels, trim, railings, and custom woodwork planned to fit the room, the property, and the way it will be used.",
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
    heroImage: "/project-photos/real-projects/home-office-custom-cabinets-shelves.webp",
    galleryImage: "/project-photos/real-projects/living-room-built-in-bookcase-seating.webp",
    photos: [
      {
        image: "/project-photos/real-projects/home-office-custom-cabinets-shelves.webp",
        caption: "Custom office cabinets and shelves",
      },
      {
        image: "/project-photos/real-projects/living-room-built-in-bookcase-seating.webp",
        caption: "Built-in bookcase and seating",
      },
      {
        image: "/project-photos/real-projects/living-room-stone-fireplace-builtins.webp",
        caption: "Stone fireplace with custom built-ins",
      },
    ],
    imagePosition: "center center",
    keyword: "custom carpentry Minnesota",
    metaDescription:
      "Custom carpentry and millwork in Minnesota, including built-ins, mantels, trim packages, railings, and restoration work.",
  },
  {
    slug: "additions",
    title: "Home Additions",
    headline: "MORE ROOM, BUILT TO FIT THE PROPERTY.",
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
    heroImage: "/project-photos/exteriors/additions/additions-01.webp",
    galleryImage: "/project-photos/exteriors/additions/additions-02.webp",
    photos: [
      { image: "/project-photos/exteriors/additions/additions-03.jpg" },
      { image: "/project-photos/exteriors/additions/additions-04.jpg" },
      { image: "/project-photos/exteriors/additions/additions-05.jpeg" },
      { image: "/project-photos/exteriors/additions/additions-06.jpeg" },
      { image: "/project-photos/exteriors/additions/additions-07.webp" },
      { image: "/project-photos/exteriors/additions/additions-08.webp" },
      { image: "/project-photos/exteriors/additions/additions-09.webp" },
      { image: "/project-photos/exteriors/additions/additions-10.avif" },
      { image: "/project-photos/exteriors/additions/additions-11.jpeg" },
      { image: "/project-photos/exteriors/additions/additions-12.jpeg" },
    ],
    imagePosition: "center center",
    keyword: "home additions Minneapolis",
    metaDescription:
      "Home additions in Buffalo, the Twin Cities, and the Whitefish Chain area, including bump-outs, second-story additions, and connected living spaces.",
  },
  {
    slug: "garage-builds",
    title: "Garage Builds",
    headline: "GARAGES BUILT AROUND HOW YOU USE THEM.",
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
    photos: [],
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
