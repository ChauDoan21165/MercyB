import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  correctWithTutorRules,
  type TutorCorrectionLanguage,
} from "../../../src/lib/tutor/correctionEngine";

/**
 * Lane B regression harness — correction-engine golden runner.
 *
 * Loads the structured JSON fixtures under
 * `tests/regression/golden-set/correction-rules/` and runs each `input`
 * through the (UNMODIFIED) correction engine, asserting the verified
 * behaviour of the audit rules merged in commit ad3641395.
 *
 * This is an EXTERNAL net: it never imports private helpers and never
 * touches `src/lib/tutor/**`. A `expectedRuleFired` of a logical helper
 * name (e.g. "hasPastTimeMarker") is mapped to the concrete rule id that
 * the helper drives, so the fixtures stay readable while the assertion
 * checks the real `appliedRuleIds` the engine reports.
 *
 * Any failure here is a real Vitest failure (non-zero exit), which is the
 * regression signal — a future Lane A expansion that silently re-breaks a
 * locked rule turns this suite red.
 */

/** Logical helper name (used in fixtures) -> concrete engine rule id. */
const RULE_ID_BY_NAME: Record<string, string> = {
  hasPastTimeMarker: "en-yesterday-irregular-beginner-past",
};

export type GoldenStatus = "corrected" | "unchanged" | "needs_ai";

export interface GoldenCase {
  id: string;
  category?: string;
  input: string;
  expectedStatus: GoldenStatus;
  expectedCorrection: string;
  /** Logical helper name that should fire, or null/absent if it must NOT fire. */
  expectedRuleFired: string | null;
  notes?: string;
  language?: TutorCorrectionLanguage;
}

export interface GoldenFixture {
  rule: string;
  ruleId: string;
  language?: TutorCorrectionLanguage;
  description?: string;
  cases: GoldenCase[];
}

export interface LoadedFixture {
  file: string;
  fixture: GoldenFixture;
}

const DEFAULT_GOLDEN_DIR = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../golden-set/correction-rules",
);

/** Read and parse every *.json fixture in `dir`, sorted for stable order. */
export function loadFixtures(dir: string = DEFAULT_GOLDEN_DIR): LoadedFixture[] {
  return readdirSync(dir)
    .filter((name) => name.endsWith(".json"))
    .sort()
    .map((name) => ({
      file: name,
      fixture: JSON.parse(readFileSync(path.join(dir, name), "utf8")) as GoldenFixture,
    }));
}

function resolveRuleId(fixture: GoldenFixture, logicalName: string): string {
  return RULE_ID_BY_NAME[logicalName] ?? logicalName;
}

/**
 * Register the golden suite with Vitest. Call this from a discovered
 * `*.test.ts` file so the cases run under `vitest run`.
 */
export function runCorrectionGolden(dir: string = DEFAULT_GOLDEN_DIR): void {
  const fixtures = loadFixtures(dir);

  describe("correction-rules golden set", () => {
    if (fixtures.length === 0) {
      // A missing/empty fixture dir is itself a regression — fail loudly
      // rather than passing a zero-assertion suite.
      it("has at least one fixture file", () => {
        expect(fixtures.length).toBeGreaterThan(0);
      });
      return;
    }

    for (const { file, fixture } of fixtures) {
      const ruleId = resolveRuleId(fixture, fixture.rule);

      describe(`${file} — ${fixture.rule} (${fixture.cases.length} cases)`, () => {
        for (const testCase of fixture.cases) {
          const label = `${testCase.id} [${testCase.category ?? "case"}] ${testCase.notes ?? testCase.input}`;

          it(label, () => {
            const language = testCase.language ?? fixture.language ?? "en";
            const result = correctWithTutorRules(testCase.input, language);

            expect(result.status, `status mismatch for ${testCase.id}`).toBe(
              testCase.expectedStatus,
            );
            expect(result.corrected, `corrected mismatch for ${testCase.id}`).toBe(
              testCase.expectedCorrection,
            );

            if (testCase.expectedRuleFired) {
              const expectedId = resolveRuleId(fixture, testCase.expectedRuleFired);
              expect(
                result.appliedRuleIds,
                `${testCase.id} expected rule "${testCase.expectedRuleFired}" (${expectedId}) to fire`,
              ).toContain(expectedId);
            } else {
              expect(
                result.appliedRuleIds,
                `${testCase.id} expected rule "${fixture.rule}" (${ruleId}) to NOT fire`,
              ).not.toContain(ruleId);
            }
          });
        }
      });
    }
  });
}
