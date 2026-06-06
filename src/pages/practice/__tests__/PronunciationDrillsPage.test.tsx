import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";

import PronunciationDrillsPage from "@/pages/practice/PronunciationDrillsPage";
import { toAudioKey } from "@/lib/roomAudioResolver";
import {
  TONE_CONTRAST_EXTRA,
  TONE_CONTRAST_EXTRA_SYLLABLES,
} from "@/data/tone-drill/tone-contrast-extra";
import { VN_EN_PRONUNCIATION_DRILL_BANKS } from "@/lib/pronunciation/vnEnPronunciationDrills";

// Drive the client-side recorder deterministically (jsdom has no MediaRecorder).
// The hook is pure capture+playback; the page never scores or calls a server.
const recorderMock = vi.hoisted(() => ({ current: null as unknown as Record<string, unknown> }));
vi.mock("@/hooks/usePronunciationRecorder", () => ({
  usePronunciationRecorder: () => recorderMock.current,
}));
const IDLE_RECORDER = {
  status: "idle",
  error: null,
  audioBlob: null,
  lastRecordedAudioUrl: null,
  isPlayingReference: false,
  isPlayingRecorded: false,
  isComparing: false,
  setError: () => {},
  startRecording: async () => {},
  stopRecording: async () => {},
  reset: () => {},
  clearRecordedAudio: () => {},
  playReference: async () => {},
  playRecorded: async () => {},
  compareWithReference: async () => {},
};
beforeEach(() => {
  recorderMock.current = { ...IDLE_RECORDER };
});

describe("PronunciationDrillsPage — Lane C drill consumer is reachable", () => {
  it("renders the page with both drill sections", () => {
    render(<PronunciationDrillsPage />);
    expect(screen.getByTestId("pronunciation-drills-page")).toBeInTheDocument();
    expect(screen.getByTestId("tone-pairs-section")).toBeInTheDocument();
    expect(screen.getByTestId("vn-en-drills-section")).toBeInTheDocument();
  });

  it("imports + renders the TONE_CONTRAST_EXTRA bank (tone pairs reachable)", () => {
    render(<PronunciationDrillsPage />);
    // A representative validated syllable from the shipped bank is on screen.
    expect(screen.getAllByText("xe").length).toBeGreaterThan(0);
    expect(screen.getAllByText("của").length).toBeGreaterThan(0);
    // Every tone pair surfaces a play button per target (the 32 clips are
    // playable via TalkingFacePlayButton → useAudioUrl → room-audio bucket).
    const playButtons = screen.getAllByRole("button", { name: /Play|Audio locked|Pause/i });
    expect(playButtons.length).toBeGreaterThanOrEqual(TONE_CONTRAST_EXTRA_SYLLABLES.length);
  });

  it("imports + renders every VN_EN_PRONUNCIATION_DRILL_BANK (English drills reachable)", () => {
    render(<PronunciationDrillsPage />);
    for (const key of Object.keys(VN_EN_PRONUNCIATION_DRILL_BANKS)) {
      expect(screen.getByTestId(`vn-en-bank-${key}`)).toBeInTheDocument();
    }
    // A representative pair from the bank renders.
    expect(screen.getAllByText("this").length).toBeGreaterThan(0);
    expect(screen.getAllByText("bag").length).toBeGreaterThan(0);
  });

  it("resolves every tone target audioPath to a room-audio bucket key (tones/<ascii>.mp3)", () => {
    const BUCKET_KEY = /^tones\/[a-z0-9]+(?:-[a-z0-9]+)*\.mp3$/;
    let covered = 0;
    for (const pair of TONE_CONTRAST_EXTRA) {
      for (const target of pair.contrast) {
        const key = toAudioKey(target.audioPath);
        expect(key).toMatch(BUCKET_KEY); // ASCII, no "/audio/" prefix → bucket-safe
        covered += 1;
      }
    }
    // 32 clip paths (16 pairs × 2) all resolve to a bucket key.
    expect(covered).toBe(TONE_CONTRAST_EXTRA.length * 2);
  });
});

describe("PronunciationDrillsPage — honest self-compare (record & play back, no score)", () => {
  it("renders record + self-compare controls with honest no-score copy", () => {
    render(<PronunciationDrillsPage />);
    expect(screen.getByTestId("self-compare-recorder")).toBeInTheDocument();
    expect(screen.getByTestId("self-compare-record")).toBeInTheDocument();
    expect(screen.getByText(/Tự nghe và so sánh — không có điểm số/i)).toBeInTheDocument();
  });

  it("shows the play-your-recording control once a recording exists", () => {
    recorderMock.current = { ...IDLE_RECORDER, lastRecordedAudioUrl: "blob:fake-recording" };
    render(<PronunciationDrillsPage />);
    expect(screen.getByTestId("self-compare-play")).toBeInTheDocument();
    expect(screen.getByTestId("self-compare-reset")).toBeInTheDocument();
  });

  it("model clip play controls still render alongside the recorder", () => {
    render(<PronunciationDrillsPage />);
    const playButtons = screen.getAllByRole("button", { name: /Play|Audio locked|Pause/i });
    expect(playButtons.length).toBeGreaterThanOrEqual(TONE_CONTRAST_EXTRA_SYLLABLES.length);
  });

  it("contains NO percent or score language anywhere on the page", () => {
    recorderMock.current = { ...IDLE_RECORDER, lastRecordedAudioUrl: "blob:fake-recording" };
    const { container } = render(<PronunciationDrillsPage />);
    // Exclude <style>/<script> (the play-button embeds CSS percentages that
    // are not user-facing text).
    const clone = container.cloneNode(true) as HTMLElement;
    clone.querySelectorAll("style, script").forEach((node) => node.remove());
    const text = clone.textContent ?? "";
    expect(text).not.toMatch(/\d+\s*%/);
    // honest framing is present instead
    expect(text).toMatch(/không có điểm số|không chấm điểm/i);
  });
});

describe("PronunciationDrillsPage — accessibility (labels, live region, focus)", () => {
  it("gives each tone-clip play button a distinguishing accessible name", () => {
    render(<PronunciationDrillsPage />);
    // The shared TalkingFacePlayButton now takes an ariaLabel suffix, so the
    // accessible name carries the syllable + tone — not just a bare "Play".
    const named = screen.getByRole("button", { name: /Play:\s*xe\b.*tone/i });
    expect(named).toBeInTheDocument();
    // Still begins with the "Play" verb so generic name matchers keep working.
    expect(named.getAttribute("aria-label")).toMatch(/^Play:/);
  });

  it("labels the record / play-back / reset controls", () => {
    recorderMock.current = { ...IDLE_RECORDER, lastRecordedAudioUrl: "blob:rec" };
    render(<PronunciationDrillsPage />);
    expect(
      screen.getByRole("button", { name: /Thu âm giọng của bạn/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Nghe lại giọng vừa thu/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Xoá bản thu/i }),
    ).toBeInTheDocument();
  });

  it("announces mic errors in a polite live region", () => {
    recorderMock.current = {
      ...IDLE_RECORDER,
      error: "Microphone access was denied in your browser.",
    };
    const { container } = render(<PronunciationDrillsPage />);
    const live = container.querySelector('[aria-live="polite"]');
    expect(live).toBeTruthy();
    expect(live?.textContent).toMatch(/Microphone access was denied/i);
  });

  it("moves focus to the play-back control once a recording exists", () => {
    recorderMock.current = { ...IDLE_RECORDER, lastRecordedAudioUrl: "blob:rec" };
    render(<PronunciationDrillsPage />);
    expect(screen.getByTestId("self-compare-play")).toHaveFocus();
  });

  it("returns focus to the record button after the recording is cleared", () => {
    recorderMock.current = { ...IDLE_RECORDER, lastRecordedAudioUrl: "blob:rec" };
    const { rerender } = render(<PronunciationDrillsPage />);
    // Simulate "Thu lại" clearing the recording.
    recorderMock.current = { ...IDLE_RECORDER, lastRecordedAudioUrl: null };
    rerender(<PronunciationDrillsPage />);
    expect(screen.getByTestId("self-compare-record")).toHaveFocus();
  });
});
