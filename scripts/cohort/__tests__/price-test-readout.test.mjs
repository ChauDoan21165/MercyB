import { describe, expect, it } from "vitest";
import {
  aggregatePriceTestRows,
  parseArgs,
} from "../price-test-readout.mjs";

describe("price-test-readout", () => {
  it("aggregates conversion per variant with user sample sizes", () => {
    const aggregate = aggregatePriceTestRows([
      { user_id: "u1", event_type: "price_test_variant_exposure", payload: { price_test_variant: "control" } },
      { user_id: "u1", event_type: "price_test_checkout_start", payload: { price_test_variant: "control" } },
      { user_id: "u2", event_type: "price_test_variant_exposure", payload: { price_test_variant: "control" } },
      { user_id: "u3", event_type: "price_test_variant_exposure", payload: { price_test_variant: "test" } },
      { user_id: "u3", event_type: "price_test_checkout_start", payload: { price_test_variant: "test" } },
      { user_id: "u3", event_type: "price_test_checkout_complete", payload: { price_test_variant: "test" } },
    ]);

    expect(aggregate.control.unique_exposed_users).toBe(2);
    expect(aggregate.control.unique_checkout_start_users).toBe(1);
    expect(aggregate.control.checkout_start_rate).toBe(0.5);
    expect(aggregate.control.checkout_complete_rate).toBe(0);
    expect(aggregate.test.unique_exposed_users).toBe(1);
    expect(aggregate.test.unique_checkout_complete_users).toBe(1);
    expect(aggregate.test.checkout_complete_rate).toBe(1);
  });

  it("requires a bounded date window", () => {
    expect(() => parseArgs(["--start", "2026-07-01"])).toThrow("--end is required");
    expect(parseArgs(["--start", "2026-07-01", "--end", "2026-07-31"]).start).toBe("2026-07-01");
  });
});
