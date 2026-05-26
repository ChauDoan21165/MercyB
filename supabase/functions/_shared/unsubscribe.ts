// supabase/functions/_shared/unsubscribe.ts
//
// Shared helpers for the email-unsubscribe surface. Used by every
// outbound campaign function (email-reengagement, trial-expiry-emails,
// weekly-digest-email).
//
// Two pieces:
//   1. buildFooter(token) — bilingual VI-primary plain-text + HTML
//      footer with a one-click unsubscribe link and a per-category link.
//   2. buildListUnsubscribeHeaders(token) — the Resend headers that turn
//      Gmail / Apple Mail's native "Unsubscribe" button on. Without
//      these the deliverability score drops noticeably for marketing
//      mail at scale.
//
// Both helpers are stateless / pure — they take a token and return
// strings. Token generation lives in the migration (gen_random_bytes
// trigger).

export const SITE_ORIGIN = "https://mercyblade.com";
export const UNSUBSCRIBE_MAILTO_DOMAIN = "mercyblade.com";

// The email-unsubscribe Edge Function. The List-Unsubscribe header must
// point at a server endpoint that processes an unauthenticated POST
// WITHOUT running JS — Gmail / Apple Mail send the one-click POST
// directly and never execute the SPA. mercyblade.com/unsubscribe is a
// client-rendered React route (vercel.json rewrites everything to
// index.html), so it returns 200 but never redeems the token for the
// bot. Pointing the machine header at this function is what actually
// makes RFC 8058 one-click work.
export const FUNCTIONS_ORIGIN =
  "https://buemdfxyhxunzpgdoqin.supabase.co/functions/v1";

/**
 * Human-facing landing page for one-click full opt-out. Used in the
 * visible email footer link — a person clicks it, the SPA runs and
 * confirms + offers per-category management.
 */
export function buildUnsubscribeUrl(token: string): string {
  return `${SITE_ORIGIN}/unsubscribe?token=${encodeURIComponent(token)}`;
}

/**
 * Machine endpoint for the List-Unsubscribe header. Same token, but a
 * real server route (Edge Function) that redeems on POST without JS.
 */
export function buildUnsubscribeEndpoint(token: string): string {
  return `${FUNCTIONS_ORIGIN}/email-unsubscribe?token=${encodeURIComponent(token)}`;
}

/** URL to manage preferences per category (auth-required). */
export function buildPreferencesUrl(): string {
  return `${SITE_ORIGIN}/account/notifications`;
}

/** mailto link used by the List-Unsubscribe RFC 8058 / RFC 2369 header. */
export function buildUnsubscribeMailto(token: string): string {
  // unsubscribe+<token>@mercyblade.com is harvested by Resend's inbound
  // catch-all. The token in the local part lets us identify the user
  // without extra DB lookups.
  return `mailto:unsubscribe+${encodeURIComponent(token)}@${UNSUBSCRIBE_MAILTO_DOMAIN}`;
}

/**
 * Plain-text + HTML footer fragments. Callers concatenate these onto
 * the existing template text/html so the unsubscribe link appears at
 * the bottom of every marketing email.
 *
 * Bilingual VI primary throughout per CLAUDE.md.
 */
export function buildFooter(token: string): { text: string; html: string } {
  const fullUrl = buildUnsubscribeUrl(token);
  const prefsUrl = buildPreferencesUrl();

  const text =
    `\n\n— — —\n\n` +
    `Bạn nhận email này vì đã đăng ký MercyBlade.\n` +
    `Tắt loại email này: ${prefsUrl}\n` +
    `Tắt tất cả email từ MercyBlade: ${fullUrl}\n\n` +
    `You're receiving this because you signed up for MercyBlade.\n` +
    `Manage preferences: ${prefsUrl}\n` +
    `Unsubscribe from all email: ${fullUrl}`;

  const escape = (s: string) =>
    s
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;");

  const html =
    `<hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;">` +
    `<p style="margin:0 0 8px;font-size:11px;line-height:1.5;color:#94a3b8;">` +
    `Bạn nhận email này vì đã đăng ký MercyBlade. ` +
    `<a href="${escape(prefsUrl)}" style="color:#1e3a8a;">Tắt loại email này</a> ` +
    `hoặc <a href="${escape(fullUrl)}" style="color:#1e3a8a;">tắt tất cả email</a>.` +
    `</p>` +
    `<p style="margin:0;font-size:11px;line-height:1.5;color:#cbd5e1;">` +
    `You're receiving this because you signed up for MercyBlade. ` +
    `<a href="${escape(prefsUrl)}" style="color:#1e3a8a;">Manage preferences</a> ` +
    `or <a href="${escape(fullUrl)}" style="color:#1e3a8a;">unsubscribe from all</a>.` +
    `</p>`;

  return { text, html };
}

/**
 * RFC-compliant headers for one-click unsubscribe (Gmail / Apple Mail).
 *
 * `List-Unsubscribe` carries both URL and mailto so client-side
 * heuristics that accept either form can find a target.
 *
 * `List-Unsubscribe-Post: List-Unsubscribe=One-Click` opts into RFC 8058
 * — the modern Gmail-supported variant where clicking the native
 * Unsubscribe button POSTs to the URL instead of just rendering it.
 */
export function buildListUnsubscribeHeaders(
  token: string,
): Record<string, string> {
  return {
    // URL form points at the Edge Function (processes the POST without
    // JS); mailto is the RFC 2369 fallback for clients that prefer it.
    "List-Unsubscribe": `<${buildUnsubscribeEndpoint(token)}>, <${buildUnsubscribeMailto(token)}>`,
    "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
  };
}

/**
 * Append the bilingual unsubscribe footer to an existing template's
 * text + html bodies. Convenience helper so call sites don't have to
 * remember to concatenate both halves.
 */
export function withFooter(
  body: { text: string; html: string },
  token: string,
): { text: string; html: string } {
  const f = buildFooter(token);
  return {
    text: `${body.text}${f.text}`,
    html: appendBeforeBodyClose(body.html, f.html),
  };
}

/**
 * Inject a fragment before the closing `</div></body>` if present so the
 * footer is part of the centered card; fall back to plain append for
 * minimal-HTML templates that don't carry the wrapper.
 */
function appendBeforeBodyClose(html: string, fragment: string): string {
  const lower = html.toLowerCase();
  // Prefer the inner card div if our standard wrapper is present.
  const cardCloseIdx = lower.lastIndexOf("</div>");
  if (cardCloseIdx >= 0 && lower.indexOf("</body>") > cardCloseIdx) {
    return `${html.slice(0, cardCloseIdx)}${fragment}${html.slice(cardCloseIdx)}`;
  }
  // Fall back to inserting before </body>.
  const bodyCloseIdx = lower.lastIndexOf("</body>");
  if (bodyCloseIdx >= 0) {
    return `${html.slice(0, bodyCloseIdx)}${fragment}${html.slice(bodyCloseIdx)}`;
  }
  // No wrapper at all — just append.
  return `${html}${fragment}`;
}
