// supabase/functions/apple-webhook/index.ts
//
// C4 fix — verify the JWS in `signedPayload` before logging the
// notification. A malformed, tampered, or attacker-signed payload now
// returns 401 and never reaches `registerProviderEvent`.
//
// The original logging behaviour on success is preserved; the only
// change to the success path is that `metadata.signature_verified`
// flips to `true` instead of being a hardcoded `false`.

import { createAdminClient } from "../_billing/client.ts";
import { sha256Hex } from "../_billing/crypto.ts";
import { error, json } from "../_billing/http.ts";
import { registerProviderEvent } from "../_billing/provider-events.ts";
import type { BillingEnvironment } from "../_billing/types.ts";
import { verifyAppleJws } from "../_billing/verifyAppleJws.ts";

function requestHeaders(req: Request): Record<string, string> {
  return Object.fromEntries(req.headers.entries());
}

function normalizeEnvironment(value: unknown): BillingEnvironment {
  return value === "sandbox" || value === "test" ? value : "production";
}

interface AppleNotificationV2 {
  notificationType?: string;
  notificationUUID?: string;
  data?: {
    environment?: string;
  };
}

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return error("Method not allowed", 405);
  }

  const rawBody = await req.text();
  const body = (() => {
    try {
      return rawBody ? JSON.parse(rawBody) : {};
    } catch {
      return null;
    }
  })();
  if (body === null) {
    return error("Expected valid JSON body", 400);
  }
  const headers = requestHeaders(req);

  // ── C4: signature verification ─────────────────────────────────────────
  // Apple wraps the real notification in a JWS at body.signedPayload.
  // verifyAppleJws walks the x5c chain, optionally pins the root cert
  // SHA-256 fingerprint via APPLE_ROOT_CERT_SHA256 env var, and returns
  // a structured failure code on any tamper / format error.
  const signedPayload =
    typeof body?.signedPayload === "string" ? body.signedPayload : null;

  const verification = await verifyAppleJws<AppleNotificationV2>(signedPayload);

  if (!verification.ok || !verification.payload) {
    // Log the rejection for security dashboards. Fire-and-forget — a
    // logging failure must not change the 401 response.
    try {
      const supabase = createAdminClient();
      await registerProviderEvent(supabase, {
        provider: "apple",
        environment: "production",
        eventKey: `apple-webhook:rejected:${await sha256Hex(rawBody || "{}")}`,
        providerEventId: null,
        eventType: "apple_webhook_signature_rejected",
        payload: { rawBodySize: rawBody.length },
        headers,
        metadata: {
          route: "apple-webhook",
          signature_verified: false,
          rejection_reason: verification.reason ?? "unknown",
        },
      });
    } catch (logErr) {
      console.warn("[apple-webhook] failed to log rejection:", logErr);
    }
    return error("Signature verification failed", 401, {
      reason: verification.reason,
    });
  }

  const verifiedPayload = verification.payload;
  const providerEventId =
    typeof verifiedPayload?.notificationUUID === "string"
      ? verifiedPayload.notificationUUID
      : null;
  const environment = normalizeEnvironment(verifiedPayload?.data?.environment);
  const eventKey =
    providerEventId ??
    `apple-webhook:${await sha256Hex(rawBody || JSON.stringify(verifiedPayload))}`;

  try {
    const supabase = createAdminClient();
    const result = await registerProviderEvent(supabase, {
      provider: "apple",
      environment,
      eventKey,
      providerEventId,
      eventType:
        typeof verifiedPayload?.notificationType === "string"
          ? verifiedPayload.notificationType
          : "apple_webhook_received",
      payload: verifiedPayload,
      headers,
      metadata: {
        scaffold_only: true,
        route: "apple-webhook",
        signature_verified: true,
      },
    });

    return json({
      ok: true,
      accepted: true,
      provider: "apple",
      environment,
      event: result,
      next_step:
        "TODO: derive stable subscription identifier from verified payload, then project into public.subscriptions",
    }, { status: 202 });
  } catch (err) {
    return error(err instanceof Error ? err.message : "Unexpected error", 500);
  }
});
