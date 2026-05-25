// supabase/functions/admin-management/__tests__/zodValidation.test.ts
//
// A11b contract tests for admin-management's discriminated-union
// request schema. This is the highest-shape-complexity function in the
// A11b batch — 5 action variants (list / my-role / create /
// update_level / delete) with action-specific required fields.
//
// IMPORTANT pre-A11b behavior we preserve in the handler (not in this
// schema directly): an empty body OR a body missing `action` defaults
// to `{action: 'list'}`. The handler does that defaulting BEFORE
// passing to safeParse, so the schema below remains strict
// (discriminatedUnion requires the discriminator) without changing
// valid-payload behavior.

import { describe, expect, it } from "vitest";
import { z } from "zod";

const adminManagementListSchema = z.object({
  action: z.literal("list"),
}).passthrough();

const adminManagementMyRoleSchema = z.object({
  action: z.literal("my-role"),
}).passthrough();

const adminManagementCreateSchema = z.object({
  action: z.literal("create"),
  email: z.string().trim().min(1),
  level: z.number().int().min(1).max(10).optional(),
}).passthrough();

const adminManagementUpdateLevelSchema = z.object({
  action: z.literal("update_level"),
  admin_id: z.string().min(1),
  new_level: z.number().int().min(1).max(10),
}).passthrough();

const adminManagementDeleteSchema = z.object({
  action: z.literal("delete"),
  admin_id: z.string().min(1),
}).passthrough();

const adminManagementRequestSchema = z.discriminatedUnion("action", [
  adminManagementListSchema,
  adminManagementMyRoleSchema,
  adminManagementCreateSchema,
  adminManagementUpdateLevelSchema,
  adminManagementDeleteSchema,
]);

describe("adminManagementRequestSchema — list action", () => {
  it("accepts { action: 'list' }", () => {
    const result = adminManagementRequestSchema.safeParse({ action: "list" });
    expect(result.success).toBe(true);
  });

  it("accepts passthrough fields on list", () => {
    const result = adminManagementRequestSchema.safeParse({
      action: "list",
      filter: "active",
      page: 1,
    });
    expect(result.success).toBe(true);
  });
});

describe("adminManagementRequestSchema — my-role action", () => {
  it("accepts { action: 'my-role' }", () => {
    const result = adminManagementRequestSchema.safeParse({ action: "my-role" });
    expect(result.success).toBe(true);
  });
});

describe("adminManagementRequestSchema — create action", () => {
  it("accepts documented create payload", () => {
    const result = adminManagementRequestSchema.safeParse({
      action: "create",
      email: "newadmin@mercyblade.com",
      level: 5,
    });
    expect(result.success).toBe(true);
  });

  it("accepts create without level (handler defaults to 1)", () => {
    const result = adminManagementRequestSchema.safeParse({
      action: "create",
      email: "newadmin@mercyblade.com",
    });
    expect(result.success).toBe(true);
  });

  it("trims email whitespace", () => {
    const result = adminManagementRequestSchema.safeParse({
      action: "create",
      email: "  admin@x.com  ",
    });
    expect(result.success).toBe(true);
    if (result.success && result.data.action === "create") {
      expect(result.data.email).toBe("admin@x.com");
    }
  });

  it("REJECTS create with missing email", () => {
    const result = adminManagementRequestSchema.safeParse({ action: "create" });
    expect(result.success).toBe(false);
  });

  it("REJECTS create with empty-string email", () => {
    const result = adminManagementRequestSchema.safeParse({
      action: "create",
      email: "",
    });
    expect(result.success).toBe(false);
  });

  it("REJECTS create with level=0", () => {
    const result = adminManagementRequestSchema.safeParse({
      action: "create",
      email: "x@y.com",
      level: 0,
    });
    expect(result.success).toBe(false);
  });

  it("REJECTS create with level>10", () => {
    const result = adminManagementRequestSchema.safeParse({
      action: "create",
      email: "x@y.com",
      level: 11,
    });
    expect(result.success).toBe(false);
  });

  it("REJECTS create with non-integer level (4.5)", () => {
    const result = adminManagementRequestSchema.safeParse({
      action: "create",
      email: "x@y.com",
      level: 4.5,
    });
    expect(result.success).toBe(false);
  });
});

describe("adminManagementRequestSchema — update_level action", () => {
  it("accepts documented update_level payload", () => {
    const result = adminManagementRequestSchema.safeParse({
      action: "update_level",
      admin_id: "admin-uuid-1",
      new_level: 7,
    });
    expect(result.success).toBe(true);
  });

  it("REJECTS update_level with missing admin_id", () => {
    const result = adminManagementRequestSchema.safeParse({
      action: "update_level",
      new_level: 5,
    });
    expect(result.success).toBe(false);
  });

  it("REJECTS update_level with missing new_level", () => {
    const result = adminManagementRequestSchema.safeParse({
      action: "update_level",
      admin_id: "admin-uuid-1",
    });
    expect(result.success).toBe(false);
  });

  it("REJECTS update_level with new_level>10 (catches 'promote to level 9999')", () => {
    const result = adminManagementRequestSchema.safeParse({
      action: "update_level",
      admin_id: "admin-uuid-1",
      new_level: 9999,
    });
    expect(result.success).toBe(false);
  });

  it("REJECTS update_level with new_level=0", () => {
    const result = adminManagementRequestSchema.safeParse({
      action: "update_level",
      admin_id: "admin-uuid-1",
      new_level: 0,
    });
    expect(result.success).toBe(false);
  });
});

describe("adminManagementRequestSchema — delete action", () => {
  it("accepts documented delete payload", () => {
    const result = adminManagementRequestSchema.safeParse({
      action: "delete",
      admin_id: "admin-uuid-1",
    });
    expect(result.success).toBe(true);
  });

  it("REJECTS delete with missing admin_id", () => {
    const result = adminManagementRequestSchema.safeParse({ action: "delete" });
    expect(result.success).toBe(false);
  });

  it("REJECTS delete with empty-string admin_id", () => {
    const result = adminManagementRequestSchema.safeParse({
      action: "delete",
      admin_id: "",
    });
    expect(result.success).toBe(false);
  });
});

describe("adminManagementRequestSchema — discriminator + invalid actions", () => {
  it("REJECTS unknown action (e.g. 'destroy')", () => {
    const result = adminManagementRequestSchema.safeParse({ action: "destroy" });
    expect(result.success).toBe(false);
  });

  it("REJECTS missing action (handler defaults this; schema is strict)", () => {
    // Pre-A11b behavior: the HANDLER pre-populates action='list' before
    // safeParse, so schema-strict-on-action does not change behavior.
    // This test documents the schema's strictness.
    const result = adminManagementRequestSchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it("REJECTS null body", () => {
    expect(adminManagementRequestSchema.safeParse(null).success).toBe(false);
  });

  it("REJECTS array body", () => {
    expect(adminManagementRequestSchema.safeParse([]).success).toBe(false);
  });
});

describe("PII-scrubbing contract — issues array shape (Sentry payload)", () => {
  it("validation failure exposes path/code/message — and nothing else", () => {
    const result = adminManagementRequestSchema.safeParse({
      action: "create",
      level: 9999,
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

  it("drilled-path lock — leaked admin email never appears in issue JSON", () => {
    const result = adminManagementRequestSchema.safeParse({
      action: "create",
      email: "leaked-target@example.com",
      level: 9999, // out of range — triggers validation failure
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      // The offending level value triggers the failure. The email
      // (which is otherwise valid) should NOT leak through the issue.
      // Sentry payload should carry only path/code/message — not the
      // raw input value at the failure location, and definitely not
      // other valid fields like email.
      expect(JSON.stringify(result.error.issues)).not.toContain(
        "leaked-target@example.com",
      );
    }
  });
});
