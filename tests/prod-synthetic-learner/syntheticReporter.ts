/**
 * Aggregates the journey-result attachments (main process — survives the worker
 * restart Playwright does on failure), writes the artifact, and fires the
 * failure-only alert. Registered in playwright.synthetic-learner.config.ts.
 */
import type { FullResult, Reporter, TestCase, TestResult } from "@playwright/test/reporter";

import { SYNTH_BASE_URL } from "./env";
import { sendFailureAlert } from "./alert";
import { writeSyntheticReport, type JourneyResult } from "./report";

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
    await sendFailureAlert(failed, this.liveHash);
    // eslint-disable-next-line no-console
    console.log(`\n[synthetic] ${this.results.length - failed.length}/${this.results.length} journeys passed → reports/prod-synthetic-learner/latest.md`);
  }
}
