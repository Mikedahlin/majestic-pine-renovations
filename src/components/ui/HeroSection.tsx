import type { CSSProperties, ReactNode } from "react";

type HeroSectionProps = {
  title: string;
  subtitle?: string;
  children?: ReactNode;
  backgroundClass?: string;
  overlay?: boolean;
  fullScreen?: boolean;
  h1?: boolean;
  style?: CSSProperties;
};

export function HeroSection({
  title,
  subtitle,
  children,
  backgroundClass = "bg-pine-green",
  overlay = true,
  fullScreen = false,
  h1 = true,
  style,
}: HeroSectionProps) {
  const Tag = h1 ? "h1" : "h2";

  return (
    <section
      className={`relative flex items-center justify-center overflow-hidden ${fullScreen ? "min-h-screen" : "min-h-[60vh]"} ${backgroundClass}`}
      style={style}
    >
      {overlay && (
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/70 via-charcoal/50 to-charcoal/80" />
      )}
      <div className="absolute inset-0 bg-[url('/textures/noise.png')] opacity-[0.03] mix-blend-overlay" />

      <div className="relative z-10 mx-auto max-w-5xl px-6 py-32 text-center lg:px-8">
        <Tag className="font-heading text-3xl md:text-5xl lg:text-6xl font-bold uppercase tracking-wide text-warm-white leading-tight">
          {title}
        </Tag>
        {subtitle && (
          <p className="mx-auto mt-6 max-w-3xl text-lg md:text-xl text-warm-white/85 leading-relaxed">
            {subtitle}
          </p>
        )}
        {children && <div className="mt-10 flex flex-wrap justify-center gap-4">{children}</div>}
      </div>
    </section>
  );
}
