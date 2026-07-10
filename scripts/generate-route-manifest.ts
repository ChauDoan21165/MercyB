/**
 * Route-manifest generator for the Tier-1 app-test crawler (SL-001).
 *
 * WHY: the app has no exported route table — routes are a ~200-entry JSX
 * <Routes> tree in src/router/AppRouter.tsx (see
 * src/router/__tests__/publicRouteRegistration.test.tsx, which documents that
 * "reading the source is the only non-render way to verify the wiring"). This
 * script statically parses that file so the crawler covers EVERY registered
 * route automatically — a new <Route> is picked up with no new crawler code.
 *
 * It classifies each route (public / auth / admin / redirect / dev / flag),
 * resolves representative params where a dependency-free fixture exists
 * (:roomId from public/data/*.json), and marks the rest un-crawlable with an
 * explicit reason (never silently dropped). Output:
 *   tests/e2e/generated/route-manifest.json
 *
 * Run:  npx tsx scripts/generate-route-manifest.ts
 * Import: buildRouteManifest() (the crawler's globalSetup calls this so the
 *         manifest is always current at crawl time).
 */
import { readdirSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const ROUTER_SRC = resolve(REPO_ROOT, "src/router/AppRouter.tsx");
const OUT_FILE = resolve(REPO_ROOT, "tests/e2e/generated/route-manifest.json");

export type RouteKind = "public" | "auth" | "admin" | "redirect" | "dev" | "flag" | "catchall";

export interface RouteEntry {
  /** Concrete, crawlable URL path (params substituted). */
  path: string;
  /** The raw literal from AppRouter.tsx (may contain :params). */
  raw: string;
  kind: RouteKind;
  /** Whether the crawler should visit it. */
  crawl: boolean;
  /** Why it is not crawled, when crawl === false. */
  skipReason?: string;
}

export interface RouteManifest {
  generatedFrom: string;
  routeCount: number;
  crawlableCount: number;
  skipped: { reason: string; count: number }[];
  routes: RouteEntry[];
}

// Curated public prefixes/paths a logged-out visitor can reach. Mirrors the
// vetted list in publicRouteRegistration.test.tsx, widened to the anon SEO/
// content surfaces. Anything not matched here is tagged "auth" — the crawler
// then classifies it definitively at runtime (a redirect to /signin ⇒ gated,
// not a failure), which is more robust than guessing wrappers from source.
const PUBLIC_EXACT = new Set([
  "/", "/privacy", "/terms", "/support", "/pricing", "/rooms", "/blog",
  "/signin", "/signup", "/onboarding",
]);
const PUBLIC_PREFIXES = [
  "/legal/", "/seo/", "/languages", "/professions", "/exam", "/exam-prep/",
  "/blog/", "/culture/", "/stories", "/cert/", "/rooms/", "/room/",
];
const REDIRECT_PATHS = new Set(["/login", "/upgrade", "/redeem"]);

function classify(path: string): RouteKind {
  if (path === "*") return "catchall";
  if (path.startsWith("/admin")) return "admin";
  if (path.startsWith("/dev/") || path.startsWith("/__")) return "dev";
  if (path === "/review" || path.startsWith("/review/")) return "flag";
  if (REDIRECT_PATHS.has(path)) return "redirect";
  if (PUBLIC_EXACT.has(path)) return "public";
  if (PUBLIC_PREFIXES.some((p) => path.startsWith(p))) return "public";
  return "auth";
}

/** A few real room ids (JSON filenames under public/data) to exercise the
 * high-traffic /:roomId surface without importing the app. Sampled, not
 * exhaustive — the cap is reported, never silent. */
function sampleRoomIds(limit = 3): string[] {
  try {
    return readdirSync(resolve(REPO_ROOT, "public/data"))
      .filter((f) => f.endsWith(".json") && !f.startsWith("manifest") && !f.startsWith("version"))
      .slice(0, limit)
      .map((f) => f.replace(/\.json$/, ""));
  } catch {
    return [];
  }
}

/** Resolve :params to a concrete path, or report the gap when no dependency-free
 * fixture exists. v1 resolves only :roomId (from public/data); every other
 * param is surfaced as an explicit "unresolvable-param" skip, never dropped. */
function resolveParams(raw: string, rooms: string[]): { path: string } | { skip: string } {
  const params = raw.match(/:[A-Za-z]+/g) ?? [];
  if (params.length === 0) return { path: raw };
  if (params.length === 1 && params[0] === ":roomId") {
    if (!rooms.length) return { skip: "no-room-fixture" };
    return { path: raw.replace(":roomId", rooms[0]) };
  }
  const unresolved = params.find((p) => p !== ":roomId") ?? params[0];
  return { skip: `unresolvable-param:${unresolved}` };
}

export function buildRouteManifest(): RouteManifest {
  const src = readFileSync(ROUTER_SRC, "utf8");
  const lines = src.split("\n");

  // The /admin/* subtree (from `path="/admin/*"` to its own catch-all) holds
  // RELATIVE child paths; join them under /admin/ so they become real URLs.
  const adminStart = lines.findIndex((l) => /path="\/admin\/\*"/.test(l));
  const adminEnd = adminStart >= 0
    ? adminStart + 1 + lines.slice(adminStart + 1).findIndex((l) => /path="\*"/.test(l))
    : -1;

  const rooms = sampleRoomIds();
  const seen = new Set<string>();
  const routes: RouteEntry[] = [];

  lines.forEach((line, i) => {
    const m = line.match(/path=["']([^"']*)["']/);
    if (!m) return;
    let raw = m[1];
    const inAdmin = adminStart >= 0 && i > adminStart && i < adminEnd;

    // Join relative admin children under /admin/. (The parent /admin/* itself
    // and the two catch-alls are handled below.)
    if (inAdmin && !raw.startsWith("/") && raw !== "*") {
      raw = `/admin/${raw}`;
    }
    if (raw === "/admin/*") raw = "/admin"; // crawl the dashboard root

    const kind = classify(raw);
    if (kind === "catchall") return; // "*" is the 404 fallback, not a page

    const resolved = resolveParams(raw, rooms);
    let path = raw;
    let crawl = true;
    let skipReason: string | undefined;

    if ("skip" in resolved) {
      crawl = false;
      skipReason = resolved.skip;
    } else {
      path = resolved.path;
    }
    if (kind === "redirect") { crawl = false; skipReason = "redirect"; }
    if (kind === "dev") { crawl = false; skipReason = "dev-only"; }
    if (kind === "flag") { crawl = false; skipReason = "feature-flag-gated"; }

    const dedupeKey = `${path}|${kind}`;
    if (seen.has(dedupeKey)) return;
    seen.add(dedupeKey);
    routes.push({ path, raw, kind, crawl, ...(skipReason ? { skipReason } : {}) });
  });

  routes.sort((a, b) => a.path.localeCompare(b.path));

  const skippedBy = new Map<string, number>();
  for (const r of routes) {
    if (!r.crawl && r.skipReason) skippedBy.set(r.skipReason, (skippedBy.get(r.skipReason) ?? 0) + 1);
  }

  return {
    generatedFrom: "src/router/AppRouter.tsx",
    routeCount: routes.length,
    crawlableCount: routes.filter((r) => r.crawl).length,
    skipped: [...skippedBy.entries()].map(([reason, count]) => ({ reason, count })),
    routes,
  };
}

export function writeRouteManifest(): RouteManifest {
  const manifest = buildRouteManifest();
  mkdirSync(dirname(OUT_FILE), { recursive: true });
  writeFileSync(OUT_FILE, JSON.stringify(manifest, null, 2) + "\n", "utf8");
  return manifest;
}

// Run directly: write the snapshot and print a summary.
if (import.meta.url === `file://${process.argv[1]}`) {
  const m = writeRouteManifest();
  console.log(
    `[route-manifest] ${m.routeCount} routes (${m.crawlableCount} crawlable) → ${OUT_FILE}`,
  );
  for (const s of m.skipped) console.log(`  skipped ${s.count}× ${s.reason}`);
}
