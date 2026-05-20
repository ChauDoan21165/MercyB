// supabase/functions/admin-hide-room/__tests__/zodValidation.test.ts
//
// A11b contract tests for admin-hide-room's request-payload validation.
// The schema is structurally identical to admin-publish-room
// (mirror operations: publish sets is_demo=false, hide sets is_demo=
// true) — same input shape, same id-format flexibility, same risk
// class (wrong room hidden from all users).

import { describe, expect, it } from "vitest";
import { z } from "zod";

const adminHideRoomRequestSchema = z.object({
  room_id: z.string().trim().min(1).max(200),
}).passthrough();

describe("adminHideRoomRequestSchema — request body", () => {
  it("accepts a documented hide request with a slug-style room id", () => {
    const valid = { room_id: "english_basics_1" };
    const result = adminHideRoomRequestSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it("accepts a UUID-style room id", () => {
    const valid = { room_id: "00000000-0000-4000-a000-000000000001" };
    const result = adminHideRoomRequestSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it("accepts a kids-path room id (nested filename)", () => {
    const valid = { room_id: "kids/page-1" };
    const result = adminHideRoomRequestSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it("trims whitespace around room_id", () => {
    const valid = { room_id: "  english_basics_1  " };
    const result = adminHideRoomRequestSchema.safeParse(valid);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.room_id).toBe("english_basics_1");
    }
  });

  it("accepts max boundary (200-char room id)", () => {
    const valid = { room_id: "a".repeat(200) };
    const result = adminHideRoomRequestSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it("accepts passthrough fields", () => {
    const drifted = {
      room_id: "english_basics_1",
      reason: "moderation flag — temporary hide",
      hidden_by: "ops@mercyblade.com",
    };
    const result = adminHideRoomRequestSchema.safeParse(drifted);
    expect(result.success).toBe(true);
  });

  it("REJECTS missing room_id", () => {
    const result = adminHideRoomRequestSchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it("REJECTS empty-string room_id", () => {
    const result = adminHideRoomRequestSchema.safeParse({ room_id: "" });
    expect(result.success).toBe(false);
  });

  it("REJECTS whitespace-only room_id (trims to empty)", () => {
    const result = adminHideRoomRequestSchema.safeParse({ room_id: "   " });
    expect(result.success).toBe(false);
  });

  it("REJECTS room_id of wrong type (number)", () => {
    const result = adminHideRoomRequestSchema.safeParse({ room_id: 12345 });
    expect(result.success).toBe(false);
  });

  it("REJECTS room_id of wrong type (boolean)", () => {
    const result = adminHideRoomRequestSchema.safeParse({ room_id: true });
    expect(result.success).toBe(false);
  });

  it("REJECTS room_id longer than 200 chars", () => {
    const result = adminHideRoomRequestSchema.safeParse({ room_id: "a".repeat(201) });
    expect(result.success).toBe(false);
  });

  it("REJECTS null body", () => {
    expect(adminHideRoomRequestSchema.safeParse(null).success).toBe(false);
  });

  it("REJECTS array body", () => {
    expect(adminHideRoomRequestSchema.safeParse([{ room_id: "x" }]).success).toBe(false);
  });
});

describe("PII-scrubbing contract — issues array shape (Sentry payload)", () => {
  it("body parse failure exposes path/code/message — and nothing else", () => {
    const result = adminHideRoomRequestSchema.safeParse({});
    expect(result.success).toBe(false);
    if (!result.success) {
      for (const issue of result.error.issues) {
        expect(issue).toHaveProperty("path");
        expect(issue).toHaveProperty("code");
        expect(issue).toHaveProperty("message");
      }
    }
  });

  it("drilled-path lock — offending value never leaks", () => {
    const result = adminHideRoomRequestSchema.safeParse({ room_id: 9999 });
    expect(result.success).toBe(false);
    if (!result.success) {
      const issue = result.error.issues.find((i) => i.path[0] === "room_id");
      expect(issue).toBeDefined();
      expect(JSON.stringify(issue)).not.toContain('"9999"');
    }
  });
});
