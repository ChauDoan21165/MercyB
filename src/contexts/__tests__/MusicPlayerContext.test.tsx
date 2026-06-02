import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";

// Resolve every key to a deterministic local URL (no network).
vi.mock("@/lib/roomAudioResolver", () => ({
  resolveRoomAudioUrl: vi.fn(async (name: string) => ({
    url: `/resolved/${name}`,
    fallback: false,
  })),
}));

import { resolveRoomAudioUrl } from "@/lib/roomAudioResolver";
import {
  MusicPlayerProvider,
  useMusicPlayer,
} from "@/contexts/MusicPlayerContext";

const resolveMock = vi.mocked(resolveRoomAudioUrl);

// --- Fake HTMLAudioElement so play()/pause() never touch jsdom audio. ---
type FakeAudio = {
  src: string;
  preload: string;
  currentTime: number;
  paused: boolean;
  onplay: (() => void) | null;
  onended: (() => void) | null;
  onerror: (() => void) | null;
  play: () => Promise<void>;
  pause: () => void;
};

let lastAudio: FakeAudio | null = null;
const createdAudios: FakeAudio[] = [];
let playShouldReject = false;

function installAudioMock() {
  lastAudio = null;
  createdAudios.length = 0;
  playShouldReject = false;

  class AudioStub {
    src: string;
    preload = "";
    currentTime = 0;
    paused = true;
    onplay: (() => void) | null = null;
    onended: (() => void) | null = null;
    onerror: (() => void) | null = null;

    constructor(src?: string) {
      this.src = src ?? "";
      lastAudio = this as unknown as FakeAudio;
      createdAudios.push(this as unknown as FakeAudio);
    }

    async play() {
      if (playShouldReject) {
        throw new Error("autoplay blocked");
      }
      this.paused = false;
      this.onplay?.();
    }

    pause() {
      this.paused = true;
    }
  }

  vi.stubGlobal("Audio", AudioStub as unknown as typeof Audio);
}

function wrapper({ children }: { children: ReactNode }) {
  return <MusicPlayerProvider>{children}</MusicPlayerProvider>;
}

describe("MusicPlayerContext", () => {
  beforeEach(() => {
    installAudioMock();
    resolveMock.mockClear();
    resolveMock.mockImplementation(async (name) => ({
      url: `/resolved/${name}`,
      fallback: false,
    }));
  });

  it("throws when useMusicPlayer is used outside the provider", () => {
    expect(() => renderHook(() => useMusicPlayer())).toThrow(
      /must be used within a MusicPlayerProvider/,
    );
  });

  it("exposes a signed-out-like initial state", () => {
    const { result } = renderHook(() => useMusicPlayer(), { wrapper });
    expect(result.current.isPlaying).toBe(false);
    expect(result.current.currentTrackName).toBeUndefined();
  });

  it("play() resolves the key, creates an Audio for the resolved URL, and starts playback", async () => {
    const { result } = renderHook(() => useMusicPlayer(), { wrapper });

    await act(async () => {
      await result.current.play("song.mp3");
    });

    expect(resolveMock).toHaveBeenCalledWith("song.mp3");
    expect(lastAudio?.src).toBe("/resolved/song.mp3");
    await waitFor(() => expect(result.current.isPlaying).toBe(true));
    expect(result.current.currentTrackName).toBe("song.mp3");
  });

  it("ignores empty/whitespace track names without resolving", async () => {
    const { result } = renderHook(() => useMusicPlayer(), { wrapper });

    await act(async () => {
      await result.current.play("   ");
    });

    expect(resolveMock).not.toHaveBeenCalled();
    expect(result.current.isPlaying).toBe(false);
  });

  it("stop() pauses and clears track ownership", async () => {
    const { result } = renderHook(() => useMusicPlayer(), { wrapper });

    await act(async () => {
      await result.current.play("song.mp3");
    });
    await waitFor(() => expect(result.current.isPlaying).toBe(true));
    const playedAudio = lastAudio!;

    act(() => result.current.stop());

    expect(playedAudio.paused).toBe(true);
    expect(result.current.isPlaying).toBe(false);
    expect(result.current.currentTrackName).toBeUndefined();
  });

  it("onended resets playing state and current track", async () => {
    const { result } = renderHook(() => useMusicPlayer(), { wrapper });

    await act(async () => {
      await result.current.play("song.mp3");
    });
    await waitFor(() => expect(result.current.isPlaying).toBe(true));

    act(() => lastAudio?.onended?.());

    expect(result.current.isPlaying).toBe(false);
    expect(result.current.currentTrackName).toBeUndefined();
  });

  it("stops the previous track before starting a new one (single-owner rule)", async () => {
    const { result } = renderHook(() => useMusicPlayer(), { wrapper });

    await act(async () => {
      await result.current.play("first.mp3");
    });
    const firstAudio = lastAudio!;
    await waitFor(() => expect(result.current.isPlaying).toBe(true));

    await act(async () => {
      await result.current.play("second.mp3");
    });

    expect(firstAudio.paused).toBe(true);
    expect(createdAudios.length).toBe(2);
    expect(result.current.currentTrackName).toBe("second.mp3");
  });

  it("recovers gracefully when play() is rejected by autoplay policy", async () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    playShouldReject = true;

    const { result } = renderHook(() => useMusicPlayer(), { wrapper });

    await act(async () => {
      await result.current.play("blocked.mp3");
    });

    expect(result.current.isPlaying).toBe(false);
    expect(result.current.currentTrackName).toBeUndefined();
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining("play() rejected"),
      expect.anything(),
      expect.anything(),
    );
    warnSpy.mockRestore();
  });
});
