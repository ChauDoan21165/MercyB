// src/features/gamification/components/__tests__/widgets.test.tsx
//
// Lane F — F6 component tests. Render each presentational widget with fixed
// props and assert the Vietnamese labels + numbers render. No IndexedDB.

import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";

import StreakWidget from "../StreakWidget";
import XpWidget from "../XpWidget";
import DailyGoalWidget from "../DailyGoalWidget";
import AchievementsScreen from "../AchievementsScreen";
import { ACHIEVEMENTS } from "../../engines/achievementEngine";

describe("StreakWidget", () => {
  it("renders VI labels and numbers", () => {
    render(
      <StreakWidget current={5} longest={9} freezesAvailable={2} atRisk={false} />,
    );
    expect(screen.getByText("Chuỗi ngày học")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByText(/Kỷ lục:/)).toBeInTheDocument();
    expect(screen.getByText("9")).toBeInTheDocument();
  });

  it("shows the at-risk nudge only when atRisk", () => {
    const { rerender } = render(
      <StreakWidget current={3} longest={3} freezesAvailable={0} />,
    );
    expect(
      screen.queryByText(/Học hôm nay để giữ chuỗi/),
    ).not.toBeInTheDocument();

    rerender(
      <StreakWidget current={3} longest={3} freezesAvailable={0} atRisk />,
    );
    expect(
      screen.getByText(/Học hôm nay để giữ chuỗi/),
    ).toBeInTheDocument();
  });
});

describe("XpWidget", () => {
  it("renders the VI level label and XP fraction", () => {
    render(
      <XpWidget level={3} intoLevel={150} neededForNext={500} ratio={0.3} />,
    );
    expect(screen.getByText("Cấp 3")).toBeInTheDocument();
    expect(screen.getByText("150 / 500 XP")).toBeInTheDocument();
    expect(screen.getByText(/để lên cấp 4/)).toBeInTheDocument();
  });
});

describe("DailyGoalWidget", () => {
  it("renders VI metric unit and progress", () => {
    render(
      <DailyGoalWidget
        metric="minutes"
        target={10}
        progress={4}
        ratio={0.4}
        completed={false}
      />,
    );
    expect(screen.getByText("Mục tiêu hôm nay")).toBeInTheDocument();
    expect(screen.getByText("4 / 10 phút")).toBeInTheDocument();
    expect(screen.queryByTestId("daily-goal-completed")).not.toBeInTheDocument();
  });

  it("shows the completed badge when completed", () => {
    render(
      <DailyGoalWidget
        metric="lessons"
        target={2}
        progress={2}
        ratio={1}
        completed
      />,
    );
    expect(screen.getByTestId("daily-goal-completed")).toBeInTheDocument();
    expect(screen.getByText("2 / 2 bài học")).toBeInTheDocument();
  });
});

describe("AchievementsScreen", () => {
  it("renders unlocked vs locked correctly", () => {
    const target = ACHIEVEMENTS[0];
    render(
      <AchievementsScreen
        definitions={ACHIEVEMENTS}
        unlocked={{
          [target.id]: { id: target.id, unlockedAt: 1 },
        }}
      />,
    );

    // Header count: 1 of N.
    expect(
      screen.getByText(`1 / ${ACHIEVEMENTS.length}`),
    ).toBeInTheDocument();

    // The one unlocked card is flagged unlocked; all others locked.
    const unlockedCard = screen.getByTestId(`achievement-${target.id}`);
    expect(unlockedCard).toHaveAttribute("data-unlocked", "true");

    const other = ACHIEVEMENTS.find((d) => d.id !== target.id)!;
    const lockedCard = screen.getByTestId(`achievement-${other.id}`);
    expect(lockedCard).toHaveAttribute("data-unlocked", "false");

    // Every achievement title renders.
    for (const def of ACHIEVEMENTS) {
      expect(screen.getByText(def.title)).toBeInTheDocument();
    }
  });
});
