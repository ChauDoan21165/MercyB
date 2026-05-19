// supabase/functions/email-unsubscribe/decision.ts
//
// Pure request-routing logic for the email-unsubscribe Edge Function,
// split out so it is unit-testable under vitest without Deno globals
// or esm.sh imports.
//
// RFC 8058 (one-click List-Unsubscribe):
//   * The mail client sends a POST with body `List-Unsubscribe=One-Click`.
//   * The recipient identity (our opaque profiles.email_unsubscribe_token)
//     lives in the URL query string — never derived from the body.
//   * A GET MUST NOT change state: URL scanners, link-preview bots and
//     anti-malware proxies fetch List-Unsubscribe URLs with GET. Treat
//     GET as "send the human to the confirmation page", POST as "redeem".

/** Trim + reject blatantly-too-short tokens (mirrors the RPC's >=16 guard). */
export function normalizeToken(raw: string | null | undefined): string | null {
  const t = (raw ?? "").trim();
  if (t.length < 16) return null;
  return t;
}

/**
 * Pull the unsubscribe token out of a request. The token is always
 * expected in the `token` query parameter; an `application/x-www-form-
 * urlencoded` body is accepted as a defensive fallback for senders that
 * also place it there.
 */
export function extractToken(input: {
  url: string;
  formBody?: string | null;
}): string | null {
  try {
    const u = new URL(input.url);
    const fromQuery = u.searchParams.get("token");
    const q = normalizeToken(fromQuery);
    if (q) return q;
  } catch {
    // malformed URL — fall through to body
  }

  if (input.formBody) {
    try {
      const params = new URLSearchParams(input.formBody);
      return normalizeToken(params.get("token"));
    } catch {
      return null;
    }
  }
  return null;
}

export type ResponsePlan =
  | { kind: "cors" }
  | { kind: "redeem" }
  | { kind: "redirect" }
  | { kind: "method_not_allowed"; status: 405 };

/**
 * Decide what to do based on the HTTP method alone. Method drives the
 * branch; token handling is the caller's concern.
 */
export function planResponse(method: string): ResponsePlan {
  const m = method.toUpperCase();
  if (m === "OPTIONS") return { kind: "cors" };
  if (m === "POST") return { kind: "redeem" };
  if (m === "GET" || m === "HEAD") return { kind: "redirect" };
  return { kind: "method_not_allowed", status: 405 };
}
