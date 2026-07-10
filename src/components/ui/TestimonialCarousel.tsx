"use client";

import { useState, useEffect } from "react";
import { FadeInUp } from "./FadeInUp";

const testimonials = [
  {
    author: "Sarah & Michael K.",
    location: "Minneapolis, MN",
    text: "Majestic Pine transformed our dated kitchen into a showpiece. Jeremy's team was transparent every step of the way, and the craftsmanship is extraordinary.",
    project: "Kitchen Remodel",
    rating: 5,
  },
  {
    author: "Dr. James Whitfield",
    location: "Buffalo, MN",
    text: "Our medical office build-out was completed on schedule with zero disruption to patient care. Their commercial project management is truly elite.",
    project: "Medical Build-Out",
    rating: 5,
  },
  {
    author: "Lisa & Tom R.",
    location: "Edina, MN",
    text: "The deck and outdoor kitchen they built handles Minnesota winters beautifully. We use the space from April through November — it's become our favorite room.",
    project: "Outdoor Living",
    rating: 5,
  },
  {
    author: "Northstar Retail Group",
    location: "Saint Paul, MN",
    text: "Three retail locations renovated in six months. Consistent quality, clear communication, and budgets held across every site.",
    project: "Commercial Retail",
    rating: 5,
  },
];

export function TestimonialCarousel() {
  const [active, setActive] = useState(0);
  const [visible, setVisible] = useState(true);
  const current = testimonials[active];

  const goTo = (index: number) => {
    setVisible(false);
    setTimeout(() => {
      setActive(index);
      setVisible(true);
    }, 300);
  };

  useEffect(() => {
    const id = setInterval(() => {
      goTo((active + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(id);
  }, [active]);

  return (
    <div className="relative">
      <FadeInUp>
        <div
          className={`border border-pine-green/20 bg-warm-white p-8 md:p-12 transition-opacity duration-300 ${
            visible ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="flex gap-1 mb-6" aria-label={`${current.rating} out of 5 stars`}>
            {Array.from({ length: current.rating }).map((_, i) => (
              <span key={i} className="text-bronze text-lg" aria-hidden="true">★</span>
            ))}
          </div>
          <blockquote className="text-lg md:text-xl text-charcoal leading-relaxed italic">
            &ldquo;{current.text}&rdquo;
          </blockquote>
          <footer className="mt-6">
            <cite className="not-italic">
              <span className="font-semibold text-pine-green">{current.author}</span>
              <span className="text-concrete"> — {current.location}</span>
            </cite>
            <p className="mt-1 text-sm uppercase tracking-wider text-bronze">
              {current.project}
            </p>
          </footer>
        </div>
      </FadeInUp>

      <div className="mt-6 flex justify-center gap-3">
        {testimonials.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`View testimonial ${i + 1}`}
            className={`h-2 w-8 transition-colors ${i === active ? "bg-bronze" : "bg-concrete/30"}`}
            onClick={() => goTo(i)}
          />
        ))}
      </div>
    </div>
  );
}
