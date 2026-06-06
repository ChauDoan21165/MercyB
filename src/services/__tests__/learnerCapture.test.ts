// src/services/__tests__/learnerCapture.test.ts
//
// Flip-safety for the learner-capture CLIENT gate (the browser trust
// boundary). The guarantee the instant LEARNING_CAPTURE_ENABLED flips on:
//
//   - flag OFF  → total no-op: no auth read, no consent read, no dispatch.
//   - anon      → skip; nothing leaves the browser.
//   - no consent→ skip; nothing leaves the browser.
//   - consent   → dispatch, but the body carries NO raw user id and NO
//                 pepper (anonymization is server-only).
//   - always fire-and-forget safe: never throws.
//
// Anonymization (HMAC) + PII scrub are server-side and covered by
// supabase/functions/learner-capture/__tests__/sanitize.test.ts.

import { vi, describe, it, expect, beforeEach } from "vitest";

const h = vi.hoisted(() => {
  return {
    flags: { LEARNING_CAPTURE_ENABLED: false as boolean },
    // controllable supabase surface
    user: null as { id: string } | null,
    getUserImpl: null as null | (() => Promise<unknown>),
    consentRow: null as { consented: boolean } | null,
    consentError: null as unknown,
    invokeResult: { data: { ok: true, id: "row-1" }, error: null as unknown },
    invokeImpl: null as null | (() => Promise<unknown>),
    getUserCalls: 0,
    consentSelectCalls: 0,
    invokeCalls: [] as Array<{ name: string; body: Record<string, unknown> }>,
  };
});

vi.mock("@/lib/featureFlags", () => ({ FEATURE_FLAGS: h.flags }));

vi.mock("@/lib/supabaseClient", () => ({
  supabase: {
    auth: {
      getUser: async () => {
        h.getUserCalls += 1;
        if (h.getUserImpl) return h.getUserImpl();
        return { data: { user: h.user }, error: null };
      },
    },
    from: (_table: string) => ({
      select: (_cols: string) => ({
        eq: (_col: string, _val: string) => ({
          maybeSingle: async () => {
            h.consentSelectCalls += 1;
            return { data: h.consentRow, error: h.consentError };
          },
        }),
      }),
    }),
    functions: {
      invoke: async (name: string, opts: { body: Record<string, unknown> }) => {
        h.invokeCalls.push({ name, body: opts.body });
        if (h.invokeImpl) return h.invokeImpl();
        return h.invokeResult;
      },
    },
  },
}));

import {
  captureCorrection,
  capturePronunciation,
  __resetLearnerCaptureConsentCache,
} from "@/services/learnerCapture";

const USER_ID = "abcdef01-2345-6789-abcd-ef0123456789";

beforeEach(() => {
  h.flags.LEARNING_CAPTURE_ENABLED = false;
  h.user = null;
  h.getUserImpl = null;
  h.consentRow = null;
  h.consentError = null;
  h.invokeResult = { data: { ok: true, id: "row-1" }, error: null };
  h.invokeImpl = null;
  h.getUserCalls = 0;
  h.consentSelectCalls = 0;
  h.invokeCalls = [];
  __resetLearnerCaptureConsentCache();
});

const correction = () =>
  captureCorrection({
    userText: "I goed to school",
    correctedText: "I went to school",
    status: "corrected",
    appliedRuleIds: ["past-tense-irregular"],
    targetLanguage: "en",
  });

describe("flag OFF — the dark default is a total no-op", () => {
  it("returns skipped:flag_off and touches NO network surface", async () => {
    const res = await correction();
    expect(res).toEqual({ ok: true, skipped: true, reason: "flag_off" });
    expect(h.getUserCalls).toBe(0); // no auth read
    expect(h.consentSelectCalls).toBe(0); // no consent read
    expect(h.invokeCalls).toHaveLength(0); // no dispatch
  });

  it("pronunciation capture is also a no-op when the flag is off", async () => {
    const res = await capturePronunciation({
      target: "hello",
      recognized: "hello",
      score: { overallScore: 90, wordScores: [] } as never,
    });
    expect(res).toEqual({ ok: true, skipped: true, reason: "flag_off" });
    expect(h.invokeCalls).toHaveLength(0);
  });
});

describe("flag ON — consent + auth gate before anything leaves the browser", () => {
  beforeEach(() => {
    h.flags.LEARNING_CAPTURE_ENABLED = true;
  });

  it("anon (no signed-in user) → skip, no dispatch", async () => {
    h.user = null;
    const res = await correction();
    expect(res).toEqual({ ok: true, skipped: true, reason: "anon" });
    expect(h.invokeCalls).toHaveLength(0);
  });

  it("signed-in but NOT consented → skip, no dispatch", async () => {
    h.user = { id: USER_ID };
    h.consentRow = { consented: false };
    const res = await correction();
    expect(res).toEqual({ ok: true, skipped: true, reason: "no_consent" });
    expect(h.invokeCalls).toHaveLength(0);
  });

  it("missing consent row → fail-closed skip, no dispatch", async () => {
    h.user = { id: USER_ID };
    h.consentRow = null;
    const res = await correction();
    expect(res).toEqual({ ok: true, skipped: true, reason: "no_consent" });
    expect(h.invokeCalls).toHaveLength(0);
  });

  it("consent read error → fail-closed skip, no dispatch", async () => {
    h.user = { id: USER_ID };
    h.consentRow = null;
    h.consentError = { message: "boom" };
    const res = await correction();
    expect(res.ok).toBe(true);
    expect(h.invokeCalls).toHaveLength(0);
  });
});

describe("flag ON + consented — dispatches, but leaks no identifier", () => {
  beforeEach(() => {
    h.flags.LEARNING_CAPTURE_ENABLED = true;
    h.user = { id: USER_ID };
    h.consentRow = { consented: true };
  });

  it("invokes the learner-capture edge function exactly once", async () => {
    const res = await correction();
    expect(res).toEqual({ ok: true, skipped: false, id: "row-1" });
    expect(h.invokeCalls).toHaveLength(1);
    expect(h.invokeCalls[0].name).toBe("learner-capture");
  });

  it("the dispatched body carries NO raw user id and NO pepper", async () => {
    await correction();
    const body = h.invokeCalls[0].body;
    const serialized = JSON.stringify(body);
    // The browser never sends the user id — the edge fn derives it from the JWT.
    expect(serialized).not.toContain(USER_ID);
    expect("user_id" in body).toBe(false);
    expect("userId" in body).toBe(false);
    // No HMAC pepper / hash is computed client-side.
    expect("learner_hash" in body).toBe(false);
    expect(Object.keys(body).some((k) => /pepper/i.test(k))).toBe(false);
    // It does stamp consent_version + client_ts (the server matches on these).
    expect(typeof body.consent_version).toBe("string");
    expect(typeof body.client_ts).toBe("string");
  });

  it("maps an unchanged+no-rules correction to 'abstained'", async () => {
    await captureCorrection({
      userText: "this is fine",
      status: "unchanged",
      appliedRuleIds: [],
    });
    expect(h.invokeCalls[0].body.correction_status).toBe("abstained");
  });

  it("caches consent — a second capture in the TTL does not re-read consent", async () => {
    await correction();
    await correction();
    expect(h.consentSelectCalls).toBe(1); // cached after the first read
    expect(h.invokeCalls).toHaveLength(2); // both still dispatched
  });
});

describe("empty / malformed input is rejected before any gate", () => {
  beforeEach(() => {
    h.flags.LEARNING_CAPTURE_ENABLED = true;
    h.user = { id: USER_ID };
    h.consentRow = { consented: true };
  });

  it("blank correction text → skipped:empty, no dispatch", async () => {
    const res = await captureCorrection({
      userText: "   ",
      status: "corrected",
      appliedRuleIds: [],
    });
    expect(res).toEqual({ ok: true, skipped: true, reason: "empty" });
    expect(h.invokeCalls).toHaveLength(0);
  });

  it("pronunciation without a wordScores array → skipped:empty", async () => {
    const res = await capturePronunciation({
      target: "hi",
      recognized: "hi",
      score: { overallScore: 50 } as never,
    });
    expect(res).toEqual({ ok: true, skipped: true, reason: "empty" });
    expect(h.invokeCalls).toHaveLength(0);
  });
});

describe("fire-and-forget — never throws, surfaces errors as ok:false", () => {
  beforeEach(() => {
    h.flags.LEARNING_CAPTURE_ENABLED = true;
    h.user = { id: USER_ID };
    h.consentRow = { consented: true };
  });

  it("invoke returning an error → { ok:false }, no throw", async () => {
    h.invokeImpl = async () => ({ data: null, error: { message: "edge down" } });
    const res = await correction();
    expect(res.ok).toBe(false);
  });

  it("invoke throwing → { ok:false }, no throw", async () => {
    h.invokeImpl = async () => {
      throw new Error("network");
    };
    const res = await correction();
    expect(res.ok).toBe(false);
  });

  it("getUser throwing → treated as anon, no dispatch, no throw", async () => {
    h.getUserImpl = async () => {
      throw new Error("auth down");
    };
    const res = await correction();
    expect(res).toEqual({ ok: true, skipped: true, reason: "anon" });
    expect(h.invokeCalls).toHaveLength(0);
  });
});
