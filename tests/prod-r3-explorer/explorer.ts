import type { Locator, Page } from "@playwright/test";

import { buildRouteManifest } from "../../scripts/generate-route-manifest";
import { crawlRoute } from "../e2e/crawler/crawlRoute";
import {
  R3_MAX_ACTIONS,
  R3_MAX_ACTIONS_PER_PAGE,
  R3_MAX_DURATION_MS,
  R3_MAX_PAGES,
  R3_SEED,
  SYNTH_BASE_URL,
  redact,
} from "./env";
import {
  assertNoDeniedRoute,
  classifyInput,
  decideAction,
  routeIsDenied,
  safePath,
  type CandidateAction,
} from "./policy";
import type { R3Failure, R3RunResult, R3VisitedRoute } from "./types";

const SETTLE_MS = 900;
const ACTION_TIMEOUT_MS = 5_000;
const FILL_TEXT = "She happy today.";
const SEARCH_TEXT = "english grammar";
const MAX_DISCOVERED_LINKS_PER_PAGE = 8;

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

function seededSort<T>(items: T[], seed: string, key: (item: T) => string): T[] {
  const score = (text: string) => {
    let h = 2166136261;
    for (const ch of `${seed}:${text}`) {
      h ^= ch.charCodeAt(0);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  };
  return [...items].sort((a, b) => score(key(a)) - score(key(b)));
}

function failure(type: R3Failure["type"], route: string, detail: string, action?: string): R3Failure {
  return {
    type,
    route,
    signature: `${type}:${normalizeRoute(route)}:${normalizeDetail(detail)}`,
    detail: redact(detail),
    ...(action ? { action } : {}),
  };
}

function normalizeRoute(route: string): string {
  return safePath(route).replace(/\?.*$/, "");
}

function normalizeDetail(detail: string): string {
  return detail.toLowerCase().replace(/\s+/g, " ").slice(0, 140);
}

function routeFailureType(type: R3Failure["type"], detail: string): R3Failure["type"] {
  if (/too many redirects|err_too_many_redirects|redirect loop/i.test(detail)) return "infinite-redirect";
  if (/navigation failed|timeout|net::err/i.test(detail)) return "unreachable-route";
  if (type === "network-failure" && /^\s*5\d\d\b/.test(detail)) return "failed-api-call";
  return type;
}

function isNonAsset(url: string): boolean {
  return !/\.(png|jpe?g|gif|webp|svg|ico|woff2?|css|map)(\?|$)/i.test(url);
}

function currentPath(page: Page): string {
  return safePath(page.url());
}

function bodyFingerprint(text: string): string {
  return text.replace(/\s+/g, " ").trim().slice(0, 600);
}

async function text(locator: Locator): Promise<string> {
  return (await locator.innerText({ timeout: 1_000 }).catch(() => ""))?.trim() ?? "";
}

async function attr(locator: Locator, name: string): Promise<string | null> {
  return locator.getAttribute(name, { timeout: 1_000 }).catch(() => null);
}

async function discoverSafeLinks(page: Page, baseURL: string, current: string): Promise<string[]> {
  const links = await page.locator("a[href]").evaluateAll((nodes) =>
    nodes.map((node) => ({
      text: (node.textContent ?? "").trim(),
      href: (node as HTMLAnchorElement).href,
    })),
  ).catch(() => []);
  const paths: string[] = [];
  for (const link of links) {
    if (!link.href) continue;
    const url = new URL(link.href, baseURL);
    if (url.origin !== new URL(baseURL).origin) continue;
    const path = safePath(url.toString());
    if (path === current || path.startsWith("/#")) continue;
    const decision = decideAction({ kind: "click", role: "link", route: current, label: link.text || path, href: path });
    if (!decision.allow) continue;
    paths.push(path);
  }
  return [...new Set(paths)].slice(0, MAX_DISCOVERED_LINKS_PER_PAGE);
}

async function clickSafeRole(
  page: Page,
  visited: R3VisitedRoute,
  role: "tab" | "menuitem",
): Promise<number> {
  const locators = await page.getByRole(role).all().catch(() => []);
  let actions = 0;
  for (const locator of locators.slice(0, R3_MAX_ACTIONS_PER_PAGE)) {
    const label = await text(locator);
    const decision = decideAction({ kind: "click", role, route: visited.path, label });
    if (!decision.allow) {
      if (decision.hardDeny) visited.failures.push(failure("denylist-violation", visited.path, decision.reason, label));
      continue;
    }
    const beforeUrl = currentPath(page);
    const beforeText = bodyFingerprint(await page.locator("body").innerText().catch(() => ""));
    await locator.click({ timeout: ACTION_TIMEOUT_MS }).catch((err) => {
      visited.failures.push(failure("dead-control", visited.path, `${role} click failed: ${(err as Error).message}`, label));
    });
    await page.waitForTimeout(SETTLE_MS);
    const afterUrl = currentPath(page);
    if (routeIsDenied(afterUrl)) {
      visited.failures.push(failure("denylist-violation", afterUrl, `safe ${role} navigated to denied route`, label));
    }
    const afterText = bodyFingerprint(await page.locator("body").innerText().catch(() => ""));
    if (beforeUrl === afterUrl && beforeText === afterText) {
      visited.failures.push(failure("dead-control", visited.path, `${role} had no observable effect`, label));
    }
    visited.actions.push(`${role}:${label || "(unlabeled)"}`);
    actions++;
  }
  return actions;
}

async function fillSafeInputs(page: Page, visited: R3VisitedRoute): Promise<number> {
  const fields = await page.locator("textarea, input[type='search'], input[role='searchbox'], input[type='text']").all().catch(() => []);
  let actions = 0;
  for (const field of fields.slice(0, R3_MAX_ACTIONS_PER_PAGE)) {
    const placeholder = (await attr(field, "placeholder")) ?? (await attr(field, "aria-label")) ?? "";
    const inputKind = classifyInput(placeholder, visited.path);
    const decision = decideAction({ kind: "fill-submit", route: visited.path, label: placeholder, inputKind });
    if (!decision.allow) {
      if (decision.hardDeny) visited.failures.push(failure("denylist-violation", visited.path, decision.reason, placeholder));
      continue;
    }
    const value = inputKind === "search" ? SEARCH_TEXT : FILL_TEXT;
    const beforeUrl = currentPath(page);
    const requestsBefore = visited.failures.length;
    await field.fill(value, { timeout: ACTION_TIMEOUT_MS }).catch((err) => {
      visited.failures.push(failure("dead-control", visited.path, `fill failed: ${(err as Error).message}`, placeholder));
    });
    await field.press("Enter", { timeout: ACTION_TIMEOUT_MS }).catch(() => undefined);
    await page.waitForTimeout(SETTLE_MS);
    const afterUrl = currentPath(page);
    if (routeIsDenied(afterUrl)) {
      visited.failures.push(failure("denylist-violation", afterUrl, "safe fill-submit navigated to denied route", placeholder));
    }
    if (beforeUrl === afterUrl && requestsBefore === visited.failures.length) {
      const body = await page.locator("body").innerText().catch(() => "");
      if (!new RegExp(value.split(" ")[0], "i").test(body)) {
        visited.failures.push(failure("dead-control", visited.path, `${inputKind} input had no observable effect`, placeholder));
      }
    }
    visited.actions.push(`fill-submit:${inputKind}:${placeholder || "(unlabeled)"}`);
    actions++;
  }
  return actions;
}

async function exploreActions(page: Page, baseURL: string, visited: R3VisitedRoute): Promise<string[]> {
  let actions = 0;
  actions += await clickSafeRole(page, visited, "tab");
  if (actions < R3_MAX_ACTIONS_PER_PAGE) actions += await clickSafeRole(page, visited, "menuitem");
  if (actions < R3_MAX_ACTIONS_PER_PAGE) actions += await fillSafeInputs(page, visited);
  return discoverSafeLinks(page, baseURL, visited.path);
}

export function hasDeployWindowFailure(failures: R3Failure[]): boolean {
  return failures.some((f) => DEPLOY_WINDOW_PATTERNS.some((pattern) => pattern.test(`${f.type} ${f.detail}`)));
}

export async function runR3Explorer(page: Page): Promise<R3RunResult> {
  const baseURL = SYNTH_BASE_URL;
  const manifest = buildRouteManifest();
  const skipped = manifest.routes
    .filter((route) => !route.crawl)
    .map((route) => ({ path: route.path, reason: route.skipReason ?? "not-crawlable" }));

  const manifestRoutes = manifest.routes
    .filter((route) => route.crawl && !routeIsDenied(route.path))
    .map((route) => ({ path: route.path, source: "route-manifest" }));
  const seedRoutes = ["/ai-tutor", "/roleplay", "/languages/thai-english"]
    .filter((path) => !routeIsDenied(path))
    .map((path) => ({ path, source: "seed" }));

  const queue = seededSort([...seedRoutes, ...manifestRoutes], R3_SEED, (item) => `${item.source}:${item.path}`);
  const queued = new Map<string, string>();
  for (const item of queue) if (!queued.has(item.path)) queued.set(item.path, item.source);

  const visited: R3VisitedRoute[] = [];
  const failures: R3Failure[] = [];
  const seen = new Set<string>();
  const start = Date.now();
  let actions = 0;

  page.on("pageerror", (err) => failures.push(failure("js-crash", currentPath(page), `pageerror: ${err.message}`)));
  page.on("console", (msg) => {
    if (msg.type() !== "error") return;
    failures.push(failure("console-error", currentPath(page), msg.text()));
  });
  page.on("response", (resp) => {
    const status = resp.status();
    if (status < 400 || !isNonAsset(resp.url())) return;
    failures.push(failure(status >= 500 ? "failed-api-call" : "network-failure", currentPath(page), `${status} ${resp.url()}`));
  });
  page.on("requestfailed", (req) => {
    if (isNonAsset(req.url())) failures.push(failure("network-failure", currentPath(page), `${req.failure()?.errorText ?? "request failed"} ${req.url()}`));
  });

  while (queued.size && visited.length < R3_MAX_PAGES && actions < R3_MAX_ACTIONS && Date.now() - start < R3_MAX_DURATION_MS) {
    const [path, source] = queued.entries().next().value as [string, string];
    queued.delete(path);
    if (seen.has(path)) continue;
    seen.add(path);
    assertNoDeniedRoute(path);

    const routeResult = await crawlRoute(page, baseURL, path, "public");
    const routeFailures = routeResult.failures.map((f) => failure(routeFailureType(f.type, f.detail), path, f.detail));
    if (/\/signin|\/login/.test(routeResult.landedOn) && !/\/signin|\/login/.test(path)) {
      routeFailures.push(failure("unreachable-route", path, `authenticated synthetic account landed on ${routeResult.landedOn}`));
    }

    const row: R3VisitedRoute = { path, source, actions: [], failures: routeFailures };
    visited.push(row);
    failures.push(...routeFailures);

    const beforeActionFailures = row.failures.length;
    const discovered = await exploreActions(page, baseURL, row);
    actions += row.actions.length;
    failures.push(...row.failures.slice(beforeActionFailures));
    for (const link of discovered) {
      if (!seen.has(link) && !queued.has(link) && !routeIsDenied(link)) queued.set(link, "live-link");
    }
  }

  return {
    ok: failures.length === 0,
    baseURL,
    ranAt: new Date().toISOString(),
    seed: R3_SEED,
    limits: {
      maxPages: R3_MAX_PAGES,
      maxActions: R3_MAX_ACTIONS,
      maxActionsPerPage: R3_MAX_ACTIONS_PER_PAGE,
      maxDurationMs: R3_MAX_DURATION_MS,
    },
    visited,
    failures,
    skipped,
  };
}
