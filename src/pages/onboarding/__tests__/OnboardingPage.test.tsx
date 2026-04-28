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

beforeEach(() => {
  updateMock.mockClear();
  eqMock.mockClear();
  fromMock.mockClear();
  navigateMock.mockClear();
  mockUseAuth.mockReturnValue({ user: { id: "user-uuid-1" } });
  vi.spyOn(console, "log").mockImplementation(() => {});
  vi.spyOn(console, "warn").mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("OnboardingPage — initial render + welcome step", () => {
  it("renders the welcome step on first mount with VI primary heading", () => {
    renderPage();
    // VI heading appears (Mercy intro)
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(/Chào bạn/);
    // Bắt đầu CTA visible
    expect(screen.getByRole("button", { name: /Let's start|Bắt đầu/ })).toBeInTheDocument();
  });

  it("renders both VI and EN strings (bilingual primary/secondary)", () => {
    renderPage();
    // Welcome body — VI present
    expect(screen.getByText(/60 giây/)).toBeInTheDocument();
    // EN secondary present
    expect(screen.getByText(/60 seconds/)).toBeInTheDocument();
  });

  it("does NOT show a Back button on the first step", () => {
    renderPage();
    expect(screen.queryByRole("button", { name: /Back/i })).toBeNull();
  });

  it("clicking the welcome CTA advances to the goal step", async () => {
    const user = userEvent.setup();
    renderPage();
    await user.click(screen.getByRole("button", { name: /Let's start|Bắt đầu/ }));
    expect(screen.getByText(/Bạn học tiếng Anh để làm gì/)).toBeInTheDocument();
  });
});

describe("OnboardingPage — goal step routing", () => {
  it("selecting 'career' advances to the profession step", async () => {
    const user = userEvent.setup();
    renderPage();
    await user.click(screen.getByRole("button", { name: /Bắt đầu|Let's start/ }));
    // "Đi làm" / Career card
    await user.click(screen.getByRole("radio", { name: /Đi làm/ }));
    expect(screen.getByText(/Bạn làm nghề gì/)).toBeInTheDocument();
  });

  it("selecting a non-career goal SKIPS the profession step (jumps to level)", async () => {
    const user = userEvent.setup();
    renderPage();
    await user.click(screen.getByRole("button", { name: /Bắt đầu|Let's start/ }));
    // IELTS card → should skip profession entirely
    await user.click(screen.getByRole("radio", { name: /Luyện IELTS/ }));
    expect(screen.getByText(/Trình độ tiếng Anh hiện tại/)).toBeInTheDocument();
    expect(screen.queryByText(/Bạn làm nghề gì/)).toBeNull();
  });

  it("selecting a profession advances to the level step", async () => {
    const user = userEvent.setup();
    renderPage();
    await user.click(screen.getByRole("button", { name: /Bắt đầu|Let's start/ }));
    await user.click(screen.getByRole("radio", { name: /Đi làm/ }));
    await user.click(screen.getByRole("radio", { name: /Thợ nail/ }));
    expect(screen.getByText(/Trình độ tiếng Anh hiện tại/)).toBeInTheDocument();
  });

  it("selecting a level advances to the confirmation step", async () => {
    const user = userEvent.setup();
    renderPage();
    await user.click(screen.getByRole("button", { name: /Bắt đầu|Let's start/ }));
    await user.click(screen.getByRole("radio", { name: /Luyện VSTEP/ }));
    await user.click(screen.getByRole("radio", { name: /Đang phát triển/ }));
    expect(screen.getByText(/Đã sẵn sàng/)).toBeInTheDocument();
  });
});

describe("OnboardingPage — back button", () => {
  it("Back from profession returns to goal", async () => {
    const user = userEvent.setup();
    renderPage();
    await user.click(screen.getByRole("button", { name: /Bắt đầu|Let's start/ }));
    await user.click(screen.getByRole("radio", { name: /Đi làm/ }));
    expect(screen.getByText(/Bạn làm nghề gì/)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /^Back/ }));
    expect(screen.getByText(/Bạn học tiếng Anh để làm gì/)).toBeInTheDocument();
  });

  it("Back from level (non-career path) returns to goal, not profession", async () => {
    const user = userEvent.setup();
    renderPage();
    await user.click(screen.getByRole("button", { name: /Bắt đầu|Let's start/ }));
    await user.click(screen.getByRole("radio", { name: /Luyện TOEIC/ }));
    expect(screen.getByText(/Trình độ tiếng Anh hiện tại/)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /^Back/ }));
    expect(screen.getByText(/Bạn học tiếng Anh để làm gì/)).toBeInTheDocument();
  });
});

describe("OnboardingPage — confirmation + persist", () => {
  it("Hoàn tất persists all chosen fields to profiles via supabase update", async () => {
    const user = userEvent.setup();
    renderPage();
    await user.click(screen.getByRole("button", { name: /Bắt đầu|Let's start/ }));
    await user.click(screen.getByRole("radio", { name: /Đi làm/ }));
    await user.click(screen.getByRole("radio", { name: /Y tế|Healthcare/ }));
    await user.click(screen.getByRole("radio", { name: /Đang phát triển/ }));
    await user.click(screen.getByRole("button", { name: /Hoàn tất|Finish/ }));

    expect(fromMock).toHaveBeenCalledWith("profiles");
    expect(updateMock).toHaveBeenCalledTimes(1);
    const payload = updateMock.mock.calls[0][0] as Record<string, unknown>;
    expect(payload.primary_goal).toBe("career");
    expect(payload.profession).toBe("healthcare");
    expect(payload.english_level).toBe("intermediate");
    expect(typeof payload.onboarded_at).toBe("string");
    expect(eqMock).toHaveBeenCalledWith("id", "user-uuid-1");
  });

  it("Hoàn tất navigates to the picked first-lesson route", async () => {
    const user = userEvent.setup();
    renderPage();
    await user.click(screen.getByRole("button", { name: /Bắt đầu|Let's start/ }));
    await user.click(screen.getByRole("radio", { name: /Luyện IELTS/ }));
    await user.click(screen.getByRole("radio", { name: /Đã giỏi rồi/ }));
    await user.click(screen.getByRole("button", { name: /Hoàn tất|Finish/ }));
    expect(navigateMock).toHaveBeenCalledWith(
      "/exam-prep/ielts/speaking",
      expect.objectContaining({ replace: true }),
    );
  });
});

describe("OnboardingPage — skip flow", () => {
  it("Skip link sets onboarded_at without other fields and navigates Home", async () => {
    const user = userEvent.setup();
    renderPage();
    await user.click(screen.getByRole("button", { name: /Skip onboarding|^Skip/i }));
    expect(updateMock).toHaveBeenCalledTimes(1);
    const payload = updateMock.mock.calls[0][0] as Record<string, unknown>;
    expect(typeof payload.onboarded_at).toBe("string");
    expect(payload.primary_goal).toBeUndefined();
    expect(payload.profession).toBeUndefined();
    expect(payload.english_level).toBeUndefined();
    expect(navigateMock).toHaveBeenCalledWith(
      "/",
      expect.objectContaining({ replace: true }),
    );
  });

  it("Skip flow does not crash when supabase is not called (no user id)", async () => {
    mockUseAuth.mockReturnValue({ user: null });
    const user = userEvent.setup();
    renderPage();
    await user.click(screen.getByRole("button", { name: /Skip onboarding|^Skip/i }));
    expect(updateMock).not.toHaveBeenCalled();
    expect(navigateMock).toHaveBeenCalledWith(
      "/",
      expect.objectContaining({ replace: true }),
    );
  });
});

describe("OnboardingPage — progress bar accessibility", () => {
  it("renders a progressbar with aria-valuenow that advances by step", async () => {
    const user = userEvent.setup();
    const { container } = renderPage();
    const findProgress = () => container.querySelector('[role="progressbar"]')!;
    expect(findProgress().getAttribute("aria-valuenow")).toBe("1");
    expect(findProgress().getAttribute("aria-valuemax")).toBe("5");

    await user.click(screen.getByRole("button", { name: /Bắt đầu|Let's start/ }));
    expect(findProgress().getAttribute("aria-valuenow")).toBe("2");
    await user.click(screen.getByRole("radio", { name: /Đi du lịch|Travel/ }));
    expect(findProgress().getAttribute("aria-valuenow")).toBe("4"); // skipped profession → level (index 3 → valuenow 4)
  });

  it("confirmation step shows summary of all selected fields in VI", async () => {
    const user = userEvent.setup();
    renderPage();
    await user.click(screen.getByRole("button", { name: /Bắt đầu|Let's start/ }));
    await user.click(screen.getByRole("radio", { name: /Đi làm/ }));
    await user.click(screen.getByRole("radio", { name: /Nhà hàng/ }));
    await user.click(screen.getByRole("radio", { name: /Mới bắt đầu/ }));
    const summary = screen.getByText(/Mục tiêu/);
    expect(summary).toBeInTheDocument();
    const summaryRoot = summary.closest("ul")!;
    expect(within(summaryRoot).getByText(/Nhà hàng/)).toBeInTheDocument();
    expect(within(summaryRoot).getByText(/Mới bắt đầu/)).toBeInTheDocument();
  });
});
