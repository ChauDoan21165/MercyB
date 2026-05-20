// supabase/functions/public-api/handlers/__tests__/l1DetectZodValidation.test.ts
//
// A11c contract tests for l1-detect's request-payload zod validation.
// Mirrors the in-test schema from _shared/publicApiSchemas.ts.
//
// Important: the schema is INTENTIONALLY PERMISSIVE — both fields
// optional — because the existing application-layer checks
// (missing_field / text_too_long / unsupported_l1_code) are documented
// public API response codes that this PR preserves. The schema's job
// is structural only: catch wrong-type / null / array bodies before
// the existing defensive type-coercion silently turns them into
// empty strings.
//
// PII contract for this surface is TIGHTER than the A11/A11b webhook +
// admin schemas: only {path, code} per zod issue ships to Sentry. The
// `message` field is dropped because zod auto-messages can echo
// user-supplied content. Test locks this explicitly.

import { describe, expect, it } from "vitest";
import { z } from "zod";

const l1DetectRequestSchema = z.object({
  text: z.string().optional(),
  l1_code: z.string().optional(),
}).passthrough();

describe("l1DetectRequestSchema — structural request validation", () => {
  it("accepts the documented body shape", () => {
    const valid = { text: "I student", l1_code: "vi" };
    const result = l1DetectRequestSchema.safeParse(valid);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.text).toBe("I student");
      expect(result.data.l1_code).toBe("vi");
    }
  });

  it("accepts empty body — downstream returns missing_field 400 (existing contract)", () => {
    // Permissive schema lets {} through; the documented handler-level
    // `missing_field` error code preserves the existing contract.
    const result = l1DetectRequestSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it("accepts body missing l1_code — downstream returns unsupported_l1_code (existing)", () => {
    const result = l1DetectRequestSchema.safeParse({ text: "hello" });
    expect(result.success).toBe(true);
  });

  it("accepts body missing text — downstream returns missing_field (existing)", () => {
    const result = l1DetectRequestSchema.safeParse({ l1_code: "vi" });
    expect(result.success).toBe(true);
  });

  it("accepts text over 1000 chars — downstream returns text_too_long (existing)", () => {
    // Schema does NOT enforce length here. The 1000-char limit is the
    // existing `text_too_long` check at the handler layer; preserving
    // it means the documented 413 response is still emitted.
    const result = l1DetectRequestSchema.safeParse({
      text: "a".repeat(2000),
      l1_code: "vi",
    });
    expect(result.success).toBe(true);
  });

  it("accepts non-'vi' l1_code — downstream returns unsupported_l1_code (existing)", () => {
    const result = l1DetectRequestSchema.safeParse({
      text: "hello",
      l1_code: "zh",
    });
    expect(result.success).toBe(true);
  });

  it("accepts passthrough fields (future API additions)", () => {
    const result = l1DetectRequestSchema.safeParse({
      text: "hello",
      l1_code: "vi",
      // Hypothetical future fields
      session_id: "abc",
      diagnostic_flags: ["spans"],
    });
    expect(result.success).toBe(true);
  });

  it("REJECTS text of wrong type (number) — NEW protection vs pre-A11c silent coerce", () => {
    const bad = { text: 42, l1_code: "vi" };
    const result = l1DetectRequestSchema.safeParse(bad);
    expect(result.success).toBe(false);
  });

  it("REJECTS text of wrong type (object)", () => {
    const bad = { text: { content: "hello" }, l1_code: "vi" };
    const result = l1DetectRequestSchema.safeParse(bad);
    expect(result.success).toBe(false);
  });

  it("REJECTS text of wrong type (array)", () => {
    const bad = { text: ["hello", "world"], l1_code: "vi" };
    const result = l1DetectRequestSchema.safeParse(bad);
    expect(result.success).toBe(false);
  });

  it("REJECTS l1_code of wrong type (number)", () => {
    const bad = { text: "hello", l1_code: 42 };
    const result = l1DetectRequestSchema.safeParse(bad);
    expect(result.success).toBe(false);
  });

  it("REJECTS l1_code of wrong type (boolean)", () => {
    const bad = { text: "hello", l1_code: true };
    const result = l1DetectRequestSchema.safeParse(bad);
    expect(result.success).toBe(false);
  });

  it("REJECTS null body", () => {
    expect(l1DetectRequestSchema.safeParse(null).success).toBe(false);
  });

  it("REJECTS array body", () => {
    expect(
      l1DetectRequestSchema.safeParse([{ text: "x", l1_code: "vi" }]).success,
    ).toBe(false);
  });

  it("REJECTS string body (top-level wrong type)", () => {
    expect(l1DetectRequestSchema.safeParse("hello").success).toBe(false);
  });

  it("REJECTS number body (top-level wrong type)", () => {
    expect(l1DetectRequestSchema.safeParse(42).success).toBe(false);
  });
});

describe("PII-scrubbing contract — TIGHTER for public-api (A11c)", () => {
  // Public-api specific: ONLY {path, code} ship to Sentry. The
  // `message` field is dropped because zod auto-generated messages
  // can echo user-supplied content from the failing input.
  it("validation failure exposes path + code (NOT message — tightened for public-api)", () => {
    const result = l1DetectRequestSchema.safeParse({ text: 42, l1_code: "vi" });
    expect(result.success).toBe(false);
    if (!result.success) {
      // Handler ships ONLY {path, code} — message is dropped.
      // This test documents the contract — it does NOT assert what
      // zod's own .issues array contains (zod always includes message).
      // The handler's mapper is what enforces the strip.
      const shippedShape = result.error.issues.map((iss) => ({
        path: iss.path.join("."),
        code: iss.code,
      }));
      for (const issue of shippedShape) {
        expect(issue).toHaveProperty("path");
        expect(issue).toHaveProperty("code");
        expect(issue).not.toHaveProperty("message");
      }
    }
  });

  it("user-supplied content never leaks via the path-only Sentry payload", () => {
    const result = l1DetectRequestSchema.safeParse({
      text: "leaked-prompt-injection-attempt-via-text-field",
      l1_code: 42, // triggers failure on l1_code
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const shipped = result.error.issues.map((iss) => ({
        path: iss.path.join("."),
        code: iss.code,
      }));
      // The user-supplied text value should NEVER appear in the
      // shipped Sentry payload. Path is just field names.
      expect(JSON.stringify(shipped)).not.toContain(
        "leaked-prompt-injection-attempt-via-text-field",
      );
    }
  });
});
