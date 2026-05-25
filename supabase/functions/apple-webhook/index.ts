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
import {
  appleNotificationV2Schema,
  appleWebhookEnvelopeSchema,
  type AppleNotificationV2,
} from "../_shared/webhookSchemas.ts";

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

// Inner-payload type now sourced from the zod schema in
// _shared/webhookSchemas.ts (A11). Kept in the import block above.

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return error("Method not allowed", 405);
  }

  const rawBody = await req.text();

  // ── A11: outer-envelope runtime validation ────────────────────────────
  // Replaces the prior try/catch JSON.parse + null-check. Reports the
  // failed-parse cause to Sentry with PII-scrubbed details (zod issues +
  // top-level key set only — NEVER the raw signedPayload, which is a JWS
  // that contains transaction data). Distinguishes:
  //   400 = bad JSON / wrong envelope shape (caller's fault)
  //   401 = good JSON but JWS does not verify (further down)
  let parsedJson: unknown;
  try {
    parsedJson = rawBody ? JSON.parse(rawBody) : {};
  } catch (parseErr) {
    await captureBillingWebhookFailure(parseErr, {
      stage: "envelope-parse-json",
      severity: "high",
      event_type: "malformed_json",
    });
    return error("Expected valid JSON body", 400);
  }

  const envelopeParse = appleWebhookEnvelopeSchema.safeParse(parsedJson);
  if (!envelopeParse.success) {
    // PII-safe Sentry payload: only zod-issue field names + the top-level
    // key list. The raw signedPayload JWS is never sent to Sentry.
    const topLevelKeys =
      parsedJson && typeof parsedJson === "object" && !Array.isArray(parsedJson)
        ? Object.keys(parsedJson as Record<string, unknown>)
        : [];
    await captureEdgeError(
      new Error("apple-webhook envelope failed zod validation"),
      {
        functionName: "apple-webhook",
        extra: {
          stage: "envelope-zod",
          zodIssues: envelopeParse.error.issues.map((iss) => ({
            path: iss.path.join("."),
            code: iss.code,
            message: iss.message,
          })),
          topLevelKeys,
        },
        tags: {
          ...BILLING_WEBHOOK_TAGS,
          stage: "envelope-zod",
          severity: "high",
          event_type: "malformed_envelope",
        },
      },
    );
    return error("Webhook envelope failed validation", 400);
  }

  const body = envelopeParse.data;
  const headers = requestHeaders(req);

  // ── C4: signature verification ─────────────────────────────────────────
  // Apple wraps the real notification in a JWS at body.signedPayload.
  // verifyAppleJws walks the x5c chain, optionally pins the root cert
  // SHA-256 fingerprint via APPLE_ROOT_CERT_SHA256 env var, and returns
  // a structured failure code on any tamper / format error.
  const signedPayload = body.signedPayload; // zod-narrowed to string

  const verification = await verifyAppleJws<unknown>(signedPayload);

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

  // ── A11: inner-payload runtime validation ────────────────────────────
  // The JWS already verified the payload came from Apple. Now we zod-
  // parse it to (a) eliminate downstream `any`, and (b) emit an
  // observability beacon if Apple drifts its schema. On parse failure
  // we INTENTIONALLY do NOT reject — the existing defensive typeof
  // checks below preserve resilience for unknown-shape vendor payloads
  // (dispatch rule: "Do NOT change existing valid-payload behavior").
  const innerParse = appleNotificationV2Schema.safeParse(verification.payload);
  const verifiedPayload: AppleNotificationV2 | null = innerParse.success
    ? innerParse.data
    : null;
  if (!innerParse.success) {
    await captureEdgeError(
      new Error("apple-webhook inner notification failed zod validation"),
      {
        functionName: "apple-webhook",
        extra: {
          stage: "inner-payload-zod",
          zodIssues: innerParse.error.issues.map((iss) => ({
            path: iss.path.join("."),
            code: iss.code,
            message: iss.message,
          })),
        },
        tags: {
          ...BILLING_WEBHOOK_TAGS,
          stage: "inner-payload-zod",
          severity: "high",
          event_type: "schema_drift",
        },
      },
    );
  }
  // Fallback `unverifiedShape` retains the original raw payload for
  // resilience: if the zod parse failed, the typeof checks below still
  // extract whatever they can. Never null on a JWS-verified payload.
  const unverifiedShape = (verification.payload ?? {}) as Record<string, unknown>;
  const providerEventId =
    typeof verifiedPayload?.notificationUUID === "string"
      ? verifiedPayload.notificationUUID
      : typeof unverifiedShape.notificationUUID === "string"
      ? unverifiedShape.notificationUUID
      : null;
  const environment = normalizeEnvironment(
    verifiedPayload?.data?.environment ??
      (unverifiedShape.data as { environment?: unknown } | undefined)
        ?.environment,
  );
  const eventKey =
    providerEventId ??
    `apple-webhook:${await sha256Hex(rawBody || JSON.stringify(verification.payload))}`;

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
          : typeof unverifiedShape.notificationType === "string"
          ? unverifiedShape.notificationType
          : "apple_webhook_received",
      payload: verification.payload,
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
          : typeof unverifiedShape.notificationType === "string"
          ? unverifiedShape.notificationType
          : "unknown",
    });
    return error(err instanceof Error ? err.message : "Unexpected error", 500);
  }
});
