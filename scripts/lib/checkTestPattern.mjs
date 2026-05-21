// Pure evaluator that translates a Vitest JSON-reporter payload into a
// non-vacuous validation outcome.
//
// Contract:
//   - `numPassedTests > 0 && numFailedTests === 0`  → "passed"           (ok=true)
//   - `numPassedTests === 0 && numFailedTests === 0` → "no_tests_matched" (ok=false)
//   - `numFailedTests > 0`                          → "tests_failed"     (ok=false)
//   - input not a vitest payload                    → "invalid_input"    (ok=false)
//
// The deliberate principle: "0 passed AND 0 failed" is NOT a pass. A targeted
// pattern that matched no tests has not validated anything — it must surface
// as a hard failure so a reviewer or CI cannot mistake it for green.

/**
 * @typedef {"passed" | "no_tests_matched" | "tests_failed" | "invalid_input"} EvaluationOutcome
 */

/**
 * @typedef {Object} EvaluationResult
 * @property {EvaluationOutcome} outcome
 * @property {boolean} ok          - true only on "passed"
 * @property {string} reason       - human-readable description
 * @property {number} numPassed
 * @property {number} numFailed
 * @property {number} numTotal
 * @property {number} numSkipped   - pending + todo
 */

/**
 * Evaluate a Vitest JSON reporter payload into a validation outcome.
 *
 * @param {unknown} json - parsed JSON output of `vitest run --reporter=json`.
 * @returns {EvaluationResult}
 */
export function evaluateVitestResult(json) {
  if (!json || typeof json !== "object") {
    return {
      outcome: "invalid_input",
      ok: false,
      reason: "input is not a Vitest JSON payload (expected an object)",
      numPassed: 0,
      numFailed: 0,
      numTotal: 0,
      numSkipped: 0,
    };
  }
  const v = /** @type {Record<string, unknown>} */ (json);

  const numPassed = numberOrNaN(v.numPassedTests);
  const numFailed = numberOrNaN(v.numFailedTests);
  const numTotal = numberOrNaN(v.numTotalTests);
  const numPending = numberOrZero(v.numPendingTests);
  const numTodo = numberOrZero(v.numTodoTests);

  if (Number.isNaN(numPassed) || Number.isNaN(numFailed) || Number.isNaN(numTotal)) {
    return {
      outcome: "invalid_input",
      ok: false,
      reason:
        "missing required numeric fields (numPassedTests / numFailedTests / numTotalTests)",
      numPassed: Number.isFinite(numPassed) ? numPassed : 0,
      numFailed: Number.isFinite(numFailed) ? numFailed : 0,
      numTotal: Number.isFinite(numTotal) ? numTotal : 0,
      numSkipped: numPending + numTodo,
    };
  }

  const numSkipped = numPending + numTodo;

  if (numFailed > 0) {
    return {
      outcome: "tests_failed",
      ok: false,
      reason: `${numFailed} test(s) failed`,
      numPassed,
      numFailed,
      numTotal,
      numSkipped,
    };
  }

  if (numPassed === 0) {
    return {
      outcome: "no_tests_matched",
      ok: false,
      reason:
        "0 tests matched the pattern — NOT VALIDATED (a green exit code here is meaningless)",
      numPassed,
      numFailed,
      numTotal,
      numSkipped,
    };
  }

  return {
    outcome: "passed",
    ok: true,
    reason: `${numPassed} test(s) passed`,
    numPassed,
    numFailed,
    numTotal,
    numSkipped,
  };
}

/**
 * Convert an EvaluationResult into a short human-readable line for stderr.
 *
 * @param {EvaluationResult} result
 * @returns {string}
 */
export function formatEvaluationLine(result) {
  const tag = labelForOutcome(result.outcome);
  return `${tag} — ${result.reason} (passed=${result.numPassed}, failed=${result.numFailed}, total=${result.numTotal}, skipped=${result.numSkipped})`;
}

/**
 * @param {EvaluationOutcome} outcome
 */
function labelForOutcome(outcome) {
  switch (outcome) {
    case "passed":
      return "PASS";
    case "no_tests_matched":
      return "NOT_VALIDATED";
    case "tests_failed":
      return "FAIL";
    case "invalid_input":
      return "INVALID";
  }
}

/** @param {unknown} v */
function numberOrNaN(v) {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  return Number.NaN;
}

/** @param {unknown} v */
function numberOrZero(v) {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  return 0;
}
