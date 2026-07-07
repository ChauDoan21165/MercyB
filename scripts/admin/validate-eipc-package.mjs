#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "../..");
const schemaPath = path.join(repoRoot, "schemas/eipc-v1.1.schema.json");

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function typeMatches(value, expectedType) {
  if (Array.isArray(expectedType)) return expectedType.some((type) => typeMatches(value, type));
  if (expectedType === "array") return Array.isArray(value);
  if (expectedType === "object") return isPlainObject(value);
  if (expectedType === "null") return value === null;
  return typeof value === expectedType;
}

function cloneList(value) {
  return Array.isArray(value) ? [...value] : [];
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
      if (!(key in value)) {
        errors.push({ field: `${label}.${key}`, reason: "missing_required" });
      }
    }

    if (schema.additionalProperties === false) {
      const allowed = new Set(Object.keys(schema.properties || {}));
      for (const key of Object.keys(value)) {
        if (!allowed.has(key)) {
          errors.push({ field: `${label}.${key}`, reason: "additional_property" });
        }
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

function loadSchema() {
  return readJson(schemaPath);
}

function validatePackageFile(packageFile, schema) {
  const packageData = readJson(packageFile);
  const errors = [];
  validateValue(schema, packageData, "package", errors);

  const requiredFields = [
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
  ];

  const missingRequired = requiredFields.filter((field) => !(field in packageData));
  const statusAllowed = ["draft", "validated", "approved", "superseded", "archived"];
  const mutationAllowed = ["read_only", "dry_run", "metadata_only", "contract_only", "patch_ready"];
  const riskAllowed = ["low", "medium", "high", "critical"];

  const checks = {
    required_fields: {
      passed: missingRequired.length === 0,
      missing: missingRequired,
    },
    status: {
      passed: statusAllowed.includes(packageData.status),
      value: packageData.status ?? null,
      allowed: statusAllowed,
    },
    mutation_level: {
      passed: mutationAllowed.includes(packageData.mutation_level),
      value: packageData.mutation_level ?? null,
      allowed: mutationAllowed,
    },
    risk_level: {
      passed: riskAllowed.includes(packageData.risk_level),
      value: packageData.risk_level ?? null,
      allowed: riskAllowed,
    },
    capability_refs: {
      passed: Array.isArray(packageData.capability_refs) && packageData.capability_refs.length > 0,
      count: Array.isArray(packageData.capability_refs) ? packageData.capability_refs.length : 0,
    },
    evidence_refs: {
      passed: Array.isArray(packageData.evidence_refs) && packageData.evidence_refs.length > 0,
      count: Array.isArray(packageData.evidence_refs) ? packageData.evidence_refs.length : 0,
    },
    confidence_metrics: {
      passed: isPlainObject(packageData.confidence_metrics) &&
        ["overall", "evidence", "decision", "capability", "learning"].every(
          (key) => typeof packageData.confidence_metrics?.[key] === "number" &&
            packageData.confidence_metrics[key] >= 0 &&
            packageData.confidence_metrics[key] <= 100,
        ),
      keys: isPlainObject(packageData.confidence_metrics) ? Object.keys(packageData.confidence_metrics).sort() : [],
    },
    decision_lineage_id: {
      passed: typeof packageData.decision_lineage_id === "string" && packageData.decision_lineage_id.trim().length > 0,
    },
  };

  const scoreInputs = {
    engineering_health: errors.length === 0 ? 1 : 0,
    evidence_health: checks.evidence_refs.passed ? 1 : 0,
    decision_health: checks.decision_lineage_id.passed && checks.status.passed ? 1 : 0,
    capability_health: checks.capability_refs.passed ? 1 : 0,
    learning_health: checks.confidence_metrics.passed ? 1 : 0,
  };

  return {
    package_file: packageFile,
    package_id: typeof packageData.package_id === "string" ? packageData.package_id : null,
    ok: errors.length === 0,
    errors,
    checks,
    score_inputs: scoreInputs,
  };
}

function main() {
  const inputFiles = process.argv.slice(2);
  if (inputFiles.length === 0) {
    console.error("usage: node scripts/admin/validate-eipc-package.mjs <package.json> [more.json]");
    process.exit(1);
  }

  const schema = loadSchema();
  const packageReports = inputFiles.map((file) => validatePackageFile(path.resolve(file), schema));
  const ok = packageReports.every((report) => report.ok);
  const result = {
    validator: "validate-eipc-package",
    contract_version: "1.1",
    ok,
    package_reports: packageReports,
    summary: {
      total_packages: packageReports.length,
      valid_packages: packageReports.filter((report) => report.ok).length,
      invalid_packages: packageReports.filter((report) => !report.ok).length,
      error_count: packageReports.reduce((count, report) => count + report.errors.length, 0),
    },
  };

  console.log(JSON.stringify(result, null, 2));
  process.exit(ok ? 0 : 1);
}

main();
