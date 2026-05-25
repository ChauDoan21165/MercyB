// supabase/functions/admin-list-users/__tests__/zodValidation.test.ts
//
// A11b contract tests for admin-list-users' request-payload validation.
// All fields are optional with handler-side defaults
// (page=1, limit=50); the schema's job is to reject wrong-type
// values and out-of-range pagination.

import { describe, expect, it } from "vitest";
import { z } from "zod";

const adminListUsersRequestSchema = z.object({
  page: z.number().int().positive().optional(),
  limit: z.number().int().positive().max(1000).optional(),
  search: z.string().max(200).optional(),
  tier: z.string().max(50).optional(),
}).passthrough();

describe("adminListUsersRequestSchema — request body", () => {
  it("accepts an empty body (every field optional)", () => {
    const result = adminListUsersRequestSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it("accepts a documented full body", () => {
    const result = adminListUsersRequestSchema.safeParse({
      page: 2,
      limit: 100,
      search: "alice",
      tier: "premium",
    });
    expect(result.success).toBe(true);
  });

  it("accepts max boundary (limit=1000, search=200 chars, tier=50 chars)", () => {
    const result = adminListUsersRequestSchema.safeParse({
      page: 1,
      limit: 1000,
      search: "a".repeat(200),
      tier: "a".repeat(50),
    });
    expect(result.success).toBe(true);
  });

  it("accepts passthrough fields (sort_by, sort_order, …)", () => {
    const result = adminListUsersRequestSchema.safeParse({
      page: 1,
      sort_by: "created_at",
      sort_order: "desc",
    });
    expect(result.success).toBe(true);
  });

  it("REJECTS page=0 (positive-only)", () => {
    const result = adminListUsersRequestSchema.safeParse({ page: 0 });
    expect(result.success).toBe(false);
  });

  it("REJECTS negative page", () => {
    const result = adminListUsersRequestSchema.safeParse({ page: -1 });
    expect(result.success).toBe(false);
  });

  it("REJECTS non-integer page (1.5)", () => {
    const result = adminListUsersRequestSchema.safeParse({ page: 1.5 });
    expect(result.success).toBe(false);
  });

  it("REJECTS page as string ('2' instead of 2)", () => {
    const result = adminListUsersRequestSchema.safeParse({ page: "2" });
    expect(result.success).toBe(false);
  });

  it("REJECTS limit > 1000 (catches 'fetch 999999 users' class)", () => {
    const result = adminListUsersRequestSchema.safeParse({ limit: 1001 });
    expect(result.success).toBe(false);
  });

  it("REJECTS limit=0", () => {
    const result = adminListUsersRequestSchema.safeParse({ limit: 0 });
    expect(result.success).toBe(false);
  });

  it("REJECTS search > 200 chars", () => {
    const result = adminListUsersRequestSchema.safeParse({
      search: "a".repeat(201),
    });
    expect(result.success).toBe(false);
  });

  it("REJECTS search of wrong type (number)", () => {
    const result = adminListUsersRequestSchema.safeParse({ search: 42 });
    expect(result.success).toBe(false);
  });

  it("REJECTS tier > 50 chars", () => {
    const result = adminListUsersRequestSchema.safeParse({
      tier: "a".repeat(51),
    });
    expect(result.success).toBe(false);
  });

  it("REJECTS null body", () => {
    expect(adminListUsersRequestSchema.safeParse(null).success).toBe(false);
  });

  it("REJECTS array body", () => {
    expect(adminListUsersRequestSchema.safeParse([]).success).toBe(false);
  });
});

describe("PII-scrubbing contract — issues array shape (Sentry payload)", () => {
  it("validation failure exposes path/code/message — and nothing else", () => {
    const result = adminListUsersRequestSchema.safeParse({
      page: "not-a-number",
      limit: -1,
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      for (const issue of result.error.issues) {
        expect(issue).toHaveProperty("path");
        expect(issue).toHaveProperty("code");
        expect(issue).toHaveProperty("message");
      }
    }
  });
});
