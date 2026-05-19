// Temporary scaffold (A7b / sourcemap upload smoke test).
// Removed in a follow-up cleanup PR after Chau verifies Sentry symbolicates
// the throw. Gated by an env flag AND a query param so it cannot fire by
// accident: a random visitor hitting /__sentry-smoke-test with no flag set
// sees a benign inactive page; a visitor hitting it with the flag set but
// no ?confirm=throw also sees the inactive page. Both gates must hold.
//
// Verify path (manual, post-deploy):
//   1. Set VITE_SENTRY_SMOKE_TEST_ENABLED=true in Vercel production env.
//   2. Trigger a redeploy so the flag is baked into the prod bundle.
//   3. Visit https://mercyblade.com/__sentry-smoke-test?confirm=throw
//   4. Observe in Sentry: event "SENTRY_SOURCEMAP_SMOKE_TEST_v1" with a
//      symbolicated frame pointing to src/pages/SentrySmokeTest.tsx — NOT
//      an obfuscated assets/index-*.js chunk.
//   5. Remove the env var (and merge the cleanup PR that deletes this file).

import { useEffect } from "react";

const SMOKE_ERROR_NAME = "SENTRY_SOURCEMAP_SMOKE_TEST_v1";

export default function SentrySmokeTest() {
  const flagOn =
    import.meta.env.VITE_SENTRY_SMOKE_TEST_ENABLED === "true";
  const queryOn =
    typeof window !== "undefined" &&
    new URLSearchParams(window.location.search).get("confirm") === "throw";

  useEffect(() => {
    if (flagOn && queryOn) {
      throw new Error(SMOKE_ERROR_NAME);
    }
  }, [flagOn, queryOn]);

  return (
    <main style={{ padding: 24, fontFamily: "system-ui, sans-serif" }}>
      <h1>Sentry sourcemap smoke test</h1>
      <p>
        This route is a temporary diagnostic. It does nothing unless both
        gates are satisfied:
      </p>
      <ul>
        <li>
          <code>VITE_SENTRY_SMOKE_TEST_ENABLED=true</code> in the build env
          (currently <strong>{flagOn ? "ON" : "off"}</strong>).
        </li>
        <li>
          <code>?confirm=throw</code> on the URL (currently{" "}
          <strong>{queryOn ? "present" : "absent"}</strong>).
        </li>
      </ul>
      <p>If both are on, the page throws on mount and Sentry receives it.</p>
    </main>
  );
}
