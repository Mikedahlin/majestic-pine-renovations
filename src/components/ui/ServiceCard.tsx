"use client";

import Link from "next/link";
import { FadeInUp } from "./FadeInUp";

type ServiceCardProps = {
  title: string;
  description: string;
  href: string;
  image?: string;
  imageLabel?: string;
  index?: number;
};

export function ServiceCard({
  title,
  description,
  href,
  image,
  imageLabel,
  index = 0,
}: ServiceCardProps) {
  return (
    <FadeInUp delay={index * 100}>
      <Link
        href={href}
        className="group block overflow-hidden border border-pine-green/20 bg-warm-white transition-all duration-300 hover:border-bronze hover:shadow-lg"
      >
        {image && (
          <div
            className="aspect-[4/3] bg-cover bg-center transition-transform duration-500 group-hover:scale-[1.02]"
            style={{ backgroundImage: `url('${image}')` }}
            role="img"
            aria-label={imageLabel ?? `${title} project example`}
          />
        )}
        <div className="p-8">
          <div className="mb-4 h-1 w-12 bg-bronze transition-all group-hover:w-20" />
          <h3 className="font-heading text-xl font-bold uppercase tracking-wide text-pine-green group-hover:text-bronze transition-colors">
            {title}
          </h3>
          <p className="mt-3 text-concrete leading-relaxed">{description}</p>
          <span className="mt-6 inline-block text-sm uppercase tracking-widest text-pine-green group-hover:text-bronze transition-colors">
            Learn More →
          </span>
        </div>
      </Link>
    </FadeInUp>
  );
}
