/**
 * AAK-TRACEABILITY-GAP-REPORT-001 — Tests
 *
 * Validates:
 * 1. Script exits successfully with and without explicit inputs
 * 2. Produces a manifest and markdown report
 * 3. Correctly identifies complete vs incomplete chains
 * 4. Correctly counts missing nodes and edges
 * 5. Severity classification is deterministic
 * 6. Aggregate statistics are consistent
 * 7. Chain depth never exceeds total
 * 8. Idempotent output
 * 9. Zero mutation summary
 */

import { describe, it } from "vitest";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import os from "node:os";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "../..");
const scriptPath = path.join(repoRoot, "scripts/admin/aak-traceability-gap.mjs");

function runScript(args = []) {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "aak-trace-gap-test-"));
  const result = spawnSync(process.execPath, [scriptPath, "--output-dir", tmpDir, ...args], {
    encoding: "utf8",
    cwd: repoRoot,
  });
  let parsed = null;
  try {
    parsed = JSON.parse((result.stdout || "").trim());
  } catch {
    // not JSON
  }
  return { ...result, parsed, tmpDir };
}

function readArtifact(tmpDir, filename) {
  const p = path.join(tmpDir, filename);
  if (!fs.existsSync(p)) return null;
  try {
    return JSON.parse(fs.readFileSync(p, "utf8"));
  } catch {
    return null;
  }
}

describe("AAK-TRACEABILITY-GAP-REPORT-001", () => {
  describe("basic execution", () => {
    it("exits successfully with auto-discovered inputs", () => {
      const r = runScript();
      if (!r.parsed) throw new Error(`No JSON output. stderr: ${r.stderr}`);
      if (r.parsed.ok !== true) throw new Error(`Not ok: ${JSON.stringify(r.parsed)}`);
    });

    it("exits successfully with explicit fixture inputs", () => {
      const inputs = [
        path.join(repoRoot, "fixtures/admin/eipc/valid-eip-001.json"),
        path.join(repoRoot, "fixtures/admin/eipc/invalid-missing-required.json"),
      ];
      const r = runScript(inputs);
      if (!r.parsed?.ok) throw new Error(`Not ok with explicit inputs: ${JSON.stringify(r.parsed)}`);
    });

    it("produces a manifest artifact", () => {
      const r = runScript();
      const manifest = readArtifact(r.tmpDir, "aak-traceability-gap-manifest.json");
      if (!manifest) throw new Error("Manifest missing");
      if (manifest.runner !== "AAK-TRACEABILITY-GAP-REPORT-001") {
        throw new Error(`Wrong runner: ${manifest.runner}`);
      }
      if (manifest.schema_version !== "aak-traceability-gap/v1") {
        throw new Error(`Wrong schema: ${manifest.schema_version}`);
      }
    });

    it("produces a markdown report", () => {
      const r = runScript();
      const reportPath = path.join(r.tmpDir, "aak-traceability-gap-report.md");
      if (!fs.existsSync(reportPath)) throw new Error("Markdown report missing");
      const content = fs.readFileSync(reportPath, "utf8");
      if (!content.includes("AAK Traceability Gap Report")) {
        throw new Error("Report missing expected title");
      }
    });
  });

  describe("expected chain definition", () => {
    it("manifest declares the full 6-node chain", () => {
      const r = runScript();
      const manifest = readArtifact(r.tmpDir, "aak-traceability-gap-manifest.json");
      const chain = manifest?.expected_chain;
      if (!Array.isArray(chain)) throw new Error("expected_chain missing");
      if (chain.length !== 6) throw new Error(`Expected 6 nodes, got ${chain.length}`);
      const expected = ["DECISION", "EIP", "EXECUTION", "EVIDENCE", "JUDGE", "ACCEPTANCE"];
      for (const node of expected) {
        if (!chain.includes(node)) throw new Error(`Missing node: ${node}`);
      }
    });

    it("manifest declares all 5 expected edges", () => {
      const r = runScript();
      const manifest = readArtifact(r.tmpDir, "aak-traceability-gap-manifest.json");
      const edges = manifest?.expected_edges;
      if (!Array.isArray(edges)) throw new Error("expected_edges missing");
      if (edges.length !== 5) throw new Error(`Expected 5 edges, got ${edges.length}`);
    });
  });

  describe("gap analysis correctness", () => {
    it("valid EIP fixture has detectable node presence", () => {
      const inputs = [path.join(repoRoot, "fixtures/admin/eipc/valid-eip-001.json")];
      const r = runScript(inputs);
      const manifest = readArtifact(r.tmpDir, "aak-traceability-gap-manifest.json");
      const gaps = manifest?.package_gaps;
      if (!Array.isArray(gaps) || gaps.length === 0) throw new Error("No package gaps");

      const validGap = gaps[0];
      // A valid EIP package should have EIP node present
      if (validGap.node_presence.EIP !== true) {
        throw new Error("Valid EIP should have EIP node present");
      }
      // Chain depth should be at least 0
      if (typeof validGap.chain_depth !== "number" || validGap.chain_depth < 0) {
        throw new Error(`Invalid chain_depth: ${validGap.chain_depth}`);
      }
    });

    it("chain_depth never exceeds chain_total", () => {
      const r = runScript();
      const manifest = readArtifact(r.tmpDir, "aak-traceability-gap-manifest.json");
      for (const g of manifest.package_gaps) {
        if (g.chain_depth > g.chain_total) {
          throw new Error(`chain_depth ${g.chain_depth} > chain_total ${g.chain_total} for ${g.package_id}`);
        }
      }
    });

    it("missing_nodes + node_presence(true) count = 6 for each package", () => {
      const r = runScript();
      const manifest = readArtifact(r.tmpDir, "aak-traceability-gap-manifest.json");
      for (const g of manifest.package_gaps) {
        const presentCount = Object.values(g.node_presence).filter(Boolean).length;
        const total = presentCount + g.missing_nodes.length;
        if (total !== 6) {
          throw new Error(`Node math off for ${g.package_id}: present=${presentCount} + missing=${g.missing_nodes.length} = ${total}, expected 6`);
        }
      }
    });

    it("missing_count = missing_nodes.length + missing_edges.length", () => {
      const r = runScript();
      const manifest = readArtifact(r.tmpDir, "aak-traceability-gap-manifest.json");
      for (const g of manifest.package_gaps) {
        const expected = g.missing_nodes.length + g.missing_edges.length;
        if (g.missing_count !== expected) {
          throw new Error(`missing_count mismatch for ${g.package_id}: ${g.missing_count} vs ${expected}`);
        }
      }
    });
  });

  describe("severity classification", () => {
    it("severity is one of: none, medium, high, critical", () => {
      const r = runScript();
      const manifest = readArtifact(r.tmpDir, "aak-traceability-gap-manifest.json");
      const allowed = new Set(["none", "medium", "high", "critical"]);
      for (const g of manifest.package_gaps) {
        if (!allowed.has(g.severity)) {
          throw new Error(`Invalid severity "${g.severity}" for ${g.package_id}`);
        }
      }
    });

    it("complete chains have severity=none", () => {
      const r = runScript();
      const manifest = readArtifact(r.tmpDir, "aak-traceability-gap-manifest.json");
      for (const g of manifest.package_gaps) {
        if (g.chain_complete && g.severity !== "none") {
          throw new Error(`Complete chain has severity=${g.severity} for ${g.package_id}`);
        }
      }
    });
  });

  describe("aggregate consistency", () => {
    it("complete_chains + incomplete_chains = total_packages", () => {
      const r = runScript();
      const agg = r.parsed;
      if (!agg) throw new Error("No parsed output");
      const total = (agg.complete_chains ?? 0) + (agg.incomplete_chains ?? 0);
      if (total !== agg.package_count) {
        throw new Error(`Aggregate mismatch: ${agg.complete_chains} + ${agg.incomplete_chains} = ${total} vs ${agg.package_count}`);
      }
    });

    it("node_missing_counts sum is consistent", () => {
      const r = runScript();
      const manifest = readArtifact(r.tmpDir, "aak-traceability-gap-manifest.json");
      const counts = manifest?.aggregate?.node_missing_counts;
      if (!counts) throw new Error("node_missing_counts missing");

      // Each count should be between 0 and total_packages
      const total = manifest.aggregate.total_packages;
      for (const [node, count] of Object.entries(counts)) {
        if (count < 0 || count > total) {
          throw new Error(`node_missing_counts.${node}=${count} out of range [0, ${total}]`);
        }
      }
    });
  });

  describe("determinism", () => {
    it("idempotent: same inputs produce identical results", () => {
      const inputs = [
        path.join(repoRoot, "fixtures/admin/eipc/valid-eip-001.json"),
      ];
      const r1 = runScript(inputs);
      const r2 = runScript(inputs);
      if (r1.parsed?.completeness_percentage !== r2.parsed?.completeness_percentage) {
        throw new Error("Non-deterministic completeness_percentage");
      }
      if (r1.parsed?.package_count !== r2.parsed?.package_count) {
        throw new Error("Non-deterministic package_count");
      }
    });
  });

  describe("mutation summary", () => {
    it("declares zero mutations", () => {
      const r = runScript();
      const manifest = readArtifact(r.tmpDir, "aak-traceability-gap-manifest.json");
      const ms = manifest?.mutation_summary;
      if (!ms) throw new Error("mutation_summary missing");
      if (ms.database_writes !== "none") throw new Error(`database_writes=${ms.database_writes}`);
      if (ms.runtime_mutations !== "none") throw new Error(`runtime_mutations=${ms.runtime_mutations}`);
      if (ms.product_changes !== "none") throw new Error(`product_changes=${ms.product_changes}`);
      if (ms.push_merge_deploy !== "none") throw new Error(`push_merge_deploy=${ms.push_merge_deploy}`);
    });
  });
});
