// Contract tests for netlify/functions/api-mercy-feedback.ts (issue #3).
//
// Invariants:
//   1. The handler no longer uses SUPABASE_SERVICE_ROLE_KEY — it uses
//      SUPABASE_ANON_KEY, relying on the INSERT RLS policy added in
//      migration 20260718000000_mercy_feedback_events_anon_insert.sql.
//   2. That migration file exists in the repo.
//   3. A POST with valid items inserts them and returns { ok: true, acceptedCount }.
//   4. The 50-item cap is enforced.

import * as fs from "node:fs";
import * as path from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// ── mock @supabase/supabase-js ───────────────────────────────────────────────

const mockInsert = vi.hoisted(() => vi.fn());
const createClient = vi.hoisted(() =>
  vi.fn(() => ({
    from: vi.fn(() => ({ insert: mockInsert })),
  }))
);

vi.mock("@supabase/supabase-js", () => ({ createClient }));

// ── env helpers ─────────────────────────────────────────────────────────────

const REQUIRED_ENV = {
  SUPABASE_URL: "https://project.supabase.co",
  SUPABASE_ANON_KEY: "anon-key",
};

const savedEnv: Record<string, string | undefined> = {};

beforeEach(() => {
  for (const k of Object.keys(REQUIRED_ENV)) {
    savedEnv[k] = process.env[k];
  }
  Object.assign(process.env, REQUIRED_ENV);
  mockInsert.mockResolvedValue({ error: null });
  createClient.mockClear();
  mockInsert.mockClear();
});

afterEach(() => {
  for (const [k, v] of Object.entries(savedEnv)) {
    if (v === undefined) delete process.env[k];
    else process.env[k] = v;
  }
  vi.clearAllMocks();
});

function event(body: unknown, method = "POST") {
  return {
    httpMethod: method,
    headers: {},
    body: JSON.stringify(body),
  };
}

function oneItem() {
  return {
    v: 1,
    ts: 1_000_000,
    appKey: "mercy_blade",
    authUserId: null,
    tier: "level0",
    lang: "vi",
    mode: "room",
    path: "/room/test",
    msgId: "msg_1",
    responseId: "resp_1",
    vote: "up",
    feedbackReason: null,
    answerText: null,
  };
}

// ── static contract checks ───────────────────────────────────────────────────

describe("issue #3 static contract — no SUPABASE_SERVICE_ROLE_KEY", () => {
  it("netlify/functions/api-mercy-feedback.ts does not reference SUPABASE_SERVICE_ROLE_KEY", () => {
    const src = fs.readFileSync(
      path.resolve(__dirname, "../api-mercy-feedback.ts"),
      "utf8",
    );
    expect(src).not.toContain("SUPABASE_SERVICE_ROLE_KEY");
  });

  it("api/mercy-feedback.ts does not reference SUPABASE_SERVICE_ROLE_KEY", () => {
    const src = fs.readFileSync(
      path.resolve(__dirname, "../../../api/mercy-feedback.ts"),
      "utf8",
    );
    expect(src).not.toContain("SUPABASE_SERVICE_ROLE_KEY");
  });

  it("migration 20260718000000_mercy_feedback_events_anon_insert.sql exists", () => {
    const migPath = path.resolve(
      __dirname,
      "../../../supabase/migrations/20260718000000_mercy_feedback_events_anon_insert.sql",
    );
    expect(fs.existsSync(migPath)).toBe(true);
    const sql = fs.readFileSync(migPath, "utf8");
    expect(sql).toContain("mercy_feedback_events_anon_insert");
    expect(sql).toContain("FOR INSERT");
  });
});

// ── handler behaviour ────────────────────────────────────────────────────────

describe("api-mercy-feedback handler", () => {
  it("returns 200 with acceptedCount for valid items", async () => {
    const { handler } = await import("../api-mercy-feedback");
    const res = await handler(
      event({ schema: "mb.feedback.v1", appKey: "mercy_blade", items: [oneItem()] }),
    );
    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body ?? "{}");
    expect(body).toEqual({ ok: true, acceptedCount: 1 });
    expect(mockInsert).toHaveBeenCalledTimes(1);
  });

  it("uses SUPABASE_ANON_KEY when creating the client", async () => {
    const { handler } = await import("../api-mercy-feedback");
    await handler(
      event({ items: [oneItem()] }),
    );
    expect(createClient).toHaveBeenCalledWith(
      REQUIRED_ENV.SUPABASE_URL,
      REQUIRED_ENV.SUPABASE_ANON_KEY,
      expect.any(Object),
    );
  });

  it("caps items at 50", async () => {
    const { handler } = await import("../api-mercy-feedback");
    const items = Array.from({ length: 60 }, (_, i) => ({ ...oneItem(), msgId: `m${i}` }));
    const res = await handler(event({ items }));
    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body ?? "{}");
    expect(body.acceptedCount).toBe(50);
    const insertedRows = mockInsert.mock.calls[0][0] as unknown[];
    expect(insertedRows).toHaveLength(50);
  });

  it("returns 200 acceptedCount:0 when items is empty", async () => {
    const { handler } = await import("../api-mercy-feedback");
    const res = await handler(event({ items: [] }));
    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.body ?? "{}")).toEqual({ ok: true, acceptedCount: 0 });
    expect(mockInsert).not.toHaveBeenCalled();
  });

  it("returns 405 for non-POST", async () => {
    const { handler } = await import("../api-mercy-feedback");
    const res = await handler(event({}, "GET"));
    expect(res.statusCode).toBe(405);
  });

  it("returns 500 supabase_not_configured when anon key missing", async () => {
    delete process.env.SUPABASE_ANON_KEY;
    delete process.env.VITE_SUPABASE_ANON_KEY;
    // Re-import to pick up changed env
    vi.resetModules();
    const { handler } = await import("../api-mercy-feedback");
    const res = await handler(event({ items: [oneItem()] }));
    expect(res.statusCode).toBe(500);
    const body = JSON.parse(res.body ?? "{}");
    expect(body.error).toBe("supabase_not_configured");
  });
});
