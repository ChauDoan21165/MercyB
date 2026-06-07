import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import {
  entitlementIsPremium,
  resolveEntitlementTier,
} from "@/lib/authService";
import { entitlementGoldenCases } from "./entitlement-golden-flow.fixture";

const REPO_ROOT = resolve(__dirname, "../..");

const OWNED_SURFACES = [
  "src/components/entitlements/RequireFeature.tsx",
  "src/hooks/useCredits.ts",
  "src/pages/AccountPage.tsx",
  "src/screens/Pricing.tsx",
  "src/pages/Billing.tsx",
  "src/pages/BillingSuccessPage.tsx",
];

const RAW_PREMIUM_GATE_PATTERNS = [
  /\b(?:ent|entitlement|latest|result)\??\.is_premium\b/,
  /\bis_premium\b\s*={2,3}\s*true/,
  /\bis_premium\b\s*!={1,2}\s*true/,
];

describe("entitlement golden flow", () => {
  it.each(entitlementGoldenCases)(
    "$name resolves premium access through the canonical entitlement path",
    ({ entitlement, expectedHasPremium }) => {
      expect(entitlementIsPremium(entitlement)).toBe(expectedHasPremium);
      expect(resolveEntitlementTier(entitlement) !== "level0").toBe(
        expectedHasPremium,
      );
    },
  );

  it("owned gates consume useUserAccess().hasPremium instead of raw is_premium checks", () => {
    const offenders: string[] = [];

    for (const relativePath of OWNED_SURFACES) {
      const source = readFileSync(resolve(REPO_ROOT, relativePath), "utf8");
      const usesCanonicalAccess =
        /useUserAccess\s*\(/.test(source) && /\.hasPremium\b/.test(source);
      const rawPremiumCheck = RAW_PREMIUM_GATE_PATTERNS.some((pattern) =>
        pattern.test(source),
      );

      if (!usesCanonicalAccess || rawPremiumCheck) {
        offenders.push(relativePath);
      }
    }

    expect(offenders).toEqual([]);
  });
});
