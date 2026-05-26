// src/lib/export/__tests__/progressExport.test.ts
//
// Step 11 — pure-function tests for the CSV/JSON serializers. The
// Supabase round-trip path is covered by manual smoke + the RLS layer
// itself; we don't re-mock the client here. The interesting code is
// the CSV escaping + filename derivation + bundle shape.

import { describe, it, expect, vi } from "vitest";

vi.mock("@/lib/supabaseClient", () => ({
  // The serializer tests don't touch supabase. Stub the import so the
  // module loads without SUPABASE_URL during vitest setup.
  supabase: {
    from: () => ({
      select: () => ({
        eq: () => ({ maybeSingle: () => Promise.resolve({ data: null, error: null }) }),
      }),
    }),
  },
}));

import {
  bundleToCsv,
  bundleToJson,
  type ProgressExportBundle,
} from "../progressExport";

const fixture = (
  overrides: Partial<ProgressExportBundle> = {},
): ProgressExportBundle => ({
  exported_at: "2026-04-25T12:00:00Z",
  profile: {
    user_id: "u1",
    username: "chau",
    streak_current: 12,
    streak_longest: 47,
    total_xp: 2400,
    lessons_completed: 36,
  },
  rooms: [
    { room_id: "ai_free", progress_pct: 100, last_seen_at: "2026-04-24T10:30:00Z" },
    { room_id: "grammar_foundations_free", progress_pct: 60, last_seen_at: "2026-04-22T09:00:00Z" },
  ],
  weaknesses: [
    { tag: "vi_l1_3rd_person_s", mistakes_count: 8, last_seen_at: "2026-04-20T11:00:00Z" },
    { tag: "vi_l1_past_ed", mistakes_count: 5, last_seen_at: "2026-04-19T15:00:00Z" },
  ],
  ...overrides,
});

describe("bundleToCsv", () => {
  it("includes the three required sections (Profile, Rooms, Weakness)", () => {
    const csv = bundleToCsv(fixture());
    expect(csv).toContain("# Profile");
    expect(csv).toContain("# Rooms");
    expect(csv).toContain("# Weakness areas");
  });

  it("renders the exported_at timestamp", () => {
    const csv = bundleToCsv(fixture());
    expect(csv).toContain("2026-04-25T12:00:00Z");
  });

  it("emits the profile row with the right column order", () => {
    const csv = bundleToCsv(fixture());
    const lines = csv.split("\n");
    const headerIdx = lines.indexOf("user_id,username,streak_current,streak_longest,total_xp,lessons_completed");
    expect(headerIdx).toBeGreaterThan(-1);
    expect(lines[headerIdx + 1]).toBe("u1,chau,12,47,2400,36");
  });

  it("escapes a username containing a comma", () => {
    const csv = bundleToCsv(
      fixture({
        profile: { ...fixture().profile, username: "chau, the founder" },
      }),
    );
    expect(csv).toContain('u1,"chau, the founder",12,47,2400,36');
  });

  it("escapes embedded double-quotes by doubling them", () => {
    const csv = bundleToCsv(
      fixture({
        weaknesses: [
          { tag: 'tag with "quotes"', mistakes_count: 1, last_seen_at: null },
        ],
      }),
    );
    expect(csv).toContain('"tag with ""quotes""",1,');
  });

  it("renders an empty rooms section without breaking the format", () => {
    const csv = bundleToCsv(fixture({ rooms: [] }));
    expect(csv).toContain("room_id,progress_pct,last_seen_at");
    // No room rows after the header — the next non-empty line is the
    // weakness section header.
    const lines = csv.split("\n");
    const roomHeaderIdx = lines.indexOf("room_id,progress_pct,last_seen_at");
    // The line right after the header should be empty (separator) or
    // the weakness section comment.
    const next = lines[roomHeaderIdx + 1];
    expect(next === "" || next.startsWith("#")).toBe(true);
  });

  it("emits empty string for null last_seen_at, not 'null'", () => {
    const csv = bundleToCsv(
      fixture({
        rooms: [{ room_id: "x", progress_pct: 50, last_seen_at: null }],
      }),
    );
    expect(csv).toContain("x,50,");
    expect(csv).not.toContain("null,");
  });
});

describe("bundleToJson", () => {
  it("round-trips through JSON.parse losslessly", () => {
    const bundle = fixture();
    const round = JSON.parse(bundleToJson(bundle));
    expect(round).toEqual(bundle);
  });

  it("pretty-prints with 2-space indent (human-readable)", () => {
    const json = bundleToJson(fixture());
    expect(json).toMatch(/^\{\n {2}"exported_at"/);
  });

  it("includes all three top-level sections", () => {
    const json = bundleToJson(fixture());
    expect(json).toContain('"profile"');
    expect(json).toContain('"rooms"');
    expect(json).toContain('"weaknesses"');
  });
});

describe("PII surface", () => {
  it("CSV does NOT include email, phone, or full_name fields", () => {
    const csv = bundleToCsv(fixture());
    expect(csv.toLowerCase()).not.toContain("email");
    expect(csv.toLowerCase()).not.toContain("phone");
    expect(csv.toLowerCase()).not.toContain("full_name");
  });

  it("JSON does NOT leak email/phone/full_name keys", () => {
    const json = bundleToJson(fixture());
    expect(json.toLowerCase()).not.toContain("email");
    expect(json.toLowerCase()).not.toContain("phone");
    expect(json.toLowerCase()).not.toContain("full_name");
  });
});
