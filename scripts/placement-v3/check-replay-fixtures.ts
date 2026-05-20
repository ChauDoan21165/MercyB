import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const CEFR_LEVELS = new Set(["A1", "A2", "B1", "B2", "C1", "C2"]);
const MODALITIES = new Set(["writing", "reading", "listening", "speaking"]);
const DEFAULT_FIXTURE =
  "docs/placement-v3/drift-detection/replay-fixtures/placement-v3-replay-samples.json";
const DEFAULT_ARTIFACT_DIR = "docs/placement-v3/drift-detection/simulated-runs";

const args = readArgs();
const fixturePath = args.get("fixtures") ?? DEFAULT_FIXTURE;
const artifactDir = args.get("artifactDir") ?? DEFAULT_ARTIFACT_DIR;
const errors: string[] = [];

const fixtures = JSON.parse(fs.readFileSync(fixturePath, "utf8")) as unknown;
if (!Array.isArray(fixtures)) {
  fail([`${fixturePath} must contain an array`]);
}

const seen = new Set<string>();
let previousOrdinal = 0;
for (const [index, fixture] of fixtures.entries()) {
  if (!isRecord(fixture)) {
    errors.push(`fixtures[${index}] must be an object`);
    continue;
  }
  const id = stringField(fixture.id);
  if (!id) {
    errors.push(`fixtures[${index}].id is required`);
  } else if (seen.has(id)) {
    errors.push(`duplicate fixture id ${id}`);
  } else {
    seen.add(id);
  }

  const ordinal = Number(id.match(/-(\d+)$/)?.[1] ?? NaN);
  if (!Number.isInteger(ordinal)) {
    errors.push(`${id || `fixtures[${index}]`} must end with a stable numeric suffix`);
  } else if (ordinal <= previousOrdinal) {
    errors.push(`${id} is out of stable numeric order`);
  } else {
    previousOrdinal = ordinal;
  }

  if (!MODALITIES.has(stringField(fixture.modality))) errors.push(`${id}.modality is invalid`);
  if (!CEFR_LEVELS.has(stringField(fixture.expectedCefr))) errors.push(`${id}.expectedCefr is invalid`);
  if (!Array.isArray(fixture.taxonomyTags) || fixture.taxonomyTags.length === 0 || !fixture.taxonomyTags.every((tag) => typeof tag === "string" && tag.length > 0)) {
    errors.push(`${id}.taxonomyTags must be a non-empty string array`);
  }

  const payload = isRecord(fixture.payload) ? fixture.payload : null;
  if (!payload) {
    errors.push(`${id}.payload is required`);
  } else if (payload.promptId !== id) {
    errors.push(`${id}.payload.promptId must match fixture id`);
  }
}

if (fs.existsSync(artifactDir)) {
  for (const file of fs.readdirSync(artifactDir).filter((entry) => entry.endsWith(".json")).sort()) {
    const fullPath = path.join(artifactDir, file);
    const artifact = JSON.parse(fs.readFileSync(fullPath, "utf8")) as unknown;
    if (!isRecord(artifact) || artifact.simulated !== true) {
      errors.push(`${fullPath} missing simulated=true`);
    }
  }
}

if (errors.length) fail(errors);

console.log(
  [
    "[placement-drift] replay fixture integrity check passed",
    `fixtures=${fixtures.length}`,
    `artifactDir=${artifactDir}`,
    "simulatedMarkers=ok",
  ].join(" "),
);

function fail(messages: string[]): never {
  console.error("[placement-drift] replay fixture integrity check failed");
  for (const message of messages) console.error(`- ${message}`);
  process.exit(1);
}

function readArgs(): Map<string, string> {
  const out = new Map<string, string>();
  const raw = process.argv.slice(2);
  for (let i = 0; i < raw.length; i += 1) {
    const arg = raw[i];
    if (!arg.startsWith("--")) continue;
    const stripped = arg.slice(2);
    if (stripped.includes("=")) {
      const [key, value = "true"] = stripped.split("=");
      out.set(key, value);
      continue;
    }
    const next = raw[i + 1];
    if (next && !next.startsWith("--")) {
      out.set(stripped, next);
      i += 1;
    } else {
      out.set(stripped, "true");
    }
  }
  return out;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function stringField(value: unknown): string {
  return typeof value === "string" ? value : "";
}
