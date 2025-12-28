/**
 * Auto-generate room registry from ALL JSON files in public/data
 * File: scripts/generate-room-registry.js
 * Version: MB-BLUE-97.7 — 2025-12-28 (+0700)
 *
 * GOAL (strategic):
 * - NEVER reject rooms (register first, warn later)
 * - ONE canonical ID format: snake_case (underscores only)
 * - Manifest must point to the REAL filename in /public/data
 *
 * Generates:
 * A) src/lib/roomManifest.ts        -> PUBLIC_ROOM_MANIFEST: canonicalId -> "data/REAL_FILENAME.json"
 * B) src/lib/roomDataImports.ts     -> roomDataMap (metadata)
 * C) src/lib/roomList.ts            -> ROOM_IDS + getRoomList() (optional helper)
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

/**
 * ✅ Tier inference (ROBUST)
 * Works for:
 * - *_vip9_vol1, *_vip5_bonus, *_vip4_vip4, vip9 anywhere
 * - legacy: vip3_ii / vip3ii / vip3_ext -> vip3_ext
 * - fallback: free
 *
 * IMPORTANT:
 * - We infer from the CANONICAL ID, which is already snake_case.
 */
function inferTierFromId(id) {
  const s = String(id || "").toLowerCase();

  // vip3 extension variants (treat as vip3_ext)
  if (/(^|_)vip3(_?ii|_?ext)($|_)/.test(s)) return "vip3_ext";

  // explicit free marker
  if (/(^|_)free($|_)/.test(s)) return "free";

  // ✅ find vip1..vip9 ANYWHERE (with or without underscores around it)
  // examples it catches:
  // - alexander_the_great_vip9_vol1
  // - career_path_vip4
  // - writing_vip5_bonus
  // - somethingvip6something (rare but safe)
  const m = s.match(/vip([1-9])/);
  if (m) return `vip${m[1]}`;

  // kids content defaults to free for now
  if (/_kids_l[123]\b/.test(s)) return "free";

  return "free";
}

function safeReadJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (e) {
    return { __parse_error: String(e?.message || e) };
  }
}

function titleCaseFromId(id) {
  return String(id || "")
    .replace(/_(free|vip\d+|vip3_ext|vip3_ii|kids_l[123])$/i, "")
    .replace(/_+/g, "_")
    .split("_")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function pickTitleEn(obj, fallback) {
  return (
    obj?.title?.en ||
    obj?.title_en ||
    obj?.titleEn ||
    obj?.name?.en ||
    obj?.name_en ||
    obj?.nameEn ||
    obj?.name ||
    fallback
  );
}

function pickTitleVi(obj, fallback) {
  return (
    obj?.title?.vi ||
    obj?.title_vi ||
    obj?.titleVi ||
    obj?.name?.vi ||
    obj?.name_vi ||
    obj?.nameVi ||
    fallback
  );
}

/* ---------------- Scan ---------------- */

function scanAllRooms() {
  if (!fs.existsSync(dataDir)) throw new Error("Missing folder: " + dataDir);

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
    manifest[canonicalId] = "data/" + filename;

    // Tier: prefer json.tier ONLY IF it looks like free/vipN/vip3_ext
    // Otherwise infer from ID (prevents vip9_vol1 poisoning the tier).
    const jsonTierRaw = String(json?.tier || "").trim().toLowerCase();
    const jsonTierOk =
      jsonTierRaw === "free" ||
      jsonTierRaw === "vip3_ext" ||
      /^vip[1-9]$/.test(jsonTierRaw);

    const tier = jsonTierOk ? jsonTierRaw : inferTierFromId(canonicalId);

    const fallbackTitle = titleCaseFromId(canonicalId);
    const titleEn = pickTitleEn(json, fallbackTitle);
    const titleVi = pickTitleVi(json, titleEn);

    roomDataMap[canonicalId] = {
      id: canonicalId,
      title_en: String(titleEn),
      title_vi: String(titleVi),
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
 * Version: MB-BLUE-97.7
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
 * Version: MB-BLUE-97.7
 */
export const roomDataMap = {
${entries}
} as const;
`;
}

function generateRoomListTs(roomDataMap) {
  const ids = Object.keys(roomDataMap).sort();
  const list = ids.map((id) => roomDataMap[id]);

  return `/**
 * AUTO-GENERATED — DO NOT EDIT
 * Version: MB-BLUE-97.7
 */

export type RoomListItem = {
  id: string;
  title_en?: string;
  title_vi?: string;
  tier?: string;
  hasData?: boolean;
};

export const ROOM_IDS = ${JSON.stringify(ids, null, 2)} as const;

const __ROOM_LIST: RoomListItem[] = ${JSON.stringify(list, null, 2)};

export function getRoomList(): RoomListItem[] {
  return __ROOM_LIST.slice();
}
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
