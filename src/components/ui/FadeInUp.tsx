"use client";

import { useRef, useEffect, useState, type ReactNode } from "react";

type FadeInUpProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  variant?: "up" | "scale" | "rotate" | "left" | "right";
};

const variantClasses: Record<string, string> = {
  up: "entrance-fade-up",
  scale: "entrance-fade-scale",
  rotate: "entrance-fade-rotate",
  left: "entrance-fade-left",
  right: "entrance-fade-right",
};

export function FadeInUp({ children, className = "", delay = 0, variant = "up" }: FadeInUpProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setVisible(true), delay);
          observer.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={ref}
      className={`${variantClasses[variant]} ${visible ? "entrance-visible" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
