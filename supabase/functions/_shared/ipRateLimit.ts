// supabase/functions/_shared/ipRateLimit.ts
//
// Per-IP rate-limit helper. Second layer on top of the existing
// per-user-id rateLimit() — bots that rotate anonymous sessions can
// reset their per-user quota cheaply, but they can't change their IP
// for free, so capping per-IP closes that bypass.
//
// Schema lives in supabase/migrations/20260514000000_ip_rate_limit.sql.
// All state is keyed on SHA-256(ip) so neither the working table nor
// the telemetry table ever contain raw IPs (privacy: brief calls this
// out explicitly).
//
// Pure functions (`extractClientIp`, `hashIp`, `IP_RATE_LIMITS`,
// `buildRateLimitErrorBody`) are exported for vitest. The DB-touching
// `checkIpRateLimit` is the production entry; tests stub the supabase
// client.

// ── Pure helpers ─────────────────────────────────────────────────────────

/**
 * Pull the client IP from a Request. Order of preference:
 *   1. `x-forwarded-for` first hop (Cloudflare / Supabase edge always
 *      sets this; the leftmost entry is the original client).
 *   2. `x-real-ip` (common alt header).
 *   3. `cf-connecting-ip` (Cloudflare's preferred override; documented
 *      to always be the real client even if x-forwarded-for is spoofed).
 *
 * Returns null if no header carried a recognisable IP. Caller decides
 * whether to fail-open or fail-closed.
 */
export function extractClientIp(req: Request): string | null {
  const cfConnecting = req.headers.get("cf-connecting-ip");
  if (isLikelyIp(cfConnecting)) return cfConnecting!.trim();

  const xff = req.headers.get("x-forwarded-for");
  if (xff) {
    const first = xff.split(",")[0]?.trim();
    if (isLikelyIp(first)) return first!;
  }

  const xri = req.headers.get("x-real-ip");
  if (isLikelyIp(xri)) return xri!.trim();

  return null;
}

function isLikelyIp(v: string | null | undefined): boolean {
  if (!v) return false;
  const s = v.trim();
  if (s.length === 0) return false;
  // We don't validate strictly (malformed input still produces a stable
  // hash key, which is fine — hash collisions across malformed inputs
  // are not a security issue). Just reject the obvious 'unknown' path.
  if (s.toLowerCase() === "unknown") return false;
  return true;
}

/**
 * SHA-256 hash of an IP, lowercase hex. Stable across calls so the
 * same IP always maps to the same row in `ip_rate_limit`.
 */
export async function hashIp(ip: string): Promise<string> {
  const data = new TextEncoder().encode(ip);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// ── Rate-limit configuration per protected surface ──────────────────────

export interface IpRateLimitConfig {
  /** Logical surface name; appears in `ip_rate_limit.bucket` rows. */
  surface: string;
  maxPerMinute: number;
  maxPerHour: number;
}

/**
 * Canonical limits per the brief. Generous on the hour cap (10 anon
 * sessions × 10 attempts/hour = 100) and stricter per-minute (burst
 * protection). Real authenticated users on shared NAT have plenty of
 * headroom; per-user caps already gate them tighter individually.
 */
export const IP_RATE_LIMITS: Record<string, IpRateLimitConfig> = Object.freeze({
  "azure-phoneme": {
    surface: "azure-phoneme",
    maxPerMinute: 20,
    maxPerHour: 100,
  },
  "ai-chat": {
    surface: "ai-chat",
    maxPerMinute: 10,
    maxPerHour: 50,
  },
});

// ── 429 response shape ──────────────────────────────────────────────────

export interface IpRateLimitErrorBody {
  ok: false;
  error_code: "IP_RATE_LIMIT_EXCEEDED";
  error_message_vi: string;
  error_message_en: string;
  retry_after_seconds: number;
}

export function buildRateLimitErrorBody(
  retryAfterSeconds: number,
): IpRateLimitErrorBody {
  return {
    ok: false,
    error_code: "IP_RATE_LIMIT_EXCEEDED",
    error_message_vi: `Quá nhiều yêu cầu. Vui lòng thử lại sau ${retryAfterSeconds} giây.`,
    error_message_en: `Too many requests. Please try again in ${retryAfterSeconds} seconds.`,
    retry_after_seconds: retryAfterSeconds,
  };
}

// ── DB-touching production entry ────────────────────────────────────────

/**
 * Minimal Supabase client surface used here. Accepting both the real
 * client and a vitest stub keeps testability while avoiding a hard
 * dep on `@supabase/supabase-js` types in this module.
 */
export interface RateLimitSupabase {
  rpc: (
    fn: string,
    args: Record<string, unknown>,
  ) => Promise<{
    data: unknown;
    error: { message: string } | null;
  }>;
}

export interface CheckIpRateLimitOptions {
  supabase: RateLimitSupabase;
  surface: keyof typeof IP_RATE_LIMITS | string;
  /**
   * When true, bypass the rate limit entirely (admin override per the
   * brief — `get_admin_level >= 9`). Caller resolves admin status; this
   * helper just respects the flag.
   */
  isAdminBypass?: boolean;
}

export interface CheckIpRateLimitResult {
  /** True = let the request through. False = caller must return 429. */
  allowed: boolean;
  /** Seconds until the smaller of the two windows resets. */
  retryAfterSeconds?: number;
  /** Which window tripped: "minute" | "hour" — useful for logging. */
  exceededWindow?: "minute" | "hour";
  /** Reason the helper failed-open without checking, if any. */
  bypassReason?: "admin" | "no_ip" | "config_missing" | "rpc_error";
}

/**
 * Check both the per-minute and per-hour caps for the calling IP
 * against the configured surface. Returns allowed=false the moment
 * either window trips. Fails OPEN on any infrastructure error
 * (missing IP header, RPC failure, missing config) — the brief wants
 * us to never block legitimate traffic, so a bad telemetry call
 * should not gate the user.
 */
export async function checkIpRateLimit(
  req: Request,
  options: CheckIpRateLimitOptions,
): Promise<CheckIpRateLimitResult> {
  if (options.isAdminBypass === true) {
    return { allowed: true, bypassReason: "admin" };
  }

  const config = IP_RATE_LIMITS[options.surface];
  if (!config) {
    console.warn(
      `[ipRateLimit] no config for surface '${options.surface}'; failing open`,
    );
    return { allowed: true, bypassReason: "config_missing" };
  }

  const ip = extractClientIp(req);
  if (!ip) {
    // No discoverable IP. We could fail closed, but that would block
    // legitimate users behind misconfigured proxies. Brief: per-IP cap
    // is generous; per-user cap is strict. Let per-user be the gate.
    return { allowed: true, bypassReason: "no_ip" };
  }

  let ipHash: string;
  try {
    ipHash = await hashIp(ip);
  } catch (err) {
    console.error("[ipRateLimit] hashIp threw:", err);
    return { allowed: true, bypassReason: "rpc_error" };
  }

  // Per-minute window first — bursts are the more common abuse shape.
  const minuteResult = await callIncrRpc(
    options.supabase,
    ipHash,
    `${config.surface}:minute`,
    config.maxPerMinute,
    60,
  );
  if (minuteResult.kind === "error") {
    return { allowed: true, bypassReason: "rpc_error" };
  }
  if (!minuteResult.allowed) {
    return {
      allowed: false,
      retryAfterSeconds: minuteResult.retryAfterSeconds,
      exceededWindow: "minute",
    };
  }

  const hourResult = await callIncrRpc(
    options.supabase,
    ipHash,
    `${config.surface}:hour`,
    config.maxPerHour,
    60 * 60,
  );
  if (hourResult.kind === "error") {
    return { allowed: true, bypassReason: "rpc_error" };
  }
  if (!hourResult.allowed) {
    return {
      allowed: false,
      retryAfterSeconds: hourResult.retryAfterSeconds,
      exceededWindow: "hour",
    };
  }

  return { allowed: true };
}

interface IncrRpcOk {
  kind: "ok";
  allowed: boolean;
  retryAfterSeconds: number;
}
interface IncrRpcError {
  kind: "error";
}
type IncrRpcResult = IncrRpcOk | IncrRpcError;

async function callIncrRpc(
  supabase: RateLimitSupabase,
  ipHash: string,
  bucket: string,
  max: number,
  windowSeconds: number,
): Promise<IncrRpcResult> {
  try {
    const { data, error } = await supabase.rpc("incr_ip_rate_limit", {
      p_ip_hash: ipHash,
      p_bucket: bucket,
      p_max: max,
      p_window_seconds: windowSeconds,
    });

    if (error) {
      console.warn(
        `[ipRateLimit] incr_ip_rate_limit RPC error (${bucket}):`,
        error.message,
      );
      return { kind: "error" };
    }

    const row = Array.isArray(data) ? data[0] : data;
    if (!row || typeof row !== "object") {
      return { kind: "error" };
    }
    const r = row as {
      allowed?: boolean;
      retry_after_seconds?: number;
    };
    return {
      kind: "ok",
      allowed: r.allowed === true,
      retryAfterSeconds: typeof r.retry_after_seconds === "number"
        ? r.retry_after_seconds
        : windowSeconds,
    };
  } catch (err) {
    console.warn(
      `[ipRateLimit] incr_ip_rate_limit threw (${bucket}):`,
      err,
    );
    return { kind: "error" };
  }
}
