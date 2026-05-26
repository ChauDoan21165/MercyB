/**
 * §15 Axis 2 Bar #2 — tone production scoring spec test.
 *
 * Two layers of verification:
 *
 *   1. Bucket-mapping unit tests — boundary semantics for the three-
 *      bucket model (pass / low-confidence-pass / retry).
 *
 *   2. Adjacent-tone distinction structural test — given a realistic
 *      pair of Azure responses (one for `má` recorded against a `má`
 *      target = matched, one against a `mã` target = mismatched),
 *      verify the adapter classifies them into the right buckets.
 *      This is the design's named spec test for the
 *      `má` (sắc) vs `mã` (ngã) pair — the hardest adjacent-tone
 *      distinction (design §6).
 *
 * The Azure responses used in (2) are SYNTHETIC fixtures, not live
 * recordings. They model the expected score profile (matched ≥ 70,
 * mismatched < 50). The empirical verification — does Azure actually
 * produce that profile with real prerecorded audio — runs as a
 * separate script (`scripts/verify-tone-spec-empirical.ts`) requiring
 * Azure credentials and reference audio. The script's output answers
 * dispatch question 2: if empirical verification fails, the design
 * pivots to Option B (Web Audio local pitch); if it succeeds, Bar #2
 * stays closeable.
 *
 * CI runs (1) and (2). The empirical step runs out-of-band against
 * a real Azure endpoint and is the merge gate the owner enforces.
 */

import { describe, expect, it, vi } from "vitest";

import {
  bucketForScore,
  scoreTone,
  TONE_SCORE_LOW_CONFIDENCE_THRESHOLD,
  TONE_SCORE_PASS_THRESHOLD,
  type ToneScoreResult,
} from "../scoreTone";
import {
  SPEC_TEST_PAIR_ID,
  TONE_DRILL_PAIRS,
  TONE_REFERENCE_SYLLABLES,
} from "@/data/tone-drill/minimal-pairs";

// ─────────────────────────────────────────────────────────────────────────
// Layer 0 — drill set invariants (Bar #2 artifact: "≥ 12 minimal-tone pairs")
// ─────────────────────────────────────────────────────────────────────────

describe("TONE_DRILL_PAIRS — Bar #2 artifact", () => {
  it("ships at least 12 pairs (Bar #2 floor)", () => {
    expect(TONE_DRILL_PAIRS.length).toBeGreaterThanOrEqual(12);
  });

  it("every pair has stable kebab-case id, unique across the set", () => {
    const ids = TONE_DRILL_PAIRS.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) {
      expect(id).toMatch(/^[a-z0-9-]+$/);
    }
  });

  it("every contrast names two distinct syllables sharing a base shape", () => {
    for (const pair of TONE_DRILL_PAIRS) {
      const [a, b] = pair.contrast;
      expect(a.syllable).not.toBe(b.syllable);
      // Compare bases by stripping tone marks (a coarse check — the
      // real invariant is that the contrast is a minimal-tone pair,
      // not minimal-segment).
      expect(stripToneMarks(a.syllable)).toBe(stripToneMarks(b.syllable));
    }
  });

  it("every reference audio path resolves under /audio/tones/", () => {
    for (const pair of TONE_DRILL_PAIRS) {
      for (const target of pair.contrast) {
        expect(target.audioPath).toMatch(/^\/audio\/tones\/[^/]+\.mp3$/);
      }
    }
  });

  it("includes the spec-test pair má (sắc) vs mã (ngã)", () => {
    const specPair = TONE_DRILL_PAIRS.find((p) => p.id === SPEC_TEST_PAIR_ID);
    expect(specPair).toBeDefined();
    const tones = specPair?.contrast.map((c) => c.tone).sort();
    expect(tones).toEqual(["ngã", "sắc"].sort());
  });

  it("reference-syllable set is deduplicated and non-empty", () => {
    expect(TONE_REFERENCE_SYLLABLES.length).toBeGreaterThan(0);
    const syllables = TONE_REFERENCE_SYLLABLES.map((t) => t.syllable);
    expect(new Set(syllables).size).toBe(syllables.length);
  });
});

// ─────────────────────────────────────────────────────────────────────────
// Layer 1 — bucket mapping (boundary semantics)
// ─────────────────────────────────────────────────────────────────────────

describe("bucketForScore — three-bucket boundary semantics", () => {
  it("100 → pass", () => expect(bucketForScore(100)).toBe("pass"));
  it("70 (pass threshold, inclusive) → pass", () => expect(bucketForScore(70)).toBe("pass"));
  it("69 → low-confidence-pass", () => expect(bucketForScore(69)).toBe("low-confidence-pass"));
  it("50 (low-confidence threshold, inclusive) → low-confidence-pass", () =>
    expect(bucketForScore(50)).toBe("low-confidence-pass"));
  it("49 → retry", () => expect(bucketForScore(49)).toBe("retry"));
  it("0 → retry", () => expect(bucketForScore(0)).toBe("retry"));

  it("thresholds are exported so the UI can colour-code from one source", () => {
    expect(TONE_SCORE_PASS_THRESHOLD).toBe(70);
    expect(TONE_SCORE_LOW_CONFIDENCE_THRESHOLD).toBe(50);
  });
});

// ─────────────────────────────────────────────────────────────────────────
// Layer 2 — scoreTone adapter (auth gate, error paths, success path)
// ─────────────────────────────────────────────────────────────────────────

function buildFakeWavBlob(): Blob {
  // Minimal valid WAV header so the existing wavEncoder accepts it
  // when called with a real audio context — but in tests we mock
  // both the wav encoder path and the fetch, so any Blob works.
  return new Blob([new Uint8Array([0x52, 0x49, 0x46, 0x46])], {
    type: "audio/wav",
  });
}

vi.mock("@/lib/audio/wavEncoder", () => ({
  blobToWavPcm16k: vi.fn(async (blob: Blob) => blob),
}));

describe("scoreTone — auth gate", () => {
  it("anonymous (null JWT) → bucket=unavailable, reason=auth-required", async () => {
    const result = await scoreTone({
      audioBlob: buildFakeWavBlob(),
      targetSyllable: "má",
      userJwt: null,
      supabaseUrl: "https://test.example.com",
      fetchImpl: vi.fn() as unknown as typeof fetch,
    });
    expect(result.bucket).toBe("unavailable");
    expect(result.reason).toBe("auth-required");
    expect(result.score).toBeNull();
  });

  it("HTTP 401 from edge function → bucket=unavailable, reason=auth-required", async () => {
    const result = await scoreTone({
      audioBlob: buildFakeWavBlob(),
      targetSyllable: "má",
      userJwt: "test-jwt",
      supabaseUrl: "https://test.example.com",
      fetchImpl: vi.fn().mockResolvedValue(
        new Response("", { status: 401 }),
      ) as unknown as typeof fetch,
    });
    expect(result.bucket).toBe("unavailable");
    expect(result.reason).toBe("auth-required");
  });
});

describe("scoreTone — request shape (target_locale + context)", () => {
  it("posts target_locale=vi-VN and context=tone-drill in the form", async () => {
    let capturedFormData: FormData | undefined;
    const fetchImpl = vi.fn().mockImplementation((_url: string, init: RequestInit) => {
      capturedFormData = init.body as FormData;
      return Promise.resolve(
        new Response(JSON.stringify(synthSuccessResponse(80)), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }),
      );
    });

    await scoreTone({
      audioBlob: buildFakeWavBlob(),
      targetSyllable: "má",
      userJwt: "test-jwt",
      supabaseUrl: "https://test.example.com",
      fetchImpl: fetchImpl as unknown as typeof fetch,
    });

    expect(capturedFormData).toBeDefined();
    expect(capturedFormData?.get("target_locale")).toBe("vi-VN");
    expect(capturedFormData?.get("context")).toBe("tone-drill");
    expect(capturedFormData?.get("target_text")).toBe("má");
  });

  it("sets Authorization: Bearer <jwt>", async () => {
    let capturedHeaders: HeadersInit | undefined;
    const fetchImpl = vi.fn().mockImplementation((_url: string, init: RequestInit) => {
      capturedHeaders = init.headers;
      return Promise.resolve(
        new Response(JSON.stringify(synthSuccessResponse(80)), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }),
      );
    });

    await scoreTone({
      audioBlob: buildFakeWavBlob(),
      targetSyllable: "mã",
      userJwt: "session-jwt-xyz",
      supabaseUrl: "https://test.example.com",
      fetchImpl: fetchImpl as unknown as typeof fetch,
    });

    const headers = capturedHeaders as Record<string, string> | undefined;
    expect(headers?.Authorization).toBe("Bearer session-jwt-xyz");
  });
});

describe("scoreTone — sentinel and network paths", () => {
  it("Azure sentinel { ok: false } → unavailable, reason=azure-sentinel", async () => {
    const result = await scoreTone({
      audioBlob: buildFakeWavBlob(),
      targetSyllable: "má",
      userJwt: "test-jwt",
      supabaseUrl: "https://test.example.com",
      fetchImpl: vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ ok: false, reason: "rate_limit" }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }),
      ) as unknown as typeof fetch,
    });
    expect(result.bucket).toBe("unavailable");
    expect(result.reason).toBe("azure-sentinel");
  });

  it("network failure → unavailable, reason=network-error", async () => {
    const result = await scoreTone({
      audioBlob: buildFakeWavBlob(),
      targetSyllable: "má",
      userJwt: "test-jwt",
      supabaseUrl: "https://test.example.com",
      fetchImpl: vi.fn().mockRejectedValue(new TypeError("fetch failed")) as unknown as typeof fetch,
    });
    expect(result.bucket).toBe("unavailable");
    expect(result.reason).toBe("network-error");
  });
});

// ─────────────────────────────────────────────────────────────────────────
// Layer 3 — adjacent-tone distinction (the design §6 spec test)
// ─────────────────────────────────────────────────────────────────────────

describe("má vs mã adjacent-tone distinction (design §6 spec test)", () => {
  // Synthetic Azure response profiles modelling the expected runtime
  // behaviour. The empirical verification script (run with real audio
  // + real credentials) determines whether Azure actually delivers
  // this profile; this test verifies the adapter's bucketing GIVEN
  // it does.
  const matchedScore = 82; // matched-tone attempt — well above pass threshold
  const mismatchedScore = 28; // mismatched-tone attempt — well below retry threshold

  it("matched má-as-má → bucket=pass", async () => {
    const result = await scoreToneWithMockedAzure("má", matchedScore);
    expect(result.bucket).toBe("pass");
    expect(result.score).toBe(matchedScore);
  });

  it("mismatched má-as-mã → bucket=retry", async () => {
    const result = await scoreToneWithMockedAzure("mã", mismatchedScore);
    expect(result.bucket).toBe("retry");
    expect(result.score).toBe(mismatchedScore);
  });

  it("matched mã-as-mã → bucket=pass", async () => {
    const result = await scoreToneWithMockedAzure("mã", matchedScore);
    expect(result.bucket).toBe("pass");
  });

  it("mismatched mã-as-má → bucket=retry", async () => {
    const result = await scoreToneWithMockedAzure("má", mismatchedScore);
    expect(result.bucket).toBe("retry");
  });

  it("borderline 65 → low-confidence-pass (honest-uncertainty band)", async () => {
    const result = await scoreToneWithMockedAzure("má", 65);
    expect(result.bucket).toBe("low-confidence-pass");
  });
});

// ─────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────

function synthSuccessResponse(score: number) {
  return {
    ok: true,
    score,
    word_scores: [{ word: "(syllable)", score }],
    provider: "azure",
    audio_seconds: 0.6,
    cost_usd_cents: 0.04,
  };
}

async function scoreToneWithMockedAzure(
  targetSyllable: string,
  score: number,
): Promise<ToneScoreResult> {
  return scoreTone({
    audioBlob: buildFakeWavBlob(),
    targetSyllable,
    userJwt: "test-jwt",
    supabaseUrl: "https://test.example.com",
    fetchImpl: vi.fn().mockResolvedValue(
      new Response(JSON.stringify(synthSuccessResponse(score)), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    ) as unknown as typeof fetch,
  });
}

function stripToneMarks(s: string): string {
  // Vietnamese tone marks combine with vowels via Unicode NFC. NFD
  // decomposition splits them; filter the combining diacriticals.
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .normalize("NFC");
}
