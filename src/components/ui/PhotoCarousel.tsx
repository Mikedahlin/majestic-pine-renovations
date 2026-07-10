"use client";

import { useState, useEffect, useCallback } from "react";

type Photo = {
  image: string;
  caption?: string;
  position?: string;
  fit?: "cover" | "contain";
};

type PhotoCarouselProps = {
  photos: Photo[];
  interval?: number;
};

export function PhotoCarousel({ photos, interval = 5000 }: PhotoCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % photos.length);
  }, [photos.length]);

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + photos.length) % photos.length);
  }, [photos.length]);

  useEffect(() => {
    if (paused || photos.length <= 1) return;
    const id = setInterval(next, interval);
    return () => clearInterval(id);
  }, [paused, photos.length, interval, next]);

  if (photos.length === 0) return null;

  return (
    <div
      className="relative overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative aspect-[16/9] overflow-hidden bg-charcoal">
        {photos.map((photo, i) => (
          <div
            key={photo.image}
            className={`absolute inset-0 transition-opacity duration-700 ${
              i === current ? "opacity-100" : "opacity-0"
            }`}
          >
            <div
              className={`h-full w-full ${
                i === current ? "animate-ken-burns" : ""
              } ${photo.fit === "contain" ? "bg-contain" : "bg-cover"} bg-center bg-no-repeat`}
              style={{ backgroundImage: `url('${photo.image}')` }}
              role="img"
              aria-label={photo.caption ?? `Photo ${i + 1}`}
            />
          </div>
        ))}
      </div>

      {photos.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-charcoal/60 p-3 text-warm-white backdrop-blur-sm transition-colors hover:bg-charcoal/80"
            aria-label="Previous photo"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-charcoal/60 p-3 text-warm-white backdrop-blur-sm transition-colors hover:bg-charcoal/80"
            aria-label="Next photo"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
            {photos.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-2 w-2 rounded-full transition-colors ${
                  i === current ? "bg-bronze" : "bg-warm-white/50"
                }`}
                aria-label={`Go to photo ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}

      {photos[current].caption && (
        <div className="bg-charcoal px-5 py-4">
          <p className="text-sm font-semibold uppercase tracking-wider text-warm-white">
            {photos[current].caption}
          </p>
        </div>
      )}
    </div>
  );
}
