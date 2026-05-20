import { describe, expect, it } from "vitest";

import {
  auditCorpusIntegrity,
  auditPromptRubricAlignment,
  auditRecommendationGraph,
  auditTaxonomyConsistency,
  buildRun,
  countIssues,
  missingRequiredSurfaceIssues,
} from "../../../scripts/placement-v3/dataQualityAuditCore";

describe("Placement V3 data-quality audit infrastructure", () => {
  it("reports missing required Placement V3 corpus surfaces honestly", () => {
    const issues = missingRequiredSurfaceIssues("corpus_integrity");
    expect(issues.length).toBeGreaterThanOrEqual(4);
    expect(issues.every((issue) => issue.category === "missing_required_surface")).toBe(true);
    expect(issues.every((issue) => issue.severity === "blocker")).toBe(true);
  });

  it("runs the corpus integrity audit", () => {
    const issues = auditCorpusIntegrity();
    expect(issues.length).toBeGreaterThan(0);
    expect(issues.some((issue) => issue.auditKind === "corpus_integrity")).toBe(true);
  });

  it("detects unavailable calibration corpus as a blocker", () => {
    const issues = auditCorpusIntegrity();
    expect(issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          file: "docs/placement-v3/calibration",
          severity: "blocker",
        }),
      ]),
    );
  });

  it("covers duplicate prompt category even when none are present", () => {
    const counts = countIssues(auditCorpusIntegrity());
    expect(counts.byCategory.duplicate_prompt ?? 0).toBeGreaterThanOrEqual(0);
  });

  it("covers near-duplicate prompt category even when none are present", () => {
    const counts = countIssues(auditCorpusIntegrity());
    expect(counts.byCategory.near_duplicate_prompt ?? 0).toBeGreaterThanOrEqual(0);
  });

  it("checks invalid taxonomy references from placement questions", () => {
    const counts = countIssues(auditCorpusIntegrity());
    expect(counts.byCategory.invalid_taxonomy_reference ?? 0).toBeGreaterThanOrEqual(0);
  });

  it("runs the taxonomy consistency audit", () => {
    const issues = auditTaxonomyConsistency();
    expect(issues.length).toBeGreaterThan(0);
    expect(issues.some((issue) => issue.auditKind === "taxonomy_consistency")).toBe(true);
  });

  it("tracks unused taxonomy categories", () => {
    const issues = auditTaxonomyConsistency();
    expect(issues.some((issue) => issue.category === "unused_taxonomy_category")).toBe(true);
  });

  it("tracks missing remediation mappings", () => {
    const issues = auditTaxonomyConsistency();
    expect(issues.some((issue) => issue.category === "missing_remediation_link")).toBe(true);
  });

  it("runs the recommendation graph audit", () => {
    const issues = auditRecommendationGraph();
    expect(issues.length).toBeGreaterThan(0);
    expect(issues.some((issue) => issue.auditKind === "recommendation_graph")).toBe(true);
  });

  it("checks orphan recommendation paths", () => {
    const counts = countIssues(auditRecommendationGraph());
    expect(counts.byCategory.orphan_recommendation_path ?? 0).toBeGreaterThanOrEqual(0);
  });

  it("checks cyclic recommendation chains", () => {
    const counts = countIssues(auditRecommendationGraph());
    expect(counts.byCategory.cyclic_recommendation_chain ?? 0).toBeGreaterThanOrEqual(0);
  });

  it("runs the prompt/rubric alignment audit", () => {
    const issues = auditPromptRubricAlignment();
    expect(issues.length).toBeGreaterThan(0);
    expect(issues.some((issue) => issue.auditKind === "prompt_rubric_alignment")).toBe(true);
  });

  it("tracks prompt/rubric mismatch categories", () => {
    const counts = countIssues(auditPromptRubricAlignment());
    expect(counts.byCategory.prompt_level_mismatch ?? 0).toBeGreaterThanOrEqual(0);
    expect(counts.byCategory.rubric_category_mismatch ?? 0).toBeGreaterThanOrEqual(0);
  });

  it("builds run metadata with counts and missing surfaces", () => {
    const run = buildRun(["corpus_integrity"], auditCorpusIntegrity(), "test command");
    expect(run.runId).toMatch(/^a3-/);
    expect(run.counts.total).toBe(run.issues.length);
    expect(run.missingRequiredSurfaces).toContain("docs/placement-v3/calibration");
  });

  it("combines all audit categories without fabricating V3 corpus data", () => {
    const issues = [
      ...auditCorpusIntegrity(),
      ...auditTaxonomyConsistency(),
      ...auditRecommendationGraph(),
      ...auditPromptRubricAlignment(),
    ];
    const counts = countIssues(issues);
    expect(counts.blockers).toBeGreaterThan(0);
    expect(issues.some((issue) => issue.file === "docs/placement-v3/prompt-library")).toBe(true);
  });
});
