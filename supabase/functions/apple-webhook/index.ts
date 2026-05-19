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
import { captureEdgeError } from "../_shared/sentry.ts";

// Sentry tag schema for billing-webhook observability — mirrors the
// stripe-webhook capture wiring (PR #645) so one ops dashboard facets
// all three billing providers. All values are low-cardinality + indexed.
const BILLING_WEBHOOK_TAGS = { webhook: "apple", billing: "true" } as const;

// Awaited BEFORE the failing return so the short-lived edge isolate does
// not tear down before Sentry's internal flush. captureEdgeError never
// throws (internally guarded) and is a zero-cost no-op when SENTRY_DSN
// is unset, so the worst case is a ≤2s delay on an ALREADY-failing
// response Apple's App Store Server Notifications v2 will retry anyway.
// Observability only — does NOT alter the response body or status. The
// paying user is inside the verified JWS payload (no request JWT), so —
// like stripe-webhook — we intentionally do not pass userId.
async function captureBillingWebhookFailure(
  err: unknown,
  tags: { stage: string; severity: "critical" | "high"; event_type?: string },
): Promise<void> {
  await captureEdgeError(err, {
    functionName: "apple-webhook",
    extra: { stage: tags.stage },
    tags: {
      ...BILLING_WEBHOOK_TAGS,
      stage: tags.stage,
      severity: tags.severity,
      event_type: tags.event_type ?? "unknown",
    },
  });
}

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
    // PRIMARY billing-observability capture: the JWS ALREADY verified
    // above, so this is a genuine Apple notification whose processing
    // (admin client / registerProviderEvent) threw — a real subscription
    // event being dropped (returns 500 so App Store Server Notifications
    // v2 retries). The signature-rejection 401 and the best-effort
    // rejection-logging failure above are scanner / secondary noise and
    // intentionally NOT captured, mirroring stripe-webhook (PR #645).
    await captureBillingWebhookFailure(err, {
      stage: "processing",
      severity: "high",
      event_type:
        typeof verifiedPayload?.notificationType === "string"
          ? verifiedPayload.notificationType
          : "unknown",
    });
    return error(err instanceof Error ? err.message : "Unexpected error", 500);
  }
});
