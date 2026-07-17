import Link from "next/link";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FadeInUp } from "@/components/ui/FadeInUp";
import { Button } from "@/components/ui/Button";
import { FEATURED_IMAGES, totalUniquePhotos } from "@/lib/project-gallery";

const FEATURED = [
  {
    title: "Kitchen Remodels",
    href: "/services/kitchen-remodeling",
    image: FEATURED_IMAGES.kitchenHero,
    alt: "Granite countertops and custom kitchen cabinetry",
  },
  {
    title: "Bathrooms",
    href: "/services/bathroom-remodeling",
    image: FEATURED_IMAGES.bathroomHero,
    alt: "Updated bathroom with modern fixtures",
  },
  {
    title: "Basements",
    href: "/services/basement-finishing",
    image: FEATURED_IMAGES.basementHero,
    alt: "Finished basement living space",
  },
  {
    title: "Decks & Outdoor",
    href: "/services/decks-outdoor-living",
    image: FEATURED_IMAGES.deckHero,
    alt: "New deck construction in Minnesota",
  },
  {
    title: "Lake Homes",
    href: "/services/additions",
    image: FEATURED_IMAGES.lakeCabinHero,
    alt: "Lake cabin renovation exterior",
  },
  {
    title: "Roofing",
    href: "/services/roofing",
    image: FEATURED_IMAGES.roofingHero,
    alt: "Completed roofing project",
  },
  {
    title: "Siding",
    href: "/services/siding",
    image: FEATURED_IMAGES.sidingHero,
    alt: "Completed siding project",
  },
  {
    title: "Cabinetry",
    href: "/services/custom-carpentry",
    image: FEATURED_IMAGES.cabinetryHero,
    alt: "Custom cabinetry and built-ins",
  },
] as const;

export function RecentProjects() {
  const total = totalUniquePhotos();

  return (
    <section className="bg-warm-white py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <FadeInUp>
          <SectionHeading
            title="Recent Project Work"
            subtitle={`${total} unique photos from our crews across Minnesota — not stock photography.`}
            align="center"
          />
        </FadeInUp>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURED.map((item, i) => (
            <FadeInUp key={item.title} delay={i * 60}>
              <Link
                href={item.href}
                className="group block overflow-hidden border border-pine-green/10 bg-charcoal/5"
              >
                <div
                  className="aspect-[4/3] bg-cover bg-center transition-transform duration-500 group-hover:scale-[1.02]"
                  style={{ backgroundImage: `url('${item.image}')` }}
                  role="img"
                  aria-label={item.alt}
                />
                <div className="flex items-center justify-between px-5 py-4">
                  <h3 className="font-heading text-sm font-bold uppercase tracking-wide text-pine-green group-hover:text-bronze transition-colors">
                    {item.title}
                  </h3>
                  <span className="text-xs uppercase tracking-widest text-bronze">
                    View →
                  </span>
                </div>
              </Link>
            </FadeInUp>
          ))}
        </div>
        <div className="mt-12 text-center">
          <Button href="/our-work">View All {total} Project Photos</Button>
        </div>
      </div>
    </section>
  );
}
