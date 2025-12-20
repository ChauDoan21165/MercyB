// MB-BLUE-v88.2 — 2025-12-20
/**
 * Validate Rooms — Mercy Blade
 *
 * Reads room JSON files from: /public/data/*.json
 *
 * Goals:
 * - CORE mode (MB_VALIDATE_CORE_ONLY=1): only block build on "hard" integrity issues
 *   (invalid JSON, missing id, id/filename mismatch, cannot read file)
 * - FULL mode (default): also enforce richer content rules (bilingual title, non-empty entries, etc.)
 *
 * Usage:
 *   node scripts/validate-rooms.js
 *
 * Core-only (recommended for CI/prebuild):
 *   MB_VALIDATE_CORE_ONLY=1 node scripts/validate-rooms.js
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
  // Prefer: title.en + title.vi
  if (isPlainObject(room.title)) {
    const en = typeof room.title.en === "string" ? room.title.en.trim() : "";
    const vi = typeof room.title.vi === "string" ? room.title.vi.trim() : "";
    if (en && vi) return { en, vi, source: "title" };
  }

  // Fallback: name + name_vi (legacy)
  const en = typeof room.name === "string" ? room.name.trim() : "";
  const vi = typeof room.name_vi === "string" ? room.name_vi.trim() : "";
  if (en && vi) return { en, vi, source: "name" };

  return null;
}

function formatCode(code, ctx = "") {
  return ctx ? `${code} :: ${ctx}` : code;
}

async function listJsonFilesRecursively(dir) {
  const out = [];

  async function walk(current) {
    let entries;
    try {
      entries = await fs.readdir(current, { withFileTypes: true });
    } catch {
      throw new Error(`Cannot read directory: ${current}`);
    }

    for (const ent of entries) {
      const full = path.join(current, ent.name);
      if (ent.isDirectory()) {
        await walk(full);
      } else if (ent.isFile() && ent.name.toLowerCase().endsWith(".json")) {
        out.push(full);
      }
    }
  }

  await walk(dir);
  return out;
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

  // enforce canonical id chars (snake_case)
  if (id && !ID_RE.test(id)) {
    issues.push({
      level: "error",
      code: "ID_NOT_SNAKE_CASE",
      detail: `id="${room.id}" → canonical="${id}"`,
    });
  }

  // id must match filename (canonicalized)
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

  // Required-ish metadata
  const tierOk = typeof room.tier === "string" && room.tier.trim().length > 0;
  const domainOk = typeof room.domain === "string" && room.domain.trim().length > 0;

  if (!tierOk) issues.push({ level: "error", code: "MISSING_TIER" });
  if (!domainOk) issues.push({ level: "error", code: "MISSING_DOMAIN" });

  // Require bilingual title (either title.en/title.vi OR name/name_vi)
  const title = pickBilingualTitle(room);
  if (!title) {
    issues.push({
      level: "error",
      code: "MISSING_BILINGUAL_TITLE",
      detail: "Need title.en + title.vi OR name + name_vi",
    });
  }

  // Entries validation
  if (!Array.isArray(room.entries)) {
    issues.push({ level: "error", code: "MISSING_ENTRIES_ARRAY" });
  } else {
    if (room.entries.length === 0) {
      issues.push({ level: "error", code: "EMPTY_ENTRIES", detail: "`entries` is empty" });
    } else {
      for (let i = 0; i < room.entries.length; i++) {
        const entry = room.entries[i];
        const prefix = `entries[${i}]`;

        if (!isPlainObject(entry)) {
          issues.push({ level: "error", code: "ENTRY_NOT_OBJECT", detail: prefix });
          continue;
        }

        if (typeof entry.slug !== "string" || !entry.slug.trim()) {
          issues.push({ level: "error", code: "ENTRY_MISSING_SLUG", detail: prefix });
        }

        // copy.en + copy.vi recommended
        if (!isPlainObject(entry.copy)) {
          issues.push({ level: "warning", code: "ENTRY_MISSING_COPY", detail: prefix });
        } else {
          const en = typeof entry.copy.en === "string" ? entry.copy.en.trim() : "";
          const vi = typeof entry.copy.vi === "string" ? entry.copy.vi.trim() : "";
          if (!en || !vi) {
            issues.push({
              level: "warning",
              code: "ENTRY_COPY_NOT_BILINGUAL",
              detail: `${prefix} copy.en/copy.vi`,
            });
          }
        }

        // audio recommended
        if (typeof entry.audio === "string" && entry.audio.trim()) {
          if (!entry.audio.toLowerCase().endsWith(".mp3")) {
            issues.push({
              level: "warning",
              code: "ENTRY_AUDIO_NOT_MP3",
              detail: `${prefix} audio="${entry.audio}"`,
            });
          }
        }
      }
    }
  }

  return issues;
}

async function main() {
  // Basic sanity: data dir must exist
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

  const files = await listJsonFilesRecursively(DATA_DIR);

  const nestedPublicData = files.filter((f) =>
    f.includes(`${path.sep}public${path.sep}data${path.sep}public${path.sep}data${path.sep}`)
  );

  const total = files.length;

  const errors = [];
  const warnings = [];

  for (const filePath of files) {
    const rel = path.relative(ROOT, filePath);

    let room;
    try {
      room = await readJsonFile(filePath);
    } catch (e) {
      errors.push({ file: rel, code: "JSON_PARSE_ERROR", detail: e?.message || String(e) });
      continue;
    }

    // CORE validation (always)
    const coreIssues = validateRoomCore(room, filePath);
    for (const issue of coreIssues) {
      const bucket = issue.level === "error" ? errors : warnings;
      bucket.push({ file: rel, code: issue.code, detail: issue.detail || "" });
    }

    // FULL validation (only when not core-only)
    if (!CORE_ONLY) {
      const fullIssues = validateRoomFull(room);
      for (const issue of fullIssues) {
        const bucket = issue.level === "error" ? errors : warnings;
        bucket.push({ file: rel, code: issue.code, detail: issue.detail || "" });
      }
    }
  }

  // Report
  console.log(`Total JSON files: ${total}`);
  console.log(`Mode: ${CORE_ONLY ? "CORE_ONLY" : "FULL"}`);

  if (nestedPublicData.length) {
    console.log(
      `⚠️  Nested public/data detected (${nestedPublicData.length} files). Example: ${path.relative(
        ROOT,
        nestedPublicData[0]
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
