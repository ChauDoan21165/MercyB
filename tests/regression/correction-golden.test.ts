// Discovered entry point for the Lane B correction-engine golden set.
// Vitest's default include glob only picks up *.test.ts files, so this thin
// wrapper invokes the runner in tests/regression/harness/runCorrectionGolden.ts,
// which registers one Vitest case per JSON fixture entry.
import { runCorrectionGolden } from "./harness/runCorrectionGolden";

runCorrectionGolden();
