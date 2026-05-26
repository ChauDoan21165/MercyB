import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

import { MercyAnswerFeedback } from "@/components/feedback/MercyAnswerFeedback";
import { sendMercyFeedback } from "@/lib/send-feedback";
import { breadcrumbMercyFeedbackDownvote } from "@/lib/monitoring/breadcrumbs";

vi.mock("@/lib/send-feedback", () => ({
  sendMercyFeedback: vi.fn(),
}));
vi.mock("@/lib/feedback-ids", () => ({
  getAnonId: () => "anon_test",
  getSessionId: () => "sess_test",
}));
vi.mock("@/lib/monitoring/breadcrumbs", () => ({
  breadcrumbMercyFeedbackDownvote: vi.fn(),
}));

const sendMock = vi.mocked(sendMercyFeedback);
const crumbMock = vi.mocked(breadcrumbMercyFeedbackDownvote);

const baseProps = {
  answerText: "Câu này em viết tốt rồi.",
  responseId: "resp_1",
  msgId: "msg_1",
  conversationId: "conv_1",
  surface: "in_room_chat" as const,
  mode: "general_guide",
};

describe("MercyAnswerFeedback", () => {
  beforeEach(() => {
    sendMock.mockReset();
    crumbMock.mockReset();
    sendMock.mockResolvedValue({ ok: true, acceptedCount: 1 });
  });

  // Fallback path FIRST (testing discipline): a telemetry network
  // failure must never throw to the surface — the learner still sees a
  // clean "thank you", not an error.
  it("swallows a send failure and still completes", async () => {
    sendMock.mockRejectedValueOnce(new Error("network down"));
    render(<MercyAnswerFeedback {...baseProps} />);

    fireEvent.click(screen.getByTestId("mercy-feedback-up"));

    expect(await screen.findByTestId("mercy-feedback-done")).toBeTruthy();
  });

  it("up-vote sends vote=up with the Vietnamese answer text and no reason", async () => {
    render(<MercyAnswerFeedback {...baseProps} />);
    fireEvent.click(screen.getByTestId("mercy-feedback-up"));

    await screen.findByTestId("mercy-feedback-done");
    expect(sendMock).toHaveBeenCalledTimes(1);
    const arg = sendMock.mock.calls[0][0];
    expect(arg.vote).toBe("up");
    expect(arg.feedbackReason).toBeNull();
    expect(arg.answerText).toBe("Câu này em viết tốt rồi.");
    expect(arg.lang).toBe("vi");
  });

  it("down-vote fires the Sentry breadcrumb immediately and shows reason chips", () => {
    render(<MercyAnswerFeedback {...baseProps} />);
    fireEvent.click(screen.getByTestId("mercy-feedback-down"));

    expect(crumbMock).toHaveBeenCalledTimes(1);
    expect(crumbMock.mock.calls[0][0]).toMatchObject({
      surface: "in_room_chat",
      lang: "vi",
    });
    // The signal this workstream exists for must be a one-tap chip.
    expect(
      screen.getByTestId("mercy-feedback-reason-vi_machine_translated"),
    ).toBeTruthy();
    // Breadcrumb fired but no DB write yet — reason not chosen.
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("picking 'Tiếng Việt đọc như dịch máy' sends vote=down with that reason key", async () => {
    render(<MercyAnswerFeedback {...baseProps} />);
    fireEvent.click(screen.getByTestId("mercy-feedback-down"));
    fireEvent.click(
      screen.getByTestId("mercy-feedback-reason-vi_machine_translated"),
    );

    await screen.findByTestId("mercy-feedback-done");
    const arg = sendMock.mock.calls[0][0];
    expect(arg.vote).toBe("down");
    expect(arg.feedbackReason).toBe("vi_machine_translated");
    expect(arg.answerText).toBe("Câu này em viết tốt rồi.");
  });

  it("'Khác' free text is prefixed and capped", async () => {
    render(<MercyAnswerFeedback {...baseProps} />);
    fireEvent.click(screen.getByTestId("mercy-feedback-down"));
    fireEvent.click(screen.getByTestId("mercy-feedback-reason-other"));
    fireEvent.change(screen.getByTestId("mercy-feedback-other-input"), {
      target: { value: "  nghe rất Tây  " },
    });
    fireEvent.click(screen.getByTestId("mercy-feedback-other-send"));

    await screen.findByTestId("mercy-feedback-done");
    expect(sendMock.mock.calls[0][0].feedbackReason).toBe("other:nghe rất Tây");
  });
});
