"use client";

import { useState, useEffect, useCallback } from "react";

type PhotoCarouselProps = {
  photos: { image: string; position?: string }[];
  title: string;
};

export function PhotoCarousel({ photos, title }: PhotoCarouselProps) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const total = photos.length;

  const next = useCallback(() => setActive((p) => (p + 1) % total), [total]);
  const prev = useCallback(() => setActive((p) => (p - 1 + total) % total), [total]);

  useEffect(() => {
    if (paused || total <= 1) return;
    const id = setInterval(next, 5000);
    return () => clearInterval(id);
  }, [paused, total, next]);

  if (total === 0) return null;

  return (
    <div
      className="relative overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative aspect-[16/9] overflow-hidden">
        {photos.map((photo, i) => (
          <div
            key={photo.image}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-700 ${
              i === active ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
            style={{
              backgroundImage: `url('${photo.image}')`,
              backgroundPosition: photo.position ?? "center center",
              animation: i === active && paused ? "none" : i === active ? "ken-burns 12s ease-in-out infinite" : "none",
            }}
            role="img"
            aria-label={`${title} — photo ${i + 1} of ${total}`}
          />
        ))}
      </div>

      {total > 1 && (
        <>
          <button
            type="button"
            onClick={prev}
            className="absolute left-3 top-1/2 z-20 -translate-y-1/2 bg-charcoal/50 p-2 text-warm-white hover:bg-charcoal/80 transition-colors"
            aria-label="Previous photo"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            type="button"
            onClick={next}
            className="absolute right-3 top-1/2 z-20 -translate-y-1/2 bg-charcoal/50 p-2 text-warm-white hover:bg-charcoal/80 transition-colors"
            aria-label="Next photo"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2">
            {photos.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActive(i)}
                className={`h-2 w-2 rounded-full transition-all ${
                  i === active ? "bg-bronze w-6" : "bg-warm-white/60 hover:bg-warm-white/90"
                }`}
                aria-label={`Go to photo ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}

      <div className="absolute right-3 top-3 z-20 rounded bg-charcoal/60 px-2 py-1 text-xs text-warm-white/80">
        {active + 1} / {total}
      </div>
    </div>
  );
}
