// scripts/full-room-sync-audit.ts
// Mercy Blade — Full Room & Audio Sync Audit
//
// Compares 3 sources of truth:
// 1) GitHub/local JSON + audio files (public/data, public/audio)
// 2) Supabase DB (rooms table with entries JSONB)
// 3) Lovable registry export (public/data/room-registry.json)
//
// Usage: npx tsx scripts/full-room-sync-audit.ts

import { promises as fs } from "fs";
import path from "path";
import { createClient } from "@supabase/supabase-js";

const ROOT = process.cwd();
const DATA_DIR = path.join(ROOT, "public", "data");
const AUDIO_DIR = path.join(ROOT, "public", "audio");
const REGISTRY_FILE = path.join(DATA_DIR, "room-registry.json");

const SUPABASE_URL =
  process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || "";
const SUPABASE_KEY =
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY || "";

// Files to exclude from room counting
const EXCLUDED_FILES = new Set([
  "room-registry.json",
  "components.json",
  "Tiers.json",
  "tiers.json",
  "config.json",
  "settings.json",
]);

type AudioSet = Set<string>;

type RoomInfo = {
  id: string;
  slug: string;
  tier?: string;
  source: "github" | "db" | "registry";
  audio: AudioSet;
  entryCount: number;
};

type RoomDiff = {
  slug: string;
  presentIn: {
    github: boolean;
    db: boolean;
    registry: boolean;
  };
  audioMissingFromGithub: string[];
  audioMissingFromDb: string[];
  entryCountGithub: number;
  entryCountDb: number;
};

function normalizeAudioFilename(raw: string): string {
  let s = raw.trim();
  if (s.startsWith("/")) s = s.slice(1);
  if (s.toLowerCase().startsWith("public/")) s = s.slice("public/".length);
  if (s.toLowerCase().startsWith("audio/")) s = s.slice("audio/".length);
  // Handle nested paths like en/ or vi/
  if (s.toLowerCase().startsWith("en/")) s = s.slice("en/".length);
  if (s.toLowerCase().startsWith("vi/")) s = s.slice("vi/".length);
  return s;
}

async function listFilesRecursively(
  dir: string,
  ext: string
): Promise<string[]> {
  const results: string[] = [];
  
  async function walk(current: string) {
    try {
      const items = await fs.readdir(current, { withFileTypes: true });
      for (const item of items) {
        const full = path.join(current, item.name);
        if (item.isDirectory()) {
          await walk(full);
        } else if (item.isFile() && item.name.toLowerCase().endsWith(ext)) {
          results.push(full);
        }
      }
    } catch (err) {
      // Directory might not exist
    }
  }
  
  await walk(dir);
  return results;
}

function extractAudioFromEntry(entry: any): string | null {
  if (!entry) return null;
  
  // Try different audio field names
  const audioRaw = entry.audio || entry.audio_en || entry.audioEn;
  
  if (typeof audioRaw === "string" && audioRaw.trim()) {
    return normalizeAudioFilename(audioRaw);
  }
  
  if (audioRaw && typeof audioRaw === "object") {
    const val = audioRaw.en || audioRaw.vi || Object.values(audioRaw)[0];
    if (typeof val === "string" && val.trim()) {
      return normalizeAudioFilename(val);
    }
  }
  
  return null;
}

/** ---------- 1. GitHub / local JSON + audio ---------- */

async function getGithubRooms(): Promise<Map<string, RoomInfo>> {
  const map = new Map<string, RoomInfo>();

  const jsonFiles = await listFilesRecursively(DATA_DIR, ".json");
  
  for (const file of jsonFiles) {
    const filename = path.basename(file);
    
    // Skip non-room files
    if (EXCLUDED_FILES.has(filename)) continue;
    
    let json: any;
    try {
      const content = await fs.readFile(file, "utf8");
      json = JSON.parse(content);
    } catch {
      // skip invalid JSON
      continue;
    }

    // Must have entries array to be a valid room
    const entries = json.entries;
    if (!Array.isArray(entries)) continue;

    const slug: string = json.id || json.slug || path.basename(file, ".json");
    const tier: string | undefined = json.tier;

    const room: RoomInfo = {
      id: slug,
      slug,
      tier,
      source: "github",
      audio: new Set<string>(),
      entryCount: entries.length,
    };

    for (const entry of entries) {
      const audioFile = extractAudioFromEntry(entry);
      if (audioFile) {
        room.audio.add(audioFile);
      }
    }

    map.set(slug, room);
  }

  return map;
}

/** ---------- 2. Supabase DB ---------- */

async function getDbRooms(): Promise<Map<string, RoomInfo>> {
  const map = new Map<string, RoomInfo>();

  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.warn(
      "⚠️  Supabase credentials missing; DB part of audit will be skipped."
    );
    return map;
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: { persistSession: false },
  });

  // Fetch rooms with entries JSONB column
  const { data: rooms, error: roomsError } = await supabase
    .from("rooms")
    .select("id, tier, entries");

  if (roomsError) {
    console.error("Error loading rooms from DB:", roomsError.message);
    return map;
  }

  for (const r of rooms || []) {
    const slug: string = r.id; // In your schema, id IS the slug
    const entries = Array.isArray(r.entries) ? r.entries : [];
    
    const room: RoomInfo = {
      id: r.id,
      slug,
      tier: r.tier,
      source: "db",
      audio: new Set<string>(),
      entryCount: entries.length,
    };

    for (const entry of entries) {
      const audioFile = extractAudioFromEntry(entry);
      if (audioFile) {
        room.audio.add(audioFile);
      }
    }

    map.set(slug, room);
  }

  return map;
}

/** ---------- 3. Lovable registry JSON ---------- */

async function getRegistryRooms(): Promise<Map<string, RoomInfo>> {
  const map = new Map<string, RoomInfo>();

  try {
    const content = await fs.readFile(REGISTRY_FILE, "utf8");
    const json = JSON.parse(content);

    const rooms = json.rooms || json || [];
    const roomArray = Array.isArray(rooms) ? rooms : Object.values(rooms);
    
    for (const r of roomArray) {
      if (!r || typeof r !== 'object') continue;
      
      const slug: string = r.slug || r.id;
      if (!slug) continue;
      
      map.set(slug, {
        id: r.id || slug,
        slug,
        tier: r.tier,
        source: "registry",
        audio: new Set<string>(),
        entryCount: 0,
      });
    }
  } catch (err) {
    console.warn(
      `⚠️  Registry file not found or invalid at ${REGISTRY_FILE}. Skipping registry source.`
    );
  }

  return map;
}

/** ---------- Physical Audio Files ---------- */

async function buildAudioExistenceMap(): Promise<Set<string>> {
  const files = await listFilesRecursively(AUDIO_DIR, ".mp3");
  return new Set(files.map((f) => path.basename(f)));
}

/** ---------- Comparison & Report ---------- */

async function runFullSyncAudit(): Promise<void> {
  console.log("\n🧭 Mercy Blade — Full Room & Audio Sync Audit");
  console.log("=".repeat(50) + "\n");

  const [githubRooms, dbRooms, registryRooms, audioExists] = await Promise.all([
    getGithubRooms(),
    getDbRooms(),
    getRegistryRooms(),
    buildAudioExistenceMap(),
  ]);

  const allSlugs = new Set<string>([
    ...githubRooms.keys(),
    ...dbRooms.keys(),
    ...registryRooms.keys(),
  ]);

  const diffs: RoomDiff[] = [];

  for (const slug of allSlugs) {
    const g = githubRooms.get(slug);
    const d = dbRooms.get(slug);
    const r = registryRooms.get(slug);

    const audioMissingFromGithub: string[] = [];
    const audioMissingFromDb: string[] = [];

    if (g && d) {
      // present in both, compare audio sets
      for (const a of d.audio) {
        if (!g.audio.has(a)) audioMissingFromGithub.push(a);
      }
      for (const a of g.audio) {
        if (!d.audio.has(a)) audioMissingFromDb.push(a);
      }
    }

    diffs.push({
      slug,
      presentIn: {
        github: !!g,
        db: !!d,
        registry: !!r,
      },
      audioMissingFromGithub,
      audioMissingFromDb,
      entryCountGithub: g?.entryCount || 0,
      entryCountDb: d?.entryCount || 0,
    });
  }

  // Summaries
  const onlyGithub = diffs.filter(
    (d) => d.presentIn.github && !d.presentIn.db
  );
  const onlyDb = diffs.filter(
    (d) => d.presentIn.db && !d.presentIn.github
  );
  const onlyRegistry = diffs.filter(
    (d) => d.presentIn.registry && !d.presentIn.github && !d.presentIn.db
  );
  const audioMismatch = diffs.filter(
    (d) => d.audioMissingFromDb.length || d.audioMissingFromGithub.length
  );
  const entryCountMismatch = diffs.filter(
    (d) => d.presentIn.github && d.presentIn.db && d.entryCountGithub !== d.entryCountDb
  );

  // Print summary
  console.log("📊 SUMMARY");
  console.log("-".repeat(50));
  console.log(`Rooms total (union): ${allSlugs.size}`);
  console.log(`• GitHub/local JSON: ${githubRooms.size}`);
  console.log(`• DB: ${dbRooms.size}`);
  console.log(`• Registry: ${registryRooms.size}`);
  console.log(`• Physical audio files: ${audioExists.size}`);
  console.log();

  // Room presence mismatches
  console.log("🔍 ROOM PRESENCE MISMATCHES");
  console.log("-".repeat(50));
  
  if (onlyGithub.length) {
    console.log(`\n❌ In GitHub ONLY (${onlyGithub.length} rooms):`);
    onlyGithub.forEach((d) => console.log(`   - ${d.slug}`));
  }
  
  if (onlyDb.length) {
    console.log(`\n❌ In DB ONLY (${onlyDb.length} rooms):`);
    onlyDb.forEach((d) => console.log(`   - ${d.slug}`));
  }
  
  if (onlyRegistry.length) {
    console.log(`\n❌ In Registry ONLY (${onlyRegistry.length} rooms):`);
    onlyRegistry.forEach((d) => console.log(`   - ${d.slug}`));
  }
  
  if (!onlyGithub.length && !onlyDb.length && !onlyRegistry.length) {
    console.log("✅ All rooms present across sources.\n");
  }

  // Entry count mismatches
  console.log("\n📝 ENTRY COUNT MISMATCHES (GitHub vs DB)");
  console.log("-".repeat(50));
  
  if (!entryCountMismatch.length) {
    console.log("✅ Entry counts match between GitHub JSON and DB.\n");
  } else {
    console.log(`Found ${entryCountMismatch.length} rooms with different entry counts:\n`);
    for (const d of entryCountMismatch) {
      console.log(`   ${d.slug}: GitHub=${d.entryCountGithub}, DB=${d.entryCountDb}`);
    }
    console.log();
  }

  // Audio list mismatches
  console.log("\n🎧 AUDIO LIST MISMATCHES (GitHub vs DB)");
  console.log("-".repeat(50));
  
  if (!audioMismatch.length) {
    console.log("✅ Audio filename sets match between GitHub JSON and DB.\n");
  } else {
    console.log(`Found ${audioMismatch.length} rooms with audio mismatches:\n`);
    for (const d of audioMismatch) {
      console.log(`🎧 ${d.slug}`);
      if (d.audioMissingFromGithub.length) {
        console.log(`   In DB but not in JSON: ${d.audioMissingFromGithub.join(", ")}`);
      }
      if (d.audioMissingFromDb.length) {
        console.log(`   In JSON but not in DB: ${d.audioMissingFromDb.join(", ")}`);
      }
    }
    console.log();
  }

  // Physical mp3 existence check
  console.log("\n💾 PHYSICAL MP3 EXISTENCE (public/audio)");
  console.log("-".repeat(50));
  
  const missingPhysical: Array<{ file: string; room: string; source: string }> = [];
  
  for (const room of githubRooms.values()) {
    for (const fname of room.audio) {
      if (!audioExists.has(fname)) {
        missingPhysical.push({ file: fname, room: room.slug, source: "github" });
      }
    }
  }
  
  for (const room of dbRooms.values()) {
    for (const fname of room.audio) {
      if (!audioExists.has(fname)) {
        // Avoid duplicates if already reported from github
        const existing = missingPhysical.find((m) => m.file === fname && m.room === room.slug);
        if (!existing) {
          missingPhysical.push({ file: fname, room: room.slug, source: "db" });
        }
      }
    }
  }

  if (!missingPhysical.length) {
    console.log("✅ Every referenced audio file exists in public/audio/.\n");
  } else {
    console.log(`❌ Found ${missingPhysical.length} missing audio files:\n`);
    for (const m of missingPhysical) {
      console.log(`   ${m.file} (referenced in ${m.source}:${m.room})`);
    }
    console.log();
  }

  // Final verdict
  console.log("\n" + "=".repeat(50));
  const issues = onlyGithub.length + onlyDb.length + onlyRegistry.length + 
                 audioMismatch.length + entryCountMismatch.length + missingPhysical.length;
  
  if (issues === 0) {
    console.log("✅ AUDIT PASSED — All sources are in sync!");
  } else {
    console.log(`⚠️  AUDIT FOUND ${issues} ISSUE(S) — Review above for details.`);
  }
  console.log("=".repeat(50) + "\n");
}

runFullSyncAudit().catch((err) => {
  console.error("Audit failed:", err);
  process.exit(1);
});
