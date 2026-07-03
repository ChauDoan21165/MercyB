// Path: src/components/room/__tests__/activeEntryAudioPlayback.test.tsx
//
// Smoke test for the audio path a keyword click takes after the
// audio-private dead-code removal (PR: drop getSignedAudio pre-resolve).
//
// Before: RoomRenderer pre-resolved entry audio through getSignedAudio()
// (wrong `audio-private` bucket — always failed), then OVERRODE the entry's
// audio_url/audio_en/audio with the (empty) result before passing it to
// <ActiveEntry>. After: RoomRenderer passes the raw activeEntry straight to
// <ActiveEntry>, which derives canonical keys via pickAudioList and renders a
// <TalkingFacePlayButton> per clip — the canonical resolveRoomAudioUrl path.
//
// This test pins that contract: a keyword-selected entry's OWN audio field
// must reach a play control as a canonical key, with no override in between.

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

// Stub the audio player so we assert on the `src` it receives (the canonical
// key) without pulling in useAudioUrl / Supabase / HTMLMediaElement.
vi.mock("@/components/audio/TalkingFacePlayButton", () => ({
  default: ({ src, label }: { src: string; label?: string }) => (
    <button type="button" data-testid="play" data-src={src}>
      {label}
    </button>
  ),
}));

import { ActiveEntry } from "@/components/room/RoomRendererUI";

const baseProps = { index: 0, enKeywords: [], viKeywords: [] };

function srcs(): string[] {
  return screen
    .queryAllByTestId("play")
    .map((el) => el.getAttribute("data-src") || "");
}

describe("ActiveEntry — keyword-click audio playback (post getSignedAudio removal)", () => {
  it("a single-audio entry reaches one play control with the entry's canonical key", () => {
    render(
      <ActiveEntry
        {...baseProps}
        entry={{
          id: "stress-relief-breathing",
          copy: { en: "Breathe.", vi: "Hít thở." },
          audio: "stress_free_breathing.mp3",
        }}
      />,
    );
    expect(srcs()).toEqual(["stress_free_breathing.mp3"]);
  });

  it("a prefixed audio path is normalized to the canonical key (no override layer)", () => {
    render(
      <ActiveEntry
        {...baseProps}
        entry={{ id: "x", copy: { en: "a", vi: "b" }, audio: "audio/gwu_free_2_en.mp3" }}
      />,
    );
    // toAudioKey strips the `audio/` prefix — this is exactly the key the
    // canonical resolveRoomAudioUrl path expects.
    expect(srcs()).toEqual(["gwu_free_2_en.mp3"]);
  });

  it('a multi-file "combined" entry splits into one play control per clip', () => {
    render(
      <ActiveEntry
        {...baseProps}
        entry={{
          id: "all",
          copy: { en: "All.", vi: "Tất cả." },
          audio: "gwu_free_1_en.mp3 gwu_free_2_en.mp3 gwu_free_3_en.mp3",
        }}
      />,
    );
    expect(srcs()).toEqual([
      "gwu_free_1_en.mp3",
      "gwu_free_2_en.mp3",
      "gwu_free_3_en.mp3",
    ]);
  });

  it("an entry with no audio field renders no play control (no crash, no fake bar)", () => {
    render(
      <ActiveEntry
        {...baseProps}
        entry={{ id: "noaudio", copy: { en: "text only", vi: "chỉ chữ" } }}
      />,
    );
    expect(srcs()).toEqual([]);
  });

  it("an entry with a blank audio_url renders no play control", () => {
    render(
      <ActiveEntry
        {...baseProps}
        entry={{ id: "blank-audio", copy: { en: "text only", vi: "chỉ chữ" }, audio_url: "   " }}
      />,
    );
    expect(srcs()).toEqual([]);
  });

  it("an entry with malformed audio object and no URL renders no play control", () => {
    render(
      <ActiveEntry
        {...baseProps}
        entry={{ id: "bad-audio", copy: { en: "text only", vi: "chỉ chữ" }, audio: { label: "missing url" } }}
      />,
    );
    expect(srcs()).toEqual([]);
  });
});
