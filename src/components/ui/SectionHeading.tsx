type SectionHeadingProps = {
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  light?: boolean;
};

export function SectionHeading({
  title,
  subtitle,
  align = "left",
  light = false,
}: SectionHeadingProps) {
  const alignClass = align === "center" ? "text-center mx-auto" : "";

  return (
    <div className={`max-w-3xl mb-12 ${alignClass}`}>
      <h2
        className={`font-heading text-3xl md:text-4xl lg:text-5xl font-bold uppercase tracking-wide ${light ? "text-warm-white" : "text-pine-green"}`}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`mt-4 text-lg leading-relaxed ${light ? "text-warm-white/80" : "text-concrete"}`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
