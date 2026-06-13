"use client";

import { Button } from "@/components/ui/Button";
import { TrustBadges } from "@/components/ui/TrustBadges";

export function HomeHero() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <img
        src="/service-photos/kitchen-hero.jpg"
        alt=""
        className="absolute inset-0 h-full w-full scale-105 object-cover"
        aria-hidden="true"
        fetchPriority="high"
      />
      <div
        className="absolute inset-0 bg-gradient-to-br from-charcoal/85 via-pine-green/70 to-charcoal/90"
        aria-hidden="true"
      />

      {/* Glassmorphism overlay */}
      <div className="absolute inset-0 bg-charcoal/30 backdrop-blur-[2px]" />

      <div className="relative z-10 mx-auto max-w-5xl px-6 py-32 text-center lg:px-8">
        <h1 className="font-heading text-3xl md:text-5xl lg:text-6xl font-bold uppercase tracking-wide text-warm-white leading-tight">
          We Build Exceptional Spaces With Craftsmanship, Integrity, and Modern Innovation.
        </h1>
        <p className="mx-auto mt-6 max-w-3xl text-lg md:text-xl text-warm-white/85 leading-relaxed">
          Premier Residential &amp; Commercial General Contracting for Minneapolis,
          Buffalo, and the Twin Cities Metro.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Button href="/contact">Request Your Free Consultation</Button>
          <Button href="/services" variant="secondary">
            View Our Work
          </Button>
        </div>

        <div className="mt-16 rounded-none border border-white/10 bg-white/5 p-6 backdrop-blur-md">
          <TrustBadges />
        </div>
      </div>
    </section>
  );
}
