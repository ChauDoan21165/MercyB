import { mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { mkdtempSync as makeTempDir, mkdirSync, writeFileSync } from "node:fs";
import { deterministicSample, runBenchmark } from "../harness.js";
import { prepareIcnaleWepProxy, splitSentences } from "../prepare-icnale-wep-proxy.js";

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
    expect(results.proxy.comparisons[0]?.baseline_group).toBe("native_reference");
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

  it("prepares raw ICNALE WEP files into proxy JSONL without committing corpus text", () => {
    const dir = makeTempDir(join(tmpdir(), "mb-icnale-"));
    const source = join(dir, "ICNALE_WEP_0.7_202603", "WEP_1_Classified_Unmerged");
    mkdirSync(join(source, "VNM", "VNM_B1_1_1"), { recursive: true });
    mkdirSync(join(source, "MYS", "MYS_B1_1_1"), { recursive: true });
    writeFileSync(
      join(source, "VNM", "VNM_B1_1_1", "WEP_VNM_PTJ0_001_B1_1.txt"),
      "\"I go to school every day. She like English very much.\"\r\n",
    );
    writeFileSync(
      join(source, "MYS", "MYS_B1_1_1", "WEP_MYS_PTJ0_001_B1_1.txt"),
      "\"I go to campus every day. She likes English very much.\"\r\n",
    );
    const out = join(dir, "proxy.jsonl");

    const result = prepareIcnaleWepProxy({
      source: join(dir, "ICNALE_WEP_0.7_202603"),
      out,
      seed: 20260712,
      limit: 5000,
    });

    const lines = readFileSync(out, "utf8").trim().split(/\n/).map((line) => JSON.parse(line));
    expect(result.vnSentences).toBe(2);
    expect(result.baselineSentences).toBe(2);
    expect(lines.some((line) => line.group === "vn_l1")).toBe(true);
    expect(lines.some((line) => line.group === "non_vn_l1_baseline")).toBe(true);
  });

  it("splits ICNALE essay text into sentence-sized benchmark rows", () => {
    expect(splitSentences("This is the first sentence. This is the second sentence!")).toEqual([
      "This is the first sentence.",
      "This is the second sentence!",
    ]);
  });
});
