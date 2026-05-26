// scripts/report-room-json-issues.mjs
import fs from "node:fs";
import path from "node:path";

const LOG_PATH = "migration.log";

// Where your room JSON files live – adjust if needed
const DATA_DIRS = [
  "public/data",
  "public/data/raw",
  "public/data/json",
];

// 1) Get failing room_ids from migration.log (23503 FK errors)
function getFailedRoomIds() {
  const log = fs.readFileSync(LOG_PATH, "utf8");
  const ids = new Set();
  const re = /Key \(room_id\)=\(([^)]+)\)/g;
  let m;
  while ((m = re.exec(log))) {
    ids.add(m[1]);
  }
  return [...ids].sort();
}

// 2) Try to find the JSON file for a given room id
function findJsonPath(roomId) {
  const candidates = [];
  for (const dir of DATA_DIRS) {
    candidates.push(path.join(dir, `${roomId}.json`));
    candidates.push(path.join(dir, `${roomId.replace(/_/g, "-")}.json`));
    candidates.push(path.join(dir, `${roomId.replace(/-/g, "_")}.json`));
  }
  for (const p of candidates) {
    if (fs.existsSync(p)) return p;
  }
  return null;
}

// 3) Heuristic checks for "legacy room" vs new-shape problems
function diagnoseRoom(json, roomId, filePath) {
  const issues = [];

  // id mismatch vs room_id / filename
  if (json.id && json.id !== roomId && json.id !== roomId.replace(/_/g, "-")) {
    issues.push(
      `id "${json.id}" does not match room_id "${roomId}" (file name).`
    );
  }
  if (!json.id) {
    issues.push("missing root id.");
  }

  // tier format
  if (!json.tier || typeof json.tier !== "string") {
    issues.push("missing tier (string).");
  } else if (!json.tier.includes(" / ")) {
    issues.push(
      `tier "${json.tier}" does not match expected format like "Free / Miễn phí" or "VIP1 / VIP1".`
    );
  }

  // domain must be non-empty
  if (!json.domain || typeof json.domain !== "string" || !json.domain.trim()) {
    issues.push("missing or empty domain.");
  }

  // name / name_vi or title.{en,vi}
  if (!json.name && !(json.title && json.title.en && json.title.vi)) {
    issues.push("missing name/name_vi or title.en/title.vi.");
  }
  if (!json.name_vi && !(json.title && json.title.vi)) {
    issues.push("missing Vietnamese title: name_vi or title.vi.");
  }

  // description should be two strings, not {en,vi}
  if (typeof json.description === "object" && json.description !== null) {
    issues.push(
      'description is an object {en,vi}; expected description (EN string) + description_vi (VI string).'
    );
  }
  if (!json.description || typeof json.description !== "string") {
    issues.push("missing description (EN string).");
  }
  if (!json.description_vi || typeof json.description_vi !== "string") {
    issues.push("missing description_vi (VI string).");
  }

  // keywords: should be split, not a single "keywords"
  if (Array.isArray(json.keywords)) {
    issues.push('root has "keywords" array; expected keywords_en + keywords_vi.');
  }
  if (!Array.isArray(json.keywords_en)) {
    issues.push("missing keywords_en array.");
  }
  if (!Array.isArray(json.keywords_vi)) {
    issues.push("missing keywords_vi array.");
  }

  // room_essay: should be two strings
  if (json.room_essay && typeof json.room_essay === "object") {
    issues.push(
      'room_essay is object {en,vi}; expected room_essay_en and room_essay_vi strings.'
    );
  }
  if (!json.room_essay_en && !json.room_essay_vi && json.room_essay) {
    issues.push("has room_essay but no room_essay_en/room_essay_vi.");
  }

  // entries basic check
  if (!Array.isArray(json.entries) || json.entries.length === 0) {
    issues.push("entries is missing or empty (0).");
  } else {
    json.entries.forEach((e, idx) => {
      const prefix = `entry[${idx}]`;
      if (!e.slug) {
        issues.push(`${prefix} missing slug.`);
      }
      if (!e.copy || typeof e.copy !== "object") {
        issues.push(`${prefix} missing copy.{en,vi}.`);
      } else {
        if (!e.copy.en) issues.push(`${prefix} missing copy.en.`);
        if (!e.copy.vi) issues.push(`${prefix} missing copy.vi.`);
      }
    });
  }

  if (issues.length === 0) return;

  console.log("==================================================");
  console.log(`Problems in room "${roomId}" (${filePath}):`);
  for (const msg of issues) {
    console.log(" - " + msg);
  }
  console.log();
}

// 4) Main
function main() {
  if (!fs.existsSync(LOG_PATH)) {
    console.error(`❌ Cannot find ${LOG_PATH} in current directory.`);
    process.exit(1);
  }

  const failed = getFailedRoomIds();
  if (failed.length === 0) {
    console.log("No 23503 FK failures found in migration.log.");
    return;
  }

  console.log(`Found ${failed.length} room_ids with FK failures.\n`);

  for (const roomId of failed) {
    const filePath = findJsonPath(roomId);
    if (!filePath) {
      console.log("==================================================");
      console.log(
        `Problems in room "${roomId}": JSON file not found in ${DATA_DIRS.join(
          ", "
        )}`
      );
      console.log();
      continue;
    }

    let json;
    try {
      const raw = fs.readFileSync(filePath, "utf8");
      json = JSON.parse(raw);
    } catch (err) {
      console.log("==================================================");
      console.log(`Problems in room "${roomId}" (${filePath}):`);
      console.log(" - JSON parse error: " + err.message);
      console.log();
      continue;
    }

    diagnoseRoom(json, roomId, filePath);
  }
}

main();
