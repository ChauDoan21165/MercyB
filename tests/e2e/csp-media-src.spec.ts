/**
 * CSP media-src regression guard.
 *
 * mercyblade.com's Content-Security-Policy is injected by the Cloudflare edge
 * (Netlify origin serves none). A restrictive `media-src 'self' https:` directive
 * blocks blob: (MediaRecorder playback) and data: (browser TTS) audio — confirmed
 * as the real playback regression by console capture on 2026-06-11.
 *
 * This test asserts the live CSP header contains the required media-src tokens so
 * any future Cloudflare config change that re-introduces the regression fails CI
 * immediately with the actual directive in the error message.
 *
 * Scope: media-src ONLY. Do not add assertions for other directives here.
 *
 * Foundation-debt note: src/middleware/cspHeaders.ts is unconsumed dead config
 * (media-src 'self' https://*.supabase.co) that diverges from the live Cloudflare
 * directive (media-src 'self' https:). It is flagged for the foundation-debt ledger
 * and must NOT be deleted in this MR.
 */
import { expect, test } from "@playwright/test";

const BASE_URL = process.env.TEST_BASE_URL ?? "https://mercyblade.com";

function extractMediaSrc(csp: string): string | null {
  const match = csp.match(/(?:^|;)\s*media-src\s+([^;]+)/i);
  return match ? match[1].trim() : null;
}

test("CSP: media-src allows blob: and data: for audio playback", async ({ request }) => {
  const response = await request.get(BASE_URL, { maxRedirects: 5 });
  expect(response.status(), "homepage must be reachable").toBeLessThan(400);

  const csp = response.headers()["content-security-policy"] ?? "";
  expect(
    csp,
    "Content-Security-Policy header must be present (injected by Cloudflare edge)",
  ).not.toBe("");

  const mediaSrc = extractMediaSrc(csp);
  expect(
    mediaSrc,
    `media-src directive missing from CSP.\nFull CSP: ${csp}`,
  ).not.toBeNull();

  const tokens = (mediaSrc ?? "").split(/\s+/);

  expect(
    tokens,
    `media-src must include 'self'.\nActual media-src: ${mediaSrc}\nFull CSP: ${csp}`,
  ).toContain("'self'");

  expect(
    tokens,
    `media-src must include blob: (required for MediaRecorder/recorder playback).\nActual media-src: ${mediaSrc}\nFull CSP: ${csp}`,
  ).toContain("blob:");

  expect(
    tokens,
    `media-src must include data: (required for browser TTS audio).\nActual media-src: ${mediaSrc}\nFull CSP: ${csp}`,
  ).toContain("data:");

  const hasHttpsOrSupabase =
    tokens.includes("https:") ||
    tokens.some((t) => t.includes("supabase.co"));

  expect(
    hasHttpsOrSupabase,
    `media-src must include https: or a *.supabase.co host (for Supabase-served audio).\nActual media-src: ${mediaSrc}\nFull CSP: ${csp}`,
  ).toBe(true);
});
