import { TRUST_BADGES } from "@/lib/constants";

export function TrustBadges() {
  return (
    <div className="flex flex-wrap justify-center gap-6 md:gap-10">
      {TRUST_BADGES.map((badge) => (
        <div
          key={badge}
          className="flex items-center gap-2 text-sm uppercase tracking-wider text-warm-white/90"
        >
          <span className="h-1.5 w-1.5 bg-bronze" aria-hidden="true" />
          {badge}
        </div>
      ))}
    </div>
  );
}
