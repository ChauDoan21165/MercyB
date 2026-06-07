// src/components/parent-view/__tests__/ParentNavEntry.test.tsx
//
// Locks the Parent nav entry's visibility contract: visible to any signed-in
// user (conversion nudge; access is paywall-gated inside ParentView), hidden
// for signed-out / still-loading auth. Navigates to the parent route.

import { render, screen, fireEvent } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";

const h = vi.hoisted(() => ({
  nav: vi.fn(),
  auth: { user: null as { id: string } | null, isLoading: false },
}));

vi.mock("react-router-dom", () => ({ useNavigate: () => h.nav }));
vi.mock("@/providers/AuthProvider", () => ({ useAuth: () => h.auth }));

import ParentNavEntry from "@/components/parent-view/ParentNavEntry";

beforeEach(() => {
  h.nav.mockClear();
  h.auth = { user: null, isLoading: false };
});

describe("ParentNavEntry — visibility", () => {
  it("renders nothing for a signed-out user", () => {
    h.auth = { user: null, isLoading: false };
    const { container } = render(<ParentNavEntry />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders nothing while auth is still loading", () => {
    h.auth = { user: null, isLoading: true };
    const { container } = render(<ParentNavEntry />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders for a signed-in user (visible-to-all; access gated downstream)", () => {
    h.auth = { user: { id: "u1" }, isLoading: false };
    render(<ParentNavEntry />);
    expect(screen.getByRole("button", { name: /Parent view/i })).toBeInTheDocument();
  });

  it("navigates to the parent route on click", () => {
    h.auth = { user: { id: "u1" }, isLoading: false };
    render(<ParentNavEntry />);
    fireEvent.click(screen.getByRole("button", { name: /Parent view/i }));
    expect(h.nav).toHaveBeenCalledWith("/parent/me");
  });
});
