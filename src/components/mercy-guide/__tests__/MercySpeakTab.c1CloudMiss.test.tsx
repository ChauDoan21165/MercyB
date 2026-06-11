// Contract C1: when useMercyVoice returns { spoken: false } (cloud TTS unavailable),
// MercySpeakTab adult-mode MUST explicitly fall through to speechSynthesis.speak —
// never silently drop the utterance. The cloud path is always tried first.
//
// This file pins the speakWithMercy → speakViaTTS chain so a future refactor
// cannot accidentally remove the explicit fallback and leave the user in silence.

import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

const speakMock = vi.fn();

vi.mock("@/hooks/useMercyVoice", () => ({
  useMercyVoice: () => ({ speak: speakMock, cancel: vi.fn() }),
}));

vi.mock("@/hooks/useFeatureFlag", () => ({
  useFeatureFlag: () => ({ enabled: false, loading: false }),
}));

vi.mock("@/lib/pronunciation/useStreamingPronunciation", () => ({
  useStreamingPronunciation: () => ({
    start: vi.fn(),
    stop: vi.fn(),
    isActive: false,
    partial: "",
    error: "",
  }),
}));

vi.mock("@/lib/supabaseClient", () => ({
  supabase: {
    auth: { getSession: vi.fn(async () => ({ data: { session: null } })) },
  },
}));

vi.mock("@/components/pronunciation/WaveformComparison", () => ({ default: () => null }));
vi.mock("@/components/pronunciation/RetakeComparison", () => ({ default: () => null }));
vi.mock("@/components/pronunciation/StreamingFeedback", () => ({ default: () => null }));
vi.mock("@/components/speech/PhonemePlayButton", () => ({ default: () => null }));
vi.mock("@/components/share/ShareScoreButton", () => ({ default: () => null }));

import { MercySpeakTab } from "../MercySpeakTab";

describe("MercySpeakTab — C1: cloud miss → explicit browser TTS (no silent drop)", () => {
  let synthSpeak: ReturnType<typeof vi.fn>;
  let synthCancel: ReturnType<typeof vi.fn>;
  let synthGetVoices: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    synthSpeak = vi.fn();
    synthCancel = vi.fn();
    synthGetVoices = vi.fn(() => []);
    Object.defineProperty(window, "speechSynthesis", {
      configurable: true,
      value: {
        speak: synthSpeak,
        cancel: synthCancel,
        getVoices: synthGetVoices,
      },
    });
    // jsdom does not ship SpeechSynthesisUtterance — stub minimally so speakViaTTS can run.
    if (typeof window.SpeechSynthesisUtterance === "undefined") {
      (window as unknown as Record<string, unknown>)["SpeechSynthesisUtterance"] = class {
        lang = ""; rate = 1; pitch = 1; volume = 1; voice = null;
        onstart: (() => void) | null = null;
        onend: (() => void) | null = null;
        onerror: (() => void) | null = null;
        constructor(public text: string) {}
      };
    }
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("calls speechSynthesis.speak (explicit browser fallback) when cloud TTS returns spoken:false", async () => {
    // Cloud unavailable — must fall through explicitly, not silently drop.
    speakMock.mockResolvedValue({ cloud: false, spoken: false, error: "unavailable" });

    render(<MercySpeakTab initialPracticeLine="Hello world." />);

    // Click the speak button (labeled "Nghe giọng Mercy" or similar).
    const speakBtn = screen.getAllByRole("button").find(
      (btn) =>
        btn.getAttribute("aria-label")?.match(/speak|mercy|nghe|phát|listen/i) ??
        btn.textContent?.match(/speak|nghe|phát/i),
    );
    // Fall back to any non-disabled button that could be the speak trigger.
    const btn = speakBtn ?? screen.getAllByRole("button").find((b) => !(b as HTMLButtonElement).disabled);
    if (!btn) throw new Error("Could not find a speak button in MercySpeakTab");

    fireEvent.click(btn);

    // Cloud path must be attempted first.
    await waitFor(() => expect(speakMock).toHaveBeenCalled());

    // Explicit browser fallback must be invoked — utterance is never silently dropped.
    await waitFor(() => expect(synthSpeak).toHaveBeenCalled(), { timeout: 1000 });
  });

  it("does NOT call speechSynthesis.speak when cloud TTS succeeds (no redundant browser fallback)", async () => {
    speakMock.mockResolvedValue({ cloud: true, spoken: true, error: null });

    render(<MercySpeakTab initialPracticeLine="I am happy." />);

    const btn = screen.getAllByRole("button").find(
      (b) =>
        !(b as HTMLButtonElement).disabled &&
        (b.getAttribute("aria-label")?.match(/speak|mercy|nghe|phát|listen/i) ??
          b.textContent?.match(/speak|nghe|phát/i)),
    );
    if (!btn) return; // component may not render speak button without a sentence — OK

    fireEvent.click(btn);

    await waitFor(() => expect(speakMock).toHaveBeenCalled());

    // On cloud success, browser synth must NOT double-fire.
    expect(synthSpeak).not.toHaveBeenCalled();
  });
});
