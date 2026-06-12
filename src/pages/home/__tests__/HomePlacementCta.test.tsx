// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, useLocation } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { getLearningEvents } from "@/lib/tutor/learningEvents";

const { isPlacementEntryRouteAvailable, useAuthMock, useUserAccessMock } = vi.hoisted(() => ({
  isPlacementEntryRouteAvailable: vi.fn(() => false),
  useAuthMock: vi.fn(),
  useUserAccessMock: vi.fn(),
}));

const { featureFlagState } = vi.hoisted(() => ({
  featureFlagState: {
    calls: [] as Array<{
      key: string;
      defaultValue: boolean;
      enabled: boolean;
    }>,
  },
}));

vi.mock("@/lib/placement/availability", () => ({
  isPlacementEntryRouteAvailable,
}));

vi.mock("@/lib/lazyWithRetry", () => ({
  lazyWithRetry: () => () => null,
}));

vi.mock("@/hooks/useUserAccess", () => ({
  useUserAccess: useUserAccessMock,
}));

vi.mock("@/providers/AuthProvider", () => ({
  useAuth: useAuthMock,
}));

vi.mock("@/hooks/useFeatureFlag", () => ({
  useFeatureFlag: (key: string, defaultValue = false) => {
    featureFlagState.calls.push({ key, defaultValue, enabled: false });
    return { enabled: false, loading: false };
  },
}));

vi.mock("@/lib/queries/useProfileQuery", () => ({
  useProfileQuery: () => ({ data: undefined }),
}));

vi.mock("@/pages/home/LanguageTrackHome", () => ({
  default: () => <section data-testid="language-track-home">Language Track</section>,
  TargetSwitcher: () => <div data-testid="target-switcher" />,
}));

vi.mock("@/components/audio/BottomMusicBar", () => ({
  default: () => null,
}));
vi.mock("@/components/home/DailyChallengeCard", () => ({
  default: () => null,
}));
vi.mock("@/components/home/FocusAreasCard", () => ({
  default: () => null,
}));
vi.mock("@/components/home/PracticeRecommendationCard", () => ({
  default: () => null,
}));
vi.mock("@/components/home/RecommendedDrillCard", () => ({
  default: () => null,
}));
vi.mock("@/components/home/WeeklyProgressWidget", () => ({
  default: () => null,
}));
vi.mock("@/components/home/StoryPromptCard", () => ({
  default: () => null,
}));
vi.mock("@/components/leaderboard/LeaderboardCard", () => ({
  default: () => null,
}));
vi.mock("@/components/streak/StreakBadge", () => ({
  StreakBadge: () => null,
}));
vi.mock("@/components/xp/XPBadge", () => ({
  XPBadge: () => null,
}));

import Home from "@/pages/Home";

function LocationProbe() {
  const location = useLocation();
  return <div data-testid="pathname">{location.pathname}</div>;
}

function renderHome() {
  return render(
    <MemoryRouter>
      <LocationProbe />
      <Home />
    </MemoryRouter>,
  );
}

function mockSignedOutAccess() {
  useAuthMock.mockReturnValue({ user: null, isLoading: false });
  useUserAccessMock.mockReturnValue({
    accessAnnouncement: "",
    features: new Set(["mercy-guide"]),
    hasMercyGuide: true,
    isAuthenticated: false,
    isTrialExpired: false,
    loading: false,
  });
}

function mockSignedInAccess() {
  useAuthMock.mockReturnValue({ user: { id: "user-1" }, isLoading: false });
  useUserAccessMock.mockReturnValue({
    accessAnnouncement: "",
    features: new Set(["mercy-guide"]),
    hasMercyGuide: true,
    isAuthenticated: true,
    isTrialExpired: false,
    loading: false,
  });
}

describe("Home placement CTA", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    featureFlagState.calls = [];
    isPlacementEntryRouteAvailable.mockReturnValue(false);
    mockSignedOutAccess();
    window.localStorage.clear();
    window.sessionStorage.clear();
    window.history.pushState({}, "", "/");
    Object.defineProperty(window, "innerWidth", {
      configurable: true,
      value: 1024,
    });
    Object.defineProperty(window, "matchMedia", {
      configurable: true,
      value: vi.fn(() => ({
        matches: false,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      })),
    });
  });

  it("shows the Placement CTA with Vietnamese copy when the placement route flag is disabled", async () => {
    renderHome();

    // Chau superseded the old product contract: the Home card is always visible;
    // PlacementV3Gate owns any flag-off handling at the /placement route.
    expect(screen.getByRole("button", { name: "Placement test" })).toBeInTheDocument();
    expect(screen.getByText("Kiểm tra trình độ")).toBeInTheDocument();
    expect(screen.queryByText("Take Placement Test")).not.toBeInTheDocument();
  });

  it("shows the Placement CTA for authenticated learners", async () => {
    mockSignedInAccess();
    renderHome();

    expect(screen.getByRole("button", { name: "Placement test" })).toBeInTheDocument();
    expect(screen.getByText("Kiểm tra trình độ")).toBeInTheDocument();
  });

  it("routes to /placement and records telemetry when clicked", async () => {
    isPlacementEntryRouteAvailable.mockReturnValue(true);
    renderHome();

    await userEvent.click(screen.getByRole("button", { name: "Placement test" }));

    expect(screen.getByText("Kiểm tra trình độ")).toBeInTheDocument();
    expect(screen.getByTestId("pathname")).toHaveTextContent("/placement");
    expect(getLearningEvents({ eventType: "placement_cta_clicked" })).toEqual([
      expect.objectContaining({
        eventType: "placement_cta_clicked",
        product: "ai_tutor",
        targetLanguage: "en",
        safeTopicTag: "placement",
      }),
    ]);
  });

  it("shows the parent progress card for signed-in users and routes to ParentView with runtime flags off", async () => {
    useAuthMock.mockReturnValue({
      user: { id: "user-parent", email: "parent@example.test" },
      isLoading: false,
    });
    useUserAccessMock.mockReturnValue({
      accessAnnouncement: "",
      features: new Set(["mercy-guide"]),
      hasMercyGuide: true,
      isAuthenticated: true,
      isTrialExpired: false,
      loading: false,
    });
    renderHome();

    await userEvent.click(screen.getByTestId("parent-progress-home-card"));

    expect(screen.getByText("Góc phụ huynh")).toBeInTheDocument();
    expect(screen.getByText("Theo dõi tiến bộ của con")).toBeInTheDocument();
    expect(featureFlagState.calls).toContainEqual({
      key: "mercyblade_leaderboard_enabled",
      defaultValue: false,
      enabled: false,
    });
    expect(screen.getByTestId("pathname")).toHaveTextContent("/parent/me");
  });
});
