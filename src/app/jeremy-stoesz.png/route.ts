import { createPortraitSvg } from "@/lib/media-placeholders";

export function GET() {
  return new Response(createPortraitSvg(), {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
