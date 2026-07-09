import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { HeroSection } from "@/components/ui/HeroSection";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { FadeInUp } from "@/components/ui/FadeInUp";
import { SchemaScript } from "@/components/ui/SchemaScript";
import { serviceSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/metadata";
import {
  getAllServiceSlugs,
  getServiceBySlug,
  SERVICES,
} from "@/lib/services";
import { galleryForService } from "@/lib/project-gallery";
import { PhotoCarousel } from "@/components/ui/PhotoCarousel";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return getAllServiceSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) return {};

  return buildMetadata({
    title: service.title,
    description: service.metaDescription,
    keyword: service.keyword,
    path: `/services/${slug}`,
  });
}

export default async function ServiceSubpage({ params }: Props) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) notFound();

  const related = SERVICES.filter((s) => s.slug !== slug).slice(0, 3);
  const projectPhotos = galleryForService(slug).map((image) => ({ image }));

  return (
    <>
      <SchemaScript
        data={serviceSchema(
          service.title,
          service.description,
          `/services/${slug}`,
        )}
      />

      <HeroSection
        title={service.headline}
        subtitle={service.description}
        backgroundClass="bg-cover bg-center"
        style={{
          backgroundImage: `url('${service.heroImage}')`,
          backgroundPosition: service.imagePosition ?? "center center",
        }}
        fullScreen={false}
      >
        <Button href="/contact">Request a Consultation</Button>
      </HeroSection>

      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-16 lg:grid-cols-2">
            <FadeInUp>
              <SectionHeading title="Our Process" />
              <ol className="space-y-4">
                {service.process.map((step, i) => (
                  <li key={step} className="flex gap-4">
                    <span className="font-heading text-2xl font-bold text-bronze">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-concrete leading-relaxed pt-1">{step}</span>
                  </li>
                ))}
              </ol>
            </FadeInUp>

            <FadeInUp delay={150}>
              <SectionHeading title="Key Benefits" />
              <ul className="space-y-3">
                {service.benefits.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-3 text-concrete">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-bronze" aria-hidden="true" />
                    {benefit}
                  </li>
                ))}
              </ul>

              <div
                className="mt-10 aspect-video bg-cover bg-center"
                style={{
                  backgroundImage: `url('${service.galleryImage}')`,
                  backgroundPosition: service.imagePosition ?? "center center",
                }}
                role="img"
                aria-label={`${service.title} project example`}
              />
            </FadeInUp>
          </div>

          <div className="mt-20">
            <FadeInUp>
              <SectionHeading
                title="Project Examples"
                subtitle={`${projectPhotos.length} photos from real Majestic Pine jobs in this category.`}
              />
            </FadeInUp>
            <div className="mx-auto max-w-4xl">
              <PhotoCarousel
                photos={projectPhotos.map((p) => ({
                  image: p.image,
                  position: service.imagePosition ?? "center center",
                }))}
                title={service.title}
              />
            </div>
            {projectPhotos.length > 8 && (
              <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {projectPhotos.slice(0, 8).map((photo, i) => (
                  <FadeInUp key={photo.image} delay={i * 60}>
                    <article className="overflow-hidden border border-pine-green/10 bg-warm-white">
                      <div
                        className="aspect-[4/3] bg-cover bg-center"
                        style={{
                          backgroundImage: `url('${photo.image}')`,
                          backgroundPosition: service.imagePosition ?? "center center",
                        }}
                        role="img"
                        aria-label={`${service.title} project example`}
                      />
                    </article>
                  </FadeInUp>
                ))}
              </div>
            )}
          </div>

          <div className="mt-20 border-t border-pine-green/10 pt-16">
            <FadeInUp>
              <SectionHeading title="Trust Indicators" />
              <div className="grid gap-6 md:grid-cols-3">
                {[
                  "Fully Licensed & Insured in Minnesota",
                  "5-Star Google Rated Contractor",
                  "Transparent Pricing & Staged Draws",
                ].map((indicator) => (
                  <div
                    key={indicator}
                    className="border-l-2 border-bronze pl-4 text-concrete"
                  >
                    {indicator}
                  </div>
                ))}
              </div>
            </FadeInUp>
          </div>
        </div>
      </section>

      <section className="bg-pine-green/5 py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionHeading title="Related Services" />
          <div className="grid gap-4 md:grid-cols-3">
            {related.map((s) => (
              <Link
                key={s.slug}
                href={`/services/${s.slug}`}
                className="border border-pine-green/20 bg-warm-white p-6 hover:border-bronze transition-colors"
              >
                <h3 className="font-heading font-bold uppercase text-pine-green">
                  {s.title}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
