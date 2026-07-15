import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import {
  LearnerProfileProgressView,
  type LearnerProfileProgressData,
} from "@/components/learner-profile/LearnerProfileProgressCards";

function emptyData(): LearnerProfileProgressData {
  return {
    skills: [],
    patterns: [],
    rollup: {
      weekLessons: 0,
      monthLessons: 0,
      weekMinutes: 0,
      monthMinutes: 0,
      monthActiveDays: 0,
      latestTopic: null,
    },
  };
}

describe("LearnerProfileProgressView", () => {
  it("renders an intentional empty profile without fake zero skill scores", () => {
    render(<LearnerProfileProgressView data={emptyData()} />);

    expect(screen.getByTestId("skill-bars-card")).toHaveTextContent("Chưa đánh giá");
    expect(screen.getByTestId("skill-bars-card")).not.toHaveTextContent("0%");
    expect(screen.getByTestId("cause-card")).toHaveTextContent("Chưa có mẫu lỗi lặp lại");
    expect(screen.getByTestId("progress-rollup-card")).toHaveTextContent("0");
  });

  it("renders sparse skill data as partial progress and leaves other skills unassessed", () => {
    render(
      <LearnerProfileProgressView
        data={{
          ...emptyData(),
          skills: [
            {
              skill: "grammar",
              score: 72,
              cefr_estimate: "A2",
              confidence: 0.64,
              evidence_count: 5,
              last_assessed_at: "2026-07-15T00:00:00Z",
            },
          ],
        }}
      />,
    );

    expect(screen.getByText("Ngữ pháp")).toBeInTheDocument();
    expect(screen.getByText("72% · A2")).toBeInTheDocument();
    expect(screen.getAllByText("Chưa đánh giá · not yet assessed").length).toBeGreaterThan(0);
  });

  it("renders the top cause metadata, trend, rollup, and practice CTA", () => {
    const onPractice = vi.fn();
    render(
      <LearnerProfileProgressView
        onPractice={onPractice}
        data={{
          skills: [],
          patterns: [
            {
              pattern_code: "missing-article",
              l1: "vi",
              occurrence_count: 6,
              resolved_count: 2,
              first_seen_at: "2026-07-10T00:00:00Z",
              last_seen_at: "2026-07-15T00:00:00Z",
              trend: "worsening",
            },
            {
              pattern_code: "tense-omission",
              l1: "vi",
              occurrence_count: 3,
              resolved_count: 1,
              first_seen_at: "2026-07-12T00:00:00Z",
              last_seen_at: "2026-07-15T00:00:00Z",
              trend: "improving",
            },
          ],
          rollup: {
            weekLessons: 2,
            monthLessons: 4,
            weekMinutes: 18,
            monthMinutes: 42,
            monthActiveDays: 3,
            latestTopic: "Past tense",
          },
        }}
      />,
    );

    expect(screen.getByText("thiếu mạo từ (a/an/the)")).toBeInTheDocument();
    expect(screen.getByText(/Trong tiếng Việt không có/)).toBeInTheDocument();
    expect(screen.getByText("cần chú ý")).toBeInTheDocument();
    expect(screen.getByText(/Past tense/)).toBeInTheDocument();

    fireEvent.click(screen.getAllByRole("button", { name: /Luyện lỗi này/ })[0]);
    expect(onPractice).toHaveBeenCalledTimes(1);
    expect(onPractice.mock.calls[0]?.[0]).toMatchObject({
      targetSkill: "missing-article",
      suggestedMode: "grammar",
    });
  });

  it("renders no trend arrow or label below the evidence floor", () => {
    render(
      <LearnerProfileProgressView
        data={{
          ...emptyData(),
          patterns: [
            {
              pattern_code: "missing-article",
              l1: "vi",
              occurrence_count: 2,
              resolved_count: 0,
              first_seen_at: "2026-07-10T00:00:00Z",
              last_seen_at: "2026-07-15T00:00:00Z",
              trend: "worsening",
            },
          ],
        }}
      />,
    );

    expect(screen.getByText("thiếu mạo từ (a/an/the)")).toBeInTheDocument();
    expect(screen.getByText("2 lần thấy")).toBeInTheDocument();
    expect(screen.queryByText("cần chú ý")).not.toBeInTheDocument();
  });
});
