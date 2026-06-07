// src/features/gamification/routes/__tests__/GamificationPage.displayGate.test.tsx
//
// AI Tutor Quality Gate — learner-visible gamification display flow.
// Math/service tests can be green while the route still renders the wrong
// value or leaks a raw state error. These fixtures lock the live page wiring:
// canonical streak + canonical points in, visible widgets out.

import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

import { createDefaultState } from "../../defaults";
import type { GamificationState } from "../../types";

const h = vi.hoisted(() => ({
  gamificationState: null as GamificationState | null,
  gamificationLoading: false,
  streakDays: 8,
  serverStreak: { longest: 14 },
  totalPoints: 450 as number | undefined,
}));

vi.mock("../../hooks/useGamification", () => ({
  useGamification: () => ({
    state: h.gamificationState,
    loading: h.gamificationLoading,
    newlyUnlocked: [],
    recordActivity: vi.fn(),
    awardXp: vi.fn(),
    addGoalProgress: vi.fn(),
    setGoal: vi.fn(),
    refresh: vi.fn(),
  }),
}));

vi.mock("@/services/pointsService", () => ({
  getStreakDays: () => h.streakDays,
}));

vi.mock("@/hooks/useServerStreak", () => ({
  useServerStreak: () => h.serverStreak,
}));

vi.mock("@/hooks/usePoints", () => ({
  usePoints: () => ({
    totalPoints: h.totalPoints,
    isLoading: false,
    awardPoints: vi.fn(),
    refreshPoints: vi.fn(),
  }),
}));

vi.mock("@/lib/featureFlags", () => ({
  FEATURE_FLAGS: { SERVER_STREAKS_ENABLED: true },
}));

import GamificationPage from "../GamificationPage";

function setKnownFixture() {
  h.gamificationState = {
    ...createDefaultState(),
    dailyGoal: {
      config: { metric: "minutes", target: 10 },
      date: "2026-06-07",
      progress: 4,
      completedToday: false,
      history: {},
    },
    achievements: { unlocked: {} },
  };
  h.gamificationLoading = false;
  h.streakDays = 8;
  h.serverStreak = { longest: 14 };
  h.totalPoints = 450;
}

beforeEach(() => {
  setKnownFixture();
});

describe("GamificationPage display quality gate", () => {
  it("renders the canonical streak and points-derived XP values for a known learner state", () => {
    render(<GamificationPage />);

    const streakWidget = screen.getByTestId("streak-widget");
    expect(streakWidget).toHaveTextContent("Chuỗi ngày học");
    expect(streakWidget).toHaveTextContent("8");
    expect(streakWidget).toHaveTextContent("Kỷ lục: 14");

    const xpWidget = screen.getByTestId("xp-widget");
    expect(xpWidget).toHaveTextContent("Cấp 3");
    expect(xpWidget).toHaveTextContent("50 / 500 XP");
    expect(xpWidget).not.toHaveTextContent("450 /");
  });

  it("renders a valid new learner's zero streak and zero XP instead of the fallback", () => {
    h.gamificationState = createDefaultState();
    h.streakDays = 0;
    h.serverStreak = { longest: 0 };
    h.totalPoints = 0;

    render(<GamificationPage />);

    expect(screen.queryByTestId("gamification-display-fallback")).toBeNull();

    const streakWidget = screen.getByTestId("streak-widget");
    expect(streakWidget).toHaveTextContent("Chuỗi ngày học");
    expect(streakWidget).toHaveTextContent("0");
    expect(streakWidget).not.toHaveTextContent(/Kỷ lục:/);

    const xpWidget = screen.getByTestId("xp-widget");
    expect(xpWidget).toHaveTextContent("Cấp 1");
    expect(xpWidget).toHaveTextContent("0 / 100 XP");

    expect(screen.getByText("Mục tiêu hôm nay")).toBeInTheDocument();
    expect(screen.getByText("0 / 10 phút")).toBeInTheDocument();
  });

  it("shows a graceful fallback instead of a raw state error when display state is missing", () => {
    h.gamificationState = null;
    h.totalPoints = undefined;

    render(<GamificationPage />);

    const fallback = screen.getByTestId("gamification-display-fallback");
    expect(fallback).toHaveTextContent("Tiến độ tạm thời chưa sẵn sàng");
    expect(document.body).not.toHaveTextContent(/Cannot read|TypeError|undefined/i);
  });
});
