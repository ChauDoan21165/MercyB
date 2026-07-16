import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../musicTracks", () => ({
  MUSIC_TRACKS: [
    { id: "quiet-room", title: "Quiet Room", file: "quiet-room.mp3" },
    { id: "morning", title: "Morning", file: "morning.mp3" },
  ],
}));

vi.mock("@/lib/musicAudioUrl", () => ({
  getPublicAudioUrl: (file: string) => `https://audio.test/${file}`,
}));

import BottomMusicBar from "../BottomMusicBar";

class FakeAudio {
  static instances: FakeAudio[] = [];
  preload = "";
  playsInline = false;
  loop = false;
  paused = true;
  currentTime = 0;
  duration = 0;
  currentSrc = "";
  private srcValue = "";

  constructor() {
    FakeAudio.instances.push(this);
  }

  get src() {
    return this.srcValue;
  }

  set src(value: string) {
    this.srcValue = value;
    this.currentSrc = value;
  }

  addEventListener = vi.fn();
  removeEventListener = vi.fn();
  load = vi.fn();
  pause = vi.fn(() => {
    this.paused = true;
  });
  play = vi.fn(async () => {
    this.paused = false;
  });
  removeAttribute = vi.fn((name: string) => {
    if (name === "src") {
      this.src = "";
    }
  });
}

describe("BottomMusicBar audio loading", () => {
  beforeEach(() => {
    localStorage.clear();
    FakeAudio.instances = [];
    delete window.__mbBottomAudio;
    delete window.__mbBottomEndedBound;
    vi.stubGlobal("Audio", FakeAudio);
  });

  it("does not assign an audio URL until the learner presses play", async () => {
    const user = userEvent.setup();
    render(<BottomMusicBar />);

    const audio = FakeAudio.instances[0];
    expect(audio).toBeDefined();
    expect(audio.preload).toBe("none");
    expect(audio.src).toBe("");

    await user.selectOptions(screen.getByLabelText("Select track"), "morning");
    expect(audio.src).toBe("");

    await user.click(screen.getByRole("button", { name: "Play" }));
    expect(audio.src).toBe("https://audio.test/morning.mp3");
    expect(audio.play).toHaveBeenCalledTimes(1);
  });
});
