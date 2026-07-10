import type { Metadata } from "next";
import { HeroSection } from "@/components/ui/HeroSection";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProjectGalleryGrid } from "@/components/ui/ProjectGalleryGrid";
import { FadeInUp } from "@/components/ui/FadeInUp";
import { Button } from "@/components/ui/Button";
import { buildMetadata, PAGE_META } from "@/lib/metadata";
import { FEATURED_IMAGES, totalUniquePhotos } from "@/lib/project-gallery";

export const metadata: Metadata = buildMetadata(PAGE_META.ourWork);

export default function OurWorkPage() {
  const count = totalUniquePhotos();

  return (
    <>
      <HeroSection
        title="Our Project Gallery"
        subtitle={`${count} photos from Majestic Pine jobs across Minnesota — kitchens, baths, basements, decks, lake homes, roofing, siding, and more.`}
        backgroundClass="bg-cover bg-center"
        style={{ backgroundImage: `url('${FEATURED_IMAGES.kitchenHero}')` }}
        fullScreen={false}
      >
        <Button href="/contact">Start Your Project</Button>
      </HeroSection>

      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <FadeInUp>
            <SectionHeading
              title="Work. No Stock Photos."
              subtitle="Every image below is from a Majestic Pine Renovations project. Duplicates have been removed so you see distinct work."
              align="center"
            />
          </FadeInUp>
          <div className="mt-16">
            <ProjectGalleryGrid />
          </div>
        </div>
      </section>
    </>
  );
}
