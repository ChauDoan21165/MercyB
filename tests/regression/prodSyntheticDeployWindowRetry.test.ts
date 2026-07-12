import { describe, expect, it } from "vitest";

import { buildFailureAlertPayload } from "../prod-synthetic-learner/alert";
import {
  deployWindowRetryDelayMs,
  hasDeployWindowFailure,
  shouldRetryDeployWindowFailure,
} from "../prod-synthetic-learner/syntheticReporter";
import type { JourneyResult } from "../prod-synthetic-learner/report";

function failed(detail: string): JourneyResult {
  return {
    id: "b",
    name: "Sửa câu renders a correction",
    ok: false,
    detail,
    ms: 1000,
  };
}

describe("prod synthetic deploy-window retry", () => {
  it("recognizes chunk MIME and blank-mount signatures", () => {
    expect(
      hasDeployWindowFailure([
        failed("Expected a JavaScript module script but the server responded with a MIME type of text/html."),
      ]),
    ).toBe(true);
    expect(hasDeployWindowFailure([failed("#root did not render within 15000ms")])).toBe(true);
  });

  it("does not retry ordinary journey failures or retry runs", () => {
    const ordinary = [failed("Timed out waiting for getByRole('textbox').first()")];

    expect(hasDeployWindowFailure(ordinary)).toBe(false);
    expect(shouldRetryDeployWindowFailure(ordinary, {})).toBe(false);
    expect(
      shouldRetryDeployWindowFailure([failed("ChunkLoadError: Loading chunk 42 failed")], {
        SYNTHETIC_LEARNER_RETRY_RUN: "1",
      }),
    ).toBe(false);
    expect(
      shouldRetryDeployWindowFailure([failed("ChunkLoadError: Loading chunk 42 failed")], {
        SYNTHETIC_LEARNER_SUPPRESS_ALERT: "1",
      }),
    ).toBe(false);
  });

  it("uses a 60s retry delay by default and allows a test override", () => {
    expect(deployWindowRetryDelayMs({})).toBe(60000);
    expect(deployWindowRetryDelayMs({ SYNTHETIC_LEARNER_RETRY_DELAY_MS: "5" })).toBe(5);
    expect(deployWindowRetryDelayMs({ SYNTHETIC_LEARNER_RETRY_DELAY_MS: "-1" })).toBe(60000);
  });

  it("tags persisted deploy-window alerts after the retry fails", () => {
    const payload = buildFailureAlertPayload([failed("ChunkLoadError: Loading chunk 42 failed")], "abc123", {
      persistedAfterRetry: true,
    });

    expect(payload.subject).toContain("[persisted after retry]");
    expect(payload.text).toContain("Deploy-window retry ran the full journey set once after 60s and still failed.");
  });
});
