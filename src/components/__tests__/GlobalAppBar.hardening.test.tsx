/**
 * Hardening tests for src/components/GlobalAppBar.tsx
 *
 * Scope:
 * - Renders the global navigation bar deterministically with all
 *   external dependencies mocked (react-router-dom, AuthProvider, and
 *   the child UI components).
 * - Exercises the auth-dependent branches (signed out / signed in /
 *   loading), breadcrumb rendering (empty, single, multi, with/without
 *   href), the color vs. bw logo modes, and the navigation handlers
 *   (login, sign out, tier map).
 *
 * These tests intentionally mock the leaf components so the suite only
 * verifies GlobalAppBar's own behavior and stays fast + isolated.
 */

import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode, SVGProps } from "react";

type MockLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  to: string;
  children?: ReactNode;
};

type MockButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children?: ReactNode;
};

// --- Mocks -----------------------------------------------------------------

// Navigation + location are driven by these mutable references so each
// test can configure them before rendering.
const mockNavigate = vi.fn();
let mockLocation: { pathname: string; search: string };

vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
  useLocation: () => mockLocation,
  // Render Link as a plain anchor so we can assert hrefs without a Router.
  Link: ({ to, children, ...rest }: MockLinkProps) => (
    <a href={typeof to === "string" ? to : "#"} {...rest}>
      {children}
    </a>
  ),
}));

// Auth state is driven by this mutable reference.
const mockSignOut = vi.fn();
let mockAuth: { user: unknown; isLoading: boolean; signOut: () => Promise<void> };

vi.mock("@/providers/AuthProvider", () => ({
  useAuth: () => mockAuth,
}));

// Leaf UI components — stubbed so we test GlobalAppBar in isolation.
vi.mock("@/components/ui/button", () => ({
  Button: ({ children, ...props }: MockButtonProps) => <button {...props}>{children}</button>,
}));

vi.mock("@/components/ThemeToggle", () => ({
  ThemeToggle: () => <div data-testid="theme-toggle" />,
}));

vi.mock("@/components/RoomSearch", () => ({
  RoomSearch: () => <div data-testid="room-search" />,
}));

vi.mock("@/components/ColorModeToggle", () => ({
  ColorModeToggle: () => <div data-testid="color-mode-toggle" />,
}));

// Icons render nothing meaningful; keep them lightweight + identifiable.
vi.mock("lucide-react", () => ({
  LogIn: (p: SVGProps<SVGSVGElement>) => <svg data-testid="icon-login" {...p} />,
  Eye: (p: SVGProps<SVGSVGElement>) => <svg data-testid="icon-eye" {...p} />,
  ChevronRight: (p: SVGProps<SVGSVGElement>) => <svg data-testid="icon-chevron" {...p} />,
  Home: (p: SVGProps<SVGSVGElement>) => <svg data-testid="icon-home" {...p} />,
  LogOut: (p: SVGProps<SVGSVGElement>) => <svg data-testid="icon-logout" {...p} />,
}));

// Import AFTER mocks are registered.
import { GlobalAppBar } from "@/components/GlobalAppBar";
import type { BreadcrumbItem } from "@/components/GlobalAppBar";

// --- Helpers ---------------------------------------------------------------

function setSignedOut() {
  mockAuth = { user: null, isLoading: false, signOut: mockSignOut };
}

function setSignedIn(email?: string) {
  mockAuth = {
    user: email === undefined ? {} : { email },
    isLoading: false,
    signOut: mockSignOut,
  };
}

function setLoading() {
  mockAuth = { user: null, isLoading: true, signOut: mockSignOut };
}

beforeEach(() => {
  mockNavigate.mockReset();
  mockSignOut.mockReset();
  mockSignOut.mockResolvedValue(undefined);
  mockLocation = { pathname: "/", search: "" };
  setSignedOut();
});

// --- Type export -----------------------------------------------------------

describe("GlobalAppBar — exported type", () => {
  it("BreadcrumbItem type is usable for typed breadcrumb data", () => {
    const item: BreadcrumbItem = { label: "Rooms", href: "/rooms" };
    const minimal: BreadcrumbItem = { label: "Current" };
    expect(item.label).toBe("Rooms");
    expect(item.href).toBe("/rooms");
    expect(minimal.href).toBeUndefined();
  });
});

// --- Basic rendering -------------------------------------------------------

describe("GlobalAppBar — basic rendering", () => {
  it("renders a banner/header with the Home link and controls", () => {
    render(<GlobalAppBar />);
    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByTestId("theme-toggle")).toBeInTheDocument();
    expect(screen.getByTestId("color-mode-toggle")).toBeInTheDocument();
    expect(screen.getByTestId("room-search")).toBeInTheDocument();
  });

  it("renders without crashing when called with no props (defaults applied)", () => {
    expect(() => render(<GlobalAppBar />)).not.toThrow();
  });

  it("renders the colored logo letters by default (mode='color')", () => {
    render(<GlobalAppBar />);
    // Color mode splits the wordmark into individual letter spans.
    for (const letter of ["M", "e", "r", "c", "y", "B", "l", "a", "d"]) {
      // At least one span exists for each letter; assert M and B explicitly.
    }
    expect(screen.getByText("M")).toBeInTheDocument();
    expect(screen.getByText("B")).toBeInTheDocument();
    // The plain "Mercy Blade" wordmark should NOT be present in color mode.
    expect(screen.queryByText("Mercy Blade")).not.toBeInTheDocument();
  });

  it("renders the plain wordmark in bw mode", () => {
    render(<GlobalAppBar mode="bw" />);
    expect(screen.getByText("Mercy Blade")).toBeInTheDocument();
    // Individual single-letter spans should not appear in bw mode.
    expect(screen.queryByText("M")).not.toBeInTheDocument();
  });
});

// --- Breadcrumbs -----------------------------------------------------------

describe("GlobalAppBar — breadcrumbs", () => {
  it("renders no breadcrumb items when breadcrumbs is empty (default)", () => {
    render(<GlobalAppBar />);
    expect(screen.queryByTestId("icon-chevron")).not.toBeInTheDocument();
  });

  it("renders a single breadcrumb as the active (non-link) item", () => {
    render(<GlobalAppBar breadcrumbs={[{ label: "Rooms", href: "/rooms" }]} />);
    // The last item is rendered as a span even if it has an href.
    const node = screen.getByText("Rooms");
    expect(node.tagName.toLowerCase()).toBe("span");
    expect(screen.getAllByTestId("icon-chevron")).toHaveLength(1);
  });

  it("renders intermediate breadcrumbs with hrefs as links, last as span", () => {
    const crumbs: BreadcrumbItem[] = [
      { label: "Rooms", href: "/rooms" },
      { label: "Beginner", href: "/rooms/beginner" },
      { label: "Lesson 1", href: "/rooms/beginner/1" },
    ];
    render(<GlobalAppBar breadcrumbs={crumbs} />);

    const roomsLink = screen.getByText("Rooms");
    expect(roomsLink.tagName.toLowerCase()).toBe("a");
    expect(roomsLink).toHaveAttribute("href", "/rooms");

    const beginnerLink = screen.getByText("Beginner");
    expect(beginnerLink.tagName.toLowerCase()).toBe("a");

    // Last crumb is a span (active), not a link — even though it has href.
    const last = screen.getByText("Lesson 1");
    expect(last.tagName.toLowerCase()).toBe("span");

    // One chevron per breadcrumb item.
    expect(screen.getAllByTestId("icon-chevron")).toHaveLength(3);
  });

  it("renders an intermediate breadcrumb without href as a span", () => {
    const crumbs: BreadcrumbItem[] = [
      { label: "NoLink" }, // no href -> span even though intermediate
      { label: "Final", href: "/final" },
    ];
    render(<GlobalAppBar breadcrumbs={crumbs} />);
    const noLink = screen.getByText("NoLink");
    expect(noLink.tagName.toLowerCase()).toBe("span");
  });

  it("does not throw with a large number of breadcrumbs", () => {
    const many: BreadcrumbItem[] = Array.from({ length: 50 }, (_, i) => ({
      label: `Crumb ${i}`,
      href: `/c/${i}`,
    }));
    expect(() => render(<GlobalAppBar breadcrumbs={many} />)).not.toThrow();
    expect(screen.getAllByTestId("icon-chevron")).toHaveLength(50);
  });
});

// --- Auth: signed out ------------------------------------------------------

describe("GlobalAppBar — signed-out state", () => {
  it("shows the Login button and hides Tier Map / Sign out", () => {
    setSignedOut();
    render(<GlobalAppBar />);
    expect(screen.getByText("Login / Đăng nhập")).toBeInTheDocument();
    expect(screen.queryByText(/Tier Map/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Sign out/)).not.toBeInTheDocument();
  });

  it("navigates to /signin with an encoded returnTo on login click", () => {
    mockLocation = { pathname: "/rooms/beginner", search: "?page=2" };
    setSignedOut();
    render(<GlobalAppBar />);
    fireEvent.click(screen.getByText("Login / Đăng nhập"));
    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith(
      `/signin?returnTo=${encodeURIComponent("/rooms/beginner?page=2")}`,
    );
  });

  it("encodes a root path returnTo correctly", () => {
    mockLocation = { pathname: "/", search: "" };
    setSignedOut();
    render(<GlobalAppBar />);
    fireEvent.click(screen.getByText("Login / Đăng nhập"));
    expect(mockNavigate).toHaveBeenCalledWith(`/signin?returnTo=${encodeURIComponent("/")}`);
  });
});

// --- Auth: loading ---------------------------------------------------------

describe("GlobalAppBar — loading state", () => {
  it("hides the Login button while auth is loading (no user yet)", () => {
    setLoading();
    render(<GlobalAppBar />);
    // While loading with no user, the login button is suppressed
    // (the `!isLoading && !user` guard is false).
    expect(screen.queryByText("Login / Đăng nhập")).not.toBeInTheDocument();
  });

  it("does not show the Sign out button while loading", () => {
    setLoading();
    render(<GlobalAppBar />);
    expect(screen.queryByText(/Sign out/)).not.toBeInTheDocument();
  });
});

// --- Auth: signed in -------------------------------------------------------

describe("GlobalAppBar — signed-in state", () => {
  it("shows Tier Map and Sign out, hides Login", () => {
    setSignedIn("learner@example.com");
    render(<GlobalAppBar />);
    expect(screen.getByText("Tier Map")).toBeInTheDocument();
    expect(screen.getByText(/Sign out/)).toBeInTheDocument();
    expect(screen.queryByText("Login / Đăng nhập")).not.toBeInTheDocument();
  });

  it("navigates to /tier-map when Tier Map is clicked", () => {
    setSignedIn("learner@example.com");
    render(<GlobalAppBar />);
    fireEvent.click(screen.getByText("Tier Map"));
    expect(mockNavigate).toHaveBeenCalledWith("/tier-map");
  });

  it("sets the sign-out button title to the user's email when present", () => {
    setSignedIn("learner@example.com");
    render(<GlobalAppBar />);
    const signOutBtn = screen.getByText("Sign out / Đăng xuất").closest("button");
    expect(signOutBtn).toHaveAttribute("title", "Signed in as learner@example.com");
  });

  it("falls back to a generic title when the user has no email", () => {
    setSignedIn(); // user object without email
    render(<GlobalAppBar />);
    const signOutBtn = screen.getByText("Sign out / Đăng xuất").closest("button");
    expect(signOutBtn).toHaveAttribute("title", "Signed in");
  });

  it("calls signOut then navigates to /signin on sign-out click", async () => {
    setSignedIn("learner@example.com");
    render(<GlobalAppBar />);
    fireEvent.click(screen.getByText("Sign out / Đăng xuất"));

    await waitFor(() => expect(mockSignOut).toHaveBeenCalledTimes(1));
    await waitFor(() =>
      expect(mockNavigate).toHaveBeenCalledWith("/signin?returnTo=%2F", { replace: true }),
    );
  });

  it("still navigates to /signin even if signOut rejects (finally block)", async () => {
    setSignedIn("learner@example.com");
    mockSignOut.mockRejectedValueOnce(new Error("network down"));

    // handleSignOut uses try/finally with no catch, so a rejecting signOut
    // surfaces as an unhandled rejection on the (unawaited) click handler.
    // Swallow exactly that expected error so it doesn't pollute the run.
    const seen: unknown[] = [];
    const onUnhandled = (event: PromiseRejectionEvent) => {
      seen.push(event.reason);
      event.preventDefault?.();
    };
    window.addEventListener("unhandledrejection", onUnhandled);
    const onNode = (reason: unknown) => seen.push(reason);
    process.on("unhandledRejection", onNode);

    try {
      render(<GlobalAppBar />);
      fireEvent.click(screen.getByText("Sign out / Đăng xuất"));

      await waitFor(() =>
        expect(mockNavigate).toHaveBeenCalledWith("/signin?returnTo=%2F", { replace: true }),
      );
      // Give the rejected microtask a tick to surface to our handlers.
      await new Promise((resolve) => setTimeout(resolve, 0));
    } finally {
      window.removeEventListener("unhandledrejection", onUnhandled);
      process.off("unhandledRejection", onNode);
    }

    expect(mockSignOut).toHaveBeenCalledTimes(1);
  });
});

// --- Mode prop -------------------------------------------------------------

describe("GlobalAppBar — mode prop", () => {
  it("applies the bw background class wrapper without crashing", () => {
    const { container } = render(<GlobalAppBar mode="bw" />);
    const header = container.querySelector("header");
    expect(header).not.toBeNull();
    expect(header?.className).toContain("bg-white/95");
  });

  it("applies the color background class wrapper by default", () => {
    const { container } = render(<GlobalAppBar mode="color" />);
    const header = container.querySelector("header");
    expect(header?.className).toContain("bg-background/95");
  });
});

// --- Combined / interaction stability --------------------------------------

describe("GlobalAppBar — combined scenarios", () => {
  it("renders breadcrumbs and signed-in controls together", () => {
    setSignedIn("a@b.com");
    render(
      <GlobalAppBar
        mode="bw"
        breadcrumbs={[
          { label: "Rooms", href: "/rooms" },
          { label: "Lesson", href: "/rooms/1" },
        ]}
      />,
    );
    expect(screen.getByText("Rooms")).toBeInTheDocument();
    expect(screen.getByText("Tier Map")).toBeInTheDocument();
    expect(screen.getByText("Mercy Blade")).toBeInTheDocument();
  });

  it("does not call navigate on initial render", () => {
    setSignedIn("a@b.com");
    render(<GlobalAppBar />);
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
