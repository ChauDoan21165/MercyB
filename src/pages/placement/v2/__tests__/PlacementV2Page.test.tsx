// src/pages/placement/v2/__tests__/PlacementV2Page.test.tsx
//
// PR 11 — the re-surfaced page renders the right Vietnamese-first screen
// for every flow phase. The hook is mocked (its own logic is tested in
// usePlacementSession.test.tsx); this asserts the view layer + the
// who-for→self-rating local step.

import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { PlacementFlowState } from "@/lib/placement/v2/flow";

let mockState: PlacementFlowState;
const begin = vi.fn();
const rate = vi.fn();
const submit = vi.fn();
const abandon = vi.fn();

vi.mock("@/hooks/usePlacementSession", () => ({
  usePlacementSession: () => ({
    state: mockState,
    begin,
    rate,
    submit,
    refreshResult: vi.fn(),
    abandon,
  }),
}));

import PlacementV2Page from "../PlacementV2Page";

function mk(p: Partial<PlacementFlowState>): PlacementFlowState {
  return {
    status: "idle",
    sessionId: null,
    item: null,
    result: null,
    error: null,
    resumed: false,
    lastDeduplicated: false,
    answeredCount: 0,
    ...p,
  };
}

function renderPage() {
  return render(
    <MemoryRouter>
      <PlacementV2Page />
    </MemoryRouter>,
  );
}

describe("PlacementV2Page", () => {
  beforeEach(() => {
    begin.mockReset();
    rate.mockReset();
    mockState = mk({ status: "idle" });
  });

  it("who-for first, then self-rating calls begin with the rating", () => {
    renderPage();
    expect(screen.getByText("Bài kiểm tra xếp lớp")).toBeTruthy();
    fireEvent.click(screen.getByText("Tôi là người lớn — bắt đầu"));
    // self-rating step
    expect(screen.getByText(/trình độ tiếng Anh/i)).toBeTruthy();
    fireEvent.click(screen.getByText(/Mới bắt đầu/));
    expect(begin).toHaveBeenCalledWith({ selfRating: "beginner" });
  });

  it("renders an in-progress item Vietnamese-first with its options", () => {
    mockState = mk({
      status: "in_progress",
      sessionId: "s1",
      item: {
        id: "i1",
        type: "grammar",
        skill: "grammar",
        prompt: { en: "Choose the correct form", vi: "Chọn dạng đúng" },
        options: [
          { id: "a", en: "go", vi: "go" },
          { id: "b", en: "goes", vi: "goes" },
        ],
      },
    });
    renderPage();
    expect(screen.getByText("Chọn dạng đúng")).toBeTruthy();
    expect(screen.getByText("go")).toBeTruthy();
    expect(screen.getByText("goes")).toBeTruthy();
    // Answer disabled until an option is chosen.
    const btn = screen.getByText("Trả lời") as HTMLButtonElement;
    expect(btn.disabled).toBe(true);
    fireEvent.click(screen.getByText("goes"));
    expect((screen.getByText("Trả lời") as HTMLButtonElement).disabled).toBe(
      false,
    );
  });

  it("complete screen shows the CEFR band + start CTA", () => {
    mockState = mk({
      status: "complete",
      sessionId: "s1",
      result: {
        sessionId: "s1",
        bankVersion: "bv1",
        overall: { cefr: "B1", theta: 0.2, se: 0.27 },
        perSkill: [],
        l1Weaknesses: [],
        recommendedRoomId: "english_b1_b101",
        itemsAdministered: 18,
        elapsedMs: 9000,
        terminationReason: "precision",
        retest: { eligibleAt: "2026-08-17T00:00:00.000Z", rationale: "retest_cooldown_90d" },
        growth: null,
        createdAt: "2026-05-19T00:00:00.000Z",
      },
    });
    renderPage();
    expect(screen.getByText("B1")).toBeTruthy();
    expect(screen.getByText("Bắt đầu học")).toBeTruthy();
  });

  it("auth error → Vietnamese sign-in prompt", () => {
    mockState = mk({
      status: "error",
      error: { kind: "auth_required", message: "x", messageVi: "y" },
    });
    renderPage();
    expect(screen.getByText("Vui lòng đăng nhập")).toBeTruthy();
  });

  it("in_progress without an item → honest restart (PR9 flag #4/#5)", () => {
    mockState = mk({ status: "in_progress", sessionId: "s1", item: null });
    renderPage();
    expect(screen.getByText("Phiên kiểm tra chưa hoàn tất")).toBeTruthy();
    expect(screen.getByText("Bắt đầu lại")).toBeTruthy();
  });
});
