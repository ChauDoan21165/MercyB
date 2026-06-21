import { describe, it, expect, afterEach, vi } from "vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import { HomeButton } from "@/components/HomeButton";

/**
 * Hardening tests for HomeButton.
 *
 * HomeButton is a small presentational component: it renders a ghost
 * Button that delegates (via `asChild`) to a react-router <Link> pointing
 * at "/". It has no external dependencies (no supabase/fetch/auth), so the
 * only environmental requirement is a Router context — without it
 * react-router's <Link> throws. These tests therefore lock down:
 *   - the public export shape,
 *   - rendering inside a Router (the happy path),
 *   - rendering WITHOUT a Router (the documented error path),
 *   - the link target / label / icon invariants,
 *   - determinism across repeated and multiple renders.
 */

// react-router's <Link> requires an ancestor Router. Centralize the wrapper
// so every test renders the component the way the app actually mounts it.
function renderInRouter(initialPath = "/somewhere") {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <HomeButton />
    </MemoryRouter>,
  );
}

afterEach(() => {
  cleanup();
});

describe("HomeButton — module exports", () => {
  it("exports HomeButton as a function component", () => {
    expect(typeof HomeButton).toBe("function");
  });

  it("accepts no required props (zero-arity callable)", () => {
    // The component is invoked by React with a props object; it declares no
    // parameters, so its `length` is 0. This guards against accidentally
    // adding required props in a refactor.
    expect(HomeButton.length).toBe(0);
  });
});

describe("HomeButton — rendering inside a Router (happy path)", () => {
  it("renders a single link", () => {
    renderInRouter();
    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(1);
  });

  it("renders the link pointing at the site root '/'", () => {
    renderInRouter();
    const link = screen.getByRole("link");
    // jsdom resolves the relative href against the document origin.
    expect(link).toHaveAttribute("href", "/");
  });

  it("renders an accessible 'Home' label", () => {
    renderInRouter();
    // The visible text is "Home"; accessible name derives from it.
    const link = screen.getByRole("link", { name: /home/i });
    expect(link).toBeTruthy();
    expect(link.textContent).toContain("Home");
  });

  it("renders the label text inside its own <span> with font-medium", () => {
    renderInRouter();
    const link = screen.getByRole("link");
    const span = within(link).getByText("Home");
    expect(span.tagName).toBe("SPAN");
    expect(span).toHaveClass("font-medium");
  });

  it("renders an icon (lucide Home svg) ahead of the label", () => {
    const { container } = renderInRouter();
    const svg = container.querySelector("svg");
    expect(svg).not.toBeNull();
    // Icon sizing/spacing classes from the component.
    expect(svg).toHaveClass("h-4");
    expect(svg).toHaveClass("w-4");
    expect(svg).toHaveClass("mr-2");
  });

  it("applies the ghost-variant hover class on the rendered element", () => {
    renderInRouter();
    const link = screen.getByRole("link");
    expect(link.className).toContain("hover:bg-accent");
  });

  it("renders an <a> element (asChild delegates to Link, not a <button>)", () => {
    renderInRouter();
    const link = screen.getByRole("link");
    expect(link.tagName).toBe("A");
    // Because of `asChild`, no native <button> should be emitted.
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("href stays '/' regardless of the current location", () => {
    renderInRouter("/deep/nested/route?with=query#hash");
    expect(screen.getByRole("link")).toHaveAttribute("href", "/");
  });
});

describe("HomeButton — error handling (missing Router context)", () => {
  it("throws when rendered without a Router ancestor", () => {
    // react-router's <Link> reads RouterContext; outside a Router it throws.
    // We suppress the noisy React error boundary log for this expected throw.
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    try {
      expect(() => render(<HomeButton />)).toThrow();
    } finally {
      spy.mockRestore();
    }
  });
});

describe("HomeButton — determinism", () => {
  it("produces identical markup across repeated isolated renders", () => {
    const { container: first } = renderInRouter();
    const firstHtml = first.innerHTML;
    cleanup();
    const { container: second } = renderInRouter();
    expect(second.innerHTML).toBe(firstHtml);
  });

  it("renders independently when two instances are mounted together", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <HomeButton />
        <HomeButton />
      </MemoryRouter>,
    );
    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(2);
    for (const link of links) {
      expect(link).toHaveAttribute("href", "/");
      expect(link.textContent).toContain("Home");
    }
  });
});
