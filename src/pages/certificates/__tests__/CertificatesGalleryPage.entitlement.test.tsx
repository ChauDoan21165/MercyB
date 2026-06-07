import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import CertificatesGalleryPage from "../CertificatesGalleryPage";
import {
  resolveEntitlementTier,
  type BackendEntitlement,
} from "@/lib/authService";
import type { EarnedCertificate } from "@/lib/certificates/types";

const { accessState, listEarnedCertificatesMock } = vi.hoisted(() => ({
  accessState: {
    hasPremium: true,
    isLoading: false,
    loading: false,
  } as { hasPremium: boolean; isLoading: boolean; loading: boolean },
  listEarnedCertificatesMock: vi.fn(),
}));

vi.mock("@/hooks/useFeatureFlag", () => ({
  useFeatureFlag: () => ({ enabled: true, loading: false }),
}));

vi.mock("@/providers/AuthProvider", () => ({
  useAuth: () => ({ user: { id: "user-1" }, isLoading: false }),
}));

vi.mock("@/hooks/useUserAccess", () => ({
  useUserAccess: () => accessState,
}));

vi.mock("@/lib/certificates/rpc", () => ({
  listEarnedCertificates: (...args: unknown[]) => listEarnedCertificatesMock(...args),
}));

const entitlement = (overrides: Partial<BackendEntitlement>): BackendEntitlement => ({
  is_premium: false,
  source: "stripe",
  status: "inactive",
  expires_at: null,
  current_period_end: null,
  plan_name: null,
  tier_id: null,
  price_id: null,
  cancel_at_period_end: null,
  ...overrides,
});

function setAccessFromEntitlement(ent: BackendEntitlement | null) {
  accessState.hasPremium = resolveEntitlementTier(ent) !== "level0";
  accessState.isLoading = false;
  accessState.loading = false;
}

const earnedCertificate: EarnedCertificate = {
  id: "cert-1",
  user_id: "user-1",
  certificate_type: "xp_100",
  earned_at: "2026-01-01T00:00:00Z",
  certificate_code: "cert-code-1",
  metadata: {},
};

function renderPage() {
  return render(
    <MemoryRouter>
      <CertificatesGalleryPage />
    </MemoryRouter>,
  );
}

beforeEach(() => {
  listEarnedCertificatesMock.mockReset();
  listEarnedCertificatesMock.mockResolvedValue([earnedCertificate]);
  setAccessFromEntitlement(entitlement({
    is_premium: true,
    status: "active",
    tier_id: "premium_year",
    current_period_end: "2027-01-01T00:00:00Z",
    expires_at: "2027-01-01T00:00:00Z",
  }));
});

describe("CertificatesGalleryPage entitlement nudge", () => {
  it("pro user with active subscription and future period_end does not see the premium nudge", async () => {
    setAccessFromEntitlement(entitlement({
      is_premium: true,
      status: "active",
      tier_id: "premium_year",
      current_period_end: "2027-01-01T00:00:00Z",
      expires_at: "2027-01-01T00:00:00Z",
    }));

    renderPage();

    expect(await screen.findByTestId("certificates-grid")).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.queryByTestId("certificates-premium-nudge")).not.toBeInTheDocument();
    });
  });

  it("non-pro user with earned certificates sees the premium nudge", async () => {
    setAccessFromEntitlement(entitlement({
      is_premium: false,
      status: "inactive",
    }));

    renderPage();

    expect(await screen.findByTestId("certificates-grid")).toBeInTheDocument();
    expect(screen.getByTestId("certificates-premium-nudge")).toBeInTheDocument();
  });
});
