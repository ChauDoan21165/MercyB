import { ALERT_TO, redact } from "./env";
import { summarizeFailure } from "./report";
import type { R3Failure, R3RunResult } from "./types";

const RESEND_ENDPOINT = "https://api.resend.com/emails";
const FROM = "MercyBlade R3 Explorer <hello@mercyblade.com>";

export interface R3AlertOptions {
  persistedAfterRetry?: boolean;
}

export function buildR3AlertPayload(result: R3RunResult, options: R3AlertOptions = {}): { subject: string; text: string } {
  const retryTag = options.persistedAfterRetry ? " [persisted after retry]" : "";
  const first = result.failures[0];
  const subject = `MercyBlade R3 EXPLORER${retryTag}: ${result.failures.length} failure(s)${first ? ` - ${first.type}` : ""}`;
  const text = [
    "MercyBlade R3 EXPLORER crawler failure",
    "",
    `Base URL: ${result.baseURL}`,
    `Ran at: ${result.ranAt}`,
    `Seed: ${result.seed}`,
    `Visited routes: ${result.visited.length}`,
    `Failures: ${result.failures.length}`,
    "",
    ...result.failures.slice(0, 12).map((failure) => `- ${summarizeFailure(failure)}`),
    result.failures.length > 12 ? `- ... ${result.failures.length - 12} more` : "",
    "",
    "Diagnosis: R3 found route/action breakage outside the six scripted R0 journeys. Inspect the report and Playwright trace before changing app code.",
    "Ruled out: this run used only the dedicated synthetic account and the read-only action policy.",
    "Next action: open reports/prod-r3-explorer/latest.md and the retained trace artifact.",
    "Artifact: reports/prod-r3-explorer/latest.md",
  ].filter(Boolean).join("\n");
  return { subject, text: redact(text) };
}

export async function sendR3Alert(result: R3RunResult, options: R3AlertOptions = {}): Promise<void> {
  if (!result.failures.length) return;
  const { subject, text } = buildR3AlertPayload(result, options);
  if (await sendDispatcherAlert(result, subject, text)) return;

  const token = process.env.RESEND_ALERT_TOKEN;
  if (!token) {
    // eslint-disable-next-line no-console
    console.log("[r3-alert] RESEND_ALERT_TOKEN unset - skipping email (failures still in artifact).");
    return;
  }

  try {
    const res = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: FROM, to: [ALERT_TO], subject, text }),
    });
    // eslint-disable-next-line no-console
    console.log(`[r3-alert] sent -> ${ALERT_TO} (${res.status})`);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(`[r3-alert] send failed: ${redact((err as Error).message)}`);
  }
}

async function sendDispatcherAlert(result: R3RunResult, subject: string, text: string): Promise<boolean> {
  const dispatcherUrl = process.env.DISPATCHER_URL?.trim();
  const dispatcherSecret = process.env.DISPATCHER_SECRET?.trim();
  if (!dispatcherUrl || !dispatcherSecret) return false;

  const first = result.failures[0];
  try {
    const res = await fetch(dispatcherUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-dispatcher-secret": dispatcherSecret,
      },
      body: JSON.stringify({
        robot: "R3 EXPLORER",
        severity: "high",
        signature: first?.signature ?? "r3-explorer:unknown",
        summary: subject,
        evidence_url: "reports/prod-r3-explorer/latest.md",
        metadata: {
          visited: result.visited.length,
          failures: result.failures.length,
          seed: result.seed,
          text,
        },
      }),
    });
    if (res.ok) {
      // eslint-disable-next-line no-console
      console.log(`[r3-alert] dispatcher accepted alert (${res.status})`);
      return true;
    }
    // eslint-disable-next-line no-console
    console.log(`[r3-alert] dispatcher failed (${res.status}); falling back to direct email`);
    return false;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(`[r3-alert] dispatcher send failed: ${redact((err as Error).message)}; falling back to direct email`);
    return false;
  }
}
