// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

// ---------------------------------------------------------------------------
// Mock react-router-dom's useNavigate. The component's only external
// dependency is the navigate() function it acquires from useNavigate(); the
// rest of react-router-dom is preserved so <MemoryRouter> still works.
// ---------------------------------------------------------------------------
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>(
    "react-router-dom",
  );
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

import { DemoFeatureBlocker } from "@/components/DemoFeatureBlocker";

function renderBlocker(props: { featureName: string; description?: string }) {
  return render(
    <MemoryRouter>
      <DemoFeatureBlocker {...props} />
    </MemoryRouter>,
  );
}

beforeEach(() => {
  mockNavigate.mockReset();
  cleanup();
});

describe("DemoFeatureBlocker — rendering", () => {
  it("renders the feature name followed by ' Locked' in the title", () => {
    renderBlocker({ featureName: "Pronunciation" });
    expect(screen.getByText("Pronunciation Locked")).toBeTruthy();
  });

  it("renders the unlock call-to-action button", () => {
    renderBlocker({ featureName: "Pronunciation" });
    const button = screen.getByRole("button", { name: /Sign Up to Unlock/i });
    expect(button).toBeTruthy();
  });

  it("uses the default description when none is provided", () => {
    renderBlocker({ featureName: "Grammar" });
    expect(
      screen.getByText(
        "This feature is only available to registered users.",
      ),
    ).toBeTruthy();
  });

  it("renders a custom description when provided", () => {
    const description = "Đăng ký để mở khóa tính năng này.";
    renderBlocker({ featureName: "Listening", description });
    expect(screen.getByText(description)).toBeTruthy();
  });

  it("does not render the default description when a custom one is given", () => {
    renderBlocker({ featureName: "Listening", description: "Custom copy" });
    expect(
      screen.queryByText(
        "This feature is only available to registered users.",
      ),
    ).toBeNull();
  });
});

describe("DemoFeatureBlocker — navigation behavior", () => {
  it("does not navigate on initial render", () => {
    renderBlocker({ featureName: "Writing" });
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("navigates to /auth when the unlock button is clicked", () => {
    renderBlocker({ featureName: "Writing" });
    fireEvent.click(screen.getByRole("button", { name: /Sign Up to Unlock/i }));
    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith("/auth");
  });

  it("navigates once per click (each click is an independent call)", () => {
    renderBlocker({ featureName: "Writing" });
    const button = screen.getByRole("button", { name: /Sign Up to Unlock/i });
    fireEvent.click(button);
    fireEvent.click(button);
    fireEvent.click(button);
    expect(mockNavigate).toHaveBeenCalledTimes(3);
    expect(mockNavigate).toHaveBeenLastCalledWith("/auth");
  });
});

describe("DemoFeatureBlocker — edge cases", () => {
  it("handles an empty feature name (still renders ' Locked')", () => {
    const { container } = renderBlocker({ featureName: "" });
    // Title text is "{featureName} Locked"; with an empty name it is " Locked".
    expect(container.textContent).toContain("Locked");
  });

  it("handles an empty custom description", () => {
    renderBlocker({ featureName: "Speak", description: "" });
    // An empty description should suppress the default copy.
    expect(
      screen.queryByText(
        "This feature is only available to registered users.",
      ),
    ).toBeNull();
    expect(screen.getByText("Speak Locked")).toBeTruthy();
  });

  it("renders feature names containing special characters verbatim", () => {
    renderBlocker({ featureName: "AI & Chat <Beta>" });
    expect(screen.getByText("AI & Chat <Beta> Locked")).toBeTruthy();
  });

  it("renders long feature names without truncation", () => {
    const longName = "Super ".repeat(20).trim();
    renderBlocker({ featureName: longName });
    expect(screen.getByText(`${longName} Locked`)).toBeTruthy();
  });

  it("renders Vietnamese feature names correctly", () => {
    renderBlocker({ featureName: "Phát âm" });
    expect(screen.getByText("Phát âm Locked")).toBeTruthy();
  });

  it("re-renders cleanly when the feature name prop changes", () => {
    const { rerender } = render(
      <MemoryRouter>
        <DemoFeatureBlocker featureName="First" />
      </MemoryRouter>,
    );
    expect(screen.getByText("First Locked")).toBeTruthy();
    rerender(
      <MemoryRouter>
        <DemoFeatureBlocker featureName="Second" />
      </MemoryRouter>,
    );
    expect(screen.getByText("Second Locked")).toBeTruthy();
    expect(screen.queryByText("First Locked")).toBeNull();
  });
});

describe("DemoFeatureBlocker — structure", () => {
  it("renders exactly one actionable button", () => {
    renderBlocker({ featureName: "Vocab" });
    expect(screen.getAllByRole("button")).toHaveLength(1);
  });

  it("exposes a named export that is a function component", () => {
    expect(typeof DemoFeatureBlocker).toBe("function");
  });
});
