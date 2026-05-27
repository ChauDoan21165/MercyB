/**
 * Monitoring invariant guards. **Static drift surface.**
 *
 * The Sentry-facing observability code in `src/lib/monitoring/` is
 * where a single careless change can leak PII to an external service,
 * silently drop signal during a real outage, or wipe out the cohort
 * tagging that the alert rules pivot on. The four guards below are
 * the smallest set that catches a class of regression the unit tests
 * for individual helpers don't: each one would compile and ship green
 * but silently degrade observability.
 *
 * Companion to `docs/observability/perf-instrumentation.md` (the
 * breadcrumb catalog from !45) and
 * `docs/architecture/systems/observability.md` §5 (the "never" list).
 *
 * ─── Adding a new monitoring invariant ─────────────────────────────
 *
 * Add it here if it's an observability invariant — something that
 * holds across `src/lib/monitoring/` and the wider feature code it
 * is consumed from. Add it to a feature-local invariants file if
 * the contract is narrower (e.g. "Stage 3A never writes
 * localStorage"). The "never" list in `observability.md` §5 is the
 * canonical menu of candidate guards.
 *
 * Implementation modes:
 *   - Source-text greps over `src/lib/monitoring/*.ts` + a list of
 *     consumer files for the captureError / captureMessage call-site
 *     guards. The `stripJsComments` helper (mirrored from the Stage
 *     3A invariants pattern) keeps invariant-documenting prose at
 *     the top of each monitoring file from being misread.
 */

import { readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, "../../../../");
const MONITORING_DIR = resolve(REPO_ROOT, "src/lib/monitoring");
const SRC_ROOT = resolve(REPO_ROOT, "src");

function stripJsComments(text: string): string {
  const withoutBlocks = text.replace(/\/\*[\s\S]*?\*\//g, "");
  const withoutLines = withoutBlocks.replace(/(^|[^:])\/\/.*$/gm, "$1");
  return withoutLines;
}

function readMonitoringSource(): { file: string; code: string }[] {
  return readdirSync(MONITORING_DIR)
    .filter((f) => /\.ts$/.test(f))
    .map((f) => ({
      file: f,
      code: stripJsComments(readFileSync(join(MONITORING_DIR, f), "utf8")),
    }));
}

// Walk `src/` recursively skipping `__tests__` dirs + `*.test.{ts,tsx}`
// files. Used by the captureError / captureException call-site guards
// — both need to span the whole feature surface, not just monitoring.
function walkSrcSourceFiles(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    if (entry === "__tests__" || entry === "node_modules") continue;
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      walkSrcSourceFiles(full, out);
      continue;
    }
    if (!stat.isFile()) continue;
    if (!/\.(ts|tsx)$/.test(entry)) continue;
    if (/\.test\.(ts|tsx)$/.test(entry)) continue;
    out.push(full);
  }
  return out;
}

/** Count argument count of a call expression by walking balanced parens
 * from the position immediately after the opening `(`. Multi-line OK.
 * Returns 0 for an empty arg list, 1+ otherwise. */
function callArgCount(content: string, callStart: number): number {
  let depth = 1;
  let commas = 0;
  let i = callStart;
  let sawNonWhitespace = false;
  while (i < content.length && depth > 0) {
    const ch = content[i]!;
    if (ch === "(") depth++;
    else if (ch === ")") depth--;
    else if (ch === "," && depth === 1) commas++;
    else if (depth > 0 && ch.trim().length > 0) sawNonWhitespace = true;
    i++;
  }
  if (!sawNonWhitespace) return 0;
  return commas + 1;
}

// ══════════════════════════════════════════════════════════════════════
// Guard 1 — no PII key names in `addBreadcrumb` data literals
//
// `data: { … }` fields on breadcrumbs are forwarded to Sentry, where
// `beforeSend` + `scrubBreadcrumb` strip PII from string values. The
// SAFER posture: never put a PII-shaped KEY in the data block to
// begin with. The doc's §5a explicitly forbids `email` / `phone` /
// `username` on tags, and the same shape on breadcrumbs is just as
// bad — the brief calls out `user_id` and `session_id` as the two
// id shapes that should not appear (use coarse cohort tags instead).
// ══════════════════════════════════════════════════════════════════════

const PII_KEY_PATTERNS = [
  /\bemail\s*:/,
  /\bphone\s*:/,
  /\busername\s*:/,
  /\bpassword\s*:/,
  /\buser_id\s*:/,
  /\bsession_id\s*:/,
] as const;

describe("Monitoring — addBreadcrumb data literals carry no PII keys", () => {
  it("no inline `data: { … pii_key: … }` block names a PII key", () => {
    const offenders: string[] = [];
    for (const file of walkSrcSourceFiles(SRC_ROOT)) {
      const code = stripJsComments(readFileSync(file, "utf8"));
      // Find every `addBreadcrumb(` call site; inspect its body up to
      // the matching `)` for `data: { … }` blocks containing a PII
      // key. Multi-line tolerant.
      const re = /addBreadcrumb\s*\(/g;
      let m: RegExpExecArray | null;
      while ((m = re.exec(code)) !== null) {
        const start = m.index + m[0].length;
        let depth = 1;
        let i = start;
        while (i < code.length && depth > 0) {
          const ch = code[i]!;
          if (ch === "(") depth++;
          else if (ch === ")") depth--;
          i++;
        }
        const body = code.substring(start, i - 1);
        // Locate the `data:` field and scan within its braces only.
        const dataMatch = /\bdata\s*:\s*\{/.exec(body);
        if (!dataMatch) continue;
        const dataStart = dataMatch.index + dataMatch[0].length;
        let dDepth = 1;
        let j = dataStart;
        while (j < body.length && dDepth > 0) {
          const ch = body[j]!;
          if (ch === "{") dDepth++;
          else if (ch === "}") dDepth--;
          j++;
        }
        const dataBlock = body.substring(dataStart, j - 1);
        for (const pat of PII_KEY_PATTERNS) {
          if (pat.test(dataBlock)) {
            offenders.push(
              `${file}: addBreadcrumb data block names PII key matching ${pat}`,
            );
          }
        }
      }
    }
    expect(
      offenders,
      `PII key names leaked into addBreadcrumb data literals:\n${offenders.join("\n")}`,
    ).toEqual([]);
  });
});

// ══════════════════════════════════════════════════════════════════════
// Guard 2 — every breadcrumb category literal in monitoring code is
//          documented in the !45 catalog
//
// Companion to `breadcrumb-catalog.test.ts` (the full-source drift
// guard from !45). This narrower variant scopes the check to
// `src/lib/monitoring/` so a typo in a typed helper (e.g. accidental
// "mercy.pannel") fails this file BEFORE the broader catalog test
// adjusts. Tightly-localized failure → faster signal.
// ══════════════════════════════════════════════════════════════════════

const DOCUMENTED_CATEGORIES = new Set<string>([
  "navigation",
  "security.mfa",
  "mercy.panel",
  "mercy.feedback",
  "speak.attempt",
  "web-vital",
  "stage3a.perf.aggregator",
  "stage3a.perf.ui_mount",
  "stage3b.perf.engine",
  "stage3b.perf.ui_mount",
  "route.perf.mount",
]);

describe("Monitoring — breadcrumb categories come from the documented catalog", () => {
  it("every `category: \"…\"` literal in src/lib/monitoring/ is in the catalog", () => {
    const undocumented: { file: string; category: string }[] = [];
    for (const { file, code } of readMonitoringSource()) {
      for (const m of code.matchAll(/category:\s*["']([^"'\n]+)["']/g)) {
        const cat = m[1]!;
        if (!DOCUMENTED_CATEGORIES.has(cat)) {
          undocumented.push({ file, category: cat });
        }
      }
    }
    expect(
      undocumented,
      `Monitoring code emits undocumented breadcrumb category — add it to docs/observability/perf-instrumentation.md and the !45 catalog drift test:\n${undocumented
        .map((o) => `  ${o.file}: ${o.category}`)
        .join("\n")}`,
    ).toEqual([]);
  });
});

// ══════════════════════════════════════════════════════════════════════
// Guard 3 — no `console.log(` in monitoring code
//
// Monitoring code routes signal through `addBreadcrumb` /
// `captureError` / `captureMessage` — the only paths that respect the
// PII scrub, the gated init, and the test-mode no-op. A stray
// `console.log` bypasses all three and would be invisible to ops.
// `console.info` / `warn` / `error` ARE permitted for boot-path
// diagnostics (e.g. `sentryInit.ts`'s one-line init banner) where the
// signal predates Sentry's own readiness.
// ══════════════════════════════════════════════════════════════════════

describe("Monitoring — no console.log in monitoring code", () => {
  it("no monitoring source file calls console.log(", () => {
    const offenders: string[] = [];
    for (const { file, code } of readMonitoringSource()) {
      if (/\bconsole\.log\s*\(/.test(code)) {
        offenders.push(`${file}: contains console.log(`);
      }
    }
    expect(
      offenders,
      `Monitoring code uses console.log — route through addBreadcrumb / captureError / captureMessage instead:\n${offenders.join("\n")}`,
    ).toEqual([]);
  });
});

// ══════════════════════════════════════════════════════════════════════
// Guard 4 — captureException is only invoked from captureException.ts,
//           and every capture call carries a context block
//
// The doc §5b: "Always go through captureError / captureMessage /
// etc. Never call Sentry.captureException directly." `captureError`
// is the wrapper that handles the boot-buffer queue, the PII scrub,
// and the activation trigger. Bare `captureException(e)` skips all
// three. The two `sdk.captureException(…)` call sites inside
// `captureException.ts` itself ARE the wrapper — they're allowed,
// and each already passes a `{ extra: safeContext }` block.
// ══════════════════════════════════════════════════════════════════════

const CAPTURE_EXCEPTION_OWNER = "src/lib/monitoring/captureException.ts";

describe("Monitoring — captureException is only invoked from the wrapper file", () => {
  it("no feature code calls captureException directly — use captureError instead", () => {
    const offenders: string[] = [];
    for (const file of walkSrcSourceFiles(SRC_ROOT)) {
      const rel = file.substring(REPO_ROOT.length + 1);
      if (rel === CAPTURE_EXCEPTION_OWNER) continue;
      const code = stripJsComments(readFileSync(file, "utf8"));
      // Match `captureException(` as a call. Import statements and
      // type references never have an opening paren right after the
      // identifier — they have `}`, `,`, or whitespace — so this
      // regex is import-safe.
      const re = /\bcaptureException\s*\(/g;
      let m: RegExpExecArray | null;
      while ((m = re.exec(code)) !== null) {
        offenders.push(`${rel}: calls captureException directly (use captureError)`);
      }
    }
    expect(
      offenders,
      `captureException called outside the wrapper:\n${offenders.join("\n")}`,
    ).toEqual([]);
  });

  it("the two captureException invocations inside the wrapper each pass a context block", () => {
    const text = readFileSync(resolve(REPO_ROOT, CAPTURE_EXCEPTION_OWNER), "utf8");
    const code = stripJsComments(text);
    const re = /\bcaptureException\s*\(/g;
    let m: RegExpExecArray | null;
    let inspected = 0;
    while ((m = re.exec(code)) !== null) {
      // Skip the function declaration `export function captureException(`
      // if present (callArgCount on the declaration's body would still
      // return ≥ 2 from the type-annotated args, but we filter for
      // clarity).
      const before = code.substring(Math.max(0, m.index - 40), m.index);
      if (/\bfunction\s+$/.test(before)) continue;
      inspected += 1;
      const argCount = callArgCount(code, m.index + m[0].length);
      expect(
        argCount,
        `captureException call site at offset ${m.index} in ${CAPTURE_EXCEPTION_OWNER} has only ${argCount} arg(s) — must pass an extra context block`,
      ).toBeGreaterThanOrEqual(2);
    }
    expect(
      inspected,
      "expected at least one sdk.captureException(...) call inside the wrapper",
    ).toBeGreaterThanOrEqual(1);
  });
});

describe("Monitoring — every captureError call site passes a context block", () => {
  it("no feature code calls captureError(error) without a 2nd context arg", () => {
    const offenders: string[] = [];
    for (const file of walkSrcSourceFiles(SRC_ROOT)) {
      const rel = file.substring(REPO_ROOT.length + 1);
      if (rel === CAPTURE_EXCEPTION_OWNER) continue;
      const code = stripJsComments(readFileSync(file, "utf8"));
      const re = /\bcaptureError\s*\(/g;
      let m: RegExpExecArray | null;
      while ((m = re.exec(code)) !== null) {
        const before = code.substring(Math.max(0, m.index - 40), m.index);
        // Skip function declarations / type signatures (none expected
        // outside the wrapper, but defensive).
        if (/\bfunction\s+$/.test(before)) continue;
        const argCount = callArgCount(code, m.index + m[0].length);
        if (argCount < 2) {
          offenders.push(
            `${rel}: captureError call site at offset ${m.index} has ${argCount} arg(s) — must pass a context block`,
          );
        }
      }
    }
    expect(
      offenders,
      `Bare captureError(error) calls (missing context block):\n${offenders.join("\n")}`,
    ).toEqual([]);
  });
});
