// @vitest-environment jsdom

import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, renderWithRouter, screen } from "@/test/test-utils";

const h = vi.hoisted(() => ({
  platform: "web" as "web" | "ios" | "android",
  fetchMyEntitlement: vi.fn(),
  openBillingPortal: vi.fn(),
  startCheckoutOrOpenPortal: vi.fn(),
}));

vi.mock("@/providers/AuthProvider", () => ({
  useAuth: () => ({ user: null }),
}));

vi.mock("@/hooks/useUserAccess", () => ({
  useUserAccess: () => ({ hasPremium: false }),
}));

vi.mock("@/lib/billing", () => ({
  fetchMyEntitlement: h.fetchMyEntitlement,
  openBillingPortal: h.openBillingPortal,
  startCheckoutOrOpenPortal: h.startCheckoutOrOpenPortal,
}));

vi.mock("@/lib/iap", () => ({
  shouldShowIap: () => h.platform === "ios" || h.platform === "android",
  getNativeBillingStoreName: () => h.platform === "android" ? "Google Play" : "Apple",
  getManageSubscriptionsUrl: () => h.platform === "android"
    ? "https://play.google.com/store/account/subscriptions?package=com.mercyapps.mercyblade"
    : "https://apps.apple.com/account/subscriptions",
}));

vi.mock("@/lib/analytics", () => ({
  trackCheckoutStarted: vi.fn(),
  trackPaywallShown: vi.fn(),
  trackPriceTestCheckoutStart: vi.fn(),
  trackPriceTestVariantExposure: vi.fn(),
  trackPricingViewed: vi.fn(),
}));

vi.mock("@/components/pricing/PaywallExperiment", () => ({
  default: ({ controlFallback }: { controlFallback: React.ReactNode }) => (
    <>{controlFallback}</>
  ),
}));

vi.mock("@/components/pricing/IapPlanCard", () => ({
  default: () => <div data-testid="iap-card">RevenueCat IAP card</div>,
}));

vi.mock("@/components/seo/SeoMeta", () => ({
  default: () => null,
}));

import Pricing from "../Pricing";

function renderPricing() {
  return renderWithRouter(<Pricing />, { initialEntries: ["/pricing"] });
}

describe("Pricing native billing gate", () => {
  beforeEach(() => {
    cleanup();
    h.platform = "web";
    h.fetchMyEntitlement.mockResolvedValue({ is_premium: false });
    h.openBillingPortal.mockReset();
    h.startCheckoutOrOpenPortal.mockReset();
  });

  it("renders Stripe plan cards on web", async () => {
    renderPricing();

    expect(await screen.findByText("Secure Stripe checkout")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Upgrade monthly/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Upgrade yearly/i })).toBeInTheDocument();
    expect(screen.queryByTestId("iap-card")).not.toBeInTheDocument();
  });

  it("renders the RevenueCat IAP card instead of Stripe checkout on Android native", async () => {
    h.platform = "android";
    renderPricing();

    expect(await screen.findByText("Billed through Google Play")).toBeInTheDocument();
    expect(screen.getByTestId("iap-card")).toBeInTheDocument();
    expect(screen.queryByText("Secure Stripe checkout")).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Upgrade monthly/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Upgrade yearly/i })).not.toBeInTheDocument();
  });

  it("keeps iOS on the same RevenueCat IAP path", async () => {
    h.platform = "ios";
    renderPricing();

    expect(await screen.findByText("Billed through Apple")).toBeInTheDocument();
    expect(screen.getByTestId("iap-card")).toBeInTheDocument();
    expect(screen.queryByText("Secure Stripe checkout")).not.toBeInTheDocument();
  });
});
