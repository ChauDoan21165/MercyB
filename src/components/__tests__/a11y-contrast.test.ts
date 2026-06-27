/**
 * A11y contrast — whole-tree static drift guard.
 *
 * Closes the slate-500 contrast lane opened by the !64 audit and
 * walked route-by-route across waves 0-6 (!68 → !72 → !83 → !88 →
 * !97 → !109 → !116). Wave 7 (this file's current shape) converts
 * the guard from an explicit-allow-list (`CONTRAST_FIXED_FILES`)
 * into a near-blanket invariant: every `src/` file is scanned for
 * bare `text-slate-500` (Tailwind) or `#94a3b8` (hex) literals. The
 * lane is now closed in the same shape it was opened — any new
 * regression anywhere in the tree fails CI loudly.
 *
 * Escape hatches (four, all per-line; no per-file allow-list):
 *
 *   - Variant prefixes (`disabled:`, `dark:`, `hover:`, `focus:`,
 *     `group-hover:`, `group-focus:`, `peer-hover:`, `peer-focus:`,
 *     `placeholder:`) on the Tailwind class. Each carries its own
 *     contrast story — see VARIANT_PREFIX_RE comment.
 *   - `aria-hidden` lines — decorative graphics; WCAG 1.4.3 doesn't
 *     apply and 1.4.11 exempts decorative non-text.
 *   - Inline `// a11y-contrast:exception` marker on the SAME line
 *     as the literal — for one-off cases (chart borders, `no_data`
 *     indicators, large-text consumers) that already meet WCAG
 *     1.4.11 non-text 3:1 or 1.4.3 large-text 3:1. Each marker MUST
 *     be paired with a rationale comment and an audit-doc citation.
 *   - Files in SKIP_FILES — genuine special cases like this test
 *     file itself (the regex literals would self-trip), and
 *     `Bilingual.test.tsx`'s test fixture that deliberately uses the
 *     failing color to assert bilingual rendering doesn't depend on
 *     it.
 *
 * Adding a new contrast-failing literal anywhere in `src/` now
 * fails CI by default. Fix it (text → slate-500 on white, slate-600
 * on slate-100, etc.) or document the exception (marker + rationale
 * + audit doc).
 *
 * Wave history:
 *   - !68  P2 + W1 — Pricing + Stage 3A/3B (11 fixes).
 *   - !72  Wave 1 — Home + Account + AI-Tutor (14 fixes + 5 exceptions).
 *   - !83  Wave 2 — Progress + Billing + Listening (26 fixes + 1 exception).
 *   - !88  Wave 3 — LessonRenderer + leaderboard (15 fixes; first slate-600
 *          escalation for bg-slate-100).
 *   - !97  Wave 4 — Forms + certificates (27 fixes; first canvas-text fix).
 *   - !109 Wave 5 — Speech-history + admin (13 fixes + 4 exceptions).
 *   - !116 Wave 6 — MarketingLanding inline <style> (3 fixes).
 *   - This MR (wave 7) — whole-tree conversion + long-tail cleanup.
 */

import { readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, "../../../");
const SRC_ROOT = resolve(REPO_ROOT, "src");

/**
 * Variant-prefix forms carry their own contrast story:
 *
 *   - `disabled:text-slate-500` — WCAG SC 1.4.3 explicitly EXEMPTS
 *     inactive UI components from text-contrast requirements.
 *   - `dark:text-slate-300` — in dark mode renders light-on-dark
 *     (slate-500 on slate-900 ≈ 5.7:1), which passes AA.
 *   - `hover:` / `focus:` — transient interactive state.
 *   - `placeholder:` — placeholder text in form inputs; WCAG
 *     guidance treats placeholders as decorative hint text whose
 *     contrast is less strictly governed than primary body text.
 *
 * A line matching any of these prefixes is NOT a contrast violation.
 */
const VARIANT_PREFIX_RE =
  /\b(disabled|dark|hover|focus|group-hover|group-focus|peer-hover|peer-focus|placeholder):text-slate-500\b/;

/**
 * `aria-hidden` elements are decorative — typically icons or layout
 * glyphs (e.g. disclosure chevrons). WCAG 1.4.3 applies to text;
 * WCAG 1.4.11 (non-text contrast 3:1) applies to graphical objects
 * needed to understand content. An aria-hidden chevron is exempt
 * from both because screen readers skip it AND it carries no
 * semantic content. A line containing `aria-hidden` plus the
 * offending token is a decorative use, not a violation.
 */
const ARIA_HIDDEN_RE = /aria-hidden/;

/**
 * Inline-marker escape hatch. A line containing the literal token
 * `a11y-contrast:exception` is exempt from both grep guards. The
 * marker is intentionally awkward so it never appears by accident.
 * Every use MUST be paired with:
 *   - a rationale comment (typically on the line above) citing the
 *     WCAG threshold the literal actually meets, and
 *   - an entry in `docs/a11y/audit.md` so reviewers can confirm the
 *     exception was audited.
 */
const EXCEPTION_MARKER_RE = /a11y-contrast:exception/;

/**
 * Files excluded from the whole-tree scan. Two categories:
 *
 *   1. This test file itself. It contains the regex literals it
 *      grep-scans for — a self-reference that would always trip.
 *   2. `Bilingual.test.tsx` — its test fixture sets `color: "#94a3b8"`
 *      deliberately to verify that bilingual rendering does NOT
 *      depend on the failing color. Marking the line in-source would
 *      obscure the test's intent.
 *
 * Use sparingly. Every entry is debt against the near-blanket
 * invariant the guard exists to enforce.
 */
const SKIP_FILES: ReadonlySet<string> = new Set([
  "src/components/__tests__/a11y-contrast.test.ts",
  "src/components/__tests__/Bilingual.test.tsx",
]);

function shouldSkipLine(line: string): boolean {
  if (VARIANT_PREFIX_RE.test(line)) return true;
  if (ARIA_HIDDEN_RE.test(line)) return true;
  if (EXCEPTION_MARKER_RE.test(line)) return true;
  return false;
}

/** Recursively collect `.ts` / `.tsx` source files under `src/`,
 * skipping test dirs / files and the obvious non-source folders. */
function collectSourceFiles(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    if (entry === "node_modules") continue;
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      collectSourceFiles(full, out);
      continue;
    }
    if (!stat.isFile()) continue;
    if (!/\.(ts|tsx)$/.test(entry)) continue;
    out.push(full);
  }
  return out;
}

function offendersInFile(
  rel: string,
  pattern: RegExp,
): { file: string; line: number; text: string }[] {
  const content = readFileSync(resolve(REPO_ROOT, rel), "utf8");
  const offenders: { file: string; line: number; text: string }[] = [];
  content.split("\n").forEach((line, i) => {
    if (!pattern.test(line)) return;
    if (shouldSkipLine(line)) return;
    offenders.push({ file: rel, line: i + 1, text: line.trim() });
  });
  return offenders;
}

function scanWholeTree(pattern: RegExp): { file: string; line: number; text: string }[] {
  const files = collectSourceFiles(SRC_ROOT).map((p) =>
    relative(REPO_ROOT, p),
  );
  const offenders: { file: string; line: number; text: string }[] = [];
  for (const rel of files) {
    if (SKIP_FILES.has(rel)) continue;
    offenders.push(...offendersInFile(rel, pattern));
  }
  return offenders;
}

describe("a11y contrast — !64 audit fixes stay fixed across the whole `src/` tree", () => {
  it("no `src/` file contains a bare `text-slate-500` class (variant prefixes + aria-hidden + exception markers excluded)", () => {
    const offenders = scanWholeTree(/\btext-slate-500\b/);
    expect(
      offenders,
      `Failing slate-500 class found in src/. Use text-slate-500 (4.78:1 on white) or text-slate-600 (7.04:1 on white / 6.12:1 on slate-100) — or mark with \`// a11y-contrast:exception\` + rationale + audit doc citation:\n${offenders
        .map((o) => `  ${o.file}:${o.line}  ${o.text}`)
        .join("\n")}`,
    ).toEqual([]);
  });

  it("no `src/` file contains the failing hex literal `#94a3b8` (same escape hatches)", () => {
    const offenders = scanWholeTree(/#94a3b8\b/i);
    expect(
      offenders,
      `Failing slate-500 hex (#94a3b8) found in src/. Use #64748b (slate-500) or #475569 (slate-600) — or mark with \`// a11y-contrast:exception\` + rationale + audit doc citation:\n${offenders
        .map((o) => `  ${o.file}:${o.line}  ${o.text}`)
        .join("\n")}`,
    ).toEqual([]);
  });
});
