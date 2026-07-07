#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "../..");
const kernelScript = path.join(repoRoot, "scripts/admin/aak.mjs");
const defaultOutDir = path.join("/Users/admin/autorun/reports", "aak-ci-advisory");

const defaultInputs = {
  eipcValid: path.join(repoRoot, "fixtures/admin/eipc/valid-eip-001.json"),
  eipcInvalid: path.join(repoRoot, "fixtures/admin/eipc/invalid-missing-required.json"),
  lifecycleValid: path.join(repoRoot, "fixtures/admin/aak/lifecycle-valid.json"),
  lifecycleInvalid: path.join(repoRoot, "fixtures/admin/aak/lifecycle-invalid.json"),
  ownershipValid: path.join(repoRoot, "fixtures/admin/aak/ownership-valid.json"),
  ownershipInvalid: path.join(repoRoot, "fixtures/admin/aak/ownership-invalid.json"),
};

function exists(filePath) {
  return fs.existsSync(filePath);
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function writeJson(filePath, value) {
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

function writeText(filePath, value) {
  fs.writeFileSync(filePath, value.endsWith("\n") ? value : `${value}\n`);
}

function runKernel(command, args) {
  const result = spawnSync(process.execPath, [kernelScript, command, ...args], { encoding: "utf8" });
  const stdout = result.stdout || "";
  const stderr = result.stderr || "";
  let parsed = null;
  try {
    parsed = stdout.trim() ? JSON.parse(stdout) : null;
  } catch {
    parsed = null;
  }
  return {
    command,
    args,
    exit_code: typeof result.status === "number" ? result.status : 1,
    stdout,
    stderr,
    ok: result.status === 0,
    parsed,
  };
}

function runIfExists(command, args, inputPaths) {
  if (!inputPaths.every(Boolean) || !inputPaths.every(exists)) {
    return {
      command,
      args,
      skipped: true,
      reason: "missing_inputs",
      ok: true,
      exit_code: 0,
      parsed: null,
    };
  }
  return runKernel(command, args);
}

function advisoryFromKernelResult(kind, result, metadata = {}) {
  const ok = result.skipped ? true : result.ok;
  return {
    kind,
    command: result.command,
    args: result.args,
    skipped: Boolean(result.skipped),
    reason: result.reason ?? null,
    ok,
    exit_code: result.exit_code,
    advisory: !ok,
    metadata,
    result: result.parsed,
  };
}

function summarizeFindings(findings) {
  const summary = {
    checks_run: findings.filter((finding) => !finding.skipped).length,
    advisory_pass: findings.filter((finding) => !finding.skipped && finding.ok).length,
    advisory_fail: findings.filter((finding) => !finding.skipped && !finding.ok).length,
    skipped: findings.filter((finding) => finding.skipped).length,
  };
  return summary;
}

function buildMarkdown(report) {
  const lines = [];
  lines.push(`# AAK CI Advisory Report`);
  lines.push(``);
  lines.push(`mode: ${report.mode}`);
  lines.push(`blocking: ${report.blocking}`);
  lines.push(`checks_run: ${report.summary.checks_run}`);
  lines.push(`advisory_pass: ${report.summary.advisory_pass}`);
  lines.push(`advisory_fail: ${report.summary.advisory_fail}`);
  lines.push(`skipped: ${report.summary.skipped}`);
  lines.push(``);
  lines.push(`## Checks`);
  for (const finding of report.checks) {
    lines.push(`- ${finding.kind}: ${finding.ok ? "PASS" : "FAIL"}${finding.skipped ? " (skipped)" : ""}`);
  }
  lines.push(``);
  lines.push(`## Mutation Summary`);
  lines.push(`- database_writes: none`);
  lines.push(`- runtime_mutations: none`);
  lines.push(`- product_changes: none`);
  lines.push(`- push_merge_deploy: none`);
  lines.push(`- coverage_updates: none`);
  lines.push(`- verification_updates: none`);
  return lines.join("\n");
}

function main() {
  const args = process.argv.slice(2);
  const outDir = path.resolve(args[0] && !args[0].startsWith("--") ? args.shift() : defaultOutDir);
  ensureDir(outDir);

  const findings = [
    advisoryFromKernelResult(
      "eipc_valid",
      runIfExists("validate-eip", [defaultInputs.eipcValid], [defaultInputs.eipcValid]),
      { source: "fixtures/admin/eipc/valid-eip-001.json" },
    ),
    advisoryFromKernelResult(
      "eipc_invalid",
      runIfExists("validate-eip", [defaultInputs.eipcInvalid], [defaultInputs.eipcInvalid]),
      { source: "fixtures/admin/eipc/invalid-missing-required.json" },
    ),
    advisoryFromKernelResult(
      "lifecycle_valid",
      runIfExists("validate-lifecycle", [defaultInputs.eipcValid, defaultInputs.lifecycleValid], [defaultInputs.eipcValid, defaultInputs.lifecycleValid]),
      { source: "fixtures/admin/aak/lifecycle-valid.json" },
    ),
    advisoryFromKernelResult(
      "lifecycle_invalid",
      runIfExists("validate-lifecycle", [defaultInputs.eipcValid, defaultInputs.lifecycleInvalid], [defaultInputs.eipcValid, defaultInputs.lifecycleInvalid]),
      { source: "fixtures/admin/aak/lifecycle-invalid.json" },
    ),
    advisoryFromKernelResult(
      "ownership_valid",
      runIfExists("validate-ownership", [defaultInputs.ownershipValid], [defaultInputs.ownershipValid]),
      { source: "fixtures/admin/aak/ownership-valid.json" },
    ),
    advisoryFromKernelResult(
      "ownership_invalid",
      runIfExists("validate-ownership", [defaultInputs.ownershipInvalid], [defaultInputs.ownershipInvalid]),
      { source: "fixtures/admin/aak/ownership-invalid.json" },
    ),
  ];

  const summary = summarizeFindings(findings);
  const report = {
    ok: true,
    mode: "ADVISORY_ONLY",
    blocking: false,
    runner: "ADMIN-AAK-CI-ADVISORY-001",
    checks: findings,
    summary,
    mutation_summary: {
      database_writes: "none",
      runtime_mutations: "none",
      product_changes: "none",
      push_merge_deploy: "none",
      coverage_updates: "none",
      verification_updates: "none",
    },
  };

  const jsonPath = path.join(outDir, "aak-ci-advisory-report.json");
  const mdPath = path.join(outDir, "aak-ci-advisory-report.md");
  report.report_paths = {
    json: jsonPath,
    markdown: mdPath,
  };
  writeJson(jsonPath, report);
  writeText(mdPath, buildMarkdown(report));
  printJson(report);
}

function printJson(value) {
  process.stdout.write(`${JSON.stringify(value, null, 2)}\n`);
}

main();
