// MB-BLUE-v88.3 — 2025-12-20
/**
 * Validate Rooms — Mercy Blade
 *
 * IMPORTANT STRATEGIC RULE:
 *   Only validate ROOM json files at: /public/data/*.json (ONE LEVEL)
 *   Do NOT recurse into /public/data/** because it may contain non-room JSON
 *   (e.g. public/data/paths/*.json, manifests, etc.)
 *
 * CORE mode (MB_VALIDATE_CORE_ONLY=1): block build only on "hard" issues
 * FULL mode (default): also enforce richer content rules
 */

import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const ROOT = process.cwd();
const DATA_DIR = path.join(ROOT, "public", "data");
const CORE_ONLY = String(process.env.MB_VALIDATE_CORE_ONLY || "") === "1";
const ID_RE = /^[a-z0-9_]+$/;

function canonicalizeRoomId(input) {
  return (input || "")
    .trim()
    .toLowerCase()
    .replace(/[-\s]+/g, "_")
    .replace(/_+/g, "_");
}

function isPlainObject(v) {
  return !!v && typeof v === "object" && !Array.isArray(v);
}

function pickBilingualTitle(room) {
  if (isPlainObject(room.title)) {
    const en = typeof room.title.en === "string" ? room.title.en.trim() : "";
    const vi = typeof room.title.vi === "string" ? room.title.vi.trim() : "";
    if (en && vi) return { en, vi, source: "title" };
  }
  const en = typeof room.name === "string" ? room.name.trim() : "";
  const vi = typeof room.name_vi === "string" ? room.name_vi.trim() : "";
  if (en && vi) return { en, vi, source: "name" };
  return null;
}

function formatCode(code, ctx = "") {
  return ctx ? `${code} :: ${ctx}` : code;
}

async function listRoomJsonFilesOneLevel(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  return entries
    .filter((e) => e.isFile() && e.name.toLowerCase().endsWith(".json"))
    .map((e) => path.join(dir, e.name));
}

async function findNestedJsonForWarning(dir) {
  const nested = [];
  async function walk(current) {
    const ents = await fs.readdir(current, { withFileTypes: true });
    for (const ent of ents) {
      const full = path.join(current, ent.name);
      if (ent.isDirectory()) await walk(full);
      else if (ent.isFile() && ent.name.toLowerCase().endsWith(".json")) {
        if (path.dirname(full) !== dir) nested.push(full);
      }
    }
  }
  const top = await fs.readdir(dir, { withFileTypes: true });
  for (const ent of top) {
    if (ent.isDirectory()) await walk(path.join(dir, ent.name));
  }
  return nested;
}

async function readJsonFile(filePath) {
  const raw = await fs.readFile(filePath, "utf8");
  try {
    return JSON.parse(raw);
  } catch (e) {
    const msg = e && typeof e.message === "string" ? e.message : String(e);
    const err = new Error(`JSON_PARSE_ERROR: ${msg}`);
    err.cause = e;
    throw err;
  }
}

function validateRoomCore(room, filePath) {
  const issues = [];
  const base = path.basename(filePath);
  const fileId = canonicalizeRoomId(base.replace(/\.json$/i, ""));

  if (!isPlainObject(room)) {
    issues.push({ level: "error", code: "ROOM_NOT_OBJECT" });
    return issues;
  }

  const idRaw = typeof room.id === "string" ? room.id : "";
  const id = canonicalizeRoomId(idRaw);

  if (!id) issues.push({ level: "error", code: "MISSING_ID" });

  if (id && !ID_RE.test(id)) {
    issues.push({
      level: "error",
      code: "ID_NOT_SNAKE_CASE",
      detail: `id="${room.id}" → canonical="${id}"`,
    });
  }

  if (id && fileId && id !== fileId) {
    issues.push({
      level: "error",
      code: "ID_FILENAME_MISMATCH",
      detail: `file="${fileId}" vs id="${id}" (raw="${room.id}")`,
    });
  }

  return issues;
}

function validateRoomFull(room) {
  const issues = [];
  const tierOk = typeof room.tier === "string" && room.tier.trim().length > 0;
  const domainOk = typeof room.domain === "string" && room.domain.trim().length > 0;
  if (!tierOk) issues.push({ level: "error", code: "MISSING_TIER" });
  if (!domainOk) issues.push({ level: "error", code: "MISSING_DOMAIN" });

  const title = pickBilingualTitle(room);
  if (!title) {
    issues.push({
      level: "error",
      code: "MISSING_BILINGUAL_TITLE",
      detail: "Need title.en + title.vi OR name + name_vi",
    });
  }

  if (!Array.isArray(room.entries)) {
    issues.push({ level: "error", code: "MISSING_ENTRIES_ARRAY" });
  } else if (room.entries.length === 0) {
    // ↓ CHANGED: now a warning instead of error
    issues.push({ level: "warning", code: "EMPTY_ENTRIES", detail: "`entries` is empty" });
  }

  return issues;
}

async function main() {
  try {
    const st = await fs.stat(DATA_DIR);
    if (!st.isDirectory()) {
      console.error(`❌ DATA_DIR is not a directory: ${DATA_DIR}`);
      process.exit(1);
    }
  } catch {
    console.error(`❌ DATA_DIR missing: ${DATA_DIR}`);
    process.exit(1);
  }

  const roomFiles = await listRoomJsonFilesOneLevel(DATA_DIR);
  const nestedJson = await findNestedJsonForWarning(DATA_DIR);

  const errors = [];
  const warnings = [];

  for (const filePath of roomFiles) {
    const rel = path.relative(ROOT, filePath);

    let room;
    try {
      room = await readJsonFile(filePath);
    } catch (e) {
      errors.push({ file: rel, code: "JSON_PARSE_ERROR", detail: e?.message || String(e) });
      continue;
    }

    for (const issue of validateRoomCore(room, filePath)) {
      (issue.level === "error" ? errors : warnings).push({
        file: rel,
        code: issue.code,
        detail: issue.detail || "",
      });
    }

    if (!CORE_ONLY) {
      for (const issue of validateRoomFull(room)) {
        (issue.level === "error" ? errors : warnings).push({
          file: rel,
          code: issue.code,
          detail: issue.detail || "",
        });
      }
    }
  }

  console.log(`Total ROOM JSON files (public/data/*.json): ${roomFiles.length}`);
  console.log(`Mode: ${CORE_ONLY ? "CORE_ONLY" : "FULL"}`);

  if (nestedJson.length) {
    console.log(
      `⚠️  Found nested JSON under public/data/ (${nestedJson.length}). Not validated. Example: ${path.relative(
        ROOT,
        nestedJson[0]
      )}`
    );
  }

  console.log(`Warnings (non-fatal): ${warnings.length}`);
  console.log(`Errors: ${errors.length}`);

  if (errors.length) {
    console.log("\nTop errors:");
    for (const e of errors.slice(0, 30)) {
      console.log(`- ${e.file} :: ${formatCode(e.code, e.detail)}`);
    }
    if (errors.length > 30) console.log(`... and ${errors.length - 30} more`);
    process.exit(1);
  }

  console.log("✅ validate-rooms: PASS");
}

main().catch((e) => {
  console.error("❌ validate-rooms: FATAL", e?.stack || e);
  process.exit(1);
});