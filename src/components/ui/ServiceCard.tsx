"use client";

import Link from "next/link";
import { FadeInUp } from "./FadeInUp";
import { BackgroundImage } from "./BackgroundImage";

type ServiceCardProps = {
  title: string;
  description: string;
  href: string;
  image?: string;
  index?: number;
};

export function ServiceCard({ title, description, href, image, index = 0 }: ServiceCardProps) {
  return (
    <FadeInUp delay={index * 100}>
      <Link
        href={href}
        className="group block border border-pine-green/20 bg-warm-white transition-all duration-300 hover:border-bronze hover:shadow-lg"
      >
        {image && (
          <BackgroundImage
            src={image}
            alt=""
            className="aspect-[16/9]"
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
