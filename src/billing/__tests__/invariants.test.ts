/**
 * Billing invariant guards. **Static drift surface.**
 *
 * The billing surface is the one place where a silent regression
 * costs real money. The guards below cover the failure classes that
 * would not surface in unit tests but would surface in a Stripe
 * dispute, a charged-without-entitlement support ticket, or a
 * locked-out-paying-user incident. Each maps directly to an item on
 * the `docs/architecture/systems/billing-entitlement.md` §4
 * never/always lists.
 *
 * Gap → guard mapping:
 *
 *   §4a "Never gate on price_id"      → Guard 1 (no price_id reads)
 *   §4a "Never gate on profiles.tier" → Guard 1 (no profiles.tier reads)
 *   §4d "browser never derives from   → Guard 2 (no client-side
 *        raw subscriptions"                   amount math on Stripe data)
 *   PCI compliance + safe-by-default  → Guard 3 (no plain-text card
 *                                       data anywhere in src/billing/)
 *   ROADMAP "tests never hit prod"    → Guard 4 (no live fetch in
 *                                       billing tests)
 *
 * ─── Adding a new billing invariant ────────────────────────────────
 *
 * Add it here if it's a contract about how src/billing/ derives or
 * persists entitlement, never silently downgrades, never leaks
 * card data, or never reaches the network from tests. The
 * never/always lists in `billing-entitlement.md` §4 are the
 * canonical menu of candidate guards. Prefer source-text greps over
 * runtime probes — the failure mode this file exists to catch is
 * "someone added code that compiles + ships green but violates the
 * contract", and the only check that catches that is a static scan.
 */

import { readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const REPO_ROOT = resolve(__dirname, "../../../");
const BILLING_DIR = resolve(REPO_ROOT, "src/billing");

/**
 * Exclude this test file from its own scans. The card-data + fetch
 * guards contain literal regex patterns (`cvv`, `\bfetch\s*\(`, etc.)
 * as the very strings they grep for — without this skip, the test
 * trips on its own source.
 */
const SELF_FILE = __filename;

function stripJsComments(text: string): string {
  const withoutBlocks = text.replace(/\/\*[\s\S]*?\*\//g, "");
  const withoutLines = withoutBlocks.replace(/(^|[^:])\/\/.*$/gm, "$1");
  return withoutLines;
}

function walkBillingFiles(opts: { tests: boolean }): string[] {
  const out: string[] = [];
  const recurse = (dir: string) => {
    for (const entry of readdirSync(dir)) {
      const full = join(dir, entry);
      const stat = statSync(full);
      if (stat.isDirectory()) {
        // The __tests__ folder is only walked when opts.tests is true.
        if (entry === "__tests__" && !opts.tests) continue;
        recurse(full);
        continue;
      }
      if (!stat.isFile()) continue;
      if (!/\.(ts|tsx)$/.test(entry)) continue;
      // Skip this file itself — see SELF_FILE comment up top.
      if (full === SELF_FILE) continue;
      const isTestFile = /\.test\.(ts|tsx)$/.test(entry);
      if (opts.tests && !isTestFile) continue;
      if (!opts.tests && isTestFile) continue;
      out.push(full);
    }
  };
  recurse(BILLING_DIR);
  return out;
}

// ══════════════════════════════════════════════════════════════════════
// Guard 1 — entitlement derives from status + period_end + provider
//           only (no price_id, no profiles.tier reads)
//
// `billing-entitlement.md` §4a:
//   - "Never gate on price_id." Pricing experiments change price_id;
//     gating on it locks out paying users mid-experiment.
//   - "Never gate on profiles.tier in new code." The column is
//     retained for back-compat reads only.
//
// These checks scan production code only; test files (esp.
// `recomputeAndPersistEntitlement.test.ts`) legitimately mention
// `price_id` in case descriptions to ASSERT that mismatches do NOT
// lock users out (PR #700 invariant). The text reference there is
// the test naming the invariant, not a violation of it.
// ══════════════════════════════════════════════════════════════════════

describe("Billing — entitlement derives from status + period_end + provider only", () => {
  it("no production billing file reads `price_id` / `priceId`", () => {
    const offenders: string[] = [];
    for (const file of walkBillingFiles({ tests: false })) {
      const code = stripJsComments(readFileSync(file, "utf8"));
      if (/\bprice_id\b/.test(code) || /\bpriceId\b/.test(code)) {
        offenders.push(relative(REPO_ROOT, file));
      }
    }
    expect(
      offenders,
      `production billing code reads price_id (billing-entitlement.md §4a "Never gate on price_id"):\n${offenders.join("\n")}`,
    ).toEqual([]);
  });

  it("no production billing file reads `profiles.tier` or a `.tier` comparison", () => {
    const offenders: string[] = [];
    for (const file of walkBillingFiles({ tests: false })) {
      const code = stripJsComments(readFileSync(file, "utf8"));
      // The `profiles.tier` column read shape, and the comparison
      // shapes (`.tier ===`, `.tier !==`, `.tier >`, `.tier >=` etc.)
      // that would gate on tier.
      if (/\bprofiles\.tier\b/.test(code)) {
        offenders.push(`${relative(REPO_ROOT, file)}: references profiles.tier`);
      }
      if (/\.tier\s*(===|!==|>=?|<=?|==|!=)/.test(code)) {
        offenders.push(
          `${relative(REPO_ROOT, file)}: gates on a .tier comparison`,
        );
      }
    }
    expect(
      offenders,
      `production billing code reads profiles.tier (billing-entitlement.md §4a "Never gate on profiles.tier in new code"):\n${offenders.join("\n")}`,
    ).toEqual([]);
  });
});

// ══════════════════════════════════════════════════════════════════════
// Guard 2 — no client-side amount arithmetic on Stripe data
//
// `billing-entitlement.md` §4d: "The browser never derives
// entitlement from raw subscriptions rows itself." This extends to
// raw Stripe amount / unit_amount / price fields — the server is the
// source of truth for any monetary number. A client-side `*` or `/`
// on those fields would be an attempt to recompute charge math
// locally, which both drifts and creates a tampering surface.
//
// The regex targets `<identifier> [*/]` and `[*/] <identifier>` where
// the identifier is one of `amount`, `unit_amount`, `price`. Date
// math (e.g. `Date.now() - periodEnd`) is unaffected; ratio math
// (`completedSeats / totalSeats`) is unaffected (no amount/price
// keyword). The guard only fires when the keyword and the arithmetic
// operator are adjacent.
// ══════════════════════════════════════════════════════════════════════

describe("Billing — no client-side amount arithmetic on Stripe data", () => {
  it("no production billing file multiplies or divides amount / unit_amount / price", () => {
    const offenders: string[] = [];
    for (const file of walkBillingFiles({ tests: false })) {
      const code = stripJsComments(readFileSync(file, "utf8"));
      const reLeft = /\b(amount|unit_amount|price)\s*[*/]/;
      const reRight = /[*/]\s*\b(amount|unit_amount|price)\b/;
      if (reLeft.test(code)) {
        offenders.push(
          `${relative(REPO_ROOT, file)}: arithmetic operator immediately after amount/unit_amount/price keyword`,
        );
      }
      if (reRight.test(code)) {
        offenders.push(
          `${relative(REPO_ROOT, file)}: arithmetic operator immediately before amount/unit_amount/price keyword`,
        );
      }
    }
    expect(
      offenders,
      `Client-side amount math detected. Server is the source of truth for charge calculations (billing-entitlement.md §4d):\n${offenders.join("\n")}`,
    ).toEqual([]);
  });
});

// ══════════════════════════════════════════════════════════════════════
// Guard 3 — no plain-text card data anywhere in src/billing/
//
// MercyBlade uses Stripe Checkout / Payment Element, so card data
// never reaches our origin in production. This guard locks that
// posture statically: even tests must not handle PAN / CVV / CVC /
// numeric card-number patterns. The forbidden identifiers cover the
// JSON shape (`card_number`), the JS shape (`cardNumber`), and the
// stand-alone field names (`pan`, `cvv`, `cvc`) — case-insensitive
// because mixed casing is a common shape in third-party fixtures.
// ══════════════════════════════════════════════════════════════════════

const CARD_DATA_PATTERNS = [
  /\bcard_number\b/i,
  /\bcardNumber\b/,
  /\bpan\b/i,
  /\bcvv\b/i,
  /\bcvc\b/i,
] as const;

describe("Billing — no plain-text card data anywhere in src/billing/", () => {
  it("no billing file (production or test) contains card-data identifiers", () => {
    const offenders: string[] = [];
    const allFiles = [
      ...walkBillingFiles({ tests: false }),
      ...walkBillingFiles({ tests: true }),
    ];
    for (const file of allFiles) {
      const code = stripJsComments(readFileSync(file, "utf8"));
      for (const pat of CARD_DATA_PATTERNS) {
        if (pat.test(code)) {
          offenders.push(
            `${relative(REPO_ROOT, file)}: matches ${pat.toString()}`,
          );
        }
      }
    }
    expect(
      offenders,
      `Plain-text card-data identifier found in src/billing/. PAN/CVV/CVC must never reach this tree — Stripe Checkout / Payment Element handles card capture out-of-origin:\n${offenders.join("\n")}`,
    ).toEqual([]);
  });
});

// ══════════════════════════════════════════════════════════════════════
// Guard 4 — every billing test file is fetch-free (or mocks fetch)
//
// Billing tests are pure-function tests over fixtures today. A
// future test that calls `fetch(...)` directly would slow CI, race
// on network conditions, and could even hit a real Stripe endpoint
// if a fixture URL was misconfigured. The contract: either no
// `fetch(` call at all, or a `vi.spyOn(globalThis, "fetch")` /
// `vi.mock(...)` / `globalThis.fetch =` pattern alongside it.
// ══════════════════════════════════════════════════════════════════════

const FETCH_MOCK_PATTERNS = [
  /vi\.spyOn\s*\(\s*globalThis\s*,\s*["']fetch["']\s*\)/,
  /vi\.spyOn\s*\(\s*window\s*,\s*["']fetch["']\s*\)/,
  /vi\.mock\s*\(/,
  /\bglobalThis\.fetch\s*=/,
  /\bglobal\.fetch\s*=/,
] as const;

describe("Billing — tests mock fetch or don't call it at all", () => {
  it("no billing test makes a live fetch call without an accompanying mock", () => {
    const offenders: string[] = [];
    for (const file of walkBillingFiles({ tests: true })) {
      const code = stripJsComments(readFileSync(file, "utf8"));
      const callsFetch = /\bfetch\s*\(/.test(code);
      if (!callsFetch) continue;
      const hasMock = FETCH_MOCK_PATTERNS.some((pat) => pat.test(code));
      if (!hasMock) {
        offenders.push(
          `${relative(REPO_ROOT, file)}: calls fetch(...) without a mock — risks live network in CI`,
        );
      }
    }
    expect(
      offenders,
      `Billing tests touch fetch without a mock:\n${offenders.join("\n")}`,
    ).toEqual([]);
  });
});
