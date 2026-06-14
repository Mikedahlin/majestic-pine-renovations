import type { Metadata } from "next";
import { HeroSection } from "@/components/ui/HeroSection";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FadeInUp } from "@/components/ui/FadeInUp";
import { buildMetadata, PAGE_META } from "@/lib/metadata";

export const metadata: Metadata = buildMetadata(PAGE_META.about);

const values = [
  {
    title: "Craftsmanship",
    description:
      "Clean work, durable materials, and details that still matter years after the job is done.",
  },
  {
    title: "Straight Communication",
    description:
      "Clear estimates, honest updates, and realistic conversations from the first call to the final walkthrough.",
  },
  {
    title: "Dependability",
    description:
      "Showing up, doing the work right, and building with Minnesota weather, schedules, and real-life use in mind.",
  },
  {
    title: "Respect for the Property",
    description:
      "Whether it is a family home, a cabin, or a commercial space, the job should fit the place and the people using it.",
  },
];

export default function AboutPage() {
  return (
    <>
      <HeroSection
        title="30+ Years of Experience You Can Trust."
        subtitle="Hands-on construction knowledge, straight communication, and craftsmanship built for Minnesota."
        backgroundClass="bg-gradient-to-br from-pine-green via-walnut to-charcoal"
        fullScreen={false}
      />

      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <FadeInUp>
              <div
                className="aspect-[4/5] bg-cover bg-center"
                style={{
                  backgroundImage: "url('/jeremy-stoesz.png')",
                  backgroundPosition: "center top",
                }}
                role="img"
                aria-label="Jeremy Stoesz, founder of Majestic Pine Renovations, on a job site"
              />
            </FadeInUp>
            <FadeInUp delay={150}>
              <SectionHeading title="Meet Jeremy Stoesz" />
              <p className="text-concrete leading-relaxed">
                Jeremy Stoesz brings more than 30 years of hands-on construction
                experience to Majestic Pine Renovations. That experience means
                practical advice, honest expectations, and work built to hold up
                in Minnesota. The promise is simple: listen first, build it
                right, and leave every customer with something solid, useful,
                and worth being proud of.
              </p>
            </FadeInUp>
          </div>
        </div>
      </section>

      <section className="bg-pine-green py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <FadeInUp>
            <SectionHeading title="What Drives Us" light align="center" />
          </FadeInUp>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {values.map((value, i) => (
              <FadeInUp key={value.title} delay={i * 80}>
                <div className="border-t-2 border-bronze pt-6">
                  <h3 className="font-heading text-lg font-bold uppercase tracking-wide text-warm-white">
                    {value.title}
                  </h3>
                  <p className="mt-3 text-warm-white/75 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </FadeInUp>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
