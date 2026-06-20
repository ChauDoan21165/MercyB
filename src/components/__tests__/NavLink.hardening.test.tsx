// src/components/__tests__/NavLink.hardening.test.tsx
//
// Hardening test surface for the <NavLink> wrapper (src/components/NavLink.tsx).
//
// NavLink is a thin shim over react-router-dom's <Link> that adds
// active-state class merging based on the current location:
//
//   - `end={true}`  → active iff location.pathname === toPath (exact)
//   - `end={false}` → active iff location.pathname.startsWith(toPath) (prefix)
//   - `to` may be a string or a { pathname } object (falls back to "").
//   - active class merges into className via cn() (clsx + tailwind-merge).
//
// These tests pin every branch of that logic plus prop passthrough so a
// future refactor of the matching rule is caught as a regression. They are
// fully deterministic: location is supplied via MemoryRouter initialEntries,
// no timers, network, or randomness involved.

import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { NavLink } from "@/components/NavLink";

// Render NavLink inside a router seeded at `path` so useLocation() is
// deterministic. Returns the rendered anchor element.
function renderAt(path: string, ui: React.ReactNode) {
  const result = render(
    <MemoryRouter initialEntries={[path]}>{ui}</MemoryRouter>,
  );
  return result;
}

describe("NavLink — rendering & passthrough", () => {
  it("renders an anchor with its children", () => {
    renderAt("/", <NavLink to="/home">Home</NavLink>);
    const link = screen.getByRole("link", { name: "Home" });
    expect(link).toBeTruthy();
    expect(link.tagName).toBe("A");
    expect(link.textContent).toBe("Home");
  });

  it("renders the resolved href from a string `to`", () => {
    renderAt("/", <NavLink to="/dashboard">Dash</NavLink>);
    const link = screen.getByRole("link", { name: "Dash" });
    expect(link.getAttribute("href")).toBe("/dashboard");
  });

  it("renders the resolved href from an object `to` with pathname", () => {
    renderAt(
      "/",
      <NavLink to={{ pathname: "/profile", search: "?tab=1" }}>P</NavLink>,
    );
    const link = screen.getByRole("link", { name: "P" });
    expect(link.getAttribute("href")).toBe("/profile?tab=1");
  });

  it("forwards arbitrary DOM props (id, data-*, aria-*, title)", () => {
    renderAt(
      "/",
      <NavLink
        to="/x"
        id="nav-x"
        data-testid="nav-x"
        aria-label="go-x"
        title="tip"
      >
        X
      </NavLink>,
    );
    const link = screen.getByTestId("nav-x");
    expect(link.id).toBe("nav-x");
    expect(link.getAttribute("aria-label")).toBe("go-x");
    expect(link.getAttribute("title")).toBe("tip");
  });

  it("forwards an onClick handler", async () => {
    const onClick = vi.fn((e: React.MouseEvent) => e.preventDefault());
    const user = userEvent.setup();
    renderAt(
      "/",
      <NavLink to="/x" onClick={onClick}>
        Click
      </NavLink>,
    );
    await user.click(screen.getByRole("link", { name: "Click" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("renders complex/nested children", () => {
    renderAt(
      "/",
      <NavLink to="/x">
        <span data-testid="inner">Inner</span>
      </NavLink>,
    );
    expect(screen.getByTestId("inner").textContent).toBe("Inner");
  });
});

describe("NavLink — active matching with end=false (prefix, default)", () => {
  it("applies activeClassName when pathname starts with toPath", () => {
    renderAt(
      "/settings/profile",
      <NavLink to="/settings">S</NavLink>,
    );
    const link = screen.getByRole("link", { name: "S" });
    expect(link.className).toContain("bg-accent");
    expect(link.className).toContain("text-accent-foreground");
  });

  it("applies activeClassName on an exact prefix match too", () => {
    renderAt("/settings", <NavLink to="/settings">S</NavLink>);
    expect(screen.getByRole("link", { name: "S" }).className).toContain(
      "bg-accent",
    );
  });

  it("does NOT apply activeClassName when pathname does not start with toPath", () => {
    renderAt("/dashboard", <NavLink to="/settings">S</NavLink>);
    const link = screen.getByRole("link", { name: "S" });
    expect(link.className).not.toContain("bg-accent");
  });

  it("treats empty toPath as always-active (every path startsWith \"\")", () => {
    renderAt(
      "/anything/here",
      <NavLink to={{ search: "?q=1" }}>Empty</NavLink>,
    );
    // object `to` without pathname → toPath = "" → startsWith("") === true
    expect(screen.getByRole("link", { name: "Empty" }).className).toContain(
      "bg-accent",
    );
  });

  it("is a known false-positive: /settings matches /settings-extra prefix", () => {
    // Documents the prefix-matching behavior: startsWith is character-based,
    // not segment-based, so a sibling route sharing a prefix lights up.
    renderAt(
      "/settings-extra",
      <NavLink to="/settings">S</NavLink>,
    );
    expect(screen.getByRole("link", { name: "S" }).className).toContain(
      "bg-accent",
    );
  });
});

describe("NavLink — active matching with end=true (exact)", () => {
  it("applies activeClassName only on an exact pathname match", () => {
    renderAt(
      "/settings",
      <NavLink to="/settings" end>
        S
      </NavLink>,
    );
    expect(screen.getByRole("link", { name: "S" }).className).toContain(
      "bg-accent",
    );
  });

  it("does NOT apply activeClassName for a child path when end=true", () => {
    renderAt(
      "/settings/profile",
      <NavLink to="/settings" end>
        S
      </NavLink>,
    );
    expect(
      screen.getByRole("link", { name: "S" }).className,
    ).not.toContain("bg-accent");
  });

  it("does NOT apply activeClassName for the prefix-sibling false-positive", () => {
    renderAt(
      "/settings-extra",
      <NavLink to="/settings" end>
        S
      </NavLink>,
    );
    expect(
      screen.getByRole("link", { name: "S" }).className,
    ).not.toContain("bg-accent");
  });
});

describe("NavLink — className handling", () => {
  it("always includes the base className regardless of active state", () => {
    renderAt(
      "/elsewhere",
      <NavLink to="/settings" className="base-class">
        S
      </NavLink>,
    );
    expect(screen.getByRole("link", { name: "S" }).className).toContain(
      "base-class",
    );
  });

  it("merges base className with activeClassName when active", () => {
    renderAt(
      "/settings",
      <NavLink to="/settings" className="base-class" end>
        S
      </NavLink>,
    );
    const cls = screen.getByRole("link", { name: "S" }).className;
    expect(cls).toContain("base-class");
    expect(cls).toContain("bg-accent");
  });

  it("honors a custom activeClassName instead of the default", () => {
    renderAt(
      "/settings",
      <NavLink to="/settings" activeClassName="my-active" end>
        S
      </NavLink>,
    );
    const cls = screen.getByRole("link", { name: "S" }).className;
    expect(cls).toContain("my-active");
    expect(cls).not.toContain("bg-accent");
  });

  it("does not add the custom activeClassName when inactive", () => {
    renderAt(
      "/elsewhere",
      <NavLink to="/settings" activeClassName="my-active" end>
        S
      </NavLink>,
    );
    expect(
      screen.getByRole("link", { name: "S" }).className,
    ).not.toContain("my-active");
  });

  it("renders without crashing when no className is supplied and inactive", () => {
    renderAt("/elsewhere", <NavLink to="/settings">S</NavLink>);
    const link = screen.getByRole("link", { name: "S" });
    // cn(undefined, false) collapses to empty string
    expect(link.className).toBe("");
  });

  it("collapses tailwind-conflicting classes via cn() (last wins)", () => {
    // activeClassName 'bg-accent' should override an earlier bg- utility
    // because cn() runs tailwind-merge.
    renderAt(
      "/settings",
      <NavLink to="/settings" className="bg-red-500" end>
        S
      </NavLink>,
    );
    const cls = screen.getByRole("link", { name: "S" });
    expect(cls.className).toContain("bg-accent");
    expect(cls.className).not.toContain("bg-red-500");
  });
});

describe("NavLink — root path edge cases", () => {
  it("root '/' is always active under prefix matching (startsWith '/')", () => {
    renderAt("/any/deep/path", <NavLink to="/">Root</NavLink>);
    expect(screen.getByRole("link", { name: "Root" }).className).toContain(
      "bg-accent",
    );
  });

  it("root '/' with end=true is active only at exactly '/'", () => {
    renderAt(
      "/dashboard",
      <NavLink to="/" end>
        Root
      </NavLink>,
    );
    expect(
      screen.getByRole("link", { name: "Root" }).className,
    ).not.toContain("bg-accent");
  });

  it("root '/' with end=true is active at '/'", () => {
    renderAt(
      "/",
      <NavLink to="/" end>
        Root
      </NavLink>,
    );
    expect(screen.getByRole("link", { name: "Root" }).className).toContain(
      "bg-accent",
    );
  });
});

describe("NavLink — multiple instances share one location", () => {
  it("activates only the links whose toPath matches the current location", () => {
    renderAt(
      "/settings/profile",
      <nav>
        <NavLink to="/settings" data-testid="l-settings">
          Settings
        </NavLink>
        <NavLink to="/dashboard" data-testid="l-dash">
          Dashboard
        </NavLink>
      </nav>,
    );
    expect(screen.getByTestId("l-settings").className).toContain("bg-accent");
    expect(screen.getByTestId("l-dash").className).not.toContain("bg-accent");
  });
});
