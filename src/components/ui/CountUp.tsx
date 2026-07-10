"use client";

import { useRef, useEffect, useState } from "react";

type CountUpProps = {
  end: number;
  suffix?: string;
  label: string;
  duration?: number;
};

export function CountUp({ end, suffix = "", label, duration = 2000 }: CountUpProps) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const counted = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || counted.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !counted.current) {
          counted.current = true;
          const start = performance.now();
          const step = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * end));
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
          observer.unobserve(el);
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [end, duration]);

  return (
    <div ref={ref} className="text-center">
      <p className="font-heading text-5xl font-bold text-bronze md:text-6xl">
        {count}{suffix}
      </p>
      <p className="mt-2 text-sm uppercase tracking-widest text-warm-white/70">{label}</p>
    </div>
  );
}
