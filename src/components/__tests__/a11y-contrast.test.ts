/**
 * A11y contrast — static drift guard against the !64 audit's P2 + W1
 * contrast findings (slate-400 / #94a3b8 sub-AA on white).
 *
 * The audit (`docs/a11y/audit.md`) names exactly 11 locations where
 * the muted-text token failed WCAG AA 4.5:1:
 *
 *   - Pricing.tsx — 8 inline `color: "#94a3b8"` declarations
 *     (lines 119, 477, 501, 516, 646, 653, 675, 824)
 *   - LocalWeaknessMap.tsx — 2 `text-slate-400` class usages
 *     (lines 307, 349)
 *   - SuggestedPracticeList.tsx — 1 `text-slate-400` class usage
 *     (line 173)
 *
 * This MR fixed all 11 by switching to `#64748b` (slate-500), measured
 * 4.78:1 on white. The test below pins those three files at zero
 * occurrences of the failing token so a future contributor cannot
 * accidentally re-introduce the failing color in any of them.
 *
 * Deliberately scoped. The codebase has ~170 other bare
 * `text-slate-400` usages outside the audit's 5 audited routes
 * (Home / weak-at / onboarding / pricing / placement). Those need
 * their own route-by-route audit per the !64 methodology before
 * being changed; they are documented in the MR description as a
 * follow-up sweep, not silently dragged into this fix.
 *
 * ─── Adding a new file to the contrast guard ──────────────────────
 *
 * When a future a11y MR fixes the contrast of additional files (e.g.
 * a follow-up sweep of Home, Account, AI-Tutor surfaces), append the
 * file path to `CONTRAST_FIXED_FILES` here AND tick the same file off
 * in `docs/a11y/audit.md`. The guard's job is to ensure that once a
 * file is "audited + fixed", it stays fixed.
 */

import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, "../../../");

/**
 * Files where the !64 audit's contrast finding was fixed in MR
 * fix/a11y-text-slate-400-contrast. Each of these must stay free of
 * `text-slate-400` (bare class) and `#94a3b8` (hex) literals.
 *
 * Variant prefixes (`dark:text-slate-400`, `disabled:text-slate-400`)
 * are NOT contrast offenders in the audited contexts — dark-mode
 * tokens render light-on-dark with passing contrast, and disabled
 * controls are WCAG-exempt per SC 1.4.3. None of the three files in
 * this list use those variants today; if a future contributor
 * introduces one it'll need its own a11y review before being
 * exempted.
 */
const CONTRAST_FIXED_FILES = [
  "src/screens/Pricing.tsx",
  "src/components/stage-3a/LocalWeaknessMap.tsx",
  "src/components/stage-3b/SuggestedPracticeList.tsx",
] as const;

describe("a11y contrast — !64 audit P2 + W1 stays fixed", () => {
  it("no audit-fixed file contains the failing Tailwind class `text-slate-400`", () => {
    const offenders: { file: string; line: number; text: string }[] = [];
    for (const rel of CONTRAST_FIXED_FILES) {
      const content = readFileSync(resolve(REPO_ROOT, rel), "utf8");
      const lines = content.split("\n");
      lines.forEach((line, i) => {
        if (/\btext-slate-400\b/.test(line)) {
          offenders.push({ file: rel, line: i + 1, text: line.trim() });
        }
      });
    }
    expect(
      offenders,
      `Failing slate-400 class re-introduced in an audit-fixed file. Use text-slate-500 (4.78:1 on white) or text-slate-600 (7.04:1) instead:\n${offenders
        .map((o) => `  ${o.file}:${o.line}  ${o.text}`)
        .join("\n")}`,
    ).toEqual([]);
  });

  it("no audit-fixed file contains the failing hex literal `#94a3b8`", () => {
    const offenders: { file: string; line: number; text: string }[] = [];
    for (const rel of CONTRAST_FIXED_FILES) {
      const content = readFileSync(resolve(REPO_ROOT, rel), "utf8");
      const lines = content.split("\n");
      lines.forEach((line, i) => {
        // Case-insensitive — `#94A3B8` is the same color and trips
        // the same audit finding.
        if (/#94a3b8\b/i.test(line)) {
          offenders.push({ file: rel, line: i + 1, text: line.trim() });
        }
      });
    }
    expect(
      offenders,
      `Failing slate-400 hex (#94a3b8) re-introduced in an audit-fixed file. Use #64748b (slate-500, 4.78:1 on white) or #475569 (slate-600, 7.04:1) instead:\n${offenders
        .map((o) => `  ${o.file}:${o.line}  ${o.text}`)
        .join("\n")}`,
    ).toEqual([]);
  });
});
