import { describe, expect, it } from "vitest";
import { resolveConversationEntitlementAccess } from "../conversationEntitlement";

describe("resolveConversationEntitlementAccess", () => {
  it("allows canonical premium entitlement snapshots", () => {
    expect(
      resolveConversationEntitlementAccess({
        entitlement: { is_premium: true },
        adminLevel: 0,
      }),
    ).toBe(true);
  });

  it("allows high-admin accounts even when billing entitlement is free", () => {
    expect(
      resolveConversationEntitlementAccess({
        entitlement: { is_premium: false },
        adminLevel: 9,
      }),
    ).toBe(true);
  });

  it("gates free non-admin accounts", () => {
    expect(
      resolveConversationEntitlementAccess({
        entitlement: { is_premium: false },
        adminLevel: 0,
      }),
    ).toBe(false);
  });
});
