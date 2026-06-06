import { describe, it, expect, vi, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";

import { usePronunciationRecorder } from "@/hooks/usePronunciationRecorder";

/**
 * Device-failure regression locks for the pronunciation recorder.
 *
 * The hook is the device path behind /practice/pronunciation's self-compare
 * recorder. These tests pin the GRACEFUL behavior — a clear user message and a
 * reset-to-idle status, never a silent hang or a dead button — so the mobile
 * failure paths cannot silently regress. No score, no percent, no server call.
 */

function setMediaDevices(getUserMedia: unknown) {
  Object.defineProperty(navigator, "mediaDevices", {
    value: getUserMedia ? { getUserMedia } : undefined,
    configurable: true,
  });
}

function setPermissions(query: unknown) {
  Object.defineProperty(navigator, "permissions", {
    value: query ? { query } : undefined,
    configurable: true,
  });
}

afterEach(() => {
  setMediaDevices(undefined);
  setPermissions(undefined);
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("usePronunciationRecorder — device failure paths degrade gracefully", () => {
  it("surfaces a friendly 'not supported' message when recording APIs are missing", async () => {
    // jsdom has no mediaDevices / MediaRecorder by default.
    const { result } = renderHook(() => usePronunciationRecorder());

    await act(async () => {
      await result.current.startRecording();
    });

    expect(result.current.status).toBe("idle");
    expect(result.current.error).toMatch(/not supported in this browser/i);
  });

  it("surfaces a friendly mic-denied message when getUserMedia is blocked", async () => {
    const getUserMedia = vi
      .fn()
      .mockRejectedValue(new DOMException("denied", "NotAllowedError"));
    setMediaDevices(getUserMedia);
    vi.stubGlobal(
      "MediaRecorder",
      class {
        static isTypeSupported() {
          return false;
        }
      },
    );

    const { result } = renderHook(() => usePronunciationRecorder());

    await act(async () => {
      await result.current.startRecording();
    });

    expect(getUserMedia).toHaveBeenCalled();
    expect(result.current.status).toBe("idle");
    expect(result.current.error).toMatch(/microphone access was denied/i);
  });

  it("blocks early with a clear message when the mic permission is already denied", async () => {
    const getUserMedia = vi.fn();
    setMediaDevices(getUserMedia);
    setPermissions(vi.fn().mockResolvedValue({ state: "denied" }));
    vi.stubGlobal(
      "MediaRecorder",
      class {
        static isTypeSupported() {
          return false;
        }
      },
    );

    const { result } = renderHook(() => usePronunciationRecorder());

    await act(async () => {
      await result.current.startRecording();
    });

    // Never even prompts getUserMedia — fails closed with a message.
    expect(getUserMedia).not.toHaveBeenCalled();
    expect(result.current.status).toBe("idle");
    expect(result.current.error).toMatch(/blocked in your browser/i);
  });

  it("reports when there is no recorded audio to play back", async () => {
    const { result } = renderHook(() => usePronunciationRecorder());

    await act(async () => {
      await result.current.playRecorded();
    });

    expect(result.current.error).toMatch(/no recorded audio/i);
  });

  it("reports when reference playback is unsupported (no speechSynthesis)", async () => {
    // jsdom has no speechSynthesis; playReference must message, not hang.
    const { result } = renderHook(() => usePronunciationRecorder());

    await act(async () => {
      await result.current.playReference("hello");
    });

    expect(result.current.error).toMatch(/not supported in this browser/i);
    expect(result.current.isPlayingReference).toBe(false);
  });
});
