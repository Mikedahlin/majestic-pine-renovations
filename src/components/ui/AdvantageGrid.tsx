import { FadeInUp } from "./FadeInUp";

const advantages = [
  {
    title: "Elite Reliability",
    description:
      "Commercial-grade scheduling, daily progress reporting, and on-time delivery backed by rigorous project controls.",
  },
  {
    title: "Uncompromising Craftsmanship",
    description:
      "Artisan finish work, precision joinery, and materials selected for longevity in Minnesota's demanding climate.",
  },
  {
    title: "Scalable Capability",
    description:
      "From single-room remodels to multi-phase commercial build-outs — one team, one standard of excellence.",
  },
  {
    title: "Transparent Pricing",
    description:
      "Detailed estimates, staged draw schedules, and zero surprise change orders. You always know where your investment goes.",
  },
];

export function AdvantageGrid() {
  return (
    <div className="grid gap-8 md:grid-cols-2">
      {advantages.map((item, i) => (
        <FadeInUp key={item.title} delay={i * 80}>
          <div className="border-l-2 border-bronze pl-6">
            <h3 className="font-heading text-lg font-bold uppercase tracking-wide text-pine-green">
              {item.title}
            </h3>
            <p className="mt-2 text-concrete leading-relaxed">{item.description}</p>
          </div>
        </FadeInUp>
      ))}
    </div>
  );
}
