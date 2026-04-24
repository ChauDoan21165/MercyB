import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";

// Stub SpeechDrill — real one opens the mic and boots pronunciation libs.
// We only care about the session wrapper's iteration + progress behavior.
vi.mock("@/components/speech/SpeechDrill", () => ({
  SpeechDrill: ({
    targetSentence,
    onNext,
  }: {
    targetSentence: string;
    onNext?: () => void;
  }) => (
    <div data-testid="speech-drill-stub">
      <div data-testid="speech-drill-target">{targetSentence}</div>
      <button type="button" onClick={() => onNext?.()} data-testid="speech-drill-next">
        Next
      </button>
    </div>
  ),
}));

import { SpeechDrillSession } from "../SpeechDrillSession";

const sampleSentences = [
  { target_en: "The word is water.", target_vi: "Từ này là water." },
  { target_en: "The word is coffee.", target_vi: "Từ này là coffee." },
  { target_en: "The word is bus.", target_vi: "Từ này là bus." },
];

beforeEach(() => cleanup());

describe("SpeechDrillSession", () => {
  it("renders the first sentence on mount", () => {
    render(<SpeechDrillSession sentences={sampleSentences} />);
    expect(screen.getByTestId("speech-drill-target").textContent).toBe(
      "The word is water.",
    );
  });

  it("walks through sentences in order when Next is tapped", () => {
    render(<SpeechDrillSession sentences={sampleSentences} />);

    expect(screen.getByTestId("speech-drill-target").textContent).toBe(
      "The word is water.",
    );
    fireEvent.click(screen.getByTestId("speech-drill-next"));
    expect(screen.getByTestId("speech-drill-target").textContent).toBe(
      "The word is coffee.",
    );
    fireEvent.click(screen.getByTestId("speech-drill-next"));
    expect(screen.getByTestId("speech-drill-target").textContent).toBe(
      "The word is bus.",
    );
  });

  it("fires onComplete with sentence count on the final Next", () => {
    const onComplete = vi.fn();
    render(
      <SpeechDrillSession sentences={sampleSentences} onComplete={onComplete} />,
    );

    fireEvent.click(screen.getByTestId("speech-drill-next"));
    fireEvent.click(screen.getByTestId("speech-drill-next"));
    expect(onComplete).not.toHaveBeenCalled();

    fireEvent.click(screen.getByTestId("speech-drill-next"));
    expect(onComplete).toHaveBeenCalledTimes(1);
    expect(onComplete).toHaveBeenCalledWith(3);
  });

  it("shows the finish card after the last sentence", () => {
    render(<SpeechDrillSession sentences={sampleSentences} />);

    fireEvent.click(screen.getByTestId("speech-drill-next"));
    fireEvent.click(screen.getByTestId("speech-drill-next"));
    fireEvent.click(screen.getByTestId("speech-drill-next"));

    expect(screen.queryByTestId("speech-drill-stub")).toBeNull();
    expect(screen.getByText(/Practice complete/i)).toBeTruthy();
  });

  it("renders an empty-state label when sentences array is empty", () => {
    render(<SpeechDrillSession sentences={[]} />);
    expect(screen.getByText(/No sentences to practice yet/i)).toBeTruthy();
  });

  it("renders progress markup with aria-valuenow matching current ordinal", () => {
    render(<SpeechDrillSession sentences={sampleSentences} />);
    const progress = screen.getByRole("progressbar");
    expect(progress.getAttribute("aria-valuenow")).toBe("1");
    expect(progress.getAttribute("aria-valuemax")).toBe("3");
  });
});
