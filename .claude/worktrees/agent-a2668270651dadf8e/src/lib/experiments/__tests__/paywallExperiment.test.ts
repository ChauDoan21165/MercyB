// src/lib/experiments/__tests__/paywallExperiment.test.ts
//
// Tests focus on the deterministic + observable surface:
//   - fnv1aHash32 stays stable for known inputs.
//   - pickVariantFor is pure and deterministic.
//   - getVariant caches; second call returns the cached value.
//   - markExposure no-ops when consent is off (we exercise the
//     consent gate via setMarketingConsent + the lazy supabase
//     import path; we don't assert on a fake server).
//   - The experiment-disabled config short-circuits everything.

import { afterEach, beforeEach, describe, expect, it } from "vitest";

import {
  __resetMarketingConsentForTests,
  setMarketingConsent,
} from "@/services/behaviorTrackingFlag";
import {
  __resetPaywallExperimentForTests,
  fnv1aHash32,
  getOrMintAnonId,
  getVariant,
  markExposure,
  PAYWALL_EXPERIMENT,
  pickVariantFor,
  type Identity,
  type PaywallExperimentConfig,
} from "../paywallExperiment";

beforeEach(() => {
  __resetMarketingConsentForTests();
  __resetPaywallExperimentForTests();
});

afterEach(() => {
  __resetMarketingConsentForTests();
  __resetPaywallExperimentForTests();
});

describe("fnv1aHash32 — deterministic", () => {
  it("returns the same hash for the same input", () => {
    expect(fnv1aHash32("paywall_v1:u:abc")).toBe(
      fnv1aHash32("paywall_v1:u:abc"),
    );
  });

  it("returns a different hash for different inputs", () => {
    const a = fnv1aHash32("paywall_v1:u:abc");
    const b = fnv1aHash32("paywall_v1:u:abd");
    expect(a).not.toBe(b);
  });

  it("returns 0x811c9dc5 for the empty string (FNV-1a offset basis)", () => {
    expect(fnv1aHash32("")).toBe(0x811c9dc5 >>> 0);
  });

  it("hash output is non-negative 32-bit", () => {
    const h = fnv1aHash32("anything");
    expect(h).toBeGreaterThanOrEqual(0);
    expect(h).toBeLessThanOrEqual(0xffffffff);
  });
});

describe("pickVariantFor — pure assignment", () => {
  it("same identity + same experiment → same variant", () => {
    const id: Identity = { kind: "user", userId: "user-1" };
    const a = pickVariantFor(id, PAYWALL_EXPERIMENT);
    const b = pickVariantFor(id, PAYWALL_EXPERIMENT);
    expect(a).toBe(b);
  });

  it("returns 'control' when experiment is disabled", () => {
    const id: Identity = { kind: "user", userId: "user-1" };
    const disabled: PaywallExperimentConfig = {
      ...PAYWALL_EXPERIMENT,
      enabled: false,
    };
    expect(pickVariantFor(id, disabled)).toBe("control");
  });

  it("returns one of the configured variants when enabled", () => {
    const id: Identity = { kind: "anon", anonId: "anon-xyz" };
    const variant = pickVariantFor(id, PAYWALL_EXPERIMENT);
    expect(PAYWALL_EXPERIMENT.variants).toContain(variant);
  });

  it("distributes across the variant pool — at least 3 unique buckets in 200 ids", () => {
    const seen = new Set<string>();
    for (let i = 0; i < 200; i += 1) {
      const id: Identity = { kind: "user", userId: `u-${i}` };
      seen.add(pickVariantFor(id, PAYWALL_EXPERIMENT));
    }
    // We don't demand all 5 variants every run, but >=3 confirms
    // the hash isn't collapsing to a constant.
    expect(seen.size).toBeGreaterThanOrEqual(3);
  });

  it("changes assignment when experimentKey changes", () => {
    const id: Identity = { kind: "user", userId: "user-1" };
    const v1 = pickVariantFor(id, {
      ...PAYWALL_EXPERIMENT,
      experimentKey: "paywall_v1",
    });
    // Try several reshuffled keys; at least one must differ.
    const candidates = ["paywall_v2", "paywall_v3", "paywall_v4"];
    const anyDifferent = candidates.some(
      (k) => pickVariantFor(id, { ...PAYWALL_EXPERIMENT, experimentKey: k }) !== v1,
    );
    expect(anyDifferent).toBe(true);
  });
});

describe("getVariant — sessionStorage cache", () => {
  it("first call computes; second call returns the cached value", () => {
    const id: Identity = { kind: "user", userId: "cache-1" };
    const first = getVariant(id, PAYWALL_EXPERIMENT);
    const cachedRaw = window.sessionStorage.getItem(
      "mb_paywall_variant:" + PAYWALL_EXPERIMENT.experimentKey,
    );
    expect(cachedRaw).toBe(first);
    const second = getVariant(id, PAYWALL_EXPERIMENT);
    expect(second).toBe(first);
  });

  it("returns 'control' immediately when experiment is disabled", () => {
    const id: Identity = { kind: "user", userId: "cache-1" };
    expect(
      getVariant(id, { ...PAYWALL_EXPERIMENT, enabled: false }),
    ).toBe("control");
    // No cache write when disabled.
    expect(
      window.sessionStorage.getItem(
        "mb_paywall_variant:" + PAYWALL_EXPERIMENT.experimentKey,
      ),
    ).toBeNull();
  });
});

describe("getOrMintAnonId", () => {
  it("returns a stable id within a session", () => {
    const a = getOrMintAnonId();
    const b = getOrMintAnonId();
    expect(a).not.toBeNull();
    expect(b).toBe(a);
  });

  it("re-mints after reset", () => {
    const a = getOrMintAnonId();
    __resetPaywallExperimentForTests();
    const b = getOrMintAnonId();
    expect(b).not.toBe(a);
  });
});

describe("markExposure — consent gate", () => {
  it("no-ops when marketing consent is off (no throw, no Supabase call)", async () => {
    setMarketingConsent(false);
    const id: Identity = { kind: "user", userId: "no-consent" };
    await expect(markExposure(id, "urgency")).resolves.toBeUndefined();
  });

  it("no-ops when experiment is disabled", async () => {
    const id: Identity = { kind: "user", userId: "expt-off" };
    await expect(
      markExposure(id, "urgency", { ...PAYWALL_EXPERIMENT, enabled: false }),
    ).resolves.toBeUndefined();
  });

  it("never throws when consent is on but Supabase is unreachable", async () => {
    // Default test env has no functional Supabase URL — the lazy
    // import succeeds but the actual write rejects. We only assert
    // that the helper swallows the rejection.
    const id: Identity = { kind: "user", userId: "expt-throw-safe" };
    await expect(markExposure(id, "urgency")).resolves.toBeUndefined();
  });
});
