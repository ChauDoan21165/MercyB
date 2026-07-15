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
import {
  markProviderEventFailed,
  markProviderEventProcessed,
  registerProviderEvent,
} from "../_billing/provider-events.ts";
import {
  type GoogleRtdnPayload,
  type GoogleSubscriptionPurchaseV2,
  projectGoogleRtdn,
} from "../_billing/store-webhook-projection.ts";
import type { BillingEnvironment } from "../_billing/types.ts";
import { verifyGooglePubsubAuth } from "../_billing/verifyGoogleJwt.ts";

type JsonRecord = Record<string, unknown>;

const GOOGLE_ANDROID_PUBLISHER_SCOPE =
  "https://www.googleapis.com/auth/androidpublisher";
const GOOGLE_OAUTH_TOKEN_URL = "https://oauth2.googleapis.com/token";

function requestHeaders(req: Request): Record<string, string> {
  return Object.fromEntries(req.headers.entries());
}

function normalizeEnvironment(value: unknown): BillingEnvironment {
  return value === "sandbox" || value === "test" ? value : "production";
}

function decodePubSubData(body: Record<string, unknown>): unknown {
  const data = body?.message && typeof body.message === "object"
    ? (body.message as Record<string, unknown>).data
    : null;

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

function firstNonEmptyString(...values: unknown[]): string | null {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }
  return null;
}

function base64UrlEncode(input: Uint8Array | string): string {
  const bytes =
    typeof input === "string" ? new TextEncoder().encode(input) : input;
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function pemToArrayBuffer(pem: string): ArrayBuffer {
  const cleaned = pem
    .replace(/-----BEGIN PRIVATE KEY-----/g, "")
    .replace(/-----END PRIVATE KEY-----/g, "")
    .replace(/\s+/g, "");
  const binary = atob(cleaned);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return bytes.buffer;
}

async function signJwtRs256(
  payload: JsonRecord,
  privateKeyPem: string,
): Promise<string> {
  const encodedHeader = base64UrlEncode(
    JSON.stringify({ alg: "RS256", typ: "JWT" }),
  );
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const signingInput = `${encodedHeader}.${encodedPayload}`;

  const cryptoKey = await crypto.subtle.importKey(
    "pkcs8",
    pemToArrayBuffer(privateKeyPem),
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"],
  );

  const signature = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    cryptoKey,
    new TextEncoder().encode(signingInput),
  );

  return `${signingInput}.${base64UrlEncode(new Uint8Array(signature))}`;
}

function getGoogleCredentials(): { clientEmail: string; privateKey: string } {
  const rawJson = Deno.env.get("GOOGLE_SERVICE_ACCOUNT_JSON");
  if (rawJson) {
    const parsed = JSON.parse(rawJson);
    const clientEmail = firstNonEmptyString(parsed.client_email);
    const privateKey = firstNonEmptyString(parsed.private_key);
    if (clientEmail && privateKey) return { clientEmail, privateKey };
  }

  const clientEmail = firstNonEmptyString(Deno.env.get("GOOGLE_CLIENT_EMAIL"));
  const privateKey = firstNonEmptyString(
    Deno.env.get("GOOGLE_PRIVATE_KEY"),
  )?.replace(/\\n/g, "\n");

  if (!clientEmail || !privateKey) {
    throw new Error(
      "Missing Google service account credentials. Set GOOGLE_SERVICE_ACCOUNT_JSON or GOOGLE_CLIENT_EMAIL + GOOGLE_PRIVATE_KEY.",
    );
  }

  return { clientEmail, privateKey };
}

async function getGoogleAccessToken(): Promise<string> {
  const { clientEmail, privateKey } = getGoogleCredentials();
  const now = Math.floor(Date.now() / 1000);

  const assertion = await signJwtRs256(
    {
      iss: clientEmail,
      scope: GOOGLE_ANDROID_PUBLISHER_SCOPE,
      aud: GOOGLE_OAUTH_TOKEN_URL,
      iat: now,
      exp: now + 3600,
    },
    privateKey,
  );

  const response = await fetch(GOOGLE_OAUTH_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(
      `Failed to obtain Google access token: ${response.status} ${text}`,
    );
  }

  const payload = await response.json();
  const accessToken = firstNonEmptyString(payload.access_token);
  if (!accessToken) {
    throw new Error("Google OAuth response did not include access_token");
  }

  return accessToken;
}

async function fetchGoogleSubscriptionPurchase(
  packageName: string,
  purchaseToken: string,
): Promise<GoogleSubscriptionPurchaseV2> {
  const accessToken = await getGoogleAccessToken();
  const url = `https://androidpublisher.googleapis.com/androidpublisher/v3/applications/${
    encodeURIComponent(packageName)
  }/purchases/subscriptionsv2/tokens/${encodeURIComponent(purchaseToken)}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json",
    },
  });

  const text = await response.text();
  if (!response.ok) {
    throw new Error(
      `Google subscription lookup failed: ${response.status} ${text}`,
    );
  }

  return JSON.parse(text) as GoogleSubscriptionPurchaseV2;
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

  const pubSubPayload = body && typeof body === "object"
    ? decodePubSubData(body as Record<string, unknown>)
    : null;
  const messageId = typeof body?.message?.messageId === "string" ? body.message.messageId : null;
  const environment = normalizeEnvironment(
    typeof pubSubPayload === "object" && pubSubPayload !== null
      ? (pubSubPayload as Record<string, unknown>).environment
      : undefined,
  );
  const eventKey = messageId ?? `google-webhook:${await sha256Hex(rawBody || JSON.stringify(body))}`;
  const packageName = firstNonEmptyString(
    typeof pubSubPayload === "object" && pubSubPayload !== null
      ? (pubSubPayload as GoogleRtdnPayload).packageName
      : null,
    Deno.env.get("GOOGLE_PLAY_PACKAGE_NAME"),
    Deno.env.get("GOOGLE_PACKAGE_NAME"),
  );
  let registeredEventId: string | null = null;

  try {
    const supabase = createAdminClient();
    const result = await registerProviderEvent(supabase, {
      provider: "google",
      environment,
      eventKey,
      providerEventId: messageId,
      eventType: typeof pubSubPayload === "object" && pubSubPayload !== null
        ? ((pubSubPayload as Record<string, unknown>).notificationType as string | undefined) ?? "google_webhook_received"
        : "google_webhook_received",
      payload: {
        envelope: body,
        decodedMessage: pubSubPayload,
      },
      headers,
      metadata: {
        route: "google-webhook",
        signature_verified: true,
        verified_email: verification.claims.email,
      },
    });
    registeredEventId = result.id;

    if (!result.isNew && result.processStatus === "processed") {
      return json({
        ok: true,
        accepted: true,
        duplicate: true,
        provider: "google",
        environment,
        event: result,
      });
    }

    if (!pubSubPayload || typeof pubSubPayload !== "object") {
      return error("Expected Pub/Sub data JSON payload", 400);
    }

    if (!packageName) {
      return error("packageName is required or set GOOGLE_PLAY_PACKAGE_NAME", 400);
    }

    const rtdn = pubSubPayload as GoogleRtdnPayload;
    const purchaseToken = rtdn.subscriptionNotification?.purchaseToken;
    const purchase = purchaseToken
      ? await fetchGoogleSubscriptionPurchase(packageName, purchaseToken)
      : null;
    const projection = purchase
      ? await projectGoogleRtdn(supabase, {
        environment,
        packageName,
        rtdn,
        purchase,
      })
      : { action: "ignored" as const, reason: "not_subscription_notification" };

    await markProviderEventProcessed(supabase, result.id, {
      projection,
      provider_subscription_id:
        projection.action === "upserted"
          ? projection.providerSubscriptionId
          : null,
      canonical_status:
        projection.action === "upserted" ? projection.status : null,
    });

    return json({
      ok: true,
      accepted: true,
      provider: "google",
      environment,
      event: result,
      projection,
    });
  } catch (err) {
    if (registeredEventId) {
      try {
        const supabase = createAdminClient();
        await markProviderEventFailed(
          supabase,
          registeredEventId,
          err instanceof Error ? err : new Error("Unexpected error"),
        );
      } catch (markErr) {
        console.warn("[google-webhook] failed to mark provider event failed:", markErr);
      }
    }
    return error(err instanceof Error ? err.message : "Unexpected error", 500);
  }
});
