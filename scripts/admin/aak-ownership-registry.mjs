#!/usr/bin/env node
/**
 * AAK-OWNERSHIP-RULES-REGISTRY-001 — Ownership Registry Manager
 *
 * Machine-readable ownership routing registry with:
 * - Strict schema validation
 * - Conflict detection (overlapping regex patterns)
 * - Auto-registration of new rules
 * - Routing test (given a subject, which team owns it?)
 * - Registry health report
 *
 * The registry maps subject_type patterns → owner_team via regex matching.
 * Rules are ordered by priority (lower number = higher priority).
 *
 * Safety: READ_ONLY by default. Registration mode (--register) writes only
 * to the registry fixture file, never to a database or runtime config.
 */

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "../..");

const DEFAULT_REGISTRY_PATH = path.join(
  repoRoot,
  "fixtures/admin/aak/ownership-routing-registry.json",
);
const DEFAULT_OUTPUT_DIR = path.join("/Users/admin/autorun/reports", "aak-ownership-registry");

// ---------------------------------------------------------------------------
// Schema definition (inline — mirrors the existing fixture structure)
// ---------------------------------------------------------------------------

const REGISTRY_SCHEMA = {
  type: "object",
  required: ["registry_id", "version", "default_owner_team", "rules"],
  additionalProperties: false,
  properties: {
    registry_id: { type: "string", const: "aak-ownership-routing-registry", minLength: 1 },
    version: { type: "string", minLength: 1 },
    default_owner_team: { type: "string", minLength: 1 },
    description: { type: "string" },
    rules: {
      type: "array",
      minItems: 1,
      items: {
        type: "object",
        required: ["rule_id", "priority", "pattern", "flags", "owner_team", "examples"],
        additionalProperties: false,
        properties: {
          rule_id: { type: "string", minLength: 1 },
          priority: { type: "number", minimum: 1 },
          pattern: { type: "string", minLength: 1 },
          flags: { type: "string" },
          owner_team: { type: "string", minLength: 1 },
          examples: {
            type: "array",
            minItems: 1,
            items: { type: "string", minLength: 1 },
          },
          description: { type: "string" },
        },
      },
    },
  },
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function exists(filePath) {
  return fs.existsSync(filePath);
}

function readJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch {
    return null;
  }
}

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function deepFreeze(value) {
  if (!value || typeof value !== "object" || Object.isFrozen(value)) return value;
  for (const child of Object.values(value)) deepFreeze(child);
  return Object.freeze(value);
}

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

function typeMatches(value, expectedType) {
  if (Array.isArray(expectedType)) return expectedType.some((t) => typeMatches(value, t));
  if (expectedType === "array") return Array.isArray(value);
  if (expectedType === "object") return isPlainObject(value);
  if (expectedType === "null") return value === null;
  return typeof value === expectedType;
}

function validateValue(schema, value, label, errors) {
  if (schema.const !== undefined && value !== schema.const) {
    errors.push({ field: label, reason: "const_mismatch", expected: schema.const, actual: value });
    return;
  }

  if (schema.type !== undefined && !typeMatches(value, schema.type)) {
    errors.push({
      field: label,
      reason: "type_mismatch",
      expected: schema.type,
      actual: Array.isArray(value) ? "array" : value === null ? "null" : typeof value,
    });
    return;
  }

  if (schema.minLength !== undefined && typeof value === "string" && value.length < schema.minLength) {
    errors.push({ field: label, reason: "min_length", minimum: schema.minLength, actual: value.length });
  }

  if (schema.minimum !== undefined && typeof value === "number" && value < schema.minimum) {
    errors.push({ field: label, reason: "minimum", minimum: schema.minimum, actual: value });
  }

  if (schema.minItems !== undefined && Array.isArray(value) && value.length < schema.minItems) {
    errors.push({ field: label, reason: "min_items", minimum: schema.minItems, actual: value.length });
  }

  if (schema.type === "object") {
    const required = schema.required || [];
    for (const key of required) {
      if (!(key in (value || {}))) errors.push({ field: `${label}.${key}`, reason: "missing_required" });
    }

    if (schema.additionalProperties === false) {
      const allowed = new Set(Object.keys(schema.properties || {}));
      for (const key of Object.keys(value || {})) {
        if (!allowed.has(key)) errors.push({ field: `${label}.${key}`, reason: "additional_property" });
      }
    }

    for (const [key, childSchema] of Object.entries(schema.properties || {})) {
      if (key in (value || {})) validateValue(childSchema, value[key], `${label}.${key}`, errors);
    }
  }

  if (schema.type === "array" && schema.items && Array.isArray(value)) {
    value.forEach((item, index) => validateValue(schema.items, item, `${label}[${index}]`, errors));
  }
}

function loadAndValidateRegistry(registryPath) {
  const data = readJson(registryPath);
  if (!data) {
    return {
      ok: false,
      registry_path: registryPath,
      error: "file_not_found_or_invalid_json",
      errors: [{ field: "root", reason: "file_not_found_or_invalid_json" }],
      rules: [],
    };
  }

  const errors = [];
  validateValue(REGISTRY_SCHEMA, data, "registry", errors);

  // Additional semantic checks
  if (Array.isArray(data.rules)) {
    const priorities = new Set();
    const ruleIds = new Set();
    const patterns = [];

    for (const [index, rule] of data.rules.entries()) {
      const label = `rules[${index}]`;

      // Priority uniqueness
      if (typeof rule.priority === "number" && rule.priority >= 1) {
        if (priorities.has(rule.priority)) {
          errors.push({ field: `${label}.priority`, reason: "duplicate_priority", actual: rule.priority });
        } else {
          priorities.add(rule.priority);
        }
      }

      // Rule ID uniqueness
      if (typeof rule.rule_id === "string" && rule.rule_id.length > 0) {
        if (ruleIds.has(rule.rule_id)) {
          errors.push({ field: `${label}.rule_id`, reason: "duplicate_rule_id", actual: rule.rule_id });
        } else {
          ruleIds.add(rule.rule_id);
        }
      }

      // Regex validity
      if (typeof rule.pattern === "string" && rule.pattern.length > 0) {
        try {
          new RegExp(rule.pattern, rule.flags || "");
          patterns.push({ index, pattern: rule.pattern, flags: rule.flags || "", rule_id: rule.rule_id });
        } catch (regexError) {
          errors.push({
            field: `${label}.pattern`,
            reason: "invalid_regex",
            message: regexError.message,
          });
        }
      }
    }

    // Conflict detection: check for overlapping patterns
    const conflicts = [];
    for (let i = 0; i < patterns.length; i++) {
      for (let j = i + 1; j < patterns.length; j++) {
        const a = patterns[i];
        const b = patterns[j];
        // Test overlap: try each rule's examples against the other's pattern
        const ruleA = data.rules[a.index];
        const ruleB = data.rules[b.index];

        let overlapDetected = false;
        const overlapExamples = [];

        for (const ex of ruleA.examples || []) {
          try {
            const reB = new RegExp(b.pattern, b.flags);
            if (reB.test(ex)) {
              overlapDetected = true;
              overlapExamples.push({ example: ex, matches: b.rule_id });
            }
          } catch { /* skip */ }
        }
        for (const ex of ruleB.examples || []) {
          try {
            const reA = new RegExp(a.pattern, a.flags);
            if (reA.test(ex)) {
              overlapDetected = true;
              overlapExamples.push({ example: ex, matches: a.rule_id });
            }
          } catch { /* skip */ }
        }

        if (overlapDetected) {
          conflicts.push({
            rule_a: { rule_id: a.rule_id, priority: ruleA.priority, pattern: a.pattern },
            rule_b: { rule_id: b.rule_id, priority: ruleB.priority, pattern: b.pattern },
            overlapping_examples: [...new Set(overlapExamples.map((e) => e.example))],
            resolution: `Rule with higher priority (lower number) wins: ${ruleA.priority <= ruleB.priority ? a.rule_id : b.rule_id}`,
          });
        }
      }
    }

    return {
      ok: errors.length === 0,
      registry_path: registryPath,
      registry_id: data.registry_id,
      version: data.version,
      default_owner_team: data.default_owner_team,
      rule_count: data.rules.length,
      errors,
      conflicts,
      conflict_count: conflicts.length,
      rules: data.rules.map((r) => ({
        rule_id: r.rule_id,
        priority: r.priority,
        pattern: r.pattern,
        flags: r.flags,
        owner_team: r.owner_team,
        example_count: (r.examples || []).length,
      })),
    };
  }

  return {
    ok: errors.length === 0,
    registry_path: registryPath,
    registry_id: data.registry_id,
    version: data.version,
    default_owner_team: data.default_owner_team ?? null,
    rule_count: Array.isArray(data.rules) ? data.rules.length : 0,
    errors,
    conflicts: [],
    conflict_count: 0,
    rules: [],
  };
}

// ---------------------------------------------------------------------------
// Routing test
// ---------------------------------------------------------------------------

function testRouting(validation, subjectTypes) {
  const results = [];
  const rules = validation.rules || [];

  // Sort by priority (ascending)
  const sorted = [...rules].sort((a, b) => a.priority - b.priority);

  for (const subjectType of subjectTypes) {
    const normalized = String(subjectType).toLowerCase();
    let matched = null;

    for (const rule of sorted) {
      try {
        const re = new RegExp(rule.pattern, rule.flags || "");
        if (re.test(normalized)) {
          matched = rule;
          break;
        }
      } catch { /* skip invalid regex */ }
    }

    results.push({
      subject_type: subjectType,
      normalized,
      owner_team: matched ? matched.owner_team : validation.default_owner_team,
      matched_rule: matched ? matched.rule_id : null,
      matched_priority: matched ? matched.priority : null,
      is_default: matched === null,
    });
  }

  return results;
}

// ---------------------------------------------------------------------------
// Health check
// ---------------------------------------------------------------------------

function buildHealthReport(validation, routingTests) {
  const issues = [];

  // Check: minimum rule count
  if (validation.rule_count < 3) {
    issues.push({
      severity: "high",
      category: "coverage",
      message: `Only ${validation.rule_count} rules — may not cover all subject types adequately`,
    });
  }

  // Check: conflicts
  if (validation.conflict_count > 0) {
    issues.push({
      severity: "medium",
      category: "conflict",
      message: `${validation.conflict_count} pattern conflict(s) detected — overlapping regex patterns`,
      details: validation.conflicts,
    });
  }

  // Check: default owner coverage
  if (!validation.default_owner_team) {
    issues.push({
      severity: "critical",
      category: "default",
      message: "No default_owner_team configured — unmatched subjects have no owner",
    });
  }

  // Check: gaps in priority
  if (validation.rules.length > 0) {
    const priorities = validation.rules.map((r) => r.priority).sort((a, b) => a - b);
    const minP = priorities[0];
    if (minP > 1) {
      issues.push({
        severity: "low",
        category: "priority",
        message: `Lowest priority is ${minP} — consider starting at 1 for clarity`,
      });
    }
  }

  // Check: regex compile
  const invalidRegex = [];
  if (Array.isArray(validation.rules)) {
    for (const rule of validation.rules) {
      try {
        new RegExp(rule.pattern, rule.flags || "");
      } catch {
        invalidRegex.push(rule.rule_id);
      }
    }
  }
  if (invalidRegex.length > 0) {
    issues.push({
      severity: "critical",
      category: "regex",
      message: `${invalidRegex.length} rule(s) have invalid regex: ${invalidRegex.join(", ")}`,
    });
  }

  const health = issues.length === 0 ? "healthy" : issues.some((i) => i.severity === "critical") ? "critical" : issues.some((i) => i.severity === "high") ? "degraded" : "warning";

  return {
    health,
    issue_count: issues.length,
    issues,
    routing_tests: routingTests || [],
    routing_test_count: (routingTests || []).length,
    default_route_used: (routingTests || []).filter((t) => t.is_default).length,
  };
}

// ---------------------------------------------------------------------------
// Report
// ---------------------------------------------------------------------------

function buildReport(mode, validation, health) {
  const lines = [];
  lines.push("# AAK Ownership Registry Report");
  lines.push("");
  lines.push(`mode: ${mode}`);
  lines.push(`registry_id: ${validation.registry_id}`);
  lines.push(`version: ${validation.version}`);
  lines.push(`rule_count: ${validation.rule_count}`);
  lines.push(`valid: ${validation.ok}`);
  lines.push(`health: ${health.health}`);
  lines.push(`issues: ${health.issue_count}`);
  lines.push(`conflicts: ${validation.conflict_count}`);
  lines.push("");
  lines.push("## Rules");
  for (const rule of (validation.rules || [])) {
    lines.push(`- ${rule.rule_id} (priority=${rule.priority}): \`${rule.pattern}\` → ${rule.owner_team}`);
  }
  lines.push("");
  lines.push(`## Default Owner: ${validation.default_owner_team}`);
  lines.push("");
  if (health.issues.length > 0) {
    lines.push("## Issues");
    for (const issue of health.issues) {
      lines.push(`- [${issue.severity.toUpperCase()}] [${issue.category}] ${issue.message}`);
    }
    lines.push("");
  }
  if (health.routing_tests.length > 0) {
    lines.push("## Routing Tests");
    for (const test of health.routing_tests) {
      const flag = test.is_default ? " (default)" : "";
      lines.push(`- "${test.subject_type}" → ${test.owner_team} [${test.matched_rule ?? "none"}]${flag}`);
    }
    lines.push("");
  }
  lines.push("## Mutation Summary");
  lines.push("- database_writes: none");
  lines.push("- runtime_mutations: none");
  lines.push("- product_changes: none");
  lines.push("- push_merge_deploy: none");
  return lines.join("\n");
}

// ---------------------------------------------------------------------------
// Registration
// ---------------------------------------------------------------------------

function registerRule(registryPath, newRule) {
  const data = readJson(registryPath);
  if (!data) throw new Error(`Cannot read registry: ${registryPath}`);

  // Validate the new rule
  const errors = [];
  validateValue(REGISTRY_SCHEMA.properties.rules.items, newRule, "new_rule", errors);
  if (errors.length > 0) {
    throw new Error(`Invalid rule: ${JSON.stringify(errors)}`);
  }

  // Check for duplicate rule_id
  if (data.rules.some((r) => r.rule_id === newRule.rule_id)) {
    throw new Error(`Duplicate rule_id: ${newRule.rule_id}`);
  }

  // Check for duplicate priority
  if (data.rules.some((r) => r.priority === newRule.priority)) {
    throw new Error(`Duplicate priority: ${newRule.priority}`);
  }

  // Validate regex
  try {
    new RegExp(newRule.pattern, newRule.flags || "");
  } catch (e) {
    throw new Error(`Invalid regex: ${e.message}`);
  }

  // Add the rule
  data.rules.push(newRule);

  // Sort by priority
  data.rules.sort((a, b) => a.priority - b.priority);

  // Bump version
  const parts = (data.version || "1.0.0").split(".").map(Number);
  parts[2] = (parts[2] || 0) + 1;
  data.version = parts.join(".");

  return data;
}

// ---------------------------------------------------------------------------
// JSON schema export
// ---------------------------------------------------------------------------

function exportRegistrySchema() {
  return deepFreeze({
    $schema: "https://json-schema.org/draft/2020-12/schema",
    $id: "aak-ownership-routing-registry.schema.json",
    title: "AAK Ownership Routing Registry",
    description: "Machine-readable ownership routing rules for the AAK (Autonomous Administrative Kernel).",
    ...REGISTRY_SCHEMA,
  });
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

function printUsage() {
  process.stderr.write(
    [
      "usage: node scripts/admin/aak-ownership-registry.mjs <command> [options]",
      "",
      "commands:",
      "  validate [path]            Validate the ownership registry",
      "  health [path]              Full health check with conflict detection",
      "  route <subject> [path]     Test routing: which team owns this subject?",
      "  route-batch <file> [path]  Batch routing test (one subject per line)",
      "  conflicts [path]           Detect overlapping regex patterns",
      "  export-schema              Export the registry JSON Schema",
      "  register <rule-json> [path] Register a new ownership rule (writes to registry file)",
      "",
      "options:",
      "  --output-dir, -o <dir>     Output directory for artifacts (default: autorun/reports/)",
      "",
      "If [path] is omitted, uses fixtures/admin/aak/ownership-routing-registry.json",
    ].join("\n") + "\n",
  );
}

function parseArgs(argv) {
  const command = argv[0];
  const rest = argv.slice(1);

  const args = {
    command,
    registryPath: DEFAULT_REGISTRY_PATH,
    outputDir: DEFAULT_OUTPUT_DIR,
    subject: null,
    subjectFile: null,
    ruleJson: null,
    help: false,
  };

  for (let i = 0; i < rest.length; i++) {
    const arg = rest[i];
    if (arg === "--output-dir" || arg === "-o") {
      args.outputDir = path.resolve(rest[++i]);
    } else if (arg === "--help" || arg === "-h") {
      args.help = true;
    } else if (!arg.startsWith("-")) {
      // Positional: first non-flag is subject/path, second is registry path
      if (args.command === "route" && args.subject === null) {
        args.subject = arg;
      } else if (args.command === "route-batch" && args.subjectFile === null) {
        args.subjectFile = arg;
      } else if (args.command === "register" && args.ruleJson === null) {
        args.ruleJson = arg;
      } else if (args.registryPath === DEFAULT_REGISTRY_PATH) {
        args.registryPath = path.resolve(arg);
      }
    }
  }

  return args;
}

function main() {
  const argv = process.argv.slice(2).filter((a) => a !== "--");
  if (argv.length === 0) {
    printUsage();
    process.exit(1);
  }

  const args = parseArgs(argv);

  if (args.help) {
    printUsage();
    return;
  }

  ensureDir(args.outputDir);

  switch (args.command) {
    case "validate": {
      const validation = loadAndValidateRegistry(args.registryPath);
      const result = {
        runner: "AAK-OWNERSHIP-REGISTRY-001",
        command: "validate",
        ...validation,
      };
      process.stdout.write(JSON.stringify(result, null, 2) + "\n");
      process.exit(validation.ok ? 0 : 1);
      break;
    }

    case "health": {
      const validation = loadAndValidateRegistry(args.registryPath);

      // Default routing test subjects
      const defaultSubjects = [
        "replay",
        "teacher-mercy",
        "coverage-engine",
        "judge-decision",
        "eipc-governance",
        "capability-control",
        "unknown-subject-type",
      ];

      const routingTests = testRouting(validation, defaultSubjects);
      const health = buildHealthReport(validation, routingTests);

      const manifest = {
        schema_version: "aak-ownership-registry-health/v1",
        runner: "AAK-OWNERSHIP-REGISTRY-001",
        command: "health",
        generated_at: new Date().toISOString(),
        validation,
        health,
        mutation_summary: {
          database_writes: "none",
          runtime_mutations: "none",
          product_changes: "none",
          push_merge_deploy: "none",
        },
      };

      const manifestPath = path.join(args.outputDir, "aak-ownership-registry-health.json");
      const reportPath = path.join(args.outputDir, "aak-ownership-registry-report.md");

      fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
      fs.writeFileSync(reportPath, buildReport("health", validation, health));

      process.stdout.write(JSON.stringify({
        ok: validation.ok && health.health !== "critical",
        ...manifest,
        manifest_path: manifestPath,
        report_path: reportPath,
      }, null, 2) + "\n");
      break;
    }

    case "route": {
      if (!args.subject) {
        process.stderr.write("Error: route requires a subject type\n");
        process.exit(1);
      }
      const validation = loadAndValidateRegistry(args.registryPath);
      const results = testRouting(validation, [args.subject]);
      process.stdout.write(JSON.stringify(results[0], null, 2) + "\n");
      break;
    }

    case "route-batch": {
      if (!args.subjectFile) {
        process.stderr.write("Error: route-batch requires a file with one subject per line\n");
        process.exit(1);
      }
      const subjects = fs.readFileSync(args.subjectFile, "utf8")
        .split(/\r?\n/)
        .map((l) => l.trim())
        .filter((l) => l && !l.startsWith("#"));
      const validation = loadAndValidateRegistry(args.registryPath);
      const results = testRouting(validation, subjects);

      const batchPath = path.join(args.outputDir, "aak-ownership-routing-batch.json");
      fs.writeFileSync(batchPath, JSON.stringify(results, null, 2) + "\n");
      process.stdout.write(JSON.stringify({ ok: true, count: results.length, results, batch_path: batchPath }, null, 2) + "\n");
      break;
    }

    case "conflicts": {
      const validation = loadAndValidateRegistry(args.registryPath);
      process.stdout.write(JSON.stringify({
        runner: "AAK-OWNERSHIP-REGISTRY-001",
        command: "conflicts",
        registry_id: validation.registry_id,
        conflict_count: validation.conflict_count,
        conflicts: validation.conflicts,
      }, null, 2) + "\n");
      break;
    }

    case "export-schema": {
      const schema = exportRegistrySchema();
      const schemaPath = path.join(args.outputDir, "aak-ownership-registry.schema.json");
      fs.writeFileSync(schemaPath, JSON.stringify(schema, null, 2) + "\n");
      process.stdout.write(JSON.stringify({ ok: true, schema_path: schemaPath }, null, 2) + "\n");
      break;
    }

    case "register": {
      if (!args.ruleJson) {
        process.stderr.write("Error: register requires a rule JSON file or inline JSON\n");
        process.exit(1);
      }
      try {
        let newRule;
        if (exists(args.ruleJson)) {
          newRule = readJson(args.ruleJson);
        } else {
          newRule = JSON.parse(args.ruleJson);
        }

        const updated = registerRule(args.registryPath, newRule);
        const backupPath = args.registryPath + ".bak";
        fs.copyFileSync(args.registryPath, backupPath);

        fs.writeFileSync(args.registryPath, JSON.stringify(updated, null, 2) + "\n");

        process.stdout.write(JSON.stringify({
          ok: true,
          command: "register",
          rule_id: newRule.rule_id,
          registry_path: args.registryPath,
          backup_path: backupPath,
          new_version: updated.version,
          new_rule_count: updated.rules.length,
        }, null, 2) + "\n");
      } catch (error) {
        process.stderr.write(`Registration failed: ${error.message}\n`);
        process.exit(1);
      }
      break;
    }

    default:
      process.stderr.write(`Unknown command: ${args.command}\n`);
      printUsage();
      process.exit(1);
  }
}

main();
