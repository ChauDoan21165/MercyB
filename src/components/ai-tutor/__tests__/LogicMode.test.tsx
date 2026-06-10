import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import LogicMode from "../LogicMode";

describe("LogicMode — C6 fail-closed contract", () => {
  it("shows VN error banner with retry when analysisError set and no corrected sentence", () => {
    const onRetry = vi.fn();
    render(
      <LogicMode
        latestCorrectedSentence={null}
        analysisError="Mercy chưa sửa chắc câu này. Bạn có thể thử lại."
        onRetry={onRetry}
      />,
    );

    expect(screen.getByTestId("ai-tutor-logic-analysis-error")).toBeTruthy();
    expect(screen.getByText(/Mercy chưa sửa chắc câu này/)).toBeTruthy();

    const retryBtn = screen.getByRole("button", { name: /Thử lại/ });
    expect(retryBtn).toBeTruthy();
    fireEvent.click(retryBtn);
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it("does NOT show error banner when corrected sentence is present (error is stale)", () => {
    render(
      <LogicMode
        latestCorrectedSentence="I went to school yesterday."
        analysisError="Some old error"
        onRetry={vi.fn()}
      />,
    );

    expect(screen.queryByTestId("ai-tutor-logic-analysis-error")).toBeNull();
    expect(screen.getByTestId("ai-tutor-logic-current-board")).toBeTruthy();
  });

  it("shows empty board state (not error) when no error and no corrected sentence", () => {
    render(<LogicMode latestCorrectedSentence={null} />);

    expect(screen.queryByTestId("ai-tutor-logic-analysis-error")).toBeNull();
    expect(screen.getByTestId("ai-tutor-logic-empty-board")).toBeTruthy();
  });
});
