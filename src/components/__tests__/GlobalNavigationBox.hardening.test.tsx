// PATH: src/components/__tests__/GlobalNavigationBox.hardening.test.tsx
//
// Hardening tests for <GlobalNavigationBox />.
//
// The component is a tiny, side-effect-free presentational widget whose only
// dependencies are react-router-dom (useNavigate / useLocation / Link) and the
// shadcn Button. There is no Supabase / fetch / network surface to mock — its
// behavior is fully determined by the current route, so every assertion below
// is deterministic.
//
// Contract under test (src/components/GlobalNavigationBox.tsx):
//   1. Renders nothing on "/" and "/onboarding".
//   2. On any other path renders a Home link pointing at "/".
//   3. Renders a Back button on non-root paths and invokes navigate(-1) on click.
//   4. Suppresses the Back button on the "/admin" root path (Home still shown).

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";

// Spy on useNavigate while keeping the real Link + useLocation (driven by
// MemoryRouter). This lets us observe the imperative navigate(-1) call without
// needing a second route to render into.
const navigateSpy = vi.fn();

vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router-dom")>();
  return {
    ...actual,
    useNavigate: () => navigateSpy,
  };
});

import { GlobalNavigationBox } from "@/components/GlobalNavigationBox";

function renderAt(pathname: string) {
  return render(
    <MemoryRouter initialEntries={[pathname]}>
      <GlobalNavigationBox />
    </MemoryRouter>,
  );
}

beforeEach(() => {
  navigateSpy.mockReset();
  cleanup();
});

describe("GlobalNavigationBox — export shape", () => {
  it("exports GlobalNavigationBox as a function component", () => {
    expect(typeof GlobalNavigationBox).toBe("function");
    expect(GlobalNavigationBox.name).toBe("GlobalNavigationBox");
  });
});

describe("GlobalNavigationBox — hidden routes", () => {
  it('renders nothing on the homepage "/"', () => {
    const { container } = renderAt("/");
    expect(container).toBeEmptyDOMElement();
    expect(screen.queryByText("Home")).not.toBeInTheDocument();
    expect(screen.queryByText("Back")).not.toBeInTheDocument();
  });

  it('renders nothing on "/onboarding"', () => {
    const { container } = renderAt("/onboarding");
    expect(container).toBeEmptyDOMElement();
  });

  it("does NOT treat trailing-slash variants as hidden (exact match only)", () => {
    // "/onboarding/" is not strictly equal to "/onboarding", so the box shows.
    renderAt("/onboarding/");
    expect(screen.getByText("Home")).toBeInTheDocument();
  });

  it("does NOT treat case variants of the homepage as hidden", () => {
    // Path matching is case-sensitive string equality; "/HOME" is a real page.
    renderAt("/HOME");
    expect(screen.getByText("Home")).toBeInTheDocument();
  });

  it("does NOT hide on a homepage path carrying a query string", () => {
    // location.pathname excludes the query, but MemoryRouter parses "?x=1" out
    // of the entry, so "/?x=1" still resolves pathname === "/" and stays hidden.
    const { container } = renderAt("/?ref=abc");
    expect(container).toBeEmptyDOMElement();
  });
});

describe("GlobalNavigationBox — Home control", () => {
  it("renders a Home link pointing at the root on a normal page", () => {
    renderAt("/room/english_basics");
    const homeLink = screen.getByRole("link", { name: /home/i });
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute("href", "/");
  });

  it("renders the Home control as an anchor (asChild Link), not a button", () => {
    renderAt("/dashboard");
    const home = screen.getByText("Home").closest("a");
    expect(home).not.toBeNull();
    expect(home?.tagName).toBe("A");
  });
});

describe("GlobalNavigationBox — Back control", () => {
  it("renders a Back button on a non-root path", () => {
    renderAt("/lesson/3");
    expect(screen.getByRole("button", { name: /back/i })).toBeInTheDocument();
  });

  it("invokes navigate(-1) exactly once when Back is clicked", async () => {
    const user = userEvent.setup();
    renderAt("/lesson/3");

    await user.click(screen.getByRole("button", { name: /back/i }));

    expect(navigateSpy).toHaveBeenCalledTimes(1);
    expect(navigateSpy).toHaveBeenCalledWith(-1);
  });

  it("does not navigate before any interaction (no render-time side effects)", () => {
    renderAt("/lesson/3");
    expect(navigateSpy).not.toHaveBeenCalled();
  });

  it("uses a real <button type=button> so it cannot submit a surrounding form", () => {
    renderAt("/lesson/3");
    const back = screen.getByRole("button", { name: /back/i });
    expect(back.tagName).toBe("BUTTON");
    expect(back).toHaveAttribute("type", "button");
  });
});

describe("GlobalNavigationBox — root-path Back suppression", () => {
  it('hides Back on the "/admin" root path but keeps Home', () => {
    renderAt("/admin");
    expect(screen.getByRole("link", { name: /home/i })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /back/i })).not.toBeInTheDocument();
  });

  it('shows Back on nested admin paths like "/admin/users"', () => {
    // Only the exact "/admin" string is a root path; deeper routes get Back.
    renderAt("/admin/users");
    expect(screen.getByRole("button", { name: /back/i })).toBeInTheDocument();
  });
});

describe("GlobalNavigationBox — structure & stability", () => {
  it("renders a single fixed-position container box", () => {
    const { container } = renderAt("/profile");
    const root = container.firstElementChild as HTMLElement | null;
    expect(root).not.toBeNull();
    expect(root?.className).toContain("fixed");
    expect(root?.className).toContain("z-50");
  });

  it("renders both controls on a deep arbitrary path", () => {
    renderAt("/some/deeply/nested/route");
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Back")).toBeInTheDocument();
  });

  it("is idempotent across re-renders at the same location", () => {
    const { rerender } = render(
      <MemoryRouter initialEntries={["/settings"]}>
        <GlobalNavigationBox />
      </MemoryRouter>,
    );
    expect(screen.getByText("Home")).toBeInTheDocument();

    rerender(
      <MemoryRouter initialEntries={["/settings"]}>
        <GlobalNavigationBox />
      </MemoryRouter>,
    );
    // Still exactly one Home control after re-render.
    expect(screen.getAllByText("Home")).toHaveLength(1);
  });
});
