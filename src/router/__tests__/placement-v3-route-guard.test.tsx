// @vitest-environment jsdom

import { render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter, useLocation } from "react-router-dom";

type AuthState = {
  user: { id: string; email?: string } | null;
  isLoading: boolean;
};

const authState: AuthState = {
  user: { id: "test-user", email: "test@mercyblade.local" },
  isLoading: false,
};

vi.mock("@/providers/AuthProvider", () => ({
  useAuth: () => authState,
}));

vi.mock("@/hooks/useUserAccess", () => ({
  useUserAccess: () => ({ isTrialExpired: false, isLoading: false }),
}));

vi.mock("@/components/FeedbackBar", () => ({ FeedbackBar: () => null }));
vi.mock("@/components/xp/LevelUpModal", () => ({ LevelUpModal: () => null }));
vi.mock("@/components/certificates/MilestoneObserver", () => ({
  MilestoneObserver: () => null,
}));
vi.mock("@/components/certificates/CertificateToast", () => ({
  CertificateToast: () => null,
}));
vi.mock("@/components/LessonUiLangToggle", () => ({
  default: () => null,
  useLessonUiLang: () => ["vi", vi.fn()],
}));

vi.mock("@/pages/Home", () => ({
  default: () => <main data-testid="home-page">Home</main>,
}));
vi.mock("@/pages/LoginPage", () => ({
  default: () => <main data-testid="signin-page">Sign in</main>,
}));
vi.mock("@/pages/placement/v3/WelcomePage", () => ({
  default: () => <main data-testid="placement-v3-welcome">Placement V3 Welcome</main>,
}));
vi.mock("@/pages/placement/v3/WhoForPage", () => ({
  default: () => <main data-testid="placement-v3-who">Placement V3 Who</main>,
}));
vi.mock("@/pages/placement/v3/TestPage", () => ({
  default: () => <main data-testid="placement-v3-test">Placement V3 Test</main>,
}));
vi.mock("@/pages/placement/v3/ResultsPage", () => ({
  default: () => <main data-testid="placement-v3-results">Placement V3 Results</main>,
}));
vi.mock("@/pages/placement/v3/ResumePage", () => ({
  default: () => <main data-testid="placement-v3-resume">Placement V3 Resume</main>,
}));
vi.mock("@/pages/placement/v3/SkipConfirmPage", () => ({
  default: () => <main data-testid="placement-v3-skip">Placement V3 Skip</main>,
}));

function LocationProbe() {
  const location = useLocation();
  return (
    <>
      <div data-testid="pathname">{location.pathname}</div>
      <div data-testid="search">{location.search}</div>
    </>
  );
}

async function renderRoute(
  path: string,
  flags: {
    placementTestEnabled?: boolean;
    placementV3UiEnabled?: boolean;
  } = {},
) {
  vi.resetModules();
  vi.stubEnv(
    "VITE_PLACEMENT_TEST_ENABLED",
    flags.placementTestEnabled ? "true" : "false",
  );
  vi.stubEnv(
    "VITE_PLACEMENT_V3_UI_ENABLED",
    flags.placementV3UiEnabled ? "true" : "false",
  );
  const { default: AppRouter } = await import("@/router/AppRouter");

  return render(
    <MemoryRouter initialEntries={[path]}>
      <LocationProbe />
      <AppRouter />
    </MemoryRouter>,
  );
}

describe("Placement V3 route guard", () => {
  beforeEach(() => {
    authState.user = { id: "test-user", email: "test@mercyblade.local" };
    authState.isLoading = false;
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.clearAllMocks();
  });

  it("keeps Placement V3 compile-time flags disabled by default", async () => {
    vi.resetModules();
    vi.unstubAllEnvs();
    const { FEATURE_FLAGS } = await import("@/lib/featureFlags");

    expect(FEATURE_FLAGS.PLACEMENT_TEST_ENABLED).toBe(false);
    expect(FEATURE_FLAGS.PLACEMENT_V3_UI_ENABLED).toBe(false);
  });

  it("disabled flags block learner entry to /placement before V3 UI can mount", async () => {
    await renderRoute("/placement");

    expect(await screen.findByTestId("home-page")).toBeInTheDocument();
    expect(screen.getByTestId("pathname")).toHaveTextContent("/");
    expect(screen.queryByTestId("placement-v3-welcome")).not.toBeInTheDocument();
  });

  it("handles direct guarded Placement V3 URLs safely when flags are disabled", async () => {
    await renderRoute("/placement/results/session-123");

    expect(await screen.findByTestId("home-page")).toBeInTheDocument();
    expect(screen.getByTestId("pathname")).toHaveTextContent("/");
    expect(screen.queryByTestId("placement-v3-results")).not.toBeInTheDocument();
  });

  it("redirects safely on refresh of a guarded Placement V3 route", async () => {
    window.localStorage.setItem(
      "mb.placement.v3.stub.session",
      JSON.stringify({ sessionId: "session-123", status: "in_progress" }),
    );

    await renderRoute("/placement/resume");

    expect(await screen.findByTestId("home-page")).toBeInTheDocument();
    expect(screen.getByTestId("pathname")).toHaveTextContent("/");
    expect(screen.queryByTestId("placement-v3-resume")).not.toBeInTheDocument();
  });

  it("keeps Placement V3 unreachable when only the legacy test flag is disabled and V3 UI is disabled", async () => {
    await renderRoute("/placement", {
      placementTestEnabled: false,
      placementV3UiEnabled: false,
    });

    expect(await screen.findByTestId("home-page")).toBeInTheDocument();
    expect(screen.queryByTestId("placement-v3-welcome")).not.toBeInTheDocument();
  });

  it("allows the mocked Placement V3 flow when the V3 UI flag is enabled", async () => {
    await renderRoute("/placement", {
      placementTestEnabled: false,
      placementV3UiEnabled: true,
    });

    await waitFor(() => {
      expect(screen.getByTestId("placement-v3-welcome")).toBeInTheDocument();
    });
    expect(screen.getByTestId("pathname")).toHaveTextContent("/placement");
    expect(screen.queryByTestId("home-page")).not.toBeInTheDocument();
  });

  it("renders /placement/who for a signed-in user when the V3 UI flag is enabled", async () => {
    await renderRoute("/placement/who?v=auth-redirect-4", {
      placementTestEnabled: false,
      placementV3UiEnabled: true,
    });

    await waitFor(() => {
      expect(screen.getByTestId("placement-v3-who")).toBeInTheDocument();
    });
    expect(screen.getByTestId("pathname")).toHaveTextContent("/placement/who");
    expect(screen.getByTestId("search")).toHaveTextContent("?v=auth-redirect-4");
    expect(screen.queryByTestId("home-page")).not.toBeInTheDocument();
    expect(screen.queryByTestId("signin-page")).not.toBeInTheDocument();
  });

  it("enabled test flags still require auth for direct Placement V3 routes", async () => {
    authState.user = null;

    await renderRoute("/placement/test/session-123", {
      placementTestEnabled: true,
      placementV3UiEnabled: true,
    });

    expect(await screen.findByTestId("signin-page")).toBeInTheDocument();
    expect(screen.getByTestId("pathname")).toHaveTextContent("/signin");
    expect(screen.queryByTestId("placement-v3-test")).not.toBeInTheDocument();
  });

  it("redirects logged-out /placement/who to sign-in with returnTo preserved", async () => {
    authState.user = null;

    await renderRoute("/placement/who");

    expect(await screen.findByTestId("signin-page")).toBeInTheDocument();
    expect(screen.getByTestId("pathname")).toHaveTextContent("/signin");
    expect(screen.getByTestId("search")).toHaveTextContent(
      "?returnTo=%2Fplacement%2Fwho",
    );
    expect(screen.queryByTestId("home-page")).not.toBeInTheDocument();
    expect(screen.queryByTestId("placement-v3-who")).not.toBeInTheDocument();
  });
});
