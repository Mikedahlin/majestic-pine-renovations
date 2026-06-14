/**
 * Scans public/project-gallery, dedupes byte-identical files, optionally
 * imports new images from ~/Downloads, and regenerates src/lib/project-gallery.ts
 */
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const GALLERY_DIR = path.join(ROOT, "public", "project-gallery");
const OUT_FILE = path.join(ROOT, "src", "lib", "project-gallery.ts");
const DOWNLOADS = path.join(process.env.USERPROFILE ?? "", "Downloads");

const EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);
const IMPORT_PATTERNS = [
  { patterns: ["Kitchen*.jpg", "Kitchen*.jpeg"], folder: "kitchen", prefix: "kitchen" },
  { patterns: ["Bathroom*.jpg", "Bathroom*.jpeg"], folder: "bathroom", prefix: "bathroom" },
  { patterns: ["Newdeckconstruction*.*"], folder: "deck", prefix: "deck-import" },
  { patterns: ["Roofing*.*", "Roffing*.*"], folder: "roofing", prefix: "roofing-import" },
  { patterns: ["Siding*.*"], folder: "siding", prefix: "siding-import" },
  { patterns: ["Home_add*.*", "Home_additions*.*"], folder: "additions", prefix: "addition-import" },
  { patterns: ["Lakefront*.*", "Lakecabin*.*", "Logcabin*.*", "Lake_*.jpg"], folder: "lake-cabin", prefix: "lake-import" },
  { patterns: ["Custom_cabinet*.*", "Customcabinet*.*"], folder: "cabinetry", prefix: "cabinet-import" },
  { patterns: ["Customdock*.*"], folder: "docks", prefix: "dock-import" },
  { patterns: ["Newwindow*.*", "Newdoor*.*", "Patiodoor*.*"], folder: "windows-doors", prefix: "window-import" },
  { patterns: ["livingroom*.*", "Livingroom*.*", "diningroom*.*", "Diningroom*.*", "bedroom*.*", "Bedroom*.*", "interior*.*", "Interior*.*", "finishing*.*", "homeoffice*.*", "Homeoffice*.*"], folder: "interiors", prefix: "interior-import" },
  { patterns: ["basement*.*", "Basement*.*"], folder: "basement", prefix: "basement" },
];

function hashFile(filePath) {
  const buf = fs.readFileSync(filePath);
  return crypto.createHash("md5").update(buf).digest("hex");
}

function normExt(ext) {
  const e = ext.toLowerCase();
  if (e === ".jpeg") return ".jpg";
  return e;
}

function scoreKeeper(relPath) {
  const base = path.basename(relPath).toLowerCase();
  const ext = path.extname(base);
  let score = 0;
  if (ext === ".webp") score += 40;
  else if (ext === ".jpg" || ext === ".jpeg") score += 30;
  else if (ext === ".png") score += 20;
  else if (ext === ".avif") score += 10;
  if (base.includes("import")) score += 5;
  if (/^[a-z]+-\d+\./.test(base)) score += 8;
  if (/^[a-z]+\d+\./.test(base)) score += 4;
  if (base.includes("custom") || base.includes("newdeck") || base.includes("lakefront")) score += 6;
  if (base.startsWith("interior-")) score -= 5;
  score -= base.length * 0.01;
  return score;
}

function walkImages(dir) {
  if (!fs.existsSync(dir)) return [];
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walkImages(full));
    else if (EXT.has(normExt(path.extname(entry.name)))) out.push(full);
  }
  return out;
}

function importFromDownloads(existingHashes) {
  let imported = 0;
  const extraDirs = [
    path.join(DOWNLOADS, "Projects", "majestic-pine-renovations", "repo", "public", "project-photos", "real-projects"),
    path.join(DOWNLOADS, "Projects", "majestic-pine-renovations", "repo", "public", "basement-projects"),
    path.join(DOWNLOADS, "Projects", "majestic-pine-renovations", "repo", "public", "project-photos", "basement"),
    path.join(DOWNLOADS, "Photos"),
  ];

  function tryImport(filePath, folder, prefix) {
    const hash = hashFile(filePath);
    if (existingHashes.has(hash)) return;
    const dir = path.join(GALLERY_DIR, folder);
    fs.mkdirSync(dir, { recursive: true });
    const ext = normExt(path.extname(filePath));
    const name = `${prefix}-${hash.slice(0, 8)}${ext}`;
    const dest = path.join(dir, name);
    if (!fs.existsSync(dest)) {
      fs.copyFileSync(filePath, dest);
      existingHashes.add(hash);
      imported++;
    }
  }

  if (fs.existsSync(DOWNLOADS)) {
    for (const group of IMPORT_PATTERNS) {
      for (const pattern of group.patterns) {
        const globBase = pattern.replace(/\*.*$/, "");
        const suffix = pattern.includes("*") ? pattern.split("*")[1] : "";
        for (const file of fs.readdirSync(DOWNLOADS, { withFileTypes: true })) {
          if (!file.isFile()) continue;
          const name = file.name;
          if (!name.toLowerCase().startsWith(globBase.toLowerCase())) continue;
          if (suffix && !name.toLowerCase().endsWith(suffix.toLowerCase())) continue;
          tryImport(path.join(DOWNLOADS, name), group.folder, group.prefix);
        }
      }
    }
  }

  for (const dir of extraDirs) {
    if (!fs.existsSync(dir)) continue;
    const folder = dir.includes("basement") ? "basement" : "interiors";
    const prefix = dir.includes("basement") ? "basement" : "real-project";
    for (const file of walkImages(dir)) {
      tryImport(file, folder, prefix);
    }
  }

  return imported;
}

function buildManifest() {
  const files = walkImages(GALLERY_DIR);
  const byHash = new Map();

  for (const abs of files) {
    const rel = "/" + path.relative(path.join(ROOT, "public"), abs).split(path.sep).join("/");
    const hash = hashFile(abs);
    const prev = byHash.get(hash);
    if (!prev || scoreKeeper(rel) > scoreKeeper(prev)) {
      byHash.set(hash, rel);
    }
  }

  const byCategory = {};
  for (const rel of byHash.values()) {
    const parts = rel.split("/");
    const category = parts[2];
    if (!category) continue;
    if (!byCategory[category]) byCategory[category] = [];
    byCategory[category].push(rel);
  }

  for (const cat of Object.keys(byCategory)) {
    byCategory[cat].sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  }

  return byCategory;
}

function emitTs(byCategory) {
  const categories = Object.keys(byCategory).sort();
  const totalListed = categories.reduce((n, c) => n + byCategory[c].length, 0);

  let body = `/** Auto-synced from public/project-gallery — ${totalListed} unique photos (deduped) */\n`;
  body += `export const PROJECT_GALLERY = {\n`;
  for (const cat of categories) {
    body += `  ${JSON.stringify(cat)}: [\n`;
    for (const img of byCategory[cat]) {
      body += `    ${JSON.stringify(img)},\n`;
    }
    body += `  ],\n`;
  }
  body += `} as const;\n\n`;

  body += `export type GalleryCategory = keyof typeof PROJECT_GALLERY;\n\n`;

  body += `export const SERVICE_GALLERY_MAP: Record<string, GalleryCategory[]> = {
  "kitchen-remodeling": ["kitchen", "cabinetry", "interiors"],
  "bathroom-remodeling": ["bathroom", "interiors"],
  "basement-finishing": ["basement", "interiors", "bathroom"],
  "decks-outdoor-living": ["deck", "docks", "lake-cabin"],
  "roofing": ["roofing"],
  "siding": ["siding", "windows-doors"],
  "custom-carpentry": ["cabinetry", "interiors"],
  "additions": ["additions", "lake-cabin", "windows-doors"],
  "garage-builds": ["additions", "interiors"],
};\n\n`;

  body += `const CATEGORY_ALIASES: Record<string, GalleryCategory> = {
  lake_cabin: "lake-cabin",
  windows_doors: "windows-doors",
};\n\n`;

  body += `/** All unique images in a category (no duplicate bytes). */
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
  deckHero: PROJECT_GALLERY.deck?.find((p) => p.endsWith(".webp")) ?? PROJECT_GALLERY.deck?.[0] ?? "",
  deckDetail: PROJECT_GALLERY.deck?.[1] ?? firstInCategory("deck", ""),
  dockFeature: PROJECT_GALLERY.docks?.[1] ?? firstInCategory("docks", ""),
  lakeCabinHero: PROJECT_GALLERY["lake-cabin"]?.find((p) => p.includes("lakecabin")) ?? PROJECT_GALLERY["lake-cabin"]?.[0] ?? "",
  lakeCabinDetail: PROJECT_GALLERY["lake-cabin"]?.find((p) => p.includes("lakefront")) ?? PROJECT_GALLERY["lake-cabin"]?.[0] ?? "",
  roofingHero: PROJECT_GALLERY.roofing?.find((p) => p.includes("beforeandafter4")) ?? PROJECT_GALLERY.roofing?.[0] ?? "",
  roofingDetail: PROJECT_GALLERY.roofing?.[0] ?? "",
  sidingHero: PROJECT_GALLERY.siding?.find((p) => p.includes("beforeandafter2")) ?? PROJECT_GALLERY.siding?.[0] ?? "",
  sidingDetail: PROJECT_GALLERY.siding?.find((p) => p.includes("beforeandafter1")) ?? PROJECT_GALLERY.siding?.[0] ?? "",
  cabinetryHero: PROJECT_GALLERY.cabinetry?.find((p) => p.includes("custom")) ?? PROJECT_GALLERY.cabinetry?.[0] ?? "",
  cabinetryDetail: PROJECT_GALLERY.cabinetry?.[PROJECT_GALLERY.cabinetry.length - 1] ?? "",
  additionHero: PROJECT_GALLERY.additions?.[PROJECT_GALLERY.additions.length - 1] ?? firstInCategory("additions", ""),
  additionDetail: PROJECT_GALLERY.additions?.find((p) => p.includes("home-additions")) ?? PROJECT_GALLERY.additions?.[0] ?? "",
  commercialHero: PROJECT_GALLERY.interiors?.find((p) => p.includes("homeeoffice") || p.includes("homeoffice")) ?? PROJECT_GALLERY.interiors?.[0] ?? "",
  commercialDetail: PROJECT_GALLERY.interiors?.find((p) => p.includes("homeoffice2")) ?? PROJECT_GALLERY.interiors?.[0] ?? "",
  livingRoomHero: PROJECT_GALLERY.interiors?.find((p) => p.includes("livingroom11")) ?? PROJECT_GALLERY.interiors?.[0] ?? "",
  contactHero: PROJECT_GALLERY.interiors?.find((p) => p.includes("finishingtouches1")) ?? PROJECT_GALLERY.interiors?.[0] ?? "",
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
`;

  fs.writeFileSync(OUT_FILE, body, "utf8");
  return totalListed;
}

function main() {
  fs.mkdirSync(GALLERY_DIR, { recursive: true });
  const existing = walkImages(GALLERY_DIR);
  const hashes = new Set(existing.map(hashFile));
  const imported = importFromDownloads(hashes);
  const byCategory = buildManifest();
  const unique = emitTs(byCategory);
  const raw = walkImages(GALLERY_DIR).length;
  console.log(`Imported ${imported} new unique file(s) from Downloads.`);
  console.log(`${raw} files on disk → ${unique} unique photos in manifest.`);
  console.log(`Wrote ${OUT_FILE}`);
  for (const cat of Object.keys(byCategory).sort()) {
    console.log(`  ${cat}: ${byCategory[cat].length}`);
  }
}

main();
