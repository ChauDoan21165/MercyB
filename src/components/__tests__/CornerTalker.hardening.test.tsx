/**
 * Hardening unit tests for src/components/CornerTalker.tsx
 *
 * CornerTalker exposes a single public export: the `CornerTalker` component.
 * The `toFilename` helper and the `CornerTalkerProps` interface are internal /
 * type-only, so they cannot be imported at runtime — their behavior is
 * exercised indirectly through the component (e.g. by asserting on the
 * filename passed to the mocked MusicPlayer `play`).
 *
 * The only external dependency is the MusicPlayer context
 * (`@/contexts/MusicPlayerContext`), which we mock so the tests are fully
 * deterministic and never touch real audio / Supabase.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";

// --- Mock the MusicPlayer context -------------------------------------------

const play = vi.fn<(file: string) => Promise<void>>(() => Promise.resolve());
const stop = vi.fn<() => void>();

// Mutable state the mocked hook returns; reset before every test.
let mockState: {
  isPlaying: boolean;
  currentTrackName?: string;
};

vi.mock("@/contexts/MusicPlayerContext", () => ({
  useMusicPlayer: () => ({
    isPlaying: mockState.isPlaying,
    currentTrackName: mockState.currentTrackName,
    play,
    stop,
  }),
}));

// Import AFTER the mock is registered.
import { CornerTalker } from "@/components/CornerTalker";

// --- Helpers ----------------------------------------------------------------

const getToggleButton = () =>
  screen.getByRole("button", { name: /guide audio/i });

const getBlobButton = () =>
  screen.getByRole("button", { name: /play room introduction/i });

beforeEach(() => {
  mockState = { isPlaying: false, currentTrackName: undefined };
  play.mockClear();
  stop.mockClear();
  // setup.ts installs fresh in-memory storage and clearMocks is on, but be
  // explicit so each test starts from a known storage state.
  window.localStorage.clear();
  window.sessionStorage.clear();
});

afterEach(() => {
  cleanup();
});

// --- Rendering --------------------------------------------------------------

describe("CornerTalker — rendering", () => {
  it("renders both the toggle and the blob buttons", () => {
    render(<CornerTalker roomId="room-1" introAudioEn="alexander_v1_2_en.mp3" />);
    expect(getToggleButton()).toBeInTheDocument();
    expect(getBlobButton()).toBeInTheDocument();
  });

  it("starts enabled by default (Volume2 / 'Disable guide audio' label)", () => {
    render(<CornerTalker roomId="room-1" introAudioEn="a_en.mp3" />);
    expect(
      screen.getByRole("button", { name: "Disable guide audio" }),
    ).toBeInTheDocument();
  });

  it("renders even when no audio props are provided", () => {
    render(<CornerTalker roomId="room-no-audio" />);
    expect(getToggleButton()).toBeInTheDocument();
    expect(getBlobButton()).toBeInTheDocument();
  });

  it("disables the blob button when there is no audio", () => {
    render(<CornerTalker roomId="room-no-audio" />);
    expect(getBlobButton()).toBeDisabled();
  });

  it("enables the blob button when audio is available", () => {
    render(<CornerTalker roomId="room-1" introAudioEn="a_en.mp3" />);
    expect(getBlobButton()).toBeEnabled();
  });
});

// --- localStorage preference (mount) ---------------------------------------

describe("CornerTalker — stored preference on mount", () => {
  it("starts disabled when localStorage 'mb_talker_enabled' is 'false'", () => {
    window.localStorage.setItem("mb_talker_enabled", "false");
    render(<CornerTalker roomId="room-1" introAudioEn="a_en.mp3" />);
    expect(
      screen.getByRole("button", { name: "Enable guide audio" }),
    ).toBeInTheDocument();
    // Disabled preference also disables the blob.
    expect(getBlobButton()).toBeDisabled();
  });

  it("stays enabled for any stored value other than the literal 'false'", () => {
    window.localStorage.setItem("mb_talker_enabled", "true");
    render(<CornerTalker roomId="room-1" introAudioEn="a_en.mp3" />);
    expect(
      screen.getByRole("button", { name: "Disable guide audio" }),
    ).toBeInTheDocument();
  });

  it("stays enabled when nothing is stored", () => {
    render(<CornerTalker roomId="room-1" introAudioEn="a_en.mp3" />);
    expect(
      screen.getByRole("button", { name: "Disable guide audio" }),
    ).toBeInTheDocument();
  });
});

// --- Toggle behavior --------------------------------------------------------

describe("CornerTalker — toggle button", () => {
  it("toggles enabled -> disabled, persists 'false', and stops playback", () => {
    render(<CornerTalker roomId="room-1" introAudioEn="a_en.mp3" />);

    fireEvent.click(getToggleButton());

    expect(window.localStorage.getItem("mb_talker_enabled")).toBe("false");
    expect(stop).toHaveBeenCalledTimes(1);
    expect(
      screen.getByRole("button", { name: "Enable guide audio" }),
    ).toBeInTheDocument();
    expect(getBlobButton()).toBeDisabled();
  });

  it("toggles disabled -> enabled, persists 'true', and does NOT stop playback", () => {
    window.localStorage.setItem("mb_talker_enabled", "false");
    render(<CornerTalker roomId="room-1" introAudioEn="a_en.mp3" />);

    fireEvent.click(getToggleButton());

    expect(window.localStorage.getItem("mb_talker_enabled")).toBe("true");
    expect(stop).not.toHaveBeenCalled();
    expect(
      screen.getByRole("button", { name: "Disable guide audio" }),
    ).toBeInTheDocument();
    expect(getBlobButton()).toBeEnabled();
  });

  it("stops click propagation so the toggle does not bubble to parents", () => {
    const parentClick = vi.fn();
    render(
      <div onClick={parentClick}>
        <CornerTalker roomId="room-1" introAudioEn="a_en.mp3" />
      </div>,
    );

    fireEvent.click(getToggleButton());
    expect(parentClick).not.toHaveBeenCalled();
  });
});

// --- Blob click: play / stop ------------------------------------------------

describe("CornerTalker — blob click playback", () => {
  it("plays the primary (EN-preferred) filename on click", () => {
    render(
      <CornerTalker
        roomId="room-1"
        introAudioEn="alexander_v1_2_en.mp3"
        introAudioVi="alexander_v1_2_vi.mp3"
      />,
    );

    fireEvent.click(getBlobButton());

    expect(play).toHaveBeenCalledTimes(1);
    expect(play).toHaveBeenCalledWith("alexander_v1_2_en.mp3");
  });

  it("falls back to the VI filename when EN is absent", () => {
    render(<CornerTalker roomId="room-1" introAudioVi="alexander_v1_2_vi.mp3" />);

    fireEvent.click(getBlobButton());

    expect(play).toHaveBeenCalledWith("alexander_v1_2_vi.mp3");
  });

  it("stops (does not replay) when its own track is already playing", () => {
    mockState = { isPlaying: true, currentTrackName: "a_en.mp3" };
    render(<CornerTalker roomId="room-1" introAudioEn="a_en.mp3" />);

    fireEvent.click(getBlobButton());

    expect(stop).toHaveBeenCalledTimes(1);
    expect(play).not.toHaveBeenCalled();
  });

  it("plays when a DIFFERENT track is currently playing", () => {
    mockState = { isPlaying: true, currentTrackName: "some_other.mp3" };
    render(<CornerTalker roomId="room-1" introAudioEn="a_en.mp3" />);

    fireEvent.click(getBlobButton());

    expect(play).toHaveBeenCalledWith("a_en.mp3");
    expect(stop).not.toHaveBeenCalled();
  });

  it("does nothing when there is no audio (guard on click)", () => {
    render(<CornerTalker roomId="room-1" />);

    // Button is disabled, but invoke the handler path defensively.
    fireEvent.click(getBlobButton());

    expect(play).not.toHaveBeenCalled();
    expect(stop).not.toHaveBeenCalled();
  });

  it("does nothing on blob click while disabled", () => {
    window.localStorage.setItem("mb_talker_enabled", "false");
    render(<CornerTalker roomId="room-1" introAudioEn="a_en.mp3" />);

    fireEvent.click(getBlobButton());

    expect(play).not.toHaveBeenCalled();
  });
});

// --- Filename normalization (toFilename via play arg) -----------------------

describe("CornerTalker — filename normalization", () => {
  it("strips a leading '/audio/' path", () => {
    render(<CornerTalker roomId="r" introAudioEn="/audio/alexander_v1_2_en.mp3" />);
    fireEvent.click(getBlobButton());
    expect(play).toHaveBeenCalledWith("alexander_v1_2_en.mp3");
  });

  it("strips a relative 'audio/' path", () => {
    render(<CornerTalker roomId="r" introAudioEn="audio/alexander_v1_2_en.mp3" />);
    fireEvent.click(getBlobButton());
    expect(play).toHaveBeenCalledWith("alexander_v1_2_en.mp3");
  });

  it("strips a query string", () => {
    render(<CornerTalker roomId="r" introAudioEn="a_en.mp3?token=abc&v=2" />);
    fireEvent.click(getBlobButton());
    expect(play).toHaveBeenCalledWith("a_en.mp3");
  });

  it("strips a hash fragment", () => {
    render(<CornerTalker roomId="r" introAudioEn="a_en.mp3#frag" />);
    fireEvent.click(getBlobButton());
    expect(play).toHaveBeenCalledWith("a_en.mp3");
  });

  it("strips both a deep path and a query string", () => {
    render(
      <CornerTalker roomId="r" introAudioEn="https://cdn.x/y/z/a_en.mp3?sig=1" />,
    );
    fireEvent.click(getBlobButton());
    expect(play).toHaveBeenCalledWith("a_en.mp3");
  });

  it("trims surrounding whitespace from the input", () => {
    render(<CornerTalker roomId="r" introAudioEn="   a_en.mp3   " />);
    fireEvent.click(getBlobButton());
    expect(play).toHaveBeenCalledWith("a_en.mp3");
  });

  it("treats a whitespace-only EN prop as no audio (blob disabled, VI ignored-as-primary fallback)", () => {
    render(<CornerTalker roomId="r" introAudioEn="   " introAudioVi="b_vi.mp3" />);
    // Empty EN -> primary falls through to VI.
    fireEvent.click(getBlobButton());
    expect(play).toHaveBeenCalledWith("b_vi.mp3");
  });

  it("disables the blob when both props are whitespace-only", () => {
    render(<CornerTalker roomId="r" introAudioEn="   " introAudioVi="  " />);
    expect(getBlobButton()).toBeDisabled();
  });

  it("treats a trailing-slash path (no filename) as no audio", () => {
    render(<CornerTalker roomId="r" introAudioEn="/audio/" />);
    expect(getBlobButton()).toBeDisabled();
  });
});

// --- sessionStorage "played" marker -----------------------------------------

describe("CornerTalker — session 'played' marker", () => {
  it("marks the room as played on the first blob click", () => {
    render(<CornerTalker roomId="room-42" introAudioEn="a_en.mp3" />);

    expect(window.sessionStorage.getItem("mb_talker_intro_played_room-42")).toBeNull();

    fireEvent.click(getBlobButton());

    expect(window.sessionStorage.getItem("mb_talker_intro_played_room-42")).toBe(
      "yes",
    );
  });

  it("keys the marker by roomId", () => {
    render(<CornerTalker roomId="abc" introAudioEn="a_en.mp3" />);
    fireEvent.click(getBlobButton());

    expect(window.sessionStorage.getItem("mb_talker_intro_played_abc")).toBe("yes");
    expect(window.sessionStorage.getItem("mb_talker_intro_played_xyz")).toBeNull();
  });

  it("does not overwrite an already-set marker, and still plays", () => {
    window.sessionStorage.setItem("mb_talker_intro_played_room-42", "yes");
    render(<CornerTalker roomId="room-42" introAudioEn="a_en.mp3" />);

    fireEvent.click(getBlobButton());

    expect(window.sessionStorage.getItem("mb_talker_intro_played_room-42")).toBe(
      "yes",
    );
    expect(play).toHaveBeenCalledWith("a_en.mp3");
  });
});

// --- isTalking mouth animation ---------------------------------------------

describe("CornerTalker — talking animation state", () => {
  const mouthOf = (container: HTMLElement) =>
    container.querySelector("button[aria-label='Play room introduction'] > div:last-child");

  it("applies the talking animation only when its own track is playing", () => {
    mockState = { isPlaying: true, currentTrackName: "a_en.mp3" };
    const { container } = render(
      <CornerTalker roomId="r" introAudioEn="a_en.mp3" />,
    );
    expect(mouthOf(container)?.className).toContain("animate-mouth-talk");
  });

  it("does not animate when a different track is playing", () => {
    mockState = { isPlaying: true, currentTrackName: "other.mp3" };
    const { container } = render(
      <CornerTalker roomId="r" introAudioEn="a_en.mp3" />,
    );
    const cls = mouthOf(container)?.className ?? "";
    expect(cls).not.toContain("animate-mouth-talk");
    expect(cls).toContain("rounded-full");
  });

  it("does not animate when nothing is playing", () => {
    mockState = { isPlaying: false, currentTrackName: undefined };
    const { container } = render(
      <CornerTalker roomId="r" introAudioEn="a_en.mp3" />,
    );
    expect(mouthOf(container)?.className ?? "").not.toContain("animate-mouth-talk");
  });

  it("does not animate when there is no audio at all", () => {
    mockState = { isPlaying: true, currentTrackName: undefined };
    const { container } = render(<CornerTalker roomId="r" />);
    expect(mouthOf(container)?.className ?? "").not.toContain("animate-mouth-talk");
  });
});

// --- Re-render / prop change behavior ---------------------------------------

describe("CornerTalker — prop changes", () => {
  it("uses the updated EN filename after a prop change", () => {
    const { rerender } = render(
      <CornerTalker roomId="r" introAudioEn="first_en.mp3" />,
    );
    rerender(<CornerTalker roomId="r" introAudioEn="second_en.mp3" />);

    fireEvent.click(getBlobButton());
    expect(play).toHaveBeenCalledWith("second_en.mp3");
  });
});
