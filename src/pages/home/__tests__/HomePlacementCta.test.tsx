// @vitest-environment jsdom

import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { RenderResult, screen as Screen } from "@testing-library/react";
import type { ComponentType, ReactElement } from "react";
import type { MemoryRouter as MemoryRouterType, useLocation as useLocationType } from "react-router-dom";
import type { LearningEvent, LearningEventFilter } from "@/lib/tutor/learningEvents";

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

const { profileQueryState } = vi.hoisted(() => ({
  profileQueryState: {
    data: undefined as unknown,
    isLoading: true,
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
  useProfileQuery: () => profileQueryState,
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

type ReactModule = typeof import("react");
type Render = typeof import("@testing-library/react").render;
type Cleanup = typeof import("@testing-library/react").cleanup;
type ScreenApi = typeof Screen;
type MemoryRouterComponent = typeof MemoryRouterType;
type UseLocation = typeof useLocationType;
type GetLearningEvents = (filter?: LearningEventFilter) => LearningEvent[];

let React: ReactModule;
let render: Render;
let cleanup: Cleanup | null = null;
let screen: ScreenApi;
let Home: ComponentType;
let MemoryRouter: MemoryRouterComponent;
let useLocation: UseLocation;
let getLearningEvents: GetLearningEvents;

function createMemoryStorage(): Storage {
  const entries = new Map<string, string>();
  return {
    get length() {
      return entries.size;
    },
    clear: vi.fn(() => {
      entries.clear();
    }),
    getItem: vi.fn((key: string) => entries.get(key) ?? null),
    key: vi.fn((index: number) => Array.from(entries.keys())[index] ?? null),
    removeItem: vi.fn((key: string) => {
      entries.delete(key);
    }),
    setItem: vi.fn((key: string, value: string) => {
      entries.set(key, String(value));
    }),
  };
}

function installPinnedBrowserState() {
  Object.defineProperty(window, "localStorage", {
    configurable: true,
    value: createMemoryStorage(),
  });
  Object.defineProperty(window, "sessionStorage", {
    configurable: true,
    value: createMemoryStorage(),
  });
  window.history.replaceState({}, "", "/");
  Object.defineProperty(window, "innerWidth", {
    configurable: true,
    value: 1024,
  });
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    value: vi.fn(() => ({
      matches: false,
      media: "",
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(() => false),
    })),
  });
}

async function importFreshHomeHarness() {
  vi.resetModules();
  installPinnedBrowserState();
  const [reactModule, testingLibrary, router, learningEvents, homeModule] = await Promise.all([
    import("react"),
    import("@testing-library/react"),
    import("react-router-dom"),
    import("@/lib/tutor/learningEvents"),
    import("@/pages/Home"),
  ]);
  React = reactModule;
  render = testingLibrary.render;
  cleanup = testingLibrary.cleanup;
  screen = testingLibrary.screen;
  MemoryRouter = router.MemoryRouter;
  useLocation = router.useLocation;
  getLearningEvents = learningEvents.getLearningEvents;
  Home = homeModule.default;
}

function LocationProbe() {
  const location = useLocation();
  return React.createElement("div", { "data-testid": "pathname" }, location.pathname);
}

function renderHome(): RenderResult {
  return render(
    React.createElement(
      MemoryRouter,
      { initialEntries: ["/"] },
      React.createElement(LocationProbe),
      React.createElement(Home),
    ) as ReactElement,
  );
}

function pinViewportWidth(width: number) {
  Object.defineProperty(window, "innerWidth", {
    configurable: true,
    value: width,
  });
  window.dispatchEvent(new Event("resize"));
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
  beforeEach(async () => {
    cleanup?.();
    document.body.innerHTML = "";
    vi.clearAllMocks();
    vi.useRealTimers();
    featureFlagState.calls = [];
    profileQueryState.data = undefined;
    profileQueryState.isLoading = true;
    isPlacementEntryRouteAvailable.mockReturnValue(false);
    mockSignedOutAccess();
    await importFreshHomeHarness();
  });

  afterEach(() => {
    cleanup?.();
    document.body.innerHTML = "";
  });

  it("shows the Placement CTA with Vietnamese copy when the placement route flag is disabled", async () => {
    renderHome();

    // Chau superseded the old product contract: the Home card is always visible;
    // /placement itself is always mounted regardless of build-time flags.
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

  it("routes the Placement card to /placement with placement flags off and records telemetry", async () => {
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

  it("routes the mobile parent start action synchronously while profile resolution is still pending", async () => {
    mockSignedInAccess();
    pinViewportWidth(390);
    renderHome();

    expect(screen.getByTestId("pathname")).toHaveTextContent("/");

    await userEvent.click(
      screen.getByRole("button", { name: "Góc phụ huynh. Preview details" }),
    );
    await userEvent.click(screen.getByRole("button", { name: "Mở góc phụ huynh →" }));

    expect(screen.getByText("Góc phụ huynh")).toBeInTheDocument();
    expect(screen.getByTestId("pathname")).toHaveTextContent("/parent/me");
  });
});
