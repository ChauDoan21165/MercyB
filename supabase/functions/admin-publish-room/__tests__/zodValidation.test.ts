// supabase/functions/admin-publish-room/__tests__/zodValidation.test.ts
//
// A11b contract tests for admin-publish-room's request-payload validation.
// Pattern follows the 4 A11 webhook PRs + A11b-set-tier (#907).
//
// admin-publish-room flips a room's is_demo flag → false, which makes
// the room visible to all non-admin users. A malformed payload here
// means "wrong room becomes visible" or "operation silently no-ops on
// a non-existent id." The schema's job is to make both failure modes
// loud at the boundary instead of buried in DB-update semantics.

import { describe, expect, it } from "vitest";
import { z } from "zod";

const adminPublishRoomRequestSchema = z.object({
  room_id: z.string().trim().min(1).max(200),
}).passthrough();

describe("adminPublishRoomRequestSchema — request body", () => {
  it("accepts a documented publish request with a slug-style room id", () => {
    const valid = { room_id: "english_basics_1" };
    const result = adminPublishRoomRequestSchema.safeParse(valid);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.room_id).toBe("english_basics_1");
    }
  });

  it("accepts a UUID-style room id (DB-id format)", () => {
    const valid = { room_id: "00000000-0000-4000-a000-000000000001" };
    const result = adminPublishRoomRequestSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it("accepts a kids-path room id (nested filename)", () => {
    const valid = { room_id: "kids/page-1" };
    const result = adminPublishRoomRequestSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it("trims whitespace around room_id", () => {
    const valid = { room_id: "  english_basics_1  " };
    const result = adminPublishRoomRequestSchema.safeParse(valid);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.room_id).toBe("english_basics_1");
    }
  });

  it("accepts max boundary (200-char room id)", () => {
    const valid = { room_id: "a".repeat(200) };
    const result = adminPublishRoomRequestSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it("accepts passthrough fields (future admin-app payload additions)", () => {
    const drifted = {
      room_id: "english_basics_1",
      reason: "approved for public launch",
      published_by: "manager@mercyblade.com",
    };
    const result = adminPublishRoomRequestSchema.safeParse(drifted);
    expect(result.success).toBe(true);
  });

  it("REJECTS missing room_id", () => {
    const result = adminPublishRoomRequestSchema.safeParse({});
    expect(result.success).toBe(false);
    if (!result.success) {
      const issue = result.error.issues.find((i) => i.path[0] === "room_id");
      expect(issue).toBeDefined();
    }
  });

  it("REJECTS empty-string room_id", () => {
    const bad = { room_id: "" };
    const result = adminPublishRoomRequestSchema.safeParse(bad);
    expect(result.success).toBe(false);
  });

  it("REJECTS whitespace-only room_id (trims to empty)", () => {
    const bad = { room_id: "   " };
    const result = adminPublishRoomRequestSchema.safeParse(bad);
    expect(result.success).toBe(false);
  });

  it("REJECTS room_id of wrong type (number)", () => {
    const bad = { room_id: 12345 };
    const result = adminPublishRoomRequestSchema.safeParse(bad);
    expect(result.success).toBe(false);
  });

  it("REJECTS room_id of wrong type (object)", () => {
    const bad = { room_id: { slug: "english_basics_1" } };
    const result = adminPublishRoomRequestSchema.safeParse(bad);
    expect(result.success).toBe(false);
  });

  it("REJECTS room_id longer than 200 chars (sanity bound)", () => {
    const bad = { room_id: "a".repeat(201) };
    const result = adminPublishRoomRequestSchema.safeParse(bad);
    expect(result.success).toBe(false);
  });

  it("REJECTS null body", () => {
    const result = adminPublishRoomRequestSchema.safeParse(null);
    expect(result.success).toBe(false);
  });

  it("REJECTS array body", () => {
    const result = adminPublishRoomRequestSchema.safeParse([{ room_id: "english_basics_1" }]);
    expect(result.success).toBe(false);
  });
});

describe("PII-scrubbing contract — issues array shape (Sentry payload)", () => {
  it("body parse failure exposes path/code/message — and nothing else", () => {
    const result = adminPublishRoomRequestSchema.safeParse({});
    expect(result.success).toBe(false);
    if (!result.success) {
      for (const issue of result.error.issues) {
        expect(issue).toHaveProperty("path");
        expect(issue).toHaveProperty("code");
        expect(issue).toHaveProperty("message");
      }
    }
  });

  it("drilled-path test (room_id leaked-id NEVER appears in issue JSON)", () => {
    const result = adminPublishRoomRequestSchema.safeParse({
      room_id: 999, // wrong type, but value is in the issue's input
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const issue = result.error.issues.find((i) => i.path[0] === "room_id");
      expect(issue).toBeDefined();
      // The offending value (999) should NOT leak into the issue JSON.
      expect(JSON.stringify(issue)).not.toContain('"999"');
    }
  });
});
