// scripts/fast-audio-scan.ts
// Mercy Blade — Fast Audio Scanner
// Usage: npx tsx scripts/fast-audio-scan.ts

import { promises as fs } from "fs";
import path from "path";

type JsonEntry = {
  slug?: string;
  audio?: string | { en?: string; vi?: string; [k: string]: any };
  [k: string]: any;
};

type RoomJson = {
  id?: string;
  title?: { en?: string; vi?: string };
  tier?: string;
  entries?: JsonEntry[];
  [k: string]: any;
};

type MissingAudio = {
  roomFile: string;
  roomId: string;
  tier: string;
  entryIndex: number;
  entrySlug?: string;
  filename: string;
};

const ROOT = process.cwd();
const DATA_DIR = path.join(ROOT, "public", "data");
const AUDIO_DIR = path.join(ROOT, "public", "audio");

async function fileExists(p: string): Promise<boolean> {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

async function listJsonFiles(dir: string): Promise<string[]> {
  const out: string[] = [];
  async function walk(current: string) {
    const items = await fs.readdir(current, { withFileTypes: true });
    for (const item of items) {
      const full = path.join(current, item.name);
      if (item.isDirectory()) {
        await walk(full);
      } else if (item.isFile() && item.name.endsWith(".json")) {
        out.push(full);
      }
    }
  }
  await walk(dir);
  return out;
}

function normalizeAudioFilename(raw: string): string {
  let s = raw.trim();
  // strip leading slash
  if (s.startsWith("/")) s = s.slice(1);
  // strip leading "audio/"
  if (s.toLowerCase().startsWith("audio/")) s = s.slice("audio/".length);
  return s;
}

async function scan(): Promise<void> {
  console.log("🎧 Fast Audio Scan");
  console.log("==================\n");

  const jsonFiles = await listJsonFiles(DATA_DIR);
  console.log(`Found ${jsonFiles.length} room JSON file(s) in public/data/.\n`);

  const missing: MissingAudio[] = [];
  let totalEntries = 0;
  let totalAudioRefs = 0;

  for (const file of jsonFiles) {
    const relFile = path.relative(ROOT, file);

    let json: RoomJson;
    try {
      const content = await fs.readFile(file, "utf8");
      json = JSON.parse(content);
    } catch (err) {
      console.warn(`⚠️  Skipping invalid JSON: ${relFile}`);
      continue;
    }

    const roomId = json.id ?? path.basename(file, ".json");
    const tier = json.tier ?? "unknown";
    const entries = json.entries ?? [];

    totalEntries += entries.length;

    entries.forEach((entry, idx) => {
      let audioRaw: string | undefined;

      if (typeof entry.audio === "string") {
        audioRaw = entry.audio;
      } else if (entry.audio && typeof entry.audio === "object") {
        // prefer EN if object, fallback any key
        audioRaw = entry.audio.en ?? entry.audio.vi ?? Object.values(entry.audio)[0];
      }

      if (!audioRaw) return;

      totalAudioRefs += 1;

      const filename = normalizeAudioFilename(audioRaw);

      missing.push({
        roomFile: relFile,
        roomId: String(roomId),
        tier: String(tier),
        entryIndex: idx,
        entrySlug: entry.slug,
        filename,
      });
    });
  }

  // Now actually check existence (dedup filenames)
  const uniqueFiles = Array.from(new Set(missing.map(m => m.filename)));
  const existsMap = new Map<string, boolean>();

  for (const fname of uniqueFiles) {
    const p = path.join(AUDIO_DIR, fname);
    existsMap.set(fname, await fileExists(p));
  }

  const reallyMissing = missing.filter(m => !existsMap.get(m.filename));

  console.log(`Total entries: ${totalEntries}`);
  console.log(`Total audio references (from JSON): ${totalAudioRefs}`);
  console.log(`Unique audio filenames: ${uniqueFiles.length}`);
  console.log(`❌ Missing mp3 files: ${reallyMissing.length}\n`);

  if (reallyMissing.length === 0) {
    console.log("✅ All referenced audio files exist in public/audio/.\n");
    return;
  }

  // Group by room for nicer output
  const byRoom = new Map<string, MissingAudio[]>();
  for (const m of reallyMissing) {
    const key = `${m.roomId} (${m.roomFile})`;
    if (!byRoom.has(key)) byRoom.set(key, []);
    byRoom.get(key)!.push(m);
  }

  for (const [roomKey, list] of byRoom.entries()) {
    console.log(`📂 ${roomKey}`);
    console.log(`   Missing ${list.length} file(s):`);
    for (const m of list) {
      const label = m.entrySlug ?? `entry #${m.entryIndex + 1}`;
      console.log(`   • ${m.filename}  ←  ${label}`);
    }
    console.log("");
  }

  console.log("Tip: put all missing files into public/audio/ using these exact filenames.");
}

scan().catch(err => {
  console.error("Scan failed:", err);
  process.exit(1);
});
