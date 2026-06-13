import { ImageResponse } from "next/og";
import { SITE_NAME } from "@/lib/constants";
import { SocialImage } from "@/lib/social-image";

export const alt = `${SITE_NAME} social preview`;

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(<SocialImage />, size);
}
