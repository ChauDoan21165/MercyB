// api/_lib/__tests__/entitlementAgreement.test.ts
//
// Contract test: deriveEntitlement (_shared/entitlement.ts) and
// resolveConversationEntitlementAccess (api/_lib/conversationEntitlement.ts)
// must agree on is_premium for every fixture class.
//
// Why this test exists: mercy-ai.ts fetches me-entitlement (which calls
// deriveEntitlement) then gates on resolveConversationEntitlementAccess.
// If either function diverges on a fixture, this suite fails and names
// the divergence class — exposing the FOLLOW-403 class of bug where
// "active + past expiry" was premium in deriveEntitlement but should not
// be.  A failing test here with is_premium true/false mismatch against
// the expected column is the divergence the gate was built to catch.
//
// Fixture classes (per dispatch brief):
//   active           — status=active, future expiry             → premium
//   expired          — status=active, PAST expiry (bug case)    → NOT premium
//   trialing         — status=trialing, future expiry           → premium
//   gift             — gift_code source, null expiry (lifetime) → premium
//   test-grant       — no provider, null expiry (manual grant)  → premium
//   tier-null        — entitlement snapshot is null (fetch fail)→ NOT premium
//   provider-null    — provider=null, active, future expiry     → premium

import { describe, expect, it } from "vitest";
import {
  deriveEntitlement,
  type EntitlementInput,
} from "../../../supabase/functions/_shared/entitlement";
import { resolveConversationEntitlementAccess } from "../conversationEntitlement";

const NOW_MS = new Date("2026-06-01T00:00:00.000Z").getTime();
const ONE_DAY = 24 * 60 * 60 * 1000;
const future = (days = 30) => new Date(NOW_MS + days * ONE_DAY).toISOString();
const past = (days = 30) => new Date(NOW_MS - days * ONE_DAY).toISOString();

// Each fixture encodes a subscription row shape + the EXPECTED is_premium
// after the B13 expiry fix. A test fails if deriveEntitlement diverges from
// expected, or if resolveConversationEntitlementAccess diverges from derive.
const FIXTURES: Array<{
  label: string;
  row: EntitlementInput;
  expectedIsPremium: boolean;
}> = [
  {
    label: "active — future expiry",
    row: {
      status: "active",
      current_period_end: future(30),
      provider: "stripe",
    },
    expectedIsPremium: true,
  },
  {
    label:
      "active — past expiry (FOLLOW-403 bug class: was premium before B13)",
    row: { status: "active", current_period_end: past(1), provider: "stripe" },
    expectedIsPremium: false,
  },
  {
    label: "active — expiry exactly at NOW (strict boundary: expired)",
    row: {
      status: "active",
      current_period_end: new Date(NOW_MS).toISOString(),
      provider: "stripe",
    },
    expectedIsPremium: false,
  },
  {
    label: "active — null expiry (lifetime / no-period)",
    row: { status: "active", provider: "stripe" },
    expectedIsPremium: true,
  },
  {
    label: "trialing — future expiry",
    row: {
      status: "trialing",
      current_period_end: future(14),
      provider: "stripe",
    },
    expectedIsPremium: true,
  },
  {
    label: "trialing — past expiry",
    row: {
      status: "trialing",
      current_period_end: past(1),
      provider: "stripe",
    },
    expectedIsPremium: false,
  },
  {
    label: "gift — gift_code source, null expiry (lifetime gift code)",
    row: { status: "active", source: "gift_code" },
    expectedIsPremium: true,
  },
  {
    label: "gift — gift source alias, future expiry",
    row: { status: "active", source: "gift", current_period_end: future(365) },
    expectedIsPremium: true,
  },
  {
    label: "test-grant — no provider, null expiry (manual admin grant)",
    row: { status: "active", provider: null },
    expectedIsPremium: true,
  },
  {
    label:
      "test-grant — no provider, far future expiry (FOLLOW-403 account shape: active + 2030)",
    row: {
      status: "active",
      provider: null,
      current_period_end: "2030-01-01T00:00:00.000Z",
    },
    expectedIsPremium: true,
  },
  {
    label: "provider-null — null provider field, active, future expiry",
    row: { status: "active", provider: null, current_period_end: future(30) },
    expectedIsPremium: true,
  },
  {
    label: "provider-null — provider absent entirely, active, future expiry",
    row: { status: "active", current_period_end: future(30) },
    expectedIsPremium: true,
  },
  {
    label: "paused — never premium regardless of expiry",
    row: {
      status: "paused",
      current_period_end: future(30),
      provider: "stripe",
    },
    expectedIsPremium: false,
  },
  {
    label: "expired-status — never premium",
    row: {
      status: "expired",
      current_period_end: future(30),
      provider: "stripe",
    },
    expectedIsPremium: false,
  },
  {
    label: "revoked — never premium",
    row: {
      status: "revoked",
      current_period_end: future(30),
      provider: "stripe",
    },
    expectedIsPremium: false,
  },
  {
    label: "canceled + future expiry — expired, not premium",
    row: {
      status: "canceled",
      current_period_end: future(5),
      provider: "stripe",
    },
    expectedIsPremium: false,
  },
  {
    label: "canceled + past expiry — expired, not premium",
    row: {
      status: "canceled",
      current_period_end: past(5),
      provider: "stripe",
    },
    expectedIsPremium: false,
  },
];

describe("entitlement agreement: deriveEntitlement × resolveConversationEntitlementAccess", () => {
  it.each(FIXTURES)("$label", ({ row, expectedIsPremium }) => {
    const snapshot = deriveEntitlement([row], NOW_MS);

    // Gate 1: deriveEntitlement must produce the correct is_premium for this
    // fixture. If this fails, the shared derive diverges from the spec.
    expect(snapshot.is_premium).toBe(expectedIsPremium);

    // Gate 2: resolveConversationEntitlementAccess must agree with the
    // snapshot is_premium (no adminLevel override). If this fails, the
    // conversation gate reads is_premium differently from what derive emits.
    const access = resolveConversationEntitlementAccess({
      entitlement: snapshot,
      adminLevel: 0,
    });
    expect(access).toBe(snapshot.is_premium);
  });
});

// Empty-row case: me-entitlement returns { is_premium: false } for a user
// with zero subscription rows. resolveConversationEntitlementAccess must
// honour the null/absent entitlement at every possible shape.
describe("tier-null — entitlement snapshot absent or null (me-entitlement fetch failure)", () => {
  it("entitlement=null → not premium (fail closed)", () => {
    expect(
      resolveConversationEntitlementAccess({ entitlement: null, adminLevel: 0 })
    ).toBe(false);
  });

  it("entitlement=undefined → not premium (fail closed)", () => {
    expect(
      resolveConversationEntitlementAccess({
        entitlement: undefined,
        adminLevel: 0,
      })
    ).toBe(false);
  });

  it("entitlement={ is_premium: undefined } → not premium (missing field)", () => {
    expect(
      resolveConversationEntitlementAccess({
        entitlement: { is_premium: undefined },
        adminLevel: 0,
      })
    ).toBe(false);
  });

  it("zero subscription rows → deriveEntitlement is_premium=false, resolveConversationEntitlementAccess agrees", () => {
    const snapshot = deriveEntitlement([], NOW_MS);
    expect(snapshot.is_premium).toBe(false);
    expect(
      resolveConversationEntitlementAccess({
        entitlement: snapshot,
        adminLevel: 0,
      })
    ).toBe(false);
  });

  it("is_premium truthy non-boolean (e.g. 1) → resolveConversationEntitlementAccess gates it (strict ===)", () => {
    // deriveEntitlement always emits boolean; this tests the resolver's
    // strict-equality guard against a hypothetical non-boolean from an
    // external API response.
    expect(
      resolveConversationEntitlementAccess({
        entitlement: { is_premium: 1 as unknown },
        adminLevel: 0,
      })
    ).toBe(false);
  });
});

// Admin bypass: adminLevel >= 9 grants access regardless of entitlement.
describe("admin bypass", () => {
  it("adminLevel=9 grants access even when entitlement is null", () => {
    expect(
      resolveConversationEntitlementAccess({ entitlement: null, adminLevel: 9 })
    ).toBe(true);
  });

  it("adminLevel=8 does NOT bypass — still gated by entitlement", () => {
    expect(
      resolveConversationEntitlementAccess({
        entitlement: { is_premium: false },
        adminLevel: 8,
      })
    ).toBe(false);
  });

  it("adminLevel='9' (string) — readAdminLevel parses it, grants access", () => {
    expect(
      resolveConversationEntitlementAccess({
        entitlement: null,
        adminLevel: "9",
      })
    ).toBe(true);
  });
});
