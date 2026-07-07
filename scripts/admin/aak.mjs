#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "../..");
const ownershipRegistryPath = path.join(repoRoot, "fixtures/admin/aak/ownership-routing-registry.json");
const lifecycleTransitionRulesPath = path.join(repoRoot, "fixtures/admin/aak/lifecycle-transition-rules.json");

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function deepFreeze(value) {
  if (!value || typeof value !== "object" || Object.isFrozen(value)) return value;
  for (const child of Object.values(value)) deepFreeze(child);
  return Object.freeze(value);
}

function stableId(prefix, seed) {
  return `${prefix}-${crypto.createHash("sha1").update(seed).digest("hex").slice(0, 16)}`;
}

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function normalizePath(input) {
  return path.resolve(input);
}

function cloneList(value) {
  return Array.isArray(value) ? [...value] : [];
}

function transitionKeyFromParts(from, to) {
  return `${from || ""}->${to || ""}`;
}

function printJson(value) {
  process.stdout.write(`${JSON.stringify(value, null, 2)}\n`);
}

function fail(message, details = {}) {
  const error = new Error(message);
  error.details = details;
  throw error;
}

function loadLifecycleTransitionRules() {
  const artifact = readJson(lifecycleTransitionRulesPath);
  const errors = [];
  if (!isPlainObject(artifact)) {
    errors.push({ field: "rules", reason: "type_mismatch", expected: "object" });
  } else {
    if (artifact.rule_set_id !== "aak-lifecycle-transition-rules") {
      errors.push({ field: "rule_set_id", reason: "const_mismatch", expected: "aak-lifecycle-transition-rules", actual: artifact.rule_set_id });
    }
    if (typeof artifact.version !== "string" || artifact.version.length === 0) {
      errors.push({ field: "version", reason: "missing_required" });
    }
    if (!Array.isArray(artifact.transitions) || artifact.transitions.length === 0) {
      errors.push({
        field: "transitions",
        reason: "min_items",
        minimum: 1,
        actual: Array.isArray(artifact.transitions) ? artifact.transitions.length : 0,
      });
    }
  }

  const transitionIds = new Set();
  const transitions = [];
  const rawTransitions = isPlainObject(artifact) && Array.isArray(artifact.transitions) ? artifact.transitions : [];
  for (const [index, rule] of rawTransitions.entries()) {
    const label = `transitions[${index}]`;
    if (!isPlainObject(rule)) {
      errors.push({ field: label, reason: "type_mismatch", expected: "object" });
      continue;
    }
    const transition = transitionKeyFromParts(rule.from, rule.to);
    for (const field of ["transition", "from", "to", "diagnostic_code"]) {
      if (typeof rule[field] !== "string" || rule[field].length === 0) {
        errors.push({ field: `${label}.${field}`, reason: "missing_required" });
      }
    }
    if (rule.transition !== transition) {
      errors.push({ field: `${label}.transition`, reason: "transition_key_mismatch", expected: transition, actual: rule.transition });
    } else if (transitionIds.has(rule.transition)) {
      errors.push({ field: `${label}.transition`, reason: "duplicate_transition", actual: rule.transition });
    } else {
      transitionIds.add(rule.transition);
    }
    if (!Array.isArray(rule.required_artifacts)) {
      errors.push({ field: `${label}.required_artifacts`, reason: "type_mismatch", expected: "array" });
    } else {
      for (const [artifactIndex, artifactName] of rule.required_artifacts.entries()) {
        if (typeof artifactName !== "string" || artifactName.length === 0) {
          errors.push({ field: `${label}.required_artifacts[${artifactIndex}]`, reason: "type_mismatch", expected: "string" });
        }
      }
    }
    transitions.push({
      transition: rule.transition,
      from: rule.from,
      to: rule.to,
      required_artifacts: cloneList(rule.required_artifacts).sort(),
      diagnostic_code: rule.diagnostic_code,
      description: typeof rule.description === "string" ? rule.description : null,
    });
  }

  if (errors.length > 0) fail("lifecycle transition rules are invalid", { rules_file: lifecycleTransitionRulesPath, errors });

  const sortedTransitions = transitions.sort((a, b) => a.transition.localeCompare(b.transition));
  return deepFreeze({
    rule_set_id: artifact.rule_set_id,
    version: artifact.version,
    mode: artifact.mode ?? null,
    transitions: sortedTransitions,
    by_transition: Object.fromEntries(sortedTransitions.map((rule) => [rule.transition, rule])),
  });
}

function typeMatches(value, expectedType) {
  if (Array.isArray(expectedType)) return expectedType.some((type) => typeMatches(value, type));
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

  if (schema.enum && !schema.enum.includes(value)) {
    errors.push({ field: label, reason: "enum_mismatch", allowed: schema.enum, actual: value });
    return;
  }

  if (schema.minLength !== undefined && typeof value === "string" && value.length < schema.minLength) {
    errors.push({ field: label, reason: "min_length", minimum: schema.minLength, actual: value.length });
  }

  if (schema.minimum !== undefined && typeof value === "number" && value < schema.minimum) {
    errors.push({ field: label, reason: "minimum", minimum: schema.minimum, actual: value });
  }

  if (schema.maximum !== undefined && typeof value === "number" && value > schema.maximum) {
    errors.push({ field: label, reason: "maximum", maximum: schema.maximum, actual: value });
  }

  if (schema.minItems !== undefined && Array.isArray(value) && value.length < schema.minItems) {
    errors.push({ field: label, reason: "min_items", minimum: schema.minItems, actual: value.length });
  }

  if (schema.type === "object") {
    const required = schema.required || [];
    for (const key of required) {
      if (!(key in value)) errors.push({ field: `${label}.${key}`, reason: "missing_required" });
    }

    if (schema.additionalProperties === false) {
      const allowed = new Set(Object.keys(schema.properties || {}));
      for (const key of Object.keys(value)) {
        if (!allowed.has(key)) errors.push({ field: `${label}.${key}`, reason: "additional_property" });
      }
    }

    for (const [key, childSchema] of Object.entries(schema.properties || {})) {
      if (key in value) validateValue(childSchema, value[key], `${label}.${key}`, errors);
    }
  }

  if (schema.type === "array" && schema.items) {
    value.forEach((item, index) => validateValue(schema.items, item, `${label}[${index}]`, errors));
  }
}

function scoreInputsFromBoolean(pass) {
  return {
    engineering_health: pass ? 1 : 0,
    evidence_health: pass ? 1 : 0,
    decision_health: pass ? 1 : 0,
    capability_health: pass ? 1 : 0,
    learning_health: pass ? 1 : 0,
  };
}

const lifecycleTransitionRules = loadLifecycleTransitionRules();

function loadOwnershipRegistry() {
  const registry = readJson(ownershipRegistryPath);
  const errors = [];
  if (!isPlainObject(registry)) {
    errors.push({ field: "registry", reason: "type_mismatch", expected: "object" });
  } else {
    if (registry.registry_id !== "aak-ownership-routing-registry") {
      errors.push({ field: "registry_id", reason: "const_mismatch", expected: "aak-ownership-routing-registry", actual: registry.registry_id });
    }
    if (typeof registry.default_owner_team !== "string" || registry.default_owner_team.length === 0) {
      errors.push({ field: "default_owner_team", reason: "missing_required" });
    }
    if (!Array.isArray(registry.rules) || registry.rules.length === 0) {
      errors.push({ field: "rules", reason: "min_items", minimum: 1, actual: Array.isArray(registry.rules) ? registry.rules.length : 0 });
    }
  }

  const priorities = new Set();
  for (const [index, rule] of (registry.rules || []).entries()) {
    const label = `rules[${index}]`;
    if (!isPlainObject(rule)) {
      errors.push({ field: label, reason: "type_mismatch", expected: "object" });
      continue;
    }
    for (const field of ["rule_id", "pattern", "flags", "owner_team"]) {
      if (typeof rule[field] !== "string" || rule[field].length === 0) {
        errors.push({ field: `${label}.${field}`, reason: "missing_required" });
      }
    }
    if (!Number.isInteger(rule.priority) || rule.priority < 1) {
      errors.push({ field: `${label}.priority`, reason: "invalid_priority", actual: rule.priority });
    } else if (priorities.has(rule.priority)) {
      errors.push({ field: `${label}.priority`, reason: "duplicate_priority", actual: rule.priority });
    } else {
      priorities.add(rule.priority);
    }
    if (!Array.isArray(rule.examples) || rule.examples.length === 0) {
      errors.push({ field: `${label}.examples`, reason: "min_items", minimum: 1, actual: Array.isArray(rule.examples) ? rule.examples.length : 0 });
    }
    try {
      new RegExp(rule.pattern || "", rule.flags || "");
    } catch (error) {
      errors.push({ field: `${label}.pattern`, reason: "invalid_regex", message: error.message });
    }
  }

  if (errors.length > 0) fail("ownership registry is invalid", { registry_file: ownershipRegistryPath, errors });

  const rules = registry.rules
    .map((rule) => ({
      ...rule,
      matcher: new RegExp(rule.pattern, rule.flags),
    }))
    .sort((a, b) => a.priority - b.priority || a.rule_id.localeCompare(b.rule_id));

  return deepFreeze({
    registry_id: registry.registry_id,
    version: registry.version,
    default_owner_team: registry.default_owner_team,
    rules,
  });
}

const ownershipRegistry = loadOwnershipRegistry();

function validateEipcPackage(packageData) {
  const errors = [];
  const schema = readJson(path.join(repoRoot, "schemas/eipc-v1.1.schema.json"));
  validateValue(schema, packageData, "package", errors);

  const missingRequired = [
    "package_id",
    "execution_id",
    "contract_id",
    "contract_version",
    "contract_profile",
    "capability_refs",
    "decision_lineage_id",
    "mutation_level",
    "risk_level",
    "status",
    "evidence_refs",
    "confidence_metrics",
    "supersedes_package_id",
    "superseded_by_package_id",
    "supersession_reason",
  ].filter((field) => !(field in packageData));

  const statusAllowed = ["draft", "validated", "approved", "superseded", "archived"];
  const mutationAllowed = ["read_only", "dry_run", "metadata_only", "contract_only", "patch_ready"];
  const riskAllowed = ["low", "medium", "high", "critical"];

  const checks = {
    required_fields: { passed: missingRequired.length === 0, missing: missingRequired },
    status: { passed: statusAllowed.includes(packageData.status), value: packageData.status ?? null, allowed: statusAllowed },
    mutation_level: { passed: mutationAllowed.includes(packageData.mutation_level), value: packageData.mutation_level ?? null, allowed: mutationAllowed },
    risk_level: { passed: riskAllowed.includes(packageData.risk_level), value: packageData.risk_level ?? null, allowed: riskAllowed },
    capability_refs: { passed: Array.isArray(packageData.capability_refs) && packageData.capability_refs.length > 0, count: Array.isArray(packageData.capability_refs) ? packageData.capability_refs.length : 0 },
    evidence_refs: { passed: Array.isArray(packageData.evidence_refs) && packageData.evidence_refs.length > 0, count: Array.isArray(packageData.evidence_refs) ? packageData.evidence_refs.length : 0 },
    confidence_metrics: {
      passed:
        isPlainObject(packageData.confidence_metrics) &&
        ["overall", "evidence", "decision", "capability", "learning"].every(
          (key) => typeof packageData.confidence_metrics?.[key] === "number" && packageData.confidence_metrics[key] >= 0 && packageData.confidence_metrics[key] <= 100,
        ),
      keys: isPlainObject(packageData.confidence_metrics) ? Object.keys(packageData.confidence_metrics).sort() : [],
    },
    decision_lineage_id: { passed: typeof packageData.decision_lineage_id === "string" && packageData.decision_lineage_id.trim().length > 0 },
  };

  return {
    package_id: typeof packageData.package_id === "string" ? packageData.package_id : null,
    execution_id: typeof packageData.execution_id === "string" ? packageData.execution_id : null,
    contract_id: typeof packageData.contract_id === "string" ? packageData.contract_id : null,
    contract_version: typeof packageData.contract_version === "string" ? packageData.contract_version : null,
    contract_profile: typeof packageData.contract_profile === "string" ? packageData.contract_profile : null,
    capability_refs: Array.isArray(packageData.capability_refs) ? [...packageData.capability_refs] : [],
    decision_lineage_id: typeof packageData.decision_lineage_id === "string" ? packageData.decision_lineage_id : null,
    mutation_level: typeof packageData.mutation_level === "string" ? packageData.mutation_level : null,
    risk_level: typeof packageData.risk_level === "string" ? packageData.risk_level : null,
    status: typeof packageData.status === "string" ? packageData.status : null,
    evidence_refs: Array.isArray(packageData.evidence_refs) ? [...packageData.evidence_refs] : [],
    confidence_metrics: isPlainObject(packageData.confidence_metrics)
      ? { ...packageData.confidence_metrics }
      : null,
    supersedes_package_id: packageData.supersedes_package_id ?? null,
    superseded_by_package_id: packageData.superseded_by_package_id ?? null,
    supersession_reason: packageData.supersession_reason ?? null,
    ok: errors.length === 0,
    errors,
    checks,
    score_inputs: {
      engineering_health: errors.length === 0 ? 1 : 0,
      evidence_health: checks.evidence_refs.passed ? 1 : 0,
      decision_health: checks.decision_lineage_id.passed && checks.status.passed ? 1 : 0,
      capability_health: checks.capability_refs.passed ? 1 : 0,
      learning_health: checks.confidence_metrics.passed ? 1 : 0,
    },
  };
}

function validateEipCommand(files) {
  if (files.length === 0) fail("validate-eip requires one or more package files");
  const packageReports = files.map((file) => {
    const packageFile = normalizePath(file);
    const packageData = readJson(packageFile);
    const report = validateEipcPackage(packageData);
    return { package_file: packageFile, ...report };
  });
  const summary = {
    total_packages: packageReports.length,
    valid_packages: packageReports.filter((report) => report.ok).length,
    invalid_packages: packageReports.filter((report) => !report.ok).length,
    error_count: packageReports.reduce((count, report) => count + report.errors.length, 0),
  };
  const result = { validator: "aak-validate-eip", contract_version: "1.1", ok: summary.invalid_packages === 0, package_reports: packageReports, summary };
  printJson(result);
  process.exit(result.ok ? 0 : 1);
}

function validateLifecycleCommand(args) {
  if (args.length < 2) fail("validate-lifecycle requires <eip-package.json> <execution-record.json>");
  const eip = readJson(normalizePath(args[0]));
  const execution = readJson(normalizePath(args[1]));
  const errors = [];
  const transition = execution.transition || {};
  const transitionKey = transitionKeyFromParts(transition.from, transition.to);
  const transitionRule = lifecycleTransitionRules.by_transition[transitionKey] ?? null;
  const requiredArtifacts = cloneList(transitionRule?.required_artifacts).sort();

  if (!execution.execution_id) errors.push({ field: "execution_id", reason: "missing_required" });
  if (!eip.package_id) errors.push({ field: "package_id", reason: "missing_required" });
  if (execution.package_id && eip.package_id && execution.package_id !== eip.package_id) {
    errors.push({ field: "package_id", reason: "package_mismatch", expected: eip.package_id, actual: execution.package_id });
  }
  if (!transition.from || !transition.to) {
    errors.push({ field: "transition", reason: "missing_required", diagnostic_code: "LIFECYCLE_TRANSITION_MISSING" });
  } else if (!transitionRule) {
    errors.push({
      field: "transition",
      reason: "invalid_transition",
      diagnostic_code: "LIFECYCLE_TRANSITION_NOT_ALLOWED",
      actual: transitionKey,
      allowed: Object.keys(lifecycleTransitionRules.by_transition).sort(),
    });
  }

  for (const field of requiredArtifacts) {
    if (!execution[field]) {
      errors.push({
        field,
        reason: "missing_required_for_transition",
        diagnostic_code: "LIFECYCLE_ARTIFACT_REQUIRED",
        transition: transitionKey,
      });
    }
  }

  errors.sort((a, b) => `${a.field}:${a.reason}`.localeCompare(`${b.field}:${b.reason}`));
  const pass = errors.length === 0;
  const report = {
    validator: "aak-validate-lifecycle",
    rule_set_id: lifecycleTransitionRules.rule_set_id,
    rules_version: lifecycleTransitionRules.version,
    ok: pass,
    package_id: eip.package_id ?? null,
    execution_id: execution.execution_id ?? null,
    transition: transitionKey,
    errors,
    required_artifacts: requiredArtifacts,
    score_inputs: {
      engineering_health: pass ? 1 : 0,
      evidence_health: execution.validation_report_ref ? 1 : 0,
      decision_health: execution.execution_record_ref ? 1 : 0,
      capability_health: execution.owner_team ? 1 : 0,
      learning_health: execution.rollback_ref ? 1 : 0,
    },
  };
  printJson(report);
  process.exit(pass ? 0 : 1);
}

function expectedOwnerForSubject(subjectType) {
  const normalized = String(subjectType || "").toLowerCase();
  for (const entry of ownershipRegistry.rules) {
    if (entry.matcher.test(normalized)) return entry.owner_team;
  }
  return ownershipRegistry.default_owner_team;
}

function validateOwnershipCommand(args) {
  if (args.length < 1) fail("validate-ownership requires <subject.json>");
  const subject = readJson(normalizePath(args[0]));
  const expected = expectedOwnerForSubject(subject.subject_type || subject.subject_name || "");
  const actual = subject.owner_team ?? null;
  const errors = [];
  if (!subject.subject_type) errors.push({ field: "subject_type", reason: "missing_required" });
  if (!actual) errors.push({ field: "owner_team", reason: "missing_required" });
  if (actual && actual !== expected) errors.push({ field: "owner_team", reason: "owner_mismatch", expected, actual });
  const ok = errors.length === 0;
  const report = {
    validator: "aak-validate-ownership",
    ok,
    subject_type: subject.subject_type ?? null,
    subject_name: subject.subject_name ?? null,
    expected_owner_team: expected,
    owner_team: actual,
    errors,
    score_inputs: scoreInputsFromBoolean(ok),
  };
  printJson(report);
  process.exit(ok ? 0 : 1);
}

function normalizeValidationReports(inputs) {
  const reports = [];
  for (const input of inputs) {
    const raw = readJson(normalizePath(input));
    if (Array.isArray(raw)) {
      for (const item of raw) {
        reports.push({
          source_file: input,
          package_id: item.package_id ?? item.subject_name ?? null,
          execution_id: item.execution_id ?? null,
          ok: Boolean(item.ok),
          checks: item.checks ?? {},
          errors: item.errors ?? [],
          score_inputs: item.score_inputs ?? scoreInputsFromBoolean(Boolean(item.ok)),
          raw: item,
        });
      }
      continue;
    }
    if (raw && typeof raw === "object" && Array.isArray(raw.package_reports)) {
      for (const item of raw.package_reports) {
        reports.push({
          source_file: input,
          package_id: item.package_id ?? null,
          execution_id: item.execution_id ?? null,
          ok: Boolean(item.ok),
          checks: item.checks ?? {},
          errors: item.errors ?? [],
          score_inputs: item.score_inputs ?? scoreInputsFromBoolean(Boolean(item.ok)),
          raw: item,
        });
      }
      continue;
    }
    if (raw && typeof raw === "object") {
      reports.push({
        source_file: input,
        package_id: raw.package_id ?? raw.subject_name ?? null,
        execution_id: raw.execution_id ?? null,
        ok: Boolean(raw.ok),
        checks: raw.checks ?? {},
        errors: raw.errors ?? [],
        score_inputs: raw.score_inputs ?? scoreInputsFromBoolean(Boolean(raw.ok)),
        raw,
      });
    }
  }
  return reports;
}

function buildDecisionGraphCommand(inputs) {
  if (inputs.length === 0) fail("build-decision-graph requires one or more validation reports");
  const reports = normalizeValidationReports(inputs);
  const graph = {
    graph_type: "DECISION_GRAPH",
    nodes: [],
    edges: [],
    summary: {
      reports: reports.length,
      decisions: 0,
    },
  };

  for (const report of reports) {
    const seed = `${report.package_id ?? "unknown"}:${report.execution_id ?? "unknown"}:${report.source_file}`;
    const decisionId = stableId("DECISION", seed);
    const eipId = stableId("EIP", seed);
    const executionId = stableId("EXECUTION", seed);
    const evidenceId = stableId("EVIDENCE", seed);
    const judgeId = stableId("JUDGE", seed);
    const acceptanceId = stableId("ACCEPTANCE", seed);

    graph.nodes.push(
      { node_id: decisionId, node_type: "DECISION", source_file: report.source_file, source_anchor: report.source_file, status: report.ok ? "PASS" : "BLOCKED" },
      { node_id: eipId, node_type: "EIP", source_file: report.source_file, source_anchor: report.source_file, package_id: report.package_id ?? null },
      { node_id: executionId, node_type: "EXECUTION", source_file: report.source_file, source_anchor: report.source_file, execution_id: report.execution_id ?? null },
      { node_id: evidenceId, node_type: "EVIDENCE", source_file: report.source_file, source_anchor: report.source_file },
      { node_id: judgeId, node_type: "JUDGE", source_file: report.source_file, source_anchor: report.source_file },
      { node_id: acceptanceId, node_type: "ACCEPTANCE", source_file: report.source_file, source_anchor: report.source_file },
    );

    graph.edges.push(
      { edge_id: stableId("EDGE", `${decisionId}:eip`), from_node_id: decisionId, to_node_id: eipId, relationship_type: "DECISION_TO_EIP", reason: "Decision originates from the package contract." },
      { edge_id: stableId("EDGE", `${eipId}:execution`), from_node_id: eipId, to_node_id: executionId, relationship_type: "EIP_TO_EXECUTION", reason: "Execution is the concrete implementation record." },
      { edge_id: stableId("EDGE", `${executionId}:evidence`), from_node_id: executionId, to_node_id: evidenceId, relationship_type: "EXECUTION_TO_EVIDENCE", reason: "Execution must point to evidence." },
      { edge_id: stableId("EDGE", `${evidenceId}:judge`), from_node_id: evidenceId, to_node_id: judgeId, relationship_type: "EVIDENCE_TO_JUDGE", reason: "Evidence is reviewed by Judge." },
      { edge_id: stableId("EDGE", `${judgeId}:acceptance`), from_node_id: judgeId, to_node_id: acceptanceId, relationship_type: "JUDGE_TO_ACCEPTANCE", reason: "Acceptance closes the decision loop." },
    );
    graph.summary.decisions += 1;
  }

  printJson(graph);
}

function buildCapabilityGraphCommand(inputs) {
  if (inputs.length === 0) fail("build-capability-graph requires one or more validation reports");
  const reports = normalizeValidationReports(inputs);
  const capabilityMap = new Map();

  for (const report of reports) {
    const refs = Array.isArray(report.raw?.capability_refs) ? report.raw.capability_refs : [];
    for (const capability of refs) {
      const existing = capabilityMap.get(capability) || { capability_ref: capability, package_ids: new Set(), valid_count: 0, invalid_count: 0 };
      if (report.package_id) existing.package_ids.add(report.package_id);
      if (report.ok) existing.valid_count += 1;
      else existing.invalid_count += 1;
      capabilityMap.set(capability, existing);
    }
  }

  const capabilities = [...capabilityMap.values()].map((entry) => ({
    capability_ref: entry.capability_ref,
    package_count: entry.package_ids.size,
    package_ids: [...entry.package_ids].sort(),
    valid_count: entry.valid_count,
    invalid_count: entry.invalid_count,
    churn_score: entry.valid_count + entry.invalid_count,
  })).sort((a, b) => b.churn_score - a.churn_score || a.capability_ref.localeCompare(b.capability_ref));

  printJson({
    graph_type: "CAPABILITY_GRAPH",
    capability_count: capabilities.length,
    capabilities,
  });
}

function buildOiiScorecardCommand(inputs) {
  if (inputs.length === 0) fail("build-ooi-scorecard requires one or more validation reports");
  const reports = normalizeValidationReports(inputs);
  const sum = (key) => Math.round((reports.reduce((total, report) => total + (report.score_inputs?.[key] ? 1 : 0), 0) / reports.length) * 100);
  printJson({
    engineering_health: sum("engineering_health"),
    evidence_health: sum("evidence_health"),
    decision_health: sum("decision_health"),
    capability_health: sum("capability_health"),
    learning_health: sum("learning_health"),
  });
}

function buildEvidenceHealthCommand(inputs) {
  if (inputs.length === 0) fail("build-evidence-health requires one or more inputs");
  const reports = normalizeValidationReports(inputs);
  const total = reports.length;
  const backed = {
    replay_backed: reports.filter((report) => Boolean(report.raw?.replay_refs?.length)).length,
    judge_backed: reports.filter((report) => Boolean(report.raw?.judge_id) || Boolean(report.raw?.decision)).length,
    source_anchor_valid: reports.filter((report) => Boolean(report.raw?.source_anchor) || Boolean(report.raw?.source_path)).length,
  };
  const weakReasons = new Map();
  for (const report of reports) {
    const reasons = [];
    if (!report.raw?.replay_refs?.length) reasons.push("missing_replay");
    if (!report.raw?.judge_id) reasons.push("missing_judge");
    if (!report.raw?.source_anchor && !report.raw?.source_path) reasons.push("missing_source_anchor");
    if (reasons.length === 0) continue;
    const key = reasons.sort().join("+");
    const current = weakReasons.get(key) || { category: key, count: 0 };
    current.count += 1;
    weakReasons.set(key, current);
  }
  const distribution = {
    replay_backed_percentage: Math.round((backed.replay_backed / total) * 100),
    judge_backed_percentage: Math.round((backed.judge_backed / total) * 100),
    source_anchor_coverage: Math.round((backed.source_anchor_valid / total) * 100),
  };
  printJson({
    evidence_confidence_distribution: {
      total,
      ...distribution,
    },
    strongest_evidence: reports.filter((report) => report.ok).slice(0, 10).map((report) => report.package_id ?? report.subject_name ?? report.source_file),
    weakest_evidence: [...weakReasons.values()].sort((a, b) => b.count - a.count || a.category.localeCompare(b.category)).slice(0, 10),
  });
}

function analyzeLearningCommand(inputs) {
  if (inputs.length === 0) fail("analyze-learning requires one or more validation reports");
  const reports = normalizeValidationReports(inputs);
  const reasonCounts = new Map();
  const packagePatterns = new Map();
  for (const report of reports) {
    const reasons = (report.errors || []).map((error) => error.reason).filter(Boolean);
    for (const reason of reasons) reasonCounts.set(reason, (reasonCounts.get(reason) || 0) + 1);
    const pattern = reasons.sort().join("|") || "pass";
    packagePatterns.set(pattern, (packagePatterns.get(pattern) || 0) + 1);
  }
  printJson({
    repeated_failures: [...reasonCounts.entries()].map(([reason, count]) => ({ reason, count })).sort((a, b) => b.count - a.count || a.reason.localeCompare(b.reason)),
    successful_patterns: [...packagePatterns.entries()].map(([pattern, count]) => ({ pattern, count })).sort((a, b) => b.count - a.count || a.pattern.localeCompare(b.pattern)).slice(0, 10),
  });
}

function priorityScore(row) {
  const confidence = Number(row.confidence ?? 0);
  const evidenceGap = Number(row.evidence_gap ?? row.missing_evidence ?? 0);
  const replayGap = Number(row.replay_gap ?? row.missing_replay ?? 0);
  const judgeGap = Number(row.judge_gap ?? row.missing_judge ?? 0);
  const cost = Number(row.engineering_cost ?? 0);
  const impact = Number(row.estimated_product_impact ?? 0);
  return Math.round(impact + evidenceGap * 3 + replayGap * 2 + judgeGap * 2 + (100 - confidence) + cost);
}

function priorityEngineCommand(inputs) {
  if (inputs.length === 0) fail("priority-engine requires one or more inputs");
  const rows = [];
  for (const input of inputs) {
    const raw = readJson(normalizePath(input));
    if (Array.isArray(raw)) rows.push(...raw);
    else if (raw && typeof raw === "object" && Array.isArray(raw.capabilities)) {
      rows.push(...raw.capabilities.map((capability) => ({
        entity_id: capability.capability_ref,
        entity_type: "CAPABILITY",
        confidence: capability.package_count ? Math.max(0, 100 - capability.churn_score * 10) : 0,
        evidence_gap: capability.invalid_count || 0,
        replay_gap: capability.invalid_count || 0,
        judge_gap: capability.package_count === 0 ? 1 : 0,
        engineering_cost: capability.package_count || 0,
        estimated_product_impact: capability.package_count * 5,
      })));
    } else if (raw && typeof raw === "object" && Array.isArray(raw.repeated_failures)) {
      rows.push(...raw.repeated_failures.map((failure) => ({
        entity_id: failure.reason,
        entity_type: "FAILURE_REASON",
        confidence: 50,
        evidence_gap: failure.count,
        replay_gap: 0,
        judge_gap: 0,
        engineering_cost: failure.count,
        estimated_product_impact: failure.count * 2,
      })));
    }
  }

  const prioritized = rows.map((row, index) => ({
    priority_rank: index + 1,
    ...row,
    priority_score: priorityScore(row),
    safe_to_execute_now: false,
  })).sort((a, b) => b.priority_score - a.priority_score || String(a.entity_id).localeCompare(String(b.entity_id)));

  prioritized.forEach((row, index) => {
    row.priority_rank = index + 1;
  });

  printJson({
    priority_engine: "AAK-v1",
    rows: prioritized,
  });
}

function dashboardCommand(inputs) {
  if (inputs.length === 0) fail("dashboard requires one or more inputs");
  const loaded = inputs.map((input) => readJson(normalizePath(input)));
  const oii = loaded.find((item) => isPlainObject(item) && "engineering_health" in item && "evidence_health" in item);
  const evidence = loaded.find((item) => isPlainObject(item) && "evidence_confidence_distribution" in item);
  const priority = loaded.find((item) => isPlainObject(item) && Array.isArray(item.rows));
  const capabilities = loaded.find((item) => isPlainObject(item) && item.graph_type === "CAPABILITY_GRAPH");
  printJson({
    engineering_health: oii?.engineering_health ?? null,
    evidence_health: oii?.evidence_health ?? null,
    decision_health: oii?.decision_health ?? null,
    capability_health: oii?.capability_health ?? null,
    learning_health: oii?.learning_health ?? null,
    evidence_confidence_distribution: evidence?.evidence_confidence_distribution ?? null,
    weakest_evidence: evidence?.weakest_evidence ?? [],
    top_priority: priority?.rows?.[0] ?? null,
    highest_impact_capability: capabilities?.capabilities?.[0] ?? null,
  });
}

function printUsage() {
  process.stderr.write(
    [
      "usage: node scripts/admin/aak.mjs <command> [files...]",
      "commands:",
      "  validate-eip",
      "  validate-lifecycle",
      "  validate-ownership",
      "  build-decision-graph",
      "  build-capability-graph",
      "  build-ooi-scorecard",
      "  build-evidence-health",
      "  analyze-learning",
      "  priority-engine",
      "  dashboard",
    ].join("\n") + "\n",
  );
}

function main() {
  const [command, ...args] = process.argv.slice(2);
  if (!command) {
    printUsage();
    process.exit(1);
  }

  switch (command) {
    case "validate-eip":
      return validateEipCommand(args);
    case "validate-lifecycle":
      return validateLifecycleCommand(args);
    case "validate-ownership":
      return validateOwnershipCommand(args);
    case "build-decision-graph":
      return buildDecisionGraphCommand(args);
    case "build-capability-graph":
      return buildCapabilityGraphCommand(args);
    case "build-ooi-scorecard":
      return buildOiiScorecardCommand(args);
    case "build-evidence-health":
      return buildEvidenceHealthCommand(args);
    case "analyze-learning":
      return analyzeLearningCommand(args);
    case "priority-engine":
      return priorityEngineCommand(args);
    case "dashboard":
      return dashboardCommand(args);
    default:
      printUsage();
      process.exit(1);
  }
}

main();
