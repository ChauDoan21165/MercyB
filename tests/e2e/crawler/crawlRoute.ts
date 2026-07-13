/**
 * Per-route capture for the Tier-1 crawler. Loads one route and records every
 * failure signal the brief asks for: 404s, JS crashes, console errors, network
 * failures, and dead-end/blank renders — classifying each console signal as a
 * seeded known-defect (reproduction) vs a NEW failure.
 *
 * Read-only: it only navigates. Any click-driven flow lives in the journey
 * specs, not here.
 */
import type { Page } from "@playwright/test";

import { isIgnorableNoise, matchKnownDefect } from "./knownDefects";

export type FailureType =
  | "not-found-404"
  | "js-crash"
  | "console-error"
  | "network-failure"
  | "blank-render"
  | "known-defect";

export interface Failure {
  type: FailureType;
  detail: string;
  /** Copy-paste reproduction for admin. */
  repro: string;
  /** Set for type === "known-defect". */
  knownDefectId?: string;
}

export type Outcome = "pass" | "fail" | "gated";

export interface RouteResult {
  path: string;
  kind: string;
  outcome: Outcome;
  httpStatus: number | null;
  /** Final URL after any client redirect (e.g. → /signin for gated routes). */
  landedOn: string;
  failures: Failure[];
  knownDefectsHit: string[];
}

const NAV_TIMEOUT = 15_000;
const SETTLE_MS = 1_200;
const MEANINGFUL_STATIC_BODY_MIN_CHARS = 80;

function reproFor(baseURL: string, path: string, detail: string): string {
  return `Open ${baseURL}${path} in a logged-out browser and observe: ${detail}`;
}

function bodyHasMeaningfulContent(text: string): boolean {
  const normalized = text.replace(/\s+/g, " ").trim();
  return normalized.length >= MEANINGFUL_STATIC_BODY_MIN_CHARS;
}

/**
 * Crawl a single route. `expectAuth` routes that redirect to /signin resolve as
 * "gated" (an expected outcome, not a failure) so an anonymous crawl of the
 * whole table produces a clean map instead of a wall of false negatives.
 */
export async function crawlRoute(
  page: Page,
  baseURL: string,
  path: string,
  kind: string,
): Promise<RouteResult> {
  const failures: Failure[] = [];
  const knownDefectsHit = new Set<string>();
  let pageErrorCount = 0;

  const onConsoleOrError = (text: string) => {
    if (isIgnorableNoise(text)) return;
    const known = matchKnownDefect(text);
    if (known) {
      if (!known.consoleObservable) return; // don't attribute flow-only defects to a page load
      knownDefectsHit.add(known.id);
      failures.push({
        type: "known-defect",
        detail: `${known.id}: ${text}`,
        repro: reproFor(baseURL, path, known.summary),
        knownDefectId: known.id,
      });
      return;
    }
    failures.push({
      type: "console-error",
      detail: text,
      repro: reproFor(baseURL, path, `console error: ${text}`),
    });
  };

  page.on("console", (m) => m.type() === "error" && onConsoleOrError(m.text()));
  page.on("pageerror", (e) => {
    pageErrorCount++;
    failures.push({
      type: "js-crash",
      detail: `pageerror: ${e.message}`,
      repro: reproFor(baseURL, path, `an uncaught JS error crashes the page: ${e.message}`),
    });
  });
  page.on("response", (r) => {
    const s = r.status();
    if (s < 400) return;
    if (isIgnorableNoise(r.url())) return;
    failures.push({
      type: "network-failure",
      detail: `${s} ${r.url()}`,
      repro: reproFor(baseURL, path, `a request fails with HTTP ${s}: ${r.url()}`),
    });
  });

  let httpStatus: number | null = null;
  try {
    const resp = await page.goto(path, { waitUntil: "commit", timeout: NAV_TIMEOUT });
    httpStatus = resp?.status() ?? null;
  } catch (e) {
    failures.push({
      type: "js-crash",
      detail: `navigation failed: ${(e as Error).message}`,
      repro: reproFor(baseURL, path, `the page never loads: ${(e as Error).message}`),
    });
  }
  await page.waitForTimeout(SETTLE_MS);

  const landedOn = new URL(page.url()).pathname;

  // Gated: an auth route bounced us to /signin. Expected, not a failure.
  const gated =
    kind === "auth" &&
    /\/signin|\/login/.test(landedOn) &&
    !/\/signin|\/login/.test(path);

  // Blank/dead-end render: no #root content mounted.
  const rootVisible = await page
    .locator("#root")
    .isVisible()
    .catch(() => false);
  const body = (await page.locator("body").innerText().catch(() => "")) || "";
  const meaningfulStaticPage = !rootVisible && bodyHasMeaningfulContent(body) && pageErrorCount === 0;
  if (!rootVisible && !gated && !meaningfulStaticPage) {
    failures.push({
      type: "blank-render",
      detail: "#root did not render any content",
      repro: reproFor(baseURL, path, "a blank page (the SPA shell never mounted #root)"),
    });
  }

  // Unexpected client 404 (AppRouter's NotFound: "404" + "Không tìm thấy trang.").
  const is404 = /Không tìm thấy trang\./.test(body) || /^\s*404\s*$/m.test(body);
  if (is404 && !gated) {
    failures.push({
      type: "not-found-404",
      detail: "route rendered the NotFound (404) page",
      repro: reproFor(baseURL, path, "the app's 404 'Không tìm thấy trang.' page — the route is not wired"),
    });
  }

  const outcome: Outcome = gated ? "gated" : failures.length ? "fail" : "pass";
  return {
    path,
    kind,
    outcome,
    httpStatus,
    landedOn,
    failures,
    knownDefectsHit: [...knownDefectsHit],
  };
}
