import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import VietnameseToneFeedbackCard from "../VietnameseToneFeedbackCard";
import type { VietnameseToneFeedbackDisplay } from "@/lib/pronunciation/vietnameseToneFeedback";

const correctFeedback: VietnameseToneFeedbackDisplay = {
  tone: "sac",
  toneLabelVi: "sắc",
  directionLabelVi: "đi lên",
  status: "correct",
  score: 91,
};

const tryAgainFeedback: VietnameseToneFeedbackDisplay = {
  tone: "huyen",
  toneLabelVi: "huyền",
  directionLabelVi: "đi xuống",
  status: "try_again",
  score: 42,
};

describe("VietnameseToneFeedbackCard", () => {
  it("shows correct feedback for supported matches", () => {
    render(<VietnameseToneFeedbackCard enabled feedback={correctFeedback} />);

    const card = screen.getByTestId("vietnamese-tone-feedback");
    expect(card).toHaveTextContent("Thanh sắc đúng rồi.");
    expect(card).toHaveTextContent("Giọng của bạn đang đi lên giống câu mẫu.");
    expect(card).toHaveTextContent("Điểm thanh điệu khoảng 91%.");
  });

  it("shows try-again feedback for supported mismatches", () => {
    render(<VietnameseToneFeedbackCard enabled feedback={tryAgainFeedback} />);

    const card = screen.getByTestId("vietnamese-tone-feedback");
    expect(card).toHaveTextContent("Thanh huyền chưa khớp.");
    expect(card).toHaveTextContent("Hãy thử đi xuống rõ hơn một chút.");
    expect(card).toHaveTextContent("Điểm thanh điệu khoảng 42%.");
  });

  it("hides feedback when the feature flag is off or there is no tone data", () => {
    render(<VietnameseToneFeedbackCard enabled={false} feedback={correctFeedback} />);
    expect(screen.queryByTestId("vietnamese-tone-feedback")).not.toBeInTheDocument();

    const { rerender } = render(<VietnameseToneFeedbackCard enabled feedback={null} />);
    expect(screen.queryByTestId("vietnamese-tone-feedback")).not.toBeInTheDocument();

    rerender(<VietnameseToneFeedbackCard enabled={false} feedback={null} />);
    expect(screen.queryByTestId("vietnamese-tone-feedback")).not.toBeInTheDocument();
  });
});
