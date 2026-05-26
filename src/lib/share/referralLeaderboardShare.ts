// src/lib/share/referralLeaderboardShare.ts
//
// 1200×630 PNG share card for "I'm rank #X this month" referral brag.
// Vietnamese-primary caption with the rank + total count.
//
// Pure helpers (caption interpolation, sanitiser, layout consts) are
// exported so vitest can cover them without booting a real canvas.

import { PRODUCT_CONFIG } from "@/config/product";

export const CARD_WIDTH = 1200;
export const CARD_HEIGHT = 630;

const ALLOWED_EMOJI_REGEX = /[\u{2728}\u{1F48E}\u{1F3C6}]/u;
const DISALLOWED_EMOJI_RANGE =
  /[\u{1F300}-\u{1F9FF}\u{2600}-\u{27BF}\u{1FA00}-\u{1FAFF}]/u;

/**
 * Strip any character that the leaderboard validator wouldn't accept,
 * so a stale display_name never paints on the canvas. Mirrors
 * validateDisplayName but operates char-by-char (best-effort fallback).
 */
export function sanitizeDisplayNameForCard(input: string): string {
  let out = "";
  for (const ch of input ?? "") {
    if (DISALLOWED_EMOJI_RANGE.test(ch) && !ALLOWED_EMOJI_REGEX.test(ch)) {
      continue;
    }
    out += ch;
  }
  out = out.trim();
  // Keep within 30 codepoints — the canvas font would render up to ~24
  // anyway before truncating at the band edge.
  const codepoints = Array.from(out).slice(0, 30);
  return codepoints.join("");
}

/**
 * Build the bilingual caption shown beneath the share card. Vietnamese
 * primary; English secondary line is appended.
 *
 * Format: "Tôi đang hạng #X người mời tháng này — đã mời Y người dùng MercyBlade"
 */
export function formatReferralCaption(rank: number, count: number): string {
  const safeRank = clampInt(rank, 1, 9999);
  const safeCount = clampInt(count, 0, 99999);
  return `Tôi đang hạng #${safeRank} người mời tháng này — đã mời ${safeCount} người dùng MercyBlade`;
}

export function formatReferralCaptionEn(rank: number, count: number): string {
  const safeRank = clampInt(rank, 1, 9999);
  const safeCount = clampInt(count, 0, 99999);
  return `I'm referrer #${safeRank} on MercyBlade this month — invited ${safeCount} learners`;
}

function clampInt(n: number, lo: number, hi: number): number {
  if (!Number.isFinite(n)) return lo;
  const r = Math.round(n);
  if (r < lo) return lo;
  if (r > hi) return hi;
  return r;
}

// ── Canvas painter (browser-only) ────────────────────────────────────────

/**
 * Render the referrer card to a 1200×630 PNG Blob.
 *
 * @throws if document/canvas is unavailable.
 * @throws if toBlob returns null (rare; old Safari).
 */
export async function generateReferrerCardImage(
  rank: number,
  displayName: string,
  referralCount: number,
): Promise<Blob> {
  if (typeof document === "undefined") {
    throw new Error("generateReferrerCardImage requires a browser document");
  }

  const canvas = document.createElement("canvas");
  canvas.width = CARD_WIDTH;
  canvas.height = CARD_HEIGHT;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Failed to acquire 2d canvas context");

  const safeName = sanitizeDisplayNameForCard(displayName) || "MercyBlade";
  const safeRank = clampInt(rank, 1, 9999);
  const safeCount = clampInt(referralCount, 0, 99999);

  paintBackground(ctx);
  paintBrand(ctx);
  paintRankBadge(ctx, safeRank);
  paintHeadlines(ctx, safeName, safeRank, safeCount);
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

function paintBackground(ctx: CanvasRenderingContext2D): void {
  const grad = ctx.createLinearGradient(0, 0, CARD_WIDTH, CARD_HEIGHT);
  grad.addColorStop(0, "#EEF2FF");
  grad.addColorStop(0.45, "#F5F3FF");
  grad.addColorStop(1, "#FDF2F8");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT);

  ctx.strokeStyle = "rgba(99,102,241,0.18)";
  ctx.lineWidth = 4;
  ctx.strokeRect(2, 2, CARD_WIDTH - 4, CARD_HEIGHT - 4);
}

function paintBrand(ctx: CanvasRenderingContext2D): void {
  ctx.fillStyle = "rgba(67,56,202,0.92)";
  ctx.font = "900 36px -apple-system, system-ui, 'Segoe UI', Roboto, sans-serif";
  ctx.textBaseline = "top";
  ctx.textAlign = "left";
  ctx.fillText(PRODUCT_CONFIG.name, 56, 44);

  ctx.fillStyle = "rgba(67,56,202,0.62)";
  ctx.font = "700 18px -apple-system, system-ui, 'Segoe UI', Roboto, sans-serif";
  ctx.fillText(PRODUCT_CONFIG.tagline, 56, 92);
}

function paintRankBadge(ctx: CanvasRenderingContext2D, rank: number): void {
  const cx = CARD_WIDTH - 200;
  const cy = 220;
  const radius = 130;

  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.fillStyle = "white";
  ctx.fill();
  ctx.lineWidth = 14;
  ctx.strokeStyle = rank <= 3 ? "#F59E0B" : "#6366F1";
  ctx.stroke();

  ctx.fillStyle = "rgba(15,23,42,0.92)";
  ctx.font = "950 92px -apple-system, system-ui, 'Segoe UI', Roboto, sans-serif";
  ctx.textBaseline = "middle";
  ctx.textAlign = "center";
  ctx.fillText(`#${rank}`, cx, cy - 6);

  ctx.fillStyle = "rgba(67,56,202,0.65)";
  ctx.font = "800 22px -apple-system, system-ui, 'Segoe UI', Roboto, sans-serif";
  ctx.fillText("tháng này", cx, cy + 56);
}

function paintHeadlines(
  ctx: CanvasRenderingContext2D,
  displayName: string,
  rank: number,
  count: number,
): void {
  const x = 56;

  // Display name (chip)
  ctx.fillStyle = "rgba(67,56,202,0.94)";
  ctx.font = "900 30px -apple-system, system-ui, 'Segoe UI', Roboto, sans-serif";
  ctx.textBaseline = "top";
  ctx.textAlign = "left";
  ctx.fillText(displayName, x, 168);

  // VI primary caption
  ctx.fillStyle = "rgba(15,23,42,0.94)";
  ctx.font = "900 42px -apple-system, system-ui, 'Segoe UI', Roboto, sans-serif";
  ctx.fillText(formatReferralCaption(rank, count), x, 230);

  // EN secondary
  ctx.fillStyle = "rgba(60,30,90,0.66)";
  ctx.font = "700 24px -apple-system, system-ui, 'Segoe UI', Roboto, sans-serif";
  ctx.fillText(formatReferralCaptionEn(rank, count), x, 320);

  // Sub-CTA
  ctx.fillStyle = "rgba(15,23,42,0.55)";
  ctx.font = "700 20px -apple-system, system-ui, 'Segoe UI', Roboto, sans-serif";
  ctx.fillText("Mời bạn bè · earn 7 free days", x, 398);
}

function paintFooter(ctx: CanvasRenderingContext2D): void {
  ctx.fillStyle = "rgba(67,56,202,0.78)";
  ctx.font = "800 24px -apple-system, system-ui, 'Segoe UI', Roboto, sans-serif";
  ctx.textBaseline = "alphabetic";
  ctx.textAlign = "left";
  ctx.fillText(`${PRODUCT_CONFIG.domain}/leaderboard/referral`, 56, CARD_HEIGHT - 40);

  ctx.fillStyle = "rgba(67,56,202,0.55)";
  ctx.font = "700 italic 20px -apple-system, system-ui, 'Segoe UI', Roboto, sans-serif";
  ctx.textAlign = "right";
  ctx.fillText(`— ${PRODUCT_CONFIG.teacher.name}`, CARD_WIDTH - 56, CARD_HEIGHT - 40);
}

// ── Web Share API + file fallback ────────────────────────────────────────

/**
 * Try Web Share API with the file; if files aren't supported, fall
 * back to a download. Returns a tag indicating which path was taken
 * (handy for analytics).
 */
export async function shareReferrerCard(
  blob: Blob,
  rank: number,
  count: number,
): Promise<"shared" | "downloaded" | "cancelled" | "unsupported"> {
  const filename = `mercyblade-referral-rank-${rank}.png`;
  const text = formatReferralCaption(rank, count);

  if (typeof navigator !== "undefined" && navigator.share) {
    try {
      const file = new File([blob], filename, { type: "image/png" });
      // Some browsers don't support files; check canShare first.
      const canShareFiles =
        // navigator.canShare may be undefined
        typeof (navigator as unknown as { canShare?: (data: { files?: File[] }) => boolean })
          .canShare === "function"
          ? (
              navigator as unknown as { canShare: (data: { files?: File[] }) => boolean }
            ).canShare({ files: [file] })
          : false;

      if (canShareFiles) {
        await navigator.share({ files: [file], text });
        return "shared";
      }
      // Files not supported → at least share the text + URL.
      await navigator.share({ text, url: `${window.location.origin}/leaderboard/referral` });
      return "shared";
    } catch (e) {
      // AbortError → user dismissed
      const err = e as { name?: string };
      if (err?.name === "AbortError") return "cancelled";
      // Other errors fall through to download.
    }
  }

  // Fallback: trigger a download so the user can post it manually.
  if (typeof document === "undefined") return "unsupported";
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  return "downloaded";
}
