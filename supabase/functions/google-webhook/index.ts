// supabase/functions/google-webhook/index.ts
//
// C4 fix — verify the Google-signed Pub/Sub OIDC JWT before logging
// the RTDN. Tampered or wrong-issuer messages now return 401 and
// never reach `registerProviderEvent`.
//
// Pub/Sub push delivery includes:
//   Authorization: Bearer <Google-signed JWT>
// We verify:
//   - signature (RS256, key from googleapis.com/oauth2/v3/certs)
//   - iss == accounts.google.com
//   - aud == GOOGLE_PUBSUB_AUDIENCE
//   - email == GOOGLE_PUBSUB_SERVICE_ACCOUNT_EMAIL
//   - email_verified == true
//   - exp not past
//
// The original logging behaviour on the success path is preserved;
// the only change is `metadata.signature_verified` now flips to true.

import { createAdminClient } from "../_billing/client.ts";
import { sha256Hex } from "../_billing/crypto.ts";
import { error, json } from "../_billing/http.ts";
import { registerProviderEvent } from "../_billing/provider-events.ts";
import type { BillingEnvironment } from "../_billing/types.ts";
import { verifyGooglePubsubAuth } from "../_billing/verifyGoogleJwt.ts";
import { captureEdgeError } from "../_shared/sentry.ts";
import {
  googlePubSubEnvelopeSchema,
  googleRtdnNotificationSchema,
  type GoogleRtdnNotification,
} from "../_shared/webhookSchemas.ts";

// Sentry tag schema for billing-webhook observability — mirrors apple-
// webhook's wiring (A11-apple #886) so one dashboard facets all
// providers. All values are low-cardinality + indexed.
const BILLING_WEBHOOK_TAGS = { webhook: "google", billing: "true" } as const;

function requestHeaders(req: Request): Record<string, string> {
  return Object.fromEntries(req.headers.entries());
}

function normalizeEnvironment(value: unknown): BillingEnvironment {
  return value === "sandbox" || value === "test" ? value : "production";
}

function decodePubSubData(data: string | undefined): unknown {
  if (typeof data !== "string" || !data) return null;
  try {
    const decoded = atob(data);
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

function getRequiredEnv(name: string): string | null {
  const v = Deno.env.get(name);
  return v && v.length > 0 ? v : null;
}

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return error("Method not allowed", 405);
  }

  const rawBody = await req.text();

  // ── A11: outer-envelope runtime validation ────────────────────────────
  // Replaces the prior try/catch JSON.parse + null-check. PII-safe
  // Sentry payload on failure (zod issues + top-level keys only — no
  // raw envelope, which contains a base64 message body that itself may
  // contain purchaseTokens and orderIds).
  let parsedJson: unknown;
  try {
    parsedJson = rawBody ? JSON.parse(rawBody) : {};
  } catch (parseErr) {
    await captureEdgeError(parseErr, {
      functionName: "google-webhook",
      extra: { stage: "envelope-parse-json" },
      tags: {
        ...BILLING_WEBHOOK_TAGS,
        stage: "envelope-parse-json",
        severity: "high",
        event_type: "malformed_json",
      },
    });
    return error("Expected valid JSON body", 400);
  }

  const envelopeParse = googlePubSubEnvelopeSchema.safeParse(parsedJson);
  if (!envelopeParse.success) {
    const topLevelKeys =
      parsedJson && typeof parsedJson === "object" && !Array.isArray(parsedJson)
        ? Object.keys(parsedJson as Record<string, unknown>)
        : [];
    await captureEdgeError(
      new Error("google-webhook envelope failed zod validation"),
      {
        functionName: "google-webhook",
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
  // Pub/Sub push includes an OIDC JWT in Authorization. Without
  // GOOGLE_PUBSUB_AUDIENCE + GOOGLE_PUBSUB_SERVICE_ACCOUNT_EMAIL the
  // function refuses to start the verifier — a deployment without
  // those env vars is misconfiguration, not "trust the request".
  const expectedAudience = getRequiredEnv("GOOGLE_PUBSUB_AUDIENCE");
  const expectedEmail = getRequiredEnv("GOOGLE_PUBSUB_SERVICE_ACCOUNT_EMAIL");
  if (!expectedAudience || !expectedEmail) {
    console.error(
      "[google-webhook] missing GOOGLE_PUBSUB_AUDIENCE or GOOGLE_PUBSUB_SERVICE_ACCOUNT_EMAIL",
    );
    return error("Webhook is not configured", 500);
  }

  const verification = await verifyGooglePubsubAuth(
    req.headers.get("authorization"),
    {
      expectedAudience,
      expectedEmail,
    },
  );

  if (!verification.ok || !verification.claims) {
    try {
      const supabase = createAdminClient();
      await registerProviderEvent(supabase, {
        provider: "google",
        environment: "production",
        eventKey: `google-webhook:rejected:${await sha256Hex(rawBody || "{}")}`,
        providerEventId: null,
        eventType: "google_webhook_signature_rejected",
        payload: { rawBodySize: rawBody.length },
        headers,
        metadata: {
          route: "google-webhook",
          signature_verified: false,
          rejection_reason: verification.reason ?? "unknown",
        },
      });
    } catch (logErr) {
      console.warn("[google-webhook] failed to log rejection:", logErr);
    }
    return error("Signature verification failed", 401, {
      reason: verification.reason,
    });
  }

  // ── A11: inner-notification runtime validation (observability-only) ──
  // Decode the base64 message.data → JSON → zod-parse against the RTDN
  // notification schema. On parse failure: Sentry beacon ONLY (no 4xx).
  // The dispatch rule "Do NOT change existing valid-payload behavior"
  // applies — a signature-verified message Google actually sent is
  // still processed via the unverified-shape fallback below even when
  // its shape has drifted past our schema.
  const decoded = decodePubSubData(body.message.data);
  const innerParse = googleRtdnNotificationSchema.safeParse(decoded ?? {});
  const verifiedNotification: GoogleRtdnNotification | null = innerParse.success
    ? innerParse.data
    : null;
  if (!innerParse.success) {
    await captureEdgeError(
      new Error("google-webhook RTDN notification failed zod validation"),
      {
        functionName: "google-webhook",
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
  const unverifiedShape = (decoded ?? {}) as Record<string, unknown>;

  const messageId = body.message.messageId ?? body.message.message_id ?? null;
  // Google sends environment via Pub/Sub message attributes (rare) or
  // implicitly via packageName/testNotification. The existing code
  // read a non-spec `environment` field on the decoded payload — kept
  // here as a passthrough fallback for compatibility.
  const environment = normalizeEnvironment(
    (unverifiedShape as { environment?: unknown }).environment,
  );
  const eventKey =
    messageId ?? `google-webhook:${await sha256Hex(rawBody || JSON.stringify(body))}`;

  try {
    const supabase = createAdminClient();
    // Derive a string event-type from whichever RTDN inner shape was
    // present. Falls through to unverified-shape inspection if the zod
    // parse failed (schema drift) and finally to a generic constant —
    // matches pre-A11 behavior on unknown payloads.
    const eventTypeStr =
      verifiedNotification?.subscriptionNotification?.notificationType?.toString() ??
        verifiedNotification?.oneTimeProductNotification?.notificationType?.toString() ??
        (verifiedNotification?.voidedPurchaseNotification ? "voided_purchase" : undefined) ??
        (verifiedNotification?.testNotification ? "test_notification" : undefined) ??
        (typeof unverifiedShape.notificationType === "string"
          ? unverifiedShape.notificationType
          : undefined) ??
        "google_webhook_received";

    const result = await registerProviderEvent(supabase, {
      provider: "google",
      environment,
      eventKey,
      providerEventId: messageId,
      eventType: eventTypeStr,
      payload: {
        envelope: body,
        decodedMessage: decoded,
      },
      headers,
      metadata: {
        scaffold_only: true,
        route: "google-webhook",
        signature_verified: true,
        verified_email: verification.claims.email,
      },
    });

    return json({
      ok: true,
      accepted: true,
      provider: "google",
      environment,
      event: result,
      next_step:
        "TODO: resolve stable subscription identity from verified RTDN payload, then project into public.subscriptions",
    }, { status: 202 });
  } catch (err) {
    return error(err instanceof Error ? err.message : "Unexpected error", 500);
  }
});
