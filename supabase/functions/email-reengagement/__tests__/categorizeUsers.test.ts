import { describe, it, expect } from "vitest";
import {
  bucketFor,
  campaignFor,
  categorizeUsers,
  THRESHOLDS,
  type UserActivityRow,
} from "../categorizeUsers";

const NOW = new Date("2026-04-24T12:00:00Z");
const DAY_MS = 24 * 60 * 60 * 1000;

const daysAgo = (n: number, base: Date = NOW): string =>
  new Date(base.getTime() - n * DAY_MS).toISOString();

const row = (overrides: Partial<UserActivityRow> = {}): UserActivityRow => ({
  id: "00000000-0000-0000-0000-000000000001",
  email: "user@example.com",
  last_active_at: null,
  ...overrides,
});

describe("bucketFor", () => {
  it("returns 'never_active' when last_active_at is null", () => {
    expect(bucketFor(null, NOW)).toBe("never_active");
  });

  it("returns 'never_active' for malformed timestamp", () => {
    expect(bucketFor("not-a-date", NOW)).toBe("never_active");
  });

  it("returns 'active_recently' for activity in the last 7 days", () => {
    expect(bucketFor(daysAgo(0), NOW)).toBe("active_recently");
    expect(bucketFor(daysAgo(3), NOW)).toBe("active_recently");
    expect(bucketFor(daysAgo(6.99), NOW)).toBe("active_recently");
  });

  it("returns 'warm' for [7d, 14d)", () => {
    expect(bucketFor(daysAgo(7), NOW)).toBe("warm");
    expect(bucketFor(daysAgo(10), NOW)).toBe("warm");
    expect(bucketFor(daysAgo(13.99), NOW)).toBe("warm");
  });

  it("returns 'cool' for [14d, 30d)", () => {
    expect(bucketFor(daysAgo(14), NOW)).toBe("cool");
    expect(bucketFor(daysAgo(21), NOW)).toBe("cool");
    expect(bucketFor(daysAgo(29.99), NOW)).toBe("cool");
  });

  it("returns 'cold' for [30d, 90d)", () => {
    expect(bucketFor(daysAgo(30), NOW)).toBe("cold");
    expect(bucketFor(daysAgo(60), NOW)).toBe("cold");
    expect(bucketFor(daysAgo(89.99), NOW)).toBe("cold");
  });

  it("returns 'inactive_too_long' for ≥ 90d", () => {
    expect(bucketFor(daysAgo(90), NOW)).toBe("inactive_too_long");
    expect(bucketFor(daysAgo(365), NOW)).toBe("inactive_too_long");
  });

  it("treats future timestamps (clock skew) as active", () => {
    expect(bucketFor(daysAgo(-5), NOW)).toBe("active_recently");
  });

  it("is timezone-agnostic — equivalent UTC instant gives same bucket", () => {
    const utc = "2026-04-10T12:00:00Z";
    const offsetSame = "2026-04-10T19:00:00+07:00"; // same instant, +07
    expect(bucketFor(utc, NOW)).toBe(bucketFor(offsetSame, NOW));
  });

  it("threshold constants match documented buckets", () => {
    expect(THRESHOLDS).toEqual({
      warmStartDays: 7,
      coolStartDays: 14,
      coldStartDays: 30,
      coldEndDays: 90,
    });
  });
});

describe("campaignFor", () => {
  it("maps each emailable bucket to its campaign", () => {
    expect(campaignFor("warm")).toBe("reengagement_7d");
    expect(campaignFor("cool")).toBe("reengagement_14d");
    expect(campaignFor("cold")).toBe("reengagement_30d");
  });

  it("returns null for non-emailable buckets", () => {
    expect(campaignFor("active_recently")).toBeNull();
    expect(campaignFor("inactive_too_long")).toBeNull();
    expect(campaignFor("never_active")).toBeNull();
  });
});

describe("categorizeUsers", () => {
  it("partitions a mixed list into warm/cool/cold/skipped", () => {
    const rows: UserActivityRow[] = [
      row({ id: "a", last_active_at: daysAgo(2) }),    // active → skipped
      row({ id: "b", last_active_at: daysAgo(8) }),    // warm
      row({ id: "c", last_active_at: daysAgo(20) }),   // cool
      row({ id: "d", last_active_at: daysAgo(45) }),   // cold
      row({ id: "e", last_active_at: daysAgo(120) }),  // inactive_too_long → skipped
      row({ id: "f", last_active_at: null }),          // never_active → skipped
    ];

    const result = categorizeUsers(rows, NOW);

    expect(result.warm.map(r => r.id)).toEqual(["b"]);
    expect(result.cool.map(r => r.id)).toEqual(["c"]);
    expect(result.cold.map(r => r.id)).toEqual(["d"]);
    expect(result.skipped.map(r => r.id).sort()).toEqual(["a", "e", "f"]);
  });

  it("skips users without an email even if they would be emailable by activity", () => {
    const rows: UserActivityRow[] = [
      row({ id: "a", email: null, last_active_at: daysAgo(8) }),
      row({ id: "b", email: "", last_active_at: daysAgo(8) }),
    ];

    const result = categorizeUsers(rows, NOW);

    expect(result.warm).toHaveLength(0);
    expect(result.cool).toHaveLength(0);
    expect(result.cold).toHaveLength(0);
    expect(result.skipped.map(r => r.id).sort()).toEqual(["a", "b"]);
  });

  it("handles an empty input list", () => {
    expect(categorizeUsers([], NOW)).toEqual({
      warm: [],
      cool: [],
      cold: [],
      skipped: [],
    });
  });
});
