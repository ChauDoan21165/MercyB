// src/components/__tests__/AudioPlayer.hardening.test.tsx
//
// MercyForge Factory V2 — Type B hardening suite for the legacy
// <AudioPlayer> compatibility bridge (src/components/AudioPlayer.tsx).
//
// AudioPlayer is intentionally tiny: it picks a canonical audio key from a set
// of legacy prop variants, derives a label, and renders ONLY the Mercy Blade
// TalkingFacePlayButton motif (the native audio UI must never appear). These
// tests lock that contract:
//   - key selection priority: src > url > audioSrc
//   - canonicalization via toAudioKey
//   - null render when no usable key
//   - label priority: label > title > fallback (basename of key)
//   - fullWidthBar default of true, overridable
//   - className passthrough
//
// External dependencies are fully mocked so the suite is deterministic and
// never touches Supabase, fetch, or the real audio pipeline.

import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, cleanup } from "@testing-library/react";

// --- Mock the canonical key normalizer -------------------------------------
// The real toAudioKey imports the Supabase client at module load. We mock it so
// the test is hermetic AND so we can assert exactly what AudioPlayer forwards.
vi.mock("@/lib/roomAudioResolver", () => ({
  toAudioKey: vi.fn(),
}));

// --- Mock the only UI surface AudioPlayer is allowed to render --------------
// Serialize the props we care about into DOM attributes so assertions are
// straightforward. Also records the raw prop objects for deep inspection.
const talkingFaceCalls: Array<Record<string, unknown>> = [];

vi.mock("@/components/audio/TalkingFacePlayButton", () => ({
  default: vi.fn((props: Record<string, unknown>) => {
    talkingFaceCalls.push(props);
    return (
      <div
        data-testid="talking-face"
        data-src={String(props.src ?? "")}
        data-label={String(props.label ?? "")}
        data-classname={String(props.className ?? "")}
        data-fullwidthbar={String(props.fullWidthBar)}
      />
    );
  }),
}));

import AudioPlayer, { AudioPlayer as NamedAudioPlayer } from "@/components/AudioPlayer";
import { toAudioKey } from "@/lib/roomAudioResolver";

const mockedToAudioKey = vi.mocked(toAudioKey);

/**
 * Default mock behavior: a faithful-but-simple stand-in for the real
 * toAudioKey — trims, returns null for empties/non-strings, strips a leading
 * `audio/` or `/audio/` prefix. Enough to exercise AudioPlayer's branches
 * without depending on the resolver's full implementation.
 */
function installDefaultToAudioKey(): void {
  mockedToAudioKey.mockImplementation((raw: unknown): string | null => {
    if (typeof raw !== "string") return null;
    const trimmed = raw.trim();
    if (!trimmed) return null;
    return trimmed.replace(/^\/?audio\//, "");
  });
}

beforeEach(() => {
  // vitest config has mockReset:true, which wipes implementations before each
  // test. Re-install the default impl and clear the recorded render props.
  talkingFaceCalls.length = 0;
  installDefaultToAudioKey();
});

function lastTalkingFace(): Record<string, unknown> {
  return talkingFaceCalls[talkingFaceCalls.length - 1];
}

describe("AudioPlayer — exports", () => {
  it("default export and named export are the same component", () => {
    expect(AudioPlayer).toBe(NamedAudioPlayer);
  });

  it("is a function component named AudioPlayer", () => {
    expect(typeof AudioPlayer).toBe("function");
    expect(AudioPlayer.name).toBe("AudioPlayer");
  });
});

describe("AudioPlayer — key selection priority (src > url > audioSrc)", () => {
  it("prefers src over url and audioSrc", () => {
    render(<AudioPlayer src="a.mp3" url="b.mp3" audioSrc="c.mp3" />);
    expect(mockedToAudioKey).toHaveBeenCalledWith("a.mp3");
    expect(lastTalkingFace().src).toBe("a.mp3");
  });

  it("falls back to url when src is absent", () => {
    render(<AudioPlayer url="b.mp3" audioSrc="c.mp3" />);
    expect(mockedToAudioKey).toHaveBeenCalledWith("b.mp3");
    expect(lastTalkingFace().src).toBe("b.mp3");
  });

  it("falls back to audioSrc when src and url are absent", () => {
    render(<AudioPlayer audioSrc="c.mp3" />);
    expect(mockedToAudioKey).toHaveBeenCalledWith("c.mp3");
    expect(lastTalkingFace().src).toBe("c.mp3");
  });

  it("treats an empty-string src as falsy and falls through to url", () => {
    render(<AudioPlayer src="" url="b.mp3" />);
    expect(mockedToAudioKey).toHaveBeenCalledWith("b.mp3");
    expect(lastTalkingFace().src).toBe("b.mp3");
  });

  it("treats empty src and url as falsy and uses audioSrc", () => {
    render(<AudioPlayer src="" url="" audioSrc="c.mp3" />);
    expect(mockedToAudioKey).toHaveBeenCalledWith("c.mp3");
    expect(lastTalkingFace().src).toBe("c.mp3");
  });
});

describe("AudioPlayer — canonicalization through toAudioKey", () => {
  it("forwards the canonical key returned by toAudioKey, not the raw input", () => {
    render(<AudioPlayer src="/audio/kids/airplane.mp3" />);
    expect(lastTalkingFace().src).toBe("kids/airplane.mp3");
  });

  it("strips a leading audio/ prefix (canonical key passthrough)", () => {
    render(<AudioPlayer src="audio/foo.mp3" />);
    expect(lastTalkingFace().src).toBe("foo.mp3");
  });

  it("passes a non-string raw (via legacy callers) through toAudioKey safely", () => {
    // Even though the type says string, legacy JS callers can pass anything.
    // toAudioKey returns null for non-strings -> AudioPlayer renders nothing.
    const { container } = render(
      // @ts-expect-error intentionally passing a non-string for hardening
      <AudioPlayer src={123} />,
    );
    expect(container.firstChild).toBeNull();
  });
});

describe("AudioPlayer — null render when no usable key", () => {
  it("renders nothing when no source props are provided", () => {
    const { container } = render(<AudioPlayer />);
    expect(container.firstChild).toBeNull();
  });

  it("renders nothing when all source props are empty strings", () => {
    const { container } = render(<AudioPlayer src="" url="" audioSrc="" />);
    expect(container.firstChild).toBeNull();
  });

  it("renders nothing when toAudioKey returns null", () => {
    mockedToAudioKey.mockReturnValue(null);
    const { container } = render(<AudioPlayer src="something.mp3" />);
    expect(container.firstChild).toBeNull();
  });

  it("renders nothing when toAudioKey returns empty string", () => {
    mockedToAudioKey.mockReturnValue("");
    const { container } = render(<AudioPlayer src="something.mp3" />);
    expect(container.firstChild).toBeNull();
  });

  it("does not render TalkingFacePlayButton when there is no key", () => {
    const { queryByTestId } = render(<AudioPlayer />);
    expect(queryByTestId("talking-face")).toBeNull();
    expect(talkingFaceCalls.length).toBe(0);
  });

  it("coerces a null toAudioKey result to empty (?? '') before the truthiness check", () => {
    // pickKey returns toAudioKey(raw) ?? "" ; null -> "" -> falsy -> null render.
    mockedToAudioKey.mockReturnValue(null);
    const { container } = render(<AudioPlayer url="x" />);
    expect(container.firstChild).toBeNull();
  });
});

describe("AudioPlayer — label priority (label > title > fallback basename)", () => {
  it("uses the explicit label when provided", () => {
    render(<AudioPlayer src="kids/airplane.mp3" label="Máy bay" title="ignored" />);
    expect(lastTalkingFace().label).toBe("Máy bay");
  });

  it("uses title when label is absent", () => {
    render(<AudioPlayer src="kids/airplane.mp3" title="Tiêu đề" />);
    expect(lastTalkingFace().label).toBe("Tiêu đề");
  });

  it("falls back to the key basename when neither label nor title is given", () => {
    render(<AudioPlayer src="kids/airplane.mp3" />);
    expect(lastTalkingFace().label).toBe("airplane.mp3");
  });

  it("uses the whole key as fallback label when it has no slash", () => {
    render(<AudioPlayer src="foo.mp3" />);
    expect(lastTalkingFace().label).toBe("foo.mp3");
  });

  it("trims whitespace-only label and title, then falls back to basename", () => {
    render(<AudioPlayer src="music/theme.mp3" label="   " title="   " />);
    expect(lastTalkingFace().label).toBe("theme.mp3");
  });

  it("trims surrounding whitespace from an explicit label", () => {
    render(<AudioPlayer src="x.mp3" label="  Bài học  " />);
    expect(lastTalkingFace().label).toBe("Bài học");
  });

  it("prefers a whitespace-trimmed title over the basename when label is empty", () => {
    render(<AudioPlayer src="a/b/c.mp3" label="" title="  Real Title  " />);
    expect(lastTalkingFace().label).toBe("Real Title");
  });

  it("derives the basename from a deeply nested key", () => {
    render(<AudioPlayer src="a/b/c/d/leaf.mp3" />);
    expect(lastTalkingFace().label).toBe("leaf.mp3");
  });

  it("falls back to the whole key when the basename collapses (key ending in slash)", () => {
    // fallbackLabel does `key.split('/').pop() || key`. A trailing-slash key
    // yields an empty basename, so the `|| key` arm returns the whole key.
    mockedToAudioKey.mockReturnValue("kids/");
    render(<AudioPlayer src="whatever" />);
    // The key "kids/" is truthy, so it renders; label falls back to the key.
    expect(lastTalkingFace().src).toBe("kids/");
    expect(lastTalkingFace().label).toBe("kids/");
  });
});

describe("AudioPlayer — fullWidthBar default and override", () => {
  it("defaults fullWidthBar to true", () => {
    render(<AudioPlayer src="x.mp3" />);
    expect(lastTalkingFace().fullWidthBar).toBe(true);
  });

  it("respects an explicit fullWidthBar=false", () => {
    render(<AudioPlayer src="x.mp3" fullWidthBar={false} />);
    expect(lastTalkingFace().fullWidthBar).toBe(false);
  });

  it("respects an explicit fullWidthBar=true", () => {
    render(<AudioPlayer src="x.mp3" fullWidthBar={true} />);
    expect(lastTalkingFace().fullWidthBar).toBe(true);
  });
});

describe("AudioPlayer — className passthrough", () => {
  it("forwards className to TalkingFacePlayButton", () => {
    render(<AudioPlayer src="x.mp3" className="my-player" />);
    expect(lastTalkingFace().className).toBe("my-player");
  });

  it("forwards undefined className when none is provided", () => {
    render(<AudioPlayer src="x.mp3" />);
    expect(lastTalkingFace().className).toBeUndefined();
  });
});

describe("AudioPlayer — rendered DOM contract (Mercy Blade motif only)", () => {
  it("renders exactly the TalkingFacePlayButton surface and no native audio element", () => {
    const { getByTestId, container } = render(
      <AudioPlayer src="kids/airplane.mp3" label="Plane" className="cls" />,
    );
    const node = getByTestId("talking-face");
    expect(node).not.toBeNull();
    expect(node.getAttribute("data-src")).toBe("kids/airplane.mp3");
    expect(node.getAttribute("data-label")).toBe("Plane");
    expect(node.getAttribute("data-classname")).toBe("cls");
    expect(node.getAttribute("data-fullwidthbar")).toBe("true");
    // Native <audio> must never leak through the legacy bridge.
    expect(container.querySelector("audio")).toBeNull();
  });

  it("invokes TalkingFacePlayButton exactly once per render with a key", () => {
    render(<AudioPlayer src="one.mp3" />);
    expect(talkingFaceCalls.length).toBe(1);
  });
});

describe("AudioPlayer — robustness across repeated and varied renders", () => {
  it("is deterministic: same props produce the same forwarded values", () => {
    const { unmount } = render(<AudioPlayer src="kids/x.mp3" label="L" />);
    const first = { ...lastTalkingFace() };
    unmount();
    cleanup();
    talkingFaceCalls.length = 0;
    render(<AudioPlayer src="kids/x.mp3" label="L" />);
    const second = { ...lastTalkingFace() };
    expect(second.src).toBe(first.src);
    expect(second.label).toBe(first.label);
    expect(second.fullWidthBar).toBe(first.fullWidthBar);
  });

  it("handles a render with every prop variant set at once", () => {
    render(
      <AudioPlayer
        src="kids/win.mp3"
        url="ignored-url"
        audioSrc="ignored-audiosrc"
        label="Chiến thắng"
        title="ignored-title"
        className="full"
        fullWidthBar={false}
      />,
    );
    const props = lastTalkingFace();
    expect(props.src).toBe("kids/win.mp3");
    expect(props.label).toBe("Chiến thắng");
    expect(props.className).toBe("full");
    expect(props.fullWidthBar).toBe(false);
  });
});
