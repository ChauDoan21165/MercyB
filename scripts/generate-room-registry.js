/**
 * Auto-generate room registry from ALL JSON files in public/data
 *
 * GOAL (strategic):
 * - NEVER reject rooms (register first, warn later)
 * - ONE canonical ID format: snake_case (underscores only)
 * - Manifest must point to the REAL filename in /public/data
 *
 * Generates:
 * A) src/lib/roomManifest.ts        -> PUBLIC_ROOM_MANIFEST: canonicalId -> "data/REAL_FILENAME.json"
 * B) src/lib/roomDataImports.ts     -> roomDataMap
 * C) src/lib/roomList.ts            -> ROOM_IDS
 *
 * Run: node scripts/generate-room-registry.js
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

const dataDir = path.join(projectRoot, "public", "data");

/* ---------------- Canonicalization ---------------- */

function canonicalIdFromFilename(filename) {
  return filename
    .replace(/\.json$/i, "")
    .trim()
    .toLowerCase()
    // STRICT: keep only a-z0-9, convert everything else to "_"
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function inferTierFromId(id) {
  const m =
    id.match(/_(free|vip\d+|vip3_ii|kidslevel[123])$/i) ||
    id.match(/_(vip\d+_vol\d+)$/i);
  return m ? m[1].toLowerCase() : "free";
}

function safeReadJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (e) {
    return { __parse_error: String(e?.message || e) };
  }
}

function titleCaseFromId(id) {
  return id
    .replace(/_(free|vip\d+|vip3_ii|kidslevel[123])$/i, "")
    .split("_")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function pickNameEn(obj, fallback) {
  return (
    obj?.name ||
    obj?.nameEn ||
    obj?.title_en ||
    obj?.titleEn ||
    obj?.title?.en ||
    fallback
  );
}

function pickNameVi(obj, fallback) {
  return (
    obj?.name_vi ||
    obj?.nameVi ||
    obj?.title_vi ||
    obj?.titleVi ||
    obj?.title?.vi ||
    fallback
  );
}

/* ---------------- Scan ---------------- */

function scanAllRooms() {
  if (!fs.existsSync(dataDir)) {
    throw new Error("Missing folder: " + dataDir);
  }

  const files = fs
    .readdirSync(dataDir)
    .filter((f) => f.endsWith(".json") && !f.startsWith("."))
    .sort();

  const manifest = {};
  const roomDataMap = {};
  const warnings = [];

  // Detect collisions: two different filenames map to same canonicalId
  const seen = new Map();

  for (const filename of files) {
    const canonicalId = canonicalIdFromFilename(filename);

    if (!canonicalId) {
      warnings.push("BAD_FILENAME " + filename);
      continue;
    }

    if (seen.has(canonicalId) && seen.get(canonicalId) !== filename) {
      warnings.push(
        "COLLISION canonicalId=" +
          canonicalId +
          " :: " +
          seen.get(canonicalId) +
          " vs " +
          filename
      );
      // keep the first one (register-first rule)
      continue;
    }
    seen.set(canonicalId, filename);

    const jsonPath = path.join(dataDir, filename);
    const json = safeReadJson(jsonPath);

    // ✅ CRITICAL: manifest points to REAL filename (case/symbols preserved)
    // NO leading slash
    manifest[canonicalId] = "data/" + filename;

    const tier = inferTierFromId(canonicalId);
    const fallbackTitle = titleCaseFromId(canonicalId);

    const nameEn = pickNameEn(json, fallbackTitle);
    const nameVi = pickNameVi(json, nameEn);

    roomDataMap[canonicalId] = {
      id: canonicalId,
      nameEn: String(nameEn),
      nameVi: String(nameVi),
      tier,
      hasData: true,
    };

    if (json?.__parse_error) {
      warnings.push("PARSE_ERROR " + filename + ": " + json.__parse_error);
    } else if (json?.id && String(json.id) !== canonicalId) {
      warnings.push('ID_MISMATCH ' + filename + ': json.id="' + json.id + '"');
    }
  }

  return { filesCount: files.length, manifest, roomDataMap, warnings };
}

/* ---------------- Writers ---------------- */

function writeFile(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, "utf8");
}

function generateRoomManifestTs(manifest) {
  return `/**
 * AUTO-GENERATED — DO NOT EDIT
 */
export const PUBLIC_ROOM_MANIFEST: Record<string, string> = ${JSON.stringify(
    manifest,
    null,
    2
  )};
`;
}

function generateRoomDataImportsTs(roomDataMap) {
  const entries = Object.entries(roomDataMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(
      ([k, v]) =>
        `  "${k}": ${JSON.stringify(v, null, 2).replace(/\n/g, "\n  ")}`
    )
    .join(",\n");

  return `/**
 * AUTO-GENERATED — DO NOT EDIT
 */
export const roomDataMap = {
${entries}
};
`;
}

function generateRoomListTs(roomDataMap) {
  return `/**
 * AUTO-GENERATED — DO NOT EDIT
 */
export const ROOM_IDS = ${JSON.stringify(
    Object.keys(roomDataMap).sort(),
    null,
    2
  )};
`;
}

/* ---------------- Main ---------------- */

try {
  const { filesCount, manifest, roomDataMap, warnings } = scanAllRooms();

  console.log("Total JSON files: " + filesCount);
  console.log("Warnings (non-fatal): " + warnings.length);

  writeFile(
    path.join(projectRoot, "src/lib/roomManifest.ts"),
    generateRoomManifestTs(manifest)
  );
  writeFile(
    path.join(projectRoot, "src/lib/roomDataImports.ts"),
    generateRoomDataImportsTs(roomDataMap)
  );
  writeFile(
    path.join(projectRoot, "src/lib/roomList.ts"),
    generateRoomListTs(roomDataMap)
  );

  console.log("Registry generated successfully");
} catch (err) {
  console.error("Generator failed:", err);
  process.exit(1);
}
