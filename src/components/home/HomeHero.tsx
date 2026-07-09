"use client";

import { Button } from "@/components/ui/Button";
import { TrustBadges } from "@/components/ui/TrustBadges";
import { SITE_IMAGES } from "@/lib/site-images";

export function HomeHero() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* Cinematic video background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster={SITE_IMAGES.homeHero}
        className="absolute inset-0 h-full w-full object-cover scale-105"
        aria-hidden="true"
      >
        <source src="/hero-bg.mp4" type="video/mp4" />
      </video>

      {/* Animated gradient overlay over video */}
      <div
        className="absolute inset-0 animate-ambient"
        style={{
          backgroundImage: "linear-gradient(135deg, rgba(18,18,18,0.85) 0%, rgba(26,54,38,0.65) 25%, rgba(205,127,50,0.25) 50%, rgba(26,54,38,0.65) 75%, rgba(18,18,18,0.9) 100%)",
        }}
        aria-hidden="true"
      />

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
