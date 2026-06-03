import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

const { mockState } = vi.hoisted(() => ({
  mockState: {
    current: 12,
    longest: 34,
    lastStudiedDate: "2026-04-23",
    loading: false,
    error: null as string | null,
  },
}));
vi.mock("@/hooks/useCanonicalStreak", () => ({
  useCanonicalStreak: () => mockState,
}));

import { StreakBadge } from "../StreakBadge";

function setStreak(next: Partial<typeof mockState>) {
  Object.assign(mockState, next);
}

beforeEach(() => {
  cleanup();
  setStreak({
    current: 12,
    longest: 34,
    lastStudiedDate: "2026-04-23",
    loading: false,
    error: null,
  });
});

describe("StreakBadge", () => {
  it("renders the current streak count and a flame", () => {
    render(
      <MemoryRouter>
        <StreakBadge />
      </MemoryRouter>,
    );
    const link = screen.getByTestId("streak-badge-link");
    expect(link.textContent).toContain("12");
    expect(link.textContent).toContain("🔥");
  });

  it("links to /account#streaks by default", () => {
    render(
      <MemoryRouter>
        <StreakBadge />
      </MemoryRouter>,
    );
    const link = screen.getByTestId("streak-badge-link") as HTMLAnchorElement;
    expect(link.getAttribute("href")).toBe("/account#streaks");
  });

  it("respects the href override prop", () => {
    render(
      <MemoryRouter>
        <StreakBadge href="/somewhere/else" />
      </MemoryRouter>,
    );
    const link = screen.getByTestId("streak-badge-link") as HTMLAnchorElement;
    expect(link.getAttribute("href")).toBe("/somewhere/else");
  });

  it("renders bilingual motivational tooltip on hover", () => {
    render(
      <MemoryRouter>
        <StreakBadge />
      </MemoryRouter>,
    );
    expect(screen.queryByTestId("streak-badge-tooltip")).toBeNull();
    fireEvent.mouseEnter(screen.getByTestId("streak-badge-wrap"));
    const tip = screen.getByTestId("streak-badge-tooltip");
    expect(tip.textContent).toContain("You're on a 12-day streak! Keep it going 🔥");
    expect(tip.textContent).toContain("Bạn đang có chuỗi 12 ngày! Cố lên nhé 🔥");
  });

  it("hides itself when streak_current is 0", () => {
    setStreak({ current: 0 });
    const { container } = render(
      <MemoryRouter>
        <StreakBadge />
      </MemoryRouter>,
    );
    expect(container.firstChild).toBeNull();
  });

  it("hides itself while loading", () => {
    setStreak({ loading: true });
    const { container } = render(
      <MemoryRouter>
        <StreakBadge />
      </MemoryRouter>,
    );
    expect(container.firstChild).toBeNull();
  });

  it("hides itself on error", () => {
    setStreak({ error: "boom" });
    const { container } = render(
      <MemoryRouter>
        <StreakBadge />
      </MemoryRouter>,
    );
    expect(container.firstChild).toBeNull();
  });

  it("aria-label exposes count and purpose for screen readers", () => {
    render(
      <MemoryRouter>
        <StreakBadge />
      </MemoryRouter>,
    );
    const link = screen.getByTestId("streak-badge-link");
    expect(link.getAttribute("aria-label")).toContain("12-day study streak");
  });
});
