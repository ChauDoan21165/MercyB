// @vitest-environment node
//
// Tests for the pure decision logic that drives the
// referral-recognition-email edge function. We don't import the Deno
// edge function directly (it imports `https://esm.sh/...`); instead we
// re-implement the small decision predicate here and lock its behavior
// so the edge function's loop can be reasoned about.

import { describe, expect, it } from "vitest";

/**
 * Decide whether to send the recognition email to a top-10 row.
 * Mirrors the edge function loop: skip if rank > 10 OR if
 * last_recognition_email_month already equals the current month bucket.
 */
function shouldSendRecognition(
  rank: number,
  lastMonth: string | null,
  currentMonth: string,
): boolean {
  if (!Number.isFinite(rank) || rank < 1 || rank > 10) return false;
  if (lastMonth === currentMonth) return false;
  return true;
}

describe("shouldSendRecognition", () => {
  it("sends for rank 1..10 when no prior email this month", () => {
    for (let r = 1; r <= 10; r++) {
      expect(shouldSendRecognition(r, null, "2026-04")).toBe(true);
    }
  });

  it("does NOT send for rank 11+", () => {
    expect(shouldSendRecognition(11, null, "2026-04")).toBe(false);
    expect(shouldSendRecognition(50, null, "2026-04")).toBe(false);
  });

  it("does NOT send when last_recognition_email_month matches this month", () => {
    expect(shouldSendRecognition(1, "2026-04", "2026-04")).toBe(false);
  });

  it("DOES send when last_recognition_email_month is a previous month", () => {
    expect(shouldSendRecognition(1, "2026-03", "2026-04")).toBe(true);
  });

  it("DOES send when last_recognition_email_month is null/empty", () => {
    expect(shouldSendRecognition(1, null, "2026-04")).toBe(true);
  });

  it("does not send for invalid rank (NaN, 0, -1)", () => {
    expect(shouldSendRecognition(NaN, null, "2026-04")).toBe(false);
    expect(shouldSendRecognition(0, null, "2026-04")).toBe(false);
    expect(shouldSendRecognition(-1, null, "2026-04")).toBe(false);
  });
});

/**
 * Same template-fill helper as the edge function uses, replicated here
 * to lock the placeholder substitution behavior.
 */
function fillPlaceholders(text: string, vars: Record<string, string>): string {
  let out = text;
  for (const [k, v] of Object.entries(vars)) {
    out = out.replaceAll(`{{${k}}}`, v);
  }
  return out;
}

describe("template placeholder fill", () => {
  it("replaces both rank and display_name", () => {
    const tpl = "Chào {{display_name}}, hạng #{{rank}}";
    const out = fillPlaceholders(tpl, {
      display_name: "Linh",
      rank: "3",
    });
    expect(out).toBe("Chào Linh, hạng #3");
  });

  it("leaves missing placeholders as-is (so we notice in QA)", () => {
    const tpl = "Hi {{name}}";
    const out = fillPlaceholders(tpl, { rank: "1" });
    expect(out).toBe("Hi {{name}}");
  });

  it("replaces all occurrences, not just the first", () => {
    const tpl = "{{x}} and {{x}}";
    const out = fillPlaceholders(tpl, { x: "foo" });
    expect(out).toBe("foo and foo");
  });
});
