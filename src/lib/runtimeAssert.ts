// FILE: src/lib/runtimeAssert.ts
// VERSION: MB-BLUE-101.12c — 2026-01-12 (+0700)
// PURPOSE: Hard assertions for impossible states (dev-only)

export function invariant(condition: any, message: string): asserts condition {
  if (!condition) {
    console.error("[INVARIANT FAILED]", message);
    throw new Error(message);
  }
}
