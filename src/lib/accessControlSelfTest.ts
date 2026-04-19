// src/lib/accessControlSelfTest.ts
/**
 * Access Control Self-Test
 *
 * Run in dev mode to verify tier-based access control is working correctly.
 * All output is suppressed in production builds.
 */

import { validateAccessControl } from "./accessControl";

export function logAccessControlSelfTest() {
  // No-op in production — this is a dev diagnostic tool only
  if (!import.meta.env.DEV) return undefined;

  const result = validateAccessControl();

  console.group("🔎 Access Control Self-Test");
  console.log("Passed:", result.passed);
  console.log("Failed:", result.failed);

  if (result.failed > 0) {
    console.error("❌ Failures detected:", result.failures);
  } else {
    console.log("✅ All access control tests passed!");
  }

  console.groupEnd();

  return result;
}

/**
 * Assert access control is working — throws if any test fails.
 * Safe to call in production: validateAccessControl runs but throws
 * rather than logging, so no internal details leak to console.
 */
export function assertAccessControlValid() {
  const result = validateAccessControl();

  if (result.failed > 0) {
    throw new Error(
      `Access control validation failed: ${result.failed} test(s) failed.`,
    );
  }

  return result;
}