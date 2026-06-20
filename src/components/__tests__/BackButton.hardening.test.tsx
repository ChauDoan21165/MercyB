// PATH: src/components/__tests__/BackButton.hardening.test.tsx
//
// Hardening tests for src/components/BackButton.tsx
//
// BackButton is a tiny, central navigation primitive: it hides itself on
// "root" pages (where there is no meaningful back destination) and otherwise
// renders a ghost button that calls `navigate(-1)`. The surface area is small
// but it sits on the core navigation path, so the behavior worth pinning is:
//   1. Visibility rules per pathname (the ROOT_PATHS allowlist).
//   2. Click delegates to react-router's `navigate(-1)` exactly once per click.
//   3. Accessibility / markup invariants (type="button", label, icon).
//
// react-router-dom is mocked so that:
//   * useLocation() returns a pathname we control per-test (drives visibility).
//   * useNavigate() returns a spy we can assert on (no real history needed).
// This keeps every test deterministic and free of real navigation/history.

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";

// ---------------------------------------------------------------------------
// Mock react-router-dom: control location, spy on navigation.
// ---------------------------------------------------------------------------
const navigateSpy = vi.fn();
let currentPathname = "/some/page";

vi.mock("react-router-dom", () => ({
  useNavigate: () => navigateSpy,
  useLocation: () => ({
    pathname: currentPathname,
    search: "",
    hash: "",
    state: null,
    key: "test",
  }),
}));

// Imported AFTER the mock is declared (vi.mock is hoisted, so this is safe).
import { BackButton } from "@/components/BackButton";

function setPath(pathname: string) {
  currentPathname = pathname;
}

beforeEach(() => {
  navigateSpy.mockReset();
  currentPathname = "/some/page";
  cleanup();
});

// ---------------------------------------------------------------------------
// Module shape
// ---------------------------------------------------------------------------
describe("BackButton — module exports", () => {
  it("exports BackButton as a function component", () => {
    expect(typeof BackButton).toBe("function");
  });

  it("is named BackButton", () => {
    expect(BackButton.name).toBe("BackButton");
  });
});

// ---------------------------------------------------------------------------
// Visibility: ROOT_PATHS allowlist (returns null)
// ---------------------------------------------------------------------------
describe("BackButton — hidden on root paths", () => {
  it('renders nothing on "/"', () => {
    setPath("/");
    const { container } = render(<BackButton />);
    expect(container).toBeEmptyDOMElement();
    expect(screen.queryByRole("button")).toBeNull();
  });

  it('renders nothing on "/admin"', () => {
    setPath("/admin");
    const { container } = render(<BackButton />);
    expect(container).toBeEmptyDOMElement();
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("does not call navigate when hidden (nothing to click)", () => {
    setPath("/");
    render(<BackButton />);
    expect(navigateSpy).not.toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// Visibility: non-root paths render the button
// ---------------------------------------------------------------------------
describe("BackButton — visible on non-root paths", () => {
  const visiblePaths = [
    "/room/abc",
    "/pricing",
    "/account",
    "/admin/users", // nested under /admin but NOT exactly "/admin"
    "/admin/", // trailing slash is a distinct string, not in allowlist
    "/Admin", // case-sensitive: not the lowercase allowlisted entry
    "/lessons/vietnamese/1",
  ];

  for (const path of visiblePaths) {
    it(`renders the button on "${path}"`, () => {
      setPath(path);
      render(<BackButton />);
      expect(screen.getByRole("button")).toBeInTheDocument();
    });
  }

  it("exact-match only: '/admin' hides but '/admin/x' shows", () => {
    setPath("/admin");
    const hidden = render(<BackButton />);
    expect(hidden.container).toBeEmptyDOMElement();
    cleanup();

    setPath("/admin/x");
    render(<BackButton />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Markup / accessibility invariants
// ---------------------------------------------------------------------------
describe("BackButton — markup and accessibility", () => {
  beforeEach(() => setPath("/room/abc"));

  it('uses type="button" (never submits a surrounding form)', () => {
    render(<BackButton />);
    expect(screen.getByRole("button")).toHaveAttribute("type", "button");
  });

  it('renders the visible "Back" label', () => {
    render(<BackButton />);
    expect(screen.getByRole("button")).toHaveTextContent("Back");
    expect(screen.getByText("Back")).toBeInTheDocument();
  });

  it("renders an svg icon (ArrowLeft) inside the button", () => {
    const { container } = render(<BackButton />);
    expect(container.querySelector("svg")).not.toBeNull();
  });

  it("applies the hover accent class", () => {
    render(<BackButton />);
    expect(screen.getByRole("button").className).toContain("hover:bg-accent");
  });

  it("is reachable by accessible name 'Back'", () => {
    render(<BackButton />);
    expect(screen.getByRole("button", { name: /back/i })).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Click behavior: delegates to navigate(-1)
// ---------------------------------------------------------------------------
describe("BackButton — click navigates back", () => {
  beforeEach(() => setPath("/room/abc"));

  it("calls navigate(-1) once per click", () => {
    render(<BackButton />);
    fireEvent.click(screen.getByRole("button"));
    expect(navigateSpy).toHaveBeenCalledTimes(1);
    expect(navigateSpy).toHaveBeenCalledWith(-1);
  });

  it("calls navigate(-1) again on each subsequent click", () => {
    render(<BackButton />);
    const btn = screen.getByRole("button");
    fireEvent.click(btn);
    fireEvent.click(btn);
    fireEvent.click(btn);
    expect(navigateSpy).toHaveBeenCalledTimes(3);
    expect(navigateSpy).toHaveBeenNthCalledWith(1, -1);
    expect(navigateSpy).toHaveBeenNthCalledWith(2, -1);
    expect(navigateSpy).toHaveBeenNthCalledWith(3, -1);
  });

  it("does not navigate on mere render (no implicit navigation)", () => {
    render(<BackButton />);
    expect(navigateSpy).not.toHaveBeenCalled();
  });

  it("only ever passes the numeric delta -1 (never a path)", () => {
    render(<BackButton />);
    fireEvent.click(screen.getByRole("button"));
    const [arg] = navigateSpy.mock.calls[0];
    expect(typeof arg).toBe("number");
    expect(arg).toBe(-1);
  });
});

// ---------------------------------------------------------------------------
// Re-render / stability across pathname changes
// ---------------------------------------------------------------------------
describe("BackButton — visibility tracks pathname on re-render", () => {
  it("hides after navigating to a root path", () => {
    setPath("/room/abc");
    const { rerender, container } = render(<BackButton />);
    expect(screen.getByRole("button")).toBeInTheDocument();

    setPath("/");
    rerender(<BackButton />);
    expect(container).toBeEmptyDOMElement();
  });

  it("shows after navigating away from a root path", () => {
    setPath("/");
    const { rerender, container } = render(<BackButton />);
    expect(container).toBeEmptyDOMElement();

    setPath("/pricing");
    rerender(<BackButton />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });
});
