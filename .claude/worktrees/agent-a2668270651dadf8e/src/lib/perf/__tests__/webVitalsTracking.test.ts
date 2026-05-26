import { beforeEach, describe, expect, it, vi } from "vitest";

const insertSpy = vi.fn().mockResolvedValue({ error: null });
vi.mock("@/lib/supabaseClient", () => ({
  supabase: {
    from: vi.fn(() => ({
      insert: insertSpy,
    })),
  },
}));

vi.mock("@/lib/monitoring/sentryInit", () => ({
  isSentryEnabled: () => false,
  getSentryModule: () => null,
}));

import {
  __internal,
  __resetForTests,
  bucketRoute,
} from "@/lib/perf/webVitalsTracking";

beforeEach(() => {
  insertSpy.mockClear();
  __resetForTests();
});

describe("bucketRoute", () => {
  it("collapses root", () => {
    expect(bucketRoute("/")).toBe("/");
  });
  it("keeps single-segment routes", () => {
    expect(bucketRoute("/admin")).toBe("/admin");
  });
  it("preserves human-named two-segment routes", () => {
    expect(bucketRoute("/admin/latency")).toBe("/admin/latency");
  });
  it("buckets dynamic ids in the second segment", () => {
    expect(bucketRoute("/room/abdominal-pain")).toBe("/room/:id");
  });
  it("buckets numeric ids", () => {
    expect(bucketRoute("/users/12345")).toBe("/users/:id");
  });
  it("buckets uuids", () => {
    expect(bucketRoute("/share/12345678-abcd-4def-9012-1234567890ab")).toBe(
      "/share/:id",
    );
  });
  it("preserves three-segment human routes", () => {
    expect(bucketRoute("/admin/slo/azure_phoneme_p99")).toBe(
      "/admin/slo/azure_phoneme_p99",
    );
  });
  it("buckets 3-segment id tail", () => {
    expect(bucketRoute("/admin/slo/some-uuid-here")).toBe("/admin/slo/:id");
  });
  it("handles empty pathname defensively", () => {
    expect(bucketRoute("")).toBe("/");
  });
});

describe("recordVital integration smoke", () => {
  it("does not throw when fired with a valid metric in test environment", async () => {
    await expect(
      __internal.recordVital({
        name: "LCP",
        value: 1234,
        rating: "good",
      } as Parameters<typeof __internal.recordVital>[0]),
    ).resolves.not.toThrow();
  });
});

describe("recordVital — per-metric.id dedupe", () => {
  it("inserts once per metric.id; ignores re-fires of the same metric", async () => {
    const metric = {
      name: "LCP",
      value: 1234,
      rating: "good",
      id: "v3-1700000000000-1234567890",
    } as Parameters<typeof __internal.recordVital>[0];

    await __internal.recordVital(metric);
    await __internal.recordVital(metric);
    await __internal.recordVital(metric);

    expect(insertSpy).toHaveBeenCalledTimes(1);
  });

  it("inserts separately for distinct metric.ids on the same route", async () => {
    await __internal.recordVital({
      name: "LCP",
      value: 100,
      rating: "good",
      id: "id-A",
    } as Parameters<typeof __internal.recordVital>[0]);
    await __internal.recordVital({
      name: "CLS",
      value: 0.05,
      rating: "good",
      id: "id-B",
    } as Parameters<typeof __internal.recordVital>[0]);

    expect(insertSpy).toHaveBeenCalledTimes(2);
  });

  it("__resetForTests clears the dedupe set so a fresh page lifecycle re-records", async () => {
    const metric = {
      name: "LCP",
      value: 100,
      rating: "good",
      id: "id-X",
    } as Parameters<typeof __internal.recordVital>[0];

    await __internal.recordVital(metric);
    expect(insertSpy).toHaveBeenCalledTimes(1);

    __resetForTests();

    await __internal.recordVital(metric);
    expect(insertSpy).toHaveBeenCalledTimes(2);
  });
});
