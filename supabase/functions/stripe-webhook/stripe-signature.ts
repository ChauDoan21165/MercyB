// supabase/functions/stripe-webhook/stripe-signature.ts

import { env } from "./stripe-env.ts";

function timingSafeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;

  let out = 0;
  for (let i = 0; i < a.length; i++) out |= a[i] ^ b[i];
  return out === 0;
}

function hexToBytes(hex: string): Uint8Array {
  const value = String(hex ?? "").trim();

  if (!/^[0-9a-f]+$/i.test(value) || value.length % 2 !== 0) {
    return new Uint8Array();
  }

  const out = new Uint8Array(value.length / 2);
  for (let i = 0; i < out.length; i++) {
    out[i] = parseInt(value.slice(i * 2, i * 2 + 2), 16);
  }

  return out;
}

function parseStripeSigHeader(
  signatureHeader: string,
): { t: string | null; v1s: string[] } {
  const parts = String(signatureHeader || "").split(",");
  let timestamp: string | null = null;
  const v1s: string[] = [];

  for (const part of parts) {
    const [rawKey, ...rest] = part.split("=");
    const key = (rawKey || "").trim();
    const value = rest.join("=").trim();
    if (!value) continue;

    if (key === "t") timestamp = value;
    if (key === "v1") v1s.push(value);
  }

  return { t: timestamp, v1s };
}

function webhookSecretToKeyBytes(webhookSecret: string): Uint8Array {
  return new TextEncoder().encode(String(webhookSecret || ""));
}

async function computeHmacSha256(
  keyBytes: Uint8Array,
  payload: Uint8Array,
): Promise<Uint8Array> {
  const algorithm: HmacImportParams = {
    name: "HMAC",
    hash: "SHA-256",
  };

  const key = await crypto.subtle.importKey(
    "raw",
    keyBytes as BufferSource,
    algorithm,
    false,
    ["sign"],
  );

  const sig = await crypto.subtle.sign(
    { name: "HMAC" },
    key,
    payload as BufferSource,
  );

  return new Uint8Array(sig);
}

function getWebhookToleranceSeconds(): number {
  const raw = env("STRIPE_WEBHOOK_TOLERANCE_SECONDS");
  const parsed = raw ? Number(raw) : NaN;

  if (Number.isFinite(parsed) && parsed > 0) {
    return Math.floor(parsed);
  }

  return 300;
}

export async function verifyStripeSignatureOrThrow(opts: {
  rawBodyBytes: Uint8Array;
  sigHeader: string;
  webhookSecret: string;
}) {
  const { rawBodyBytes, sigHeader, webhookSecret } = opts;
  const { t, v1s } = parseStripeSigHeader(sigHeader);

  if (!t || !v1s.length) {
    throw new Error("Invalid Stripe-Signature header (missing t or v1)");
  }

  const tolerance = getWebhookToleranceSeconds();
  const ts = Number(t);

  if (!Number.isFinite(ts) || ts <= 0) {
    throw new Error("Invalid Stripe-Signature header (bad t)");
  }

  const now = Math.floor(Date.now() / 1000);
  if (Math.abs(now - ts) > tolerance) {
    throw new Error(`Stripe timestamp outside tolerance (${tolerance}s)`);
  }

  const prefix = new TextEncoder().encode(`${t}.`);
  const signedPayload = new Uint8Array(prefix.length + rawBodyBytes.length);
  signedPayload.set(prefix, 0);
  signedPayload.set(rawBodyBytes, prefix.length);

  const keyBytes = webhookSecretToKeyBytes(webhookSecret);
  const expected = await computeHmacSha256(keyBytes, signedPayload);

  for (const v1 of v1s) {
    const actual = hexToBytes(v1);
    if (!actual.length) continue;
    if (timingSafeEqual(expected, actual)) return;
  }

  throw new Error("Stripe signature mismatch");
}

export function parseWebhookSecrets(raw: string): string[] {
  return String(raw || "")
    .split(/[\n,]+/g)
    .map((part) => part.trim())
    .filter(Boolean);
}
