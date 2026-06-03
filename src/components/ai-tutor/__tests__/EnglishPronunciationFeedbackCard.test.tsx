import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import EnglishPronunciationFeedbackCard from "../EnglishPronunciationFeedbackCard";
import type { EnglishPronunciationFeedbackDisplay } from "@/lib/pronunciation/englishPronunciationFeedback";

const feedback: EnglishPronunciationFeedbackDisplay = {
  items: [
    {
      category: "theta_sound",
      status: "try_again",
      score: 58,
      targetWord: "think",
      titleEn: "TH sound",
      titleVi: "/th/ âm tiếng Anh",
      guidanceEn: "Put your tongue lightly between your teeth for TH.",
      guidanceVi: "Đặt đầu lưỡi nhẹ giữa hai hàm răng cho âm TH.",
    },
  ],
};

const correctFeedback: EnglishPronunciationFeedbackDisplay = {
  items: [
    {
      category: "ending_s",
      status: "correct",
      score: 95,
      targetWord: "books",
      titleEn: "Final -s",
      titleVi: "Âm -s cuối",
      guidanceEn: "Good — the final -s is clear.",
      guidanceVi: "Tốt — âm -s cuối đã rõ.",
    },
  ],
};

describe("EnglishPronunciationFeedbackCard", () => {
  it("renders the try-again guidance when enabled", () => {
    render(<EnglishPronunciationFeedbackCard enabled feedback={feedback} />);

    const card = screen.getByTestId("english-pronunciation-feedback");
    expect(card).toHaveTextContent("Try this sound again");
    expect(card).toHaveTextContent("/th/ âm tiếng Anh");
    expect(card).toHaveTextContent("Put your tongue lightly between your teeth for TH.");
  });

  it("hides when disabled or empty", () => {
    const { rerender } = render(<EnglishPronunciationFeedbackCard enabled={false} feedback={feedback} />);
    expect(screen.queryByTestId("english-pronunciation-feedback")).not.toBeInTheDocument();

    rerender(<EnglishPronunciationFeedbackCard enabled feedback={null} />);
    expect(screen.queryByTestId("english-pronunciation-feedback")).not.toBeInTheDocument();
  });

  it("renders the correct state when the sound is clear", () => {
    render(<EnglishPronunciationFeedbackCard enabled feedback={correctFeedback} />);

    const card = screen.getByTestId("english-pronunciation-feedback");
    expect(card).toHaveTextContent("Good — Final -s is coming through.");
    expect(card).toHaveTextContent("Good — the final -s is clear.");
  });
});
