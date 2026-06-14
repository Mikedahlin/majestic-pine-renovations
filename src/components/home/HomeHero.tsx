"use client";

import { Button } from "@/components/ui/Button";
import { TrustBadges } from "@/components/ui/TrustBadges";

export function HomeHero() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 scale-105 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "linear-gradient(135deg, rgba(36,29,25,0.86) 0%, rgba(79,93,80,0.68) 50%, rgba(36,29,25,0.9) 100%), url('/homepage-kitchen.jpg')",
          backgroundAttachment: "fixed",
        }}
        aria-hidden="true"
      />

      <div className="absolute inset-0 bg-charcoal/30 backdrop-blur-[2px]" />

      <div className="relative z-10 mx-auto max-w-5xl px-6 py-32 text-center lg:px-8">
        <h1 className="font-heading text-3xl font-bold uppercase leading-tight tracking-wide text-warm-white md:text-5xl lg:text-6xl">
          30+ Years of Experience You Can Trust.
        </h1>
        <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-warm-white/85 md:text-xl">
          Honest craftsmanship for homes, cabins, shops, and lake properties
          across Buffalo, the Twin Cities, and the Whitefish Chain area.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Button href="/contact">Request Your Free Consultation</Button>
          <Button href="/services" variant="secondary">
            View Our Work
          </Button>
        </div>

        <div className="mt-16 border border-white/10 bg-white/5 p-6 backdrop-blur-md">
          <TrustBadges />
        </div>
      </div>
    </section>
  );
}
