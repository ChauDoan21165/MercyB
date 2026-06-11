// @vitest-environment jsdom

import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";

import { qk } from "@/lib/queries/keys";

// ── Mocks ────────────────────────────────────────────────────────────

const updateMock = vi.fn();
const eqMock = vi.fn();
const fromMock = vi.fn();

vi.mock("@/lib/supabaseClient", () => {
  // Chained builder: supabase.from('profiles').update(payload).eq('id', userId)
  // → returns { error: null }
  return {
    supabase: {
      from: (...args: unknown[]) => {
        fromMock(...args);
        return {
          update: (payload: Record<string, unknown>) => {
            updateMock(payload);
            return {
              eq: (col: string, val: string) => {
                eqMock(col, val);
                return Promise.resolve({ error: null });
              },
            };
          },
        };
      },
    },
  };
});

const mockUseAuth = vi.fn();
vi.mock("@/providers/AuthProvider", () => ({
  useAuth: () => mockUseAuth(),
}));

// Only useNavigate is mocked — useSearchParams / MemoryRouter stay real
// so the `?direction=vn` contract is exercised end-to-end (the param is
// parsed by the real react-router from initialEntries).
const navigateMock = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>(
    "react-router-dom",
  );
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

// Stub the SR live-region helper. On every step transition OnboardingPage
// calls `announce(headingText)`, which mirrors the new step's <h1> text into
// `<div id="live-region-polite">` after a 100ms setTimeout. In the slow full
// suite that timer fires before a synchronous `getByText(/heading/)` runs, so
// the query matches BOTH the <h1> and the live region → getMultipleElements-
// FoundError (passes in isolation, flakes in the shard). No test here asserts
// on announcement behaviour, so a no-op kills the race at its source. The
// production a11y path is unchanged.
vi.mock("@/lib/a11y/announcements", () => ({
  announce: vi.fn(),
  announceLoading: vi.fn(),
  announceSuccess: vi.fn(),
  announceError: vi.fn(),
  announcePageChange: vi.fn(),
}));

// Import the page AFTER mocks are registered.
import OnboardingPage from "../OnboardingPage";

// Spy on the QueryClient the page resolves via useQueryClient(). A fresh
// client per render keeps cache state isolated between tests; the spy lets
// us assert the onboarding write invalidates exactly the profile key and
// nothing broader (a wide invalidate would be a perf regression).
let invalidateSpy: ReturnType<typeof vi.fn>;

/**
 * Render the picker. `direction: "vn"` enters via the landing page's
 * "I'm learning Vietnamese" CTA contract (/onboarding?direction=vn);
 * omit it for the default vi-first home-market flow.
 */
function renderPage(opts: { direction?: "vn" } = {}) {
  const entry = opts.direction
    ? `/onboarding?direction=${opts.direction}`
    : "/onboarding";
  const qc = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  invalidateSpy = vi.fn(() => Promise.resolve());
  qc.invalidateQueries =
    invalidateSpy as unknown as typeof qc.invalidateQueries;
  return render(
    <QueryClientProvider client={qc}>
      <MemoryRouter initialEntries={[entry]}>
        <Routes>
          <Route path="/onboarding" element={<OnboardingPage />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

/** Default flow: welcome is gone — the picker opens straight on the
 *  native step. Pick Tiếng Việt → auto-advances to the target step
 *  (English pre-checked). */
async function toTargetStepVi(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole("radio", { name: /Tiếng Việt/ }));
}

beforeEach(() => {
  updateMock.mockClear();
  eqMock.mockClear();
  fromMock.mockClear();
  navigateMock.mockClear();
  window.localStorage.clear();
  mockUseAuth.mockReturnValue({ user: { id: "user-uuid-1" } });
  vi.spyOn(console, "log").mockImplementation(() => {});
  vi.spyOn(console, "warn").mockImplementation(() => {});

  // Clear the persistent SR-only live region (`<div id="live-region-
  // polite">`) left over from any prior test's `announce()` call.
  // `announce()` (src/lib/a11y/announcements.ts) lazily appends the
  // div to `document.body` and uses a 1000ms `setTimeout` to clear
  // its text — so within fast test runs the previous announcement
  // is still in the DOM when the next test's `screen.queryByText`
  // runs. Without this cleanup the `?direction=vn` tests flake
  // because the VI target-step heading text leaks from a prior
  // step-transition announcement. Fix is local to this file; the
  // helper itself stays unchanged.
  for (const id of ["live-region-polite", "live-region-assertive"]) {
    const region = document.getElementById(id);
    if (region) region.remove();
  }
});

function storedPair(): { native: string; targets: string[] } | null {
  const raw = window.localStorage.getItem("mercyblade.languagePair");
  return raw ? (JSON.parse(raw) as { native: string; targets: string[] }) : null;
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe("OnboardingPage — entry step (welcome interstitial removed)", () => {
  it("opens straight on the native step (no welcome dead click)", () => {
    renderPage();
    // The native question is the H1 — there is no welcome screen and no
    // "Bắt đầu / Let's start" interstitial button anymore.
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      /Tiếng mẹ đẻ của bạn là gì/,
    );
    expect(
      screen.queryByRole("button", { name: /Let's start|Bắt đầu/ }),
    ).toBeNull();
  });

  it("inlines Mercy's greeting on the native entry step, bilingual (locked #14)", () => {
    renderPage();
    // One short warm line carrying BOTH languages (peer, pre-pick).
    const greeting = screen.getByText(/Chào bạn — mình là Mercy/);
    expect(greeting).toHaveTextContent(/Hi — I'm Mercy/);
  });

  it("native step offers both Tiếng Việt and English (en-native greenlit)", () => {
    renderPage();
    expect(
      screen.getByRole("radio", { name: /Tiếng Việt/ }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("radio", { name: /Tiếng Anh|English/ }),
    ).toBeInTheDocument();
  });

  it("no Back button on the entry (native) step", () => {
    renderPage();
    expect(screen.queryByRole("button", { name: /^Back/ })).toBeNull();
  });
});

describe("OnboardingPage — target step (Screen 2, matrix-filtered)", () => {
  it("vi-native menu excludes Spanish (decision 2) and pre-checks English", async () => {
    const user = userEvent.setup();
    renderPage();
    await toTargetStepVi(user);
    expect(
      screen.getByText(/Bạn muốn học ngôn ngữ nào/),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("checkbox", { name: /Tây Ban Nha|Spanish/ }),
    ).toBeNull();
    const en = screen.getByRole("checkbox", { name: /Tiếng Anh/ });
    expect(en).toHaveAttribute("aria-checked", "true");
  });

  it("shows honesty badges single-language VI, natural wording (A32 §2)", async () => {
    const user = userEvent.setup();
    renderPage();
    await toTargetStepVi(user);
    expect(screen.getByText(/Hiện chỉ có B2–C2/)).toBeInTheDocument(); // zh skeletal
    // "Nội dung còn hạn chế" (was the translationese "Nội dung giới hạn").
    expect(
      screen.getAllByText(/Nội dung còn hạn chế/).length,
    ).toBeGreaterThan(0); // ko partial
    expect(screen.queryByText(/Nội dung giới hạn/)).toBeNull(); // old string gone
    expect(screen.queryByText(/Limited content/i)).toBeNull(); // EN not shown for vi
  });

  it("en-native menu includes Spanish (its true pair) + Vietnamese", async () => {
    const user = userEvent.setup();
    renderPage();
    await user.click(screen.getByRole("radio", { name: /Tiếng Anh|English/ }));
    expect(
      screen.getByRole("checkbox", { name: /Tây Ban Nha|Spanish/ }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("checkbox", { name: /Tiếng Việt|Vietnamese/ }),
    ).toBeInTheDocument();
  });
});

describe("OnboardingPage — single-target Continue finishes (no confirmation)", () => {
  it("vi → English (only) → Continue lands on home, no confirmation screen", async () => {
    const user = userEvent.setup();
    renderPage();
    await toTargetStepVi(user); // English pre-checked
    await user.click(screen.getByRole("button", { name: /Tiếp tục|Continue/ }));
    // The confirmation echo screen is gone — finish is immediate.
    expect(screen.queryByText(/Đã sẵn sàng|All set/)).toBeNull();
    expect(navigateMock).toHaveBeenCalledWith(
      "/",
      expect.objectContaining({ replace: true }),
    );
  });

  it("vi → English pair finishes → writes pair, lands on home (/)", async () => {
    const user = userEvent.setup();
    renderPage();
    await toTargetStepVi(user);
    await user.click(screen.getByRole("button", { name: /Tiếp tục|Continue/ }));

    expect(fromMock).toHaveBeenCalledWith("profiles");
    const payload = updateMock.mock.calls[0][0] as Record<string, unknown>;
    expect(payload.native_language).toBe("vi");
    expect(payload.target_languages).toEqual(["en"]);
    // Goal/profession/level are no longer captured at onboarding.
    expect(payload.primary_goal).toBeNull();
    expect(payload.profession).toBeNull();
    expect(payload.english_level).toBeNull();
    expect(typeof payload.onboarded_at).toBe("string");
    expect(eqMock).toHaveBeenCalledWith("id", "user-uuid-1");
    expect(navigateMock).toHaveBeenCalledWith(
      "/",
      expect.objectContaining({ replace: true }),
    );
    expect(storedPair()).toEqual({ native: "vi", targets: ["en"] });
    // Freshly-written pair must invalidate exactly the profile key.
    expect(invalidateSpy).toHaveBeenCalledTimes(1);
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: qk.profile("user-uuid-1"),
    });
  });
});

describe("OnboardingPage — anonymous (no auth) persists to localStorage", () => {
  it("anonymous multi-target finish writes the pair locally, skips Supabase", async () => {
    mockUseAuth.mockReturnValue({ user: null });
    const user = userEvent.setup();
    renderPage();
    await toTargetStepVi(user); // vi + English pre-checked
    await user.click(screen.getByRole("checkbox", { name: /Tiếng Nhật/ })); // add ja
    await user.click(screen.getByRole("button", { name: /Tiếp tục|Continue/ }));
    // >1 target → start_with; picking the primary FINISHES directly.
    await user.click(screen.getByRole("radio", { name: /Tiếng Nhật/ })); // ja primary

    expect(updateMock).not.toHaveBeenCalled(); // no profile row exists yet
    expect(storedPair()).toEqual({ native: "vi", targets: ["ja", "en"] });
    expect(window.localStorage.getItem("mercyblade.nativeLang")).toBe("vi");
    expect(navigateMock).toHaveBeenCalledWith(
      "/",
      expect.objectContaining({ replace: true }),
    );
  });
});

describe("OnboardingPage — multi-target → start_with finishes (no confirmation)", () => {
  it("vi → en+ja → start_with(ja) finishes to home (/), pair primary-first", async () => {
    const user = userEvent.setup();
    renderPage();
    await toTargetStepVi(user); // English pre-checked
    await user.click(screen.getByRole("checkbox", { name: /Tiếng Nhật/ })); // add ja
    await user.click(screen.getByRole("button", { name: /Tiếp tục|Continue/ }));
    expect(
      screen.getByText(/Bạn muốn bắt đầu với ngôn ngữ nào/),
    ).toBeInTheDocument();
    await user.click(screen.getByRole("radio", { name: /Tiếng Nhật/ }));
    // No confirmation screen — the start_with tap finishes.
    expect(screen.queryByText(/Đã sẵn sàng|All set/)).toBeNull();

    const payload = updateMock.mock.calls[0][0] as Record<string, unknown>;
    expect(payload.native_language).toBe("vi");
    expect(payload.target_languages).toEqual(["ja", "en"]); // primary first
    expect(payload.primary_goal).toBeUndefined(); // non-en primary: not written
    expect(payload.english_level).toBeUndefined();
    expect(invalidateSpy).toHaveBeenCalledTimes(1);
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: qk.profile("user-uuid-1"),
    });
    expect(navigateMock).toHaveBeenCalledWith(
      "/",
      expect.objectContaining({ replace: true }),
    );
  });

  it("startWith body uses natural VI ('vẫn luôn sẵn sàng', not 'ở đó')", async () => {
    const user = userEvent.setup();
    renderPage();
    await toTargetStepVi(user);
    await user.click(screen.getByRole("checkbox", { name: /Tiếng Nhật/ }));
    await user.click(screen.getByRole("button", { name: /Tiếp tục|Continue/ }));
    expect(screen.getByText(/vẫn luôn sẵn sàng/)).toBeInTheDocument();
    expect(screen.queryByText(/vẫn luôn ở đó/)).toBeNull();
  });
});

describe("OnboardingPage — skip flow cannot loop the gate", () => {
  it("skip from the native entry writes vi → [en] (Home gate cannot loop)", async () => {
    const user = userEvent.setup();
    renderPage();
    await user.click(
      screen.getByRole("button", { name: /Skip onboarding|^Skip/i }),
    );
    expect(updateMock).toHaveBeenCalledTimes(1);
    const payload = updateMock.mock.calls[0][0] as Record<string, unknown>;
    expect(typeof payload.onboarded_at).toBe("string");
    expect(payload.native_language).toBe("vi");
    expect(payload.target_languages).toEqual(["en"]);
    expect(invalidateSpy).toHaveBeenCalledTimes(1);
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: qk.profile("user-uuid-1"),
    });
    expect(navigateMock).toHaveBeenCalledWith(
      "/",
      expect.objectContaining({ replace: true }),
    );
  });

  it("skip with no user id does not call supabase but still navigates", async () => {
    mockUseAuth.mockReturnValue({ user: null });
    const user = userEvent.setup();
    renderPage();
    await user.click(
      screen.getByRole("button", { name: /Skip onboarding|^Skip/i }),
    );
    expect(updateMock).not.toHaveBeenCalled();
    expect(invalidateSpy).not.toHaveBeenCalled();
    expect(storedPair()).toEqual({ native: "vi", targets: ["en"] });
    expect(navigateMock).toHaveBeenCalledWith(
      "/",
      expect.objectContaining({ replace: true }),
    );
  });

  it("skip after choosing English native uses the en recommended pair (es)", async () => {
    const user = userEvent.setup();
    renderPage();
    await user.click(screen.getByRole("radio", { name: /Tiếng Anh|English/ }));
    await user.click(
      screen.getByRole("button", { name: /Skip onboarding|^Skip/i }),
    );
    const payload = updateMock.mock.calls[0][0] as Record<string, unknown>;
    expect(payload.native_language).toBe("en");
    expect(payload.target_languages).toEqual(["es"]);
    expect(navigateMock).toHaveBeenCalledWith(
      "/",
      expect.objectContaining({ replace: true }),
    );
  });
});

describe("OnboardingPage — back navigation", () => {
  it("Back from target returns to native (default flow)", async () => {
    const user = userEvent.setup();
    renderPage();
    await toTargetStepVi(user);
    expect(screen.getByText(/Bạn muốn học ngôn ngữ nào/)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /^Back/ }));
    expect(screen.getByText(/Tiếng mẹ đẻ của bạn là gì/)).toBeInTheDocument();
  });
});

describe("OnboardingPage — progress bar", () => {
  it("exposes aria-valuemax of 3 (native→target→start_with; welcome+confirmation removed)", () => {
    const { container } = renderPage();
    const progress = container.querySelector('[role="progressbar"]')!;
    expect(progress.getAttribute("aria-valuemax")).toBe("3");
    expect(progress.getAttribute("aria-valuenow")).toBe("1"); // native = step 1
  });
});

describe("OnboardingPage — chrome language follows native choice", () => {
  it("vi-native: post-pick screens are VI-only (no EN subtitle)", async () => {
    const user = userEvent.setup();
    renderPage();
    await toTargetStepVi(user); // pick Tiếng Việt
    expect(
      screen.getByText(/Bạn muốn học ngôn ngữ nào/),
    ).toBeInTheDocument();
    expect(screen.queryByText(/What do you want to learn/i)).toBeNull();
  });

  it("en-native: post-pick screens are EN-only (no VI primary)", async () => {
    const user = userEvent.setup();
    renderPage();
    await user.click(screen.getByRole("radio", { name: /Tiếng Anh|English/ }));
    expect(
      screen.getByText(/What do you want to learn/i),
    ).toBeInTheDocument();
    expect(screen.queryByText(/Bạn muốn học ngôn ngữ nào/)).toBeNull();
    expect(
      screen.getByRole("button", { name: /Continue/ }),
    ).toBeInTheDocument();
    expect(screen.queryByText(/· Continue/)).toBeNull();
  });

  it("native picker shows each option in its OWN language", () => {
    renderPage();
    expect(
      screen.getByRole("radio", { name: /Tiếng Việt/ }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("radio", { name: /English/ }),
    ).toBeInTheDocument();
  });

  it("native-picker header stays bilingual (pre-pick, locked #14)", () => {
    renderPage();
    expect(
      screen.getByText(/Tiếng mẹ đẻ của bạn là gì/),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/What's your native language/i),
    ).toBeInTheDocument();
  });
});

// ── ?direction=vn — the landing "I'm learning Vietnamese" contract ───
//
// The bilingual marketing landing (PR #675) sends English speakers who
// want to LEARN Vietnamese to /onboarding?direction=vn. Before this
// fix the param was dead: they got a VI-first survey with Spanish
// pre-checked and Skip silently enrolled them as the INVERSE pair.
describe("OnboardingPage — ?direction=vn (en→vi) handler", () => {
  it("enters straight on the target step, English-primary, NO native screen", () => {
    renderPage({ direction: "vn" });
    // English-primary chrome (native seeded "en"): the target question
    // renders in English, not Vietnamese.
    expect(
      screen.getByText(/What do you want to learn/i),
    ).toBeInTheDocument();
    expect(screen.queryByText(/Bạn muốn học ngôn ngữ nào/)).toBeNull();
    // The native picker is NOT shown first (intent declared by the CTA).
    expect(
      screen.queryByText(/What's your native language|Tiếng mẹ đẻ của bạn/),
    ).toBeNull();
  });

  it("greeting is English-only for a direction=vn entrant (not bilingual)", () => {
    renderPage({ direction: "vn" });
    expect(screen.getByText(/Hi — I'm Mercy/)).toBeInTheDocument();
    expect(screen.queryByText(/Chào bạn — mình là Mercy/)).toBeNull();
  });

  it("pre-selects Vietnamese as the target; Spanish is NOT pre-checked", () => {
    renderPage({ direction: "vn" });
    const vi = screen.getByRole("checkbox", { name: /Vietnamese|Tiếng Việt/ });
    expect(vi).toHaveAttribute("aria-checked", "true");
    const es = screen.getByRole("checkbox", { name: /Spanish|Tây Ban Nha/ });
    expect(es).toHaveAttribute("aria-checked", "false");
  });

  it("no Back button on the direction=vn entry (target) step", () => {
    renderPage({ direction: "vn" });
    expect(screen.queryByRole("button", { name: /^Back/ })).toBeNull();
  });

  it("Continue finishes → writes the en → [vi] pair and lands on home", async () => {
    const user = userEvent.setup();
    renderPage({ direction: "vn" });
    await user.click(screen.getByRole("button", { name: /Continue|Tiếp tục/ }));
    const payload = updateMock.mock.calls[0][0] as Record<string, unknown>;
    expect(payload.native_language).toBe("en");
    expect(payload.target_languages).toEqual(["vi"]);
    expect(storedPair()).toEqual({ native: "en", targets: ["vi"] });
    expect(navigateMock).toHaveBeenCalledWith(
      "/",
      expect.objectContaining({ replace: true }),
    );
  });
});

describe("OnboardingPage — ?direction=vn Skip preserves intent (A32 trap)", () => {
  it("Skip writes en → [vi] (NOT the inverse vi → [en], NOT en → [es])", async () => {
    const user = userEvent.setup();
    renderPage({ direction: "vn" });
    await user.click(
      screen.getByRole("button", { name: /Skip onboarding|^Skip/i }),
    );
    const payload = updateMock.mock.calls[0][0] as Record<string, unknown>;
    expect(payload.native_language).toBe("en"); // English speaker
    expect(payload.target_languages).toEqual(["vi"]); // learning Vietnamese
    // The exact A32 trap: Skip must NOT enroll the inverse pair…
    expect(payload.native_language).not.toBe("vi");
    expect(payload.target_languages).not.toEqual(["en"]);
    // …and must NOT fall back to the unrelated en recommended (es).
    expect(payload.target_languages).not.toEqual(["es"]);
    expect(navigateMock).toHaveBeenCalledWith(
      "/",
      expect.objectContaining({ replace: true }),
    );
  });

  it("anonymous direction=vn Skip persists en → [vi] locally (gate cannot flip it)", async () => {
    mockUseAuth.mockReturnValue({ user: null });
    const user = userEvent.setup();
    renderPage({ direction: "vn" });
    await user.click(
      screen.getByRole("button", { name: /Skip onboarding|^Skip/i }),
    );
    expect(updateMock).not.toHaveBeenCalled();
    // Persisted pair must be the declared direction, never the inverse.
    expect(storedPair()).toEqual({ native: "en", targets: ["vi"] });
    expect(storedPair()).not.toEqual({ native: "vi", targets: ["en"] });
    expect(window.localStorage.getItem("mercyblade.nativeLang")).toBe("en");
    expect(navigateMock).toHaveBeenCalledWith(
      "/",
      expect.objectContaining({ replace: true }),
    );
  });
});

// ── Telemetry funnel ─────────────────────────────────────────────────
// These tests verify the four events reach trackEvent (GA4 / Clarity).
// trackEvent is mocked so tests are independent of window.gtag presence.

const trackEventMock = vi.fn();
vi.mock("@/lib/analytics", () => ({
  trackEvent: (...args: unknown[]) => trackEventMock(...args),
}));

describe("OnboardingPage — telemetry funnel", () => {
  beforeEach(() => {
    trackEventMock.mockClear();
  });

  it("emits onboarding_started with direction=default on mount (vi-first flow)", () => {
    renderPage();
    const startedCalls = trackEventMock.mock.calls.filter(
      ([name]: [string]) => name === "onboarding_started",
    );
    expect(startedCalls).toHaveLength(1);
    expect(startedCalls[0][1]).toMatchObject({
      entry_step: "native",
      direction: "default",
    });
  });

  it("emits onboarding_started with direction=vn on mount (?direction=vn flow)", () => {
    renderPage({ direction: "vn" });
    const startedCalls = trackEventMock.mock.calls.filter(
      ([name]: [string]) => name === "onboarding_started",
    );
    expect(startedCalls).toHaveLength(1);
    expect(startedCalls[0][1]).toMatchObject({
      entry_step: "target",
      direction: "vn",
    });
  });

  it("emits onboarding_started exactly once even after a step transition", async () => {
    const user = userEvent.setup();
    renderPage();
    await user.click(screen.getByRole("radio", { name: /Tiếng Việt/ }));
    const startedCalls = trackEventMock.mock.calls.filter(
      ([name]: [string]) => name === "onboarding_started",
    );
    expect(startedCalls).toHaveLength(1);
  });

  it("emits onboarding_step_complete when advancing a step", async () => {
    const user = userEvent.setup();
    renderPage();
    await user.click(screen.getByRole("radio", { name: /Tiếng Việt/ }));
    const stepCalls = trackEventMock.mock.calls.filter(
      ([name]: [string]) => name === "onboarding_step_complete",
    );
    expect(stepCalls.length).toBeGreaterThanOrEqual(1);
    expect(stepCalls[0][1]).toMatchObject({ step: "native" });
  });

  it("emits onboarding_skipped when Skip is tapped", async () => {
    const user = userEvent.setup();
    renderPage();
    await user.click(
      screen.getByRole("button", { name: /Skip onboarding|^Skip/i }),
    );
    const skippedCalls = trackEventMock.mock.calls.filter(
      ([name]: [string]) => name === "onboarding_skipped",
    );
    expect(skippedCalls).toHaveLength(1);
    expect(skippedCalls[0][1]).toMatchObject({ from_step: "native" });
  });

  it("emits onboarding_complete on finish (vi → en single-target path)", async () => {
    const user = userEvent.setup();
    renderPage();
    await user.click(screen.getByRole("radio", { name: /Tiếng Việt/ }));
    await user.click(
      screen.getByRole("button", { name: /Continue|Tiếp tục/ }),
    );
    const completedCalls = trackEventMock.mock.calls.filter(
      ([name]: [string]) => name === "onboarding_complete",
    );
    expect(completedCalls).toHaveLength(1);
    expect(completedCalls[0][1]).toMatchObject({
      native_language: "vi",
      primary_target: "en",
    });
  });
});
