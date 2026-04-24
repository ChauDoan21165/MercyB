import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";

const { mockState } = vi.hoisted(() => ({
  mockState: {
    current: 7,
    longest: 30,
    lastStudiedDate: "2026-04-23",
    loading: false,
    error: null as string | null,
  },
}));
vi.mock("@/hooks/useServerStreak", () => ({
  useServerStreak: () => mockState,
}));

import { StreakHistoryPanel } from "../StreakHistoryPanel";

function setStreak(next: Partial<typeof mockState>) {
  Object.assign(mockState, next);
}

beforeEach(() => {
  cleanup();
  setStreak({
    current: 7,
    longest: 30,
    lastStudiedDate: "2026-04-23",
    loading: false,
    error: null,
  });
  // Pin Date so day-diff math is deterministic across runs.
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2026-04-23T10:00:00Z"));
});

afterEach(() => {
  vi.useRealTimers();
});

describe("StreakHistoryPanel — render", () => {
  it("shows the big current number with day unit", () => {
    render(<StreakHistoryPanel />);
    expect(screen.getByTestId("streak-current-big").textContent).toBe("7");
    expect(screen.getByText(/days · ngày/)).toBeDefined();
  });

  it("renders longest streak alongside current", () => {
    render(<StreakHistoryPanel />);
    expect(screen.getByText(/Longest streak:/)).toBeDefined();
    expect(screen.getByText(/30 days/)).toBeDefined();
  });

  it("shows loading state", () => {
    setStreak({ loading: true });
    render(<StreakHistoryPanel />);
    expect(screen.getByText(/Loading streak/)).toBeDefined();
  });

  it("shows error state", () => {
    setStreak({ error: "RLS denied" });
    render(<StreakHistoryPanel />);
    expect(screen.getByText(/Couldn't load streak/)).toBeDefined();
    expect(screen.getByText(/RLS denied/)).toBeDefined();
  });

  it("uses the anchor id 'streaks' by default", () => {
    const { container } = render(<StreakHistoryPanel />);
    expect(container.querySelector("section#streaks")).not.toBeNull();
  });

  it("respects a custom anchorId", () => {
    const { container } = render(<StreakHistoryPanel anchorId="my-streaks" />);
    expect(container.querySelector("section#my-streaks")).not.toBeNull();
  });
});

describe("StreakHistoryPanel — status pill (lock-step with SQL trigger)", () => {
  it("ACTIVE — studied today (today's local date)", () => {
    setStreak({ lastStudiedDate: "2026-04-23" });
    render(<StreakHistoryPanel />);
    expect(screen.getByTestId("streak-status-pill").textContent).toMatch(/active/i);
  });

  it("IN_GRACE — studied yesterday (1 day ago)", () => {
    setStreak({ lastStudiedDate: "2026-04-22" });
    render(<StreakHistoryPanel />);
    expect(screen.getByTestId("streak-status-pill").textContent).toMatch(/grace/i);
  });

  it("WARNING — studied 2 days ago (last day of grace)", () => {
    setStreak({ lastStudiedDate: "2026-04-21" });
    render(<StreakHistoryPanel />);
    expect(screen.getByTestId("streak-status-pill").textContent).toMatch(/last day/i);
  });

  it("RESET — studied 3+ days ago (next study won't extend)", () => {
    setStreak({ lastStudiedDate: "2026-04-19" });
    render(<StreakHistoryPanel />);
    expect(screen.getByTestId("streak-status-pill").textContent).toMatch(/reset/i);
  });

  it("UNKNOWN — null lastStudiedDate (shouldn't happen if current>0)", () => {
    setStreak({ lastStudiedDate: null });
    render(<StreakHistoryPanel />);
    expect(screen.getByTestId("streak-status-pill").textContent).toMatch(/streak/i);
  });

  it("UNKNOWN — malformed lastStudiedDate", () => {
    setStreak({ lastStudiedDate: "not-a-date" });
    render(<StreakHistoryPanel />);
    expect(screen.getByTestId("streak-status-pill").textContent).toMatch(/streak/i);
  });
});

describe("StreakHistoryPanel — last-studied formatting", () => {
  it("formats a YYYY-MM-DD date as a long bilingual line", () => {
    setStreak({ lastStudiedDate: "2026-04-22" });
    render(<StreakHistoryPanel />);
    // EN: weekday, short month, numeric day. Wednesday Apr 22 2026.
    expect(screen.getByText(/Wednesday/)).toBeDefined();
    expect(screen.getByText(/Apr 22/)).toBeDefined();
    // VI: vi-VN locale renders "Thứ Tư" for Wed (case may vary; just check we
    // emitted SOMETHING bilingual). Look for the · separator.
    expect(screen.getByText(/Học gần nhất:/)).toBeDefined();
  });

  it("renders em dash when lastStudiedDate is missing", () => {
    setStreak({ lastStudiedDate: null });
    render(<StreakHistoryPanel />);
    expect(screen.getByText(/Last studied:/)).toBeDefined();
    // Em dash should appear in the panel somewhere.
    const html = document.body.innerHTML;
    expect(html).toContain("—");
  });
});

describe("StreakHistoryPanel — grace explanation", () => {
  it("includes the bilingual grace-window explanation", () => {
    render(<StreakHistoryPanel />);
    expect(screen.getByText(/1 day of grace/i)).toBeDefined();
    expect(screen.getByText(/1 ngày ân hạn/i)).toBeDefined();
  });
});

describe("StreakHistoryPanel — singular vs plural", () => {
  it("uses 'day' (singular) when current is 1", () => {
    setStreak({ current: 1 });
    render(<StreakHistoryPanel />);
    expect(screen.getByText(/^day · ngày$/)).toBeDefined();
  });

  it("uses 'days' (plural) when current > 1", () => {
    setStreak({ current: 5 });
    render(<StreakHistoryPanel />);
    expect(screen.getByText(/^days · ngày$/)).toBeDefined();
  });
});
