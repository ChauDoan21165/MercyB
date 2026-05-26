// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, useLocation } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { getLearningEvents } from "@/lib/tutor/learningEvents";

const { isPlacementEntryRouteAvailable } = vi.hoisted(() => ({
  isPlacementEntryRouteAvailable: vi.fn(() => false),
}));

vi.mock("@/lib/placement/availability", () => ({
  isPlacementEntryRouteAvailable,
}));

vi.mock("@/lib/lazyWithRetry", () => ({
  lazyWithRetry: () => () => null,
}));

vi.mock("@/hooks/useUserAccess", () => ({
  useUserAccess: () => ({
    accessAnnouncement: "",
    features: new Set(["mercy-guide"]),
    hasMercyGuide: true,
    isAuthenticated: false,
    isTrialExpired: false,
    loading: false,
  }),
}));

vi.mock("@/providers/AuthProvider", () => ({
  useAuth: () => ({ user: null, isLoading: false }),
}));

vi.mock("@/hooks/useFeatureFlag", () => ({
  useFeatureFlag: () => ({ enabled: false, loading: false }),
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

describe("Home placement CTA gating", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    isPlacementEntryRouteAvailable.mockReturnValue(false);
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

  it("does not show the Placement CTA when the placement route is disabled", async () => {
    renderHome();

    expect(screen.queryByRole("button", { name: "Placement test" })).not.toBeInTheDocument();
    expect(screen.queryByText("Take Placement Test")).not.toBeInTheDocument();
  });

  it("shows the Placement CTA and routes to /placement when placement is enabled", async () => {
    isPlacementEntryRouteAvailable.mockReturnValue(true);
    renderHome();

    await userEvent.click(screen.getByRole("button", { name: "Placement test" }));

    expect(screen.getByText("Take Placement Test")).toBeInTheDocument();
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
});
