import { BackgroundImage } from "./BackgroundImage";

type ProjectPhotoProps = {
  src: string;
  alt: string;
  className?: string;
  position?: string;
};

export function ProjectPhoto({
  src,
  alt,
  className = "aspect-[4/3]",
  position = "center",
}: ProjectPhotoProps) {
  return (
    <BackgroundImage
      src={src}
      alt={alt}
      className={className}
      position={position}
    />
  );
}
