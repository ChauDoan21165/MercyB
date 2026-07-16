// Generate a 1200×630 PNG score card client-side via the Canvas API.
// Output is sized for Facebook's OG card (1200×630, ratio 1.91:1 — also
// the default for Twitter, LinkedIn, and the Web Share API previews).
//
// Pure-function helpers (headline, chip color, layout math) are
// exported so vitest can cover them without booting a real canvas.
//
// Visual layout (1200 × 630):
//
//   ┌────────────────────────────────────────────────────────────┐
//   │  [MercyBlade]                                              │  72px  band 1 (brand)
//   │                                                            │
//   │  Tôi đạt {score}/100 trên MercyBlade!         ┌────────┐   │  band 2 (headline)
//   │  I scored {score}/100 on MercyBlade!          │  {NN}  │   │
//   │                                                │  /100  │   │
//   │  "{sentence}"                                  └────────┘   │  band 3 (sentence + score gauge)
//   │                                                            │
//   │  ⬛ correct  ⬛ close  ⬛ practice                         │  band 4 (legend)
//   │  [word] [word] [word] [word] [word]                        │  band 5 (chips)
//   │                                                            │
//   │  mercyblade.com                          [Mercy]           │  band 6 (footer)
//   └────────────────────────────────────────────────────────────┘
//
// Colors track the existing brand palette (MercyBlade rose / pink for
// the headline band, sky for the score gauge, Tailwind emerald / amber
// / rose for chips). No new tokens introduced.

import { PRODUCT_CONFIG } from "@/config/product";

// ── Public types ─────────────────────────────────────────────────────────

export type ChipColor = "correct" | "close" | "practice" | "neutral";

/**
 * Per-word score for the chip row. `score` is 0..100 if known, undefined
 * if the local scorer didn't produce per-word data — in that case the
 * chip renders neutral (no color signal).
 */
export type ShareWordScore = {
  word: string;
  score?: number;
};

/**
 * Inputs the share-card generator accepts. Decoupled from
 * `ScoreResult` (the Azure / Speechace shape) so MercySpeakTab — which
 * runs the local word-bag scorer — can also produce a card without
 * fabricating fields it doesn't have.
 *
 * `wordScores` is optional: if absent or empty, the chip row falls back
 * to a plain word list with no per-chip color. When present, chip color
 * is decided by `chipColorForScore` below.
 */
export type ShareScoreInput = {
  /** The target sentence the user practised. */
  sentence: string;
  /** Overall accuracy score 0..100 (rounded by caller). */
  overallScore: number;
  /** Per-word breakdown when available. */
  wordScores?: ShareWordScore[];
  /** "azure" | "local" — used for tracking only; not rendered. */
  provider?: "azure" | "local";
};

// ── Layout constants (exported for tests + future tuning) ────────────────

export const CARD_WIDTH = 1200;
export const CARD_HEIGHT = 630;

/**
 * Score buckets that drive both the colored score gauge and per-chip color.
 * Thresholds match the existing scorer in src/lib/pronunciation/scorer.ts
 * (status: correct ≥ 85, close 60-84, wrong < 60).
 */
export function chipColorForScore(score: number | undefined): ChipColor {
  if (score === undefined || !Number.isFinite(score)) return "neutral";
  if (score >= 85) return "correct";
  if (score >= 60) return "close";
  return "practice";
}

const CHIP_COLOR_MAP: Record<ChipColor, { bg: string; fg: string; border: string }> = {
  // Tailwind emerald / amber / rose at fixed hex values so canvas does
  // not depend on CSS resolution.
  correct: { bg: "#D1FAE5", fg: "#065F46", border: "#34D399" },
  close: { bg: "#FEF3C7", fg: "#92400E", border: "#FBBF24" },
  practice: { bg: "#FFE4E6", fg: "#9F1239", border: "#FB7185" },
  neutral: { bg: "#F1F5F9", fg: "#334155", border: "#CBD5E1" },
};

// ── Headline interpolation (pure; tested) ────────────────────────────────

export type ShareHeadlineLang = "vi" | "en";

const HEADLINE_TEMPLATE: Record<ShareHeadlineLang, string> = {
  vi: "Tôi đạt {score}/100 trên MercyBlade!",
  en: "I scored {score}/100 on MercyBlade!",
};

const HEADLINE_TEMPLATE_RANKED: Record<ShareHeadlineLang, string> = {
  vi: "Tôi đang hạng #{rank} tuần này — đạt {score}/100!",
  en: "I'm #{rank} this week — scored {score}/100!",
};

export function formatShareHeadline(
  score: number,
  lang: ShareHeadlineLang,
  rank?: number | null,
): string {
  const safeScore = clampInt(score, 0, 100);
  if (typeof rank === "number" && Number.isFinite(rank) && rank > 0) {
    const safeRank = clampInt(rank, 1, 9999);
    return HEADLINE_TEMPLATE_RANKED[lang]
      .replace("{rank}", String(safeRank))
      .replace("{score}", String(safeScore));
  }
  return HEADLINE_TEMPLATE[lang].replace("{score}", String(safeScore));
}

function clampInt(n: number, lo: number, hi: number): number {
  if (!Number.isFinite(n)) return lo;
  const r = Math.round(n);
  if (r < lo) return lo;
  if (r > hi) return hi;
  return r;
}

// ── Canvas painter (browser-only; not run under jsdom in tests) ──────────

/**
 * Render the score card to a PNG Blob. Returns a 1200×630 PNG.
 *
 * Errors:
 *  - throws if `document` / canvas is unavailable
 *  - throws if `toBlob` returns null (rare; old Safari)
 */
export async function generateScoreCardBlob(input: ShareScoreInput): Promise<Blob> {
  if (typeof document === "undefined") {
    throw new Error("generateScoreCardBlob requires a browser document");
  }

  const canvas = document.createElement("canvas");
  canvas.width = CARD_WIDTH;
  canvas.height = CARD_HEIGHT;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Failed to acquire 2d canvas context");

  paintBackground(ctx);
  paintBrand(ctx);
  paintHeadlines(ctx, input.overallScore);
  paintScoreGauge(ctx, input.overallScore);
  paintSentence(ctx, input.sentence);
  paintChips(ctx, input);
  paintFooter(ctx);

  return await canvasToPngBlob(canvas);
}

function canvasToPngBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("canvas.toBlob returned null"));
          return;
        }
        resolve(blob);
      },
      "image/png",
    );
  });
}

// ── Painters ──────────────────────────────────────────────────────────────

function paintBackground(ctx: CanvasRenderingContext2D): void {
  // Soft brand gradient — rose-to-cream, aligned with the Teacher Mercy
  // hero card on Home (linear-gradient 150deg, rgba(250,232,255,...)).
  const grad = ctx.createLinearGradient(0, 0, CARD_WIDTH, CARD_HEIGHT);
  grad.addColorStop(0, "#FAE8FF");
  grad.addColorStop(0.45, "#FFF0F8");
  grad.addColorStop(1, "#FDF0E6");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT);

  // Subtle inset border.
  ctx.strokeStyle = "rgba(190,100,140,0.18)";
  ctx.lineWidth = 4;
  ctx.strokeRect(2, 2, CARD_WIDTH - 4, CARD_HEIGHT - 4);
}

function paintBrand(ctx: CanvasRenderingContext2D): void {
  // Wordmark only (no logo image — keeps the generator offline-safe per
  // the brief). Uses the system bold sans-serif stack so we don't have
  // to bundle a font file or wait for a webfont load.
  ctx.fillStyle = "rgba(120,30,60,0.92)";
  ctx.font = "900 36px -apple-system, system-ui, 'Segoe UI', Roboto, sans-serif";
  ctx.textBaseline = "top";
  ctx.textAlign = "left";
  ctx.fillText(PRODUCT_CONFIG.name, 56, 44);

  ctx.fillStyle = "rgba(140,60,90,0.62)";
  ctx.font = "700 18px -apple-system, system-ui, 'Segoe UI', Roboto, sans-serif";
  ctx.fillText(PRODUCT_CONFIG.tagline, 56, 92);
}

function paintHeadlines(ctx: CanvasRenderingContext2D, score: number): void {
  const x = 56;
  const yVi = 168;
  const yEn = 230;

  // VI primary
  ctx.fillStyle = "rgba(60,15,30,0.94)";
  ctx.font = "900 48px -apple-system, system-ui, 'Segoe UI', Roboto, sans-serif";
  ctx.textBaseline = "top";
  ctx.textAlign = "left";
  ctx.fillText(formatShareHeadline(score, "vi"), x, yVi);

  // EN secondary
  ctx.fillStyle = "rgba(80,30,50,0.66)";
  ctx.font = "700 30px -apple-system, system-ui, 'Segoe UI', Roboto, sans-serif";
  ctx.fillText(formatShareHeadline(score, "en"), x, yEn);
}

function paintScoreGauge(ctx: CanvasRenderingContext2D, rawScore: number): void {
  const score = clampInt(rawScore, 0, 100);
  // Right-side circular gauge.
  const cx = CARD_WIDTH - 170;
  const cy = 200;
  const radius = 110;

  // Bucket → ring color
  const bucket = chipColorForScore(score);
  const ringColor =
    bucket === "correct" ? "#10B981" :
    bucket === "close"   ? "#F59E0B" :
                           "#F43F5E";

  // Backdrop ring
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.fillStyle = "white";
  ctx.fill();
  ctx.lineWidth = 14;
  ctx.strokeStyle = "rgba(0,0,0,0.06)";
  ctx.stroke();

  // Score arc (clockwise from top)
  const startAngle = -Math.PI / 2;
  const endAngle = startAngle + (score / 100) * Math.PI * 2;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, startAngle, endAngle);
  ctx.lineWidth = 14;
  ctx.strokeStyle = ringColor;
  ctx.lineCap = "round";
  ctx.stroke();

  // Score number
  ctx.fillStyle = "rgba(15,23,42,0.92)";
  ctx.font = "950 78px -apple-system, system-ui, 'Segoe UI', Roboto, sans-serif";
  ctx.textBaseline = "middle";
  ctx.textAlign = "center";
  ctx.fillText(String(score), cx, cy - 8);

  ctx.fillStyle = "rgba(0,0,0,0.45)";
  ctx.font = "700 22px -apple-system, system-ui, 'Segoe UI', Roboto, sans-serif";
  ctx.fillText("/ 100", cx, cy + 48);
}

function paintSentence(ctx: CanvasRenderingContext2D, sentence: string): void {
  const trimmed = sentence.trim();
  if (!trimmed) return;
  const x = 56;
  const y = 308;
  const maxWidth = CARD_WIDTH - 360; // leaves room for the score gauge
  ctx.fillStyle = "rgba(15,23,42,0.85)";
  ctx.font = "700 italic 30px -apple-system, system-ui, 'Segoe UI', Roboto, sans-serif";
  ctx.textBaseline = "top";
  ctx.textAlign = "left";
  const display = `“${truncateToFit(ctx, trimmed, maxWidth)}”`;
  ctx.fillText(display, x, y);
}

/**
 * If the text fits, return as-is. Otherwise, truncate and append an
 * ellipsis so the caller never overflows the band.
 */
export function truncateToFit(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
): string {
  if (ctx.measureText(text).width <= maxWidth) return text;
  // Binary-search to longest fitting prefix + ellipsis.
  let lo = 0;
  let hi = text.length;
  while (lo + 1 < hi) {
    const mid = (lo + hi) >> 1;
    const candidate = text.slice(0, mid).trimEnd() + "…";
    if (ctx.measureText(candidate).width <= maxWidth) lo = mid;
    else hi = mid;
  }
  return text.slice(0, lo).trimEnd() + "…";
}

function paintChips(ctx: CanvasRenderingContext2D, input: ShareScoreInput): void {
  const x0 = 56;
  let y = 388;
  const chipHeight = 56;
  const gap = 12;
  const padX = 22;

  // Legend
  ctx.fillStyle = "rgba(0,0,0,0.55)";
  ctx.font = "700 18px -apple-system, system-ui, 'Segoe UI', Roboto, sans-serif";
  ctx.textBaseline = "top";
  ctx.textAlign = "left";
  ctx.fillText("Đúng · Correct   ·   Gần · Close   ·   Luyện · Practice", x0, y);
  y += 32;

  // Build chip list. Prefer wordScores when present; otherwise fall
  // back to splitting the sentence into bare words with neutral color.
  const chips: ShareWordScore[] =
    input.wordScores && input.wordScores.length > 0
      ? input.wordScores
      : input.sentence
          .split(/\s+/)
          .filter(Boolean)
          .map((word) => ({ word }));

  ctx.font = "800 22px -apple-system, system-ui, 'Segoe UI', Roboto, sans-serif";
  ctx.textBaseline = "middle";

  let cursorX = x0;
  const maxRight = CARD_WIDTH - 56;
  const maxRows = 2;
  let row = 0;

  for (const chip of chips) {
    const text = chip.word;
    const textWidth = ctx.measureText(text).width;
    const chipWidth = Math.ceil(textWidth + padX * 2);
    if (cursorX + chipWidth > maxRight) {
      row++;
      if (row >= maxRows) break;
      cursorX = x0;
      y += chipHeight + gap;
    }
    paintChip(ctx, cursorX, y, chipWidth, chipHeight, text, chipColorForScore(chip.score));
    cursorX += chipWidth + gap;
  }
}

function paintChip(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  text: string,
  kind: ChipColor,
): void {
  const palette = CHIP_COLOR_MAP[kind];
  // Rounded rect body
  const r = h / 2;
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
  ctx.fillStyle = palette.bg;
  ctx.fill();
  ctx.strokeStyle = palette.border;
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = palette.fg;
  ctx.textAlign = "center";
  ctx.fillText(text, x + w / 2, y + h / 2 + 1);
}

function paintFooter(ctx: CanvasRenderingContext2D): void {
  // Domain bottom-left
  ctx.fillStyle = "rgba(120,30,60,0.78)";
  ctx.font = "800 24px -apple-system, system-ui, 'Segoe UI', Roboto, sans-serif";
  ctx.textBaseline = "alphabetic";
  ctx.textAlign = "left";
  ctx.fillText(PRODUCT_CONFIG.domain, 56, CARD_HEIGHT - 40);

  // Mercy avatar bottom-right (text fallback — the brief disallows API
  // calls during render, so we don't try to load /teacher-mercy.webp).
  ctx.fillStyle = "rgba(120,30,60,0.55)";
  ctx.font = "700 italic 20px -apple-system, system-ui, 'Segoe UI', Roboto, sans-serif";
  ctx.textAlign = "right";
  ctx.fillText(`— ${PRODUCT_CONFIG.teacher.name}`, CARD_WIDTH - 56, CARD_HEIGHT - 40);
}
