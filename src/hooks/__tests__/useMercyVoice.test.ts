// Contract C1 guard for useMercyVoice: cloud success speaks; every failure path
// reports `{ spoken: false, error }` and NEVER silently falls back to a browser
// voice. Mirrors the engine contract in useTtsSpeaker / voiceEngine.

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { renderHook } from "@testing-library/react";

import { useMercyVoice } from "@/hooks/useMercyVoice";
import { fetchCloudTtsUrl } from "@/lib/mercyVoice";

vi.mock("@/lib/mercyVoice", () => ({
  fetchCloudTtsUrl: vi.fn(),
}));

const fetchCloudTtsUrlMock = vi.mocked(fetchCloudTtsUrl);

// Minimal HTMLAudioElement stand-in; `behavior` decides how playback resolves.
function stubAudio(behavior: "play" | "playError" | "elementError") {
  class FakeAudio {
    src: string;
    onended: (() => void) | null = null;
    onerror: (() => void) | null = null;
    paused = false;
    constructor(src?: string) {
      this.src = src ?? "";
    }
    pause() {
      this.paused = true;
    }
    play() {
      if (behavior === "playError") return Promise.reject(new Error("play rejected"));
      if (behavior === "elementError") {
        queueMicrotask(() => this.onerror?.());
        return Promise.resolve();
      }
      queueMicrotask(() => this.onended?.());
      return Promise.resolve();
    }
  }
  // @ts-expect-error test shim
  globalThis.Audio = FakeAudio;
}

describe("useMercyVoice — Contract C1: no silent browser fallback", () => {
  let speechSpeak: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    speechSpeak = vi.fn();
    // If the hook ever touched speechSynthesis we'd catch it here.
    Object.defineProperty(window, "speechSynthesis", {
      configurable: true,
      value: { speak: speechSpeak, cancel: vi.fn(), resume: vi.fn(), getVoices: () => [] },
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("speaks via cloud and reports spoken:true, no error", async () => {
    fetchCloudTtsUrlMock.mockResolvedValue({ audioUrl: "https://x/a.mp3", cached: true, provider: "elevenlabs" });
    stubAudio("play");

    const { result } = renderHook(() => useMercyVoice());
    const browserFallback = vi.fn();
    const res = await result.current.speak({ text: "hello", language: "en", browserFallback });

    expect(res).toMatchObject({ cloud: true, cached: true, spoken: true, error: null });
    expect(browserFallback).not.toHaveBeenCalled();
    expect(speechSpeak).not.toHaveBeenCalled();
  });

  it("when cloud is unavailable, reports an error and does NOT browser-fallback", async () => {
    fetchCloudTtsUrlMock.mockResolvedValue(null);
    stubAudio("play");

    const { result } = renderHook(() => useMercyVoice());
    const browserFallback = vi.fn();
    const res = await result.current.speak({ text: "xin chào", language: "vi", browserFallback });

    expect(res.spoken).toBe(false);
    expect(res.cloud).toBe(false);
    expect(res.error).toBeTruthy();
    expect(browserFallback).not.toHaveBeenCalled();
    expect(speechSpeak).not.toHaveBeenCalled();
  });

  it("when cloud playback rejects, reports an error and does NOT browser-fallback", async () => {
    fetchCloudTtsUrlMock.mockResolvedValue({ audioUrl: "https://x/a.mp3", cached: false });
    stubAudio("playError");

    const { result } = renderHook(() => useMercyVoice());
    const browserFallback = vi.fn();
    const res = await result.current.speak({ text: "hello", language: "en", browserFallback });

    expect(res.spoken).toBe(false);
    expect(res.error).toBeTruthy();
    expect(browserFallback).not.toHaveBeenCalled();
    expect(speechSpeak).not.toHaveBeenCalled();
  });

  it("empty text is a no-op with no error and no speech", async () => {
    const { result } = renderHook(() => useMercyVoice());
    const res = await result.current.speak({ text: "   ", language: "en", browserFallback: vi.fn() });

    expect(res).toMatchObject({ cloud: false, spoken: false, error: null });
    expect(fetchCloudTtsUrlMock).not.toHaveBeenCalled();
  });
});
