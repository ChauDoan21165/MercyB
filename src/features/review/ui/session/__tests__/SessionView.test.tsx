import React from "react";
import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";

import { SessionView } from "../SessionView";
import type { GradePreview } from "../GradeButtons";
import type {
  SessionCard,
  SessionSummary,
} from "@/features/review/types";

const PREVIEWS: GradePreview = { again: 0, hard: 1, good: 4, easy: 10 };

function makeCard(over: Partial<SessionCard["item"]> = {}): SessionCard {
  return {
    isNew: true,
    item: {
      id: "vi-en:vocab:hello",
      flow: "vi-en",
      kind: "vocab",
      front: "xin chào",
      back: "hello",
      source: "test",
      ...over,
    },
    card: {
      itemId: "vi-en:vocab:hello",
      flow: "vi-en",
      introducedAt: 0,
      state: {
        due: 0,
        stability: 0,
        difficulty: 5,
        elapsedDays: 0,
        scheduledDays: 0,
        reps: 0,
        lapses: 0,
        state: "new",
        lastReview: null,
      },
    },
  };
}

describe("SessionView", () => {
  it("shows the prompt-language front text and a reveal button before reveal", () => {
    render(
      <SessionView
        current={makeCard()}
        promptLang="vi"
        answerLang="en"
        revealed={false}
        onReveal={() => {}}
        onGrade={() => {}}
        previews={PREVIEWS}
        completed={0}
        total={3}
        summary={null}
      />,
    );

    expect(screen.getByTestId("card-front-text")).toHaveTextContent("xin chào");
    // front lang attribute is the prompt language
    expect(screen.getByTestId("card-front-text")).toHaveAttribute("lang", "vi");
    expect(
      screen.getByRole("button", { name: "Hiện đáp án" }),
    ).toBeInTheDocument();
    // no back / grade buttons yet
    expect(screen.queryByTestId("grade-buttons")).not.toBeInTheDocument();
  });

  it("fires onReveal when 'Hiện đáp án' is clicked", () => {
    const onReveal = vi.fn();
    render(
      <SessionView
        current={makeCard()}
        promptLang="vi"
        answerLang="en"
        revealed={false}
        onReveal={onReveal}
        onGrade={() => {}}
        previews={PREVIEWS}
        completed={0}
        total={1}
        summary={null}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Hiện đáp án" }));
    expect(onReveal).toHaveBeenCalledTimes(1);
  });

  it("when revealed, shows the answer + pronunciation + grade buttons", () => {
    render(
      <SessionView
        current={makeCard({ pronunciation: "/həˈloʊ/" })}
        promptLang="vi"
        answerLang="en"
        revealed={true}
        onReveal={() => {}}
        onGrade={() => {}}
        previews={PREVIEWS}
        completed={0}
        total={1}
        summary={null}
      />,
    );

    expect(screen.getByTestId("card-back-text")).toHaveTextContent("hello");
    expect(screen.getByTestId("card-back-text")).toHaveAttribute("lang", "en");
    expect(screen.getByTestId("card-back-pron")).toHaveTextContent("/həˈloʊ/");
    expect(screen.getByTestId("card-back-pron")).toHaveTextContent("Phiên âm (IPA)");
    expect(screen.getByTestId("grade-buttons")).toBeInTheDocument();
  });

  it("grade buttons use neutral Vietnamese labels and the interval previews", () => {
    render(
      <SessionView
        current={makeCard()}
        promptLang="vi"
        answerLang="en"
        revealed={true}
        onReveal={() => {}}
        onGrade={() => {}}
        previews={PREVIEWS}
        completed={0}
        total={1}
        summary={null}
      />,
    );
    // neutral "Lại", never "học lại"
    expect(screen.getByText("Lại")).toBeInTheDocument();
    expect(screen.getByText("Khó")).toBeInTheDocument();
    expect(screen.getByText("Tốt")).toBeInTheDocument();
    expect(screen.getByText("Dễ")).toBeInTheDocument();
    // interval label rendered from preview (good = 4 days)
    expect(screen.getByText("4 ngày")).toBeInTheDocument();
  });

  it("fires onGrade with the correct grade when a grade button is clicked", () => {
    const onGrade = vi.fn();
    render(
      <SessionView
        current={makeCard()}
        promptLang="vi"
        answerLang="en"
        revealed={true}
        onReveal={() => {}}
        onGrade={onGrade}
        previews={PREVIEWS}
        completed={0}
        total={1}
        summary={null}
      />,
    );
    fireEvent.click(
      screen.getByTestId("grade-buttons").querySelector('[data-grade="good"]')!,
    );
    expect(onGrade).toHaveBeenCalledWith("good");
  });

  it("renders an optional audio button only when audioKey + onPlayAudio present", () => {
    const onPlayAudio = vi.fn();
    const { rerender } = render(
      <SessionView
        current={makeCard()}
        promptLang="vi"
        answerLang="en"
        revealed={false}
        onReveal={() => {}}
        onGrade={() => {}}
        previews={PREVIEWS}
        completed={0}
        total={1}
        summary={null}
        onPlayAudio={onPlayAudio}
      />,
    );
    // no audioKey → no audio button
    expect(
      screen.queryByRole("button", { name: "Nghe phát âm" }),
    ).not.toBeInTheDocument();

    rerender(
      <SessionView
        current={makeCard({ audioKey: "kids/hello.mp3" })}
        promptLang="vi"
        answerLang="en"
        revealed={false}
        onReveal={() => {}}
        onGrade={() => {}}
        previews={PREVIEWS}
        completed={0}
        total={1}
        summary={null}
        onPlayAudio={onPlayAudio}
      />,
    );
    const audioBtn = screen.getByRole("button", { name: "Nghe phát âm" });
    fireEvent.click(audioBtn);
    expect(onPlayAudio).toHaveBeenCalledWith("kids/hello.mp3");
  });

  it("shows the celebration completion panel when current is null + summary present", () => {
    const summary: SessionSummary = {
      flow: "vi-en",
      reviewed: 5,
      newIntroduced: 2,
      grades: { again: 1, hard: 0, good: 3, easy: 1 },
      nextDueAt: null,
    };
    render(
      <SessionView
        current={null}
        promptLang="vi"
        answerLang="en"
        revealed={false}
        onReveal={() => {}}
        onGrade={() => {}}
        previews={PREVIEWS}
        completed={5}
        total={5}
        summary={summary}
      />,
    );
    expect(screen.getByTestId("session-complete")).toHaveTextContent(
      "Hoàn thành",
    );
    expect(screen.getByTestId("session-complete-count")).toHaveTextContent(
      "Đã ôn 5 thẻ",
    );
    // null nextDueAt → friendly message
    expect(screen.getByTestId("session-complete-next")).toHaveTextContent(
      "Hôm nay không còn thẻ nào",
    );
  });

  it("shows the next-review time when nextDueAt is set", () => {
    const summary: SessionSummary = {
      flow: "vi-en",
      reviewed: 1,
      newIntroduced: 0,
      grades: { again: 0, hard: 0, good: 1, easy: 0 },
      nextDueAt: 1_900_000_000_000,
    };
    render(
      <SessionView
        current={null}
        promptLang="vi"
        answerLang="en"
        revealed={false}
        onReveal={() => {}}
        onGrade={() => {}}
        previews={PREVIEWS}
        completed={1}
        total={1}
        summary={summary}
      />,
    );
    expect(screen.getByTestId("session-complete-next")).toHaveTextContent(
      "Lần ôn tiếp theo:",
    );
  });
});
