/**
 * Auto-generate room registry from all JSON files in public/data
 *
 * STRATEGY (IMPORTANT):
 * - Registry must reflect reality FIRST: include ALL public/data/*.json (≈626).
 * - Never "reject" a room because of content quality (entry count, missing fields, legacy formats).
 * - Only WARN when something looks wrong. Fix data later, in bulk.
 *
 * Canonical ID rule used by this generator:
 * - roomId is derived from the filename (without .json) -> normalized to lowercase snake_case.
 * - The manifest maps that roomId to the ACTUAL filename path (preserves original filename).
 *
 * Run with: node scripts/generate-room-registry.js
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Get project root (one level up from scripts/)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");
const publicDir = path.join(projectRoot, "public");

/**
 * Convert filename base -> canonical room id (lower snake_case).
 * Keeps it deterministic and GitHub-friendly.
 */
function filenameBaseToCanonicalId(base) {
  return String(base || "")
    .trim()
    .toLowerCase()
    // replace anything not a-z0-9_ with underscore
    .replace(/[^a-z0-9_]+/g, "_")
    // collapse underscores
    .replace(/_+/g, "_")
    // trim underscores
    .replace(/^_+|_+$/g, "");
}

/**
 * Best-effort name extraction. NEVER returns null.
 * If JSON parsing fails, falls back to a title derived from filename.
 */
function extractNamesBestEffort(jsonPath, filename) {
  const fallbackName = filename
    .replace(/\.json$/i, "")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1).toLowerCase() : w))
    .join(" ");

  try {
    const contentRaw = fs.readFileSync(jsonPath, "utf8");
    const content = JSON.parse(contentRaw);

    // Prefer your new structure if present
    let nameEn = content?.name || content?.nameEn || null;
    let nameVi = content?.name_vi || content?.nameVi || null;

    // Back-compat: title field
    if (!nameEn && content?.title) nameEn = content.title?.en || content.title;
    if (!nameVi && content?.title) nameVi = content.title?.vi || content.title;

    // Back-compat: description field
    if (!nameEn && content?.description) nameEn = content.description?.en || content.description;
    if (!nameVi && content?.description) nameVi = content.description?.vi || content.description;

    nameEn = String(nameEn || fallbackName).trim();
    nameVi = String(nameVi || nameEn).trim();

    return { nameEn, nameVi, parsed: true, content };
  } catch (err) {
    console.warn(`⚠️  WARN: Could not parse JSON for "${filename}" (${err?.message || err}). Will still register.`);
    return { nameEn: fallbackName, nameVi: fallbackName, parsed: false, content: null };
  }
}

/**
 * Infer tier from filename (best-effort).
 * This is ONLY metadata (does not affect whether the file is registered).
 */
function inferTierFromFilename(baseLower) {
  // typical endings: _free, _vip1.._vip9, _vip3_ii, _kidslevel1..3
  const m =
    baseLower.match(/_(vip3_ii)\b/) ||
    baseLower.match(/_(vip[1-9])\b/) ||
    baseLower.match(/_(free)\b/) ||
    baseLower.match(/_(kidslevel[123])\b/);

  if (!m) return "free";
  return m[1];
}

/**
 * Scan public/data for JSON files (flat). Include ALL *.json.
 * Never exclude based on naming.
 */
function scanRoomFiles() {
  const dataDir = path.join(publicDir, "data");

  if (!fs.existsSync(dataDir)) {
    console.error(`Error: Data directory not found: ${dataDir}`);
    return { manifest: {}, dataImports: {}, stats: { total: 0, registered: 0, warned: 0 } };
  }

  const files = fs
    .readdirSync(dataDir)
    .filter((f) => f.endsWith(".json") && !f.startsWith("."));

  const manifest = {};
  const dataImports = {};
  let warned = 0;

  console.log(`Found ${files.length} JSON files in public/data`);

  for (const filename of files) {
    const jsonPath = path.join(dataDir, filename);
    const base = filename.replace(/\.json$/i, "");
    const canonicalId = filenameBaseToCanonicalId(base);
    const baseLower = String(base).toLowerCase();

    // Always register manifest entry (key = canonicalId, value = actual filename)
    manifest[canonicalId] = `data/${filename}`;

    // Best-effort metadata
    const names = extractNamesBestEffort(jsonPath, filename);
    const tier = inferTierFromFilename(baseLower);

    // WARN only (no reject)
    if (names.parsed && names.content) {
      const jsonId = names.content.id;
      if (jsonId && String(jsonId) !== String(base)) {
        warned++;
        console.warn(
          `⚠️  WARN: ${filename} JSON.id (${jsonId}) != filename base (${base}). Registered anyway.`,
        );
      }

      const entries = names.content.entries;
      if (!Array.isArray(entries)) {
        warned++;
        console.warn(`⚠️  WARN: ${filename} missing entries[] (or not array). Registered anyway.`);
      } else if (entries.length === 0) {
        warned++;
        console.warn(`⚠️  WARN: ${filename} has 0 entries. Registered anyway.`);
      }
    } else {
      warned++;
    }

    dataImports[canonicalId] = {
      id: canonicalId,
      nameEn: names.nameEn,
      nameVi: names.nameVi,
      tier,
      hasData: true,
    };

    console.log(`✓ Registered: ${canonicalId} → data/${filename}`);
  }

  return { manifest, dataImports, stats: { total: files.length, registered: Object.keys(manifest).length, warned } };
}

function generateManifest(manifest) {
  const content = `/**
 * AUTO-GENERATED: Do not edit manually
 * Generated by: scripts/generate-room-registry.js
 * Run: node scripts/generate-room-registry.js
 */
export const PUBLIC_ROOM_MANIFEST: Record<string, string> = ${JSON.stringify(manifest, null, 2)};

/**
 * Get all unique room base names (without tier suffix)
 */
export function getRoomBaseNames(): string[] {
  const baseNames = new Set<string>();

  for (const roomId of Object.keys(PUBLIC_ROOM_MANIFEST)) {
    // Keep conservative: strip common tier suffixes
    const baseName = roomId.replace(/_(free|vip[1-9]|vip3_ii|kidslevel[123])$/, "");
    baseNames.add(baseName);
  }

  return Array.from(baseNames).sort();
}

/**
 * Get all tiers available for a room base name
 */
export function getAvailableTiers(roomBaseName: string): string[] {
  const tiers: string[] = [];

  for (const tier of ["free","vip1","vip2","vip3","vip3_ii","vip4","vip5","vip6","vip7","vip8","vip9","kidslevel1","kidslevel2","kidslevel3"]) {
    const roomId = \`\${roomBaseName}_\${tier}\`;
    if (PUBLIC_ROOM_MANIFEST[roomId]) tiers.push(tier);
  }

  // Also support rooms that have no tier suffix at all (base only)
  if (PUBLIC_ROOM_MANIFEST[roomBaseName]) tiers.unshift("base");

  return tiers;
}
`;

  const manifestPath = path.join(projectRoot, "src", "lib", "roomManifest.ts");
  fs.writeFileSync(manifestPath, content, "utf8");
  console.log(`✅ Generated roomManifest.ts with ${Object.keys(manifest).length} rooms`);
}

function generateDataImports(dataImports) {
  const entries = Object.entries(dataImports)
    .map(([key, value]) => `  "${key}": ${JSON.stringify(value, null, 4).replace(/\n/g, "\n  ")}`)
    .join(",\n");

  const content = `/**
 * AUTO-GENERATED: Do not edit manually
 * Generated by: scripts/generate-room-registry.js
 * Run: node scripts/generate-room-registry.js
 */
import { RoomData } from "@/lib/roomData";

export const roomDataMap: Record<string, RoomData> = {
${entries}
};
`;

  const importsPath = path.join(projectRoot, "src", "lib", "roomDataImports.ts");
  fs.writeFileSync(importsPath, content, "utf8");
  console.log(`✅ Generated roomDataImports.ts with ${Object.keys(dataImports).length} rooms`);
}

// Main
try {
  console.log("🔍 Scanning public/data for room JSON files...");
  const { manifest, dataImports, stats } = scanRoomFiles();

  console.log(`📦 Total JSON files: ${stats.total}`);
  console.log(`📌 Registered rooms: ${stats.registered}`);
  console.log(`⚠️  Warnings (non-fatal): ${stats.warned}`);

  generateManifest(manifest);
  generateDataImports(dataImports);

  console.log("✨ Room registry generation complete!");
} catch (err) {
  console.error("❌ Error generating room registry:", err);
  process.exit(1);
}
