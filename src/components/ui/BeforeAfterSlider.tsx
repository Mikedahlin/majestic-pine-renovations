"use client";

import { useCallback, useRef, useState } from "react";

type BeforeAfterSliderProps = {
  before: string;
  after: string;
  alt: string;
};

export function BeforeAfterSlider({ before, after, alt }: BeforeAfterSliderProps) {
  const [position, setPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const updateFromClientX = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.min(100, Math.max(0, pct)));
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative aspect-[16/10] w-full select-none overflow-hidden touch-none"
      onPointerDown={(e) => {
        dragging.current = true;
        e.currentTarget.setPointerCapture(e.pointerId);
        updateFromClientX(e.clientX);
      }}
      onPointerMove={(e) => {
        if (dragging.current) updateFromClientX(e.clientX);
      }}
      onPointerUp={() => {
        dragging.current = false;
      }}
    >
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url('${after}')` }}
        role="img"
        aria-label={`${alt} — after`}
      />
      <div
        className="absolute inset-0 overflow-hidden bg-cover bg-center"
        style={{ backgroundImage: `url('${before}')`, width: `${position}%` }}
        role="img"
        aria-label={`${alt} — before`}
      />

      <div
        className="absolute inset-y-0 z-10 w-1 -translate-x-1/2 bg-warm-white shadow-lg"
        style={{ left: `${position}%` }}
      >
        <div className="absolute top-1/2 left-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-warm-white shadow-lg">
          <svg className="h-5 w-5 text-charcoal" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 5l-5 7 5 7M16 5l5 7-5 7" />
          </svg>
        </div>
      </div>

      <span className="absolute top-3 left-3 z-10 rounded bg-charcoal/70 px-2 py-1 text-xs font-semibold uppercase tracking-widest text-warm-white">
        Before
      </span>
      <span className="absolute top-3 right-3 z-10 rounded bg-charcoal/70 px-2 py-1 text-xs font-semibold uppercase tracking-widest text-warm-white">
        After
      </span>
    </div>
  );
}
