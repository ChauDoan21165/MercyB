import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";

import { usePronunciationRecorder } from "@/hooks/usePronunciationRecorder";

/**
 * Compare-by-ear contract for the Speak self-compare recorder.
 *
 * The bug: the compare button played the model THEN always played the learner
 * recording, even when the model never actually spoke — so the learner only
 * ever heard themselves and could not compare. These tests pin the fixed
 * contract:
 *   - compare plays the MODEL sentence before the learner recording, and
 *   - when the model cannot play, compare does NOT fall through to learner-only;
 *     it surfaces a clear message instead (no pretend comparison).
 *
 * No score, no percent, no ML — pure ordering + honesty of playback.
 */

const playOrder: string[] = [];

class FakeMediaRecorder {
  state = "inactive";
  mimeType = "audio/webm";
  ondataavailable: ((e: { data: Blob }) => void) | null = null;
  onstop: (() => void) | null = null;
  onerror: (() => void) | null = null;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(_stream?: unknown) {}
  start() {
    this.state = "recording";
  }
  stop() {
    this.state = "inactive";
    this.ondataavailable?.({ data: new Blob(["x"], { type: "audio/webm" }) });
    this.onstop?.();
  }
  static isTypeSupported() {
    return true;
  }
}

class FakeAudio {
  src: string;
  paused = true;
  currentTime = 0;
  onplay: (() => void) | null = null;
  onended: (() => void) | null = null;
  onerror: (() => void) | null = null;
  constructor(src = "") {
    this.src = src;
  }
  play() {
    this.paused = false;
    playOrder.push("recorded");
    this.onplay?.();
    void Promise.resolve().then(() => this.onended?.());
    return Promise.resolve();
  }
  pause() {
    this.paused = true;
  }
}

class FakeUtterance {
  text: string;
  lang = "";
  rate = 1;
  onstart: (() => void) | null = null;
  onend: (() => void) | null = null;
  onerror: (() => void) | null = null;
  constructor(text: string) {
    this.text = text;
  }
}

function setSpeechSynthesis(mode: "ok" | "absent") {
  if (mode === "absent") {
    Object.defineProperty(window, "speechSynthesis", {
      value: undefined,
      configurable: true,
    });
    return;
  }
  Object.defineProperty(window, "speechSynthesis", {
    value: {
      cancel() {},
      speak(u: FakeUtterance) {
        playOrder.push("model");
        void Promise.resolve().then(() => {
          u.onstart?.();
          u.onend?.();
        });
      },
    },
    configurable: true,
  });
}

async function recordOnce(result: { current: ReturnType<typeof usePronunciationRecorder> }) {
  await act(async () => {
    await result.current.startRecording();
  });
  await act(async () => {
    await result.current.stopRecording();
  });
}

beforeEach(() => {
  playOrder.length = 0;
  vi.stubGlobal("MediaRecorder", FakeMediaRecorder);
  vi.stubGlobal("Audio", FakeAudio);
  vi.stubGlobal("SpeechSynthesisUtterance", FakeUtterance);
  Object.defineProperty(navigator, "mediaDevices", {
    value: {
      getUserMedia: vi.fn().mockResolvedValue({ getTracks: () => [{ stop() {} }] }),
    },
    configurable: true,
  });
  // jsdom has no URL.createObjectURL — define them so the record cycle can
  // mint a blob URL.
  (URL as unknown as { createObjectURL: () => string }).createObjectURL = () =>
    "blob:fake";
  (URL as unknown as { revokeObjectURL: () => void }).revokeObjectURL = () => {};
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  Object.defineProperty(navigator, "mediaDevices", { value: undefined, configurable: true });
  Object.defineProperty(window, "speechSynthesis", { value: undefined, configurable: true });
});

describe("usePronunciationRecorder — compare-by-ear plays model before learner", () => {
  it("plays the MODEL sentence first, then the learner recording", async () => {
    setSpeechSynthesis("ok");
    const { result } = renderHook(() => usePronunciationRecorder());
    await recordOnce(result);
    expect(result.current.lastRecordedAudioUrl).toBe("blob:fake");

    await act(async () => {
      await result.current.compareWithReference("hello there", 1, 0);
    });

    expect(playOrder).toEqual(["model", "recorded"]);
    expect(result.current.error).toBeNull();
  });

  it("does NOT fall back to learner-only when the model cannot play", async () => {
    setSpeechSynthesis("absent"); // no speechSynthesis → model unavailable
    const { result } = renderHook(() => usePronunciationRecorder());
    await recordOnce(result);

    await act(async () => {
      await result.current.compareWithReference("hello there", 1, 0);
    });

    // The learner recording must NOT play — no pretend comparison.
    expect(playOrder).not.toContain("recorded");
    expect(playOrder).not.toContain("model");
    // Clear message instead.
    expect(result.current.error ?? "").toMatch(
      /so sánh|câu mẫu|model sentence|comparison did not run/i,
    );
  });

  it("playReference reports false when speech synthesis is unavailable", async () => {
    setSpeechSynthesis("absent");
    const { result } = renderHook(() => usePronunciationRecorder());
    let spoke: boolean | undefined;
    await act(async () => {
      spoke = await result.current.playReference("hello");
    });
    expect(spoke).toBe(false);
  });

  it("playReference reports true when the model actually speaks", async () => {
    setSpeechSynthesis("ok");
    const { result } = renderHook(() => usePronunciationRecorder());
    let spoke: boolean | undefined;
    await act(async () => {
      spoke = await result.current.playReference("hello");
    });
    expect(spoke).toBe(true);
  });
});
