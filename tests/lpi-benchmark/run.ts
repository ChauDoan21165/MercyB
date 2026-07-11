import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import {
  decideCorrection,
  HIGH_ERROR_DENSITY_THRESHOLD,
  type PolicyInput,
} from "../../src/services/lpi/correctionPolicy.js";

type Action = "correct_now" | "defer_to_recap" | "log_silently";
type BenchmarkSeverity = PolicyInput["severity"];

interface BenchmarkCase {
  id: string;
  context: {
    detectorTag: string;
    severity: BenchmarkSeverity;
    recurrenceCount: number;
    sessionErrorDensity: number;
    consecutiveErrors: number;
    correctionsThisBurst: number;
  };
  gold: Action;
  rationale: string;
}

interface PolicyScore {
  policy: string;
  correct: number;
  total: number;
  accuracy: number;
}

interface AdaptedPolicyInput {
  input: PolicyInput;
  adapterFlags: string[];
}

const ACTIONS: Action[] = ["correct_now", "defer_to_recap", "log_silently"];

function adaptCaseForShippedPolicy(
  testCase: BenchmarkCase,
  options: { useBurstEnrichment: boolean },
): AdaptedPolicyInput {
  const { sessionErrorDensity } = testCase.context;
  const adapterFlags: string[] = [];

  // Severity is identity-mapped in v2:
  // meaning_blocking | target_form | form | fluency | minor.
  // Density remains explicit because the fixture carries integer recent-error
  // counts while production records a 0..1 fraction over the last five turns.
  const adaptedDensity = Math.min(sessionErrorDensity / 5, 1);
  if (adaptedDensity === HIGH_ERROR_DENSITY_THRESHOLD) {
    adapterFlags.push("density_boundary: integer count 3 maps exactly to 0.6");
  }

  const correctionsThisBurst = options.useBurstEnrichment
    ? testCase.context.correctionsThisBurst
    : 0;
  if (correctionsThisBurst > 0) {
    adapterFlags.push("burst_enrichment: narrative implies a prior in-burst correction");
  }

  return {
    input: {
      detectorTag: testCase.context.detectorTag,
      severity: testCase.context.severity,
      recurrenceCount: testCase.context.recurrenceCount,
      sessionErrorDensity: adaptedDensity,
      consecutiveErrors: testCase.context.consecutiveErrors,
      correctionsThisBurst,
    },
    adapterFlags,
  };
}

function mercyBladePolicy(testCase: BenchmarkCase, useBurstEnrichment: boolean): Action {
  return decideCorrection(adaptCaseForShippedPolicy(testCase, { useBurstEnrichment }).input).action;
}

function alwaysCorrectPolicy(): Action {
  return "correct_now";
}

function seededRandomPolicy(testCase: BenchmarkCase, index: number): Action {
  let hash = 2166136261;
  const input = `${testCase.id}:${index}:lpi-benchmark-v1`;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return ACTIONS[(hash >>> 0) % ACTIONS.length];
}

function scorePolicy(
  name: string,
  cases: BenchmarkCase[],
  predict: (testCase: BenchmarkCase, index: number) => Action,
): PolicyScore {
  const correct = cases.reduce((count, testCase, index) => {
    return count + (predict(testCase, index) === testCase.gold ? 1 : 0);
  }, 0);

  return {
    policy: name,
    correct,
    total: cases.length,
    accuracy: correct / cases.length,
  };
}

function validateCases(cases: BenchmarkCase[], expectedCount: number): void {
  if (cases.length !== expectedCount) {
    throw new Error(`Expected ${expectedCount} benchmark cases; found ${cases.length}.`);
  }

  const ids = new Set<string>();
  for (const testCase of cases) {
    if (ids.has(testCase.id)) {
      throw new Error(`Duplicate benchmark id: ${testCase.id}`);
    }
    ids.add(testCase.id);

    if (!ACTIONS.includes(testCase.gold)) {
      throw new Error(`Invalid gold action for ${testCase.id}: ${testCase.gold}`);
    }
    if (![0, 1].includes(testCase.context.correctionsThisBurst)) {
      throw new Error(`Invalid correctionsThisBurst convention for ${testCase.id}`);
    }
    if (!testCase.rationale || testCase.rationale.length < 40) {
      throw new Error(`Missing rationale citation detail for ${testCase.id}`);
    }
  }
}

function markdownTable(scores: PolicyScore[]): string {
  const rows = scores.map((score) => {
    const percent = `${(score.accuracy * 100).toFixed(1)}%`;
    return `| ${score.policy} | ${score.correct}/${score.total} | ${percent} |`;
  });

  return [
    "| Policy | Correct | Accuracy |",
    "| --- | ---: | ---: |",
    ...rows,
  ].join("\n");
}

function buildPredictions(cases: BenchmarkCase[], useBurstEnrichment: boolean) {
  return cases.map((testCase, index) => {
    const adapted = adaptCaseForShippedPolicy(testCase, { useBurstEnrichment });
    const mercyBladeDecision = decideCorrection(adapted.input);

    return {
      id: testCase.id,
      gold: testCase.gold,
      shippedPolicyInput: adapted.input,
      adapterFlags: adapted.adapterFlags,
      predictions: {
        mercyBlade: mercyBladeDecision.action,
        mercyBladeReason: mercyBladeDecision.reason,
        alwaysCorrect: alwaysCorrectPolicy(),
        seededRandom: seededRandomPolicy(testCase, index),
      },
    };
  });
}

const defaultCasesPath = resolve("tests/lpi-benchmark/cases.json");
const requestedCasesFile = process.argv[2] ?? "tests/lpi-benchmark/cases.json";
const requestedCasesPath = resolve(requestedCasesFile);
const isDefaultCasesFile = requestedCasesPath === defaultCasesPath;
const expectedCaseCount = isDefaultCasesFile ? 40 : 30;
const resultsPath = isDefaultCasesFile
  ? resolve("reports/lpi-benchmark/results.json")
  : resolve("reports/lpi-benchmark/heldout-results.json");
const tablePath = isDefaultCasesFile
  ? resolve("reports/lpi-benchmark/ACCURACY.md")
  : resolve("reports/lpi-benchmark/HELDOUT_ACCURACY.md");

const cases = JSON.parse(readFileSync(requestedCasesPath, "utf8")) as BenchmarkCase[];
validateCases(cases, expectedCaseCount);

const oldReconciledScores = [
  { policy: "MercyBlade policy", correct: 16, total: 40, accuracy: 0.4 },
  { policy: "Always-correct baseline", correct: 16, total: 40, accuracy: 0.4 },
  { policy: "Seeded-random baseline", correct: 16, total: 40, accuracy: 0.4 },
];

const scoresBeforeBurstEnrichment = [
  scorePolicy("MercyBlade policy", cases, (testCase) => mercyBladePolicy(testCase, false)),
  scorePolicy("Always-correct baseline", cases, alwaysCorrectPolicy),
  scorePolicy("Seeded-random baseline", cases, seededRandomPolicy),
];

const scores = [
  scorePolicy("MercyBlade policy", cases, (testCase) => mercyBladePolicy(testCase, true)),
  scorePolicy("Always-correct baseline", cases, alwaysCorrectPolicy),
  scorePolicy("Seeded-random baseline", cases, seededRandomPolicy),
];

const predictionsBeforeBurstEnrichment = buildPredictions(cases, false);
const predictions = buildPredictions(cases, true);

const output = isDefaultCasesFile
  ? {
      benchmarkVersion: "lpi-judgment-v3-policy-v2-severity-model",
      caseCount: cases.length,
      actions: ACTIONS,
      oldReconciledScores,
      scoresBeforeBurstEnrichment,
      scores,
      predictionsBeforeBurstEnrichment,
      predictions,
    }
  : {
      benchmarkVersion: "lpi-judgment-v3-policy-v2-severity-model",
      casesFile: requestedCasesFile,
      caseCount: cases.length,
      actions: ACTIONS,
      scores,
      predictions,
    };

mkdirSync(dirname(resultsPath), { recursive: true });
writeFileSync(resultsPath, `${JSON.stringify(output, null, 2)}\n`);
writeFileSync(
  tablePath,
  isDefaultCasesFile
    ? [
        "# LPI Pedagogical-Judgment Benchmark Accuracy",
        "",
        "## Reconciled Shipped Policy v1",
        "",
        markdownTable(oldReconciledScores),
        "",
        "## Policy v2 Before Burst Enrichment",
        "",
        markdownTable(scoresBeforeBurstEnrichment),
        "",
        "## Policy v2 After Burst Enrichment",
        "",
        markdownTable(scores),
        "",
      ].join("\n")
    : [
        "# LPI Held-Out Benchmark Accuracy",
        "",
        markdownTable(scores),
        "",
      ].join("\n"),
);

console.log(JSON.stringify(output, null, 2));
console.log("");
if (isDefaultCasesFile) {
  console.log("Reconciled shipped policy v1");
  console.log(markdownTable(oldReconciledScores));
  console.log("");
  console.log("Policy v2 before burst enrichment");
  console.log(markdownTable(scoresBeforeBurstEnrichment));
  console.log("");
  console.log("Policy v2 after burst enrichment");
} else {
  console.log("Held-out validation");
}
console.log(markdownTable(scores));
