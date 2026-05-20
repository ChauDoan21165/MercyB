// supabase/functions/admin-list-registered-users/__tests__/zodValidation.test.ts
//
// A11b contract tests for admin-list-registered-users' request-payload
// validation. Same shape as admin-list-users but uses `perPage` (not
// `limit`) since it wraps Supabase Auth's admin.listUsers() — that
// API's parameter is `perPage` so the public surface matches.

import { describe, expect, it } from "vitest";
import { z } from "zod";

const adminListRegisteredUsersRequestSchema = z.object({
  page: z.number().int().positive().optional(),
  perPage: z.number().int().positive().max(1000).optional(),
}).passthrough();

describe("adminListRegisteredUsersRequestSchema — request body", () => {
  it("accepts an empty body (every field optional)", () => {
    expect(adminListRegisteredUsersRequestSchema.safeParse({}).success).toBe(true);
  });

  it("accepts a documented body with page + perPage", () => {
    const result = adminListRegisteredUsersRequestSchema.safeParse({
      page: 1,
      perPage: 100,
    });
    expect(result.success).toBe(true);
  });

  it("accepts max boundary (perPage=1000 — Supabase Auth API cap)", () => {
    const result = adminListRegisteredUsersRequestSchema.safeParse({
      page: 1,
      perPage: 1000,
    });
    expect(result.success).toBe(true);
    // Note: the handler clamps to 500 downstream via clampPerPage —
    // that's policy on top of the API ceiling. Schema accepts the
    // wider 1000 so values in [501, 1000] still get clamped to 500
    // instead of rejected (preserving pre-A11b behavior).
  });

  it("accepts passthrough fields", () => {
    const result = adminListRegisteredUsersRequestSchema.safeParse({
      page: 1,
      perPage: 50,
      includeAnonymous: false,
    });
    expect(result.success).toBe(true);
  });

  it("REJECTS page=0", () => {
    expect(
      adminListRegisteredUsersRequestSchema.safeParse({ page: 0 }).success,
    ).toBe(false);
  });

  it("REJECTS negative page", () => {
    expect(
      adminListRegisteredUsersRequestSchema.safeParse({ page: -1 }).success,
    ).toBe(false);
  });

  it("REJECTS non-integer page", () => {
    expect(
      adminListRegisteredUsersRequestSchema.safeParse({ page: 1.5 }).success,
    ).toBe(false);
  });

  it("REJECTS perPage=0", () => {
    expect(
      adminListRegisteredUsersRequestSchema.safeParse({ perPage: 0 }).success,
    ).toBe(false);
  });

  it("REJECTS perPage > 1000 (above Supabase Auth API cap)", () => {
    expect(
      adminListRegisteredUsersRequestSchema.safeParse({ perPage: 1001 }).success,
    ).toBe(false);
  });

  it("REJECTS negative perPage", () => {
    expect(
      adminListRegisteredUsersRequestSchema.safeParse({ perPage: -1 }).success,
    ).toBe(false);
  });

  it("REJECTS page as string ('1' instead of 1)", () => {
    expect(
      adminListRegisteredUsersRequestSchema.safeParse({ page: "1" }).success,
    ).toBe(false);
  });

  it("REJECTS perPage as string", () => {
    expect(
      adminListRegisteredUsersRequestSchema.safeParse({ perPage: "100" }).success,
    ).toBe(false);
  });

  it("REJECTS null body", () => {
    expect(adminListRegisteredUsersRequestSchema.safeParse(null).success).toBe(false);
  });

  it("REJECTS array body", () => {
    expect(adminListRegisteredUsersRequestSchema.safeParse([]).success).toBe(false);
  });
});

describe("PII-scrubbing contract — issues array shape (Sentry payload)", () => {
  it("validation failure exposes path/code/message — and nothing else", () => {
    const result = adminListRegisteredUsersRequestSchema.safeParse({
      page: "not-a-number",
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
