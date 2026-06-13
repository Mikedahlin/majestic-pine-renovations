type Palette = {
  background: string;
  backgroundEnd: string;
  accent: string;
  accentSoft: string;
  text: string;
  frame: string;
};

const PALETTES: readonly Palette[] = [
  {
    background: "#10231a",
    backgroundEnd: "#1d4a36",
    accent: "#c98b4a",
    accentSoft: "#f2d6b1",
    text: "#f7f2eb",
    frame: "#355947",
  },
  {
    background: "#1b1f27",
    backgroundEnd: "#36566d",
    accent: "#d5a15b",
    accentSoft: "#f4dfc1",
    text: "#f7f2eb",
    frame: "#4d677b",
  },
  {
    background: "#2a1d1c",
    backgroundEnd: "#5d3a31",
    accent: "#d8a56a",
    accentSoft: "#f4dfc2",
    text: "#f8f0ea",
    frame: "#76504a",
  },
] as const;

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function hashString(value: string): number {
  let hash = 2166136261;

  for (const char of value) {
    hash ^= char.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

function paletteFor(seed: string): Palette {
  return PALETTES[hashString(seed) % PALETTES.length];
}

function labelFromSlug(slug: string): string {
  const base = slug.replace(/\.[^.]+$/, "");

  return base
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function createPlaceholderSvg({
  eyebrow,
  title,
  subtitle,
  seed,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  seed: string;
}): string {
  const palette = paletteFor(seed);
  const safeEyebrow = escapeXml(eyebrow);
  const safeTitle = escapeXml(title);
  const safeSubtitle = escapeXml(subtitle);

  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" role="img" aria-labelledby="title desc">
  <title id="title">${safeTitle}</title>
  <desc id="desc">${safeSubtitle}</desc>
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${palette.background}" />
      <stop offset="100%" stop-color="${palette.backgroundEnd}" />
    </linearGradient>
    <linearGradient id="panel" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="rgba(255,255,255,0.08)" />
      <stop offset="100%" stop-color="rgba(255,255,255,0.02)" />
    </linearGradient>
    <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
      <path d="M 80 0 L 0 0 0 80" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="1" />
    </pattern>
  </defs>

  <rect width="1600" height="900" fill="url(#bg)" />
  <rect width="1600" height="900" fill="url(#grid)" />
  <circle cx="1290" cy="155" r="210" fill="${palette.accent}" opacity="0.12" />
  <circle cx="180" cy="770" r="240" fill="${palette.accentSoft}" opacity="0.08" />
  <path d="M0 690 C280 560 530 610 760 520 C1020 420 1240 300 1600 360 L1600 900 L0 900 Z" fill="rgba(8, 12, 11, 0.28)" />

  <rect x="110" y="110" width="1380" height="680" rx="34" fill="url(#panel)" stroke="${palette.frame}" stroke-width="2" />
  <rect x="160" y="160" width="1280" height="580" rx="24" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="2" />

  <text x="200" y="240" fill="${palette.accentSoft}" font-size="34" font-family="Arial, Helvetica, sans-serif" letter-spacing="8">
    ${safeEyebrow.toUpperCase()}
  </text>
  <text x="200" y="380" fill="${palette.text}" font-size="88" font-weight="700" font-family="Arial, Helvetica, sans-serif">
    ${safeTitle}
  </text>
  <text x="200" y="458" fill="rgba(247,242,235,0.85)" font-size="34" font-family="Arial, Helvetica, sans-serif">
    ${safeSubtitle}
  </text>

  <g transform="translate(1110 250)">
    <rect width="220" height="220" rx="28" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.14)" stroke-width="2" />
    <path d="M50 170 L92 122 L126 154 L170 100 L220 170 Z" fill="none" stroke="${palette.accentSoft}" stroke-width="10" stroke-linecap="round" stroke-linejoin="round" />
    <circle cx="84" cy="82" r="20" fill="${palette.accent}" />
  </g>

  <text x="200" y="675" fill="rgba(247,242,235,0.72)" font-size="28" font-family="Arial, Helvetica, sans-serif">
    Majestic Pine Renovations
  </text>
  <text x="200" y="720" fill="rgba(247,242,235,0.58)" font-size="24" font-family="Arial, Helvetica, sans-serif">
    Upload project photography anytime to replace this branded fallback.
  </text>
</svg>`.trim();
}

export function createServicePhotoSvg(slug: string): string {
  const title = labelFromSlug(slug);

  return createPlaceholderSvg({
    eyebrow: "Project Preview",
    title,
    subtitle: "Branded placeholder rendered by the app while local project media is unavailable.",
    seed: slug,
  });
}

export function createPortraitSvg(): string {
  return createPlaceholderSvg({
    eyebrow: "Founder Profile",
    title: "Jeremy Stoesz",
    subtitle: "Founder and site lead for Majestic Pine Renovations.",
    seed: "jeremy-stoesz",
  });
}
