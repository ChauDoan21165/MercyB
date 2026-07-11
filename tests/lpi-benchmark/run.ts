import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

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

const ACTIONS: Action[] = ["correct_now", "defer_to_recap", "log_silently"];

// SYNC: If LPI-1 lands src/services/lpi/correctionPolicy.ts, replace this table
// with an import from that module and keep the benchmark cases unchanged.
const MERCYBLADE_RULE_TABLE = {
  burstDensity: 5,
  burstConsecutive: 3,
  repeatedFormThreshold: 3,
  repeatedMinorThreshold: 4,
} as const;

function mercyBladePolicy(testCase: BenchmarkCase): Action {
  const { severity, recurrenceCount, sessionErrorDensity, consecutiveErrors } = testCase.context;
  const inBurst =
    sessionErrorDensity >= MERCYBLADE_RULE_TABLE.burstDensity ||
    consecutiveErrors >= MERCYBLADE_RULE_TABLE.burstConsecutive;

  if (severity === "meaning_blocking") {
    return "correct_now";
  }

  if (inBurst) {
    if (severity === "target_form" || recurrenceCount >= MERCYBLADE_RULE_TABLE.repeatedFormThreshold) {
      return "defer_to_recap";
    }
    return "log_silently";
  }

  if (severity === "target_form") {
    return "correct_now";
  }

  if (severity === "form") {
    return recurrenceCount >= MERCYBLADE_RULE_TABLE.repeatedFormThreshold
      ? "correct_now"
      : "defer_to_recap";
  }

  if (recurrenceCount >= MERCYBLADE_RULE_TABLE.repeatedMinorThreshold) {
    return "defer_to_recap";
  }

  return "log_silently";
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

const predictions = cases.map((testCase, index) => ({
  id: testCase.id,
  gold: testCase.gold,
  predictions: {
    mercyBlade: mercyBladePolicy(testCase),
    alwaysCorrect: alwaysCorrectPolicy(),
    seededRandom: seededRandomPolicy(testCase, index),
  },
}));

const output = {
  benchmarkVersion: "lpi-judgment-v1",
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
