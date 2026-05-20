// supabase/functions/admin-set-tier/__tests__/zodValidation.test.ts
//
// A11b contract tests for the zod schema backing admin-set-tier's
// request-payload validation. Pattern follows the 4 webhook PRs
// (#886/#891/#893/#895): schema-level unit tests against an in-test
// mirror of _shared/adminSchemas.ts.
//
// The schema gates one of the highest-risk admin RPCs in the system:
// admin-set-tier modifies user_subscriptions, writes log_security_event,
// writes log_admin_access, and fires auditLog — every record carries
// the target user_id and the granted tier_name/days. A malformed
// payload here means "wrong user granted premium" or "tier set for
// 9999 days" — silently corrupted state, hard to detect later.

import { describe, expect, it } from "vitest";
import { z } from "zod";

const adminSetTierRequestSchema = z.object({
  user_id: z.string().uuid(),
  tier_name: z.string().trim().min(1).max(50),
  days: z.number().int().positive().max(365),
}).passthrough();

const VALID_UUID = "00000000-0000-4000-a000-000000000001";

describe("adminSetTierRequestSchema — request body", () => {
  it("accepts a documented set-tier request", () => {
    const valid = {
      user_id: VALID_UUID,
      tier_name: "premium",
      days: 30,
    };
    const result = adminSetTierRequestSchema.safeParse(valid);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.user_id).toBe(VALID_UUID);
      expect(result.data.tier_name).toBe("premium");
      expect(result.data.days).toBe(30);
    }
  });

  it("trims tier_name whitespace", () => {
    const valid = {
      user_id: VALID_UUID,
      tier_name: "  premium  ",
      days: 30,
    };
    const result = adminSetTierRequestSchema.safeParse(valid);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.tier_name).toBe("premium");
    }
  });

  it("accepts max boundary values (days=365, tier_name=50-char)", () => {
    const valid = {
      user_id: VALID_UUID,
      tier_name: "a".repeat(50),
      days: 365,
    };
    const result = adminSetTierRequestSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it("accepts passthrough fields (future admin-app payload additions)", () => {
    const drifted = {
      user_id: VALID_UUID,
      tier_name: "premium",
      days: 30,
      // Hypothetical future fields the admin app might add
      reason: "manual grant from support ticket #12345",
      audit_note: "approved by manager",
    };
    const result = adminSetTierRequestSchema.safeParse(drifted);
    expect(result.success).toBe(true);
  });

  it("REJECTS non-UUID user_id (catches the worst class of bug — wrong user gets premium)", () => {
    const bad = {
      user_id: "not-a-uuid",
      tier_name: "premium",
      days: 30,
    };
    const result = adminSetTierRequestSchema.safeParse(bad);
    expect(result.success).toBe(false);
    if (!result.success) {
      const issue = result.error.issues.find((i) => i.path[0] === "user_id");
      expect(issue).toBeDefined();
    }
  });

  it("REJECTS missing user_id", () => {
    const bad = { tier_name: "premium", days: 30 };
    const result = adminSetTierRequestSchema.safeParse(bad);
    expect(result.success).toBe(false);
  });

  it("REJECTS missing tier_name", () => {
    const bad = { user_id: VALID_UUID, days: 30 };
    const result = adminSetTierRequestSchema.safeParse(bad);
    expect(result.success).toBe(false);
  });

  it("REJECTS empty-string tier_name", () => {
    const bad = { user_id: VALID_UUID, tier_name: "", days: 30 };
    const result = adminSetTierRequestSchema.safeParse(bad);
    expect(result.success).toBe(false);
  });

  it("REJECTS whitespace-only tier_name (after trim → empty)", () => {
    const bad = { user_id: VALID_UUID, tier_name: "   ", days: 30 };
    const result = adminSetTierRequestSchema.safeParse(bad);
    expect(result.success).toBe(false);
  });

  it("REJECTS tier_name longer than 50 chars", () => {
    const bad = {
      user_id: VALID_UUID,
      tier_name: "a".repeat(51),
      days: 30,
    };
    const result = adminSetTierRequestSchema.safeParse(bad);
    expect(result.success).toBe(false);
  });

  it("REJECTS missing days", () => {
    const bad = { user_id: VALID_UUID, tier_name: "premium" };
    const result = adminSetTierRequestSchema.safeParse(bad);
    expect(result.success).toBe(false);
  });

  it("REJECTS days=0 (positive-only)", () => {
    const bad = { user_id: VALID_UUID, tier_name: "premium", days: 0 };
    const result = adminSetTierRequestSchema.safeParse(bad);
    expect(result.success).toBe(false);
  });

  it("REJECTS negative days", () => {
    const bad = { user_id: VALID_UUID, tier_name: "premium", days: -1 };
    const result = adminSetTierRequestSchema.safeParse(bad);
    expect(result.success).toBe(false);
  });

  it("REJECTS non-integer days (3.5 days)", () => {
    const bad = { user_id: VALID_UUID, tier_name: "premium", days: 3.5 };
    const result = adminSetTierRequestSchema.safeParse(bad);
    expect(result.success).toBe(false);
  });

  it("REJECTS days > 365 (catches '9999 days forever' class bug)", () => {
    const bad = { user_id: VALID_UUID, tier_name: "premium", days: 9999 };
    const result = adminSetTierRequestSchema.safeParse(bad);
    expect(result.success).toBe(false);
  });

  it("REJECTS days as string ('30' instead of 30)", () => {
    const bad = { user_id: VALID_UUID, tier_name: "premium", days: "30" };
    const result = adminSetTierRequestSchema.safeParse(bad);
    expect(result.success).toBe(false);
  });

  it("REJECTS null body", () => {
    const result = adminSetTierRequestSchema.safeParse(null);
    expect(result.success).toBe(false);
  });

  it("REJECTS array body", () => {
    const result = adminSetTierRequestSchema.safeParse([
      { user_id: VALID_UUID, tier_name: "premium", days: 30 },
    ]);
    expect(result.success).toBe(false);
  });
});

describe("PII-scrubbing contract — issues array shape (Sentry payload)", () => {
  // Same contract locked across all A11/A11b PRs. On parse failure the
  // handler ships ONLY `error.issues.map(...)` + the top-level key list
  // to Sentry. NEVER the raw body (which carries the target user UUID).
  it("body parse failure exposes path/code/message — and nothing else", () => {
    const result = adminSetTierRequestSchema.safeParse({
      user_id: "not-a-uuid",
      tier_name: "",
      days: -1,
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.length).toBeGreaterThanOrEqual(1);
      for (const issue of result.error.issues) {
        expect(issue).toHaveProperty("path");
        expect(issue).toHaveProperty("code");
        expect(issue).toHaveProperty("message");
      }
    }
  });

  it("nested-field failure exposes drilled path (catches 'value leaks into Sentry')", () => {
    const result = adminSetTierRequestSchema.safeParse({
      user_id: "leaked-target-user-not-a-uuid",
      tier_name: "premium",
      days: 30,
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const issue = result.error.issues.find((i) => i.path[0] === "user_id");
      expect(issue).toBeDefined();
      // The offending value must NOT appear in the issue JSON —
      // otherwise the target user UUID would leak to Sentry.
      expect(JSON.stringify(issue)).not.toContain("leaked-target-user-not-a-uuid");
    }
  });
});
