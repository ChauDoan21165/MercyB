// src/lib/apiFailureAlert.ts
//
// Detects OpenAI billing / quota / rate-limit failures and sends a
// Sentry exception + email alert via Resend. Includes a 30-minute
// cooldown so repeated failures (e.g. a user retrying in a loop) don't
// flood the admin inbox.
//
// The cooldown is process-local (in-memory). For a serverless / edge
// deployment, replace with a Supabase kv table or Redis. The 30-minute
// window is tuned so an admin has time to act after the first alert
// without getting spammed by every retry from every user.

import { captureError } from "@/lib/monitoring/captureException";

/* ── Recognise billing / quota / rate-limit errors ─────────────────── */

const QUOTA_KEYWORDS = [
  "insufficient_quota",
  "quota",
  "billing",
  "exceeded your current quota",
  "please check your account balance",
  "you exceeded your current quota",
  "billing_not_active",
  "payment required",
];

function isOpenAiBillingError(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;

  // Standard OpenAI v4 SDK error
  const err = error as any;
  const status = Number(err.status ?? err.statusCode ?? 0);
  if (status === 402 || status === 429) return true;

  const code = String(err.code ?? err.type ?? "").toLowerCase();
  const msg = String(err.message ?? "").toLowerCase();
  for (const kw of QUOTA_KEYWORDS) {
    if (code.includes(kw) || msg.includes(kw)) return true;
  }
  return false;
}

/* ── Cooldown ──────────────────────────────────────────────────────── */

const COOLDOWN_MS = 30 * 60 * 1000; // 30 minutes
const cooldowns = new Map<string, number>();

function isInCooldown(key: string): boolean {
  const last = cooldowns.get(key);
  if (!last) return false;
  if (Date.now() - last > COOLDOWN_MS) {
    cooldowns.delete(key);
    return false;
  }
  return true;
}

function setCooldown(key: string): void {
  cooldowns.set(key, Date.now());
}

/* ── Resend email helper ───────────────────────────────────────────── */

async function sendAlertEmail(subject: string, body: string): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.ALERT_EMAIL_FROM;
  const to = process.env.ALERT_EMAIL_TO;

  if (!apiKey || !from || !to) {
    console.warn("[apiFailureAlert] RESEND_API_KEY, ALERT_EMAIL_FROM, or ALERT_EMAIL_TO not set — skipping email");
    return;
  }

  try {
    // Resend REST API — avoid bundling the full SDK for a single endpoint
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject,
        text: body,
      }),
    });

    if (!res.ok) {
      const errBody = await res.text().catch(() => "");
      console.error(`[apiFailureAlert] Resend returned ${res.status}: ${errBody.slice(0, 200)}`);
    }
  } catch (e: any) {
    console.error(`[apiFailureAlert] Failed to send Resend email: ${e?.message ?? e}`);
  }
}

/* ── Public API ────────────────────────────────────────────────────── */

export interface ApiFailureContext {
  provider: "openai";
  userId?: string | null;
  model?: string;
  operation?: string;
}

/**
 * Call immediately after catching an error from an AI provider call.
 * Cooldown-aware: only fires Sentry + email once every 30 minutes
 * per error type. Safe to call on every failure — it self-throttles.
 */
export async function alertApiFailure(
  error: unknown,
  context: ApiFailureContext,
): Promise<void> {
  if (!isOpenAiBillingError(error)) return;

  const err = error as any;
  const code = String(err.code ?? err.type ?? "unknown").slice(0, 40);
  const cooldownKey = `openai:${code}`;

  if (isInCooldown(cooldownKey)) return;

  // ── Sentry ───────────────────────────────────────────────────
  captureError(error, {
    provider: context.provider,
    model: context.model ?? "unknown",
    operation: context.operation ?? "unknown",
    userId: context.userId?.slice(0, 8),
    error_code: code,
    flagged: "billing_or_quota",
  });

  // ── Email ────────────────────────────────────────────────────
  const now = new Date().toISOString();
  const subject = `MercyBlade API Alert: OpenAI ${code}`;
  const body = [
    `MercyBlade API Failure Alert`,
    `─────────────────────────────`,
    `Time:       ${now}`,
    `Provider:   ${context.provider}`,
    `Error code: ${code}`,
    `Message:    ${String(err.message ?? "unknown").slice(0, 500)}`,
    `Model:      ${context.model ?? "unknown"}`,
    `Operation:  ${context.operation ?? "unknown"}`,
    `User:       ${context.userId?.slice(0, 8) ?? "N/A"}`,
    ``,
    `Action required: check OpenAI billing dashboard at https://platform.openai.com/account/billing`,
    ``,
    `(This alert will not repeat for the same error code for 30 minutes.)`,
  ].join("\n");

  await sendAlertEmail(subject, body);
  setCooldown(cooldownKey);
}
