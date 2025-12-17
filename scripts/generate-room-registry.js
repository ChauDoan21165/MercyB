/**
 * Auto-generate room registry from all JSON files in /public/data
 *
 * GOAL (Mercy Blade truth rule):
 * - Registry must reflect reality: include ALL /public/data/*.json rooms
 * - Canonical roomId = filename base (snake_case) = JSON.id (if present)
 * - No runtime hacks (no dual IDs). One canonical ID only.
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
const dataDir = path.join(publicDir, "data");

// ---------- Canonical rules ----------

// Canonical: snake_case only
function validateFilenameCanonical(filename) {
  if (!filename.endsWith(".json")) return { valid: false, reason: "Must end with .json" };
  if (filename.startsWith(".")) return { valid: false, reason: "Hidden file" };
  if (filename !== filename.toLowerCase()) return { valid: false, reason: "Must be lowercase" };

  const base = filename.replace(/\.json$/i, "");
  if (base.includes("-")) return { valid: false, reason: "Must be snake_case only (no hyphens)" };
  if (!/^[a-z0-9_]+$/.test(base)) return { valid: false, reason: "Only a-z, 0-9, underscore allowed" };

  return { valid: true };
}

// Canonical roomId is EXACT filename base (snake_case)
function filenameToRoomId(filename) {
  return filename.replace(/\.json$/i, "");
}

// Normalize tier string from JSON into internal tier id
function normalizeTier(raw) {
  const s = String(raw || "").toLowerCase();

  // common formats seen in data
  if (s.includes("free") || s.includes("miễn")) return "free";
  if (s.includes("vip 1") || s.includes("vip1")) return "vip1";
  if (s.includes("vip 2") || s.includes("vip2")) return "vip2";
  if (s.includes("vip 3") || s.includes("vip3")) return "vip3";
  if (s.includes("vip 4") || s.includes("vip4")) return "vip4";
  if (s.includes("vip 5") || s.includes("vip5")) return "vip5";
  if (s.includes("vip 6") || s.includes("vip6")) return "vip6";
  if (s.includes("vip 7") || s.includes("vip7")) return "vip7";
  if (s.includes("vip 8") || s.includes("vip8")) return "vip8";
  if (s.includes("vip 9") || s.includes("vip9")) return "vip9";
  if (s.includes("kidslevel1")) return "kidslevel1";
  if (s.includes("kidslevel2")) return "kidslevel2";
  if (s.includes("kidslevel3")) return "kidslevel3";

  return "free";
}

// Extract display names (best-effort; NEVER reject room if missing)
function extractNamesBestEffort(content, filename) {
  let nameEn = content?.name || content?.title_en || null;
  let nameVi = content?.name_vi || content?.title_vi || null;

  if ((!nameEn || !nameVi) && content?.description && typeof content.description === "object") {
    nameEn = nameEn || content.description.en || null;
    nameVi = nameVi || content.description.vi || null;
  }

  if ((!nameEn || !nameVi) && content?.title) {
    if (typeof content.title === "object") {
      nameEn = nameEn || content.title.en || null;
      nameVi = nameVi || content.title.vi || null;
    } else {
      nameEn = nameEn || content.title || null;
      nameVi = nameVi || content.title || null;
    }
  }

  // Fallback: from filename
  if (!nameEn) {
    nameEn = filename
      .replace(/\.json$/i, "")
      .replace(/_/g, " ")
      .split(" ")
      .filter(Boolean)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  }
  if (!nameVi) nameVi = nameEn;

  return { nameEn, nameVi };
}

// ---------- Scan & Generate ----------

function scanRoomFiles() {
  if (!fs.existsSync(dataDir)) {
    console.error(`Error: Data directory not found: ${dataDir}`);
    console.log("Creating data directory...");
    fs.mkdirSync(dataDir, { recursive: true });
    return { manifest: {}, dataImports: {} };
  }

  const files = fs.readdirSync(dataDir);
  const jsonFiles = files.filter((f) => f.endsWith(".json") && !f.startsWith("."));

  const manifest = {};
  const dataImports = {};

  console.log(`Found ${jsonFiles.length} JSON files in public/data`);

  for (const filename of jsonFiles) {
    const v = validateFilenameCanonical(filename);
    if (!v.valid) {
      // Canonical rule is strict: skip non-canonical filenames (but do not crash)
      console.warn(`⚠️  Skipping non-canonical file: ${filename} — ${v.reason}`);
      continue;
    }

    const roomId = filenameToRoomId(filename);
    const jsonPath = path.join(dataDir, filename);

    let content = null;
    try {
      content = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
    } catch (err) {
      console.warn(`⚠️  Skipping unreadable JSON: ${filename} — ${err.message}`);
      continue;
    }

    // Enforce id consistency if JSON.id exists (skip if mismatch; no dual-ID hacks)
    if (content?.id && String(content.id) !== roomId) {
      console.warn(`⚠️  Skipping ID mismatch: ${filename} — JSON.id=${content.id} != filename=${roomId}`);
      continue;
    }

    const { nameEn, nameVi } = extractNamesBestEffort(content, filename);
    const tier = normalizeTier(content?.tier);

    manifest[roomId] = `data/${filename}`;
    dataImports[roomId] = {
      id: roomId,
      nameEn,
      nameVi,
      tier,
      hasData: true,
    };
  }

  return { manifest, dataImports };
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
    // NOTE: we keep the old helper, but registry itself is canonical snake_case
    const baseName = roomId.replace(/_(free|vip1|vip2|vip3|vip3_ii|vip4|vip5|vip6|vip7|vip8|vip9|kidslevel[123])$/, "");
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
  console.log("🔍 Scanning for room JSON files...");
  const { manifest, dataImports } = scanRoomFiles();

  console.log(`📦 Rooms registered (canonical): ${Object.keys(manifest).length}`);
  generateManifest(manifest);
  generateDataImports(dataImports);

  console.log("✨ Room registry generation complete!");
} catch (err) {
  console.error("❌ Error generating room registry:", err);
  process.exit(1);
}
