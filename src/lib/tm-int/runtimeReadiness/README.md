# TM INT Runtime Readiness SDK

Short TypeScript examples for Judge verification tooling. This SDK helps create and validate runtime evidence; it does not promote verified status.

## Import from the Public Index

```ts
import {
  checkReplayDeterminism,
  createReplayPair,
  createValidRegressionPack,
  createValidRuntimeEvidenceBundle,
  generateRuntimeReadinessReport,
  judgeRuntimeReadinessEvidence,
  validateRuntimeRegressionPack,
  validateTeacherContext,
  type RuntimeEvidenceBundle,
} from "./index";
```

## Create a RuntimeEvidenceBundle Fixture

```ts
const bundle: RuntimeEvidenceBundle = createValidRuntimeEvidenceBundle();

console.log(bundle.contractId); // RR-001
console.log(bundle.runtimeDecision.changedBecauseOfTeacherContext); // true
```

## Run Judge Rubric Validation

```ts
const bundle = createValidRuntimeEvidenceBundle();
const result = judgeRuntimeReadinessEvidence(bundle, "RR-001");

if (!result.pass) {
  console.error(result.failures);
}
```

## Validate Teacher Context

```ts
const bundle = createValidRuntimeEvidenceBundle();
const validation = validateTeacherContext(bundle);

console.log(validation.pass);
console.log(validation.failures.map((failure) => failure.reason));
```

## Compare Replay Determinism

```ts
const { first, second } = createReplayPair();
const replay = checkReplayDeterminism(first, second);

console.log(replay.pass); // true
console.log(replay.mismatchStages); // []
```

## Generate a Readiness Report

```ts
const { first, second } = createReplayPair();
const report = generateRuntimeReadinessReport(first, second);

console.log(report.json.verdict);
console.log(report.markdown);
```

## Create a Regression Pack

```ts
const pack = createValidRegressionPack();
const validation = validateRuntimeRegressionPack(pack);

console.log(pack.sourceRuntimeGateId); // RR-001
console.log(validation.pass);
```

## Use in a Test

```ts
import { expect, test } from "vitest";
import { createValidRuntimeEvidenceBundle, judgeRuntimeReadinessEvidence } from "./index";

test("RR-001 evidence remains Judge-ready", () => {
  const bundle = createValidRuntimeEvidenceBundle();

  expect(judgeRuntimeReadinessEvidence(bundle, "RR-001").pass).toBe(true);
});
```
