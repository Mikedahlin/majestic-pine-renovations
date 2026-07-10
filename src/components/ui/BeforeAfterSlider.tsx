"use client";

import { useState, useEffect, useRef } from "react";

type BeforeAfterSliderProps = {
  before: string;
  after: string;
  beforeLabel?: string;
  afterLabel?: string;
  interval?: number;
};

export function BeforeAfterSlider({
  before,
  after,
  beforeLabel = "Before",
  afterLabel = "After",
  interval = 4000,
}: BeforeAfterSliderProps) {
  const [phase, setPhase] = useState<"before" | "blurring" | "after" | "revealing">("before");
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    const run = () => {
      setPhase("blurring");
      timeoutRef.current = setTimeout(() => {
        setPhase("after");
        timeoutRef.current = setTimeout(() => {
          setPhase("revealing");
          timeoutRef.current = setTimeout(() => {
            setPhase("before");
          }, 2000);
        }, interval);
      }, 2000);
    };

    timeoutRef.current = setTimeout(run, interval);
    return () => clearTimeout(timeoutRef.current);
  }, [interval]);

  const isBlurred = phase === "blurring" || phase === "revealing";
  const showAfter = phase === "after" || phase === "revealing";

  return (
    <div className="relative aspect-[4/3] overflow-hidden bg-charcoal">
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-[2000ms] ease-in-out"
        style={{
          backgroundImage: `url('${before}')`,
          filter: isBlurred ? "blur(24px)" : "blur(0px)",
          opacity: showAfter ? 0 : 1,
        }}
      />
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-[2000ms] ease-in-out"
        style={{
          backgroundImage: `url('${after}')`,
          filter: isBlurred ? "blur(24px)" : "blur(0px)",
          opacity: showAfter ? 1 : 0,
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
