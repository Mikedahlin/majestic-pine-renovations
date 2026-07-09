import type { Metadata } from "next";
import { HeroSection } from "@/components/ui/HeroSection";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FadeInUp } from "@/components/ui/FadeInUp";
import { buildMetadata, PAGE_META } from "@/lib/metadata";
import { SITE_IMAGES } from "@/lib/site-images";

export const metadata: Metadata = buildMetadata(PAGE_META.about);

const values = [
  {
    title: "Precision",
    description:
      "Every measurement, cut, and finish meets commercial-grade tolerances — because details define legacy.",
  },
  {
    title: "Transparency",
    description:
      "Open books, clear timelines, and honest communication from first consultation to final walkthrough.",
  },
  {
    title: "Safety",
    description:
      "OSHA-compliant job sites, rigorous training, and proactive hazard management on every project.",
  },
  {
    title: "Legacy",
    description:
      "We build environments designed to serve families and businesses for generations, not just seasons.",
  },
];

export default function AboutPage() {
  return (
    <>
      <HeroSection
        title="Our Foundation Is Built on Integrity."
        backgroundClass="bg-cover bg-center"
        style={{ backgroundImage: `url('${SITE_IMAGES.aboutHero}')` }}
        fullScreen={false}
      />

      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <FadeInUp>
              <div className="relative">
                <img
                  src="/team/jeremy-stoesz.png"
                  alt="Jeremy Stoesz — Founder, Majestic Pine Renovations"
                  className="aspect-[4/5] w-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-charcoal/80 to-transparent p-6">
                  <p className="font-heading text-lg font-bold text-warm-white">Jeremy Stoesz</p>
                  <p className="text-sm text-bronze uppercase tracking-widest">Founder</p>
                </div>
              </div>
            </FadeInUp>
            <FadeInUp delay={150}>
              <SectionHeading title="Meet Jeremy Stoesz" />
              <p className="text-concrete leading-relaxed">
                Majestic Pine Renovations was founded on a singular principle: the
                construction industry needed a higher standard. Jeremy Stoesz built
                this company to bridge the gap between rugged Minnesota
                craftsmanship and modern, high-tech project execution. Born and
                raised with a deep respect for hard work and architectural beauty,
                Jeremy oversees a team that refuses to cut corners. We are not just
                building structures; we are engineering environments that elevate
                how you live and work.
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
