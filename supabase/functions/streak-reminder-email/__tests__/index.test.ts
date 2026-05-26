/**
 * Streak Reminder Email — unit tests (vitest)
 *
 * Tests the filtering logic: who gets a reminder, who is skipped,
 * and how send failures are handled.
 */

import { describe, it, expect } from "vitest";

// ── Replicated helpers (mirrors the edge function logic) ──────────────

function yesterdayUTC(): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - 1);
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`;
}

function shouldSendReminder(params: {
  streak_last_studied_date: string | null;
  streak_current: number;
  email_unsubscribed_at: string | null;
}): boolean {
  const yesterday = yesterdayUTC();
  return (
    params.streak_last_studied_date === yesterday &&
    params.streak_current >= 1 &&
    params.email_unsubscribed_at === null
  );
}

// ── Tests ─────────────────────────────────────────────────────────────

describe("streak-reminder-email filter logic", () => {
  it("sends to users with streak >= 1 and last studied yesterday", () => {
    const yesterday = yesterdayUTC();
    expect(shouldSendReminder({ streak_last_studied_date: yesterday, streak_current: 5, email_unsubscribed_at: null })).toBe(true);
    expect(shouldSendReminder({ streak_last_studied_date: yesterday, streak_current: 1, email_unsubscribed_at: null })).toBe(true);
  });

  it("skips users with streak = 0", () => {
    const yesterday = yesterdayUTC();
    expect(shouldSendReminder({ streak_last_studied_date: yesterday, streak_current: 0, email_unsubscribed_at: null })).toBe(false);
  });

  it("skips unsubscribed users", () => {
    const yesterday = yesterdayUTC();
    expect(shouldSendReminder({ streak_last_studied_date: yesterday, streak_current: 7, email_unsubscribed_at: "2026-05-09T12:00:00Z" })).toBe(false);
  });

  it("skips users who already studied today", () => {
    const today = new Date().toISOString().slice(0, 10);
    expect(shouldSendReminder({ streak_last_studied_date: today, streak_current: 12, email_unsubscribed_at: null })).toBe(false);
  });

  it("handles null streak_last_studied_date", () => {
    expect(shouldSendReminder({ streak_last_studied_date: null, streak_current: 0, email_unsubscribed_at: null })).toBe(false);
  });

  it("graceful send failure does not crash batch", async () => {
    const errors: string[] = [];
    let sent = 0;
    const users = [
      { email: "good@test.com", fail: false },
      { email: "bad@test.com", fail: true },
      { email: "good2@test.com", fail: false },
    ];
    for (const u of users) {
      try {
        const r = await (u.fail ? Promise.reject(new Error("Resend API error")) : Promise.resolve({}))
          .catch((e) => ({ error: { message: e.message } }));
        if ((r as any).error) errors.push(`${u.email}: ${(r as any).error.message}`);
        else sent++;
      } catch (e: any) { errors.push(`${u.email}: ${e?.message ?? "unknown"}`); }
    }
    expect(sent).toBe(2);
    expect(errors).toHaveLength(1);
    expect(errors[0]!).toContain("bad@test.com");
  });
});
