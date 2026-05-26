// MB-BLUE-7.2 — 2025-12-18
/**
 * Room Validator (build-time)
 * - Reads JSON files directly from public/data (no fetch, no app runtime imports)
 * - Ensures: filename matches json.id, basic required structure exists
 *
 * Phase I rule (CORE ONLY):
 *   MB_VALIDATE_CORE_ONLY=1 → validate only structural correctness:
 *   - JSON parses
 *   - id exists and matches filename
 *   - entries exists and is an array
 *
 * Run:
 *   node scripts/validate-rooms.ts
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const CORE_ONLY = process.env.MB_VALIDATE_CORE_ONLY === "1";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// projectRoot = one level above /scripts
const projectRoot = path.resolve(__dirname, "..");
const publicDataDir = path.join(projectRoot, "public", "data");

function isObject(x: any) {
  return x && typeof x === "object" && !Array.isArray(x);
}

function readJsonFile(fullPath: string) {
  const raw = fs.readFileSync(fullPath, "utf8");
  return JSON.parse(raw);
}

function validateRoomJsonFile(filename: string) {
  const fullPath = path.join(publicDataDir, filename);
  const expectedId = filename.replace(/\.json$/i, "").toLowerCase().trim();

  let data: any;
  try {
    data = readJsonFile(fullPath);
  } catch (e: any) {
    return {
      ok: false,
      id: expectedId,
      filename,
      reason: "JSON_PARSE_FAILED",
      detail: e?.message || String(e),
    };
  }

  // id must exist and match filename
  const actualId = String(data?.id || "").toLowerCase().trim();
  if (!actualId) {
    return {
      ok: false,
      id: expectedId,
      filename,
      reason: "MISSING_ID",
      detail: "JSON missing `id` field",
    };
  }
  if (actualId !== expectedId) {
    return {
      ok: false,
      id: expectedId,
      filename,
      reason: "ID_FILENAME_MISMATCH",
      detail: `expected id: ${expectedId} | got: ${actualId}`,
    };
  }

  // entries must be array (core requirement)
  if (!Array.isArray(data.entries)) {
    return {
      ok: false,
      id: expectedId,
      filename,
      reason: "MISSING_ENTRIES",
      detail: "`entries` must be an array",
    };
  }

  // Phase II+ content rules (skip in CORE_ONLY)
  if (!CORE_ONLY) {
    // title bilingual OR name + name_vi
    const hasTitleBilingual =
      isObject(data.title) &&
      typeof data.title.en === "string" &&
      typeof data.title.vi === "string";
    const hasNameBilingual =
      typeof data.name === "string" && typeof data.name_vi === "string";

    if (!hasTitleBilingual && !hasNameBilingual) {
      return {
        ok: false,
        id: expectedId,
        filename,
        reason: "MISSING_BILINGUAL_TITLE",
        detail: "Need title.en + title.vi OR name + name_vi",
      };
    }

    // soft rules: warn style but still fail if completely broken
    if (data.entries.length < 1) {
      return {
        ok: false,
        id: expectedId,
        filename,
        reason: "EMPTY_ENTRIES",
        detail: "`entries` is empty",
      };
    }

    // entry basic fields
    for (let i = 0; i < data.entries.length; i++) {
      const entry = data.entries[i];
      const hasIdentifier = !!(entry?.slug || entry?.artifact_id || entry?.id);
      if (!hasIdentifier) {
        return {
          ok: false,
          id: expectedId,
          filename,
          reason: "ENTRY_MISSING_IDENTIFIER",
          detail: `Entry ${i + 1} needs slug OR artifact_id OR id`,
        };
      }
    }
  }

  return { ok: true, id: expectedId, filename };
}

function main() {
  if (!fs.existsSync(publicDataDir)) {
    console.error("❌ public/data not found:", publicDataDir);
    process.exit(1);
  }

  const files = fs
    .readdirSync(publicDataDir)
    .filter((f) => f.endsWith(".json") && !f.startsWith("."))
    .sort();

  const errors: any[] = [];
  for (const f of files) {
    const r = validateRoomJsonFile(f);
    if (!r.ok) errors.push(r);
  }

  console.log(`📦 Total JSON files: ${files.length}`);
  console.log(`✅ Valid rooms: ${files.length - errors.length}`);
  console.log(`❌ Invalid rooms: ${errors.length}\n`);
  console.log(`Mode: ${CORE_ONLY ? "CORE_ONLY" : "FULL"}`);

  if (errors.length) {
    console.log("\nTop errors:");
    for (const e of errors.slice(0, 10)) {
      console.log(`- ${e.filename} :: ${e.reason} :: ${e.detail}`);
    }
    if (errors.length > 10) {
      console.log(`… and ${errors.length - 10} more`);
    }
    process.exit(1);
  }

  console.log("✅ All rooms valid.");
  process.exit(0);
}

main();
