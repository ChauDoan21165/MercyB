import { afterEach, describe, expect, it, vi } from "vitest";
import type { Metric } from "web-vitals";
import { sendWebVitalToGa4 } from "@/lib/perf/ga4WebVitals";

type GtagWindow = typeof window & { gtag?: (...args: unknown[]) => void };

function metric(over: Partial<Metric> & Pick<Metric, "name" | "value">): Metric {
  return {
    id: "v1-1700000000000-1234567890",
    delta: over.value,
    rating: "good",
    entries: [],
    navigationType: "navigate",
    ...over,
  } as Metric;
}

afterEach(() => {
  delete (window as GtagWindow).gtag;
  vi.restoreAllMocks();
});

describe("sendWebVitalToGa4", () => {
  it("forwards LCP to GA4 via gtag with the expected event + params", () => {
    const gtag = vi.fn();
    (window as GtagWindow).gtag = gtag;

    sendWebVitalToGa4(metric({ name: "LCP", value: 2499.6, rating: "needs-improvement", id: "abc" }));

    expect(gtag).toHaveBeenCalledTimes(1);
    const [type, name, params] = gtag.mock.calls[0];
    expect(type).toBe("event");
    expect(name).toBe("LCP");
    expect(params).toMatchObject({
      event_category: "Web Vitals",
      value: 2500, // rounded integer ms
      metric_id: "abc",
      metric_rating: "needs-improvement",
      non_interaction: true,
    });
  });

  it("scales CLS (unitless) by 1000 for the GA4 value field", () => {
    const gtag = vi.fn();
    (window as GtagWindow).gtag = gtag;

    sendWebVitalToGa4(metric({ name: "CLS", value: 0.0512 }));

    expect(gtag.mock.calls[0][2]).toMatchObject({ value: 51, metric_value: 0.0512 });
  });

  it.each(["INP", "TTFB"] as const)("forwards %s to GA4", (name) => {
    const gtag = vi.fn();
    (window as GtagWindow).gtag = gtag;

    sendWebVitalToGa4(metric({ name, value: 120 }));

    expect(gtag).toHaveBeenCalledTimes(1);
    expect(gtag.mock.calls[0][1]).toBe(name);
  });

  it("does not forward non-core metrics (e.g. FCP) to GA4", () => {
    const gtag = vi.fn();
    (window as GtagWindow).gtag = gtag;

    sendWebVitalToGa4(metric({ name: "FCP", value: 900 }));

    expect(gtag).not.toHaveBeenCalled();
  });

  it("fails silent when gtag is unavailable (GA4 not loaded)", () => {
    delete (window as GtagWindow).gtag;
    expect(() => sendWebVitalToGa4(metric({ name: "LCP", value: 2000 }))).not.toThrow();
  });

  it("fails silent when gtag throws", () => {
    (window as GtagWindow).gtag = () => {
      throw new Error("gtag boom");
    };
    expect(() => sendWebVitalToGa4(metric({ name: "INP", value: 200 }))).not.toThrow();
  });
});
