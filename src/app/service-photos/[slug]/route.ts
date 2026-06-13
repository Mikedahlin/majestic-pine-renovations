import { createServicePhotoSvg } from "@/lib/media-placeholders";

const CACHE_HEADERS = {
  "Content-Type": "image/svg+xml; charset=utf-8",
  "Cache-Control": "public, max-age=31536000, immutable",
} as const;

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;

  return new Response(createServicePhotoSvg(slug), {
    headers: CACHE_HEADERS,
  });
}
