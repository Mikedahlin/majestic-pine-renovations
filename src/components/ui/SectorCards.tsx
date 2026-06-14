import { FadeInUp } from "./FadeInUp";

const sectors = [
  {
    title: "Hospital & Medical",
    description:
      "HIPAA-aware build-outs, sterile environment compliance, and phased construction that keeps facilities operational.",
  },
  {
    title: "Corporate Office",
    description:
      "Open-plan conversions, conference suites, and technology infrastructure for modern workplaces.",
  },
  {
    title: "Retail & Hospitality",
    description:
      "Brand-aligned interiors, high-traffic flooring, and fast-turn tenant improvements.",
  },
  {
    title: "Multi-Unit Properties",
    description:
      "Apartment renovations, common area upgrades, and portfolio-scale project coordination.",
  },
];

export function SectorCards() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {sectors.map((sector, i) => (
        <FadeInUp key={sector.title} delay={i * 80}>
          <div className="group border border-white/10 bg-charcoal p-8 transition-colors hover:border-bronze">
            <h3 className="font-heading text-lg font-bold uppercase tracking-wide text-warm-white group-hover:text-bronze transition-colors">
              {sector.title}
            </h3>
            <p className="mt-3 text-warm-white/70 leading-relaxed">{sector.description}</p>
          </div>
        </FadeInUp>
      ))}
    </div>
  );
}
