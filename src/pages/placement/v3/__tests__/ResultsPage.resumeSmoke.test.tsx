import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes, useLocation, useParams } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import RoomRenderer from "@/components/room/RoomRenderer";
import ResultsPage from "../ResultsPage";
import { getResults } from "@/lib/placement/v3/clientStub";
import type { PlacementV3Recommendation, PlacementV3Results } from "@/lib/placement/v3/types";

vi.mock("@/lib/placement/v3/clientStub", () => ({
  getResults: vi.fn(),
}));

vi.mock("@/hooks/useUserAccess", () => ({
  useUserAccess: () => ({ loading: false, tier: "level9", userTier: "level9" }),
}));

vi.mock("@/components/room/hooks/useAuthUser", () => ({
  useAuthUser: () => null,
}));

vi.mock("@/components/room/hooks/useRoomFeedback", () => ({
  useRoomFeedback: () => ({
    feedbackText: "",
    setFeedbackText: vi.fn(),
    feedbackSending: false,
    feedbackError: null,
    setFeedbackError: vi.fn(),
    feedbackSent: false,
    setFeedbackSent: vi.fn(),
    sendFeedback: vi.fn(),
  }),
}));

vi.mock("@/components/room/roomEntriesDb", () => ({
  fetchRoomEntriesDb: vi.fn(async () => ({ rows: [], error: null })),
  coerceRoomEntryRowToEntry: (row: unknown) => row,
}));

vi.mock("@/lib/supabaseClient", () => ({
  supabase: {
    from: () => ({
      select: () => ({
        eq: () => ({
          order: () => ({
            limit: async () => ({ data: [], error: null }),
          }),
        }),
      }),
      insert: () => ({
        select: () => ({
          single: async () => ({ data: null, error: null }),
        }),
      }),
    }),
    channel: () => {
      const channel = {
        on: () => channel,
        subscribe: (callback?: () => void) => {
          callback?.();
          return channel;
        },
      };
      return channel;
    },
    removeChannel: vi.fn(),
  },
}));

vi.mock("@/lib/i18n/chromeLanguage", () => ({
  useChromeLanguage: () => "en",
  useChromeT: () => (value: { en: string; vi: string }) => value.en,
}));

vi.mock("@/lib/monitoring/captureException", () => ({
  captureMessage: vi.fn(),
}));

vi.mock("@/services/studyLog", () => ({
  addStudyLogEntry: vi.fn(),
}));

vi.mock("@/services/pointsService", () => ({
  awardPoints: vi.fn(),
}));

vi.mock("@/services/roomProgress", () => ({
  trackRoomEntry: vi.fn(),
  updateRoomProgress: vi.fn(),
}));

vi.mock("@/services/userBehavior", () => ({
  trackKeyword: vi.fn(),
  trackRoomVisit: vi.fn(),
}));

const ACTIVE_LESSON_KEY = "mb.placement.v3.activeLesson";
const SESSION_ID = "resume-session";
const OTHER_SESSION_ID = "other-session";
const ROOM_ID = "resume_target_room";
const NEXT_ROOM_ID = "next_recommended_room";
const NORMAL_ROOM_ID = "already_normal_room";

type MarkerCondition = "valid" | "stale" | "malformed" | "different-session" | "completed";

type DebugInput = {
  expectedRoute: string;
  actualRoute: string;
  lessonId: string;
  markerBefore: string | null;
  markerAfter: string | null;
  markerCondition: MarkerCondition;
  actionAttempted: string;
};

function debugMessage(debug: DebugInput) {
  return [
    `expected route: ${debug.expectedRoute}`,
    `actual route: ${debug.actualRoute}`,
    `lesson ID: ${debug.lessonId}`,
    `marker before: ${debug.markerBefore ?? "<empty>"}`,
    `marker after: ${debug.markerAfter ?? "<empty>"}`,
    `marker condition: ${debug.markerCondition}`,
    `action attempted: ${debug.actionAttempted}`,
  ].join("\n");
}

function expectRoute(debug: DebugInput) {
  expect(debug.actualRoute, debugMessage(debug)).toBe(debug.expectedRoute);
}

function expectRouteDoesNotContain(route: string, blocked: string, debug: DebugInput) {
  expect(route, debugMessage(debug)).not.toContain(blocked);
}

function expectMarkerRoom(input: {
  expectedRoomId: string | null;
  lessonId: string;
  markerBefore?: string | null;
  markerCondition: MarkerCondition;
  actionAttempted: string;
}) {
  const markerAfter = window.localStorage.getItem(ACTIVE_LESSON_KEY);
  const actualRoomId = markerRoomId();
  expect(actualRoomId, debugMessage({
    expectedRoute: input.expectedRoomId ?? "<no marker>",
    actualRoute: actualRoomId ?? "<no marker>",
    lessonId: input.lessonId,
    markerBefore: input.markerBefore ?? null,
    markerAfter,
    markerCondition: input.markerCondition,
    actionAttempted: input.actionAttempted,
  })).toBe(input.expectedRoomId);
}

function markerRoomId() {
  const raw = window.localStorage.getItem(ACTIVE_LESSON_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as { roomId?: unknown };
    return typeof parsed.roomId === "string" ? parsed.roomId : null;
  } catch {
    return null;
  }
}

function markerCompletionCount() {
  const raw = window.localStorage.getItem(ACTIVE_LESSON_KEY);
  if (!raw) return 0;
  const parsed = JSON.parse(raw) as { completionCount?: unknown };
  return typeof parsed.completionCount === "number" ? parsed.completionCount : 0;
}

function markerCompletedRoomIds() {
  const raw = window.localStorage.getItem(ACTIVE_LESSON_KEY);
  if (!raw) return [];
  const parsed = JSON.parse(raw) as { completedRoomIds?: unknown };
  return Array.isArray(parsed.completedRoomIds)
    ? parsed.completedRoomIds.filter((value): value is string => typeof value === "string")
    : [];
}

function expectNoTechnicalRecoveryCopy() {
  for (const text of ["localStorage", "JSON", "marker", "malformed", "stale", "corrupt", "session mismatch"]) {
    expect(screen.queryByText(new RegExp(text, "i"))).not.toBeInTheDocument();
  }
}

function expectNoRouteChange(input: {
  actualRoute: string;
  lessonId: string;
  markerBefore: string | null;
  markerCondition: MarkerCondition;
  actionAttempted: string;
}) {
  expectRoute({
    expectedRoute: `/placement/results/${SESSION_ID}`,
    actualRoute: input.actualRoute,
    lessonId: input.lessonId,
    markerBefore: input.markerBefore,
    markerAfter: window.localStorage.getItem(ACTIVE_LESSON_KEY),
    markerCondition: input.markerCondition,
    actionAttempted: input.actionAttempted,
  });
}

function LocationProbe({ onChange }: { onChange: (value: string) => void }) {
  const location = useLocation();
  const value = `${location.pathname}${location.search}`;
  onChange(value);
  return <div data-testid="location">{value}</div>;
}

function RoutedRoom() {
  const { roomId = "" } = useParams();
  const title = roomId === ROOM_ID || roomId === NEXT_ROOM_ID || roomId === NORMAL_ROOM_ID || roomId === "daily:a1_basics"
    ? "Resume Target Lesson"
    : "Wrong Lesson";
  return (
    <RoomRenderer
      room={{
        id: roomId,
        title: { en: title, vi: "Bài học tiếp tục" },
        tier: "level0",
        intro_en: "Resume smoke room",
        intro_vi: "Phòng kiểm tra học tiếp",
        entries: [{
          id: "entry-1",
          slug: "focus",
          keywords_en: ["focus"],
          keywords_vi: ["trọng tâm"],
          copy: { en: "Focus practice continues the same lesson after reload.", vi: "Tiếp tục đúng bài sau khi tải lại." },
        }],
      }}
      roomId={roomId}
    />
  );
}

function recommendation(roomId: string, title = roomId): PlacementV3Recommendation {
  return {
    roomId,
    title: { en: title || "Empty lesson", vi: "Bài học" },
    description: { en: "Recommended after placement.", vi: "Đề xuất sau kiểm tra." },
    cefr: "A2",
    reason: { en: "Matches placement.", vi: "Phù hợp kết quả." },
  };
}

function results(recommendations: PlacementV3Recommendation[] = [
  recommendation(`room:${ROOM_ID}`, "Resume Target Lesson"),
  recommendation(`room:${NEXT_ROOM_ID}`, "Next Lesson"),
]): PlacementV3Results {
  return {
    sessionId: SESSION_ID,
    completedAt: "2026-05-21T00:00:00.000Z",
    overallCefr: "A2",
    overallConfidence: 0.72,
    overallSummary: { en: "A2 with next lesson.", vi: "A2 với bài tiếp theo." },
    skills: [
      { modality: "speaking", cefr: "A2", confidence: 0.7, summary: { en: "A2 speaking.", vi: "Nói A2." } },
    ],
    l1Flags: [],
    recommendations,
    strengths: [],
    gaps: [],
    questionCount: 1,
  };
}

function cacheResults(value: PlacementV3Results = results()) {
  window.sessionStorage.setItem(`mb.placement.v3.results.${SESSION_ID}`, JSON.stringify(value));
}

function setMarker(input: {
  sessionId?: string;
  roomId?: string;
  completedRoomIds?: string[];
  completionCount?: number;
}) {
  window.localStorage.setItem(ACTIVE_LESSON_KEY, JSON.stringify({
    sessionId: input.sessionId ?? SESSION_ID,
    roomId: input.roomId ?? ROOM_ID,
    completedRoomIds: input.completedRoomIds ?? [],
    completionCount: input.completionCount ?? input.completedRoomIds?.length ?? 0,
  }));
}

function renderResultsRoute(onChange?: (value: string) => void, initialEntry = `/placement/results/${SESSION_ID}`) {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <LocationProbe onChange={onChange ?? (() => {})} />
      <Routes>
        <Route path="/placement/results/:sessionId" element={<ResultsPage />} />
        <Route path="/room/:roomId" element={<RoutedRoom />} />
      </Routes>
    </MemoryRouter>,
  );
}

async function clickStartAndExpectRoute(input: {
  lessonId: string;
  expectedRoute: string;
  markerCondition: MarkerCondition;
}) {
  let currentUrl = "";
  renderResultsRoute((value) => {
    currentUrl = value;
  });
  await userEvent.click(screen.getByRole("button", { name: /Start this lesson/i }));
  expectRoute({
    expectedRoute: input.expectedRoute,
    actualRoute: currentUrl,
    lessonId: input.lessonId,
    markerBefore: null,
    markerAfter: window.localStorage.getItem(ACTIVE_LESSON_KEY),
    markerCondition: input.markerCondition,
    actionAttempted: "click Start this lesson",
  });
  return currentUrl;
}

async function clickResumeAndExpectRoute(input: {
  lessonId: string;
  expectedRoute: string;
  markerCondition: MarkerCondition;
}) {
  let currentUrl = "";
  renderResultsRoute((value) => {
    currentUrl = value;
  });
  const resumeButton = await screen.findByRole("button", { name: /Resume lesson/i });
  await userEvent.click(resumeButton);
  expectRoute({
    expectedRoute: input.expectedRoute,
    actualRoute: currentUrl,
    lessonId: input.lessonId,
    markerBefore: null,
    markerAfter: window.localStorage.getItem(ACTIVE_LESSON_KEY),
    markerCondition: input.markerCondition,
    actionAttempted: "click Resume lesson",
  });
  return currentUrl;
}

async function completeRoomOnce() {
  const keyword = await screen.findByRole("button", { name: /focus/i });
  await userEvent.click(keyword);
  await userEvent.type(screen.getByLabelText(/Room reflection/i), "I practiced the resume lesson.");
  await userEvent.click(screen.getByRole("button", { name: /^Save reflection$/i }));
  await screen.findByText(/Reflection saved/i);
}

beforeEach(() => {
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    writable: true,
    value: vi.fn((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
});

afterEach(() => {
  window.sessionStorage.clear();
  window.localStorage.clear();
  vi.clearAllMocks();
});

describe("Placement V3 resume reliability", () => {
  it("refetches results when the cached result payload is corrupted", async () => {
    const freshResults = results();
    vi.mocked(getResults).mockResolvedValueOnce(freshResults);
    window.sessionStorage.setItem(`mb.placement.v3.results.${SESSION_ID}`, "{bad json");

    renderResultsRoute();

    expect(await screen.findByText("A2 with next lesson.")).toBeInTheDocument();
    expect(getResults).toHaveBeenCalledWith(SESSION_ID);
    expect(window.sessionStorage.getItem(`mb.placement.v3.results.${SESSION_ID}`)).toBeNull();
  });

  it("start recommended lesson persists marker", async () => {
    const lessonId = `room:${ROOM_ID}`;
    cacheResults();
    await clickStartAndExpectRoute({ lessonId, expectedRoute: `/room/${ROOM_ID}`, markerCondition: "valid" });
    expectMarkerRoom({ expectedRoomId: ROOM_ID, lessonId, markerCondition: "valid", actionAttempted: "click Start this lesson" });
  });

  it("reload resumes same lesson", async () => {
    const lessonId = `room:${ROOM_ID}`;
    cacheResults();
    let currentUrl = "";
    const first = renderResultsRoute((value) => {
      currentUrl = value;
    });
    await userEvent.click(screen.getByRole("button", { name: /Start this lesson/i }));
    expectRoute({
      expectedRoute: `/room/${ROOM_ID}`,
      actualRoute: currentUrl,
      lessonId,
      markerBefore: null,
    markerAfter: window.localStorage.getItem(ACTIVE_LESSON_KEY),
      markerCondition: "valid",
      actionAttempted: "click Start this lesson",
    });
    first.unmount();
    renderResultsRoute((value) => {
      currentUrl = value;
    }, currentUrl);
    expect(await screen.findByText("Resume Target Lesson / Bài học tiếp tục")).toBeInTheDocument();
    expectRoute({
      expectedRoute: `/room/${ROOM_ID}`,
      actualRoute: currentUrl,
      lessonId,
      markerBefore: null,
    markerAfter: window.localStorage.getItem(ACTIVE_LESSON_KEY),
      markerCondition: "valid",
      actionAttempted: "reload room route",
    });
  });

  it("return-to-ResultsPage resumes same lesson", async () => {
    const lessonId = `room:${ROOM_ID}`;
    cacheResults();
    setMarker({ roomId: ROOM_ID });
    await clickResumeAndExpectRoute({ lessonId, expectedRoute: `/room/${ROOM_ID}`, markerCondition: "valid" });
  });

  it("completed active lesson does not resume", async () => {
    const lessonId = `room:${ROOM_ID}`;
    cacheResults();
    setMarker({ roomId: ROOM_ID, completedRoomIds: [ROOM_ID] });
    renderResultsRoute();
    await waitFor(() => expect(markerRoomId()).toBe(NEXT_ROOM_ID));
    expect(markerRoomId(), debugMessage({
      expectedRoute: NEXT_ROOM_ID,
      actualRoute: markerRoomId() ?? "<no marker>",
      lessonId,
      markerBefore: null,
    markerAfter: window.localStorage.getItem(ACTIVE_LESSON_KEY),
      markerCondition: "completed",
      actionAttempted: "load ResultsPage",
    })).not.toBe(ROOM_ID);
  });

  it("next recommended lesson becomes target", async () => {
    const lessonId = `room:${NEXT_ROOM_ID}`;
    cacheResults();
    setMarker({ roomId: ROOM_ID, completedRoomIds: [ROOM_ID] });
    await clickResumeAndExpectRoute({ lessonId, expectedRoute: `/room/${NEXT_ROOM_ID}`, markerCondition: "completed" });
  });

  it("stale marker ignored and cleared", async () => {
    const lessonId = "stale_room";
    cacheResults();
    window.localStorage.setItem(ACTIVE_LESSON_KEY, JSON.stringify({ roomId: lessonId, completedRoomIds: [] }));
    renderResultsRoute();
    await waitFor(() => expect(window.localStorage.getItem(ACTIVE_LESSON_KEY), debugMessage({
      expectedRoute: "<no marker>",
      actualRoute: window.localStorage.getItem(ACTIVE_LESSON_KEY) ?? "<no marker>",
      lessonId,
      markerBefore: null,
    markerAfter: window.localStorage.getItem(ACTIVE_LESSON_KEY),
      markerCondition: "stale",
      actionAttempted: "load ResultsPage",
    })).toBeNull());
  });

  it("malformed marker ignored and cleared", async () => {
    const lessonId = "{bad";
    cacheResults();
    window.localStorage.setItem(ACTIVE_LESSON_KEY, "{bad json");
    renderResultsRoute();
    await waitFor(() => expect(window.localStorage.getItem(ACTIVE_LESSON_KEY), debugMessage({
      expectedRoute: "<no marker>",
      actualRoute: window.localStorage.getItem(ACTIVE_LESSON_KEY) ?? "<no marker>",
      lessonId,
      markerBefore: null,
    markerAfter: window.localStorage.getItem(ACTIVE_LESSON_KEY),
      markerCondition: "malformed",
      actionAttempted: "load ResultsPage",
    })).toBeNull());
  });

  it("different placement/session marker ignored", async () => {
    const lessonId = `room:${ROOM_ID}`;
    cacheResults();
    setMarker({ sessionId: OTHER_SESSION_ID, roomId: ROOM_ID });
    renderResultsRoute();
    await waitFor(() => expect(window.localStorage.getItem(ACTIVE_LESSON_KEY), debugMessage({
      expectedRoute: "<no marker>",
      actualRoute: window.localStorage.getItem(ACTIVE_LESSON_KEY) ?? "<no marker>",
      lessonId,
      markerBefore: null,
    markerAfter: window.localStorage.getItem(ACTIVE_LESSON_KEY),
      markerCondition: "different-session",
      actionAttempted: "load ResultsPage",
    })).toBeNull());
  });

  it("room not in recommendations ignored", async () => {
    const lessonId = "missing_room";
    cacheResults();
    setMarker({ roomId: lessonId });
    renderResultsRoute();
    await waitFor(() => expect(window.localStorage.getItem(ACTIVE_LESSON_KEY), debugMessage({
      expectedRoute: "<no marker>",
      actualRoute: window.localStorage.getItem(ACTIVE_LESSON_KEY) ?? "<no marker>",
      lessonId,
      markerBefore: null,
    markerAfter: window.localStorage.getItem(ACTIVE_LESSON_KEY),
      markerCondition: "stale",
      actionAttempted: "load ResultsPage",
    })).toBeNull());
  });

  it("double-click Start does not double-navigate", async () => {
    const lessonId = `room:${ROOM_ID}`;
    cacheResults();
    const routeChanges: string[] = [];
    renderResultsRoute((value) => routeChanges.push(value));
    await userEvent.dblClick(screen.getByRole("button", { name: /Start this lesson/i }));
    const expectedRoute = `/room/${ROOM_ID}`;
    expect(routeChanges.filter((route) => route === expectedRoute).length, debugMessage({
      expectedRoute,
      actualRoute: routeChanges.join(" -> "),
      lessonId,
      markerBefore: null,
    markerAfter: window.localStorage.getItem(ACTIVE_LESSON_KEY),
      markerCondition: "valid",
      actionAttempted: "double-click Start this lesson",
    })).toBe(1);
  });

  it("double-click Resume does not double-navigate", async () => {
    const lessonId = `room:${ROOM_ID}`;
    cacheResults();
    setMarker({ roomId: ROOM_ID });
    const routeChanges: string[] = [];
    renderResultsRoute((value) => routeChanges.push(value));
    await userEvent.dblClick(await screen.findByRole("button", { name: /Resume lesson/i }));
    const expectedRoute = `/room/${ROOM_ID}`;
    expect(routeChanges.filter((route) => route === expectedRoute).length, debugMessage({
      expectedRoute,
      actualRoute: routeChanges.join(" -> "),
      lessonId,
      markerBefore: null,
    markerAfter: window.localStorage.getItem(ACTIVE_LESSON_KEY),
      markerCondition: "valid",
      actionAttempted: "double-click Resume lesson",
    })).toBe(1);
  });

  it("duplicate RoomRenderer completion does not double-count", async () => {
    const lessonId = `room:${ROOM_ID}`;
    setMarker({ roomId: ROOM_ID });
    renderResultsRoute(undefined, `/room/${ROOM_ID}`);
    await completeRoomOnce();
    await userEvent.click(screen.getByRole("button", { name: /^Save reflection$/i }));
    expect(markerCompletionCount(), debugMessage({
      expectedRoute: "1 completion",
      actualRoute: `${markerCompletionCount()} completions`,
      lessonId,
      markerBefore: null,
    markerAfter: window.localStorage.getItem(ACTIVE_LESSON_KEY),
      markerCondition: "completed",
      actionAttempted: "click Save reflection twice",
    })).toBe(1);
  });

  it("duplicate completion after remount does not double-count", async () => {
    const lessonId = `room:${ROOM_ID}`;
    setMarker({ roomId: ROOM_ID });
    const first = renderResultsRoute(undefined, `/room/${ROOM_ID}`);
    await completeRoomOnce();
    first.unmount();
    renderResultsRoute(undefined, `/room/${ROOM_ID}`);
    await userEvent.click(await screen.findByRole("button", { name: /^Save reflection$/i }));
    expect(markerCompletionCount(), debugMessage({
      expectedRoute: "1 completion",
      actualRoute: `${markerCompletionCount()} completions`,
      lessonId,
      markerBefore: null,
    markerAfter: window.localStorage.getItem(ACTIVE_LESSON_KEY),
      markerCondition: "completed",
      actionAttempted: "save after RoomRenderer remount",
    })).toBe(1);
  });

  it("room-prefixed lesson routes to /room/<id>", async () => {
    const lessonId = `room:${ROOM_ID}`;
    cacheResults(results([recommendation(lessonId)]));
    await clickStartAndExpectRoute({ lessonId, expectedRoute: `/room/${ROOM_ID}`, markerCondition: "valid" });
  });

  it("normal ID routes to /room/<id>", async () => {
    const lessonId = NORMAL_ROOM_ID;
    cacheResults(results([recommendation(lessonId)]));
    await clickStartAndExpectRoute({ lessonId, expectedRoute: `/room/${NORMAL_ROOM_ID}`, markerCondition: "valid" });
  });

  it("already-normal IDs route correctly as separate explicit test", async () => {
    const lessonId = "daily:a1_basics";
    cacheResults(results([recommendation(lessonId)]));
    await clickStartAndExpectRoute({ lessonId, expectedRoute: "/room/daily%3Aa1_basics", markerCondition: "valid" });
  });

  it("empty lesson ID does not navigate", async () => {
    const lessonId = "";
    cacheResults(results([recommendation(lessonId)]));
    let currentUrl = "";
    renderResultsRoute((value) => {
      currentUrl = value;
    });
    await userEvent.click(screen.getByRole("button", { name: /Start this lesson/i }));
    expectRoute({
      expectedRoute: `/placement/results/${SESSION_ID}`,
      actualRoute: currentUrl,
      lessonId,
      markerBefore: null,
    markerAfter: window.localStorage.getItem(ACTIVE_LESSON_KEY),
      markerCondition: "malformed",
      actionAttempted: "click Start this lesson",
    });
  });

  it("malformed room-prefixed empty ID does not navigate", async () => {
    const lessonId = "room:";
    cacheResults(results([recommendation(lessonId)]));
    let currentUrl = "";
    renderResultsRoute((value) => {
      currentUrl = value;
    });
    await userEvent.click(screen.getByRole("button", { name: /Start this lesson/i }));
    expectRoute({
      expectedRoute: `/placement/results/${SESSION_ID}`,
      actualRoute: currentUrl,
      lessonId,
      markerBefore: null,
    markerAfter: window.localStorage.getItem(ACTIVE_LESSON_KEY),
      markerCondition: "malformed",
      actionAttempted: "click Start this lesson",
    });
  });

  it("malformed slash ID does not navigate", async () => {
    const lessonId = "room:bad/id";
    cacheResults(results([recommendation(lessonId)]));
    let currentUrl = "";
    renderResultsRoute((value) => {
      currentUrl = value;
    });
    await userEvent.click(screen.getByRole("button", { name: /Start this lesson/i }));
    expectRoute({
      expectedRoute: `/placement/results/${SESSION_ID}`,
      actualRoute: currentUrl,
      lessonId,
      markerBefore: null,
    markerAfter: window.localStorage.getItem(ACTIVE_LESSON_KEY),
      markerCondition: "malformed",
      actionAttempted: "click Start this lesson",
    });
  });

  it("no /room/room%3A regression returns", async () => {
    const lessonId = `room:${ROOM_ID}`;
    cacheResults();
    const currentUrl = await clickStartAndExpectRoute({ lessonId, expectedRoute: `/room/${ROOM_ID}`, markerCondition: "valid" });
    expectRouteDoesNotContain(currentUrl, "/room/room%3A", {
      expectedRoute: `/room/${ROOM_ID}`,
      actualRoute: currentUrl,
      lessonId,
      markerBefore: null,
    markerAfter: window.localStorage.getItem(ACTIVE_LESSON_KEY),
      markerCondition: "valid",
      actionAttempted: "click Start this lesson",
    });
  });

  it("stale localStorage write cannot restore completed lesson", async () => {
    const lessonId = `room:${ROOM_ID}`;
    cacheResults();
    setMarker({ roomId: ROOM_ID, completedRoomIds: [ROOM_ID] });
    window.localStorage.setItem("mb.lastRoomId", ROOM_ID);
    await clickResumeAndExpectRoute({ lessonId: `room:${NEXT_ROOM_ID}`, expectedRoute: `/room/${NEXT_ROOM_ID}`, markerCondition: "completed" });
    expect(markerRoomId(), debugMessage({
      expectedRoute: NEXT_ROOM_ID,
      actualRoute: markerRoomId() ?? "<no marker>",
      lessonId,
      markerBefore: null,
    markerAfter: window.localStorage.getItem(ACTIVE_LESSON_KEY),
      markerCondition: "completed",
      actionAttempted: "click Resume lesson",
    })).toBe(NEXT_ROOM_ID);
  });

  it("valid marker for second recommendation resumes second lesson", async () => {
    const lessonId = `room:${NEXT_ROOM_ID}`;
    cacheResults();
    setMarker({ roomId: NEXT_ROOM_ID });
    await clickResumeAndExpectRoute({ lessonId, expectedRoute: `/room/${NEXT_ROOM_ID}`, markerCondition: "valid" });
  });

  it("completed-only marker with no next lesson clears marker", async () => {
    const lessonId = `room:${ROOM_ID}`;
    cacheResults(results([recommendation(lessonId)]));
    setMarker({ roomId: ROOM_ID, completedRoomIds: [ROOM_ID] });
    renderResultsRoute();
    await waitFor(() => expect(window.localStorage.getItem(ACTIVE_LESSON_KEY), debugMessage({
      expectedRoute: "<no marker>",
      actualRoute: window.localStorage.getItem(ACTIVE_LESSON_KEY) ?? "<no marker>",
      lessonId,
      markerBefore: null,
    markerAfter: window.localStorage.getItem(ACTIVE_LESSON_KEY),
      markerCondition: "completed",
      actionAttempted: "load ResultsPage",
    })).toBeNull());
  });

  it("no marker plus recommendations shows Start without Resume", async () => {
    const lessonId = `room:${ROOM_ID}`;
    cacheResults();
    renderResultsRoute();
    expect(screen.getByRole("button", { name: /Start this lesson/i })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Resume lesson/i })).not.toBeInTheDocument();
    expectMarkerRoom({ expectedRoomId: null, lessonId, markerCondition: "valid", actionAttempted: "load ResultsPage" });
  });

  it("no marker plus no recommendations shows no resume route action", async () => {
    const lessonId = "";
    cacheResults(results([]));
    renderResultsRoute();
    expect(screen.queryByRole("button", { name: /Start this lesson/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Resume lesson/i })).not.toBeInTheDocument();
    expectMarkerRoom({ expectedRoomId: null, lessonId, markerCondition: "valid", actionAttempted: "load ResultsPage" });
  });

  it("valid marker plus recommendations keeps resume target", async () => {
    const lessonId = `room:${ROOM_ID}`;
    cacheResults();
    setMarker({ roomId: ROOM_ID });
    const markerBefore = window.localStorage.getItem(ACTIVE_LESSON_KEY);
    renderResultsRoute();
    await screen.findByRole("button", { name: /Resume lesson/i });
    expectMarkerRoom({ expectedRoomId: ROOM_ID, lessonId, markerBefore, markerCondition: "valid", actionAttempted: "load ResultsPage" });
  });

  it("valid marker plus no recommendations is cleared", async () => {
    const lessonId = `room:${ROOM_ID}`;
    cacheResults(results([]));
    setMarker({ roomId: ROOM_ID });
    const markerBefore = window.localStorage.getItem(ACTIVE_LESSON_KEY);
    renderResultsRoute();
    await waitFor(() => expect(window.localStorage.getItem(ACTIVE_LESSON_KEY), debugMessage({
      expectedRoute: "<no marker>",
      actualRoute: window.localStorage.getItem(ACTIVE_LESSON_KEY) ?? "<no marker>",
      lessonId,
      markerBefore,
      markerAfter: window.localStorage.getItem(ACTIVE_LESSON_KEY),
      markerCondition: "stale",
      actionAttempted: "load ResultsPage",
    })).toBeNull());
  });

  it("completed marker plus next recommendation preserves next target", async () => {
    const lessonId = `room:${NEXT_ROOM_ID}`;
    cacheResults();
    setMarker({ roomId: ROOM_ID, completedRoomIds: [ROOM_ID] });
    const markerBefore = window.localStorage.getItem(ACTIVE_LESSON_KEY);
    renderResultsRoute();
    await waitFor(() => expectMarkerRoom({
      expectedRoomId: NEXT_ROOM_ID,
      lessonId,
      markerBefore,
      markerCondition: "completed",
      actionAttempted: "load ResultsPage",
    }));
  });

  it("wrong-type marker fields do not break a valid room marker", async () => {
    const lessonId = `room:${ROOM_ID}`;
    cacheResults();
    window.localStorage.setItem(ACTIVE_LESSON_KEY, JSON.stringify({
      sessionId: SESSION_ID,
      roomId: ROOM_ID,
      completedRoomIds: "not-an-array",
      completionCount: "not-a-number",
    }));
    const markerBefore = window.localStorage.getItem(ACTIVE_LESSON_KEY);
    renderResultsRoute();
    await screen.findByRole("button", { name: /Resume lesson/i });
    expectMarkerRoom({ expectedRoomId: ROOM_ID, lessonId, markerBefore, markerCondition: "valid", actionAttempted: "load ResultsPage" });
  });

  it("unknown extra marker fields are ignored while preserving resume target", async () => {
    const lessonId = `room:${ROOM_ID}`;
    cacheResults();
    window.localStorage.setItem(ACTIVE_LESSON_KEY, JSON.stringify({
      sessionId: SESSION_ID,
      roomId: ROOM_ID,
      completedRoomIds: [],
      completionCount: 0,
      extra: { shouldNotMatter: true },
    }));
    const markerBefore = window.localStorage.getItem(ACTIVE_LESSON_KEY);
    renderResultsRoute();
    await screen.findByRole("button", { name: /Resume lesson/i });
    expectMarkerRoom({ expectedRoomId: ROOM_ID, lessonId, markerBefore, markerCondition: "valid", actionAttempted: "load ResultsPage" });
  });

  it("whitespace-only lesson ID does not navigate", async () => {
    const lessonId = "   ";
    cacheResults(results([recommendation(lessonId)]));
    let currentUrl = "";
    renderResultsRoute((value) => {
      currentUrl = value;
    });
    const markerBefore = window.localStorage.getItem(ACTIVE_LESSON_KEY);
    await userEvent.click(screen.getByRole("button", { name: /Start this lesson/i }));
    expectNoRouteChange({ actualRoute: currentUrl, lessonId, markerBefore, markerCondition: "malformed", actionAttempted: "click Start this lesson" });
  });

  it("nested room prefix does not produce encoded room prefix route", async () => {
    const lessonId = "room:room:abc";
    cacheResults(results([recommendation(lessonId)]));
    const currentUrl = await clickStartAndExpectRoute({ lessonId, expectedRoute: "/room/abc", markerCondition: "valid" });
    expectRouteDoesNotContain(currentUrl, "/room/room%3A", {
      expectedRoute: "/room/abc",
      actualRoute: currentUrl,
      lessonId,
      markerBefore: null,
      markerAfter: window.localStorage.getItem(ACTIVE_LESSON_KEY),
      markerCondition: "valid",
      actionAttempted: "click Start this lesson",
    });
  });

  it("encoded colon input does not regress to encoded room prefix route", async () => {
    const lessonId = "room%3Aabc";
    cacheResults(results([recommendation(lessonId)]));
    const currentUrl = await clickStartAndExpectRoute({ lessonId, expectedRoute: "/room/room%253Aabc", markerCondition: "valid" });
    expectRouteDoesNotContain(currentUrl, "/room/room%3A", {
      expectedRoute: "/room/room%253Aabc",
      actualRoute: currentUrl,
      lessonId,
      markerBefore: null,
      markerAfter: window.localStorage.getItem(ACTIVE_LESSON_KEY),
      markerCondition: "valid",
      actionAttempted: "click Start this lesson",
    });
  });

  it("triple-click Start does not double-navigate", async () => {
    const lessonId = `room:${ROOM_ID}`;
    cacheResults();
    const routeChanges: string[] = [];
    renderResultsRoute((value) => routeChanges.push(value));
    const button = screen.getByRole("button", { name: /Start this lesson/i });
    await userEvent.click(button);
    await userEvent.click(button);
    await userEvent.click(button);
    const expectedRoute = `/room/${ROOM_ID}`;
    expect(routeChanges.filter((route) => route === expectedRoute).length, debugMessage({
      expectedRoute,
      actualRoute: routeChanges.join(" -> "),
      lessonId,
      markerBefore: null,
      markerAfter: window.localStorage.getItem(ACTIVE_LESSON_KEY),
      markerCondition: "valid",
      actionAttempted: "triple-click Start this lesson",
    })).toBe(1);
  });

  it("triple-click Resume does not double-navigate", async () => {
    const lessonId = `room:${ROOM_ID}`;
    cacheResults();
    setMarker({ roomId: ROOM_ID });
    const routeChanges: string[] = [];
    renderResultsRoute((value) => routeChanges.push(value));
    const button = await screen.findByRole("button", { name: /Resume lesson/i });
    await userEvent.click(button);
    await userEvent.click(button);
    await userEvent.click(button);
    const expectedRoute = `/room/${ROOM_ID}`;
    expect(routeChanges.filter((route) => route === expectedRoute).length, debugMessage({
      expectedRoute,
      actualRoute: routeChanges.join(" -> "),
      lessonId,
      markerBefore: null,
      markerAfter: window.localStorage.getItem(ACTIVE_LESSON_KEY),
      markerCondition: "valid",
      actionAttempted: "triple-click Resume lesson",
    })).toBe(1);
  });

  it("Start then Resume does not double-navigate for the same action", async () => {
    const lessonId = `room:${ROOM_ID}`;
    cacheResults();
    let currentUrl = "";
    const first = renderResultsRoute((value) => {
      currentUrl = value;
    });
    await userEvent.click(screen.getByRole("button", { name: /Start this lesson/i }));
    expectRoute({
      expectedRoute: `/room/${ROOM_ID}`,
      actualRoute: currentUrl,
      lessonId,
      markerBefore: null,
      markerAfter: window.localStorage.getItem(ACTIVE_LESSON_KEY),
      markerCondition: "valid",
      actionAttempted: "click Start this lesson",
    });
    first.unmount();

    const routeChanges: string[] = [];
    renderResultsRoute((value) => routeChanges.push(value));
    await userEvent.click(await screen.findByRole("button", { name: /Resume lesson/i }));
    const expectedRoute = `/room/${ROOM_ID}`;
    expect(routeChanges.filter((route) => route === expectedRoute).length, debugMessage({
      expectedRoute,
      actualRoute: routeChanges.join(" -> "),
      lessonId,
      markerBefore: null,
      markerAfter: window.localStorage.getItem(ACTIVE_LESSON_KEY),
      markerCondition: "valid",
      actionAttempted: "click Resume lesson after Start",
    })).toBe(1);
  });

  it("completing inactive room does not clear active marker", async () => {
    const lessonId = `room:${ROOM_ID}`;
    setMarker({ roomId: ROOM_ID });
    const markerBefore = window.localStorage.getItem(ACTIVE_LESSON_KEY);
    renderResultsRoute(undefined, `/room/${NEXT_ROOM_ID}`);
    await completeRoomOnce();
    expectMarkerRoom({
      expectedRoomId: ROOM_ID,
      lessonId,
      markerBefore,
      markerCondition: "valid",
      actionAttempted: "save reflection in inactive room",
    });
    expect(markerCompletedRoomIds(), debugMessage({
      expectedRoute: NEXT_ROOM_ID,
      actualRoute: markerCompletedRoomIds().join(","),
      lessonId,
      markerBefore,
      markerAfter: window.localStorage.getItem(ACTIVE_LESSON_KEY),
      markerCondition: "valid",
      actionAttempted: "save reflection in inactive room",
    })).toContain(NEXT_ROOM_ID);
  });

  it("completing active room clears marker when ResultsPage has no next lesson", async () => {
    const lessonId = `room:${ROOM_ID}`;
    cacheResults(results([recommendation(lessonId)]));
    setMarker({ roomId: ROOM_ID });
    const room = renderResultsRoute(undefined, `/room/${ROOM_ID}`);
    await completeRoomOnce();
    room.unmount();
    const markerBefore = window.localStorage.getItem(ACTIVE_LESSON_KEY);
    renderResultsRoute();
    await waitFor(() => expect(window.localStorage.getItem(ACTIVE_LESSON_KEY), debugMessage({
      expectedRoute: "<no marker>",
      actualRoute: window.localStorage.getItem(ACTIVE_LESSON_KEY) ?? "<no marker>",
      lessonId,
      markerBefore,
      markerAfter: window.localStorage.getItem(ACTIVE_LESSON_KEY),
      markerCondition: "completed",
      actionAttempted: "return to ResultsPage after active completion",
    })).toBeNull());
  });

  it("cleared stale marker shows learner-safe ResultsPage copy", async () => {
    const lessonId = "missing_room";
    cacheResults();
    setMarker({ roomId: lessonId });
    renderResultsRoute();
    await waitFor(() => expect(window.localStorage.getItem(ACTIVE_LESSON_KEY)).toBeNull());
    expectNoTechnicalRecoveryCopy();
  });

  it("cleared malformed marker shows learner-safe ResultsPage copy", async () => {
    const lessonId = "{bad";
    cacheResults();
    window.localStorage.setItem(ACTIVE_LESSON_KEY, "{bad json");
    const markerBefore = window.localStorage.getItem(ACTIVE_LESSON_KEY);
    renderResultsRoute();
    await waitFor(() => expect(window.localStorage.getItem(ACTIVE_LESSON_KEY), debugMessage({
      expectedRoute: "<no marker>",
      actualRoute: window.localStorage.getItem(ACTIVE_LESSON_KEY) ?? "<no marker>",
      lessonId,
      markerBefore,
      markerAfter: window.localStorage.getItem(ACTIVE_LESSON_KEY),
      markerCondition: "malformed",
      actionAttempted: "load ResultsPage",
    })).toBeNull());
    expectNoTechnicalRecoveryCopy();
  });

  it("cleared different-session marker shows learner-safe ResultsPage copy", async () => {
    const lessonId = `room:${ROOM_ID}`;
    cacheResults();
    setMarker({ sessionId: OTHER_SESSION_ID, roomId: ROOM_ID });
    const markerBefore = window.localStorage.getItem(ACTIVE_LESSON_KEY);
    renderResultsRoute();
    await waitFor(() => expect(window.localStorage.getItem(ACTIVE_LESSON_KEY), debugMessage({
      expectedRoute: "<no marker>",
      actualRoute: window.localStorage.getItem(ACTIVE_LESSON_KEY) ?? "<no marker>",
      lessonId,
      markerBefore,
      markerAfter: window.localStorage.getItem(ACTIVE_LESSON_KEY),
      markerCondition: "different-session",
      actionAttempted: "load ResultsPage",
    })).toBeNull());
    expectNoTechnicalRecoveryCopy();
  });

  it("completed marker with no next recommendation shows learner-safe ResultsPage copy", async () => {
    const lessonId = `room:${ROOM_ID}`;
    cacheResults(results([recommendation(lessonId)]));
    setMarker({ roomId: ROOM_ID, completedRoomIds: [ROOM_ID] });
    const markerBefore = window.localStorage.getItem(ACTIVE_LESSON_KEY);
    renderResultsRoute();
    await waitFor(() => expect(window.localStorage.getItem(ACTIVE_LESSON_KEY), debugMessage({
      expectedRoute: "<no marker>",
      actualRoute: window.localStorage.getItem(ACTIVE_LESSON_KEY) ?? "<no marker>",
      lessonId,
      markerBefore,
      markerAfter: window.localStorage.getItem(ACTIVE_LESSON_KEY),
      markerCondition: "completed",
      actionAttempted: "load ResultsPage",
    })).toBeNull());
    expectNoTechnicalRecoveryCopy();
  });
});
