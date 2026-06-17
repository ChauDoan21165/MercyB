import { describe, expect, it } from "vitest";
import {
  DECISIONS,
  detectPathOverlap,
  detectStaleDuplicate,
  evaluateDispatchGate,
  evaluateMainPipeline,
} from "../../scripts/ops/factory-a-dispatch-gate.mjs";

describe("Factory A dispatch gate", () => {
  it("allows Type A report, docs, and evidence jobs", () => {
    expect(
      evaluateDispatchGate({
        job: {
          id: "907-report",
          title: "write Factory A evidence report",
          paths: ["reports/ops/factory-a-dispatch-gate-2026-06-16.md"],
        },
      }),
    ).toMatchObject({
      decision: DECISIONS.ALLOW,
      code: "A",
      type: "Type A",
    });
  });

  it("allows Type B ops utility jobs when paths do not overlap open MR files", () => {
    const result = evaluateDispatchGate({
      job: {
        id: "907-gate",
        title: "Factory A dispatch gate",
        allowedPaths: ["scripts/ops/factory-a-dispatch-gate.mjs", "tests/ops/factory-a-dispatch-gate.test.mjs"],
      },
      context: {
        openMergeRequests: [
          {
            iid: 902,
            state: "opened",
            sourceBranch: "ops/other-report",
            changedFiles: ["reports/ops/other-report.md"],
          },
        ],
      },
    });

    expect(result).toMatchObject({
      decision: DECISIONS.ALLOW,
      code: "B",
      type: "Type B",
      pathOverlaps: [],
    });
  });

  it("holds Type C app or product code for serialized handling", () => {
    expect(
      evaluateDispatchGate({
        job: {
          id: "product-change",
          title: "change product behavior",
          paths: ["src/pages/Home.tsx"],
        },
      }),
    ).toMatchObject({
      decision: DECISIONS.HOLD,
      code: "C",
      type: "Type C",
    });
  });

  it("rejects Type D auth, billing, SQL/RLS, secrets, and deploy-risk jobs without owner override", () => {
    const result = evaluateDispatchGate({
      job: {
        id: "dangerous-change",
        title: "update auth policy",
        paths: ["supabase/migrations/202606160001_auth_rls.sql", ".env.production", "netlify.toml"],
      },
    });

    expect(result).toMatchObject({
      decision: DECISIONS.REJECT,
      code: "D",
      type: "Type D",
    });
    expect(result.unsafePaths.map((match) => match.rule)).toEqual(
      expect.arrayContaining(["sql_rls_migrations", "env", "supabase_migrations", "netlify_wrangler"]),
    );
  });

  it("does not reject Type D when explicit owner override is present, but keeps it held", () => {
    expect(
      evaluateDispatchGate({
        job: {
          id: "owner-directed-sql",
          title: "owner override for migration",
          paths: ["supabase/migrations/202606160002_owner_override.sql"],
          ownerOverride: true,
        },
      }),
    ).toMatchObject({
      decision: DECISIONS.HOLD,
      code: "D",
    });
  });

  it("rejects known stale duplicate 903-success-streak-promotion-v1", () => {
    expect(
      evaluateDispatchGate({
        job: {
          id: "903-success-streak-promotion-v1",
          title: "Factory success streak promotion",
          paths: ["reports/ops/factory-success-streak-promotion-v1-2026-06-16.md"],
        },
      }),
    ).toMatchObject({
      decision: DECISIONS.REJECT,
      staleDuplicate: {
        knownStaleKey: "903-success-streak-promotion-v1",
      },
    });
  });

  it("holds stale duplicates when artifact or MR data matches the same job", () => {
    const artifactDuplicate = detectStaleDuplicate(
      {
        id: "907-gate",
        expectedArtifacts: ["reports/ops/factory-a-dispatch-gate-2026-06-16.md"],
      },
      {
        existingArtifacts: ["reports/ops/factory-a-dispatch-gate-2026-06-16.md"],
      },
    );

    const mrDuplicate = evaluateDispatchGate({
      job: {
        id: "907-gate",
        branch: "ops/factory-a-dispatch-gate",
        paths: ["scripts/ops/factory-a-dispatch-gate.mjs"],
      },
      context: {
        mergeRequests: [
          {
            iid: 907,
            state: "merged",
            title: "Factory A dispatch gate",
            sourceBranch: "ops/factory-a-dispatch-gate",
          },
        ],
      },
    });

    expect(artifactDuplicate).toMatchObject({
      duplicate: true,
      artifactMatches: ["reports/ops/factory-a-dispatch-gate-2026-06-16.md"],
    });
    expect(mrDuplicate).toMatchObject({
      decision: DECISIONS.HOLD,
      staleDuplicate: {
        duplicate: true,
      },
    });
  });

  it("holds when supplied allowed paths overlap changed files from an open MR", () => {
    const overlaps = detectPathOverlap(["scripts/ops"], [
      {
        iid: 901,
        state: "opened",
        sourceBranch: "ops/existing",
        changedFiles: ["scripts/ops/existing-gate.mjs"],
      },
    ]);

    expect(overlaps).toEqual([
      {
        mr: 901,
        state: "opened",
        branch: "ops/existing",
        allowedPath: "scripts/ops",
        changedFiles: ["scripts/ops/existing-gate.mjs"],
      },
    ]);
  });

  it("classifies DISK_GATE and GB below 14GB floor as runner_disk_floor, not product failure", () => {
    expect(
      evaluateDispatchGate({
        job: {
          id: "disk-floor",
          paths: ["scripts/ops/factory-a-dispatch-gate.mjs"],
        },
        context: {
          failureTrace: "DISK_GATE: 13.9GB < 14GB floor",
        },
      }),
    ).toMatchObject({
      failure: {
        classification: "runner_disk_floor",
        productCodeFailure: false,
        freeGb: 13.9,
        floorGb: 14,
      },
    });
  });

  it("treats latest main pipeline as clean when automatic jobs succeeded and only manual/created production jobs remain", () => {
    expect(
      evaluateMainPipeline({
        jobs: [
          { name: "lint", status: "success" },
          { name: "test", status: "success" },
          { name: "production deploy", stage: "production", status: "manual", when: "manual" },
          { name: "production release", stage: "production", status: "created", when: "manual" },
        ],
      }),
    ).toMatchObject({
      clean: true,
      reason: "all automatic jobs succeeded; only manual/created production jobs remain",
      blockingJobs: [],
      remainingProductionManualJobs: [
        { name: "production deploy", status: "manual" },
        { name: "production release", status: "created" },
      ],
    });
  });
});
