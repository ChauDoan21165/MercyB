import React from "react";
import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import type { PlacementV3Task } from "@/lib/placement/v3/types";
import {
  ConversationTaskCard,
  L1FlagsDisplay,
  ListeningTaskCard,
  ReadingTaskCard,
  RecommendedLessonsList,
  ResultsProfile,
  SpeakingTaskCard,
  WritingTaskCard,
} from "@/components/placement/v3";
import { placementV3StubInternals } from "@/lib/placement/v3/clientStub";

const tasks = placementV3StubInternals.tasks;

describe("placement v3 task cards", () => {
  it("renders writing task with bilingual word count", () => {
    const onChange = vi.fn();
    render(<WritingTaskCard task={tasks[0]} value="I study English every day." onChange={onChange} />);
    expect(screen.getByText(/Describe your usual weekday/i)).toBeInTheDocument();
    expect(screen.getByText(/^5 words/i)).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText(/writing answer/i), {
      target: { value: "New answer" },
    });
    expect(onChange).toHaveBeenCalledWith("New answer");
  });

  it("renders speaking fallback textarea when mic is denied", () => {
    render(
      <SpeakingTaskCard
        task={tasks[1]}
        transcript=""
        onTranscriptChange={vi.fn()}
        isRecording={false}
        permission="denied"
        elapsedSeconds={0}
        onStart={vi.fn()}
        onStop={vi.fn()}
        onRetake={vi.fn()}
      />,
    );
    expect(screen.getByText(/Microphone unavailable/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Transcript or typed answer/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Record/i })).toBeDisabled();
  });

  it("selects reading MCQ answers", () => {
    const onChange = vi.fn();
    render(<ReadingTaskCard task={tasks[2]} value="" onChange={onChange} />);
    fireEvent.click(screen.getByRole("radio", { name: /Send three feedback slides/i }));
    expect(onChange).toHaveBeenCalledWith("b");
  });

  it("selects listening MCQ answers", () => {
    const onChange = vi.fn();
    render(<ListeningTaskCard task={tasks[3]} value="" onChange={onChange} />);
    fireEvent.click(screen.getByRole("radio", { name: /the bus is delayed/i }));
    expect(onChange).toHaveBeenCalledWith("c");
  });

  it("renders conversation Mercy turn and answer box", () => {
    render(<ConversationTaskCard task={tasks[4]} value="" onChange={vi.fn()} />);
    expect(screen.getByText("Mercy")).toBeInTheDocument();
    expect(screen.getByText(/better job/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Conversation answer/i)).toBeInTheDocument();
  });

  it("renders a short-answer reading task", () => {
    const task: PlacementV3Task = {
      ...tasks[2],
      id: "read-short",
      type: "reading_short",
      options: undefined,
    };
    render(<ReadingTaskCard task={task} value="" onChange={vi.fn()} />);
    expect(screen.getByPlaceholderText(/Short answer/i)).toBeInTheDocument();
  });
});

describe("placement v3 results components", () => {
  const results = placementV3StubInternals.buildResults("test-session");

  it("renders results profile with overall and subskill levels", () => {
    render(<ResultsProfile results={results} />);
    expect(screen.getAllByText("A2").length).toBeGreaterThan(0);
    expect(screen.getByText(/Overall level/i)).toBeInTheDocument();
    expect(screen.getByText(/Writing/i)).toBeInTheDocument();
  });

  it("renders Vietnamese L1 flags", () => {
    render(<L1FlagsDisplay flags={results.l1Flags} />);
    expect(screen.getByText(/Vietnamese-specific focus/i)).toBeInTheDocument();
    expect(screen.getByText(/Final consonants/i)).toBeInTheDocument();
  });

  it("renders recommended lessons and starts the top lesson", () => {
    const onStart = vi.fn();
    render(<RecommendedLessonsList recommendations={results.recommendations} onStartLesson={onStart} />);
    fireEvent.click(screen.getByRole("button", { name: /Start this lesson/i }));
    expect(onStart).toHaveBeenCalledWith("present_perfect_experiences_l1");
  });
});
