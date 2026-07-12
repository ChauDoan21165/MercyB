// @vitest-environment jsdom

import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  __resetPriceTestForTests,
  getPriceTestMissingConfig,
  markCheckoutCompleteRecorded,
  resolvePriceTestPlan,
} from "@/lib/pricing/priceTest";

const control = {
  monthPriceId: "price_control_month",
  yearPriceId: "price_control_year",
  monthlyAmountVnd: 200_000,
  yearlyAmountVnd: 2_000_000,
};

const testConfig = {
  monthPriceId: "price_test_month",
  yearPriceId: "price_test_year",
  monthlyAmountVnd: 250_000,
  yearlyAmountVnd: 2_500_000,
};

describe("priceTest", () => {
  beforeEach(() => {
    __resetPriceTestForTests(window.localStorage);
    vi.restoreAllMocks();
  });

  it("stays on control and does not persist an assignment when disabled", () => {
    const plan = resolvePriceTestPlan({
      userId: "user-a",
      control,
      enabled: false,
      testConfig,
      storage: window.localStorage,
      randomId: () => "anon-a",
      now: () => new Date("2026-07-12T00:00:00Z"),
    });

    expect(plan.variant).toBe("control");
    expect(plan.monthPriceId).toBe(control.monthPriceId);
    expect(window.localStorage.getItem("mb_price_test_assignment_v1")).toBeNull();
  });

  it("persists the first enabled assignment so login cannot reroll the browser", () => {
    const first = resolvePriceTestPlan({
      userId: null,
      control,
      enabled: true,
      testConfig,
      storage: window.localStorage,
      randomId: () => "anon-stable",
      now: () => new Date("2026-07-12T00:00:00Z"),
    });

    const afterLogin = resolvePriceTestPlan({
      userId: "user-after-login",
      control,
      enabled: true,
      testConfig,
      storage: window.localStorage,
      randomId: () => "anon-other",
      now: () => new Date("2026-07-13T00:00:00Z"),
    });

    expect(afterLogin.variant).toBe(first.variant);
    expect(afterLogin.identityKey).toBe(first.identityKey);
    expect(afterLogin.assignedAt).toBe(first.assignedAt);
  });

  it("falls back to control and logs exact missing env names when test config is incomplete", () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const plan = resolvePriceTestPlan({
      userId: "user-a",
      control,
      enabled: true,
      testConfig: { monthPriceId: "price_test_month" },
      storage: window.localStorage,
      randomId: () => "anon-a",
      now: () => new Date("2026-07-12T00:00:00Z"),
    });

    expect(plan.variant).toBe("control");
    expect(plan.exposureEligible).toBe(false);
    expect(plan.configWarning).toContain("VITE_STRIPE_PRICE_ONE_YEAR_TEST");
    expect(plan.configWarning).toContain("VITE_PRICE_TEST_MONTHLY_VND");
    expect(errorSpy).toHaveBeenCalledWith(
      "[price-test] missing env config",
      expect.objectContaining({
        missing: expect.arrayContaining(["VITE_STRIPE_PRICE_ONE_YEAR_TEST", "VITE_PRICE_TEST_MONTHLY_VND"]),
      }),
    );
  });

  it("reports all required variant-B config keys", () => {
    expect(getPriceTestMissingConfig({})).toEqual([
      "VITE_STRIPE_PRICE_ONE_MONTH_TEST",
      "VITE_STRIPE_PRICE_ONE_YEAR_TEST",
      "VITE_PRICE_TEST_MONTHLY_VND",
      "VITE_PRICE_TEST_YEARLY_VND",
    ]);
  });

  it("deduplicates checkout-complete recording by key", () => {
    expect(markCheckoutCompleteRecorded("session-1", window.localStorage)).toBe(true);
    expect(markCheckoutCompleteRecorded("session-1", window.localStorage)).toBe(false);
    expect(markCheckoutCompleteRecorded("session-2", window.localStorage)).toBe(true);
  });
});
