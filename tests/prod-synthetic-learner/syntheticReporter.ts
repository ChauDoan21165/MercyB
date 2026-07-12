/**
 * Aggregates the journey-result attachments (main process — survives the worker
 * restart Playwright does on failure), writes the artifact, and fires the
 * failure-only alert. Registered in playwright.synthetic-learner.config.ts.
 */
import { spawnSync } from "node:child_process";
import type { FullResult, Reporter, TestCase, TestResult } from "@playwright/test/reporter";

import { SYNTH_BASE_URL } from "./env";
import { sendFailureAlert } from "./alert";
import { writeSyntheticReport, type JourneyResult } from "./report";

export const DEPLOY_WINDOW_SELF_RESOLVED_LOG = "deploy window, self-resolved";

const DEPLOY_WINDOW_PATTERNS = [
  /#root did not render/i,
  /\bblank[-\s]?mount\b/i,
  /vite:preloadError/i,
  /chunk(load)?error/i,
  /failed to fetch dynamically imported module/i,
  /error loading dynamically imported module/i,
  /module script.*mime type.*text\/html/i,
  /mime type.*text\/html.*module script/i,
  /expected.*javascript module script.*text\/html/i,
];

export function hasDeployWindowFailure(failed: JourneyResult[]): boolean {
  return failed.some((result) => DEPLOY_WINDOW_PATTERNS.some((pattern) => pattern.test(result.detail)));
}

export function shouldRetryDeployWindowFailure(
  failed: JourneyResult[],
  env: NodeJS.ProcessEnv = process.env,
): boolean {
  return Boolean(
    failed.length &&
      hasDeployWindowFailure(failed) &&
      env.SYNTHETIC_LEARNER_RETRY_RUN !== "1" &&
      env.SYNTHETIC_LEARNER_SUPPRESS_ALERT !== "1",
  );
}

export function deployWindowRetryDelayMs(env: NodeJS.ProcessEnv = process.env): number {
  const parsed = Number(env.SYNTHETIC_LEARNER_RETRY_DELAY_MS ?? "60000");
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 60000;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function retryFullJourneySet(): boolean {
  const result = spawnSync("npm", ["run", "test:synthetic-learner"], {
    stdio: "inherit",
    env: {
      ...process.env,
      SYNTHETIC_LEARNER_RETRY_RUN: "1",
      SYNTHETIC_LEARNER_SUPPRESS_ALERT: "1",
    },
  });
  return result.status === 0;
}

export default class SyntheticReporter implements Reporter {
  private results: JourneyResult[] = [];
  private liveHash: string | null = null;

  onTestEnd(_test: TestCase, result: TestResult): void {
    for (const att of result.attachments) {
      if (att.name === "journey-result" && att.body) {
        try {
          const r = JSON.parse(att.body.toString("utf8")) as JourneyResult;
          this.results.push(r);
          if (r.id === "f") {
            const m = r.detail.match(/live=([0-9a-f]+)/i);
            if (m) this.liveHash = m[1];
          }
        } catch {
          /* ignore */
        }
      }
    }
  }

  async onEnd(_result: FullResult): Promise<void> {
    if (!this.results.length) return; // creds absent → all skipped → nothing to write
    const { failed } = writeSyntheticReport(this.results, {
      baseURL: SYNTH_BASE_URL,
      ranAt: new Date().toISOString(),
      liveVersionHash: this.liveHash,
    });

    let persistedAfterRetry = false;
    if (shouldRetryDeployWindowFailure(failed)) {
      const delayMs = deployWindowRetryDelayMs();
      // eslint-disable-next-line no-console
      console.log(`[synthetic] deploy-window signature detected; retrying full journey set in ${delayMs}ms`);
      await sleep(delayMs);
      if (retryFullJourneySet()) {
        // eslint-disable-next-line no-console
        console.log(`[synthetic] ${DEPLOY_WINDOW_SELF_RESOLVED_LOG}`);
        return;
      }
      persistedAfterRetry = true;
    }

    if (process.env.SYNTHETIC_LEARNER_SUPPRESS_ALERT === "1") {
      // eslint-disable-next-line no-console
      console.log("[synthetic-alert] suppressed for deploy-window retry run.");
    } else {
      await sendFailureAlert(failed, this.liveHash, { persistedAfterRetry });
    }
    // eslint-disable-next-line no-console
    console.log(`\n[synthetic] ${this.results.length - failed.length}/${this.results.length} journeys passed → reports/prod-synthetic-learner/latest.md`);
  }
}
