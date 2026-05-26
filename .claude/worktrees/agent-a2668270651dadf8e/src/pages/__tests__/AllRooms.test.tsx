// src/pages/__tests__/AllRooms.test.tsx
//
// Regression test for MERCYBLADE-WEB-4.
//
// AllRooms is a legacy /rooms redirect stub. The previous
// implementation used react-router's useNavigate() inside a useEffect
// to push /tiers, which produced a back-to-back client-side navigation
// 0–50 ms after the first one landed. On a fast Chrome render the
// /tiers route could mount before NavigationContext finished settling
// from the in-flight first transition, leaving the destructure of
// `basename` in any <Link> on /tiers reading null.
//
// The fix swaps useNavigate for window.location.replace ("hard" reload
// to /tiers). The component now has zero coupling to react-router and
// MUST render without a <BrowserRouter> wrapper above it. These tests
// pin both invariants.

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render } from "@testing-library/react";

import AllRooms from "@/pages/AllRooms";

describe("AllRooms — /rooms redirect stub", () => {
  // Save real location so jsdom is restored between cases.
  const realLocation = window.location;

  beforeEach(() => {
    // Replace window.location with a spy-able stand-in. jsdom marks
    // window.location read-only, so we delete and reassign.
    Object.defineProperty(window, "location", {
      configurable: true,
      writable: true,
      value: { replace: vi.fn(), assign: vi.fn(), href: "" },
    });
  });

  afterEach(() => {
    Object.defineProperty(window, "location", {
      configurable: true,
      writable: true,
      value: realLocation,
    });
  });

  it("calls window.location.replace('/tiers') on mount", () => {
    render(<AllRooms />);
    expect(window.location.replace).toHaveBeenCalledWith("/tiers");
    expect(window.location.replace).toHaveBeenCalledTimes(1);
  });

  it("never calls window.location.assign (we want .replace so /rooms stays out of the back-stack)", () => {
    render(<AllRooms />);
    expect(window.location.assign).not.toHaveBeenCalled();
  });

  it("renders successfully WITHOUT a <BrowserRouter> wrapper — proves the component has no router-context dependency (the WEB-4 invariant)", () => {
    // No MemoryRouter / BrowserRouter in scope. If AllRooms still
    // touched useNavigate or any other router hook this render call
    // would throw with "useNavigate() may be used only in the context
    // of a <Router> component" — exactly the regression we're guarding
    // against.
    expect(() => render(<AllRooms />)).not.toThrow();
  });

  it("renders null (no UI to flash before the redirect)", () => {
    const { container } = render(<AllRooms />);
    expect(container).toBeEmptyDOMElement();
  });
});
