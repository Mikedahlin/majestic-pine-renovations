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
  const premiumGallery = service.galleryVariant === "premium";
  const premiumSpans = [
    "lg:col-span-7",
    "lg:col-span-5",
    "lg:col-span-12",
    "lg:col-span-5",
    "lg:col-span-7",
    "lg:col-span-6",
    "lg:col-span-6",
  ];
  const projectNumber = (caption: string | undefined, fallback: number) => {
    const number = caption?.match(/\d+$/)?.[0];
    return number ?? String(fallback).padStart(2, "0");
  };

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
        backgroundClass={service.heroImage ? "bg-cover bg-center" : "bg-walnut"}
        style={
          service.heroImage
            ? {
                backgroundImage: `url('${service.heroImage}')`,
                backgroundPosition: service.imagePosition ?? "center center",
              }
            : undefined
        }
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

              {service.galleryImage && (
                <div
                  className="mt-10 aspect-video bg-cover bg-center"
                  style={{
                    backgroundImage: `url('${service.galleryImage}')`,
                    backgroundPosition: service.imagePosition ?? "center center",
                  }}
                  role="img"
                  aria-label={`${service.title} photo`}
                />
              )}
            </FadeInUp>
          </div>

          {service.photos.length > 0 && (
            <div
              className={`mt-20 ${
                premiumGallery
                  ? "border-y border-bronze/40 bg-charcoal px-6 py-16 shadow-2xl lg:px-10"
                  : ""
              }`}
            >
              <FadeInUp>
                {premiumGallery && (
                  <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-bronze">
                    Real Project Transformations
                  </p>
                )}
                <SectionHeading
                  title={service.galleryTitle ?? `${service.title} Gallery`}
                  subtitle={
                    service.gallerySubtitle
                  }
                  light={premiumGallery}
                />
              </FadeInUp>
              <div
                className={
                  premiumGallery
                    ? "grid gap-6 lg:grid-cols-12"
                    : "grid gap-6 md:grid-cols-3"
                }
              >
                {service.photos.map((photo, i) => (
                  <FadeInUp
                    key={photo.image}
                    delay={i * 80}
                    className={premiumGallery ? premiumSpans[i] : ""}
                  >
                    <article
                      className={`group overflow-hidden bg-warm-white ${
                        premiumGallery
                          ? "border border-white/10 shadow-[0_24px_60px_rgba(0,0,0,0.28)]"
                          : "border border-pine-green/10"
                      }`}
                    >
                      <div className="relative">
                      <div
                        className={`bg-center bg-no-repeat transition-transform duration-700 group-hover:scale-[1.015] ${
                          premiumGallery
                            ? i === 2
                              ? "aspect-[2/1]"
                              : "aspect-[16/10]"
                            : "aspect-[4/3]"
                        } ${
                          photo.fit === "contain" ? "bg-contain" : "bg-cover"
                        }`}
                        style={{
                          backgroundImage: `url('${photo.image}')`,
                          backgroundPosition:
                            photo.position ?? service.imagePosition ?? "center center",
                        }}
                        role="img"
                        aria-label={photo.caption ?? `${service.title} photo`}
                      />
                        {premiumGallery && (
                          <span className="absolute left-4 top-4 bg-charcoal/90 px-3 py-2 text-xs font-bold uppercase tracking-[0.22em] text-warm-white backdrop-blur-sm">
                            Project {projectNumber(photo.caption, i + 1).padStart(2, "0")}
                          </span>
                        )}
                      </div>
                      {photo.caption && (
                        <p
                          className={`border-t px-5 py-4 text-sm font-semibold uppercase tracking-wider ${
                            premiumGallery
                              ? "border-charcoal/10 text-charcoal"
                              : "border-pine-green/10 text-walnut"
                          }`}
                        >
                          {photo.caption}
                        </p>
                      )}
                    </article>
                  </FadeInUp>
                ))}
              </div>
            </div>
          )}

          <div className="mt-20 border-t border-pine-green/10 pt-16">
            <FadeInUp>
              <SectionHeading title="Trust Indicators" />
              <div className="grid gap-6 md:grid-cols-3">
                {[
                  "Clear Project Scope and Planning",
                  "Materials Selected for Minnesota Conditions",
                  "Direct Communication From Start to Finish",
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
