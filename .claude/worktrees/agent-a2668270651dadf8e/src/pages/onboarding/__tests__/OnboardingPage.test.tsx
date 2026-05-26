// @vitest-environment jsdom

import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
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

// Import the page AFTER mocks are registered.
import OnboardingPage from "../OnboardingPage";

// Spy on the QueryClient the page resolves via useQueryClient(). A fresh
// client per render keeps cache state isolated between tests; the spy lets
// us assert the onboarding write invalidates exactly the profile key and
// nothing broader (a wide invalidate would be a perf regression).
let invalidateSpy: ReturnType<typeof vi.fn>;

function renderPage() {
  const qc = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  invalidateSpy = vi.fn(() => Promise.resolve());
  qc.invalidateQueries =
    invalidateSpy as unknown as typeof qc.invalidateQueries;
  return render(
    <QueryClientProvider client={qc}>
      <MemoryRouter initialEntries={["/onboarding"]}>
        <Routes>
          <Route path="/onboarding" element={<OnboardingPage />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

const clickStart = (user: ReturnType<typeof userEvent.setup>) =>
  user.click(screen.getByRole("button", { name: /Bắt đầu|Let's start/ }));

/** welcome → native(vi) → lands on the target step (English pre-checked). */
async function toTargetStepVi(user: ReturnType<typeof userEvent.setup>) {
  await clickStart(user);
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
});

function storedPair(): { native: string; targets: string[] } | null {
  const raw = window.localStorage.getItem("mercyblade.languagePair");
  return raw ? (JSON.parse(raw) as { native: string; targets: string[] }) : null;
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe("OnboardingPage — welcome + native step (Screen 1)", () => {
  it("renders the welcome step first with VI primary heading", () => {
    renderPage();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      /Chào bạn/,
    );
    expect(
      screen.getByRole("button", { name: /Let's start|Bắt đầu/ }),
    ).toBeInTheDocument();
  });

  it("welcome CTA advances to the NATIVE step (not goal)", async () => {
    const user = userEvent.setup();
    renderPage();
    await clickStart(user);
    expect(
      screen.getByText(/Tiếng mẹ đẻ của bạn là gì/),
    ).toBeInTheDocument();
    // goal copy must NOT be on screen yet
    expect(screen.queryByText(/Bạn học tiếng Anh để làm gì/)).toBeNull();
  });

  it("native step offers both Tiếng Việt and English (en-native greenlit)", async () => {
    const user = userEvent.setup();
    renderPage();
    await clickStart(user);
    expect(
      screen.getByRole("radio", { name: /Tiếng Việt/ }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("radio", { name: /Tiếng Anh|English/ }),
    ).toBeInTheDocument();
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
    // Spanish is intentionally absent for vi-native
    expect(
      screen.queryByRole("checkbox", { name: /Tây Ban Nha|Spanish/ }),
    ).toBeNull();
    // English present + pre-checked (the 95% path = one Continue tap)
    const en = screen.getByRole("checkbox", { name: /Tiếng Anh/ });
    expect(en).toHaveAttribute("aria-checked", "true");
  });

  it("shows honesty badges single-language (VI for a vi-native, locked #7)", async () => {
    const user = userEvent.setup();
    renderPage();
    await toTargetStepVi(user);
    // vi-native → VI badge copy only; the EN side is NOT rendered
    // (native-respect: chrome follows the native choice, not bilingual).
    expect(screen.getByText(/Hiện chỉ có B2–C2/)).toBeInTheDocument(); // zh skeletal
    expect(screen.getAllByText(/Nội dung giới hạn/).length).toBeGreaterThan(0); // ko partial
    expect(screen.queryByText(/only for now/i)).toBeNull();
    expect(screen.queryByText(/Limited content/i)).toBeNull();
  });

  it("en-native menu includes Spanish (its true pair) + Vietnamese", async () => {
    const user = userEvent.setup();
    renderPage();
    await clickStart(user);
    await user.click(screen.getByRole("radio", { name: /Tiếng Anh|English/ }));
    expect(
      screen.getByRole("checkbox", { name: /Tây Ban Nha|Spanish/ }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("checkbox", { name: /Tiếng Việt|Vietnamese/ }),
    ).toBeInTheDocument();
  });
});

describe("OnboardingPage — pair pick goes straight to home (no goal gate)", () => {
  it("vi → English (only) → Continue → confirmation directly (no goal step)", async () => {
    const user = userEvent.setup();
    renderPage();
    await toTargetStepVi(user); // English already pre-checked
    await user.click(screen.getByRole("button", { name: /Tiếp tục|Continue/ }));
    // Goal gate removed — single target jumps straight to confirmation.
    expect(screen.getByText(/Đã sẵn sàng/)).toBeInTheDocument();
    expect(
      screen.queryByText(/Bạn học tiếng Anh để làm gì/),
    ).toBeNull();
  });

  it("vi → English pair finishes → writes pair, lands on home (/)", async () => {
    const user = userEvent.setup();
    renderPage();
    await toTargetStepVi(user);
    await user.click(screen.getByRole("button", { name: /Tiếp tục|Continue/ }));
    await user.click(screen.getByRole("button", { name: /Hoàn tất|Finish/ }));

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
  });
});

describe("OnboardingPage — anonymous (no auth) persists to localStorage", () => {
  it("anonymous finish writes the pair locally and does NOT touch Supabase", async () => {
    mockUseAuth.mockReturnValue({ user: null });
    const user = userEvent.setup();
    renderPage();
    await toTargetStepVi(user); // vi + English pre-checked
    await user.click(screen.getByRole("checkbox", { name: /Tiếng Nhật/ })); // add ja
    await user.click(screen.getByRole("button", { name: /Tiếp tục|Continue/ }));
    await user.click(screen.getByRole("radio", { name: /Tiếng Nhật/ })); // ja primary
    await user.click(screen.getByRole("button", { name: /Hoàn tất|Finish/ }));

    expect(updateMock).not.toHaveBeenCalled(); // no profile row exists yet
    expect(storedPair()).toEqual({ native: "vi", targets: ["ja", "en"] });
    expect(window.localStorage.getItem("mercyblade.nativeLang")).toBe("vi");
    // All pairs land on home (/) — home is pair-aware.
    expect(navigateMock).toHaveBeenCalledWith(
      "/",
      expect.objectContaining({ replace: true }),
    );
  });
});

describe("OnboardingPage — multi-target → start_with → home", () => {
  it("vi → en+ja → start_with(ja) → confirmation → finishes to home (/)", async () => {
    const user = userEvent.setup();
    renderPage();
    await toTargetStepVi(user); // English pre-checked
    await user.click(screen.getByRole("checkbox", { name: /Tiếng Nhật/ })); // add ja
    await user.click(screen.getByRole("button", { name: /Tiếp tục|Continue/ }));
    // >1 target → start_with step appears
    expect(
      screen.getByText(/Bạn muốn bắt đầu với ngôn ngữ nào/),
    ).toBeInTheDocument();
    await user.click(screen.getByRole("radio", { name: /Tiếng Nhật/ }));
    // ja primary → English goal/level skipped → confirmation
    expect(screen.getByText(/Đã sẵn sàng/)).toBeInTheDocument();
    expect(screen.queryByText(/Bạn học tiếng Anh để làm gì/)).toBeNull();

    await user.click(screen.getByRole("button", { name: /Hoàn tất|Finish/ }));
    const payload = updateMock.mock.calls[0][0] as Record<string, unknown>;
    expect(payload.native_language).toBe("vi");
    expect(payload.target_languages).toEqual(["ja", "en"]); // primary first
    expect(payload.primary_goal).toBeUndefined(); // non-en primary: not written
    expect(payload.english_level).toBeUndefined();
    // M3 Risk 1: the freshly-written pair must invalidate the shared
    // profile cache so chrome / NativeLanguageContext / AccountPage stop
    // serving the pre-onboarding language. Exactly one call, the single
    // targeted key — never a broad invalidate (perf regression).
    expect(invalidateSpy).toHaveBeenCalledTimes(1);
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: qk.profile("user-uuid-1"),
    });
    expect(navigateMock).toHaveBeenCalledWith(
      "/",
      expect.objectContaining({ replace: true }),
    );
  });
});

describe("OnboardingPage — skip flow cannot loop the gate", () => {
  it("skip writes native_language + recommended target (not just onboarded_at)", async () => {
    const user = userEvent.setup();
    renderPage();
    // Skip straight from welcome — no native chosen yet
    await user.click(
      screen.getByRole("button", { name: /Skip onboarding|^Skip/i }),
    );
    expect(updateMock).toHaveBeenCalledTimes(1);
    const payload = updateMock.mock.calls[0][0] as Record<string, unknown>;
    expect(typeof payload.onboarded_at).toBe("string");
    // CRITICAL: native_language must be written or the Home gate loops
    expect(payload.native_language).toBe("vi");
    expect(payload.target_languages).toEqual(["en"]);
    // Skip writes the pair too → same targeted profile invalidation.
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
    // No profile write ⇒ nothing to invalidate (anonymous visitor reads
    // the pair from localStorage, not the profile cache).
    expect(invalidateSpy).not.toHaveBeenCalled();
    // …but the recommended pair is still persisted locally so the `/`
    // gate cannot loop an anonymous visitor back into the picker.
    expect(storedPair()).toEqual({ native: "vi", targets: ["en"] });
    expect(navigateMock).toHaveBeenCalledWith(
      "/",
      expect.objectContaining({ replace: true }),
    );
  });

  it("skip after choosing English native uses the en recommended pair (es)", async () => {
    const user = userEvent.setup();
    renderPage();
    await clickStart(user);
    await user.click(screen.getByRole("radio", { name: /Tiếng Anh|English/ }));
    await user.click(
      screen.getByRole("button", { name: /Skip onboarding|^Skip/i }),
    );
    const payload = updateMock.mock.calls[0][0] as Record<string, unknown>;
    expect(payload.native_language).toBe("en");
    expect(payload.target_languages).toEqual(["es"]);
    // Skip also lands on home (/) — home is pair-aware for (en, es).
    expect(navigateMock).toHaveBeenCalledWith(
      "/",
      expect.objectContaining({ replace: true }),
    );
  });
});

describe("OnboardingPage — back navigation through new steps", () => {
  it("Back from target returns to native", async () => {
    const user = userEvent.setup();
    renderPage();
    await toTargetStepVi(user);
    expect(screen.getByText(/Bạn muốn học ngôn ngữ nào/)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /^Back/ }));
    expect(screen.getByText(/Tiếng mẹ đẻ của bạn là gì/)).toBeInTheDocument();
  });

  it("no Back button on the first (welcome) step", () => {
    renderPage();
    expect(screen.queryByRole("button", { name: /Back/i })).toBeNull();
  });
});

describe("OnboardingPage — confirmation summary + progress bar", () => {
  it("confirmation summary is single-language VI for a vi-native (no EN)", async () => {
    const user = userEvent.setup();
    renderPage();
    await toTargetStepVi(user);
    await user.click(screen.getByRole("button", { name: /Tiếp tục|Continue/ }));
    // Single target → confirmation directly (goal/level gate removed).
    // Single-language: VI labels with NO "· Native" / "· Learning" EN tail.
    const native = screen.getByText(/Tiếng mẹ đẻ:/);
    const summaryRoot = native.closest("ul")!;
    expect(within(summaryRoot).getByText(/Học:/)).toBeInTheDocument();
    expect(screen.queryByText(/· Native/)).toBeNull();
    expect(screen.queryByText(/· Learning/)).toBeNull();
  });

  it("progress bar exposes aria-valuemax of 5 (welcome→native→target→start_with→confirmation; goal/profession/level removed as dead UI)", () => {
    const { container } = renderPage();
    const progress = container.querySelector('[role="progressbar"]')!;
    expect(progress.getAttribute("aria-valuemax")).toBe("5");
    expect(progress.getAttribute("aria-valuenow")).toBe("1");
  });
});

describe("OnboardingPage — chrome language follows native choice", () => {
  it("welcome screen stays bilingual (pre-pick, both audiences present)", () => {
    renderPage();
    // VI primary + EN secondary BOTH present before any native pick.
    expect(screen.getByText(/Chào bạn — mình là Mercy\./)).toBeInTheDocument();
    expect(screen.getByText(/Hi — I'm Mercy\./)).toBeInTheDocument();
  });

  it("vi-native: post-pick screens are VI-only (no EN subtitle)", async () => {
    const user = userEvent.setup();
    renderPage();
    await toTargetStepVi(user); // pick Tiếng Việt
    expect(
      screen.getByText(/Bạn muốn học ngôn ngữ nào/),
    ).toBeInTheDocument();
    // The EN subtitle that used to sit under the VI title is gone.
    expect(screen.queryByText(/What do you want to learn/i)).toBeNull();
  });

  it("en-native: post-pick screens are EN-only (no VI primary)", async () => {
    const user = userEvent.setup();
    renderPage();
    await clickStart(user);
    await user.click(
      screen.getByRole("radio", { name: /Tiếng Anh|English/ }),
    );
    // Target screen now renders in English only.
    expect(
      screen.getByText(/What do you want to learn/i),
    ).toBeInTheDocument();
    expect(screen.queryByText(/Bạn muốn học ngôn ngữ nào/)).toBeNull();
    // Continue button is single-language English (no "· Tiếp tục").
    expect(
      screen.getByRole("button", { name: /Continue/ }),
    ).toBeInTheDocument();
    expect(screen.queryByText(/· Continue/)).toBeNull();
  });

  it("native picker shows each option in its OWN language", async () => {
    const user = userEvent.setup();
    renderPage();
    await clickStart(user);
    // Vietnamese option in Vietnamese, English option in English —
    // self-evident regardless of the default chrome language.
    expect(
      screen.getByRole("radio", { name: /Tiếng Việt/ }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("radio", { name: /English/ }),
    ).toBeInTheDocument();
  });

  it("native-picker header stays bilingual (pre-pick, like welcome)", async () => {
    const user = userEvent.setup();
    renderPage();
    await clickStart(user);
    // Both audiences present before the pick → VI title + EN subtitle.
    expect(
      screen.getByText(/Tiếng mẹ đẻ của bạn là gì/),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/What's your native language/i),
    ).toBeInTheDocument();
  });
});
