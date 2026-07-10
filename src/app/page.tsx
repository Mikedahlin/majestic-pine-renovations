import type { Metadata } from "next";
import Link from "next/link";
import { HomeHero } from "@/components/home/HomeHero";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ServiceCard } from "@/components/ui/ServiceCard";
import { AdvantageGrid } from "@/components/ui/AdvantageGrid";
import { FadeInUp } from "@/components/ui/FadeInUp";
import { LeadForm } from "@/components/ui/LeadForm";
import { SchemaScript } from "@/components/ui/SchemaScript";
import { CountUp } from "@/components/ui/CountUp";
import { BeforeAfterSlider } from "@/components/ui/BeforeAfterSlider";
import { PhotoCarousel } from "@/components/ui/PhotoCarousel";
import { TestimonialCarousel } from "@/components/ui/TestimonialCarousel";
import { buildMetadata, PAGE_META } from "@/lib/metadata";
import { faqSchema } from "@/lib/schema";
import { CORE_SERVICES } from "@/lib/services";

export const metadata: Metadata = buildMetadata(PAGE_META.home);

const homeFaqs = [
  {
    question: "What areas does Majestic Pine Renovations serve?",
    answer:
      "We serve Buffalo, the Twin Cities, and the Whitefish Chain area for both residential and commercial projects.",
  },
  {
    question: "Does Majestic Pine handle both residential and commercial projects?",
    answer:
      "Yes. We work on both residential and commercial projects, with the same focus on planning, communication, and solid long-term workmanship.",
  },
];

export default function HomePage() {
  return (
    <>
      <SchemaScript data={faqSchema(homeFaqs)} />

      <HomeHero />

      <section className="bg-pine-green/5 py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <FadeInUp>
            <div className="max-w-3xl mb-14 text-center mx-auto">
              <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold uppercase tracking-wide text-pine-green">
                Before & After
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-concrete">
                Real transformations from Majestic Pine projects.
              </p>
            </div>
          </FadeInUp>
          <div className="grid gap-8 md:grid-cols-2 mx-auto max-w-5xl">
            <BeforeAfterSlider
              before="/before-after/pair1-before.png"
              after="/before-after/pair1-after.png"
            />
            <BeforeAfterSlider
              before="/before-after/pair2-before.png"
              after="/before-after/pair2-after.png"
            />
            <BeforeAfterSlider
              before="/before-after/pair3a-before.png"
              after="/before-after/pair3a-after.png"
            />
            <BeforeAfterSlider
              before="/before-after/pair3b-before.png"
              after="/before-after/pair3b-after.png"
            />
          </div>
        </div>
      </section>

      <section className="bg-charcoal py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <FadeInUp>
            <div className="max-w-3xl mb-12 text-center mx-auto">
              <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold uppercase tracking-wide text-warm-white">
                Our Work in Motion
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-warm-white/80">
                Projects from Minnesota homes and businesses.
              </p>
            </div>
          </FadeInUp>
          <div className="mx-auto max-w-5xl mt-8">
            <PhotoCarousel
              photos={[
                { image: "/project-gallery/kitchen/kitchen-7.jpg" },
                { image: "/project-gallery/bathroom/bathroom-5.jpg" },
                { image: "/project-gallery/deck/newdeckconstruction1.jpg" },
                { image: "/project-gallery/basement/basement-43e011af.png" },
                { image: "/project-gallery/roofing/roofing-1.jpg" },
                { image: "/project-gallery/siding/siding-1.jpg" },
              ]}
            />
          </div>
        </div>
      </section>

      {/* Brand Positioning */}
      <section className="grid lg:grid-cols-2">
        <div
          className="min-h-[400px] bg-cover bg-center"
          style={{
            backgroundImage:
              "url('/project-photos/real-projects/living-room-stone-fireplace-builtins.webp')",
          }}
          aria-hidden="true"
        />
        <div className="flex items-center bg-warm-white px-8 py-16 lg:px-16">
          <FadeInUp>
            <SectionHeading
              title="Built for Minnesota Homes, Cabins, and Hard-Working Spaces."
            />
            <p className="text-concrete leading-relaxed">
              Majestic Pine Renovations is built around the kind of work that has
              to last in Minnesota. Whether the project is a kitchen remodel, a
              garage build, cabin improvements, exterior repairs, or a commercial
              update, the goal stays the same: solid craftsmanship, clear
              communication, and work that makes sense for the property and the
              people using it.
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
              subtitle="From kitchens and baths to decks, garages, cabins, siding, and roofing."
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
                image={service.image}
                index={i}
              />
            ))}
          </div>
          <div className="mt-12 text-center">
            <Button href="/services">Explore All Services</Button>
          </div>
        </div>
      </section>

      {/* Counters */}
      <section className="bg-charcoal py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-3">
            <CountUp end={30} suffix="+" label="Years Experience" />
            <CountUp end={150} suffix="+" label="Projects Completed" />
            <CountUp end={4} label="Service Areas Covered" />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-pine-green/5 py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <FadeInUp variant="scale">
            <SectionHeading
              title="What Our Customers Say"
              subtitle="Real feedback from real projects across Minnesota."
              align="center"
            />
          </FadeInUp>
          <TestimonialCarousel />
        </div>
      </section>

      {/* Advantage */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <FadeInUp>
            <SectionHeading title="Why People Hire Majestic Pine." />
          </FadeInUp>
          <AdvantageGrid />
        </div>
      </section>

      {/* Lead capture CTA */}
      <section className="py-24">
        <div className="mx-auto max-w-3xl px-6 lg:px-8">
          <FadeInUp>
            <SectionHeading
              title="Start Your Project Today"
              subtitle="Tell us what you want to build, fix, or remodel, and where the property is located."
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
