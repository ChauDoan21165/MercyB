// scripts/audit-v4-safe-shield.ts
// MERCY BLADE — AUDIT v4 SAFE SHIELD EDITION
//
// Full cross-system sync audit for:
// - GitHub repo (local JSON files)
// - Supabase registry (rooms table)
// - Lovable registry.json
//
// ZERO destructive actions.
// Only SUGGESTED FIXES — you control every change.
//
// Run:
//   npx tsx scripts/audit-v4-safe-shield.ts

import fs from "fs";
import path from "path";
import { createClient } from "@supabase/supabase-js";

const ROOT = path.resolve("public/data");
const AUDIO_ROOT = path.resolve("public/audio");
const REGISTRY_PATH = path.resolve("public/registry.json");

// Load Supabase
const SUPABASE_URL =
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY =
  process.env.SUPABASE_ANON_KEY ||
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.log("⚠️ Missing Supabase credentials. Skipping DB checks.");
}

const supabase = SUPABASE_URL && SUPABASE_KEY
  ? createClient(SUPABASE_URL, SUPABASE_KEY)
  : null;

interface FixSuggestion {
  file: string;
  type: string;
  fix: string;
}

// Utility
function loadJSON(filePath: string) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch (err) {
    return null;
  }
}

async function listAudioFiles(): Promise<Set<string>> {
  const files = fs.readdirSync(AUDIO_ROOT);
  return new Set(files.map((f) => f.toLowerCase()));
}

// Main
async function auditSafeShield() {
  console.log("\n🛡️ AUDIT v4 — SAFE SHIELD EDITION");
  console.log("========================================\n");

  const audioFiles = await listAudioFiles();
  const suggestions: FixSuggestion[] = [];

  // Load registry.json
  let registry: any[] = [];
  try {
    registry = JSON.parse(fs.readFileSync(REGISTRY_PATH, "utf-8"));
  } catch {
    console.log("❌ Cannot load registry.json");
  }

  // Load all room JSON files
  const files = fs.readdirSync(ROOT).filter((f) => f.endsWith(".json"));

  console.log(`📦 Found ${files.length} room files`);
  console.log("");

  for (const file of files) {
    const fullPath = path.join(ROOT, file);
    const data = loadJSON(fullPath);

    if (!data) {
      suggestions.push({
        file,
        type: "invalid_json",
        fix: "Rewrite JSON format (safe formatting only)",
      });
      continue;
    }

    // ---- CHECK: required fields -----------------------------------
    if (!data.id) {
      suggestions.push({
        file,
        type: "missing_id",
        fix: `Add "id": "${file.replace(".json", "")}"`,
      });
    }

    if (!data.tier) {
      suggestions.push({
        file,
        type: "missing_tier",
        fix: `Add tier: "FREE / MIỄN PHÍ" or correct VIP tier`,
      });
    }

    if (!data.title?.en || !data.title?.vi) {
      suggestions.push({
        file,
        type: "missing_title",
        fix: "Add bilingual title.en and title.vi",
      });
    }

    if (!Array.isArray(data.entries)) {
      suggestions.push({
        file,
        type: "missing_entries",
        fix: "Add entries: []",
      });
      continue;
    }

    // ---- CHECK: entry structure -----------------------------------
    data.entries.forEach((entry: any, idx: number) => {
      if (!entry.slug) {
        suggestions.push({
          file,
          type: "missing_slug",
          fix: `Entry ${idx}: add slug (kebab-case)`,
        });
      }

      if (!entry.keywords_en || !entry.keywords_vi) {
        suggestions.push({
          file,
          type: "missing_keywords",
          fix: `Entry ${idx}: add keywords_en[] and keywords_vi[]`,
        });
      }

      // ---- CHECK: audio exists -----------------------------------
      const audio = entry.audio;
      if (audio && typeof audio === "string") {
        const normalized = audio.toLowerCase();
        if (!audioFiles.has(normalized)) {
          suggestions.push({
            file,
            type: "missing_audio",
            fix: `Audio file missing: ${audio}`,
          });
        }
      }
    });

    // ---- CHECK: registry.json sync --------------------------------
    const id = data.id || file.replace(".json", "");
    const inRegistry = registry.find((x: any) => x.id === id);

    if (!inRegistry) {
      suggestions.push({
        file,
        type: "registry_missing",
        fix: `Add ${id} to registry.json`,
      });
    }
  }

  // ---- CHECK: Supabase sync ----------------------------------------
  if (supabase) {
    const { data: dbRooms } = await supabase
      .from("rooms")
      .select("id, title_en, title_vi, tier");

    if (dbRooms) {
      const dbIds = new Set(dbRooms.map((r) => r.id));
      for (const file of files) {
        const id = file.replace(".json", "");
        if (!dbIds.has(id)) {
          suggestions.push({
            file,
            type: "missing_db_record",
            fix: `Insert into Supabase: rooms.id = ${id}`,
          });
        }
      }
    }
  }

  // ---- PRINT RESULTS ----------------------------------------------
  console.log("\n📊 AUDIT RESULTS");
  console.log("========================================");

  if (suggestions.length === 0) {
    console.log("🎉 No issues found. System fully synced.");
    return;
  }

  const grouped = suggestions.reduce((acc, s) => {
    if (!acc[s.type]) acc[s.type] = [];
    acc[s.type].push(s);
    return acc;
  }, {} as Record<string, FixSuggestion[]>);

  for (const [type, items] of Object.entries(grouped)) {
    console.log(`\n🔶 ${type} (${items.length})`);
    items.forEach((s) => {
      console.log(`  • [${s.file}] → ${s.fix}`);
    });
  }

  console.log("\n🛑 SAFE MODE: No changes were made.");
  console.log("You can apply fixes manually or request AUTO-APPLY mode.\n");
}

auditSafeShield();
