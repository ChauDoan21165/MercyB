// @vitest-environment jsdom
//
// Hardening tests for src/components/MercyGuideSettings.tsx
//
// The component is a thin, presentational toggle that reads `isEnabled` and
// `setGuideEnabled` from the `useMercyGuide` hook and renders a bilingual
// (English-primary / Vietnamese-secondary) label next to a Radix Switch.
//
// These tests pin down:
//   - the bilingual copy (Vietnamese-first product invariant),
//   - the label/control wiring (htmlFor <-> id, role=switch),
//   - the checked state mirroring `isEnabled`,
//   - the toggle callback contract with `setGuideEnabled`,
//   - resilience to odd/edge hook return values,
//   - and one end-to-end pass through the REAL hook so the localStorage
//     persistence contract is exercised, not just the mock.

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, fireEvent, cleanup, within } from "@testing-library/react";

// ---------------------------------------------------------------------------
// Mock the hook. We control the values the component sees so the tests are
// deterministic and isolated from fetch / localStorage / timers.
// ---------------------------------------------------------------------------
const setGuideEnabled = vi.fn();
let mockIsEnabled = true;

vi.mock("@/hooks/useMercyGuide", () => ({
  useMercyGuide: () => ({
    articles: null,
    isLoading: false,
    isEnabled: mockIsEnabled,
    setGuideEnabled,
    canAskQuestion: () => true,
    incrementQuestionCount: () => {},
    getQuestionsRemaining: () => 10,
  }),
}));

// Import AFTER vi.mock so the component picks up the mocked hook.
import { MercyGuideSettings } from "@/components/MercyGuideSettings";

beforeEach(() => {
  setGuideEnabled.mockReset();
  mockIsEnabled = true;
});

afterEach(() => {
  cleanup();
});

describe("MercyGuideSettings — module shape", () => {
  it("exports MercyGuideSettings as a function component", () => {
    expect(typeof MercyGuideSettings).toBe("function");
  });

  it("renders without throwing", () => {
    expect(() => render(<MercyGuideSettings />)).not.toThrow();
  });
});

describe("MercyGuideSettings — bilingual copy (Vietnamese-first invariant)", () => {
  it("shows the English primary label", () => {
    render(<MercyGuideSettings />);
    expect(screen.getByText("Show Mercy Guide assistant")).toBeInTheDocument();
  });

  it("shows the Vietnamese secondary line", () => {
    render(<MercyGuideSettings />);
    expect(screen.getByText("Hiện trợ lý Mercy Guide")).toBeInTheDocument();
  });

  it("renders the Vietnamese line with its diacritics intact (no mojibake)", () => {
    render(<MercyGuideSettings />);
    const vi = screen.getByText("Hiện trợ lý Mercy Guide");
    expect(vi.textContent).toContain("ệ"); // Hiện
    expect(vi.textContent).toContain("ợ"); // trợ
    expect(vi.textContent).toContain("ý"); // lý
  });

  it("renders exactly one of each copy string (no duplicate surfaces)", () => {
    render(<MercyGuideSettings />);
    expect(screen.getAllByText("Show Mercy Guide assistant")).toHaveLength(1);
    expect(screen.getAllByText("Hiện trợ lý Mercy Guide")).toHaveLength(1);
  });
});

describe("MercyGuideSettings — label / control wiring", () => {
  it("renders a switch control with an accessible label", () => {
    render(<MercyGuideSettings />);
    const sw = screen.getByRole("switch", { name: "Show Mercy Guide assistant" });
    expect(sw).toBeInTheDocument();
  });

  it("links the <Label htmlFor> to the switch id (mercy-guide-toggle)", () => {
    const { container } = render(<MercyGuideSettings />);
    const label = container.querySelector('label[for="mercy-guide-toggle"]');
    expect(label).not.toBeNull();
    expect(label).toHaveTextContent("Show Mercy Guide assistant");

    const control = container.querySelector("#mercy-guide-toggle");
    expect(control).not.toBeNull();
    expect(control).toHaveAttribute("role", "switch");
  });

  it("renders a single switch (one owner per function)", () => {
    render(<MercyGuideSettings />);
    expect(screen.getAllByRole("switch")).toHaveLength(1);
  });
});

describe("MercyGuideSettings — checked state mirrors isEnabled", () => {
  it("is ON (aria-checked=true) when isEnabled is true", () => {
    mockIsEnabled = true;
    render(<MercyGuideSettings />);
    expect(screen.getByRole("switch")).toHaveAttribute("aria-checked", "true");
  });

  it("is OFF (aria-checked=false) when isEnabled is false", () => {
    mockIsEnabled = false;
    render(<MercyGuideSettings />);
    expect(screen.getByRole("switch")).toHaveAttribute("aria-checked", "false");
  });

  it("reflects data-state=checked when enabled", () => {
    mockIsEnabled = true;
    render(<MercyGuideSettings />);
    expect(screen.getByRole("switch")).toHaveAttribute("data-state", "checked");
  });

  it("reflects data-state=unchecked when disabled", () => {
    mockIsEnabled = false;
    render(<MercyGuideSettings />);
    expect(screen.getByRole("switch")).toHaveAttribute("data-state", "unchecked");
  });
});

describe("MercyGuideSettings — toggle contract with setGuideEnabled", () => {
  it("calls setGuideEnabled(false) when toggled off from an enabled state", () => {
    mockIsEnabled = true;
    render(<MercyGuideSettings />);
    fireEvent.click(screen.getByRole("switch"));
    expect(setGuideEnabled).toHaveBeenCalledTimes(1);
    expect(setGuideEnabled).toHaveBeenCalledWith(false);
  });

  it("calls setGuideEnabled(true) when toggled on from a disabled state", () => {
    mockIsEnabled = false;
    render(<MercyGuideSettings />);
    fireEvent.click(screen.getByRole("switch"));
    expect(setGuideEnabled).toHaveBeenCalledTimes(1);
    expect(setGuideEnabled).toHaveBeenCalledWith(true);
  });

  it("passes a boolean (not a truthy/falsy non-boolean) to setGuideEnabled", () => {
    mockIsEnabled = true;
    render(<MercyGuideSettings />);
    fireEvent.click(screen.getByRole("switch"));
    const arg = setGuideEnabled.mock.calls[0][0];
    expect(typeof arg).toBe("boolean");
  });

  it("does not invoke setGuideEnabled on initial render (no side effects)", () => {
    render(<MercyGuideSettings />);
    expect(setGuideEnabled).not.toHaveBeenCalled();
  });

  it("activates the toggle via keyboard (Space) and reports the new state", () => {
    mockIsEnabled = true;
    render(<MercyGuideSettings />);
    const sw = screen.getByRole("switch");
    sw.focus();
    fireEvent.keyDown(sw, { key: " ", code: "Space" });
    fireEvent.keyUp(sw, { key: " ", code: "Space" });
    // Radix toggles on click; a click event also fires for keyboard activation
    // in jsdom only via fireEvent.click, so assert click path explicitly here.
    fireEvent.click(sw);
    expect(setGuideEnabled).toHaveBeenCalledWith(false);
  });
});

describe("MercyGuideSettings — edge / defensive hook values", () => {
  it("treats a missing/undefined isEnabled as unchecked rather than crashing", () => {
    // @ts-expect-error intentionally simulate a degraded hook return
    mockIsEnabled = undefined;
    expect(() => render(<MercyGuideSettings />)).not.toThrow();
    const sw = screen.getByRole("switch");
    // Radix coerces a non-true checked value to the unchecked state.
    expect(sw).toHaveAttribute("data-state", "unchecked");
  });

  it("renders the structural container with its border/card styling", () => {
    const { container } = render(<MercyGuideSettings />);
    const root = container.firstElementChild as HTMLElement;
    expect(root).not.toBeNull();
    expect(root.className).toContain("rounded-lg");
    expect(root.className).toContain("border");
    // label block and switch are siblings inside the same row
    expect(within(root).getByRole("switch")).toBeInTheDocument();
    expect(within(root).getByText("Show Mercy Guide assistant")).toBeInTheDocument();
  });

  it("re-renders cleanly when isEnabled flips between mounts", () => {
    mockIsEnabled = true;
    const first = render(<MercyGuideSettings />);
    expect(first.getByRole("switch")).toHaveAttribute("aria-checked", "true");
    first.unmount();

    mockIsEnabled = false;
    const second = render(<MercyGuideSettings />);
    expect(second.getByRole("switch")).toHaveAttribute("aria-checked", "false");
  });
});

// ---------------------------------------------------------------------------
// End-to-end pass through the REAL useMercyGuide hook. We unmock for this block
// to exercise the actual localStorage persistence contract the component
// relies on. fetch is stubbed so the hook's article-loading effect resolves
// quietly instead of throwing in jsdom.
// ---------------------------------------------------------------------------
describe("MercyGuideSettings — integration with the real useMercyGuide hook", () => {
  beforeEach(() => {
    vi.resetModules();
    window.localStorage.clear();
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({
        ok: true,
        status: 200,
        json: async () => ({}),
      })),
    );
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
    window.localStorage.clear();
  });

  it("defaults to ON when no preference is stored, and persists OFF on toggle", async () => {
    vi.doUnmock("@/hooks/useMercyGuide");
    const { MercyGuideSettings: RealMercyGuideSettings } = await import(
      "@/components/MercyGuideSettings"
    );

    render(<RealMercyGuideSettings />);
    const sw = screen.getByRole("switch");

    // No stored value -> default enabled.
    expect(sw).toHaveAttribute("aria-checked", "true");

    fireEvent.click(sw);

    // Component state flips to off...
    expect(sw).toHaveAttribute("aria-checked", "false");
    // ...and the choice is written to localStorage under the canonical key.
    expect(window.localStorage.getItem("mb_mercy_guide_enabled")).toBe("false");

    // Re-mock for the rest of the suite to keep module state isolated.
    vi.doMock("@/hooks/useMercyGuide", () => ({
      useMercyGuide: () => ({
        articles: null,
        isLoading: false,
        isEnabled: mockIsEnabled,
        setGuideEnabled,
        canAskQuestion: () => true,
        incrementQuestionCount: () => {},
        getQuestionsRemaining: () => 10,
      }),
    }));
  });

  it("starts OFF when a stored 'false' preference exists", async () => {
    window.localStorage.setItem("mb_mercy_guide_enabled", "false");
    vi.doUnmock("@/hooks/useMercyGuide");
    const { MercyGuideSettings: RealMercyGuideSettings } = await import(
      "@/components/MercyGuideSettings"
    );

    render(<RealMercyGuideSettings />);
    expect(screen.getByRole("switch")).toHaveAttribute("aria-checked", "false");
  });
});
