import { afterEach, describe, expect, it, vi } from "vitest";

import {
  dispatchEntitlementRefresh,
  ENTITLEMENT_REFRESH_EVENT,
  subscribeToEntitlementRefresh,
} from "@/lib/entitlementRefresh";

describe("entitlement refresh event", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("notifies subscribers when refresh is dispatched", () => {
    vi.stubGlobal("window", new EventTarget());
    const listener = vi.fn();
    const unsubscribe = subscribeToEntitlementRefresh(listener);

    dispatchEntitlementRefresh();

    expect(listener).toHaveBeenCalledTimes(1);
    unsubscribe();
  });

  it("uses the shared event name", () => {
    expect(ENTITLEMENT_REFRESH_EVENT).toBe("mercyblade:entitlement-refresh");
  });
});
