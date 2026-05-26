// scripts/room-health-json.ts
// JSON-AS-SOURCE Room Health Auditor
//
// Usage: npx tsx scripts/room-health-json.ts

import fs from "node:fs";
import path from "node:path";

type EntryAudio = string | { en?: string; vi?: string };

type RoomJson = {
  id?: string;
  tier?: string;
  domain?: string;
  title?: any;
  entries?: Array<{
    slug?: string;
    audio?: EntryAudio;
    keywords_en?: string[];
    keywords_vi?: string[];
  }>;
};

type RoomHealthIssueType =
  | "missing_json"
  | "invalid_json"
  | "no_entries"
  | "entry_missing_audio"
  | "audio_file_missing"
  | "missing_keywords_en"
  | "missing_keywords_vi";

type RoomHealthIssue = {
  type: RoomHealthIssueType;
  message: string;
  entryIndex?: number;
  audioPath?: string;
};

type RoomHealthRoom = {
  slug: string;
  jsonPath: string | null;
  validJson: boolean;
  entryCount: number;
  issues: RoomHealthIssue[];
  healthScore: number;
};

type RoomHealthReport = {
  generatedAt: string;
  rooms: RoomHealthRoom[];
  summary: {
    totalRooms: number;
    missingJson: number;
    invalidJson: number;
    missingEntries: number;
    roomsWithNoAudio: number;
    roomsWithMissingAudioFiles: number;
  };
};

// CONFIG – adjust for your repo
const PUBLIC_DIR = path.resolve(process.cwd(), "public");
const DATA_DIR = path.join(PUBLIC_DIR, "data");

// If you have a registry JSON of all slugs, plug it here.
// For now we derive from filenames only.
function discoverSlugsFromDataDir(): string[] {
  if (!fs.existsSync(DATA_DIR)) return [];
  const files = fs.readdirSync(DATA_DIR);
  return files
    .filter((f) => f.endsWith(".json"))
    .map((f) => path.basename(f, ".json"));
}

// Extract a single audio path as string
function getAudioPath(audio: EntryAudio | undefined): string | null {
  if (!audio) return null;
  if (typeof audio === "string") return audio;
  return audio.en || audio.vi || null;
}

// Very simple health scoring
function computeHealthScore(room: RoomHealthRoom): number {
  if (room.jsonPath === null) return 20; // missing json
  if (!room.validJson) return 30;
  if (room.entryCount === 0) return 40;

  const hasMissingAudio = room.issues.some(
    (i) => i.type === "entry_missing_audio" || i.type === "audio_file_missing",
  );

  if (!hasMissingAudio && room.issues.length === 0) return 100;
  if (!hasMissingAudio && room.issues.length > 0) return 90;

  // Some audio problems
  const missingAudioCount = room.issues.filter(
    (i) =>
      i.type === "entry_missing_audio" || i.type === "audio_file_missing",
  ).length;

  if (missingAudioCount <= 2) return 80;
  if (missingAudioCount <= 5) return 70;
  return 50;
}

// Check if audio file exists in public/audio or public/audios
function resolveAudioPath(audioPath: string): string | null {
  const normalized = audioPath.replace(/^\/+/, "");
  const candidates = [
    path.join(PUBLIC_DIR, normalized),
    path.join(PUBLIC_DIR, "audio", normalized),
    path.join(PUBLIC_DIR, "audios", normalized),
  ];
  for (const c of candidates) {
    if (fs.existsSync(c)) return c;
  }
  return null;
}

async function main() {
  console.log("🔍 JSON-AS-SOURCE ROOM HEALTH CHECK\n");

  if (!fs.existsSync(PUBLIC_DIR)) {
    console.error(`❌ public/ directory not found at ${PUBLIC_DIR}`);
    process.exit(1);
  }

  if (!fs.existsSync(DATA_DIR)) {
    console.error(`❌ public/data/ directory not found at ${DATA_DIR}`);
    process.exit(1);
  }

  // Discover all slugs just from JSON for now.
  // Later you can merge with DB registry if you want.
  const slugs = discoverSlugsFromDataDir();
  if (slugs.length === 0) {
    console.warn("⚠️ No JSON files found in public/data/");
  }

  const rooms: RoomHealthRoom[] = [];

  for (const slug of slugs) {
    const jsonPath = path.join(DATA_DIR, `${slug}.json`);
    const room: RoomHealthRoom = {
      slug,
      jsonPath: fs.existsSync(jsonPath) ? jsonPath : null,
      validJson: false,
      entryCount: 0,
      issues: [],
      healthScore: 0,
    };

    if (!room.jsonPath) {
      room.issues.push({
        type: "missing_json",
        message: `JSON file not found for slug ${slug}`,
      });
      room.healthScore = computeHealthScore(room);
      rooms.push(room);
      continue;
    }

    let raw: string;
    let data: RoomJson | null = null;

    try {
      raw = fs.readFileSync(room.jsonPath, "utf8");
      data = JSON.parse(raw);
      room.validJson = true;
    } catch (err: any) {
      room.issues.push({
        type: "invalid_json",
        message: `Invalid JSON: ${err?.message || "Unknown parse error"}`,
      });
      room.healthScore = computeHealthScore(room);
      rooms.push(room);
      continue;
    }

    const entries = Array.isArray(data.entries) ? data.entries : [];
    room.entryCount = entries.length;

    if (entries.length === 0) {
      room.issues.push({
        type: "no_entries",
        message: "Room has no entries[] in JSON",
      });
    }

    // Check each entry
    entries.forEach((entry, idx) => {
      // Keywords
      if (!entry.keywords_en || entry.keywords_en.length === 0) {
        room.issues.push({
          type: "missing_keywords_en",
          message: `Entry ${idx} missing keywords_en`,
          entryIndex: idx,
        });
      }
      if (!entry.keywords_vi || entry.keywords_vi.length === 0) {
        room.issues.push({
          type: "missing_keywords_vi",
          message: `Entry ${idx} missing keywords_vi`,
          entryIndex: idx,
        });
      }

      // Audio
      const audioPath = getAudioPath(entry.audio);
      if (!audioPath) {
        room.issues.push({
          type: "entry_missing_audio",
          message: `Entry ${idx} has no audio field`,
          entryIndex: idx,
        });
        return;
      }

      const resolved = resolveAudioPath(audioPath);
      if (!resolved) {
        room.issues.push({
          type: "audio_file_missing",
          message: `Audio file not found for entry ${idx}`,
          entryIndex: idx,
          audioPath,
        });
      }
    });

    room.healthScore = computeHealthScore(room);
    rooms.push(room);
  }

  const report: RoomHealthReport = {
    generatedAt: new Date().toISOString(),
    rooms,
    summary: {
      totalRooms: rooms.length,
      missingJson: rooms.filter((r) =>
        r.issues.some((i) => i.type === "missing_json")
      ).length,
      invalidJson: rooms.filter((r) =>
        r.issues.some((i) => i.type === "invalid_json")
      ).length,
      missingEntries: rooms.filter((r) =>
        r.issues.some((i) => i.type === "no_entries")
      ).length,
      roomsWithNoAudio: rooms.filter(
        (r) =>
          r.entryCount > 0 &&
          !r.issues.some(
            (i) =>
              i.type === "entry_missing_audio" ||
              i.type === "audio_file_missing",
          ),
      ).length,
      roomsWithMissingAudioFiles: rooms.filter((r) =>
        r.issues.some((i) => i.type === "audio_file_missing")
      ).length,
    },
  };

  const outPath = path.resolve(process.cwd(), "room-health-report.json");
  fs.writeFileSync(outPath, JSON.stringify(report, null, 2), "utf8");

  console.log(`✅ Room health report written to ${outPath}`);
  console.log(
    `   Rooms: ${report.summary.totalRooms}, Missing JSON: ${report.summary.missingJson}, Invalid JSON: ${report.summary.invalidJson}`,
  );
}

main().catch((err) => {
  console.error("❌ Room health check failed:", err);
  process.exit(1);
});
