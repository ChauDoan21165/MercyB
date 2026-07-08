#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "../../..");
const contractRoot = process.argv[2]
  ? path.resolve(process.argv[2])
  : path.join(repoRoot, "docs/cell-runtime/v1");

const schemaFiles = {
  anatomyObject: "schemas/anatomy-object.schema.json",
  graphEdge: "schemas/graph-edge.schema.json",
  reasoningResult: "schemas/reasoning-result.schema.json",
};

function readJson(relativePath) {
  const absolutePath = path.join(contractRoot, relativePath);
  return JSON.parse(fs.readFileSync(absolutePath, "utf8"));
}

function fail(message, details = {}) {
  const error = new Error(message);
  error.details = details;
  throw error;
}

function typeMatches(value, expectedType) {
  if (expectedType === "array") return Array.isArray(value);
  if (expectedType === "object") return value !== null && typeof value === "object" && !Array.isArray(value);
  return typeof value === expectedType;
}

function validate(schema, value, label) {
  if (schema.const !== undefined && value !== schema.const) {
    fail(`${label} must equal ${JSON.stringify(schema.const)}`, { actual: value });
  }

  if (schema.type && !typeMatches(value, schema.type)) {
    fail(`${label} must be ${schema.type}`, { actualType: Array.isArray(value) ? "array" : typeof value });
  }

  if (schema.enum && !schema.enum.includes(value)) {
    fail(`${label} must be one of ${schema.enum.join(", ")}`, { actual: value });
  }

  if (schema.minLength !== undefined && typeof value === "string" && value.length < schema.minLength) {
    fail(`${label} must have length >= ${schema.minLength}`, { actual: value });
  }

  if (schema.type === "object") {
    const required = schema.required || [];
    for (const key of required) {
      if (!(key in value)) fail(`${label}.${key} is required`);
    }

    if (schema.additionalProperties === false) {
      const allowed = new Set(Object.keys(schema.properties || {}));
      for (const key of Object.keys(value)) {
        if (!allowed.has(key)) fail(`${label}.${key} is not allowed`);
      }
    }

    for (const [key, childSchema] of Object.entries(schema.properties || {})) {
      if (key in value) validate(childSchema, value[key], `${label}.${key}`);
    }
  }

  if (schema.type === "array" && schema.items) {
    value.forEach((item, index) => validate(schema.items, item, `${label}[${index}]`));
  }
}

function assert(condition, message) {
  if (!condition) fail(message);
}

function listFiles(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const absolute = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...listFiles(absolute));
    else out.push(absolute);
  }
  return out;
}

function validateNoRuntimeImports() {
  const roots = [
    path.join(repoRoot, "docs/cell-runtime/v1"),
    path.join(repoRoot, "scripts/cell-runtime-contracts/v1"),
  ];
  const files = roots.flatMap((root) => fs.existsSync(root) ? listFiles(root) : []);
  const offenders = [];

  for (const file of files) {
    const text = fs.readFileSync(file, "utf8");
    if (/from\s+["'](?:\.\.\/)*src\//.test(text) || /require\(["'](?:\.\.\/)*src\//.test(text)) {
      offenders.push(path.relative(repoRoot, file));
    }
  }

  assert(offenders.length === 0, `runtime imports are forbidden: ${offenders.join(", ")}`);
}

function main() {
  const anatomySchema = readJson(schemaFiles.anatomyObject);
  const graphSchema = readJson(schemaFiles.graphEdge);
  const reasoningSchema = readJson(schemaFiles.reasoningResult);
  const fixture = readJson("fixtures/minimal-sample.json");

  for (const [index, object] of fixture.anatomy_objects.entries()) {
    validate(anatomySchema, object, `fixture.anatomy_objects[${index}]`);
  }

  for (const [index, edge] of fixture.graph_edges.entries()) {
    validate(graphSchema, edge, `fixture.graph_edges[${index}]`);
  }

  validate(reasoningSchema, fixture.reasoning_result, "fixture.reasoning_result");

  const sentenceTeachesConcept = fixture.graph_edges.find(
    (edge) => edge.relationship_type === "SENTENCE_TEACHES_CONCEPT",
  );
  assert(sentenceTeachesConcept, "fixture must include SENTENCE_TEACHES_CONCEPT");
  assert(
    sentenceTeachesConcept.graph_type === "KNOWLEDGE_GRAPH",
    "SENTENCE_TEACHES_CONCEPT must be Knowledge Graph",
  );

  const invalidEdge = {
    ...sentenceTeachesConcept,
    graph_type: "OWNERSHIP_GRAPH",
  };
  let invalidFailed = false;
  try {
    validate(graphSchema, invalidEdge, "invalidEdge");
    assert(
      invalidEdge.relationship_type !== "SENTENCE_TEACHES_CONCEPT" ||
        invalidEdge.graph_type === "KNOWLEDGE_GRAPH",
      "invalid fixture must fail semantic graph assertion",
    );
  } catch {
    invalidFailed = true;
  }
  assert(invalidFailed, "invalid fixture must fail");

  validateNoRuntimeImports();

  const result = {
    ok: true,
    contract_root: contractRoot,
    schemas_parse: true,
    fixture_validates: true,
    invalid_fixture_fails: true,
    sentence_teaches_concept_is_knowledge_graph: true,
    no_runtime_imports: true,
  };
  console.log(JSON.stringify(result, null, 2));
}

main();
