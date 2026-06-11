// @vitest-environment node
//
// Consent gate for cloudScorer.logTelemetry.
//
// Verifies that `pronunciation_scored` is forwarded to trackEvent only when
// marketing consent is ON, and that the payload has the expected shape.
// Both the cloud-success path (provider="azure") and local-fallback path
// (provider="local", sentinel use_local:true) are exercised.

import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/audio/wavEncoder", () => ({
  blobToWavPcm16k: vi.fn(),
}));

vi.mock("@/lib/analytics", () => ({
  trackEvent: vi.fn(),
}));

vi.mock("@/services/behaviorTrackingFlag", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("@/services/behaviorTrackingFlag")>();
  return { ...actual, isMarketingTrackingEnabled: vi.fn().mockReturnValue(true) };
});

import { blobToWavPcm16k } from "@/lib/audio/wavEncoder";
import { scoreCloud } from "../cloudScorer";
import { trackEvent } from "@/lib/analytics";
import { isMarketingTrackingEnabled } from "@/services/behaviorTrackingFlag";

const blobMock = vi.mocked(blobToWavPcm16k);
const trackEventMock = vi.mocked(trackEvent);
const isConsentMock = vi.mocked(isMarketingTrackingEnabled);

// Declare after imports so Node.js Blob global is in scope (same pattern as
// the existing cloudScorer.test.ts which uses FAKE_WAV at module level).
const FAKE_WAV = new Blob([new Uint8Array(44 + 64)], { type: "audio/wav" });
const RECORDED_BLOB = new Blob([new Uint8Array(4)], { type: "audio/webm" });

const CLOUD_SUCCESS_BODY = {
  ok: true,
  score: 82,
  provider: "azure",
  audio_seconds: 1.2,
  cost_usd_cents: 0.04,
  word_scores: [{ word: "hello", score: 82, status: "correct", phonemes: [] }],
};

const SENTINEL_USE_LOCAL = {
  ok: false,
  use_local: true,
  reason: "daily_cap_reached",
};

function mockFetch(body: object, status = 200) {
  return vi.fn().mockResolvedValue(new Response(JSON.stringify(body), { status }));
}

const BASE_INPUT = {
  audioBlob: RECORDED_BLOB,
  target: "hello",
  userJwt: "jwt",
  transcript: "hello",
  supabaseUrl: "https://test.supabase.co",
} as const;

beforeEach(() => {
  vi.clearAllMocks();
  blobMock.mockResolvedValue(FAKE_WAV);
  isConsentMock.mockReturnValue(true);
});

describe("cloudScorer logTelemetry — consent gate (cloud success path)", () => {
  it("fires pronunciation_scored to trackEvent when consent is ON", async () => {
    isConsentMock.mockReturnValue(true);
    await scoreCloud({ ...BASE_INPUT, fetchImpl: mockFetch(CLOUD_SUCCESS_BODY) });
    expect(trackEventMock).toHaveBeenCalledWith(
      "pronunciation_scored",
      expect.objectContaining({ provider: "azure" }),
    );
  });

  it("does NOT call trackEvent when consent is OFF", async () => {
    isConsentMock.mockReturnValue(false);
    await scoreCloud({ ...BASE_INPUT, fetchImpl: mockFetch(CLOUD_SUCCESS_BODY) });
    expect(trackEventMock).not.toHaveBeenCalled();
  });

  it("payload.latency_ms is a non-negative integer", async () => {
    await scoreCloud({ ...BASE_INPUT, fetchImpl: mockFetch(CLOUD_SUCCESS_BODY) });
    const payload = trackEventMock.mock.calls[0]![1] as Record<string, unknown>;
    expect(typeof payload.latency_ms).toBe("number");
    expect(Number.isInteger(payload.latency_ms)).toBe(true);
    expect((payload.latency_ms as number) >= 0).toBe(true);
  });

  it("payload.provider is 'azure' on cloud success", async () => {
    await scoreCloud({ ...BASE_INPUT, fetchImpl: mockFetch(CLOUD_SUCCESS_BODY) });
    const payload = trackEventMock.mock.calls[0]![1] as Record<string, unknown>;
    expect(payload.provider).toBe("azure");
  });

  it("payload has no 'reason' field on clean cloud success", async () => {
    await scoreCloud({ ...BASE_INPUT, fetchImpl: mockFetch(CLOUD_SUCCESS_BODY) });
    const payload = trackEventMock.mock.calls[0]![1] as Record<string, unknown>;
    expect("reason" in payload).toBe(false);
  });
});

describe("cloudScorer logTelemetry — consent gate (local fallback path)", () => {
  it("fires provider='local' on use_local sentinel when consent is ON", async () => {
    await scoreCloud({ ...BASE_INPUT, fetchImpl: mockFetch(SENTINEL_USE_LOCAL) });
    expect(trackEventMock).toHaveBeenCalledWith(
      "pronunciation_scored",
      expect.objectContaining({ provider: "local" }),
    );
  });

  it("does NOT call trackEvent on local fallback when consent is OFF", async () => {
    isConsentMock.mockReturnValue(false);
    await scoreCloud({ ...BASE_INPUT, fetchImpl: mockFetch(SENTINEL_USE_LOCAL) });
    expect(trackEventMock).not.toHaveBeenCalled();
  });

  it("payload.reason is a non-empty string on local fallback", async () => {
    await scoreCloud({ ...BASE_INPUT, fetchImpl: mockFetch(SENTINEL_USE_LOCAL) });
    const payload = trackEventMock.mock.calls[0]![1] as Record<string, unknown>;
    expect(typeof payload.reason).toBe("string");
    expect((payload.reason as string).length).toBeGreaterThan(0);
  });
});
