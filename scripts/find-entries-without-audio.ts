// scripts/find-entries-without-audio.ts
// Find entries that don't have audio files
// Usage: npx tsx scripts/find-entries-without-audio.ts

import { promises as fs } from "fs";
import path from "path";

const ROOT = process.cwd();
const DATA_DIR = path.join(ROOT, "public", "data");

interface EntryWithoutAudio {
  roomId: string;
  roomTitle: string;
  entrySlug: string;
  entryIndex: number;
}

type RoomEntry = Record<string, unknown>;

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function stringOrFallback(value: unknown, fallback: string): string {
  return typeof value === "string" ? value : fallback;
}

async function findEntriesWithoutAudio(): Promise<void> {
  console.log("🔍 Finding entries without audio files...\n");

  const files = await fs.readdir(DATA_DIR);
  const jsonFiles = files.filter(f => f.endsWith(".json"));

  const entriesWithoutAudio: EntryWithoutAudio[] = [];
  let totalEntries = 0;
  let entriesWithAudio = 0;

  for (const file of jsonFiles) {
    const filePath = path.join(DATA_DIR, file);
    try {
      const content = await fs.readFile(filePath, "utf8");
      const parsed = JSON.parse(content) as unknown;
      const json = isRecord(parsed) ? parsed : {};

      // Skip non-room files
      if (!json.entries || !Array.isArray(json.entries)) continue;

      const roomId = stringOrFallback(json.id, path.basename(file, ".json"));
      const titleObject = isRecord(json.title) ? json.title : null;
      const roomTitle = titleObject?.en || json.title || roomId;
      const roomTitleText = stringOrFallback(roomTitle, roomId);

      json.entries.forEach((entry: RoomEntry, index: number) => {
        totalEntries++;

        // Check for audio field
        const hasAudio = entry.audio || entry.audio_en || entry.audioEn;

        if (hasAudio) {
          entriesWithAudio++;
        } else {
          entriesWithoutAudio.push({
            roomId,
            roomTitle: roomTitleText,
            entrySlug: stringOrFallback(entry.slug || entry.artifact_id || entry.id, `entry-${index}`),
            entryIndex: index + 1,
          });
        }
      });
    } catch {
      // Skip invalid files
    }
  }

  console.log(`Total entries: ${totalEntries}`);
  console.log(`Entries with audio: ${entriesWithAudio}`);
  console.log(`Entries WITHOUT audio: ${entriesWithoutAudio.length}\n`);

  if (entriesWithoutAudio.length > 0) {
    console.log("=== ENTRIES WITHOUT AUDIO ===\n");

    // Group by room
    const byRoom = new Map<string, EntryWithoutAudio[]>();
    for (const e of entriesWithoutAudio) {
      const list = byRoom.get(e.roomId) || [];
      list.push(e);
      byRoom.set(e.roomId, list);
    }

    for (const [roomId, entries] of byRoom) {
      const roomTitle = entries[0].roomTitle;
      console.log(`\n📁 ${roomId} (${roomTitle})`);
      for (const e of entries) {
        console.log(`   Entry #${e.entryIndex}: ${e.entrySlug}`);
      }
    }
  } else {
    console.log("✅ All entries have audio files!");
  }
}

findEntriesWithoutAudio().catch(console.error);
