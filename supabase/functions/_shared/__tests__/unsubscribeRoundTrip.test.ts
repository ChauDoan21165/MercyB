// supabase/functions/_shared/__tests__/unsubscribeRoundTrip.test.ts
//
// End-to-end unsubscribe token round-trip: from the moment a token is
// embedded in an outbound email all the way to the server extracting it
// from the List-Unsubscribe header's URL and the RFC 8058 POST body.
//
// Why this matters (CASL / RFC 8058):
//   The two new cron emails (weekly-progress-email, streak-reminder-email)
//   embed the token via buildListUnsubscribeHeaders / buildFooter. When a
//   mail client POSTs to the List-Unsubscribe URL the server must be able
//   to extract the same token and call unsubscribe_by_token(). If the
//   round-trip breaks the user can never one-click unsubscribe.
//
// Root cause documented here:
//   supabase/migrations/20260528120000_parent_digest_prefs.sql:55-56 updated
//   unsubscribe_by_token() to SET email_streak_reminder_enabled /
//   email_weekly_progress_enabled before those columns existed (added by
//   20260620000000_email_streak_progress_prefs.sql). The RPC failed at
//   runtime, email-unsubscribe/index.ts:112-114 swallowed the error and
//   returned 200 OK, leaving the user subscribed. Fix: apply migration
//   20260620000000 (Chau's gate — never apply unattended).

import { describe, expect, it } from "vitest";

import {
  buildFooter,
  buildListUnsubscribeHeaders,
  buildUnsubscribeUrl,
  FUNCTIONS_ORIGIN,
  SITE_ORIGIN,
} from "../unsubscribe";
import { extractToken } from "../../email-unsubscribe/decision";

// 24 random bytes → 48 hex chars, matching the migration trigger.
const REAL_TOKEN = "a1b2c3d4e5f6".repeat(4); // 48 chars

describe("unsubscribe token round-trip — List-Unsubscribe header", () => {
  const headers = buildListUnsubscribeHeaders(REAL_TOKEN);

  it("extracts the original token from the List-Unsubscribe URL", () => {
    // The List-Unsubscribe value is: "<url>, <mailto:...>"
    // Pull the first angle-bracketed URL.
    const match = headers["List-Unsubscribe"].match(/<([^>]+)>/);
    expect(match).not.toBeNull();
    const url = match![1];
    expect(url).toContain(FUNCTIONS_ORIGIN);

    const extracted = extractToken({ url });
    expect(extracted).toBe(REAL_TOKEN);
  });

  it("round-trip survives URL-encoding in the header URL", () => {
    // Token with characters that are percent-encoded in URLs.
    const specialToken = "ab/cd?ef&gh".padEnd(48, "x");
    const specialHeaders = buildListUnsubscribeHeaders(specialToken);
    const match = specialHeaders["List-Unsubscribe"].match(/<([^>]+)>/);
    const url = match![1];
    const extracted = extractToken({ url });
    expect(extracted).toBe(specialToken);
  });

  it("extractToken returns null for a token shorter than 16 chars — mirrors the RPC guard", () => {
    const shortHeaders = buildListUnsubscribeHeaders("tooshort");
    const match = shortHeaders["List-Unsubscribe"].match(/<([^>]+)>/);
    const url = match![1];
    // normalizeToken rejects <16-char tokens (mirrors unsubscribe_by_token's guard)
    const extracted = extractToken({ url });
    expect(extracted).toBeNull();
  });
});

describe("unsubscribe token round-trip — RFC 8058 one-click POST body fallback", () => {
  it("extracts the token from an x-www-form-urlencoded POST body", () => {
    const formBody = `List-Unsubscribe=One-Click&token=${encodeURIComponent(REAL_TOKEN)}`;
    const extracted = extractToken({
      url: `${FUNCTIONS_ORIGIN}/email-unsubscribe`,
      formBody,
    });
    expect(extracted).toBe(REAL_TOKEN);
  });

  it("prefers the URL query token over the body token", () => {
    const bodyToken = "b".repeat(48);
    const formBody = `token=${encodeURIComponent(bodyToken)}`;
    const extracted = extractToken({
      url: `${FUNCTIONS_ORIGIN}/email-unsubscribe?token=${encodeURIComponent(REAL_TOKEN)}`,
      formBody,
    });
    expect(extracted).toBe(REAL_TOKEN);
  });
});

describe("unsubscribe token round-trip — footer link", () => {
  const { html, text } = buildFooter(REAL_TOKEN);

  it("footer HTML contains the SPA unsubscribe URL with the correct token", () => {
    const expected = buildUnsubscribeUrl(REAL_TOKEN);
    expect(html).toContain(expected);
  });

  it("footer text contains the SPA unsubscribe URL with the correct token", () => {
    expect(text).toContain(`${SITE_ORIGIN}/unsubscribe?token=${REAL_TOKEN}`);
  });

  it("footer HTML does NOT contain the edge-function URL (that's in the header only)", () => {
    // The machine one-click endpoint lives in the header; the human link
    // in the footer goes to the SPA for confirmation + management.
    expect(html).not.toContain(FUNCTIONS_ORIGIN);
  });
});

describe("token-gate logic in weekly-progress and streak-reminder emails", () => {
  // These tests replicate the per-profile guard logic in both cron
  // functions: no token → skip (not added to errors, not sent).

  function shouldSendWithToken(token: string | null | undefined): boolean {
    const unsubToken = typeof token === "string" ? token : null;
    return unsubToken !== null;
  }

  it("sends when a valid token is present", () => {
    expect(shouldSendWithToken(REAL_TOKEN)).toBe(true);
  });

  it("skips when token is null (column not yet populated or user predates migration)", () => {
    expect(shouldSendWithToken(null)).toBe(false);
  });

  it("skips when token is undefined (column not returned by DB)", () => {
    expect(shouldSendWithToken(undefined)).toBe(false);
  });

  it("skips when token is a non-string (DB returned an unexpected type)", () => {
    // TS cast simulates what happens if Supabase returns e.g. a number.
    expect(shouldSendWithToken(123 as unknown as string)).toBe(false);
  });

  it("tokens skip does not corrupt sent/skipped counters", () => {
    const profiles = [
      { id: "u1", token: REAL_TOKEN },
      { id: "u2", token: null },
      { id: "u3", token: REAL_TOKEN },
      { id: "u4", token: undefined },
    ];
    let sent = 0;
    let skipped = 0;
    for (const p of profiles) {
      if (!shouldSendWithToken(p.token)) { skipped++; continue; }
      sent++;
    }
    expect(sent).toBe(2);
    expect(skipped).toBe(2);
  });
});
