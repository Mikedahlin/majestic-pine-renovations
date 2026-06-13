import { FadeInUp } from "./FadeInUp";
import { Button } from "./Button";
import { ProjectPhoto } from "./ProjectPhoto";

type ServiceDetailBlockProps = {
  title: string;
  headline: string;
  description: string;
  process: string[];
  benefits: string[];
  slug: string;
  image: string;
  imagePosition?: string;
  index?: number;
};

export function ServiceDetailBlock({
  title,
  headline,
  description,
  process,
  benefits,
  slug,
  image,
  imagePosition = "center center",
  index = 0,
}: ServiceDetailBlockProps) {
  return (
    <FadeInUp delay={index * 100}>
      <article className="grid gap-8 border-b border-pine-green/10 py-16 lg:grid-cols-2">
        <div>
          <p className="text-sm uppercase tracking-widest text-bronze">{title}</p>
          <h2 className="mt-2 font-heading text-2xl md:text-3xl font-bold uppercase tracking-wide text-pine-green">
            {headline}
          </h2>
          <p className="mt-4 text-concrete leading-relaxed">{description}</p>
          <div className="mt-6">
            <Button href={`/services/${slug}`} variant="outline" className="!text-sm">
              View Full Service Details
            </Button>
          </div>
        </div>

        <div className="space-y-8">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-widest text-pine-green">
              Our Process
            </h3>
            <ol className="mt-3 space-y-2">
              {process.map((step, i) => (
                <li key={step} className="flex gap-3 text-concrete">
                  <span className="font-semibold text-bronze">{String(i + 1).padStart(2, "0")}</span>
                  {step}
                </li>
              ))}
            </ol>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-widest text-pine-green">
              Key Benefits
            </h3>
            <ul className="mt-3 space-y-2">
              {benefits.map((benefit) => (
                <li key={benefit} className="flex items-start gap-2 text-concrete">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-bronze" aria-hidden="true" />
                  {benefit}
                </li>
              ))}
            </ul>
          </div>

          <ProjectPhoto
            src={image}
            alt={`${title} project example`}
            className="aspect-video"
            position={imagePosition}
          />
        </div>
      </article>
    </FadeInUp>
  );
}
