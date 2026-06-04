import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import PronunciationProgressTrail from "../PronunciationProgressTrail";
import type { PronunciationProgressDisplay } from "@/lib/pronunciation/pronunciationProgressTrail";

const improvingDisplay: PronunciationProgressDisplay = {
  entries: [
    { status: "try_again", score: 50 },
    { status: "correct", score: 78 },
  ],
  attemptCount: 2,
  latestStatus: "correct",
  trend: "improving",
  headlineVi: "Bạn đang tiến bộ — lần này tốt hơn lần trước rồi.",
  headlineEn: "You're improving — this try was better than the last.",
  supportiveVi: "Đã luyện 2 lần có chấm trong buổi này.",
};

const keepGoingDisplay: PronunciationProgressDisplay = {
  entries: [
    { status: "correct", score: 80 },
    { status: "try_again", score: 60 },
  ],
  attemptCount: 2,
  latestStatus: "try_again",
  trend: "keep_going",
  headlineVi: "Cứ luyện tiếp nhé — mỗi lần một chút là tiến.",
  headlineEn: "Keep going — a little each try adds up.",
  supportiveVi: "Đã luyện 2 lần có chấm trong buổi này.",
};

describe("PronunciationProgressTrail", () => {
  it("renders the warm headline and a dot per attempt when enabled", () => {
    render(<PronunciationProgressTrail enabled display={improvingDisplay} />);

    const trail = screen.getByTestId("pronunciation-progress-trail");
    expect(trail).toHaveTextContent("Bạn đang tiến bộ");
    expect(trail).toHaveTextContent("Đã luyện 2 lần");
    expect(screen.getByTestId("pronunciation-progress-dots").children).toHaveLength(2);
  });

  it("stays low-shame on a dip — no failure or regression language", () => {
    render(<PronunciationProgressTrail enabled display={keepGoingDisplay} />);

    const trail = screen.getByTestId("pronunciation-progress-trail");
    expect(trail).toHaveTextContent("Cứ luyện tiếp");
    const text = trail.textContent?.toLowerCase() ?? "";
    expect(text).not.toContain("thất bại");
    expect(text).not.toContain("fail");
    expect(text).not.toContain("kém");
    expect(text).not.toContain("worse");
  });

  it("renders nothing when disabled or there is no display", () => {
    const { rerender } = render(
      <PronunciationProgressTrail enabled={false} display={improvingDisplay} />,
    );
    expect(
      screen.queryByTestId("pronunciation-progress-trail"),
    ).not.toBeInTheDocument();

    rerender(<PronunciationProgressTrail enabled display={null} />);
    expect(
      screen.queryByTestId("pronunciation-progress-trail"),
    ).not.toBeInTheDocument();
  });
});
