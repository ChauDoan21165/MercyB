# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: placement-v3-vertical.spec.ts >> placement v3 end-to-end vertical >> runs UI client, session orchestrator, graders, recommender, results, and persistence
- Location: tests/e2e/placement-v3-vertical.spec.ts:44:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText(/Let's find where you should start|Hãy tìm điểm bắt đầu|Resume your placement test/i).first()
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 10000ms
  - waiting for getByText(/Let's find where you should start|Hãy tìm điểm bắt đầu|Resume your placement test/i).first()

```

# Test source

```ts
  1   | import { expect, type Locator, type Page, type TestInfo } from "@playwright/test";
  2   | import fs from "node:fs/promises";
  3   | import path from "node:path";
  4   | 
  5   | export type PendingNetworkTracker = {
  6   |   pendingRequests: () => string[];
  7   |   dispose: () => void;
  8   | };
  9   | 
  10  | export function trackPendingNetworkRequests(page: Page): PendingNetworkTracker {
  11  |   const pending = new Set<string>();
  12  | 
  13  |   const onRequest = (request: { url: () => string }) => pending.add(request.url());
  14  |   const onDone = (request: { url: () => string }) => pending.delete(request.url());
  15  | 
  16  |   page.on("request", onRequest);
  17  |   page.on("requestfinished", onDone);
  18  |   page.on("requestfailed", onDone);
  19  | 
  20  |   return {
  21  |     pendingRequests: () => [...pending].sort(),
  22  |     dispose: () => {
  23  |       page.off("request", onRequest);
  24  |       page.off("requestfinished", onDone);
  25  |       page.off("requestfailed", onDone);
  26  |       pending.clear();
  27  |     },
  28  |   };
  29  | }
  30  | 
  31  | export async function routeSettled(page: Page, urlPattern: RegExp, timeout = 10_000) {
  32  |   await page.waitForURL(urlPattern, { timeout });
  33  |   await page.waitForLoadState("domcontentloaded", { timeout });
  34  |   await page.waitForLoadState("networkidle", { timeout }).catch(() => undefined);
  35  | }
  36  | 
  37  | export async function placementTaskReady(page: Page, timeout = 10_000) {
  38  |   await page
  39  |     .locator("main textarea, main input[placeholder*='Short answer'], main [role='textbox'], main [role='radio']")
  40  |     .first()
  41  |     .waitFor({ state: "visible", timeout });
  42  | }
  43  | 
  44  | export async function waitForEnabledSubmit(page: Page, timeout = 10_000) {
  45  |   const submit = page.getByRole("button", { name: /Submit answer/i });
  46  |   await expect(submit).toBeEnabled({ timeout });
  47  |   return submit;
  48  | }
  49  | 
  50  | export async function stableInputFill(field: Locator, value: string) {
  51  |   await expect(field).toBeVisible();
  52  |   await field.fill(value);
  53  |   await expect(field).toHaveValue(value);
  54  | }
  55  | 
  56  | export async function assertPlacementV3RouteEnabled(page: Page) {
  57  |   await expect(page).toHaveURL(/\/placement/);
  58  |   await expect(
  59  |     page.getByText(/Let's find where you should start|Hãy tìm điểm bắt đầu|Resume your placement test/i).first(),
> 60  |   ).toBeVisible();
      |     ^ Error: expect(locator).toBeVisible() failed
  61  | }
  62  | 
  63  | export async function retryWithTrace<T>(
  64  |   label: string,
  65  |   attempts: number,
  66  |   action: (attempt: number) => Promise<T>,
  67  |   log: (message: string) => Promise<void> | void = () => undefined,
  68  | ): Promise<T> {
  69  |   let lastError: unknown;
  70  |   for (let attempt = 1; attempt <= attempts; attempt += 1) {
  71  |     try {
  72  |       await log(`[${new Date().toISOString()}] ${label} attempt ${attempt}/${attempts}`);
  73  |       return await action(attempt);
  74  |     } catch (error) {
  75  |       lastError = error;
  76  |       await log(
  77  |         `[${new Date().toISOString()}] ${label} attempt ${attempt}/${attempts} failed: ${error instanceof Error ? error.message : String(error)}`,
  78  |       );
  79  |       if (attempt === attempts) break;
  80  |     }
  81  |   }
  82  |   throw lastError;
  83  | }
  84  | 
  85  | export async function capturePlacementV3Diagnostics(
  86  |   page: Page,
  87  |   testInfo: TestInfo,
  88  |   pendingRequests: string[] = [],
  89  | ) {
  90  |   const dir = path.join(process.cwd(), "reports", "b1-e2e-diagnostics");
  91  |   await fs.mkdir(dir, { recursive: true });
  92  | 
  93  |   const safeTitle = testInfo.titlePath.join("__").replace(/[^a-zA-Z0-9._-]+/g, "-").slice(0, 140);
  94  |   const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  95  |   const base = `${stamp}-${safeTitle || "placement-v3"}`;
  96  |   const screenshotPath = path.join(dir, `${base}.png`);
  97  |   const jsonPath = path.join(dir, `${base}.json`);
  98  | 
  99  |   await page.screenshot({ path: screenshotPath, fullPage: true }).catch(() => undefined);
  100 | 
  101 |   const snapshot = await page
  102 |     .evaluate(() => {
  103 |       const visibleText = (selector: string) =>
  104 |         [...document.querySelectorAll(selector)]
  105 |           .filter((node) => {
  106 |             const el = node as HTMLElement;
  107 |             const box = el.getBoundingClientRect();
  108 |             return box.width > 0 && box.height > 0;
  109 |           })
  110 |           .map((node) => (node.textContent ?? "").trim())
  111 |           .filter(Boolean);
  112 | 
  113 |       const submit = [...document.querySelectorAll("button")].find((button) =>
  114 |         /submit answer/i.test(button.textContent ?? ""),
  115 |       ) as HTMLButtonElement | undefined;
  116 | 
  117 |       const activeField = [...document.querySelectorAll("main textarea, main input, main [role='textbox'], main [role='radio']")]
  118 |         .filter((node) => {
  119 |           const el = node as HTMLElement;
  120 |           const box = el.getBoundingClientRect();
  121 |           return box.width > 0 && box.height > 0;
  122 |         })
  123 |         .at(-1) as HTMLElement | undefined;
  124 | 
  125 |       return {
  126 |         currentUrl: window.location.href,
  127 |         currentTaskId:
  128 |           activeField?.getAttribute("data-task-id") ??
  129 |           activeField?.closest("[data-task-id]")?.getAttribute("data-task-id") ??
  130 |           null,
  131 |         activeControl: activeField
  132 |           ? {
  133 |               tagName: activeField.tagName,
  134 |               role: activeField.getAttribute("role"),
  135 |               ariaLabel: activeField.getAttribute("aria-label"),
  136 |               placeholder: activeField.getAttribute("placeholder"),
  137 |               text: activeField.textContent?.trim().slice(0, 200) ?? "",
  138 |             }
  139 |           : null,
  140 |         submitDisabled: submit ? submit.disabled || submit.getAttribute("aria-disabled") === "true" : null,
  141 |         submitText: submit?.textContent?.trim() ?? null,
  142 |         visibleValidationErrors: visibleText("[role='alert'], .text-destructive, .text-red-600, .text-red-700"),
  143 |         featureFlags: {
  144 |           placementRouteVisible: window.location.pathname.startsWith("/placement"),
  145 |           placementV3CopyVisible: document.body.textContent?.includes("Start placement test") ?? false,
  146 |         },
  147 |       };
  148 |     })
  149 |     .catch((error) => ({ evaluateError: error instanceof Error ? error.message : String(error) }));
  150 | 
  151 |   const diagnostic = {
  152 |     capturedAt: new Date().toISOString(),
  153 |     testTitle: testInfo.titlePath,
  154 |     status: testInfo.status,
  155 |     expectedStatus: testInfo.expectedStatus,
  156 |     retry: testInfo.retry,
  157 |     traceLocation: testInfo.outputDir,
  158 |     screenshotPath,
  159 |     pendingRequests,
  160 |     snapshot,
```