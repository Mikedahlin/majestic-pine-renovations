import type { Metadata } from "next";
import { HeroSection } from "@/components/ui/HeroSection";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SectorCards } from "@/components/ui/SectorCards";
import { Button } from "@/components/ui/Button";
import { FadeInUp } from "@/components/ui/FadeInUp";
import { buildMetadata, PAGE_META } from "@/lib/metadata";

export const metadata: Metadata = buildMetadata(PAGE_META.commercial);

export default function CommercialPage() {
  return (
    <>
      <HeroSection
        title="Scalable Commercial Capability. Elite Execution."
        subtitle="Tenant Improvements | Medical Facilities | Retail Build-Outs | Corporate Offices"
        backgroundClass="bg-[url('https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=80&auto=format&fit=crop')] bg-cover bg-center"
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
