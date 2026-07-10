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
  const hasBgImage = style?.backgroundImage;

  return (
    <section
      className={`relative flex items-center justify-center overflow-hidden ${fullScreen ? "min-h-screen" : "min-h-[60vh]"} ${hasBgImage ? "" : backgroundClass}`}
    >
      {hasBgImage && (
        <div
          className="absolute inset-0 bg-cover bg-center animate-ken-burns"
          style={{
            backgroundImage: style!.backgroundImage,
            backgroundPosition: (style as any)?.backgroundPosition ?? "center center",
          }}
          aria-hidden="true"
        />
      )}
      <div
        className={`absolute inset-0 animate-ambient opacity-30 ${hasBgImage ? backgroundClass : ""}`}
        style={{
          backgroundImage:
            "radial-gradient(ellipse at 30% 20%, rgba(184,111,69,0.5) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(79,93,80,0.4) 0%, transparent 50%), radial-gradient(ellipse at 50% 50%, rgba(105,74,54,0.3) 0%, transparent 50%)",
          backgroundSize: "200% 200%",
        }}
        aria-hidden="true"
      />
      {overlay && (
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/70 via-charcoal/50 to-charcoal/80" />
      )}

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
