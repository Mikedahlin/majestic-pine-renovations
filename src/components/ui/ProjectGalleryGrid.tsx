import { PROJECT_GALLERY, type GalleryCategory } from "@/lib/project-gallery";

const CATEGORY_LABELS: Record<GalleryCategory, string> = {
  additions: "Home Additions",
  basement: "Basement Finishing",
  bathroom: "Bathrooms",
  cabinetry: "Custom Cabinetry",
  deck: "Decks & Outdoor",
  docks: "Docks & Lake Access",
  interiors: "Interiors & Living Spaces",
  kitchen: "Kitchens",
  "lake-cabin": "Lake Homes & Cabins",
  roofing: "Roofing",
  siding: "Siding & Exteriors",
  "windows-doors": "Windows & Doors",
};

type ProjectGalleryGridProps = {
  categories?: GalleryCategory[];
  showHeadings?: boolean;
};

export function ProjectGalleryGrid({
  categories,
  showHeadings = true,
}: ProjectGalleryGridProps) {
  const sections = (categories ?? (Object.keys(PROJECT_GALLERY) as GalleryCategory[]))
    .filter((cat) => (PROJECT_GALLERY[cat]?.length ?? 0) > 0);

  return (
    <div className="space-y-16">
      {sections.map((category) => {
        const images = [...(PROJECT_GALLERY[category] ?? [])];
        const photoCount = images.length;
        return (
          <section key={category}>
            {showHeadings && (
              <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
                <h2 className="font-heading text-xl font-bold uppercase tracking-wide text-pine-green">
                  {CATEGORY_LABELS[category] ?? category}
                </h2>
                <p className="text-sm text-concrete">
                  {photoCount} photo{photoCount === 1 ? "" : "s"}
                </p>
              </div>
            )}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {images.map((image) => (
                <article
                  key={image}
                  className="overflow-hidden border border-pine-green/10 bg-warm-white"
                >
                  <div
                    className="aspect-[4/3] bg-cover bg-center"
                    style={{ backgroundImage: `url('${image}')` }}
                    role="img"
                    aria-label={`${CATEGORY_LABELS[category] ?? category} project photo`}
                  />
                </article>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
