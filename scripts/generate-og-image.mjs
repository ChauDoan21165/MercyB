// scripts/generate-og-image.mjs
//
// Generates the social-share card (Open Graph / Twitter / Zalo) at
// public/brand/og-image.png — 1200×630, the standard Facebook/Zalo
// preview size. Run once; the PNG is committed and shipped as-is
// (CI never regenerates it, so CI font availability is irrelevant).
//
//   node scripts/generate-og-image.mjs
//
// `sharp` is already a dependency (no new deps). It rasterises the
// authored SVG below. Vietnamese diacritics resolve via the host's
// system fonts at generation time; verify the committed PNG visually.

import sharp from "sharp";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "..", "public", "brand", "og-image.png");

// Brand gradient mirrors Home.tsx headlineAccent
// (#B45309 → #D97706 → #14B8A6 → #0F766E).
const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1200" height="630" viewBox="0 0 1200 630"
     xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0"    stop-color="#7C3A06"/>
      <stop offset="0.30" stop-color="#B45309"/>
      <stop offset="0.62" stop-color="#0F766E"/>
      <stop offset="1"    stop-color="#0B3D38"/>
    </linearGradient>
  </defs>

  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect x="56" y="56" width="1088" height="518" rx="28"
        fill="rgba(0,0,0,0.22)"/>

  <text x="104" y="150"
        font-family="Arial, Helvetica, 'Liberation Sans', sans-serif"
        font-size="34" font-weight="700" fill="#FDE7C8"
        letter-spacing="2">MERCYBLADE</text>

  <text font-family="Arial, Helvetica, 'Liberation Sans', sans-serif"
        font-weight="800" fill="#FFFFFF" font-size="62">
    <tspan x="104" y="290">Ngoại ngữ cho người Việt</tspan>
    <tspan x="104" y="368">và Tiếng Việt cho thế giới</tspan>
  </text>

  <text x="104" y="452"
        font-family="Arial, Helvetica, 'Liberation Sans', sans-serif"
        font-size="30" font-weight="600" fill="#E7FBF6">
    Sửa lỗi tiếng Anh của người Việt — giải thích bằng tiếng Việt
  </text>

  <text x="104" y="528"
        font-family="Arial, Helvetica, 'Liberation Sans', sans-serif"
        font-size="26" font-weight="700" fill="#FDE7C8"
        letter-spacing="1">mercyblade.com</text>
</svg>`;

await sharp(Buffer.from(svg)).png().toFile(OUT);
console.log(`✓ wrote ${OUT}`);
