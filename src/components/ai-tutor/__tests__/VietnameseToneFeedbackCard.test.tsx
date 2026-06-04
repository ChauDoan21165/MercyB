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
  practicePromptVi: "Tốt rồi. Lặp lại một lần nữa để giữ cảm giác đường giọng.",
  practicePromptEn: "Good. Repeat once more to keep the tone shape steady.",
};

const tryAgainFeedback: VietnameseToneFeedbackDisplay = {
  tone: "huyen",
  toneLabelVi: "huyền",
  directionLabelVi: "đi xuống",
  status: "try_again",
  score: 42,
  practicePromptVi: "Không sao. Thử lại chậm hơn một lần, tập trung vào hướng đường giọng.",
  practicePromptEn: "No problem. Try once more slowly and focus on the tone direction.",
};

const unsupportedFeedback: VietnameseToneFeedbackDisplay = {
  tone: "nga",
  toneLabelVi: "ngã",
  directionLabelVi: "giữ ngang",
  status: "unsupported",
  score: null,
  practicePromptVi: "Mercy chưa chấm chắc thanh này. Mình luyện chậm lại một lần nữa, rồi chuyển sang má / mà / ma nhé.",
  practicePromptEn: "I can't assess this tone yet. Try one slow repeat, then practice má / mà / ma.",
};

const unclearFeedback: VietnameseToneFeedbackDisplay = {
  tone: "sac",
  toneLabelVi: "sắc",
  directionLabelVi: "đi lên",
  status: "unclear",
  score: null,
  practicePromptVi: "Mercy chưa nghe rõ đường giọng. Thử lại chậm hơn và kéo nguyên âm rõ hơn nhé.",
  practicePromptEn: "I couldn't hear the tone shape clearly. Try again more slowly with a clearer vowel.",
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
    expect(card).toHaveTextContent("Thanh huyền đang gần hơn rồi.");
    expect(card).toHaveTextContent("Thử thêm một lần: đi xuống rõ hơn một chút.");
    expect(card).toHaveTextContent("Điểm thanh điệu khoảng 42%.");
  });

  it("redirects unsupported tones into more practice without a score", () => {
    render(<VietnameseToneFeedbackCard enabled feedback={unsupportedFeedback} />);

    const card = screen.getByTestId("vietnamese-tone-feedback");
    expect(card).toHaveTextContent("Thanh ngã: Mercy chưa chấm chắc thanh này.");
    expect(card).toHaveTextContent("chuyển sang má / mà / ma");
    expect(card).toHaveTextContent("Không hiện điểm khi bằng chứng chưa đủ chắc.");
    expect(card).not.toHaveTextContent("Điểm thanh điệu khoảng");
  });

  it("redirects unclear supported-tone evidence into another slow attempt", () => {
    render(<VietnameseToneFeedbackCard enabled feedback={unclearFeedback} />);

    const card = screen.getByTestId("vietnamese-tone-feedback");
    expect(card).toHaveTextContent("Mercy chưa nghe rõ đường giọng.");
    expect(card).toHaveTextContent("Thử lại chậm hơn");
    expect(card).not.toHaveTextContent("Điểm thanh điệu khoảng");
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
