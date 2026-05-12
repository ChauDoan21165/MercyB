// src/components/mercy-guide/__tests__/MercyTeacherTab.disclosure.test.tsx
//
// Scoped test for the Apple 5.1.1 AI disclosure modal on the
// MercyTeacherTab entry point. Lives in its own file so the much
// larger MercyTeacherTab surface (lesson cards, kids grid, notebook
// popup, etc.) doesn't get pulled into the disclosure assertion.

import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

// Heavy children that would pull DB / IndexedDB / network on mount
// are stubbed to null. We only care about the wrapper's disclosure
// gate; the rest of the tab is exercised elsewhere.
vi.mock("@/components/notebook/NotebookPanel", () => ({
  NotebookPanel: () => null,
}));
vi.mock("@/components/notebook/SaveWordPopup", () => ({
  SaveWordPopup: () => null,
}));
vi.mock("../kidsDataLoader", () => ({
  loadKidsItemsForPages: vi.fn(async () => []),
}));

import { MercyTeacherTab } from "../MercyTeacherTab";

beforeEach(() => {
  vi.clearAllMocks();
  window.localStorage.clear();
});

describe("MercyTeacherTab — AI disclosure (Apple 5.1.1)", () => {
  it("renders the disclosure modal when localStorage flag is absent", () => {
    render(<MercyTeacherTab />);
    expect(screen.getByTestId("mercy-ai-disclosure")).toBeInTheDocument();
    expect(screen.getByText(/Giáo viên Mercy dùng AI/i)).toBeInTheDocument();
  });

  it("hides the disclosure modal when localStorage flag is set", () => {
    window.localStorage.setItem("mercy_ai_disclosure_accepted", "1");
    render(<MercyTeacherTab />);
    expect(screen.queryByTestId("mercy-ai-disclosure")).toBeNull();
  });

  it("accepting the disclosure persists to localStorage and dismisses the modal", () => {
    render(<MercyTeacherTab />);
    fireEvent.click(screen.getByTestId("mercy-ai-disclosure-accept"));
    expect(window.localStorage.getItem("mercy_ai_disclosure_accepted")).toBe("1");
    expect(screen.queryByTestId("mercy-ai-disclosure")).toBeNull();
  });

  it("does NOT render the disclosure on the kids-mode path", () => {
    // Kids mode is offline and never dispatches to the AI provider,
    // so the modal stays out of that path. The early return guards
    // it. Hooks remain declared above the conditional return.
    render(<MercyTeacherTab isKidsMode />);
    expect(screen.queryByTestId("mercy-ai-disclosure")).toBeNull();
  });
});
