import type { Metadata } from "next";
import Link from "next/link";
import { HeroSection } from "@/components/ui/HeroSection";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ServiceDetailBlock } from "@/components/ui/ServiceDetailBlock";
import { FadeInUp } from "@/components/ui/FadeInUp";
import { buildMetadata, PAGE_META } from "@/lib/metadata";
import { SERVICES } from "@/lib/services";
import { SITE_IMAGES } from "@/lib/site-images";

export const metadata: Metadata = buildMetadata(PAGE_META.services);

export default function ServicesPage() {
  const featured = SERVICES.filter((s) => s.featured);
  const additional = SERVICES.filter((s) => !s.featured);

  return (
    <>
      <HeroSection
        title="Comprehensive Construction Solutions."
        subtitle="From structural overhauls to meticulous finish carpentry, view our specialized divisions below."
        backgroundClass="bg-cover bg-center"
        style={{ backgroundImage: `url('${SITE_IMAGES.servicesHero}')` }}
        fullScreen={false}
        h1
      />

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          {featured.map((service, i) => (
            <ServiceDetailBlock
              key={service.slug}
              title={service.title}
              headline={service.headline}
              description={service.description}
              process={service.process}
              benefits={service.benefits}
              slug={service.slug}
              image={service.galleryImage}
              imagePosition={service.imagePosition}
              index={i}
            />
          ))}
        </div>
      </section>

      <section className="bg-pine-green/5 py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <FadeInUp>
            <SectionHeading
              title="Additional Services"
              subtitle="Specialty divisions ready to support your full-scope project."
              align="center"
            />
          </FadeInUp>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {additional.map((service, i) => (
              <FadeInUp key={service.slug} delay={i * 60}>
                <Link
                  href={`/services/${service.slug}`}
                  className="group block overflow-hidden border border-pine-green/20 bg-warm-white transition-all hover:border-bronze"
                >
                  <div
                    className="aspect-[16/10] bg-cover bg-center transition-transform duration-500 group-hover:scale-[1.02]"
                    style={{ backgroundImage: `url('${service.heroImage}')` }}
                    role="img"
                    aria-label={`${service.title} project example`}
                  />
                  <div className="p-6">
                    <h3 className="font-heading text-lg font-bold uppercase tracking-wide text-pine-green group-hover:text-bronze">
                      {service.title}
                    </h3>
                    <p className="mt-2 text-sm text-concrete line-clamp-2">
                      {service.description}
                    </p>
                    <span className="mt-4 inline-block text-xs uppercase tracking-widest text-bronze">
                      Learn More →
                    </span>
                  </div>
                </Link>
              </FadeInUp>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
