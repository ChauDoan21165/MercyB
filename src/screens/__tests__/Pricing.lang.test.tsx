// @vitest-environment jsdom
//
// Pricing — bilingual `lang` attributes (P4).
//
// Pins the !64 audit's P4 fix: every bilingual block on the Pricing
// page declares `lang="vi"` / `lang="en"` on its respective language
// elements. Without these attrs, a VI screen-reader voice phoneticises
// EN with Vietnamese phonemes (and vice-versa); WCAG 3.1.2.
//
// Third of three sibling lang-attr fixes:
//   ✅ O2 — Onboarding peer header (!87)
//   ✅ W2 — WeakAt taxonomy        (!96)
//   ✅ P4 — Pricing                (this MR)
//
// Mock posture: minimal. Pricing reads `useAuth` + `getPlatform` +
// fires `fetchMyEntitlement` on mount; we stub all of these so the
// component renders synchronously into the `defaultPricingMarkup`
// branch with no network and no real entitlement.

import React from "react";
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { screen, cleanup, renderWithRouter } from "@/test/test-utils";

vi.mock("@/providers/AuthProvider", () => ({
  useAuth: () => ({ user: null }),
}));

vi.mock("@/lib/billing", () => ({
  fetchMyEntitlement: vi.fn().mockResolvedValue({ is_premium: false }),
  openBillingPortal: vi.fn(),
  startCheckoutOrOpenPortal: vi.fn(),
}));

vi.mock("@/lib/platform", () => ({
  getPlatform: () => "web",
}));

vi.mock("@/lib/analytics", () => ({
  trackCheckoutStarted: vi.fn(),
  trackPaywallShown: vi.fn(),
  trackPricingViewed: vi.fn(),
}));

vi.mock("@/components/pricing/PaywallExperiment", () => ({
  // Render the control fallback directly so the test sees the
  // canonical Pricing markup (the same path real users see by default).
  default: ({ controlFallback }: { controlFallback: React.ReactNode }) => (
    <>{controlFallback}</>
  ),
}));

vi.mock("@/components/pricing/IapPlanCard", () => ({
  default: () => <div data-testid="iap-card" />,
}));

vi.mock("@/components/seo/SeoMeta", () => ({
  default: () => null,
}));

import Pricing from "../Pricing";

beforeEach(() => {
  vi.spyOn(console, "log").mockImplementation(() => {});
  vi.spyOn(console, "warn").mockImplementation(() => {});
  vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

function renderPricing() {
  return renderWithRouter(<Pricing />, { initialEntries: ["/pricing"] });
}

describe("Pricing — bilingual lang attrs (P4)", () => {
  it("hero h1 carries lang='en' and VI subtitle carries lang='vi'", async () => {
    renderPricing();
    const h1 = await screen.findByRole("heading", {
      name: "Get full access to all premium rooms",
      level: 1,
    });
    expect(h1.getAttribute("lang")).toBe("en");

    const viSub = screen.getByText("Mở toàn bộ phòng học premium của MercyBlade");
    expect(viSub.getAttribute("lang")).toBe("vi");
  });

  it("hero supporting paragraphs are bilingual-paired with langs", async () => {
    renderPricing();
    const en = await screen.findByText(
      "Choose a plan that fits your learning pace. Upgrade anytime.",
    );
    expect(en.getAttribute("lang")).toBe("en");

    const vi = screen.getByText(
      "Chọn gói phù hợp với tốc độ học của bạn. Có thể nâng cấp bất cứ lúc nào.",
    );
    expect(vi.getAttribute("lang")).toBe("vi");
  });

  it("feature-grid checkmark rows pair EN + VI with langs", async () => {
    renderPricing();
    // "Full access to all premium rooms" / "Toàn quyền truy cập phòng premium"
    const en = await screen.findByText(/Full access to all premium rooms/);
    expect(en.getAttribute("lang")).toBe("en");
    const vi = screen.getByText("Toàn quyền truy cập phòng premium");
    expect(vi.getAttribute("lang")).toBe("vi");
  });

  it("plan card titles split into EN + VI spans with langs", async () => {
    renderPricing();
    // The free plan's EN title is "Level 0"; the VI peer is "Miễn phí".
    // Both live inside the same h3.
    const en = await screen.findByText("Level 0");
    expect(en.getAttribute("lang")).toBe("en");
    const vi = screen.getByText("Miễn phí");
    expect(vi.getAttribute("lang")).toBe("vi");
  });

  it("auto-renewal disclosure: EN <p> + VI <p> both tagged", async () => {
    renderPricing();
    const en = await screen.findByText(/Your subscription renews automatically/);
    expect(en.closest("p")?.getAttribute("lang")).toBe("en");
    const vi = screen.getByText(/Gói đăng ký tự động gia hạn/);
    expect(vi.getAttribute("lang")).toBe("vi");
  });

  it("legal-link anchors split bilingual content into per-language spans", async () => {
    renderPricing();
    // The legal links each render "<vi> / <en>" inside the anchor.
    const termsVi = await screen.findByText("Điều khoản sử dụng");
    expect(termsVi.getAttribute("lang")).toBe("vi");
    const termsEn = screen.getByText("Terms of Use (EULA)");
    expect(termsEn.getAttribute("lang")).toBe("en");
    const privacyVi = screen.getByText("Chính sách quyền riêng tư");
    expect(privacyVi.getAttribute("lang")).toBe("vi");
    const privacyEn = screen.getByText("Privacy Policy");
    expect(privacyEn.getAttribute("lang")).toBe("en");
  });

  it("sweep: every non-empty <p> in the rendered output declares a lang", async () => {
    const { container } = renderPricing();
    // Wait for the async entitlement fetch to settle so the full markup
    // is mounted (the test seam pre-resolves it, but await one tick).
    await screen.findByRole("heading", {
      name: "Get full access to all premium rooms",
      level: 1,
    });
    const paragraphs = Array.from(
      container.querySelectorAll<HTMLParagraphElement>("p"),
    );
    expect(paragraphs.length).toBeGreaterThan(0);
    for (const p of paragraphs) {
      const text = (p.textContent ?? "").trim();
      if (text.length === 0) continue;
      // Skip <p aria-hidden="true" /> decorative placeholders (priceStyle).
      if (p.getAttribute("aria-hidden") === "true") continue;
      expect(
        p.getAttribute("lang"),
        `<p>"${text.slice(0, 50)}…" has no lang attr — Pricing lang regression?`,
      ).toMatch(/^(vi|en)$/);
    }
  });
});
