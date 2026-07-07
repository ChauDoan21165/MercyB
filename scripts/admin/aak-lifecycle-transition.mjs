#!/usr/bin/env node
/**
 * AAK-LIFECYCLE-TRANSITION-RULES-001 — Lifecycle Transition Manager
 *
 * Machine-readable lifecycle transition rule registry with:
 * - Strict schema validation of the transition rule set
 * - Allowed-transition lookup (is this from→to valid?)
 * - Required-artifact listing for each transition
 * - Execution record validation (does this record satisfy its transition?)
 * - Invalid transition reporting with diagnostic codes
 * - Transition graph analysis (reachable states, dead ends, missing paths)
 * - Rule set health report
 *
 * The lifecycle governs how EIP packages move through states:
 *   DRAFT → PLANNING_APPROVED → ENGINEERING_VALIDATED → JUDGE_REVIEWED
 *
 * Safety: READ_ONLY by default. Registration mode (--register) writes only
 * to the rules fixture file, never to a database or runtime config.
 */

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "../..");

const DEFAULT_RULES_PATH = path.join(
  repoRoot,
  "fixtures/admin/aak/lifecycle-transition-rules.json",
);
const DEFAULT_CASES_PATH = path.join(
  repoRoot,
  "fixtures/admin/aak/lifecycle-transition-cases.json",
);
const DEFAULT_OUTPUT_DIR = path.join("/Users/admin/autorun/reports", "aak-lifecycle-transition");

// ---------------------------------------------------------------------------
// Schema for lifecycle transition rules
// ---------------------------------------------------------------------------

const RULES_SCHEMA = {
  type: "object",
  required: ["rule_set_id", "version", "transitions"],
  additionalProperties: false,
  properties: {
    rule_set_id: { type: "string", const: "aak-lifecycle-transition-rules", minLength: 1 },
    version: { type: "string", minLength: 1 },
    mode: { type: "string" },
    description: { type: "string" },
    transitions: {
      type: "array",
      minItems: 1,
      items: {
        type: "object",
        required: ["transition", "from", "to", "required_artifacts", "diagnostic_code"],
        additionalProperties: false,
        properties: {
          transition: { type: "string", minLength: 1 },
          from: { type: "string", minLength: 1 },
          to: { type: "string", minLength: 1 },
          required_artifacts: {
            type: "array",
            minItems: 1,
            items: { type: "string", minLength: 1 },
          },
          diagnostic_code: { type: "string", minLength: 1 },
          description: { type: "string" },
        },
      },
    },
    diagnostics: { type: "object" },
  },
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function exists(p) { return fs.existsSync(p); }
function ensureDir(dir) { fs.mkdirSync(dir, { recursive: true }); }

function readJson(filePath) {
  try { return JSON.parse(fs.readFileSync(filePath, "utf8")); }
  catch { return null; }
}

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function typeMatches(value, expectedType) {
  if (Array.isArray(expectedType)) return expectedType.some((t) => typeMatches(value, t));
  if (expectedType === "array") return Array.isArray(value);
  if (expectedType === "object") return isPlainObject(value);
  if (expectedType === "null") return value === null;
  return typeof value === expectedType;
}

function transitionKey(from, to) {
  return `${from || ""}->${to || ""}`;
}

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

function validateValue(schema, value, label, errors) {
  if (schema.const !== undefined && value !== schema.const) {
    errors.push({ field: label, reason: "const_mismatch", expected: schema.const, actual: value });
    return;
  }
  if (schema.type !== undefined && !typeMatches(value, schema.type)) {
    errors.push({
      field: label, reason: "type_mismatch",
      expected: schema.type,
      actual: Array.isArray(value) ? "array" : value === null ? "null" : typeof value,
    });
    return;
  }
  if (schema.minLength !== undefined && typeof value === "string" && value.length < schema.minLength) {
    errors.push({ field: label, reason: "min_length", minimum: schema.minLength, actual: value.length });
  }
  if (schema.minItems !== undefined && Array.isArray(value) && value.length < schema.minItems) {
    errors.push({ field: label, reason: "min_items", minimum: schema.minItems, actual: value.length });
  }
  if (schema.type === "object") {
    for (const key of (schema.required || [])) {
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

function loadAndValidateRules(rulesPath) {
  const data = readJson(rulesPath);
  if (!data) {
    return {
      ok: false, rules_path: rulesPath,
      error: "file_not_found_or_invalid_json",
      errors: [{ field: "root", reason: "file_not_found_or_invalid_json" }],
      transitions: [], by_transition: {},
    };
  }

  const errors = [];
  validateValue(RULES_SCHEMA, data, "rules", errors);

  // Semantic checks
  const transitionKeys = new Set();
  const transitions = [];
  const states = new Set();

  if (Array.isArray(data.transitions)) {
    for (const [index, rule] of data.transitions.entries()) {
      const label = `transitions[${index}]`;
      if (!isPlainObject(rule)) continue;

      const key = transitionKey(rule.from, rule.to);

      // transition field must match from→to
      if (rule.transition && rule.transition !== key) {
        errors.push({
          field: `${label}.transition`, reason: "transition_key_mismatch",
          expected: key, actual: rule.transition,
        });
      }

      // Duplicate check
      if (transitionKeys.has(key)) {
        errors.push({ field: `${label}.transition`, reason: "duplicate_transition", actual: key });
      } else {
        transitionKeys.add(key);
      }

      if (rule.from) states.add(rule.from);
      if (rule.to) states.add(rule.to);

      transitions.push({
        transition: key,
        from: rule.from,
        to: rule.to,
        required_artifacts: [...(rule.required_artifacts || [])].sort(),
        diagnostic_code: rule.diagnostic_code,
        description: rule.description || null,
      });
    }
  }

  const by_transition = Object.fromEntries(transitions.map((t) => [t.transition, t]));

  return {
    ok: errors.length === 0,
    rules_path: rulesPath,
    rule_set_id: data.rule_set_id,
    version: data.version,
    mode: data.mode || null,
    transition_count: transitions.length,
    errors,
    transitions,
    by_transition,
    states: [...states].sort(),
    state_count: states.size,
  };
}

// ---------------------------------------------------------------------------
// Transition graph analysis
// ---------------------------------------------------------------------------

function analyzeGraph(validation) {
  const { transitions, states } = validation;

  // Incoming/outgoing edges per state
  const outgoing = {};
  const incoming = {};
  for (const state of states) {
    outgoing[state] = [];
    incoming[state] = [];
  }
  for (const t of transitions) {
    if (outgoing[t.from]) outgoing[t.from].push(t.to);
    if (incoming[t.to]) incoming[t.to].push(t.from);
  }

  // Entry states (no incoming transitions)
  const entryStates = states.filter((s) => incoming[s]?.length === 0);

  // Exit/terminal states (no outgoing transitions)
  const terminalStates = states.filter((s) => outgoing[s]?.length === 0);

  // Dead-end states (have incoming but no outgoing — mid-pipeline block)
  const deadEnds = states.filter((s) => incoming[s]?.length > 0 && outgoing[s]?.length === 0);

  // Reachable from entry
  const reachableFromEntry = new Set();
  const queue = [...entryStates];
  while (queue.length > 0) {
    const s = queue.shift();
    if (reachableFromEntry.has(s)) continue;
    reachableFromEntry.add(s);
    for (const next of (outgoing[s] || [])) {
      if (!reachableFromEntry.has(next)) queue.push(next);
    }
  }

  // Unreachable states
  const unreachable = states.filter((s) => !reachableFromEntry.has(s));

  // Gap detection: states that exist but have no path from DRAFT to JUDGE_REVIEWED
  const fullPathExists = entryStates.includes("DRAFT") &&
    terminalStates.includes("JUDGE_REVIEWED");

  // Check if there's a continuous path from DRAFT to JUDGE_REVIEWED
  let hasContinuousPath = false;
  if (states.includes("DRAFT") && states.includes("JUDGE_REVIEWED")) {
    const visited = new Set();
    const explore = ["DRAFT"];
    while (explore.length > 0) {
      const s = explore.shift();
      if (s === "JUDGE_REVIEWED") { hasContinuousPath = true; break; }
      if (visited.has(s)) continue;
      visited.add(s);
      for (const next of (outgoing[s] || [])) {
        if (!visited.has(next)) explore.push(next);
      }
    }
  }

  return {
    state_count: states.length,
    transition_count: transitions.length,
    entry_states: entryStates,
    terminal_states: terminalStates,
    dead_end_states: deadEnds,
    unreachable_states: unreachable,
    full_path_draft_to_judge: hasContinuousPath,
    has_entry: entryStates.length > 0,
    has_terminal: terminalStates.length > 0,
    adjacency: Object.fromEntries(
      states.map((s) => [s, { from: incoming[s] || [], to: outgoing[s] || [] }]),
    ),
  };
}

// ---------------------------------------------------------------------------
// Execution record validation
// ---------------------------------------------------------------------------

function validateExecution(validation, executionRecord) {
  const errors = [];
  const transition = executionRecord.transition || {};
  const key = transitionKey(transition.from, transition.to);
  const rule = validation.by_transition[key] || null;

  // Required fields
  if (!executionRecord.execution_id) {
    errors.push({ field: "execution_id", reason: "missing_required" });
  }
  if (!transition.from || !transition.to) {
    errors.push({
      field: "transition", reason: "missing_required",
      diagnostic_code: "LIFECYCLE_TRANSITION_MISSING",
      message: "The execution record must provide transition.from and transition.to.",
    });
  } else if (!rule) {
    errors.push({
      field: "transition", reason: "invalid_transition",
      diagnostic_code: "LIFECYCLE_TRANSITION_NOT_ALLOWED",
      actual: key,
      allowed: Object.keys(validation.by_transition).sort(),
      message: "The requested lifecycle transition is not in this deterministic rule set.",
    });
  }

  // Required artifacts
  if (rule) {
    for (const field of rule.required_artifacts) {
      if (!executionRecord[field]) {
        errors.push({
          field, reason: "missing_required_for_transition",
          diagnostic_code: "LIFECYCLE_ARTIFACT_REQUIRED",
          transition: key,
          message: `The execution record is missing artifact '${field}' required by transition ${key}.`,
        });
      }
    }
  }

  errors.sort((a, b) => `${a.field}:${a.reason}`.localeCompare(`${b.field}:${b.reason}`));

  return {
    ok: errors.length === 0,
    execution_id: executionRecord.execution_id ?? null,
    transition: key,
    transition_allowed: rule !== null,
    rule: rule ? {
      transition: rule.transition,
      diagnostic_code: rule.diagnostic_code,
      required_artifacts: rule.required_artifacts,
    } : null,
    errors,
    diagnostic_codes: errors.map((e) => e.diagnostic_code).filter(Boolean),
  };
}

// ---------------------------------------------------------------------------
// Batch validation against test cases
// ---------------------------------------------------------------------------

function runTestCase(validation, testCase) {
  const executionFile = path.join(repoRoot, testCase.execution_record_file);
  if (!exists(executionFile)) {
    return {
      case_id: testCase.case_id,
      execution_record_file: testCase.execution_record_file,
      error: "file_not_found",
      ok: false,
      expected_ok: testCase.expected_ok,
    };
  }

  const executionRecord = readJson(executionFile);
  const result = validateExecution(validation, executionRecord);

  const pass = result.ok === testCase.expected_ok;

  return {
    case_id: testCase.case_id,
    execution_record_file: testCase.execution_record_file,
    ok: result.ok,
    expected_ok: testCase.expected_ok,
    pass,
    diagnostic_codes: result.diagnostic_codes,
    expected_diagnostics: testCase.expected_diagnostics || [],
    diagnostics_match: JSON.stringify([...result.diagnostic_codes].sort()) ===
      JSON.stringify([...(testCase.expected_diagnostics || [])].sort()),
  };
}

// ---------------------------------------------------------------------------
// Registration
// ---------------------------------------------------------------------------

function registerTransition(rulesPath, newTransition) {
  const data = readJson(rulesPath);
  if (!data) throw new Error(`Cannot read rules: ${rulesPath}`);

  // Validate the new transition
  const errors = [];
  validateValue(RULES_SCHEMA.properties.transitions.items, newTransition, "new_transition", errors);
  if (errors.length > 0) {
    throw new Error(`Invalid transition: ${JSON.stringify(errors)}`);
  }

  const key = transitionKey(newTransition.from, newTransition.to);
  if (newTransition.transition !== key) {
    throw new Error(`transition key mismatch: ${newTransition.transition} vs ${key}`);
  }

  // Check for duplicate
  if (data.transitions.some((t) => transitionKey(t.from, t.to) === key)) {
    throw new Error(`Duplicate transition: ${key}`);
  }

  data.transitions.push(newTransition);
  data.transitions.sort((a, b) => a.transition.localeCompare(b.transition));

  // Bump version
  const parts = (data.version || "1.0.0").split(".").map(Number);
  parts[2] = (parts[2] || 0) + 1;
  data.version = parts.join(".");

  return data;
}

// ---------------------------------------------------------------------------
// Report
// ---------------------------------------------------------------------------

function buildReport(validation, graph, caseResults) {
  const lines = [];
  lines.push("# AAK Lifecycle Transition Rules Report");
  lines.push("");
  lines.push(`rule_set_id: ${validation.rule_set_id}`);
  lines.push(`version: ${validation.version}`);
  lines.push(`mode: ${validation.mode}`);
  lines.push(`valid: ${validation.ok}`);
  lines.push(`transition_count: ${validation.transition_count}`);
  lines.push(`state_count: ${validation.state_count}`);
  lines.push("");
  lines.push("## Allowed Transitions");
  for (const t of validation.transitions) {
    lines.push(`- \`${t.transition}\`: requires [${t.required_artifacts.join(", ")}] (${t.diagnostic_code})`);
  }
  lines.push("");
  lines.push("## State Graph");
  lines.push(`- entry_states: ${graph.entry_states.join(", ") || "none"}`);
  lines.push(`- terminal_states: ${graph.terminal_states.join(", ") || "none"}`);
  lines.push(`- dead_end_states: ${graph.dead_end_states.join(", ") || "none"}`);
  lines.push(`- unreachable_states: ${graph.unreachable_states.join(", ") || "none"}`);
  lines.push(`- full_path_draft_to_judge: ${graph.full_path_draft_to_judge}`);
  lines.push("");
  if (caseResults && caseResults.length > 0) {
    lines.push("## Test Case Results");
    for (const tc of caseResults) {
      const status = tc.pass ? "PASS" : "FAIL";
      lines.push(`- [${status}] ${tc.case_id}: ok=${tc.ok}, expected_ok=${tc.expected_ok}, diagnostics=${tc.diagnostic_codes.join(", ") || "none"}`);
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
// CLI
// ---------------------------------------------------------------------------

function printUsage() {
  process.stderr.write(
    [
      "usage: node scripts/admin/aak-lifecycle-transition.mjs <command> [options]",
      "",
      "commands:",
      "  validate [path]          Validate the lifecycle transition rules",
      "  health [path]            Full health check with graph analysis",
      "  allowed [path]           List all allowed transitions",
      "  check <from> <to> [path] Check if a specific transition is allowed",
      "  artifacts <from> <to> [path] List required artifacts for a transition",
      "  validate-exec <file> [path] Validate an execution record",
      "  test-cases [cases-path] [path] Run test case suite",
      "  states [path]            List all states in the lifecycle",
      "  graph [path]             Show the transition graph",
      "  register <transition-json> [path] Register a new transition (writes file)",
      "",
      "If [path] is omitted, uses fixtures/admin/aak/lifecycle-transition-rules.json",
    ].join("\n") + "\n",
  );
}

function parseArgs(argv) {
  const command = argv[0];
  const rest = argv.slice(1);
  const args = { command, rulesPath: DEFAULT_RULES_PATH, outputDir: DEFAULT_OUTPUT_DIR, help: false, fromState: null, toState: null, execFile: null, casesPath: DEFAULT_CASES_PATH, transitionJson: null };

  let rulesPathSet = false;
  let casesPathSet = false;

  for (let i = 0; i < rest.length; i++) {
    const arg = rest[i];
    if (arg === "--output-dir" || arg === "-o") {
      args.outputDir = path.resolve(rest[++i]);
    } else if (arg === "--help" || arg === "-h") {
      args.help = true;
    } else if (!arg.startsWith("-")) {
      // Route positional args based on command
      if (command === "check" && args.fromState === null) {
        args.fromState = arg;
      } else if (command === "check" && args.toState === null) {
        args.toState = arg;
      } else if (command === "artifacts" && args.fromState === null) {
        args.fromState = arg;
      } else if (command === "artifacts" && args.toState === null) {
        args.toState = arg;
      } else if (command === "validate-exec" && args.execFile === null) {
        args.execFile = path.resolve(arg);
      } else if (command === "register" && args.transitionJson === null) {
        args.transitionJson = arg;
      } else if ((command === "test-cases" || command === "health") && !casesPathSet) {
        // First positional for test-cases/health = casesPath (only if not rulesPath)
        // But for health, first positional is actually rulesPath
        if (command === "health" && !rulesPathSet) {
          args.rulesPath = path.resolve(arg);
          rulesPathSet = true;
        } else if (command === "test-cases") {
          args.casesPath = path.resolve(arg);
          casesPathSet = true;
        }
      } else if (!rulesPathSet && args.rulesPath === DEFAULT_RULES_PATH) {
        args.rulesPath = path.resolve(arg);
        rulesPathSet = true;
      }
    }
  }
  return args;
}

function main() {
  const argv = process.argv.slice(2).filter((a) => a !== "--");
  if (argv.length === 0) { printUsage(); process.exit(1); }

  const args = parseArgs(argv);
  if (args.help) { printUsage(); return; }

  ensureDir(args.outputDir);

  switch (args.command) {
    case "validate": {
      const v = loadAndValidateRules(args.rulesPath);
      process.stdout.write(JSON.stringify({ runner: "AAK-LIFECYCLE-TRANSITION-001", command: "validate", ...v }, null, 2) + "\n");
      process.exit(v.ok ? 0 : 1);
      break;
    }

    case "health": {
      const v = loadAndValidateRules(args.rulesPath);
      const g = analyzeGraph(v);

      // Run test cases if available
      let caseResults = [];
      if (exists(args.casesPath)) {
        const cases = readJson(args.casesPath);
        if (cases && Array.isArray(cases.cases)) {
          caseResults = cases.cases.map((tc) => runTestCase(v, tc));
        }
      }

      const issues = [];
      if (g.dead_end_states.length > 0) {
        issues.push({ severity: "high", category: "graph", message: `Dead-end states (no outgoing transitions): ${g.dead_end_states.join(", ")}` });
      }
      if (g.unreachable_states.length > 0) {
        issues.push({ severity: "high", category: "graph", message: `Unreachable states: ${g.unreachable_states.join(", ")}` });
      }
      if (!g.full_path_draft_to_judge) {
        issues.push({ severity: "critical", category: "graph", message: "No continuous path from DRAFT to JUDGE_REVIEWED" });
      }
      if (v.transition_count < 3) {
        issues.push({ severity: "medium", category: "coverage", message: `Only ${v.transition_count} transitions — may not cover full lifecycle` });
      }

      const health = issues.length === 0 ? "healthy"
        : issues.some((i) => i.severity === "critical") ? "critical"
        : issues.some((i) => i.severity === "high") ? "degraded" : "warning";

      const manifest = {
        schema_version: "aak-lifecycle-transition-health/v1",
        runner: "AAK-LIFECYCLE-TRANSITION-001",
        command: "health",
        generated_at: new Date().toISOString(),
        validation: v,
        graph: g,
        health: { health, issues, issue_count: issues.length },
        case_results: caseResults,
        case_pass_count: caseResults.filter((c) => c.pass).length,
        case_fail_count: caseResults.filter((c) => !c.pass).length,
        mutation_summary: { database_writes: "none", runtime_mutations: "none", product_changes: "none", push_merge_deploy: "none" },
      };

      const manifestPath = path.join(args.outputDir, "aak-lifecycle-transition-health.json");
      const reportPath = path.join(args.outputDir, "aak-lifecycle-transition-report.md");
      fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
      fs.writeFileSync(reportPath, buildReport(v, g, caseResults));

      process.stdout.write(JSON.stringify({
        ok: v.ok && health !== "critical",
        ...manifest, manifest_path: manifestPath, report_path: reportPath,
      }, null, 2) + "\n");
      break;
    }

    case "allowed": {
      const v = loadAndValidateRules(args.rulesPath);
      process.stdout.write(JSON.stringify({
        runner: "AAK-LIFECYCLE-TRANSITION-001", command: "allowed",
        allowed_transitions: Object.keys(v.by_transition).sort(),
        count: Object.keys(v.by_transition).length,
      }, null, 2) + "\n");
      break;
    }

    case "check": {
      if (!args.fromState || !args.toState) {
        process.stderr.write("Error: check requires <from> <to>\n");
        process.exit(1);
      }
      const v = loadAndValidateRules(args.rulesPath);
      const key = transitionKey(args.fromState, args.toState);
      const rule = v.by_transition[key] || null;
      process.stdout.write(JSON.stringify({
        transition: key, allowed: rule !== null,
        required_artifacts: rule ? rule.required_artifacts : [],
        diagnostic_code: rule ? rule.diagnostic_code : null,
        description: rule ? rule.description : null,
      }, null, 2) + "\n");
      process.exit(rule ? 0 : 1);
      break;
    }

    case "artifacts": {
      if (!args.fromState || !args.toState) {
        process.stderr.write("Error: artifacts requires <from> <to>\n");
        process.exit(1);
      }
      const v = loadAndValidateRules(args.rulesPath);
      const key = transitionKey(args.fromState, args.toState);
      const rule = v.by_transition[key] || null;
      if (!rule) {
        process.stderr.write(`Transition not allowed: ${key}\n`);
        process.exit(1);
      }
      process.stdout.write(JSON.stringify({ transition: key, required_artifacts: rule.required_artifacts }, null, 2) + "\n");
      break;
    }

    case "validate-exec": {
      if (!args.execFile) {
        process.stderr.write("Error: validate-exec requires <execution-record.json>\n");
        process.exit(1);
      }
      const v = loadAndValidateRules(args.rulesPath);
      const execRecord = readJson(args.execFile);
      if (!execRecord) {
        process.stderr.write(`Cannot read execution record: ${args.execFile}\n`);
        process.exit(1);
      }
      const result = validateExecution(v, execRecord);
      process.stdout.write(JSON.stringify({ runner: "AAK-LIFECYCLE-TRANSITION-001", command: "validate-exec", ...result }, null, 2) + "\n");
      process.exit(result.ok ? 0 : 1);
      break;
    }

    case "test-cases": {
      const v = loadAndValidateRules(args.rulesPath);
      const cases = readJson(args.casesPath);
      if (!cases || !Array.isArray(cases.cases)) {
        process.stderr.write(`Invalid test cases file: ${args.casesPath}\n`);
        process.exit(1);
      }
      const results = cases.cases.map((tc) => runTestCase(v, tc));
      const allPass = results.every((r) => r.pass);
      process.stdout.write(JSON.stringify({
        runner: "AAK-LIFECYCLE-TRANSITION-001", command: "test-cases",
        total: results.length, pass: results.filter((r) => r.pass).length,
        fail: results.filter((r) => !r.pass).length, all_pass: allPass,
        results,
      }, null, 2) + "\n");
      process.exit(allPass ? 0 : 1);
      break;
    }

    case "states": {
      const v = loadAndValidateRules(args.rulesPath);
      process.stdout.write(JSON.stringify({ states: v.states, count: v.state_count }, null, 2) + "\n");
      break;
    }

    case "graph": {
      const v = loadAndValidateRules(args.rulesPath);
      const g = analyzeGraph(v);
      process.stdout.write(JSON.stringify({ runner: "AAK-LIFECYCLE-TRANSITION-001", command: "graph", ...g }, null, 2) + "\n");
      break;
    }

    case "register": {
      if (!args.transitionJson) {
        process.stderr.write("Error: register requires a transition JSON file or inline JSON\n");
        process.exit(1);
      }
      try {
        let newTransition;
        if (exists(args.transitionJson)) {
          newTransition = readJson(args.transitionJson);
        } else {
          newTransition = JSON.parse(args.transitionJson);
        }
        const updated = registerTransition(args.rulesPath, newTransition);
        const backupPath = args.rulesPath + ".bak";
        fs.copyFileSync(args.rulesPath, backupPath);
        fs.writeFileSync(args.rulesPath, JSON.stringify(updated, null, 2) + "\n");
        process.stdout.write(JSON.stringify({
          ok: true, command: "register",
          transition: newTransition.transition,
          rules_path: args.rulesPath, backup_path: backupPath,
          new_version: updated.version, new_transition_count: updated.transitions.length,
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
