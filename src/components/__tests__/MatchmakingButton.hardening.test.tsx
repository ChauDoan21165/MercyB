// Hardening tests for <MatchmakingButton>.
//
// MatchmakingButton is a tiny premium-gated navigation control. Its entire
// behavioral contract is:
//   1. While access is still loading -> render nothing.
//   2. When the user is NOT premium -> render nothing.
//   3. When access has loaded AND the user is premium -> render a bilingual
//      (EN "AI Matchmaking" / VI "Ghép Đôi AI") button that navigates to
//      "/matchmaking" on click.
//
// The component reads only two fields off useUserAccess: `loading` and
// `hasPremium`. We drive every gating combination by mocking that hook, and
// mock react-router's useNavigate so the click handler is observable without
// a router. Everything here is hermetic — no Supabase, no network, no timers.

import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// --- Mocks -----------------------------------------------------------------

// react-router-dom: only useNavigate is consumed. Keep the rest of the module
// intact in case transitive imports need it.
const navigate = vi.fn();
vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router-dom")>();
  return {
    ...actual,
    useNavigate: () => navigate,
  };
});

// useUserAccess is the gate. We return a minimal shape with just the two
// fields the component reads. setAccess() is the per-test driver.
const useUserAccess = vi.fn();
vi.mock("@/hooks/useUserAccess", () => ({
  useUserAccess: () => useUserAccess(),
  // default export exists in the real module; mirror it defensively.
  default: () => useUserAccess(),
}));

import { MatchmakingButton } from "@/components/MatchmakingButton";

// --- Helpers ---------------------------------------------------------------

type AccessShape = { loading?: boolean; hasPremium?: boolean };

/** Stub the access hook with just the fields MatchmakingButton reads. */
function setAccess(access: AccessShape) {
  useUserAccess.mockReturnValue({
    loading: false,
    hasPremium: false,
    ...access,
  });
}

const EN_LABEL = "AI Matchmaking";
const VI_LABEL = "Ghép Đôi AI";

// --- Lifecycle -------------------------------------------------------------

beforeEach(() => {
  navigate.mockReset();
  useUserAccess.mockReset();
});

afterEach(() => {
  cleanup();
});

// --- Gating: loading -------------------------------------------------------

describe("MatchmakingButton — loading gate", () => {
  it("renders nothing while access is loading (premium unknown)", () => {
    setAccess({ loading: true, hasPremium: false });
    const { container } = render(<MatchmakingButton />);
    expect(container).toBeEmptyDOMElement();
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("renders nothing while loading even if hasPremium is already true", () => {
    // loading short-circuits BEFORE the hasPremium check, so a premium user
    // mid-load must still see nothing. This guards the ordering of the two
    // early returns.
    setAccess({ loading: true, hasPremium: true });
    const { container } = render(<MatchmakingButton />);
    expect(container).toBeEmptyDOMElement();
    expect(screen.queryByText(EN_LABEL)).toBeNull();
  });
});

// --- Gating: not premium ---------------------------------------------------

describe("MatchmakingButton — premium gate", () => {
  it("renders nothing for a settled non-premium user", () => {
    setAccess({ loading: false, hasPremium: false });
    const { container } = render(<MatchmakingButton />);
    expect(container).toBeEmptyDOMElement();
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("does not call navigate when no button is rendered", () => {
    setAccess({ loading: false, hasPremium: false });
    render(<MatchmakingButton />);
    expect(navigate).not.toHaveBeenCalled();
  });
});

// --- Happy path: premium, loaded -------------------------------------------

describe("MatchmakingButton — premium user", () => {
  beforeEach(() => {
    setAccess({ loading: false, hasPremium: true });
  });

  it("renders a single button", () => {
    render(<MatchmakingButton />);
    expect(screen.getByRole("button")).toBeTruthy();
  });

  it("shows both the English and Vietnamese labels (Vietnamese-first parity)", () => {
    render(<MatchmakingButton />);
    expect(screen.getByText(EN_LABEL)).toBeTruthy();
    expect(screen.getByText(VI_LABEL)).toBeTruthy();
  });

  it("navigates to /matchmaking exactly once on click", () => {
    render(<MatchmakingButton />);
    fireEvent.click(screen.getByRole("button"));
    expect(navigate).toHaveBeenCalledTimes(1);
    expect(navigate).toHaveBeenCalledWith("/matchmaking");
  });

  it("does not navigate before the button is clicked", () => {
    render(<MatchmakingButton />);
    expect(navigate).not.toHaveBeenCalled();
  });

  it("navigates again on a second click (handler is not single-use)", () => {
    render(<MatchmakingButton />);
    const btn = screen.getByRole("button");
    fireEvent.click(btn);
    fireEvent.click(btn);
    expect(navigate).toHaveBeenCalledTimes(2);
    expect(navigate).toHaveBeenNthCalledWith(1, "/matchmaking");
    expect(navigate).toHaveBeenNthCalledWith(2, "/matchmaking");
  });

  it("carries the heart-gradient styling on the rendered button", () => {
    render(<MatchmakingButton />);
    const btn = screen.getByRole("button");
    // The component hardcodes a pink->rose gradient; assert the class is wired
    // through Button's className passthrough so a styling regression is caught.
    expect(btn.className).toContain("from-pink-500");
    expect(btn.className).toContain("to-rose-500");
  });
});

// --- Reactivity / state transitions ----------------------------------------

describe("MatchmakingButton — access transitions", () => {
  it("appears when access flips from loading to loaded-premium on rerender", () => {
    setAccess({ loading: true, hasPremium: true });
    const { rerender, container } = render(<MatchmakingButton />);
    expect(container).toBeEmptyDOMElement();

    setAccess({ loading: false, hasPremium: true });
    rerender(<MatchmakingButton />);
    expect(screen.getByRole("button")).toBeTruthy();
  });

  it("disappears when premium is revoked on rerender", () => {
    setAccess({ loading: false, hasPremium: true });
    const { rerender, container } = render(<MatchmakingButton />);
    expect(screen.getByRole("button")).toBeTruthy();

    setAccess({ loading: false, hasPremium: false });
    rerender(<MatchmakingButton />);
    expect(container).toBeEmptyDOMElement();
  });
});

// --- Defensive / edge access shapes ----------------------------------------

describe("MatchmakingButton — defensive access shapes", () => {
  it("treats a falsy hasPremium (undefined) as non-premium", () => {
    // Access object exists but hasPremium is missing — the `!access.hasPremium`
    // guard must coerce undefined to non-premium and render nothing.
    useUserAccess.mockReturnValue({ loading: false });
    const { container } = render(<MatchmakingButton />);
    expect(container).toBeEmptyDOMElement();
  });

  it("treats a falsy loading (undefined) as not-loading and still gates on premium", () => {
    useUserAccess.mockReturnValue({ hasPremium: false });
    const { container } = render(<MatchmakingButton />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders when loading is undefined but hasPremium is true", () => {
    useUserAccess.mockReturnValue({ hasPremium: true });
    render(<MatchmakingButton />);
    expect(screen.getByRole("button")).toBeTruthy();
  });
});
