/**
 * Failure-only alert to Chau via the existing Resend path. Green runs never
 * email — an alert always means action. Token + recipient come from env
 * (admin host); nothing is committed. No-op if RESEND_ALERT_TOKEN is unset.
 */
import { ALERT_TO, SYNTH_BASE_URL, redact } from "./env";
import type { JourneyResult } from "./report";

const RESEND_ENDPOINT = "https://api.resend.com/emails";
const FROM = "MercyBlade Synthetic Learner <hello@mercyblade.com>";

export interface FailureAlertOptions {
  persistedAfterRetry?: boolean;
}

export function buildFailureAlertPayload(
  failed: JourneyResult[],
  liveHash: string | null,
  options: FailureAlertOptions = {},
): { subject: string; text: string } {
  const retryTag = options.persistedAfterRetry ? " [persisted after retry]" : "";
  const subject = `🔴 Prod synthetic learner${retryTag}: ${failed.length} journey(s) failed (${liveHash ?? "?"})`;
  const retryNote = options.persistedAfterRetry
    ? "Deploy-window retry ran the full journey set once after 60s and still failed.\n\n"
    : "";
  const text =
    `Prod synthetic learner failed against ${SYNTH_BASE_URL} (live ${liveHash ?? "?"}):\n\n` +
    retryNote +
    failed.map((f) => `• (${f.id}) ${f.name}\n    ${redact(f.detail)}`).join("\n\n") +
    `\n\nFull map: reports/prod-synthetic-learner/latest.md`;
  return { subject, text };
}

export async function sendFailureAlert(
  failed: JourneyResult[],
  liveHash: string | null,
  options: FailureAlertOptions = {},
): Promise<void> {
  if (!failed.length) return;
  const token = process.env.RESEND_ALERT_TOKEN;
  if (!token) {
    // eslint-disable-next-line no-console
    console.log("[synthetic-alert] RESEND_ALERT_TOKEN unset — skipping email (failures still in the artifact).");
    return;
  }
  const { subject, text } = buildFailureAlertPayload(failed, liveHash, options);
  try {
    const res = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: FROM, to: [ALERT_TO], subject, text }),
    });
    // eslint-disable-next-line no-console
    console.log(`[synthetic-alert] sent → ${ALERT_TO} (${res.status})`);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(`[synthetic-alert] send failed: ${redact((e as Error).message)}`);
  }
}
