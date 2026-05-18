// @vitest-environment jsdom

import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import React from "react";

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

function renderPage() {
  return render(
    <MemoryRouter initialEntries={["/onboarding"]}>
      <Routes>
        <Route path="/onboarding" element={<OnboardingPage />} />
      </Routes>
    </MemoryRouter>,
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

  it("shows honesty badges: Korean limited, Chinese B2–C2-only (locked #7)", async () => {
    const user = userEvent.setup();
    renderPage();
    await toTargetStepVi(user);
    expect(screen.getByText(/only for now/i)).toBeInTheDocument(); // zh skeletal
    expect(screen.getAllByText(/Limited content/i).length).toBeGreaterThan(0); // ko partial
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

describe("OnboardingPage — single English target preserves the (vi,en) flow", () => {
  it("vi → English (only) → Continue → reaches the English goal step", async () => {
    const user = userEvent.setup();
    renderPage();
    await toTargetStepVi(user); // English already pre-checked
    await user.click(screen.getByRole("button", { name: /Tiếp tục|Continue/ }));
    // No start_with (single target); English primary → goal step shows
    expect(
      screen.getByText(/Bạn học tiếng Anh để làm gì/),
    ).toBeInTheDocument();
  });

  it("full English path finishes: writes the pair + English fields", async () => {
    const user = userEvent.setup();
    renderPage();
    await toTargetStepVi(user);
    await user.click(screen.getByRole("button", { name: /Tiếp tục|Continue/ }));
    await user.click(screen.getByRole("radio", { name: /Đi làm/ })); // career
    await user.click(screen.getByRole("radio", { name: /Y tế|Healthcare/ }));
    await user.click(screen.getByRole("radio", { name: /Đang phát triển/ }));
    await user.click(screen.getByRole("button", { name: /Hoàn tất|Finish/ }));

    expect(fromMock).toHaveBeenCalledWith("profiles");
    const payload = updateMock.mock.calls[0][0] as Record<string, unknown>;
    expect(payload.native_language).toBe("vi");
    expect(payload.target_languages).toEqual(["en"]);
    expect(payload.primary_goal).toBe("career");
    expect(payload.profession).toBe("healthcare");
    expect(payload.english_level).toBe("intermediate");
    expect(typeof payload.onboarded_at).toBe("string");
    expect(eqMock).toHaveBeenCalledWith("id", "user-uuid-1");
    expect(navigateMock).toHaveBeenCalledWith(
      "/professions/healthcare",
      expect.objectContaining({ replace: true }),
    );
    // Signed-in users also seed the localStorage pair (PR 3 reconciles).
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
    expect(navigateMock).toHaveBeenCalledWith(
      "/languages/japanese",
      expect.objectContaining({ replace: true }),
    );
  });
});

describe("OnboardingPage — multi-target → start_with → non-English track", () => {
  it("vi → en+ja → start_with(ja) skips English steps, routes to /languages/japanese", async () => {
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
    expect(payload.primary_goal).toBeUndefined(); // English-only fields not written
    expect(payload.english_level).toBeUndefined();
    expect(navigateMock).toHaveBeenCalledWith(
      "/languages/japanese",
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
    expect(navigateMock).toHaveBeenCalledWith(
      "/languages/spanish",
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
  it("confirmation summarizes the chosen pair in VI", async () => {
    const user = userEvent.setup();
    renderPage();
    await toTargetStepVi(user);
    await user.click(screen.getByRole("button", { name: /Tiếp tục|Continue/ }));
    await user.click(screen.getByRole("radio", { name: /Học chung|General/ }));
    // general goal → level → confirmation
    await user.click(screen.getByRole("radio", { name: /Mới bắt đầu/ }));
    const native = screen.getByText(/Tiếng mẹ đẻ · Native/);
    const summaryRoot = native.closest("ul")!;
    expect(within(summaryRoot).getByText(/Học · Learning/)).toBeInTheDocument();
  });

  it("progress bar exposes aria-valuemax of 8 (full step set)", () => {
    const { container } = renderPage();
    const progress = container.querySelector('[role="progressbar"]')!;
    expect(progress.getAttribute("aria-valuemax")).toBe("8");
    expect(progress.getAttribute("aria-valuenow")).toBe("1");
  });
});
