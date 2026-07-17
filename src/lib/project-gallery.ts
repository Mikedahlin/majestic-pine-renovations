/** Auto-synced from public/project-gallery — vetted project photos */
export const PROJECT_GALLERY = {
  "additions": [
    "/project-gallery/additions/addition-1.webp",
    "/project-gallery/additions/addition-2.webp",
    "/project-gallery/additions/addition-3.jpg",
  ],
  "basement": [
    "/project-gallery/basement/basement-43e011af.png",
    "/project-gallery/basement/basement-63fbca85.png",
    "/project-gallery/basement/basement-80fd57e9.png",
    "/project-gallery/basement/basement-92fe295c.png",
    "/project-gallery/basement/basement-443df770.png",
    "/project-gallery/basement/basement-aeff88c1.png",
    "/project-gallery/basement/basement-c83d9f52.png",
    "/project-gallery/basement/basement-e4017702.png",
    "/project-gallery/basement/basement-f2e9b139.png",
  ],
  "bathroom": [
    "/project-gallery/bathroom/bathroom-1.jpg",
    "/project-gallery/bathroom/bathroom-2.jpg",
    "/project-gallery/bathroom/bathroom-3.jpg",
    "/project-gallery/bathroom/bathroom-4.jpg",
    "/project-gallery/bathroom/bathroom-5.jpg",
    "/project-gallery/bathroom/bathroom-6.jpg",
    "/project-gallery/bathroom/bathroom-7.jpg",
    "/project-gallery/bathroom/bathroom-8.jpg",
    "/project-gallery/bathroom/bathroom-9.jpg",
    "/project-gallery/bathroom/bathroom-12.jpg",
  ],
  "cabinetry": [
    "/project-gallery/cabinetry/cabinetry-1.webp",
    "/project-gallery/cabinetry/cabinetry-2.webp",
    "/project-gallery/cabinetry/cabinetry-3.webp",
  ],
  "deck": [
    "/project-gallery/deck/newdeckconstruction1.jpg",
    "/project-gallery/deck/newdeckconstruction2.jpg",
    "/project-gallery/deck/newdeckconstruction3.jpg",
    "/project-gallery/deck/newdeckconstruction4.jpg",
  ],
  "docks": [
    "/project-gallery/docks/customdock1.jpg",
    "/project-gallery/docks/customdock2.webp",
    "/project-gallery/docks/customdock3.webp",
    "/project-gallery/docks/customdock4.jpg",
  ],
  "interiors": [
    "/project-gallery/interiors/bedroom1.jpg",
    "/project-gallery/interiors/bedroom2.jpg",
    "/project-gallery/interiors/bedroom3.jpg",
    "/project-gallery/interiors/diningroom1.jpg",
    "/project-gallery/interiors/diningroom2.jpg",
    "/project-gallery/interiors/diningroom3.jpg",
    "/project-gallery/interiors/diningroom4.jpg",
    "/project-gallery/interiors/livingroom3.jpg",
    "/project-gallery/interiors/livingroom4.jpg",
    "/project-gallery/interiors/livingroom5.jpg",
    "/project-gallery/interiors/livingroom6.jpg",
    "/project-gallery/interiors/livingroom7.jpg",
    "/project-gallery/interiors/livingroom8.jpg",
    "/project-gallery/interiors/livingroom10.jpg",
    "/project-gallery/interiors/livingroom11.jpg",
    "/project-gallery/interiors/livingroom12.jpg",
  ],
  "kitchen": [
    "/project-gallery/kitchen/kitchen-1.jpg",
    "/project-gallery/kitchen/kitchen-2.jpg",
    "/project-gallery/kitchen/kitchen-3.jpg",
    "/project-gallery/kitchen/kitchen-4.jpg",
    "/project-gallery/kitchen/kitchen-5.jpg",
    "/project-gallery/kitchen/kitchen-6.jpg",
    "/project-gallery/kitchen/kitchen-7.jpg",
    "/project-gallery/kitchen/kitchen-8.jpg",
    "/project-gallery/kitchen/kitchen-9.jpg",
    "/project-gallery/kitchen/kitchen-10.jpg",
    "/project-gallery/kitchen/kitchen-11.jpg",
    "/project-gallery/kitchen/kitchen-12.jpg",
    "/project-gallery/kitchen/kitchen-13.jpg",
  ],
  "lake-cabin": [
    "/project-gallery/lake-cabin/lake-5.jpg",
    "/project-gallery/lake-cabin/lake-6.webp",
    "/project-gallery/lake-cabin/lake-7.webp",
    "/project-gallery/lake-cabin/lake-8.jpg",
    "/project-gallery/lake-cabin/lakefront1.webp",
    "/project-gallery/lake-cabin/lakefront2.jpg",
    "/project-gallery/lake-cabin/lakefront3.jpg",
    "/project-gallery/lake-cabin/lakefront4.jpg",
  ],
  "roofing": [
    "/project-gallery/roofing/roofing-1.jpg",
    "/project-gallery/roofing/roofing-2.jpg",
    "/project-gallery/roofing/roofing-5.jpg",
  ],
  "siding": [
    "/project-gallery/siding/siding-1.jpg",
    "/project-gallery/siding/siding-2.jpg",
    "/project-gallery/siding/siding-3.jpg",
  ],
  "windows-doors": [
    "/project-gallery/windows-doors/newdoorconstructionpic1.jpg",
    "/project-gallery/windows-doors/newwindowconstructionpics1.jpg",
    "/project-gallery/windows-doors/patiodoorconstructionpic1.jpg",
  ],
} as const;

export type GalleryCategory = keyof typeof PROJECT_GALLERY;

export const SERVICE_GALLERY_MAP: Record<string, GalleryCategory[]> = {
  "kitchen-remodeling": ["kitchen", "cabinetry", "interiors"],
  "bathroom-remodeling": ["bathroom", "interiors"],
  "basement-finishing": ["basement", "interiors", "bathroom"],
  "decks-outdoor-living": ["deck", "docks", "lake-cabin"],
  "roofing": ["roofing"],
  "siding": ["siding", "windows-doors"],
  "custom-carpentry": ["cabinetry", "interiors"],
  "additions": ["additions", "lake-cabin", "windows-doors"],
  "garage-builds": ["additions", "interiors"],
};

const CATEGORY_ALIASES: Record<string, GalleryCategory> = {
  lake_cabin: "lake-cabin",
  windows_doors: "windows-doors",
};

/** All unique images in a category (no duplicate bytes). */
export function galleryFor(
  category: GalleryCategory | string,
): string[] {
  const key = (CATEGORY_ALIASES[category] ?? category) as GalleryCategory;
  return [...(PROJECT_GALLERY[key] ?? [])];
}

/** All unique images mapped to a service (deduped across categories). */
export function galleryForService(slug: string): string[] {
  const categories = SERVICE_GALLERY_MAP[slug] ?? [];
  const images: string[] = [];
  for (const category of categories) {
    for (const image of PROJECT_GALLERY[category] ?? []) {
      if (!images.includes(image)) images.push(image);
    }
  }
  return images;
}

export function pickFeatured<T extends string>(
  pool: readonly T[],
  count: number,
  offset = 0,
): T[] {
  if (pool.length === 0) return [];
  const out: T[] = [];
  for (let i = 0; i < count; i++) {
    out.push(pool[(offset + i) % pool.length] as T);
  }
  return out;
}

export const HOME_GALLERY_PREVIEW = [
  ...pickFeatured(PROJECT_GALLERY.kitchen ?? [], 2),
  ...pickFeatured(PROJECT_GALLERY.bathroom ?? [], 1),
  ...pickFeatured(PROJECT_GALLERY.deck ?? [], 1),
  ...pickFeatured(PROJECT_GALLERY.roofing ?? [], 1),
  ...pickFeatured(PROJECT_GALLERY["lake-cabin"] ?? [], 1),
  ...pickFeatured(PROJECT_GALLERY.siding ?? [], 1),
];

function firstInCategory(category: GalleryCategory, fallback: string): string {
  const list = PROJECT_GALLERY[category];
  return list?.[0] ?? fallback;
}

export const FEATURED_IMAGES = {
  kitchenHero: PROJECT_GALLERY.kitchen?.[6] ?? firstInCategory("kitchen", "/project-gallery/kitchen/kitchen-7.jpg"),
  kitchenDetail: PROJECT_GALLERY.kitchen?.[3] ?? firstInCategory("kitchen", ""),
  kitchenAccent: PROJECT_GALLERY.kitchen?.[8] ?? firstInCategory("kitchen", ""),
  bathroomHero: PROJECT_GALLERY.bathroom?.[4] ?? firstInCategory("bathroom", ""),
  bathroomDetail: PROJECT_GALLERY.bathroom?.[0] ?? firstInCategory("bathroom", ""),
  deckHero: PROJECT_GALLERY.deck?.[0] ?? "",
  deckDetail: PROJECT_GALLERY.deck?.[1] ?? firstInCategory("deck", ""),
  dockFeature: PROJECT_GALLERY.docks?.[1] ?? firstInCategory("docks", ""),
  lakeCabinHero: PROJECT_GALLERY["lake-cabin"]?.[0] ?? "",
  lakeCabinDetail: PROJECT_GALLERY["lake-cabin"]?.[1] ?? PROJECT_GALLERY["lake-cabin"]?.[0] ?? "",
  roofingHero: PROJECT_GALLERY.roofing?.[0] ?? "",
  roofingDetail: PROJECT_GALLERY.roofing?.[1] ?? PROJECT_GALLERY.roofing?.[0] ?? "",
  sidingHero: PROJECT_GALLERY.siding?.[0] ?? "",
  sidingDetail: PROJECT_GALLERY.siding?.[1] ?? PROJECT_GALLERY.siding?.[0] ?? "",
  cabinetryHero: PROJECT_GALLERY.cabinetry?.find((p) => p.includes("custom")) ?? PROJECT_GALLERY.cabinetry?.[0] ?? "",
  cabinetryDetail: PROJECT_GALLERY.cabinetry?.[PROJECT_GALLERY.cabinetry.length - 1] ?? "",
  // Real addition gallery shots (do NOT pair before/after — those files are different houses)
  additionHero: "/project-gallery/additions/addition-1.webp",
  additionDetail: "/project-gallery/additions/addition-2.webp",
  commercialHero: "/service-photos/commercial-office.jpg",
  commercialDetail: "/service-photos/commercial-finished.jpg",
  livingRoomHero: PROJECT_GALLERY.interiors?.find((p) => p.includes("livingroom11")) ?? PROJECT_GALLERY.interiors?.[0] ?? "",
  contactHero: "/project-gallery/interiors/livingroom11.jpg",
  windowDoorFeature: PROJECT_GALLERY["windows-doors"]?.find((p) => p.includes("newwindow")) ?? PROJECT_GALLERY["windows-doors"]?.[0] ?? "",
  basementHero: PROJECT_GALLERY.basement?.[0] ?? PROJECT_GALLERY.interiors?.[0] ?? "",
} as const;

export function photoList(paths: string[]) {
  return paths.map((image) => ({ image }));
}

export function galleryCategories(): GalleryCategory[] {
  return Object.keys(PROJECT_GALLERY) as GalleryCategory[];
}

export function totalUniquePhotos(): number {
  return Object.values(PROJECT_GALLERY).reduce((n, arr) => n + arr.length, 0);
}
