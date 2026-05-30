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
 * The precision contract is STRUCTURAL: every fixture file is validated
 * against a fixed schema at startup, and a violation fails the suite
 * (non-zero exit) with a message naming the exact file and constraint.
 * This stops a future expansion from quietly adding a thin or shapeless
 * fixture that looks like coverage but isn't.
 *
 * This is an EXTERNAL net: it never imports private helpers and never
 * touches `src/lib/tutor/**`.
 */

export type GoldenStatus = "corrected" | "unchanged" | "needs_ai";

export interface GoldenCase {
  id: string;
  input: string;
  /** Optional — when present, the engine status is asserted too. */
  expectedStatus?: GoldenStatus;
  expectedCorrection: string;
  /** Logical rule name that should fire (positive), or null (negative). */
  expectedRuleFired: string | null;
  notes: string;
  language?: TutorCorrectionLanguage;
}

export interface GoldenFixture {
  rule: string;
  ruleId: string;
  description: string;
  language?: TutorCorrectionLanguage;
  /** Sentences the rule SHOULD fire on (min 3). */
  positive: GoldenCase[];
  /** FP-stress / coverage sentences the rule must NOT fire on (min 2). */
  negative: GoldenCase[];
  /** Non-empty note describing the false-positive surfaces being stressed. */
  fp_risk_note: string;
}

export interface LoadedFixture {
  file: string;
  data: unknown;
}

const MIN_POSITIVE = 3;
const MIN_NEGATIVE = 2;
const REQUIRED_CASE_KEYS = ["id", "input", "expectedCorrection", "expectedRuleFired", "notes"] as const;

const DEFAULT_GOLDEN_DIR = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../golden-set/correction-rules",
);

/** Read every *.json fixture in `dir` as raw (unvalidated) data. */
export function loadFixtures(dir: string = DEFAULT_GOLDEN_DIR): LoadedFixture[] {
  return readdirSync(dir)
    .filter((name) => name.endsWith(".json"))
    .sort()
    .map((name) => ({
      file: name,
      data: JSON.parse(readFileSync(path.join(dir, name), "utf8")) as unknown,
    }));
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return typeof value === "object" && value !== null && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

/**
 * Validate one parsed fixture against the golden-set schema. Returns a
 * list of human-readable violation messages (empty array = valid). Each
 * message is prefixed with the file name so a failure points the agent at
 * the exact file and constraint.
 */
export function validateFixtureSchema(file: string, data: unknown): string[] {
  const errors: string[] = [];
  const fixture = asRecord(data);
  if (!fixture) {
    return [`${file}: top-level value must be a JSON object`];
  }

  if (!isNonEmptyString(fixture.rule)) errors.push(`${file}: "rule" is required and must be a non-empty string`);
  if (!isNonEmptyString(fixture.ruleId)) errors.push(`${file}: "ruleId" is required and must be a non-empty string`);
  if (!isNonEmptyString(fixture.description))
    errors.push(`${file}: "description" is required and must be a non-empty string`);
  if (!isNonEmptyString(fixture.fp_risk_note))
    errors.push(
      `${file}: "fp_risk_note" is required and must be a non-empty string describing the FP surfaces the negative cases stress`,
    );

  for (const [field, min] of [
    ["positive", MIN_POSITIVE],
    ["negative", MIN_NEGATIVE],
  ] as const) {
    const arr = fixture[field];
    if (!Array.isArray(arr)) {
      errors.push(`${file}: "${field}" is required and must be an array`);
      continue;
    }
    if (arr.length < min) {
      errors.push(`${file}: "${field}" requires a minimum of ${min} cases (found ${arr.length})`);
    }
    arr.forEach((rawCase, index) => {
      const where = `${file}: ${field}[${index}]`;
      const testCase = asRecord(rawCase);
      if (!testCase) {
        errors.push(`${where} must be an object`);
        return;
      }
      for (const key of REQUIRED_CASE_KEYS) {
        if (!(key in testCase)) {
          errors.push(`${where} is missing required key "${key}"`);
        }
      }
      if ("id" in testCase && !isNonEmptyString(testCase.id))
        errors.push(`${where} "id" must be a non-empty string`);
      if ("input" in testCase && typeof testCase.input !== "string")
        errors.push(`${where} "input" must be a string`);
      if ("expectedCorrection" in testCase && typeof testCase.expectedCorrection !== "string")
        errors.push(`${where} "expectedCorrection" must be a string`);
      if ("notes" in testCase && !isNonEmptyString(testCase.notes))
        errors.push(`${where} "notes" must be a non-empty string`);
      if (
        "expectedRuleFired" in testCase &&
        testCase.expectedRuleFired !== null &&
        typeof testCase.expectedRuleFired !== "string"
      ) {
        errors.push(`${where} "expectedRuleFired" must be a string (positive) or null (negative)`);
      }
    });
  }

  return errors;
}

/** Logical rule name -> concrete engine rule id (falls back to fixture.ruleId). */
function resolveRuleId(fixture: GoldenFixture, name: string | null): string {
  if (!name || name === fixture.rule) return fixture.ruleId;
  return name;
}

function registerCase(
  fixture: GoldenFixture,
  testCase: GoldenCase,
  category: "positive" | "negative",
): void {
  it(`${testCase.id} [${category}] ${testCase.notes}`, () => {
    const language = testCase.language ?? fixture.language ?? "en";
    const result = correctWithTutorRules(testCase.input, language);

    if (testCase.expectedStatus) {
      expect(result.status, `status mismatch for ${testCase.id}`).toBe(testCase.expectedStatus);
    }
    expect(result.corrected, `corrected mismatch for ${testCase.id}`).toBe(testCase.expectedCorrection);

    if (category === "positive") {
      const expectedId = resolveRuleId(fixture, testCase.expectedRuleFired);
      expect(
        result.appliedRuleIds,
        `${testCase.id} expected rule "${testCase.expectedRuleFired ?? fixture.rule}" (${expectedId}) to fire`,
      ).toContain(expectedId);
    } else {
      expect(
        result.appliedRuleIds,
        `${testCase.id} expected rule "${fixture.rule}" (${fixture.ruleId}) to NOT fire`,
      ).not.toContain(fixture.ruleId);
    }
  });
}

/**
 * Register the golden suite with Vitest. Call this from a discovered
 * `*.test.ts` file so the cases run under `vitest run`.
 */
export function runCorrectionGolden(dir: string = DEFAULT_GOLDEN_DIR): void {
  const loaded = loadFixtures(dir);

  describe("correction-rules golden set", () => {
    if (loaded.length === 0) {
      // A missing/empty fixture dir is itself a regression — fail loudly
      // rather than passing a zero-assertion suite.
      it("has at least one fixture file", () => {
        expect(loaded.length).toBeGreaterThan(0);
      });
      return;
    }

    for (const { file, data } of loaded) {
      const errors = validateFixtureSchema(file, data);

      describe(file, () => {
        it("conforms to the golden-set schema", () => {
          expect(
            errors,
            errors.length > 0 ? `Schema violations:\n - ${errors.join("\n - ")}` : undefined,
          ).toEqual([]);
        });

        // Don't run behaviour cases against a malformed file — the schema
        // failure above already fails the suite, and iterating a bad shape
        // would throw a less useful error.
        if (errors.length > 0) return;

        const fixture = data as GoldenFixture;
        describe(`${fixture.rule} — positive (${fixture.positive.length})`, () => {
          for (const testCase of fixture.positive) registerCase(fixture, testCase, "positive");
        });
        describe(`${fixture.rule} — negative (${fixture.negative.length})`, () => {
          for (const testCase of fixture.negative) registerCase(fixture, testCase, "negative");
        });
      });
    }
  });
}
