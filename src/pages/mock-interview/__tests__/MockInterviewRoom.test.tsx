// MockInterviewRoom — Phase 2 community integration tests.
//
// These cover the additive surfaces only:
//   - pre-flight panel visibility gated on the feature flag
//   - default slider state
//   - slider state updates
//   - getPromptsForInterview is bypassed when useCommunity is off
//   - attribution badge for community vs hardcoded prompts
//   - post-interview share CTA only renders when flag is on AND we're
//     in summary
//
// We mount the room in isolation, mock useFeatureFlag, useEntitlements,
// the rate-limit + server-gate libs, and the getPromptsForInterview
// helper. Telemetry is mocked too because it pokes window globals.

import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";

const { flagState, getPromptsMock, startSessionMock } = vi.hoisted(() => ({
  flagState: { enabled: false } as { enabled: boolean },
  getPromptsMock: vi.fn(),
  startSessionMock: vi.fn(),
}));

vi.mock("@/hooks/useFeatureFlag", () => ({
  useFeatureFlag: () => ({ enabled: flagState.enabled, loading: false }),
}));

vi.mock("@/lib/useEntitlements", () => ({
  useEntitlements: () => ({
    ent: { is_premium: true, status: "active" },
    loading: false,
  }),
}));

vi.mock("@/lib/mock-interview/rateLimit", () => ({
  checkGate: () => ({ allowed: true, used: 0, limit: 99, resetsAt: "" }),
  recordStart: vi.fn(),
}));

vi.mock("@/lib/mock-interview/serverGate", () => ({
  startMockInterviewSession: (...args: unknown[]) => startSessionMock(...args),
  endMockInterviewSession: () => Promise.resolve(),
}));

// Stub the singleton client so the eager `import` chain in
// mixPrompts.ts → supabaseClient.ts doesn't crash on missing env vars
// during test transform.
vi.mock("@/lib/supabaseClient", () => ({
  supabase: {
    from: vi.fn(),
    auth: { getUser: vi.fn().mockResolvedValue({ data: { user: null } }) },
  },
}));

vi.mock("@/lib/interviewPrompts/mixPrompts", async () => {
  const actual = await vi.importActual<Record<string, unknown>>(
    "@/lib/interviewPrompts/mixPrompts",
  );
  return {
    ...actual,
    getPromptsForInterview: (...args: unknown[]) => getPromptsMock(...args),
  };
});

vi.mock("@/lib/interviewPrompts/telemetry", () => ({
  trackCommunityPromptsUsedInRoom: vi.fn(),
  trackCommunityPromptFallback: vi.fn(),
  trackInterviewStarted: vi.fn(),
  trackInterviewCompleted: vi.fn(),
}));

import MockInterviewRoom from "../MockInterviewRoom";

function renderRoom(scenarioId = "software_junior_intro") {
  return render(
    <MemoryRouter initialEntries={[`/mock-interview/${scenarioId}`]}>
      <Routes>
        <Route
          path="/mock-interview/:scenarioId"
          element={<MockInterviewRoom />}
        />
        <Route
          path="/mock-interview"
          element={<div data-testid="index-route" />}
        />
        <Route
          path="/mock-interview/submit-prompt"
          element={<div data-testid="submit-route" />}
        />
      </Routes>
    </MemoryRouter>,
  );
}

beforeEach(() => {
  flagState.enabled = false;
  getPromptsMock.mockReset();
  startSessionMock.mockReset();
  startSessionMock.mockResolvedValue({
    kind: "allowed",
    sessionId: "session-1",
  });
});

describe("MockInterviewRoom — pre-flight panel", () => {
  it("does NOT render the community panel when feature flag is off", async () => {
    flagState.enabled = false;
    renderRoom();
    await screen.findByText(/Bắt đầu phỏng vấn/);
    expect(
      screen.queryByTestId("community-preflight-panel"),
    ).not.toBeInTheDocument();
  });

  it("renders the community panel when feature flag is on AND interview hasn't started", async () => {
    flagState.enabled = true;
    renderRoom();
    expect(
      await screen.findByTestId("community-preflight-panel"),
    ).toBeInTheDocument();
  });

  it("default communityRatio is 50", async () => {
    flagState.enabled = true;
    renderRoom();
    const slider = (await screen.findByTestId(
      "community-ratio-slider",
    )) as HTMLInputElement;
    expect(slider.value).toBe("50");
    expect(screen.getByTestId("community-ratio-value")).toHaveTextContent("50%");
  });

  it("slider updates state on change", async () => {
    flagState.enabled = true;
    renderRoom();
    const slider = (await screen.findByTestId(
      "community-ratio-slider",
    )) as HTMLInputElement;
    fireEvent.change(slider, { target: { value: "80" } });
    expect(slider.value).toBe("80");
    expect(screen.getByTestId("community-ratio-value")).toHaveTextContent("80%");
  });

  it("does not render the community panel for verticals without a community equivalent", async () => {
    // university scenarios have no mapped profession.
    flagState.enabled = true;
    renderRoom("uni_why_university");
    await screen.findByText(/Bắt đầu phỏng vấn/);
    expect(
      screen.queryByTestId("community-preflight-panel"),
    ).not.toBeInTheDocument();
  });
});

describe("MockInterviewRoom — start with community off", () => {
  it("does NOT call getPromptsForInterview when useCommunity is unchecked", async () => {
    flagState.enabled = true;
    renderRoom();
    const toggle = (await screen.findByTestId(
      "community-toggle",
    )) as HTMLInputElement;
    fireEvent.click(toggle); // turn off
    expect(toggle.checked).toBe(false);

    const startBtn = screen.getByText(/Bắt đầu phỏng vấn/);
    await act(async () => {
      fireEvent.click(startBtn);
    });

    await waitFor(() => {
      // The "asking" phase shows the depth badge for hardcoded path.
      expect(screen.getByText(/Câu mở|Câu đào sâu|Câu thử áp lực/)).toBeInTheDocument();
    });

    expect(getPromptsMock).not.toHaveBeenCalled();
  });

  it("does NOT call getPromptsForInterview when slider is at 0%", async () => {
    flagState.enabled = true;
    renderRoom();
    const slider = (await screen.findByTestId(
      "community-ratio-slider",
    )) as HTMLInputElement;
    fireEvent.change(slider, { target: { value: "0" } });

    const startBtn = screen.getByText(/Bắt đầu phỏng vấn/);
    await act(async () => {
      fireEvent.click(startBtn);
    });

    expect(getPromptsMock).not.toHaveBeenCalled();
  });
});

describe("MockInterviewRoom — attribution badge", () => {
  it("renders the attribution badge when active prompt is community-sourced", async () => {
    flagState.enabled = true;
    getPromptsMock.mockResolvedValue([
      {
        source: "community",
        text: "Why this team?",
        textVi: "Vì sao chọn team này?",
        communityPromptId: "p-1",
        submitterDisplayName: "Linh N.",
        context: "Hỏi tại Stripe SF",
      },
      {
        source: "hardcoded",
        text: "Tell me about yourself.",
        textVi: "Giới thiệu bản thân.",
      },
    ]);

    renderRoom();
    await screen.findByTestId("community-preflight-panel");
    const startBtn = screen.getByText(/Bắt đầu phỏng vấn/);
    await act(async () => {
      fireEvent.click(startBtn);
    });

    const badge = await screen.findByTestId("community-attribution");
    expect(badge.textContent).toMatch(/Linh N\./);
    expect(badge.textContent).toMatch(/Stripe SF/);
  });

  it("does NOT render the attribution badge when active prompt is hardcoded", async () => {
    flagState.enabled = true;
    getPromptsMock.mockResolvedValue([
      {
        source: "hardcoded",
        text: "Tell me about yourself.",
        textVi: "Giới thiệu bản thân.",
      },
      {
        source: "community",
        text: "Why this team?",
        textVi: "Vì sao chọn team này?",
        communityPromptId: "p-1",
        submitterDisplayName: "Linh N.",
        context: null,
      },
    ]);

    renderRoom();
    const startBtn = await screen.findByText(/Bắt đầu phỏng vấn/);
    await act(async () => {
      fireEvent.click(startBtn);
    });

    // First prompt is hardcoded — no attribution badge yet.
    await waitFor(() =>
      expect(screen.getByText("Giới thiệu bản thân.")).toBeInTheDocument(),
    );
    expect(
      screen.queryByTestId("community-attribution"),
    ).not.toBeInTheDocument();
  });

  it("falls back to 'Anonymous' label when submitterDisplayName is null", async () => {
    flagState.enabled = true;
    getPromptsMock.mockResolvedValue([
      {
        source: "community",
        text: "Anon question",
        communityPromptId: "p-1",
        submitterDisplayName: null,
        context: null,
      },
    ]);

    renderRoom();
    const startBtn = await screen.findByText(/Bắt đầu phỏng vấn/);
    await act(async () => {
      fireEvent.click(startBtn);
    });
    const badge = await screen.findByTestId("community-attribution");
    expect(badge.textContent).toMatch(/Anonymous/);
  });
});

describe("MockInterviewRoom — post-interview share CTA", () => {
  it("renders the share CTA only when interview is in summary state AND flag is on", async () => {
    flagState.enabled = true;
    // 3 questions in software_junior_intro — we'll just answer them all
    // via the hardcoded path (toggle off so no Supabase call).
    renderRoom();
    const toggle = (await screen.findByTestId(
      "community-toggle",
    )) as HTMLInputElement;
    fireEvent.click(toggle); // off
    fireEvent.click(screen.getByText(/Bắt đầu phỏng vấn/));

    // Each question: type, submit, advance. Loop until summary appears.
    for (let i = 0; i < 10; i++) {
      const summary = screen.queryByText(/Hoàn thành phỏng vấn/);
      if (summary) break;
      const textarea = await screen.findByPlaceholderText(/Trả lời bằng tiếng Anh/);
      fireEvent.change(textarea, { target: { value: "An answer." } });
      const submit = screen.getByText(/Gửi và xem/);
      await act(async () => {
        fireEvent.click(submit);
      });
      const next = await screen.findByText(/Câu tiếp theo|Xem tổng kết/);
      await act(async () => {
        fireEvent.click(next);
      });
    }

    await screen.findByText(/Hoàn thành phỏng vấn/);
    const cta = screen.getByTestId("community-share-cta");
    expect(cta).toBeInTheDocument();
    const link = cta.querySelector("a");
    expect(link?.getAttribute("href")).toBe(
      "/mock-interview/submit-prompt?profession=tech-worker",
    );
  });

  it("does NOT render share CTA when feature flag is off", async () => {
    flagState.enabled = false;
    renderRoom();
    fireEvent.click(await screen.findByText(/Bắt đầu phỏng vấn/));

    for (let i = 0; i < 10; i++) {
      const summary = screen.queryByText(/Hoàn thành phỏng vấn/);
      if (summary) break;
      const textarea = await screen.findByPlaceholderText(/Trả lời bằng tiếng Anh/);
      fireEvent.change(textarea, { target: { value: "An answer." } });
      const submit = screen.getByText(/Gửi và xem/);
      await act(async () => {
        fireEvent.click(submit);
      });
      const next = await screen.findByText(/Câu tiếp theo|Xem tổng kết/);
      await act(async () => {
        fireEvent.click(next);
      });
    }

    await screen.findByText(/Hoàn thành phỏng vấn/);
    expect(
      screen.queryByTestId("community-share-cta"),
    ).not.toBeInTheDocument();
  });
});
