import { expect, test } from "@playwright/test";
import {
  PERF_BUDGETS,
  applyThrottledProfile,
  measureMainBundleGzip,
  measureRouteInteractiveMs,
} from "./perfBudgetHelpers";

test("home route reaches DOM interactive within budget on throttled profile", async ({ page }) => {
  await applyThrottledProfile(page);

  const interactiveMs = await measureRouteInteractiveMs(page, "/");
  console.log(`Perf budget: / DOM interactive = ${interactiveMs}ms (budget ${PERF_BUDGETS.routeInteractiveMs}ms)`);

  expect(interactiveMs, `DOM interactive ${interactiveMs}ms must stay under ${PERF_BUDGETS.routeInteractiveMs}ms`).toBeLessThanOrEqual(
    PERF_BUDGETS.routeInteractiveMs,
  );
});

test("main entry bundle stays within gzip budget", () => {
  const mainBundle = measureMainBundleGzip();
  console.log(
    `Perf budget: ${mainBundle.href} gzip = ${mainBundle.gzipBytes} bytes (budget ${PERF_BUDGETS.mainBundleGzipBytes} bytes)`,
  );

  expect(
    mainBundle.gzipBytes,
    `${mainBundle.href} gzip size ${mainBundle.gzipBytes} bytes must stay under ${PERF_BUDGETS.mainBundleGzipBytes} bytes`,
  ).toBeLessThanOrEqual(PERF_BUDGETS.mainBundleGzipBytes);
});
