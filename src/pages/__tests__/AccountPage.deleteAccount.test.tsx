import { screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { renderWithRouter, userEvent } from "@/test/test-utils";
import AccountPage from "../AccountPage";

const mocks = vi.hoisted(() => ({
  navigate: vi.fn(),
  invokeDeleteAccount: vi.fn(),
  getSession: vi.fn(),
  supabaseSignOut: vi.fn(),
  authSignOut: vi.fn(),
  refreshEntitlements: vi.fn(),
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mocks.navigate,
  };
});

vi.mock("@/providers/AuthProvider", () => ({
  useAuth: () => ({
    user: { id: "user-123", email: "learner@example.com" },
    isLoading: false,
    signOut: mocks.authSignOut,
  }),
}));

vi.mock("@/lib/supabaseClient", () => ({
  supabase: {
    auth: {
      getSession: mocks.getSession,
      signOut: mocks.supabaseSignOut,
    },
    functions: {
      invoke: mocks.invokeDeleteAccount,
    },
    from: vi.fn(() => {
      const chain = {
        delete: vi.fn(() => chain),
        eq: vi.fn(() => Promise.resolve({ data: null, error: null })),
      };
      return chain;
    }),
  },
}));

vi.mock("@/lib/useEntitlements", () => ({
  useEntitlements: () => ({
    ent: null,
    loading: false,
    refreshEntitlements: mocks.refreshEntitlements,
  }),
}));

vi.mock("@/hooks/useFeatureFlag", () => ({
  useFeatureFlag: () => ({ enabled: false, loading: false }),
}));

vi.mock("@/hooks/admin/useAdminAccess", () => ({
  useAdminAccess: () => ({
    loading: false,
    permissions: { level: 0 },
  }),
}));

vi.mock("@/lib/queries/useProfileQuery", () => ({
  useProfileQuery: () => ({ data: null }),
}));

vi.mock("@/lib/i18n/chromeLanguage", () => ({
  useChromeLanguage: () => "en",
}));

vi.mock("@/components/GiftCodeModal", () => ({
  GiftCodeModal: () => null,
}));

vi.mock("@/components/account/PowerUserSection", () => ({
  default: () => null,
}));

vi.mock("@/components/account/LanguagePairSettings", () => ({
  default: () => null,
}));

vi.mock("@/components/streak/StreakHistoryPanel", () => ({
  StreakHistoryPanel: () => null,
}));

vi.mock("@/components/referral/ReferralCard", () => ({
  ReferralCard: () => null,
}));

vi.mock("@/components/certificates/CertificatesAccountEntry", () => ({
  CertificatesAccountEntry: () => null,
}));

vi.mock("@/components/referral/ApplyReferralCodeForm", () => ({
  ApplyReferralCodeForm: () => null,
}));

vi.mock("@/components/account/TrackingConsentPanel", () => ({
  TrackingConsentPanel: () => null,
}));

vi.mock("@/components/leaderboard/WeeklyLeaderboardOptInPanel", () => ({
  WeeklyLeaderboardOptInPanel: () => null,
}));

vi.mock("@/components/leaderboard/ReferralLeaderboardOptInPanel", () => ({
  ReferralLeaderboardOptInPanel: () => null,
}));

describe("Account page delete-account guard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getSession.mockResolvedValue({
      data: { session: { access_token: "test-access-token" } },
      error: null,
    });
    mocks.invokeDeleteAccount.mockResolvedValue({ data: { ok: true }, error: null });
    mocks.supabaseSignOut.mockResolvedValue({ error: null });
    mocks.authSignOut.mockResolvedValue(undefined);
  });

  it("keeps the user-facing account deletion flow wired to the delete-account function", async () => {
    const user = userEvent.setup();

    renderWithRouter(<AccountPage />, { initialEntries: ["/account"] });

    await user.click(screen.getByRole("button", { name: "Delete my account" }));

    const permanentDeleteButton = screen.getByRole("button", {
      name: "Permanently delete",
    });
    expect(permanentDeleteButton).toBeDisabled();

    await user.type(screen.getByLabelText(/Type DELETE to confirm/i), "DELETE");
    expect(permanentDeleteButton).toBeEnabled();

    await user.click(permanentDeleteButton);

    await waitFor(() => {
      expect(mocks.invokeDeleteAccount).toHaveBeenCalledWith("delete-account", {
        body: {},
        headers: { Authorization: "Bearer test-access-token" },
      });
    });
    expect(mocks.supabaseSignOut).toHaveBeenCalledTimes(1);
    expect(mocks.navigate).toHaveBeenCalledWith("/", { replace: true });
  });
});
