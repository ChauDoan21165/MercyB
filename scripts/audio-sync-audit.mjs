// scripts/audio-sync-audit.mjs
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const WEBHOOK_URL = process.env.AUDIO_AUDIT_WEBHOOK_URL || null;
const DELETE_ORPHANS = process.argv.includes("--delete-orphans");

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const AUDIO_DIR = path.join(__dirname, "..", "public", "audio");
const MANIFEST_PATH = path.join(AUDIO_DIR, "manifest.json");

function normalizeAudioName(name) {
  if (!name) return "";
  return name.trim().split("/").pop().toLowerCase();
}

function extractAudioFromEntry(entry) {
  const en = [];
  const vi = [];
  if (!entry) return { en, vi };

  const pushIfMp3 = (val, target) => {
    if (typeof val === "string") {
      const n = normalizeAudioName(val);
      if (n.endsWith(".mp3")) target.push(n);
    }
  };

  if (entry.audio) {
    if (typeof entry.audio === "string") {
      pushIfMp3(entry.audio, en);
    } else if (typeof entry.audio === "object") {
      pushIfMp3(entry.audio.en, en);
      pushIfMp3(entry.audio.vi, vi);
    }
  }

  pushIfMp3(entry.audio_en, en);
  pushIfMp3(entry.audio_vi, vi);

  return { en, vi };
}

async function main() {
  console.log("🔍 Audio sync audit starting...");

  // 1) Load manifest
  if (!fs.existsSync(MANIFEST_PATH)) {
    console.error("manifest.json not found at:", MANIFEST_PATH);
    process.exit(1);
  }

  const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf8"));
  const manifestFiles = Array.isArray(manifest.files) ? manifest.files : [];

  // Map bare filename -> full relative path (for deletion)
  const fullPathByBase = new Map();
  for (const rel of manifestFiles) {
    const base = path.basename(rel).toLowerCase();
    if (!fullPathByBase.has(base)) {
      fullPathByBase.set(base, rel);
    }
  }

  const storageNames = manifestFiles
    .map((rel) => normalizeAudioName(rel))
    .filter((n) => n.endsWith(".mp3"));
  const storageSet = new Set(storageNames);

  console.log(`📦 Storage (manifest) files: ${storageSet.size}`);

  // 2) Load rooms from Supabase
  const { data: rooms, error } = await supabase
    .from("rooms")
    .select("id, title_en, title_vi, tier, entries");

  if (error) {
    console.error("Error fetching rooms:", error.message);
    process.exit(1);
  }

  console.log(`🧱 Rooms in DB: ${rooms.length}`);

  const referencedSet = new Set();
  const roomStats = [];

  for (const room of rooms) {
    const entries = Array.isArray(room.entries) ? room.entries : [];
    const allEn = [];
    const allVi = [];

    for (const entry of entries) {
      const { en, vi } = extractAudioFromEntry(entry);
      allEn.push(...en);
      allVi.push(...vi);
    }

    const uniqueEn = Array.from(new Set(allEn));
    const uniqueVi = Array.from(new Set(allVi));

    uniqueEn.forEach((f) => referencedSet.add(f));
    uniqueVi.forEach((f) => referencedSet.add(f));

    const missingEn = uniqueEn.filter((f) => !storageSet.has(f));
    const missingVi = uniqueVi.filter((f) => !storageSet.has(f));

    roomStats.push({
      room_id: room.id,
      missing_en: missingEn.length,
      missing_vi: missingVi.length,
      orphan_count: 0, // per-room orphan is optional; global orphans handled below
    });
  }

  // 3) Global orphans: files in manifest but never referenced
  const orphans = [...storageSet].filter((f) => !referencedSet.has(f));
  console.log(`❗ Orphan files (in repo but not used): ${orphans.length}`);

  // 4) Upsert per-room tags
  if (roomStats.length) {
    const { error: upsertError } = await supabase
      .from("audio_audit_room")
      .upsert(
        roomStats.map((r) => ({
          ...r,
          last_checked: new Date().toISOString(),
        })),
        { onConflict: "room_id" }
      );

    if (upsertError) {
      console.error("Error upserting audio_audit_room:", upsertError.message);
    } else {
      console.log("✅ Updated audio_audit_room tags");
    }
  }

  const totalMissingEn = roomStats.reduce((s, r) => s + r.missing_en, 0);
  const totalMissingVi = roomStats.reduce((s, r) => s + r.missing_vi, 0);

  // 5) Optional: delete orphans from repo
  if (DELETE_ORPHANS && orphans.length) {
    console.log("🧹 Deleting orphan audio files from public/audio ...");
    for (const base of orphans) {
      const rel = fullPathByBase.get(base);
      if (!rel) continue;
      const full = path.join(AUDIO_DIR, rel);
      if (fs.existsSync(full)) {
        console.log("  - remove", rel);
        fs.rmSync(full);
      }
    }
  }

  // 6) Optional: send webhook notification
  if (WEBHOOK_URL) {
    const text = `
Mercy Blade audio audit finished:
- Rooms: ${rooms.length}
- Missing EN: ${totalMissingEn}
- Missing VI: ${totalMissingVi}
- Orphan files: ${orphans.length}
${DELETE_ORPHANS ? "- Orphans have been removed from repo." : ""}
`.trim();

    try {
      await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      console.log("📣 Sent webhook notification");
    } catch (e) {
      console.error("Failed to send webhook:", e.message || e);
    }
  }

  console.log("✅ Audio sync audit complete.");
}

main().catch((e) => {
  console.error("Fatal error:", e);
  process.exit(1);
});
