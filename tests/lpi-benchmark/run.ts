import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import {
  decideCorrection,
  HIGH_ERROR_DENSITY_THRESHOLD,
  type PolicyInput,
  type PolicySeverity,
} from "../../src/services/lpi/correctionPolicy.js";

type Action = "correct_now" | "defer_to_recap" | "log_silently";
type Severity = "meaning_blocking" | "target_form" | "form" | "fluency" | "minor";

interface BenchmarkCase {
  id: string;
  context: {
    detectorTag: string;
    severity: Severity;
    recurrenceCount: number;
    sessionErrorDensity: number;
    consecutiveErrors: number;
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

function adaptCaseForShippedPolicy(testCase: BenchmarkCase): AdaptedPolicyInput {
  const { severity, sessionErrorDensity } = testCase.context;
  const adapterFlags: string[] = [];
  let adaptedSeverity: PolicySeverity;

  // Explicit benchmark-to-production adapter:
  // - target_form -> high
  // - form -> medium
  // - fluency -> low
  // - minor -> low
  // The benchmark also has meaning_blocking. Production has no equivalent, so
  // those cases are mapped to high and flagged as lossy instead of hidden.
  switch (severity) {
    case "meaning_blocking":
      adaptedSeverity = "high";
      adapterFlags.push("lossy_severity_mapping: meaning_blocking -> high");
      break;
    case "target_form":
      adaptedSeverity = "high";
      break;
    case "form":
      adaptedSeverity = "medium";
      break;
    case "fluency":
    case "minor":
      adaptedSeverity = "low";
      break;
    default: {
      const unreachable: never = severity;
      throw new Error(`Unhandled benchmark severity: ${unreachable}`);
    }
  }

  const adaptedDensity = Math.min(sessionErrorDensity / 5, 1);
  if (adaptedDensity === HIGH_ERROR_DENSITY_THRESHOLD) {
    adapterFlags.push("density_boundary: integer count 3 maps exactly to 0.6");
  }

  return {
    input: {
      detectorTag: testCase.context.detectorTag,
      severity: adaptedSeverity,
      recurrenceCount: testCase.context.recurrenceCount,
      sessionErrorDensity: adaptedDensity,
      consecutiveErrors: testCase.context.consecutiveErrors,
      correctionsThisBurst: 0,
    },
    adapterFlags,
  };
}

function mercyBladePolicy(testCase: BenchmarkCase): Action {
  return decideCorrection(adaptCaseForShippedPolicy(testCase).input).action;
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

function validateCases(cases: BenchmarkCase[]): void {
  if (cases.length !== 40) {
    throw new Error(`Expected 40 benchmark cases; found ${cases.length}.`);
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

const casesPath = resolve("tests/lpi-benchmark/cases.json");
const resultsPath = resolve("reports/lpi-benchmark/results.json");
const tablePath = resolve("reports/lpi-benchmark/ACCURACY.md");

const cases = JSON.parse(readFileSync(casesPath, "utf8")) as BenchmarkCase[];
validateCases(cases);

const scores = [
  scorePolicy("MercyBlade policy", cases, mercyBladePolicy),
  scorePolicy("Always-correct baseline", cases, alwaysCorrectPolicy),
  scorePolicy("Seeded-random baseline", cases, seededRandomPolicy),
];

const predictions = cases.map((testCase, index) => {
  const adapted = adaptCaseForShippedPolicy(testCase);
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

const output = {
  benchmarkVersion: "lpi-judgment-v2-shipped-policy",
  caseCount: cases.length,
  actions: ACTIONS,
  scores,
  predictions,
};

mkdirSync(dirname(resultsPath), { recursive: true });
writeFileSync(resultsPath, `${JSON.stringify(output, null, 2)}\n`);
writeFileSync(
  tablePath,
  `# LPI Pedagogical-Judgment Benchmark Accuracy\n\n${markdownTable(scores)}\n`,
);

console.log(JSON.stringify(output, null, 2));
console.log("");
console.log(markdownTable(scores));
