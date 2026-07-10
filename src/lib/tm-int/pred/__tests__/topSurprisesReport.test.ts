// WP-001 consumer — top-surprises report artifact.
//
// Asserts the report is a descending-surprise list, excludes hindsight-rejected pairs,
// and writes the artifact (JSON + Markdown) to test-results/ for Chau review.
import { describe, it, expect } from "vitest";
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { buildThesisFixture, buildHindsightFixture } from "@/lib/tm-int/pred/fixtures";
import { resolveSurprise } from "@/lib/tm-int/pred/capture";
import { buildTopSurprisesReport, renderTopSurprisesMarkdown } from "@/lib/tm-int/pred/report";

describe("WP-001: top-surprises report artifact", () => {
  it("is a descending-surprise list of accepted pairs", () => {
    const { resolutions } = buildThesisFixture();
    const report = buildTopSurprisesReport(resolutions, { limit: 10, generatedAt: "2026-07-09T00:00:00.000Z" });

    expect(report.entries).toHaveLength(10);
    for (let i = 1; i < report.entries.length; i += 1) {
      expect(report.entries[i - 1].surprise).toBeGreaterThanOrEqual(report.entries[i].surprise);
      expect(report.entries[i - 1].rank).toBe(i);
    }
    expect(report.counts.accepted).toBe(60);
    expect(report.counts.hindsightRejected).toBe(0);
  });

  it("excludes hindsight-rejected pairs from the artifact", () => {
    const { rows, outcomes, leakingIndices } = buildHindsightFixture();
    const resolutions = rows.map((row, i) => resolveSurprise(row, outcomes[i]));
    const report = buildTopSurprisesReport(resolutions, { limit: 100 });
    expect(report.counts.reported).toBe(resolutions.length - leakingIndices.length);
    expect(report.counts.hindsightRejected).toBe(leakingIndices.length);
  });

  it("writes the report artifact to test-results/ (descending surprise, Markdown + JSON)", () => {
    const { resolutions } = buildThesisFixture();
    const report = buildTopSurprisesReport(resolutions, { limit: 10, generatedAt: "2026-07-09T00:00:00.000Z" });
    const markdown = renderTopSurprisesMarkdown(report);

    const dir = resolve(process.cwd(), "test-results");
    mkdirSync(dir, { recursive: true });
    writeFileSync(resolve(dir, "wp001-top-surprises.json"), JSON.stringify(report, null, 2), "utf8");
    writeFileSync(resolve(dir, "wp001-top-surprises.md"), markdown, "utf8");

    expect(markdown).toMatch(/# WP-001 Top Surprises/);
    expect(markdown).toMatch(/mean surprise:/);
  });
});
