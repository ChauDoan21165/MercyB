import { expect, type Locator, type Page, type TestInfo } from "@playwright/test";
import fs from "node:fs/promises";
import path from "node:path";

export type PendingNetworkTracker = {
  pendingRequests: () => string[];
  dispose: () => void;
};

export function trackPendingNetworkRequests(page: Page): PendingNetworkTracker {
  const pending = new Set<string>();

  const onRequest = (request: { url: () => string }) => pending.add(request.url());
  const onDone = (request: { url: () => string }) => pending.delete(request.url());

  page.on("request", onRequest);
  page.on("requestfinished", onDone);
  page.on("requestfailed", onDone);

  return {
    pendingRequests: () => [...pending].sort(),
    dispose: () => {
      page.off("request", onRequest);
      page.off("requestfinished", onDone);
      page.off("requestfailed", onDone);
      pending.clear();
    },
  };
}

export async function routeSettled(page: Page, urlPattern: RegExp, timeout = 10_000) {
  await page.waitForURL(urlPattern, { timeout });
  await page.waitForLoadState("domcontentloaded", { timeout });
  await page.waitForLoadState("networkidle", { timeout }).catch(() => undefined);
}

export async function placementTaskReady(page: Page, timeout = 10_000) {
  await page
    .locator("main textarea, main input[placeholder*='Short answer'], main [role='textbox'], main [role='radio']")
    .first()
    .waitFor({ state: "visible", timeout });
}

export async function waitForEnabledSubmit(page: Page, timeout = 10_000) {
  const submit = page.getByRole("button", { name: /Submit answer/i });
  await expect(submit).toBeEnabled({ timeout });
  return submit;
}

export async function stableInputFill(field: Locator, value: string) {
  await expect(field).toBeVisible();
  await field.fill(value);
  await expect(field).toHaveValue(value);
}

export async function assertPlacementV3RouteEnabled(page: Page) {
  await expect(page).toHaveURL(/\/placement/);
  await expect(
    page.getByText(/Let's find where you should start|Hãy tìm điểm bắt đầu|Resume your placement test/i).first(),
  ).toBeVisible();
}

export async function retryWithTrace<T>(
  label: string,
  attempts: number,
  action: (attempt: number) => Promise<T>,
  log: (message: string) => Promise<void> | void = () => undefined,
): Promise<T> {
  let lastError: unknown;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      await log(`[${new Date().toISOString()}] ${label} attempt ${attempt}/${attempts}`);
      return await action(attempt);
    } catch (error) {
      lastError = error;
      await log(
        `[${new Date().toISOString()}] ${label} attempt ${attempt}/${attempts} failed: ${error instanceof Error ? error.message : String(error)}`,
      );
      if (attempt === attempts) break;
    }
  }
  throw lastError;
}

export async function capturePlacementV3Diagnostics(
  page: Page,
  testInfo: TestInfo,
  pendingRequests: string[] = [],
) {
  const dir = path.join(process.cwd(), "reports", "b1-e2e-diagnostics");
  await fs.mkdir(dir, { recursive: true });

  const safeTitle = testInfo.titlePath.join("__").replace(/[^a-zA-Z0-9._-]+/g, "-").slice(0, 140);
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const base = `${stamp}-${safeTitle || "placement-v3"}`;
  const screenshotPath = path.join(dir, `${base}.png`);
  const jsonPath = path.join(dir, `${base}.json`);

  await page.screenshot({ path: screenshotPath, fullPage: true }).catch(() => undefined);

  const snapshot = await page
    .evaluate(() => {
      const visibleText = (selector: string) =>
        [...document.querySelectorAll(selector)]
          .filter((node) => {
            const el = node as HTMLElement;
            const box = el.getBoundingClientRect();
            return box.width > 0 && box.height > 0;
          })
          .map((node) => (node.textContent ?? "").trim())
          .filter(Boolean);

      const submit = [...document.querySelectorAll("button")].find((button) =>
        /submit answer/i.test(button.textContent ?? ""),
      ) as HTMLButtonElement | undefined;

      const activeField = [...document.querySelectorAll("main textarea, main input, main [role='textbox'], main [role='radio']")]
        .filter((node) => {
          const el = node as HTMLElement;
          const box = el.getBoundingClientRect();
          return box.width > 0 && box.height > 0;
        })
        .at(-1) as HTMLElement | undefined;

      return {
        currentUrl: window.location.href,
        currentTaskId:
          activeField?.getAttribute("data-task-id") ??
          activeField?.closest("[data-task-id]")?.getAttribute("data-task-id") ??
          null,
        activeControl: activeField
          ? {
              tagName: activeField.tagName,
              role: activeField.getAttribute("role"),
              ariaLabel: activeField.getAttribute("aria-label"),
              placeholder: activeField.getAttribute("placeholder"),
              text: activeField.textContent?.trim().slice(0, 200) ?? "",
            }
          : null,
        submitDisabled: submit ? submit.disabled || submit.getAttribute("aria-disabled") === "true" : null,
        submitText: submit?.textContent?.trim() ?? null,
        visibleValidationErrors: visibleText("[role='alert'], .text-destructive, .text-red-600, .text-red-700"),
        featureFlags: {
          placementRouteVisible: window.location.pathname.startsWith("/placement"),
          placementV3CopyVisible: document.body.textContent?.includes("Start placement test") ?? false,
        },
      };
    })
    .catch((error) => ({ evaluateError: error instanceof Error ? error.message : String(error) }));

  const diagnostic = {
    capturedAt: new Date().toISOString(),
    testTitle: testInfo.titlePath,
    status: testInfo.status,
    expectedStatus: testInfo.expectedStatus,
    retry: testInfo.retry,
    traceLocation: testInfo.outputDir,
    screenshotPath,
    pendingRequests,
    snapshot,
  };

  await fs.writeFile(jsonPath, `${JSON.stringify(diagnostic, null, 2)}\n`, "utf8");
  await testInfo.attach("b1-placement-v3-diagnostics", {
    path: jsonPath,
    contentType: "application/json",
  });
  await testInfo.attach("b1-placement-v3-screenshot", {
    path: screenshotPath,
    contentType: "image/png",
  }).catch(() => undefined);

  return { jsonPath, screenshotPath };
}
