// Share orchestrator. Two paths, picked at runtime in this order:
//
//   1. Web Share API with files[] — works on iOS Safari, Chrome
//      Android, and most desktop Chromiums. The OS share sheet
//      handles the image directly; user picks Facebook (or any
//      other target). Single tap, no upload round-trip, no FB
//      scraper involved. Best UX when available.
//
//   2. Upload to Supabase Storage → open Facebook web sharer URL.
//      Falls back here when navigator.share is missing or
//      navigator.canShare({ files }) reports false (e.g. desktop
//      Firefox, older Safari). Facebook's sharer.php scrapes the
//      URL, sees the image, and embeds it as a photo.
//
// Tracking: a single "share_score_card_clicked" event fires before
// the share path is picked, with the score and provider. Path
// outcome (web-share / sharer-url / upload-failed) is logged via
// console.info so the next analytics PR can wire it.
//
// No @capacitor/share dependency — checked package.json (not
// installed). The Web Share API is available inside Capacitor's
// WKWebView / Chrome Custom Tabs and covers the mobile case.

import { generateScoreCardBlob, type ShareScoreInput } from "./scoreCard";
import { uploadShareCard } from "./uploadShareCard";
import { PRODUCT_CONFIG } from "@/config/product";

export type FacebookShareOutcome =
  | { ok: true; path: "web_share" | "sharer_url"; sharedUrl?: string }
  | { ok: false; reason: "blob_failed" | "upload_failed" | "share_cancelled" | "no_share_target"; error?: string };

export type ShareInvocationContext = {
  /**
   * Optional analytics callback. Caller can wire it to the existing
   * tracking system. This module has no opinion about which tracker
   * to use — it just calls back if provided.
   */
  onTrack?: (event: string, payload: Record<string, unknown>) => void;
  /**
   * A9 — optional referral code. When supplied:
   *   - Web Share API path: shared `url` becomes the referral landing
   *     URL (`?ref=CODE`) and the caption gains a Vietnamese invite line
   *     so friends know what they get for clicking.
   *   - Sharer-URL path: the referral landing URL is shared instead of
   *     the uploaded image URL. We accept the visual trade-off (the post
   *     uses the home page's og:image rather than the live score card)
   *     because a dead `?ref=` is worth more than a tagged image URL —
   *     Facebook does not parse query strings on raw image links.
   */
  referralCode?: string | null;
};

const EVENT_NAME = "share_score_card_clicked";

/**
 * Generate the card and share it via the best available path. Caller
 * must invoke this from a user-gesture handler (Web Share API requires
 * one).
 */
export async function shareScoreToFacebook(
  input: ShareScoreInput,
  ctx: ShareInvocationContext = {},
): Promise<FacebookShareOutcome> {
  ctx.onTrack?.(EVENT_NAME, {
    score: Math.round(input.overallScore),
    provider: input.provider ?? "local",
    sentence_length: input.sentence.trim().length,
  });

  // Generate the PNG. If this fails the whole share is dead — there's
  // no useful fallback that doesn't shrink the value of the feature.
  let blob: Blob;
  try {
    blob = await generateScoreCardBlob(input);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "unknown";
    return { ok: false, reason: "blob_failed", error: msg };
  }

  const referralCode = sanitizeReferralCode(ctx.referralCode);
  const landingUrl = buildLandingUrl(referralCode);

  // ── Path 1: Web Share API with files ─────────────────────────────────
  if (canWebShareWithFiles(blob)) {
    try {
      const file = new File([blob], "mercyblade-score.png", {
        type: "image/png",
      });
      await navigator.share({
        title: `MercyBlade · ${Math.round(input.overallScore)}/100`,
        text: shareCaption(input.overallScore, referralCode, landingUrl),
        files: [file],
        url: landingUrl,
      });
      return { ok: true, path: "web_share" };
    } catch (err) {
      // User-cancel is a NotAllowedError / AbortError on most browsers —
      // surface as a non-error outcome so callers don't toast.
      if (isShareCancelledError(err)) {
        return { ok: false, reason: "share_cancelled" };
      }
      // Any other failure → fall through to the upload + sharer URL path.
      console.warn("[facebookShare] web-share failed, falling back:", err);
    }
  }

  // ── Path 2: Upload to Supabase Storage → Facebook sharer URL ────────
  // When a referral code is supplied, prefer sharing the referral
  // landing URL (so the click drops the friend on `?ref=CODE`). The
  // home page's og:image acts as the preview. When no code is supplied
  // we keep the original uploaded-image flow.
  if (referralCode) {
    const sharerUrl = buildFacebookSharerUrl(landingUrl);
    if (typeof window !== "undefined") {
      window.open(sharerUrl, "_blank", "noopener,noreferrer");
    }
    return { ok: true, path: "sharer_url", sharedUrl: landingUrl };
  }

  const upload = await uploadShareCard(blob);
  if (!upload.ok) {
    // Even the URL fallback can't proceed without an image to scrape.
    // Give the caller a clear reason so they can show a "try again" UI.
    return {
      ok: false,
      reason: upload.reason === "anon" ? "no_share_target" : "upload_failed",
      error: upload.reason,
    };
  }

  const sharerUrl = buildFacebookSharerUrl(upload.publicUrl);
  // Open in a new tab. window.open requires a user gesture; we're
  // already inside the user's click handler so this is allowed.
  if (typeof window !== "undefined") {
    window.open(sharerUrl, "_blank", "noopener,noreferrer");
  }
  return { ok: true, path: "sharer_url", sharedUrl: upload.publicUrl };
}

// ── Referral helpers (exported for tests) ────────────────────────────────

const REFERRAL_CODE_REGEX = /^[2-9A-HJ-NP-Z]{6}$/;

function sanitizeReferralCode(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const norm = raw.trim().toUpperCase();
  return REFERRAL_CODE_REGEX.test(norm) ? norm : null;
}

/**
 * Build the landing URL friends click. With a code: appends `?ref=CODE`
 * so the auto-apply hook in AuthProvider redeems it on signup. Without:
 * just the home page.
 */
export function buildLandingUrl(code: string | null): string {
  const base = `https://${PRODUCT_CONFIG.domain}`;
  if (!code) return base;
  const url = new URL(base);
  url.searchParams.set("ref", code);
  return url.toString();
}

// ── Helpers (exported for tests) ─────────────────────────────────────────

/** Build the canonical Facebook sharer URL for an image / page URL. */
export function buildFacebookSharerUrl(url: string): string {
  return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
}

/**
 * Caption shown in the OS share sheet alongside the image. When a
 * referral code is provided the caption gains a Vietnamese invite line
 * so friends understand why they should click — Facebook Vietnamese
 * users respond better to "you also get something" than to a bare score.
 */
export function shareCaption(
  score: number,
  referralCode?: string | null,
  landingUrl?: string,
): string {
  const safeScore = Math.max(0, Math.min(100, Math.round(score)));
  const lines = [
    `Tôi đạt ${safeScore}/100 trên MercyBlade!`,
    `I scored ${safeScore}/100 on MercyBlade!`,
  ];
  if (referralCode && landingUrl) {
    lines.push(
      `Đăng ký bằng link này để được thêm 7 ngày miễn phí: ${landingUrl}`,
    );
  } else {
    lines.push(`${PRODUCT_CONFIG.domain}`);
  }
  return lines.join("\n");
}

/**
 * Check whether navigator.share supports files. Three things have to
 * be true: navigator.share exists, navigator.canShare exists (older
 * implementations had .share without .canShare), and canShare reports
 * the file is shareable.
 */
export function canWebShareWithFiles(blob: Blob): boolean {
  if (typeof navigator === "undefined") return false;
  if (typeof navigator.share !== "function") return false;
  // canShare is required to introspect file support; without it we
  // can't tell if the platform allows files (e.g. Safari pre-15).
  const navAny = navigator as Navigator & {
    canShare?: (data: ShareData) => boolean;
  };
  if (typeof navAny.canShare !== "function") return false;
  try {
    const file = new File([blob], "probe.png", { type: "image/png" });
    return navAny.canShare({ files: [file] });
  } catch {
    return false;
  }
}

function isShareCancelledError(err: unknown): boolean {
  if (!err) return false;
  const e = err as { name?: string; message?: string };
  return e.name === "AbortError" || /cancel/i.test(e.message ?? "");
}
