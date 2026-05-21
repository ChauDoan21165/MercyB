import { describe, expect, it } from "vitest";

import {
  aggregateEvents,
  canonicalJSON,
  evaluateAdaptiveLoop,
  ingestProgressionSnapshot,
  validateEvents,
} from "../index";
import {
  ineffective,
  makeForecast,
  makeSnapshot,
  tg,
} from "./adapterFixtures";

describe("adaptiveLoop — orchestration", () => {
  it("returns signals, plan, and diagnostics in one call", () => {
    const snap = makeSnapshot();
    const agg = aggregateEvents(
      ingestProgressionSnapshot({ snapshot: snap, eventIdPrefix: "loop" }),
    );
    const result = evaluateAdaptiveLoop({ snapshot: snap, aggregation: agg });
    expect(result.signals).toBeDefined();
    expect(result.plan).toBeDefined();
    expect(result.diagnostics.length).toBeGreaterThan(0);
    expect(result.forecastReport).toBeUndefined();
  });

  it("attaches forecast report when a forecast is provided", () => {
    const snap = makeSnapshot();
    const agg = aggregateEvents(
      ingestProgressionSnapshot({ snapshot: snap, eventIdPrefix: "loop" }),
    );
    const forecast = makeForecast([
      tg("reading", 0.9, "B1"),
      tg("writing", 0.9, "B1"),
    ]);
    const result = evaluateAdaptiveLoop({
      snapshot: snap,
      aggregation: agg,
      forecast,
    });
    expect(result.forecastReport).toBeDefined();
  });

  it("is deterministic across identical inputs", () => {
    const snap = makeSnapshot();
    const agg = aggregateEvents(
      ingestProgressionSnapshot({ snapshot: snap, eventIdPrefix: "loop" }),
    );
    const a = evaluateAdaptiveLoop({ snapshot: snap, aggregation: agg });
    const b = evaluateAdaptiveLoop({ snapshot: snap, aggregation: agg });
    expect(canonicalJSON(a)).toBe(canonicalJSON(b));
  });

  it("forwards ineffective-cluster flags into the recommendation pipeline", () => {
    const snap = makeSnapshot();
    const agg = aggregateEvents(
      ingestProgressionSnapshot({ snapshot: snap, eventIdPrefix: "loop" }),
    );
    const clusters = [ineffective("cluster::weak-set", ["l1", "l2"], 0.2, 14)];
    const result = evaluateAdaptiveLoop({
      snapshot: snap,
      aggregation: agg,
      ineffectiveClusters: clusters,
    });
    expect(
      result.plan.recommendations.some((r) => r.kind === "swap_ineffective_cluster"),
    ).toBe(true);
  });

  it("emits no production rollout side effects — pure return value", () => {
    const snap = makeSnapshot();
    const agg = aggregateEvents(
      ingestProgressionSnapshot({ snapshot: snap, eventIdPrefix: "loop" }),
    );
    // Replace Date.now with a thrower to prove the loop doesn't touch it.
    const originalNow = Date.now;
    Date.now = () => {
      throw new Error("adaptiveLoop must not call Date.now");
    };
    try {
      expect(() => evaluateAdaptiveLoop({ snapshot: snap, aggregation: agg })).not.toThrow();
    } finally {
      Date.now = originalNow;
    }
  });
});

describe("adaptiveLoop — replay-safe", () => {
  it("produces identical output regardless of input event order", () => {
    const snap = makeSnapshot();
    const events = ingestProgressionSnapshot({
      snapshot: snap,
      eventIdPrefix: "replay",
    });
    const aggA = aggregateEvents(events);
    const aggB = aggregateEvents([...events].reverse());
    const resultA = evaluateAdaptiveLoop({ snapshot: snap, aggregation: aggA });
    const resultB = evaluateAdaptiveLoop({ snapshot: snap, aggregation: aggB });
    expect(canonicalJSON(resultA)).toBe(canonicalJSON(resultB));
  });

  it("ingested events always pass validation", () => {
    const events = ingestProgressionSnapshot({
      snapshot: makeSnapshot(),
      eventIdPrefix: "loop",
    });
    const result = validateEvents(events);
    expect(result.rejected).toHaveLength(0);
  });
});
