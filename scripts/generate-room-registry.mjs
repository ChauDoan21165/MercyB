// FILE: generate-room-registry.mjs
// PATH: scripts/generate-room-registry.mjs
// VERSION: MB-BLUE-97.9c — 2026-01-15 (+0700)
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
 * B) src/lib/roomDataImports.ts     -> roomDataMap (metadata)
 * C) src/lib/roomList.ts            -> ROOM_IDS + getRoomList() (optional helper)
 *
 * Run: node scripts/generate-room-registry.mjs
 *
 * FIX (Free 482 bug):
 * - DO NOT default tier to "free" in the registry.
 * - Only set a tier when it is explicit (from JSON tier) or confidently inferred from ID.
 * - Otherwise leave tier undefined and WARN (so generator warnings catch inconsistent data).
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
 * STRICT tier inference:
 * - Only infer if the ID contains an explicit marker.
 * - If there is no marker, return undefined (UNKNOWN), NOT "free".
 *
 * Supported inferred tiers (canonical):
 * - free
 * - vip1..vip9
 * - vip3ii
 * - kids_1..kids_3
 */
function inferTierFromId(id) {
  const s = String(id || "").toLowerCase();

  // kids first (explicit markers only)
  if (/(^|_)kids_1($|_)/.test(s)) return "kids_1";
  if (/(^|_)kids_2($|_)/.test(s)) return "kids_2";
  if (/(^|_)kids_3($|_)/.test(s)) return "kids_3";

  // vip3ii specialization marker
  if (/(^|_)vip3ii($|_)/.test(s) || /(^|_)vip3_ii($|_)/.test(s)) return "vip3ii";

  // explicit free marker
  if (/(^|_)free($|_)/.test(s)) return "free";

  // vip1..vip9 marker anywhere (but still explicit)
  // examples:
  // - alexander_the_great_vip9_vol1
  // - career_path_vip4
  // - writing_vip5_bonus
  const m = s.match(/vip([1-9])/);
  if (m) return `vip${m[1]}`;

  // unknown — do NOT default to free
  return undefined;
}

/**
 * Normalize various JSON tier strings into canonical tier IDs.
 * Returns undefined if it doesn't look like a known tier.
 *
 * Accepts:
 * - "free", "vip3", "vip9", "vip3ii"
 * - "Free / Miễn phí"
 * - "VIP3 / VIP3", "VIP9 / Cấp VIP9"
 * - "VIP3 II / VIP3 II" -> vip3ii
 * - "kids_1", "Kids Level 1 / Trẻ em cấp 1" (best-effort)
 */
function normalizeJsonTier(raw) {
  const s = String(raw || "").trim();
  if (!s) return undefined;

  const low = s.toLowerCase();

  // canonical ids already
  if (low === "free") return "free";
  if (/^vip[1-9]$/.test(low)) return low;
  if (low === "vip3ii" || low === "vip3_ii") return "vip3ii";
  if (low === "kids_1" || low === "kids_2" || low === "kids_3") return low;

  // human labels
  if (low.includes("miễn phí") || low.includes("free")) return "free";

  if (low.includes("vip3ii") || low.includes("vip3 ii")) return "vip3ii";

  const m = low.match(/vip\s*([1-9])/);
  if (m) return `vip${m[1]}`;

  if (low.includes("kids") && (low.includes("1") || low.includes("level 1"))) return "kids_1";
  if (low.includes("kids") && (low.includes("2") || low.includes("level 2"))) return "kids_2";
  if (low.includes("kids") && (low.includes("3") || low.includes("level 3"))) return "kids_3";

  if (low.includes("trẻ em") && low.includes("1")) return "kids_1";
  if (low.includes("trẻ em") && low.includes("2")) return "kids_2";
  if (low.includes("trẻ em") && low.includes("3")) return "kids_3";

  return undefined;
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
    .replace(/_(free|vip\d+|vip3ii|vip3_ii|kids_1|kids_2|kids_3)$/i, "")
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

    // Tier:
    // - Prefer JSON tier when it normalizes cleanly.
    // - Else infer ONLY if ID contains explicit marker.
    // - Else leave undefined (UNKNOWN) and WARN.
    const tierFromJson = normalizeJsonTier(json?.tier);
    const tierFromId = inferTierFromId(canonicalId);
    const tier = tierFromJson ?? tierFromId;

    if (!tier) {
      warnings.push("MISSING_TIER " + filename);
    } else if (!tierFromJson && tierFromId) {
      warnings.push("INFERRED_TIER " + filename + " -> " + tierFromId);
    } else if (tierFromJson && String(json?.tier || "").trim().toLowerCase() !== tierFromJson) {
      warnings.push(
        'NORMALIZED_TIER ' + filename + ': json.tier="' + String(json?.tier) + '" -> ' + tierFromJson
      );
    }

    const fallbackTitle = titleCaseFromId(canonicalId);
    const titleEn = pickTitleEn(json, fallbackTitle);
    const titleVi = pickTitleVi(json, titleEn);

    roomDataMap[canonicalId] = {
      id: canonicalId,
      title_en: String(titleEn),
      title_vi: String(titleVi),
      // IMPORTANT: may be undefined (unknown)
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
  return `// FILE: roomManifest.ts
// PATH: src/lib/roomManifest.ts
// VERSION: MB-BLUE-97.9c — 2026-01-15 (+0700)
/**
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

  return `// FILE: roomDataImports.ts
// PATH: src/lib/roomDataImports.ts
// VERSION: MB-BLUE-97.9c — 2026-01-15 (+0700)
/**
 * AUTO-GENERATED — DO NOT EDIT
 */
export const roomDataMap = {
${entries}
} as const;
`;
}

function generateRoomListTs(roomDataMap) {
  const ids = Object.keys(roomDataMap).sort();
  const list = ids.map((id) => roomDataMap[id]);

  return `// FILE: roomList.ts
// PATH: src/lib/roomList.ts
// VERSION: MB-BLUE-97.9c — 2026-01-15 (+0700)
/**
 * AUTO-GENERATED — DO NOT EDIT
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

  // Print a small sample of warnings so you can see what's happening
  if (warnings.length) {
    const head = warnings.slice(0, 20);
    console.log("\nWarnings (first " + head.length + "):");
    for (const w of head) console.log(" - " + w);
    if (warnings.length > head.length) {
      console.log(" ... +" + (warnings.length - head.length) + " more");
    }
  }

  console.log("\nRegistry generated successfully");
} catch (err) {
  console.error("Generator failed:", err);
  process.exit(1);
}
