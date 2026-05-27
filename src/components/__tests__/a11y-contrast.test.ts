/**
 * A11y contrast — static drift guard against the !64 audit's slate-400
 * sub-AA contrast finding. Started in !68 (P2 + W1, three files); this
 * file extends with each subsequent route-by-route sweep MR.
 *
 * Currently guarded surfaces:
 *
 *   Wave 0 (!68 — P2 + W1):
 *     - src/screens/Pricing.tsx
 *     - src/components/stage-3a/LocalWeaknessMap.tsx
 *     - src/components/stage-3b/SuggestedPracticeList.tsx
 *
 *   Wave 1 (!72 — Home / Account / AI-Tutor):
 *     - src/components/home/FocusAreasCard.tsx
 *     - src/components/home/FocusAreasMicroLessonDialog.tsx
 *     - src/components/ai-tutor/ConversationMode.tsx
 *     - src/components/ai-tutor/CorrectionMode.tsx
 *     - src/components/ai-tutor/TutorMemoryCard.tsx
 *     - src/pages/account/NotificationPreferences.tsx
 *
 *   Wave 2 (this MR — Progress / Billing / Listening):
 *     - src/pages/Progress.tsx
 *     - src/pages/Billing.tsx
 *     - src/pages/BillingSuccess.tsx
 *     - src/pages/BillingSuccessPage.tsx
 *     - src/components/pricing/IapPlanCard.tsx
 *     - src/pages/listening/Library.tsx
 *     - src/pages/listening/ClipPlayer.tsx
 *
 * Each guarded file must stay free of `text-slate-400` (bare class)
 * and `#94a3b8` (hex) literals. Three escape hatches let intentional
 * design pass:
 *
 *   - Variant prefixes (`disabled:`, `dark:`, `hover:`, etc.) on the
 *     Tailwind class — see VARIANT_PREFIX_RE.
 *   - `aria-hidden` lines — decorative graphics; WCAG 1.4.3 doesn't
 *     apply and 1.4.11 exempts decorative non-text.
 *   - Inline `// a11y-contrast:exception` marker on the SAME line as
 *     the literal — for one-off cases like `Progress.tsx`'s
 *     `scoreColor()` null branch where the color is used in a
 *     large-text or non-text context that already meets 3:1. Every
 *     marker MUST be paired with a rationale comment AND a citation
 *     in `docs/a11y/audit.md`.
 *
 * ─── Adding a file to the guard ────────────────────────────────────
 *
 *   1. Land the audit-aware fix (replace bare `text-slate-400` /
 *      `#94a3b8` with the WCAG-AA token chosen per location).
 *   2. Append the file path to `CONTRAST_FIXED_FILES` here.
 *   3. Tick the file off in `docs/a11y/audit.md` §"Color contrast —
 *      at-a-glance".
 *
 * The guard's job is to ensure that once a file is "audited + fixed",
 * it stays fixed against future regressions.
 */

import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, "../../../");

const CONTRAST_FIXED_FILES = [
  // Wave 0 — !68 audit P2 + W1
  "src/screens/Pricing.tsx",
  "src/components/stage-3a/LocalWeaknessMap.tsx",
  "src/components/stage-3b/SuggestedPracticeList.tsx",
  // Wave 1 — !72 (Home / Account / AI-Tutor)
  "src/components/home/FocusAreasCard.tsx",
  "src/components/home/FocusAreasMicroLessonDialog.tsx",
  "src/components/ai-tutor/ConversationMode.tsx",
  "src/components/ai-tutor/CorrectionMode.tsx",
  "src/components/ai-tutor/TutorMemoryCard.tsx",
  "src/pages/account/NotificationPreferences.tsx",
  // Wave 2 — this MR (Progress / Billing / Listening)
  "src/pages/Progress.tsx",
  "src/pages/Billing.tsx",
  "src/pages/BillingSuccess.tsx",
  "src/pages/BillingSuccessPage.tsx",
  "src/components/pricing/IapPlanCard.tsx",
  "src/pages/listening/Library.tsx",
  "src/pages/listening/ClipPlayer.tsx",
] as const;

/**
 * Variant-prefix forms (`disabled:`, `dark:`, `hover:`, `focus:`,
 * `group-hover:`, `peer-hover:`) carry their own contrast story:
 *
 *   - `disabled:text-slate-400` — WCAG SC 1.4.3 explicitly EXEMPTS
 *     inactive UI components from text-contrast requirements.
 *   - `dark:text-slate-400` — in dark mode this renders light-on-dark
 *     (slate-400 on slate-900 ≈ 5.7:1), which passes AA.
 *   - `hover:`/`focus:` — transient interactive state.
 *
 * A line matching any of these prefixes is NOT a contrast violation.
 */
const VARIANT_PREFIX_RE =
  /\b(disabled|dark|hover|focus|group-hover|group-focus|peer-hover|peer-focus):text-slate-400\b/;

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
 * marker is intentionally awkward so it never appears by accident —
 * every use SHOULD be paired with:
 *   - a multi-line rationale comment immediately above the line,
 *     explaining which WCAG threshold the color actually meets, and
 *   - a citation in `docs/a11y/audit.md` so reviewers can confirm
 *     the exception was audited.
 */
const EXCEPTION_MARKER_RE = /a11y-contrast:exception/;

/**
 * Per-file line exceptions for intentional design decisions that
 * survived the audit-aware fix. Each entry must point to a real
 * line in the file AND have a documented rationale in the audit
 * doc. Use sparingly — every entry is debt against future drift
 * detection.
 *
 * (None as of this MR — all Wave-1 exceptions live in files outside
 * CONTRAST_FIXED_FILES today: Home.tsx aria-hidden chevron at
 * src/pages/Home.tsx:1125, AccountPage.tsx ▾ chevrons at
 * src/pages/AccountPage.tsx:767/785/801/814, WeeklyProgressWidget
 * null-state large-text score color at line 53. Documented in
 * `docs/a11y/audit.md` §"Color contrast — at-a-glance".)
 */
const LINE_EXCEPTIONS: ReadonlyMap<string, ReadonlySet<number>> = new Map();

function shouldSkipLine(line: string): boolean {
  if (VARIANT_PREFIX_RE.test(line)) return true;
  if (ARIA_HIDDEN_RE.test(line)) return true;
  if (EXCEPTION_MARKER_RE.test(line)) return true;
  return false;
}

function offendersInFile(
  rel: string,
  pattern: RegExp,
): { file: string; line: number; text: string }[] {
  const content = readFileSync(resolve(REPO_ROOT, rel), "utf8");
  const exempt = LINE_EXCEPTIONS.get(rel) ?? new Set<number>();
  const offenders: { file: string; line: number; text: string }[] = [];
  content.split("\n").forEach((line, i) => {
    if (!pattern.test(line)) return;
    if (shouldSkipLine(line)) return;
    if (exempt.has(i + 1)) return;
    offenders.push({ file: rel, line: i + 1, text: line.trim() });
  });
  return offenders;
}

describe("a11y contrast — !64 audit fixes stay fixed across each route wave", () => {
  it("no audit-fixed file contains a bare `text-slate-400` class", () => {
    const offenders = CONTRAST_FIXED_FILES.flatMap((f) =>
      offendersInFile(f, /\btext-slate-400\b/),
    );
    expect(
      offenders,
      `Failing slate-400 class re-introduced in an audit-fixed file. Use text-slate-500 (4.78:1 on white) or text-slate-600 (7.04:1) instead:\n${offenders
        .map((o) => `  ${o.file}:${o.line}  ${o.text}`)
        .join("\n")}`,
    ).toEqual([]);
  });

  it("no audit-fixed file contains the failing hex literal `#94a3b8`", () => {
    const offenders = CONTRAST_FIXED_FILES.flatMap((f) =>
      offendersInFile(f, /#94a3b8\b/i),
    );
    expect(
      offenders,
      `Failing slate-400 hex (#94a3b8) re-introduced in an audit-fixed file. Use #64748b (slate-500, 4.78:1 on white) or #475569 (slate-600, 7.04:1) instead:\n${offenders
        .map((o) => `  ${o.file}:${o.line}  ${o.text}`)
        .join("\n")}`,
    ).toEqual([]);
  });
});
