import type { Metadata } from "next";
import Link from "next/link";
import { HomeHero } from "@/components/home/HomeHero";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ServiceCard } from "@/components/ui/ServiceCard";
import { AdvantageGrid } from "@/components/ui/AdvantageGrid";
import { TestimonialCarousel } from "@/components/ui/TestimonialCarousel";
import { FadeInUp } from "@/components/ui/FadeInUp";
import { LeadForm } from "@/components/ui/LeadForm";
import { SchemaScript } from "@/components/ui/SchemaScript";
import { buildMetadata, PAGE_META } from "@/lib/metadata";
import { faqSchema, reviewSchema } from "@/lib/schema";
import { CORE_SERVICES } from "@/lib/services";

export const metadata: Metadata = buildMetadata(PAGE_META.home);

const homeFaqs = [
  {
    question: "What areas does Majestic Pine Renovations serve?",
    answer:
      "We serve Minneapolis, Saint Paul, Buffalo, the Twin Cities Metro, and Greater Minnesota for both residential and commercial projects.",
  },
  {
    question: "Does Majestic Pine handle both residential and commercial projects?",
    answer:
      "Yes. We bring commercial-grade project management to luxury residential remodeling and deliver artisan craftsmanship to commercial build-outs.",
  },
];

const homeReviews = [
  {
    author: "Sarah K.",
    rating: 5,
    text: "Exceptional kitchen remodel with transparent pricing throughout.",
    date: "2025-11-15",
  },
  {
    author: "James W.",
    rating: 5,
    text: "Medical office build-out completed on schedule with zero patient disruption.",
    date: "2025-09-22",
  },
];

export default function HomePage() {
  return (
    <>
      <SchemaScript data={[faqSchema(homeFaqs), ...reviewSchema(homeReviews)]} />

      <HomeHero />

      {/* Brand Positioning */}
      <section className="grid lg:grid-cols-2">
        <div
          className="min-h-[400px] bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1615529328331-f8917597711f?w=800&q=80&auto=format&fit=crop')",
          }}
          aria-hidden="true"
        />
        <div className="flex items-center bg-warm-white px-8 py-16 lg:px-16">
          <FadeInUp>
            <SectionHeading
              title="The Intersection of Minnesota Heritage and Commercial Precision."
            />
            <p className="text-concrete leading-relaxed">
              At Majestic Pine Renovations, we do not compromise. We bring elite
              commercial project management standards to luxury residential
              remodeling, and deliver artisan-level craftsmanship to commercial
              build-outs. Whether you are expanding a medical facility or
              reinventing your lake home, expect total transparency, zero
              shortcuts, and a finished product that stands for generations.
            </p>
          </FadeInUp>
        </div>
      </section>

      {/* Core Services */}
      <section className="bg-pine-green/5 py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <FadeInUp>
            <SectionHeading
              title="Core Services"
              subtitle="Specialized construction divisions engineered for excellence."
              align="center"
            />
          </FadeInUp>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {CORE_SERVICES.map((service, i) => (
              <ServiceCard
                key={service.title}
                title={service.title}
                description={service.description}
                href={service.href}
                index={i}
              />
            ))}
          </div>
          <div className="mt-12 text-center">
            <Button href="/services">Explore All Services</Button>
          </div>
        </div>
      </section>

      {/* Advantage */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <FadeInUp>
            <SectionHeading title="Engineered for Excellence." />
          </FadeInUp>
          <AdvantageGrid />
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-charcoal py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <FadeInUp>
            <SectionHeading
              title="Trusted by Homeowners & Businesses"
              subtitle="Real results from Minneapolis, Buffalo, and across the Twin Cities."
              align="center"
              light
            />
          </FadeInUp>
          <div className="mx-auto max-w-3xl">
            <TestimonialCarousel />
          </div>
        </div>
      </section>

      {/* Lead capture CTA */}
      <section className="py-24">
        <div className="mx-auto max-w-3xl px-6 lg:px-8">
          <FadeInUp>
            <SectionHeading
              title="Start Your Project Today"
              subtitle="Tell us about your vision. Our team responds within one business day."
              align="center"
            />
          </FadeInUp>
          <LeadForm compact />
          <p className="mt-6 text-center text-sm text-concrete">
            Prefer to talk?{" "}
            <Link href="/contact" className="text-bronze hover:text-pine-green underline">
              Visit our contact page
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
