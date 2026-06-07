import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";

import SelfCompareRecorder from "@/components/pronunciation/SelfCompareRecorder";

/**
 * Shared by-ear self-compare recorder — used by /practice/pronunciation and the
 * AiTutor Speak surface. Drives the recorder hook deterministically (jsdom has
 * no MediaRecorder). The component never scores, never shows a percent, and
 * never calls a server.
 */
const recorderMock = vi.hoisted(() => ({
  current: null as unknown as Record<string, unknown>,
}));
vi.mock("@/hooks/usePronunciationRecorder", () => ({
  usePronunciationRecorder: () => recorderMock.current,
}));

const startRecording = vi.fn();
const stopRecording = vi.fn();
const playRecorded = vi.fn();
const clearRecordedAudio = vi.fn();
const compareWithReference = vi.fn();

const IDLE = {
  status: "idle",
  error: null,
  audioBlob: null,
  lastRecordedAudioUrl: null,
  isPlayingReference: false,
  isPlayingRecorded: false,
  isComparing: false,
  setError: () => {},
  startRecording,
  stopRecording,
  reset: () => {},
  clearRecordedAudio,
  playReference: async () => {},
  playRecorded,
  compareWithReference,
};

beforeEach(() => {
  vi.clearAllMocks();
  recorderMock.current = { ...IDLE };
});

describe("SelfCompareRecorder — record / replay / compare-by-ear / reset", () => {
  it("renders a labelled record control (mic, keyboard-operable native button)", () => {
    render(<SelfCompareRecorder />);
    expect(screen.getByTestId("self-compare-recorder")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Thu âm giọng của bạn/i }),
    ).toBeInTheDocument();
  });

  it("shows play + reset once a recording exists, and moves focus to play-back", () => {
    recorderMock.current = { ...IDLE, lastRecordedAudioUrl: "blob:rec" };
    render(<SelfCompareRecorder />);
    expect(screen.getByTestId("self-compare-play")).toBeInTheDocument();
    expect(screen.getByTestId("self-compare-reset")).toBeInTheDocument();
    expect(screen.getByTestId("self-compare-play")).toHaveFocus();
  });

  it("returns focus to the record button after the recording is cleared", () => {
    recorderMock.current = { ...IDLE, lastRecordedAudioUrl: "blob:rec" };
    const { rerender } = render(<SelfCompareRecorder />);
    recorderMock.current = { ...IDLE, lastRecordedAudioUrl: null };
    rerender(<SelfCompareRecorder />);
    expect(screen.getByTestId("self-compare-record")).toHaveFocus();
  });

  it("shows the compare-by-ear control ONLY when a model referenceText is given", () => {
    recorderMock.current = { ...IDLE, lastRecordedAudioUrl: "blob:rec" };
    const { rerender } = render(<SelfCompareRecorder />);
    // No reference → no compare button.
    expect(screen.queryByTestId("self-compare-by-ear")).toBeNull();
    // With reference → compare button appears and calls compareWithReference.
    rerender(<SelfCompareRecorder referenceText="I bought a hat yesterday." />);
    const byEar = screen.getByTestId("self-compare-by-ear");
    expect(byEar).toBeInTheDocument();
    byEar.click();
    expect(compareWithReference).toHaveBeenCalledWith("I bought a hat yesterday.");
  });

  it("the record button triggers startRecording", () => {
    render(<SelfCompareRecorder />);
    screen.getByTestId("self-compare-record").click();
    expect(startRecording).toHaveBeenCalledTimes(1);
  });

  it("surfaces a mic-denied / unsupported message in a polite live region", () => {
    recorderMock.current = {
      ...IDLE,
      error: "Microphone access was denied in your browser.",
    };
    const { container } = render(<SelfCompareRecorder />);
    const live = container.querySelector('[aria-live="polite"]');
    expect(live).toBeTruthy();
    expect(live?.textContent).toMatch(/Microphone access was denied/i);
  });

  it("contains NO percent or score language", () => {
    recorderMock.current = { ...IDLE, lastRecordedAudioUrl: "blob:rec" };
    const { container } = render(
      <SelfCompareRecorder referenceText="hello there" />,
    );
    const text = container.textContent ?? "";
    expect(text).not.toMatch(/\d+\s*%/);
    expect(text).toMatch(/không có điểm số|không chấm điểm/i);
  });
});
