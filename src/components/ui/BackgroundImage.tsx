import type { CSSProperties, ReactNode } from "react";

type BackgroundImageProps = {
  src: string;
  alt?: string;
  className?: string;
  imageClassName?: string;
  position?: string;
  overlay?: ReactNode;
  children?: ReactNode;
  style?: CSSProperties;
  priority?: boolean;
};

export function BackgroundImage({
  src,
  alt = "",
  className = "",
  imageClassName = "",
  position = "center",
  overlay,
  children,
  style,
  priority = false,
}: BackgroundImageProps) {
  return (
    <div className={`relative overflow-hidden ${className}`} style={style}>
      {/* Native img is intentional for reliable cross-browser background rendering */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className={`absolute inset-0 h-full w-full object-cover ${imageClassName}`}
        style={{ objectPosition: position }}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={priority ? "high" : "auto"}
      />
      {overlay}
      {children}
    </div>
  );
}
