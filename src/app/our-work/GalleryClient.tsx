"use client";

import { useState } from "react";
import { PROJECT_GALLERY, type GalleryCategory } from "@/lib/project-gallery.manifest";

const CATEGORY_LABELS: Record<GalleryCategory, string> = {
  kitchen: "Kitchens",
  bathroom: "Bathrooms",
  basement: "Basements",
  cabinetry: "Cabinetry",
  deck: "Decks",
  docks: "Docks",
  interiors: "Interiors",
  additions: "Additions",
  "lake-cabin": "Lake Cabins",
  roofing: "Roofing",
  siding: "Siding",
  "windows-doors": "Windows & Doors",
};

const ALL = "all" as const;
type Filter = GalleryCategory | typeof ALL;

const CATEGORIES = Object.keys(PROJECT_GALLERY) as GalleryCategory[];

export function GalleryClient() {
  const [active, setActive] = useState<Filter>(ALL);
  const [lightbox, setLightbox] = useState<string | null>(null);

  const photos =
    active === ALL
      ? CATEGORIES.flatMap((cat) => PROJECT_GALLERY[cat])
      : PROJECT_GALLERY[active];

  return (
    <>
      {/* Filter bar */}
      <div className="flex flex-wrap gap-2 justify-center mb-10">
        <button
          onClick={() => setActive(ALL)}
          className={`px-4 py-2 text-sm font-medium uppercase tracking-wide transition-colors ${
            active === ALL
              ? "bg-pine-green text-warm-white"
              : "border border-pine-green/30 text-concrete hover:bg-pine-green/10"
          }`}
        >
          All Work
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={`px-4 py-2 text-sm font-medium uppercase tracking-wide transition-colors ${
              active === cat
                ? "bg-pine-green text-warm-white"
                : "border border-pine-green/30 text-concrete hover:bg-pine-green/10"
            }`}
          >
            {CATEGORY_LABELS[cat]}
          </button>
        ))}
      </div>

      {/* Masonry grid */}
      <div className="columns-2 md:columns-3 lg:columns-4 gap-3 space-y-3">
        {photos.map((src) => (
          <div
            key={src}
            className="break-inside-avoid cursor-pointer overflow-hidden group"
            onClick={() => setLightbox(src)}
          >
            <div
              className="w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
              style={{
                backgroundImage: `url('${src}')`,
                paddingBottom: "75%",
              }}
              aria-label="Project photo"
            />
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/95 p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-4 right-6 text-warm-white text-4xl leading-none"
            aria-label="Close"
            onClick={() => setLightbox(null)}
          >
            &times;
          </button>
          <img
            src={lightbox}
            alt="Project photo"
            className="max-h-[90vh] max-w-full object-contain shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
