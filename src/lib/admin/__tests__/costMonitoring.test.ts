import { describe, it, expect } from "vitest";
import {
  aggregateAzure,
  aggregateElevenLabs,
  aggregateOpenAi,
  aggregateResend,
  combineDailyCosts,
  costToRevenueRatio,
  DEFAULT_USD_VND_RATE,
  forecastMonthlyVnd,
  PRICING_USD,
  topUsersByCost,
  toCsv,
  utcDateRange,
  utcDayKey,
  normalizeLanguagePair,
  aggregateCostByLanguagePair,
  type LanguagePairCostRow,
} from "../costMonitoring";

const NOW = new Date("2026-04-30T08:00:00Z");
const TODAY = "2026-04-30";
const YESTERDAY = "2026-04-29";

describe("utcDayKey", () => {
  it("buckets a UTC timestamp into YYYY-MM-DD", () => {
    expect(utcDayKey("2026-04-30T23:59:59Z")).toBe("2026-04-30");
  });
  it("returns null for falsy/invalid input", () => {
    expect(utcDayKey(null)).toBeNull();
    expect(utcDayKey("")).toBeNull();
    expect(utcDayKey("not-a-date")).toBeNull();
  });
  it("ignores timezone offset (uses UTC date)", () => {
    expect(utcDayKey("2026-04-30T12:00:00+07:00")).toBe("2026-04-30");
  });
});

describe("utcDateRange", () => {
  it("returns N consecutive days ending on today (UTC)", () => {
    const r = utcDateRange(NOW, 3);
    expect(r).toEqual(["2026-04-28", "2026-04-29", "2026-04-30"]);
  });
  it("handles a single-day window", () => {
    expect(utcDateRange(NOW, 1)).toEqual([TODAY]);
  });
});

describe("aggregateOpenAi", () => {
  it("sums estimated_cost_vnd by UTC day and zero-fills missing days", () => {
    const out = aggregateOpenAi(
      [
        { estimated_cost_vnd: 100, created_at: "2026-04-30T01:00:00Z" },
        { estimated_cost_vnd: 250, created_at: "2026-04-30T15:00:00Z" },
        { estimated_cost_vnd: 50, created_at: "2026-04-29T10:00:00Z" },
      ],
      NOW,
      3,
    );
    expect(out).toEqual([
      { date: "2026-04-28", vnd_cost: 0, breakdown: { openai: 0 } },
      { date: YESTERDAY, vnd_cost: 50, breakdown: { openai: 50 } },
      { date: TODAY, vnd_cost: 350, breakdown: { openai: 350 } },
    ]);
  });

  it("treats null cost as 0", () => {
    const out = aggregateOpenAi(
      [{ estimated_cost_vnd: null, created_at: "2026-04-30T01:00:00Z" }],
      NOW,
      1,
    );
    expect(out).toEqual([{ date: TODAY, vnd_cost: 0, breakdown: { openai: 0 } }]);
  });
});

describe("aggregateElevenLabs", () => {
  it("multiplies text_length × per-char × FX, sums per day", () => {
    // 1000 chars × 0.00018 USD/char = $0.18 USD × 25000 VND/USD = 4500 VND
    const out = aggregateElevenLabs(
      [
        { text_length: 500, created_at: "2026-04-30T08:00:00Z" },
        { text_length: 500, created_at: "2026-04-30T09:00:00Z" },
      ],
      NOW,
      1,
    );
    expect(out).toEqual([
      { date: TODAY, vnd_cost: 4500, breakdown: { elevenlabs: 4500 } },
    ]);
  });

  it("respects custom usdVndRate override", () => {
    // 1000 chars × $0.00018 × 30000 = 5400 VND
    const out = aggregateElevenLabs(
      [{ text_length: 1000, created_at: "2026-04-30T08:00:00Z" }],
      NOW,
      1,
      30_000,
    );
    expect(out[0].vnd_cost).toBe(5400);
  });

  it("clamps negative or null text_length to zero", () => {
    const out = aggregateElevenLabs(
      [
        { text_length: -50, created_at: "2026-04-30T08:00:00Z" },
        { text_length: null, created_at: "2026-04-30T09:00:00Z" },
      ],
      NOW,
      1,
    );
    expect(out[0].vnd_cost).toBe(0);
  });
});

describe("aggregateResend", () => {
  it("counts only status='sent' rows, ignores pending/failed/skipped", () => {
    // 4 sent × $0.0004 × 25000 = 40 VND
    const out = aggregateResend(
      [
        { status: "sent", scheduled_at: "2026-04-30T01:00:00Z", sent_at: "2026-04-30T01:01:00Z" },
        { status: "sent", scheduled_at: "2026-04-30T01:00:00Z", sent_at: "2026-04-30T01:01:00Z" },
        { status: "sent", scheduled_at: "2026-04-30T01:00:00Z", sent_at: "2026-04-30T01:01:00Z" },
        { status: "sent", scheduled_at: "2026-04-30T01:00:00Z", sent_at: "2026-04-30T01:01:00Z" },
        { status: "pending", scheduled_at: "2026-04-30T01:00:00Z", sent_at: null },
        { status: "failed", scheduled_at: "2026-04-30T01:00:00Z", sent_at: null },
        { status: "skipped", scheduled_at: "2026-04-30T01:00:00Z", sent_at: null },
      ],
      NOW,
      1,
    );
    expect(out[0].vnd_cost).toBe(40);
  });

  it("falls back to scheduled_at when sent_at is null", () => {
    // Defensive: 'sent' rows generally have sent_at, but a clock-skewed
    // backfill might not. Bucket by scheduled_at in that case.
    const out = aggregateResend(
      [{ status: "sent", scheduled_at: "2026-04-29T01:00:00Z", sent_at: null }],
      NOW,
      2,
    );
    expect(out.find((p) => p.date === YESTERDAY)?.vnd_cost).toBe(10);
  });
});

describe("aggregateAzure", () => {
  it("estimates 3 sec per attempt × per-second rate × FX", () => {
    // 100 attempts × $0.000833 (3sec at $1/hr) × 25000 = ~2083 VND
    const expected = Math.round(
      100 * PRICING_USD.azure_per_attempt * DEFAULT_USD_VND_RATE,
    );
    const rows = Array.from({ length: 100 }, () => ({
      created_at: "2026-04-30T08:00:00Z",
    }));
    const out = aggregateAzure(rows, NOW, 1);
    expect(out[0].vnd_cost).toBe(expected);
  });
});

describe("combineDailyCosts", () => {
  it("merges per-category series into one daily total", () => {
    const out = combineDailyCosts([
      [{ date: TODAY, vnd_cost: 100, breakdown: { openai: 100 } }],
      [{ date: TODAY, vnd_cost: 50, breakdown: { elevenlabs: 50 } }],
      [{ date: TODAY, vnd_cost: 25, breakdown: { resend: 25 } }],
    ]);
    expect(out).toEqual([
      {
        date: TODAY,
        vnd_cost: 175,
        breakdown: { openai: 100, elevenlabs: 50, resend: 25 },
      },
    ]);
  });

  it("sorts by date ascending", () => {
    const out = combineDailyCosts([
      [
        { date: TODAY, vnd_cost: 1, breakdown: { openai: 1 } },
        { date: YESTERDAY, vnd_cost: 2, breakdown: { openai: 2 } },
      ],
    ]);
    expect(out.map((p) => p.date)).toEqual([YESTERDAY, TODAY]);
  });
});

describe("topUsersByCost", () => {
  it("ranks users by combined VND cost, top-N descending", () => {
    const out = topUsersByCost(
      [
        { user_id: "u1", estimated_cost_vnd: 1000, created_at: "2026-04-30T08:00:00Z" },
        { user_id: "u2", estimated_cost_vnd: 100, created_at: "2026-04-30T08:00:00Z" },
      ],
      [
        { user_id: "u2", text_length: 5000, created_at: "2026-04-30T08:00:00Z" },
        // 5000 × 0.00018 × 25000 = 22500 VND → u2 jumps ahead
      ],
      [],
      { topN: 2 },
    );
    expect(out[0].user_id).toBe("u2");
    expect(out[0].breakdown.elevenlabs).toBe(22500);
    expect(out[0].breakdown.openai).toBe(100);
    expect(out[1].user_id).toBe("u1");
  });

  it("respects topN limit", () => {
    const rows = Array.from({ length: 50 }, (_, i) => ({
      user_id: `u${i}`,
      estimated_cost_vnd: i + 1,
      created_at: "2026-04-30T08:00:00Z",
    }));
    const out = topUsersByCost(rows, [], [], { topN: 3 });
    expect(out).toHaveLength(3);
    expect(out[0].user_id).toBe("u49");
  });

  it("ignores rows with no user_id (anonymous attempts)", () => {
    const out = topUsersByCost(
      [{ user_id: null, estimated_cost_vnd: 9999, created_at: "2026-04-30T08:00:00Z" }],
      [],
      [],
    );
    expect(out).toEqual([]);
  });
});

describe("forecastMonthlyVnd", () => {
  it("projects from average of last 7 days × 30", () => {
    const daily = utcDateRange(NOW, 14).map((date, i) => ({
      date,
      vnd_cost: i < 7 ? 0 : 1000, // last 7 days each at 1000 VND
      breakdown: {},
    }));
    expect(forecastMonthlyVnd(daily, 7)).toBe(30_000);
  });

  it("returns 0 for empty input (no false precision)", () => {
    expect(forecastMonthlyVnd([], 7)).toBe(0);
  });

  it("uses the last `windowDays` even if series is shorter", () => {
    expect(
      forecastMonthlyVnd(
        [{ date: TODAY, vnd_cost: 200, breakdown: {} }],
        7,
      ),
    ).toBe(6_000);
  });
});

describe("toCsv", () => {
  it("emits header + rows in fixed column order with CRLF line endings", () => {
    const csv = toCsv([
      {
        date: TODAY,
        vnd_cost: 175,
        breakdown: { openai: 100, elevenlabs: 50, resend: 25 },
      },
    ]);
    expect(csv).toBe(
      "date,openai_vnd,elevenlabs_vnd,resend_vnd,azure_vnd,total_vnd\r\n2026-04-30,100,50,25,0,175\r\n",
    );
  });

  it("handles missing breakdown keys with zero", () => {
    const csv = toCsv([{ date: TODAY, vnd_cost: 0, breakdown: {} }]);
    expect(csv).toContain("2026-04-30,0,0,0,0,0");
  });
});

describe("costToRevenueRatio", () => {
  it("returns ratio rounded to 4 decimals", () => {
    expect(costToRevenueRatio(330_000, 1_000_000)).toBe(0.33);
    expect(costToRevenueRatio(123_456, 1_000_000)).toBe(0.1235);
  });
  it("returns null when revenue is zero (avoid div-by-zero)", () => {
    expect(costToRevenueRatio(100_000, 0)).toBeNull();
    expect(costToRevenueRatio(100_000, -1)).toBeNull();
  });
});

describe("normalizeLanguagePair", () => {
  it("builds a stable <native>-<target> key, lowercased", () => {
    expect(normalizeLanguagePair("VI", "en")).toBe("vi-en");
    expect(normalizeLanguagePair("th")).toBe("th-en"); // target defaults to en
    expect(normalizeLanguagePair("zh", "en")).toBe("zh-en");
  });
  it("returns null when the native language is unknown", () => {
    expect(normalizeLanguagePair(null)).toBeNull();
    expect(normalizeLanguagePair("")).toBeNull();
    expect(normalizeLanguagePair("  ")).toBeNull();
  });
  it("strips junk and caps length (no injection into the pair key)", () => {
    expect(normalizeLanguagePair("v!i;", "e n")).toBe("vi-en");
  });
});

describe("aggregateCostByLanguagePair", () => {
  const NOW2 = new Date("2026-07-10T08:00:00Z");
  const rows: LanguagePairCostRow[] = [
    { language_pair: "vi-en", estimated_cost_vnd: 100, created_at: "2026-07-10T01:00:00Z" },
    { language_pair: "vi-en", estimated_cost_vnd: 50, created_at: "2026-07-10T02:00:00Z" },
    { language_pair: "th-en", estimated_cost_vnd: 40, created_at: "2026-07-09T05:00:00Z" },
    { language_pair: null, estimated_cost_vnd: 999, created_at: "2026-07-10T03:00:00Z" }, // ignored
    { language_pair: "vi-en", estimated_cost_vnd: 30, created_at: "2026-01-01T00:00:00Z" }, // out of range
  ];

  it("groups per pair per day and summarizes, ignoring null-pair and out-of-range rows", () => {
    const { pairs, points, summary } = aggregateCostByLanguagePair(rows, NOW2, 3);
    expect(pairs).toEqual(["th-en", "vi-en"]);

    const today = points.find((p) => p.date === "2026-07-10")!;
    expect(today["vi-en"]).toBe(150); // 100 + 50, null-pair 999 excluded
    expect(today["th-en"]).toBe(0);

    const yesterday = points.find((p) => p.date === "2026-07-09")!;
    expect(yesterday["th-en"]).toBe(40);

    // summary sorted by spend desc; the Jan row is out of the 3-day window
    expect(summary).toEqual([
      { pair: "vi-en", totalVnd: 150, events: 2 },
      { pair: "th-en", totalVnd: 40, events: 1 },
    ]);
  });

  it("returns an empty series (no pairs) when there is no tagged spend", () => {
    const { pairs, summary } = aggregateCostByLanguagePair([], NOW2, 3);
    expect(pairs).toEqual([]);
    expect(summary).toEqual([]);
  });
});
