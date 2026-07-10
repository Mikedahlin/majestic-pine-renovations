"use client";

import { useState, useEffect, useRef } from "react";

type BeforeAfterSliderProps = {
  before: string;
  after: string;
  beforeLabel?: string;
  afterLabel?: string;
  interval?: number;
};

type Phase = "before" | "going-to-after" | "after" | "going-to-before";

export function BeforeAfterSlider({
  before,
  after,
  beforeLabel = "Before",
  afterLabel = "After",
  interval = 4000,
}: BeforeAfterSliderProps) {
  const [phase, setPhase] = useState<Phase>("before");
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    const goToAfter = () => setPhase("going-to-after");
    const showAfter = () => setPhase("after");
    const goToBefore = () => setPhase("going-to-before");
    const showBefore = () => setPhase("before");

    if (phase === "before") {
      timeoutRef.current = setTimeout(goToAfter, interval);
    } else if (phase === "going-to-after") {
      timeoutRef.current = setTimeout(showAfter, 2000);
    } else if (phase === "after") {
      timeoutRef.current = setTimeout(goToBefore, interval);
    } else if (phase === "going-to-before") {
      timeoutRef.current = setTimeout(showBefore, 2000);
    }

    return () => clearTimeout(timeoutRef.current);
  }, [phase, interval]);

  const transitioning = phase === "going-to-after" || phase === "going-to-before";
  const showAfter = phase === "after" || phase === "going-to-after";

  return (
    <div className="relative aspect-[4/3] overflow-hidden bg-charcoal">
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-[2000ms] ease-in-out"
        style={{
          backgroundImage: `url('${before}')`,
          opacity: showAfter ? 0 : 1,
          filter: transitioning ? "blur(24px)" : "blur(0px)",
        }}
      />
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-[2000ms] ease-in-out"
        style={{
          backgroundImage: `url('${after}')`,
          opacity: showAfter ? 1 : 0,
          filter: transitioning ? "blur(24px)" : "blur(0px)",
        }}
      />
      <span className="absolute bottom-3 left-3 bg-charcoal/80 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-warm-white backdrop-blur-sm">
        {beforeLabel}
      </span>
      <span className="absolute bottom-3 right-3 bg-charcoal/80 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-warm-white backdrop-blur-sm">
        {afterLabel}
      </span>
    </div>
  );
}
