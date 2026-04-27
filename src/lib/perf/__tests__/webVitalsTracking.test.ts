import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/supabaseClient", () => ({
  supabase: {
    from: vi.fn(() => ({
      insert: vi.fn().mockResolvedValue({ error: null }),
    })),
  },
}));

vi.mock("@/lib/monitoring/sentryInit", () => ({
  isSentryEnabled: () => false,
  getSentryModule: () => null,
}));

import { bucketRoute, __internal } from "@/lib/perf/webVitalsTracking";

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
