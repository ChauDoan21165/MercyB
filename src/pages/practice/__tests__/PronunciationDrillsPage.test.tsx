import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";

import PronunciationDrillsPage from "@/pages/practice/PronunciationDrillsPage";
import { toAudioKey } from "@/lib/roomAudioResolver";
import {
  TONE_CONTRAST_EXTRA,
  TONE_CONTRAST_EXTRA_SYLLABLES,
} from "@/data/tone-drill/tone-contrast-extra";
import { VN_EN_PRONUNCIATION_DRILL_BANKS } from "@/lib/pronunciation/vnEnPronunciationDrills";

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
