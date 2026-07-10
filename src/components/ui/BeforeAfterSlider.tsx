"use client";

import { useState, useRef, useCallback } from "react";

type BeforeAfterSliderProps = {
  before: string;
  after: string;
  beforeLabel?: string;
  afterLabel?: string;
};

export function BeforeAfterSlider({
  before,
  after,
  beforeLabel = "Before",
  afterLabel = "After",
}: BeforeAfterSliderProps) {
  const [sliderPos, setSliderPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const updatePosition = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setSliderPos((x / rect.width) * 100);
  }, []);

  const onMouseDown = () => {
    dragging.current = true;
  };

  const onMouseUp = () => {
    dragging.current = false;
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (dragging.current) updatePosition(e.clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    updatePosition(e.touches[0].clientX);
  };

  return (
    <div
      ref={containerRef}
      className="relative select-none overflow-hidden"
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseUp}
      onTouchMove={onTouchMove}
      role="slider"
      aria-label="Before and after comparison"
      aria-valuenow={sliderPos}
    >
      <div className="aspect-[4/3] bg-cover bg-center" style={{ backgroundImage: `url('${after}')` }} />

      <div
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${sliderPos}%` }}
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${before}')` }}
        />
      </div>

      <div
        className="absolute top-0 bottom-0 w-1 cursor-ew-resize bg-warm-white"
        style={{ left: `${sliderPos}%` }}
      >
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-warm-white shadow-lg flex items-center justify-center">
          <svg className="h-5 w-5 text-charcoal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7l-4 4 4 4M16 7l4 4-4 4" />
          </svg>
        </div>
      </div>

      <span className="absolute bottom-3 left-3 bg-charcoal/80 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-warm-white backdrop-blur-sm">
        {beforeLabel}
      </span>
      <span className="absolute bottom-3 right-3 bg-charcoal/80 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-warm-white backdrop-blur-sm">
        {afterLabel}
      </span>
    </div>
  );
}
