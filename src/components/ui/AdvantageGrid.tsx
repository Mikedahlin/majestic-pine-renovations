import { FadeInUp } from "./FadeInUp";

const advantages = [
  {
    title: "Reliable Planning",
    description:
      "Clear scopes, realistic timelines, and a process that helps customers know what is happening next.",
  },
  {
    title: "Work Built to Last",
    description:
      "Materials and construction choices that make sense for Minnesota weather, wear, and long-term use.",
  },
  {
    title: "Residential and Commercial Experience",
    description:
      "From home remodels and garages to shop spaces and commercial updates, the same standards apply across the board.",
  },
  {
    title: "Transparent Pricing",
    description:
      "Detailed estimates, direct conversations, and fewer surprises when it comes to cost and scope.",
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
