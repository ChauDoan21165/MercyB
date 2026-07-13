import { expect, test } from "@playwright/test";

import { seedSyntheticSession } from "./auth";
import { hasSyntheticCreds, R3_ENABLED } from "./env";
import { runR3Explorer } from "./explorer";

test.describe.configure({ mode: "serial", timeout: 11 * 60 * 1000 });

test.skip(!R3_ENABLED, "R3_EXPLORER_ENABLED=1 is required for the daily scheduled production explorer.");
test.skip(!hasSyntheticCreds(), "PROD_SYNTH_* creds absent - R3 runs only as the dedicated synthetic prod account.");

test("R3 explores production with the synthetic account and read-only action policy", async ({ page, context }, testInfo) => {
  await seedSyntheticSession(context);
  const result = await runR3Explorer(page);
  await testInfo.attach("r3-result", {
    body: JSON.stringify(result),
    contentType: "application/json",
  });

  // The explorer excludes only known CSP-blocked Sentry telemetry ingest/blob-worker
  // signatures from result.failures; real user-facing console errors, blank renders,
  // non-Sentry 5xxs, and the /stories 403 remain failures.
  expect(
    result.failures,
    `R3 failures:\n${result.failures.map((failure) => `- ${failure.type}: ${failure.route}: ${failure.detail}`).join("\n")}`,
  ).toEqual([]);
});
