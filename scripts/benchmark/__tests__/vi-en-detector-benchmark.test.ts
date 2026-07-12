import { mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { deterministicSample, runBenchmark } from "../harness.js";

describe("vi-en detector benchmark harness", () => {
  it("runs annotated and proxy fixture tracks end to end", () => {
    const dir = mkdtempSync(join(tmpdir(), "mb-benchmark-"));
    const out = join(dir, "results.json");
    const report = join(dir, "report.md");

    const results = runBenchmark({
      annotatedPath: "scripts/benchmark/fixtures/annotated.jsonl",
      proxyPath: "scripts/benchmark/fixtures/proxy.jsonl",
      outputPath: out,
      reportPath: report,
      seed: 20260712,
      limit: 5000,
    });

    expect(results.annotated.sample_size).toBe(4);
    expect(results.proxy.sample_size).toBe(4);
    expect(results.annotated.per_tag.vi_l1_3rd_person_s.support).toBe(1);
    expect(results.proxy.groups.vn_l1.samples).toBe(2);
    expect(JSON.parse(readFileSync(out, "utf8")).detectors).toEqual(["detectL1Error"]);
    expect(readFileSync(report, "utf8")).toContain("Vietnamese-L1 Detector Benchmark v1");
  });

  it("samples deterministically by seed and id", () => {
    const sample = deterministicSample(
      [{ id: "c" }, { id: "a" }, { id: "b" }],
      2,
      42,
    );

    expect(deterministicSample([{ id: "c" }, { id: "a" }, { id: "b" }], 2, 42)).toEqual(sample);
    expect(sample).toHaveLength(2);
  });
});
