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

  const showAfter = phase === "after" || phase === "going-to-after";
  const beforeInFocus = phase === "before";
  const afterInFocus = phase === "after";

  return (
    <div className="relative aspect-[4/3] overflow-hidden bg-charcoal">
      {/* Before: sharp when active, blurs + fades out as After comes in */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-[2000ms] ease-in-out"
        style={{
          backgroundImage: `url('${before}')`,
          opacity: showAfter ? 0 : 1,
          filter: beforeInFocus ? "blur(0px)" : "blur(28px)",
          transform: beforeInFocus ? "scale(1)" : "scale(1.04)",
        }}
        aria-hidden={showAfter}
      />
      {/* After: starts soft/out of focus, sharpens as it fades in */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-[2000ms] ease-in-out"
        style={{
          backgroundImage: `url('${after}')`,
          opacity: showAfter ? 1 : 0,
          filter: afterInFocus ? "blur(0px)" : "blur(28px)",
          transform: afterInFocus ? "scale(1)" : "scale(1.04)",
        }}
        aria-hidden={!showAfter}
      />
      <span
        className={`absolute bottom-3 left-3 bg-charcoal/80 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-warm-white backdrop-blur-sm transition-opacity duration-500 ${
          showAfter ? "opacity-40" : "opacity-100"
        }`}
      >
        {beforeLabel}
      </span>
      <span
        className={`absolute bottom-3 right-3 bg-charcoal/80 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-warm-white backdrop-blur-sm transition-opacity duration-500 ${
          showAfter ? "opacity-100" : "opacity-40"
        }`}
      >
        {afterLabel}
      </span>
    </div>
  );
}
