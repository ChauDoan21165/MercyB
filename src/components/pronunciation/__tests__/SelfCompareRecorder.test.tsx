import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";

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
const setError = vi.fn();
const callOrder: string[] = [];

const IDLE = {
  status: "idle",
  error: null,
  audioBlob: null,
  lastRecordedAudioUrl: null,
  isPlayingReference: false,
  isPlayingRecorded: false,
  isComparing: false,
  setError,
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
  callOrder.length = 0;
  playRecorded.mockImplementation(async () => {
    callOrder.push("recorded");
  });
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

  it("compare uses the onPlayModel (Mercy) path: model plays, THEN learner recording", async () => {
    const onPlayModel = vi.fn(async () => {
      callOrder.push("model");
      return true;
    });
    recorderMock.current = { ...IDLE, lastRecordedAudioUrl: "blob:rec" };
    render(
      <SelfCompareRecorder referenceText="I bought a hat." onPlayModel={onPlayModel} />,
    );
    screen.getByTestId("self-compare-by-ear").click();
    await waitFor(() => expect(callOrder).toEqual(["model", "recorded"]));
    expect(onPlayModel).toHaveBeenCalledTimes(1);
    // Uses the real model path, NOT the Web Speech fallback.
    expect(compareWithReference).not.toHaveBeenCalled();
  });

  it("compare does NOT mark the model unavailable when onPlayModel succeeds", async () => {
    const onPlayModel = vi.fn(async () => true);
    recorderMock.current = { ...IDLE, lastRecordedAudioUrl: "blob:rec" };
    render(<SelfCompareRecorder onPlayModel={onPlayModel} />);
    screen.getByTestId("self-compare-by-ear").click();
    await waitFor(() => expect(playRecorded).toHaveBeenCalled());
    // No "model unavailable" error is raised on success.
    expect(setError).not.toHaveBeenCalledWith(
      expect.stringMatching(/Could not play the model|Không phát được câu mẫu/i),
    );
  });

  it("compare shows a clear message and does NOT play learner when the model fails", async () => {
    const onPlayModel = vi.fn(async () => false);
    recorderMock.current = { ...IDLE, lastRecordedAudioUrl: "blob:rec" };
    render(<SelfCompareRecorder onPlayModel={onPlayModel} />);
    screen.getByTestId("self-compare-by-ear").click();
    await waitFor(() =>
      expect(setError).toHaveBeenCalledWith(
        expect.stringMatching(/Could not play the model sentence|Không phát được câu mẫu/i),
      ),
    );
    // No pretend comparison — the learner recording is NOT played.
    expect(callOrder).not.toContain("recorded");
    expect(playRecorded).not.toHaveBeenCalled();
  });

  it("shows the compare control when onPlayModel is supplied even without referenceText", () => {
    recorderMock.current = { ...IDLE, lastRecordedAudioUrl: "blob:rec" };
    render(<SelfCompareRecorder onPlayModel={vi.fn(async () => true)} />);
    expect(screen.getByTestId("self-compare-by-ear")).toBeInTheDocument();
  });

  it("the record button triggers startRecording", () => {
    render(<SelfCompareRecorder />);
    screen.getByTestId("self-compare-record").click();
    expect(startRecording).toHaveBeenCalledTimes(1);
  });

  it("the replay button plays ONLY the learner recording (not the compare flow)", () => {
    recorderMock.current = { ...IDLE, lastRecordedAudioUrl: "blob:rec" };
    render(<SelfCompareRecorder referenceText="I bought a hat yesterday." />);
    screen.getByTestId("self-compare-play").click();
    expect(playRecorded).toHaveBeenCalledTimes(1);
    expect(compareWithReference).not.toHaveBeenCalled();
  });

  it("uses clear, distinct labels for replay vs compare", () => {
    recorderMock.current = { ...IDLE, lastRecordedAudioUrl: "blob:rec" };
    render(<SelfCompareRecorder referenceText="I bought a hat yesterday." />);
    const replay = screen.getByTestId("self-compare-play");
    const compare = screen.getByTestId("self-compare-by-ear");
    expect(replay).toHaveTextContent(/Nghe bản thu của bạn/);
    expect(compare).toHaveTextContent(/Nghe mẫu rồi nghe bạn/);
    // The two labels are distinct (the original bug had them read alike).
    expect(replay.textContent).not.toEqual(compare.textContent);
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
