import type { Metadata } from "next";
import { HeroSection } from "@/components/ui/HeroSection";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SectorCards } from "@/components/ui/SectorCards";
import { Button } from "@/components/ui/Button";
import { FadeInUp } from "@/components/ui/FadeInUp";
import { buildMetadata, PAGE_META } from "@/lib/metadata";

export const metadata: Metadata = buildMetadata(PAGE_META.commercial);

const commercialPhotos = [
  {
    image: "/project-photos/real-projects/home-office-custom-cabinets-shelves.webp",
    caption: "Custom cabinets and practical workspace storage",
  },
  {
    image: "/project-photos/real-projects/home-office-custom-cabinets-shelves.webp",
    caption: "Built-in cabinetry for an organized workspace",
  },
  {
    image: "/project-photos/real-projects/living-room-built-in-bookcase-seating.webp",
    caption: "Custom built-ins and finish carpentry",
  },
];

export default function CommercialPage() {
  return (
    <>
      <HeroSection
        title="Commercial Work Built on 30+ Years of Experience."
        subtitle="Practical improvements, custom storage, finish work, repairs, and renovations for Minnesota businesses."
        backgroundClass="bg-gradient-to-br from-pine-green via-walnut to-charcoal"
        fullScreen={false}
      >
        <Button href="/contact">Schedule a Commercial Bid</Button>
      </HeroSection>

      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <FadeInUp>
            <SectionHeading title="Built for Business." />
            <p className="max-w-3xl text-concrete leading-relaxed">
              Commercial construction requires planning, communication, code
              awareness, and work that supports the day-to-day reality of the
              business using the space. Majestic Pine Renovations approaches
              commercial jobs with a practical process, clear scheduling, and an
              eye toward keeping the project moving without unnecessary disruption.
            </p>
          </FadeInUp>
        </div>
      </section>

      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <FadeInUp>
            <SectionHeading
              title="Real Finish Work"
              subtitle="Real examples of cabinetry, built-ins, and detailed interior work from the project library."
            />
          </FadeInUp>
          <div className="grid gap-6 md:grid-cols-3">
            {commercialPhotos.map((photo, i) => (
              <FadeInUp key={photo.image} delay={i * 80}>
                <article className="overflow-hidden border border-pine-green/10 bg-warm-white">
                  <div
                    className="aspect-[4/3] bg-cover bg-center"
                    style={{ backgroundImage: `url('${photo.image}')` }}
                    role="img"
                    aria-label={photo.caption}
                  />
                  <p className="border-t border-pine-green/10 px-5 py-4 text-sm text-concrete">
                    {photo.caption}
                  </p>
                </article>
              </FadeInUp>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-charcoal py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <FadeInUp>
            <SectionHeading
              title="Sector Expertise"
              subtitle="Examples of the kinds of business spaces and project types this team can support."
              light
              align="center"
            />
          </FadeInUp>
          <SectorCards />
          <div className="mt-12 text-center">
            <Button href="/contact">Schedule a Commercial Bid</Button>
          </div>
        </div>
      </section>
    </>
  );
}
