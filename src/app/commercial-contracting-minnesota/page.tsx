import type { Metadata } from "next";
import { HeroSection } from "@/components/ui/HeroSection";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SectorCards } from "@/components/ui/SectorCards";
import { Button } from "@/components/ui/Button";
import { FadeInUp } from "@/components/ui/FadeInUp";
import { buildMetadata, PAGE_META } from "@/lib/metadata";
import { FEATURED_IMAGES, galleryFor } from "@/lib/project-gallery";

export const metadata: Metadata = buildMetadata(PAGE_META.commercial);

const commercialPhotos = [
  { image: FEATURED_IMAGES.commercialHero },
  { image: FEATURED_IMAGES.commercialDetail },
  { image: FEATURED_IMAGES.livingRoomHero },
  ...galleryFor("interiors").slice(0, 3).map((image) => ({ image })),
  ...galleryFor("windows-doors").map((image) => ({ image })),
];

export default function CommercialPage() {
  return (
    <>
      <HeroSection
        title="Scalable Commercial Capability. Elite Execution."
        subtitle="Tenant Improvements | Medical Facilities | Retail Build-Outs | Corporate Offices"
        backgroundClass="bg-cover bg-center"
        style={{
          backgroundImage: `url('${FEATURED_IMAGES.commercialHero}')`,
        }}
        fullScreen={false}
      >
        <Button href="/contact">Schedule a Commercial Bid</Button>
      </HeroSection>

      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <FadeInUp>
            <SectionHeading title="Built for Business." />
            <p className="max-w-3xl text-concrete leading-relaxed">
              Commercial construction requires a different caliber of contractor.
              It demands rigorous scheduling precision, strict compliance with local
              codes, and the ability to manage complex supply chains without
              disrupting your bottom line. Majestic Pine Renovations brings
              corporate-level project management to your build.
            </p>
          </FadeInUp>
        </div>
      </section>

      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <FadeInUp>
            <SectionHeading
              title="Commercial Examples"
              subtitle="Examples of business spaces, planning meetings, and finished tenant improvements."
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
                    aria-label="Commercial project example"
                  />
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
              subtitle="Specialized experience across high-demand commercial verticals."
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
