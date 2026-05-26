import fs from "fs";
import path from "path";

const DATA_DIR = "./public/data";
const DB_COUNTS_PATH = "./tmp/room_entries_count.json";

function canonId(s) {
  return String(s || "")
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[,’']/g, "") // quotes
    .replace(/[^a-z0-9]+/g, "_") // everything else -> _
    .replace(/^_+|_+$/g, "");
}

function safeReadJson(p) {
  try {
    return JSON.parse(fs.readFileSync(p, "utf8"));
  } catch (e) {
    // Missing file? Treat as empty (but warn later).
    if (e && e.code === "ENOENT") return [];
    // Empty file / invalid JSON? Treat as empty (but warn later).
    if (e instanceof SyntaxError) return [];
    throw e;
  }
}

const dbRows = safeReadJson(DB_COUNTS_PATH);

// ✅ NEW: make the “DB file missing/empty” state explicit
if (!Array.isArray(dbRows) || dbRows.length === 0) {
  console.warn(
    `\n[WARN] DB counts file is missing/empty/invalid: ${DB_COUNTS_PATH}\n` +
      `       -> dbRows length = ${Array.isArray(dbRows) ? dbRows.length : "not-an-array"}\n` +
      `       -> All dbN will be 0 until you export counts into this file.\n`
  );
}

const dbCountById = new Map(
  (Array.isArray(dbRows) ? dbRows : []).map((r) => [canonId(r?.room_id), Number(r?.count || 0)])
);

const files = fs.readdirSync(DATA_DIR).filter((f) => f.endsWith(".json"));

let both = 0;
let dbOnly = 0;
let jsonOnly = 0;
let neither = 0;

const rows = [];

for (const f of files) {
  const full = path.join(DATA_DIR, f);
  const j = safeReadJson(full);

  const rawId = String(j?.id || f.replace(".json", ""));
  const key = canonId(rawId);

  const jsonN = Array.isArray(j?.entries) ? j.entries.length : 0;
  const dbN = dbCountById.get(key) || 0;

  const hasJson = jsonN > 0;
  const hasDb = dbN > 0;

  if (hasJson && hasDb) both++;
  else if (hasDb && !hasJson) dbOnly++;
  else if (!hasDb && hasJson) jsonOnly++;
  else neither++;

  if (hasJson || hasDb) {
    rows.push({ id: rawId, key, dbN, jsonN, file: full });
  }
}

rows.sort(
  (a, b) =>
    b.dbN - a.dbN || b.jsonN - a.jsonN || a.key.localeCompare(b.key)
);

console.log("\n=== DB vs JSON Entries Scan ===\n");
console.log("rooms scanned:", files.length);
console.log("both DB+JSON:", both);
console.log("DB only:     ", dbOnly);
console.log("JSON only:   ", jsonOnly);
console.log("neither:     ", neither);

console.log("\nTop mismatches (DB >> JSON):\n");
for (const r of rows.filter((r) => r.dbN > r.jsonN).slice(0, 40)) {
  console.log(
    `${r.id}`.padEnd(45),
    `db:${r.dbN}`.padEnd(8),
    `json:${r.jsonN}`.padEnd(10),
    r.file
  );
}

console.log("\nTop mismatches (JSON >> DB):\n");
for (const r of rows.filter((r) => r.jsonN > r.dbN).slice(0, 40)) {
  console.log(
    `${r.id}`.padEnd(45),
    `db:${r.dbN}`.padEnd(8),
    `json:${r.jsonN}`.padEnd(10),
    r.file
  );
}

console.log("\nDone.\n");
