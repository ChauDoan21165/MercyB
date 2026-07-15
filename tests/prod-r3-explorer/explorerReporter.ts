import { spawnSync } from "node:child_process";
import type { FullResult, Reporter, TestCase, TestResult } from "@playwright/test/reporter";

import { R3_RETRY_DELAY_MS } from "./env";
import { sendR3Alert } from "./alert";
import { hasDeployWindowFailure } from "./explorer";
import { writeR3Report } from "./report";
import type { R3RunResult } from "./types";

export const R3_DEPLOY_WINDOW_SELF_RESOLVED_LOG = "R3 deploy window, self-resolved";

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function retryExplorer(): boolean {
  const result = spawnSync("npm", ["run", "test:r3-explorer"], {
    stdio: "inherit",
    env: {
      ...process.env,
      R3_EXPLORER_RETRY_RUN: "1",
      R3_EXPLORER_SUPPRESS_ALERT: "1",
    },
  });
  return result.status === 0;
}

export default class R3ExplorerReporter implements Reporter {
  private result: R3RunResult | null = null;

  onTestEnd(_test: TestCase, result: TestResult): void {
    for (const att of result.attachments) {
      if (att.name !== "r3-result" || !att.body) continue;
      try {
        this.result = JSON.parse(att.body.toString("utf8")) as R3RunResult;
      } catch {
        /* ignore malformed attachment */
      }
    }
  }

  async onEnd(_result: FullResult): Promise<void> {
    if (!this.result) return;
    const { failed } = writeR3Report(this.result);

    let persistedAfterRetry = false;
    if (
      failed.length &&
      hasDeployWindowFailure(failed) &&
      process.env.R3_EXPLORER_RETRY_RUN !== "1" &&
      process.env.R3_EXPLORER_SUPPRESS_ALERT !== "1"
    ) {
      // eslint-disable-next-line no-console
      console.log(`[r3] deploy-window signature detected; retrying full explorer in ${R3_RETRY_DELAY_MS}ms`);
      await sleep(R3_RETRY_DELAY_MS);
      if (retryExplorer()) {
        // eslint-disable-next-line no-console
        console.log(`[r3] ${R3_DEPLOY_WINDOW_SELF_RESOLVED_LOG}`);
        return;
      }
      persistedAfterRetry = true;
    }

    if (process.env.R3_EXPLORER_SUPPRESS_ALERT === "1") {
      // eslint-disable-next-line no-console
      console.log("[r3-alert] suppressed for deploy-window retry run.");
    } else {
      await sendR3Alert(this.result, { persistedAfterRetry });
    }
    // eslint-disable-next-line no-console
    console.log(`\n[r3] ${this.result.visited.length} routes visited, ${failed.length} failures -> reports/prod-r3-explorer/latest.md`);
  }
}

