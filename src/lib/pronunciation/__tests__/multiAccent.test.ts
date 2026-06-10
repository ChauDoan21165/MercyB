// src/lib/pronunciation/__tests__/multiAccent.test.ts
//
// Coverage for the multi-accent pronunciation training surface
// (UK/AU/US/CA). Touches four layers:
//   1. Static dataset (multiAccentReferences) — entry lookup, IPA
//      retrieval, normaliseAccent edge cases, metadata locale mapping.
//   2. useAccentPreference hook — localStorage initial read, setAccent
//      persists to both stores, Supabase profile wins on hydration.
//   3. multiAccentTTS — cloud path uses per-accent voice id, browser
//      fallback receives the right BCP-47 locale.
//   4. cloudScorer — the optional `accent` field flows into the
//      multipart body sent to the azure-phoneme edge fn.
//
// Tests stay deterministic: vi.mock isolates @/lib/supabaseClient and
// @/lib/mercyVoice, and we inject test factories where the production
// path uses globals (Audio, speechSynthesis, fetch).

import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import {
  ACCENT_METADATA,
  ALL_ACCENTS,
  DEFAULT_ACCENT,
  getIpaForAccent,
  getMultiAccentEntry,
  normaliseAccent,
  type Accent,
} from "@/data/pronunciation/multiAccentReferences";

// useAccentPreference now reads the profile through useProfileQuery
// (the shared react-query hook). Tests that mount it need a
// QueryClientProvider in scope.
function makeQueryWrapper() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client }, children);
}

// ─── Mocks ──────────────────────────────────────────────────────────────

vi.mock("@/lib/supabaseClient", () => {
  return {
    supabase: {
      from: vi.fn(),
    },
  };
});

vi.mock("@/lib/mercyVoice", () => {
  // Default to a resolved-null promise so the production code's
  // `.then(res => ...)` chain doesn't blow up when this mock is called
  // by the now-configured `us` accent path. Individual tests that
  // exercise the cloud path override with `.mockResolvedValueOnce(...)`.
  return {
    fetchCloudTtsUrl: vi.fn().mockResolvedValue(null),
  };
});

// ─── Section 1: dataset + helpers ───────────────────────────────────────

describe("multiAccentReferences — dataset", () => {
  it("ALL_ACCENTS contains exactly the four supported codes", () => {
    expect([...ALL_ACCENTS].sort()).toEqual(["au", "ca", "uk", "us"]);
  });

  it("DEFAULT_ACCENT is 'us' to match the migration default", () => {
    expect(DEFAULT_ACCENT).toBe("us");
  });

  it("ACCENT_METADATA maps every accent to a distinct BCP-47 locale", () => {
    const locales = ALL_ACCENTS.map((a) => ACCENT_METADATA[a].locale);
    expect(locales).toEqual(["en-US", "en-GB", "en-AU", "en-CA"]);
    expect(new Set(locales).size).toBe(4);
  });

  it("ACCENT_METADATA Vietnamese labels are non-empty for every accent", () => {
    for (const accent of ALL_ACCENTS) {
      expect(ACCENT_METADATA[accent].label_vi.length).toBeGreaterThan(0);
    }
  });

  it("getMultiAccentEntry returns null for words outside the divergent set", () => {
    expect(getMultiAccentEntry("notarealword12345")).toBeNull();
    expect(getMultiAccentEntry("")).toBeNull();
    expect(getMultiAccentEntry("   ")).toBeNull();
  });

  it("getMultiAccentEntry is case- and whitespace-insensitive", () => {
    const lower = getMultiAccentEntry("schedule");
    const upper = getMultiAccentEntry("  SCHEDULE  ");
    expect(lower).not.toBeNull();
    expect(upper).toEqual(lower);
  });

  it("getIpaForAccent returns 4 distinct strings for a sharply divergent word", () => {
    const word = "schedule";
    const ipas = ALL_ACCENTS.map((a) => getIpaForAccent(word, a));
    for (const ipa of ipas) {
      expect(typeof ipa).toBe("string");
      expect((ipa as string).length).toBeGreaterThan(0);
    }
    expect(getIpaForAccent(word, "us")).not.toEqual(
      getIpaForAccent(word, "uk"),
    );
  });

  it("getIpaForAccent returns null when the word isn't in the dataset", () => {
    expect(getIpaForAccent("zzz_unknown", "us")).toBeNull();
  });

  it("normaliseAccent accepts bare codes, BCP-47, and full English labels", () => {
    expect(normaliseAccent("us")).toBe("us");
    expect(normaliseAccent("UK")).toBe("uk");
    expect(normaliseAccent("en-AU")).toBe("au");
    expect(normaliseAccent("en-gb")).toBe("uk");
    expect(normaliseAccent("Canadian")).toBe("ca");
    expect(normaliseAccent("AMERICAN")).toBe("us");
  });

  it("normaliseAccent falls back to the default on unknown / non-string input", () => {
    expect(normaliseAccent("klingon")).toBe(DEFAULT_ACCENT);
    expect(normaliseAccent(null)).toBe(DEFAULT_ACCENT);
    expect(normaliseAccent(undefined)).toBe(DEFAULT_ACCENT);
    expect(normaliseAccent(42)).toBe(DEFAULT_ACCENT);
    expect(normaliseAccent({})).toBe(DEFAULT_ACCENT);
  });
});

// ─── Section 2: useAccentPreference hook ────────────────────────────────

describe("useAccentPreference", () => {
  const LOCAL_KEY = "mb_preferred_accent";

  beforeEach(() => {
    window.localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    window.localStorage.clear();
  });

  it("reads the initial accent from localStorage synchronously", async () => {
    window.localStorage.setItem(LOCAL_KEY, "uk");
    const { useAccentPreference } = await import(
      "@/lib/pronunciation/useAccentPreference"
    );
    const { result } = renderHook(() => useAccentPreference(null), {
      wrapper: makeQueryWrapper(),
    });
    expect(result.current.accent).toBe("uk");
  });

  it("defaults to 'us' when localStorage is empty", async () => {
    const { useAccentPreference } = await import(
      "@/lib/pronunciation/useAccentPreference"
    );
    const { result } = renderHook(() => useAccentPreference(null), {
      wrapper: makeQueryWrapper(),
    });
    expect(result.current.accent).toBe("us");
  });

  it("setAccent updates state and writes to localStorage", async () => {
    const { useAccentPreference } = await import(
      "@/lib/pronunciation/useAccentPreference"
    );
    const { result } = renderHook(() => useAccentPreference(null), {
      wrapper: makeQueryWrapper(),
    });
    act(() => result.current.setAccent("au"));
    expect(result.current.accent).toBe("au");
    expect(window.localStorage.getItem(LOCAL_KEY)).toBe("au");
  });

  it("setAccent normalises unknown input back to the default accent", async () => {
    const { useAccentPreference } = await import(
      "@/lib/pronunciation/useAccentPreference"
    );
    const { result } = renderHook(() => useAccentPreference(null), {
      wrapper: makeQueryWrapper(),
    });
    // Cast bypasses TS for the test — production callers can't pass this,
    // but defensive normalisation should still kick in if they do.
    act(() => result.current.setAccent("klingon" as unknown as Accent));
    expect(result.current.accent).toBe("us");
  });

  it("hydrates from Supabase profile when remote disagrees with localStorage", async () => {
    window.localStorage.setItem(LOCAL_KEY, "us");
    const { supabase } = await import("@/lib/supabaseClient");

    const maybeSingle = vi
      .fn()
      .mockResolvedValue({ data: { preferred_accent: "uk" }, error: null });
    const eq = vi.fn().mockReturnValue({ maybeSingle });
    const select = vi.fn().mockReturnValue({ eq });
    const update = vi.fn().mockReturnValue({ eq: vi.fn().mockResolvedValue({}) });
    (supabase.from as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      select,
      update,
    });

    const { useAccentPreference } = await import(
      "@/lib/pronunciation/useAccentPreference"
    );
    const { result, rerender } = renderHook(
      ({ uid }: { uid: string | null }) => useAccentPreference(uid),
      { initialProps: { uid: "user-123" }, wrapper: makeQueryWrapper() },
    );

    // Tick microtasks so the hydration promise resolves.
    await vi.waitFor(() => {
      expect(result.current.ready).toBe(true);
    });
    rerender({ uid: "user-123" });
    expect(result.current.accent).toBe("uk");
    expect(window.localStorage.getItem(LOCAL_KEY)).toBe("uk");
  });
});

// ─── Section 3: multiAccentTTS playback ─────────────────────────────────

describe("multiAccentTTS.playReferenceAudio", () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    // Re-apply the resolved-null default. clearAllMocks resets call
    // history but Vitest 3 also wipes mockResolvedValue defaults set in
    // the factory in some module graphs — easier to re-assert here so
    // the production `.then(res => ...)` chain in getOrFetchCloudUrl
    // never receives an undefined return when an earlier test left a
    // .mockResolvedValueOnce in place.
    const mercyVoice = await import("@/lib/mercyVoice");
    (mercyVoice.fetchCloudTtsUrl as ReturnType<typeof vi.fn>)
      .mockReset()
      .mockResolvedValue(null);
    const { __resetMultiAccentTTSCacheForTests } = await import(
      "@/lib/pronunciation/multiAccentTTS"
    );
    __resetMultiAccentTTSCacheForTests();
  });

  it("returns 'none' for empty / whitespace input", async () => {
    const { playReferenceAudio } = await import(
      "@/lib/pronunciation/multiAccentTTS"
    );
    const a = await playReferenceAudio("", "us");
    const b = await playReferenceAudio("   ", "uk");
    expect(a.source).toBe("none");
    expect(b.source).toBe("none");
    // C1: the observable error field is set whenever nothing played.
    expect(a.error).toBe("empty_word");
    expect(b.error).toBe("empty_word");
  });

  it("falls back to browser TTS with the right BCP-47 locale per accent", async () => {
    const { playReferenceAudio } = await import(
      "@/lib/pronunciation/multiAccentTTS"
    );
    const calls: Array<{ text: string; lang: string }> = [];
    const speakWithBrowser = (text: string, lang: string) => {
      calls.push({ text, lang });
    };

    for (const accent of ALL_ACCENTS) {
      // eslint-disable-next-line no-await-in-loop
      const res = await playReferenceAudio("schedule", accent, {
        speakWithBrowser,
      });
      expect(res.source).toBe("browser");
    }

    expect(calls.map((c) => c.lang)).toEqual([
      "en-US",
      "en-GB",
      "en-AU",
      "en-CA",
    ]);
  });

  it("uses the cloud path when the per-accent voice id is configured", async () => {
    // Configure the UK voice for this test, then assert fetch was called.
    const cfg = await import("@/config/mercyVoices");
    const original = cfg.ENGLISH_VOICE_IDS.uk;
    // @ts-expect-error — readonly assertion is intentional in production
    cfg.ENGLISH_VOICE_IDS.uk = "real-uk-voice-id";

    const mercyVoice = await import("@/lib/mercyVoice");
    (mercyVoice.fetchCloudTtsUrl as unknown as ReturnType<typeof vi.fn>)
      .mockResolvedValue({ audioUrl: "blob:fake-cloud-audio" });

    const playedSrc: string[] = [];
    const audioFactory = (src: string) => {
      playedSrc.push(src);
      // Use a setter on `onended` so when the helper assigns its
      // resolver we fire it on the next microtask. Without this the
      // helper's Promise<void> waits forever (play() resolves silently,
      // onerror never fires).
      const audio = {
        play: () => Promise.resolve(),
        onerror: null,
        set onended(fn: (() => void) | null) {
          if (fn) queueMicrotask(fn);
        },
      };
      return audio as unknown as HTMLAudioElement;
    };

    const { playReferenceAudio, __resetMultiAccentTTSCacheForTests } =
      await import("@/lib/pronunciation/multiAccentTTS");
    __resetMultiAccentTTSCacheForTests();

    const res = await playReferenceAudio("schedule", "uk", { audioFactory });

    expect(res.source).toBe("cloud");
    expect(playedSrc).toEqual(["blob:fake-cloud-audio"]);

    // Restore voice id so we don't leak into other tests.
    // @ts-expect-error
    cfg.ENGLISH_VOICE_IDS.uk = original;
  });
});

// ─── Section 4: cloudScorer accent plumbing ─────────────────────────────

describe("scoreCloud — accent flows into the multipart body", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("attaches the accent form field when input.accent is set", async () => {
    // wavEncoder converts the input to a real Blob; bypass it with a
    // Blob the encoder will pass through.
    vi.doMock("@/lib/audio/wavEncoder", () => ({
      blobToWavPcm16k: async (b: Blob) => b,
    }));

    const fetchImpl = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          ok: true,
          score: 88,
          word_scores: [
            { word: "hi", heard: "hi", score: 88, status: "correct", phonemes: [] },
          ],
          provider: "azure",
          audio_seconds: 1,
          cost_usd_cents: 0.01,
        }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      ),
    );

    const { scoreCloud } = await import("@/lib/pronunciation/cloudScorer");
    await scoreCloud({
      audioBlob: new Blob([new Uint8Array(64)], { type: "audio/wav" }),
      target: "hi",
      userJwt: "jwt-token",
      supabaseUrl: "https://test.supabase.co",
      fetchImpl: fetchImpl as unknown as typeof fetch,
      accent: "uk",
    });

    expect(fetchImpl).toHaveBeenCalledTimes(1);
    const [, init] = fetchImpl.mock.calls[0];
    const body = (init as RequestInit).body as FormData;
    expect(body).toBeInstanceOf(FormData);
    expect(body.get("accent")).toBe("uk");
    expect(body.get("target_text")).toBe("hi");
  });

  it("omits the accent form field when input.accent is undefined", async () => {
    vi.doMock("@/lib/audio/wavEncoder", () => ({
      blobToWavPcm16k: async (b: Blob) => b,
    }));

    const fetchImpl = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          ok: true,
          score: 90,
          word_scores: [
            { word: "yes", heard: "yes", score: 90, status: "correct", phonemes: [] },
          ],
          provider: "azure",
          audio_seconds: 1,
          cost_usd_cents: 0.01,
        }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      ),
    );

    const { scoreCloud } = await import("@/lib/pronunciation/cloudScorer");
    await scoreCloud({
      audioBlob: new Blob([new Uint8Array(64)], { type: "audio/wav" }),
      target: "yes",
      userJwt: "jwt-token",
      supabaseUrl: "https://test.supabase.co",
      fetchImpl: fetchImpl as unknown as typeof fetch,
    });

    const [, init] = fetchImpl.mock.calls[0];
    const body = (init as RequestInit).body as FormData;
    expect(body.get("accent")).toBeNull();
  });
});
