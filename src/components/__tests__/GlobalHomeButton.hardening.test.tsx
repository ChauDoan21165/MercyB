import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import { GlobalHomeButton } from "@/components/GlobalHomeButton";

/**
 * Hardening tests for GlobalHomeButton.
 *
 * GlobalHomeButton is a presentational navigation control that:
 *  - reads the current route via react-router's useLocation()
 *  - renders nothing on the homepage ("/") and onboarding ("/onboarding")
 *  - otherwise renders a fixed, top-left "Home" link pointing back to "/"
 *
 * It has no external data dependencies (no supabase / fetch / network), so the
 * deterministic surface to harden is the route-gated render contract plus the
 * structure of the rendered link/button. We drive routing with MemoryRouter so
 * every case is fully deterministic.
 */

// Render the component at a specific path using an in-memory router so that
// useLocation() resolves deterministically without touching window.history.
function renderAt(pathname: string) {
  return render(
    <MemoryRouter initialEntries={[pathname]}>
      <GlobalHomeButton />
    </MemoryRouter>,
  );
}

afterEach(() => {
  cleanup();
});

describe("GlobalHomeButton — module shape", () => {
  it("exports GlobalHomeButton as a function component", () => {
    expect(typeof GlobalHomeButton).toBe("function");
  });
});

describe("GlobalHomeButton — hidden routes (returns null)", () => {
  it("renders nothing on the homepage '/'", () => {
    const { container } = renderAt("/");
    expect(container).toBeEmptyDOMElement();
    expect(screen.queryByRole("link")).toBeNull();
    expect(screen.queryByText("Home")).toBeNull();
  });

  it("renders nothing on '/onboarding'", () => {
    const { container } = renderAt("/onboarding");
    expect(container).toBeEmptyDOMElement();
    expect(screen.queryByRole("link")).toBeNull();
  });
});

describe("GlobalHomeButton — visible routes", () => {
  it("renders a Home link on a generic page", () => {
    renderAt("/dashboard");
    const link = screen.getByRole("link");
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/");
  });

  it("shows the visible 'Home' label text", () => {
    renderAt("/dashboard");
    expect(screen.getByText("Home")).toBeInTheDocument();
  });

  it("renders the link inside the fixed top-left positioned wrapper", () => {
    const { container } = renderAt("/room/abc");
    const wrapper = container.querySelector("div.fixed");
    expect(wrapper).not.toBeNull();
    // Positioning + stacking context that keeps the button globally visible.
    expect(wrapper).toHaveClass("fixed", "top-4", "left-4", "z-50");
    // The link lives inside that wrapper, not as a sibling.
    expect(within(wrapper as HTMLElement).getByRole("link")).toBeInTheDocument();
  });

  it("renders an icon (svg) alongside the label", () => {
    const { container } = renderAt("/dashboard");
    const link = screen.getByRole("link");
    const svg = link.querySelector("svg");
    expect(svg).not.toBeNull();
  });

  it("always points the link to the root path regardless of current route", () => {
    renderAt("/some/deeply/nested/path?with=query#and-hash");
    expect(screen.getByRole("link")).toHaveAttribute("href", "/");
  });
});

describe("GlobalHomeButton — edge cases for path matching", () => {
  it("renders the button on the trailing-slash homepage variant '/' + extra segment", () => {
    // "/home" is NOT the special-cased "/" — button should render.
    renderAt("/home");
    expect(screen.getByRole("link")).toHaveAttribute("href", "/");
  });

  it("renders on a path that merely starts with '/onboarding' but isn't exactly it", () => {
    // Gate is an exact pathname match; "/onboarding/step-2" is not excluded.
    renderAt("/onboarding/step-2");
    expect(screen.getByRole("link")).toBeInTheDocument();
  });

  it("renders on the case-variant '/Onboarding' (matching is case-sensitive)", () => {
    renderAt("/Onboarding");
    expect(screen.getByRole("link")).toBeInTheDocument();
  });

  it("renders on '/onboarding/' with a trailing slash (not an exact match)", () => {
    renderAt("/onboarding/");
    expect(screen.getByRole("link")).toBeInTheDocument();
  });

  it("hides only on the exact '/onboarding' pathname even when a query string is present", () => {
    // MemoryRouter parses the query out of pathname, so this is still the
    // excluded route and should render nothing.
    const { container } = renderAt("/onboarding?ref=email");
    expect(container).toBeEmptyDOMElement();
  });
});

describe("GlobalHomeButton — determinism / idempotency", () => {
  it("produces identical markup across repeated renders at the same route", () => {
    const first = renderAt("/dashboard");
    const firstHtml = first.container.innerHTML;
    cleanup();
    const second = renderAt("/dashboard");
    expect(second.container.innerHTML).toBe(firstHtml);
  });

  it("re-evaluates visibility when remounted at a different route", () => {
    const visible = renderAt("/dashboard");
    expect(visible.container).not.toBeEmptyDOMElement();
    cleanup();
    const hidden = renderAt("/");
    expect(hidden.container).toBeEmptyDOMElement();
  });
});
