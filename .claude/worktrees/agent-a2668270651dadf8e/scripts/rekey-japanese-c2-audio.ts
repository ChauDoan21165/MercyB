/**
 * scripts/rekey-japanese-c2-audio.ts
 *
 * One-shot Supabase Storage re-key for Japanese C2 lesson audio, paired
 * with the C2 lesson-id renumber (102–121 → 132–151, +30) that fixes the
 * C1/C2 id collision. Mirrors scripts/rekey-korean-c2-audio.ts (#528).
 *
 * WHY THIS EXISTS
 * ---------------
 * `lessonAudioBase(lang, id, level)` derives the storage path as
 * `${level}/${lang}/l${id}` with NO id→slug remap layer for numeric ids.
 * Japanese C2 audio is already live in the public `room-audio` bucket
 * under `c2/ja/l102 … c2/ja/l121`. After the renumber the app asks for
 * `c2/ja/l132 … c2/ja/l151`, so without this move every C2 lesson goes
 * silent (404 → silent local fallback, no crash). This script moves each
 * object `c2/ja/l{n}/*` → `c2/ja/l{n+30}/*` for n ∈ 102..121.
 *
 * Lesson ROWS need no fix: sync-lessons-to-supabase.ts upserts on
 * (language, level, lesson_index) — position, not the lesson id — so the
 * auto-sync cleanly UPDATEs the 20 C2 rows in place. Storage is the only
 * thing keyed on the id.
 *
 * SAFETY
 * ------
 *   - DEFAULT IS DRY-RUN. Nothing moves unless you pass --apply.
 *   - Idempotent: re-runnable. A source folder that's already empty is
 *     skipped; a destination object that already exists is skipped (so a
 *     half-finished run can be safely resumed).
 *   - `storage.move` is a server-side rename (no re-upload, no data loss
 *     window); it fails loudly per-object and the script reports failures.
 *
 * Flags:
 *   --apply     Actually perform the moves (without it: dry-run preview)
 *
 * Usage:
 *   npx tsx scripts/rekey-japanese-c2-audio.ts            # preview
 *   npx tsx scripts/rekey-japanese-c2-audio.ts --apply    # execute
 *
 * Requires SUPABASE_SERVICE_ROLE_KEY (Storage move needs service role).
 */

import { createClient } from "@supabase/supabase-js";
import { config as loadDotenv } from "dotenv";
import { existsSync } from "node:fs";

// ── Env ─────────────────────────────────────────────────────────────────

for (const p of [".env.local", ".env"]) {
  if (existsSync(p)) loadDotenv({ path: p });
}

const SUPA_URL = process.env.VITE_SUPABASE_URL;
const SUPA_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPA_URL) {
  console.error("VITE_SUPABASE_URL is not set in .env or .env.local");
  process.exit(1);
}
if (!SUPA_KEY) {
  console.error("SUPABASE_SERVICE_ROLE_KEY is not set in .env or .env.local");
  process.exit(1);
}

const supabase = createClient(SUPA_URL, SUPA_KEY, {
  auth: { persistSession: false },
});

// ── Args ────────────────────────────────────────────────────────────────

const APPLY = process.argv.slice(2).includes("--apply");

// ── Constants ───────────────────────────────────────────────────────────

const BUCKET = "room-audio";
const OFFSET = 30; // 102→132 … 121→151 — must match the lessons-c2.ts renumber
const OLD_IDS = Array.from({ length: 20 }, (_, i) => 102 + i); // 102..121

// ── Helpers ─────────────────────────────────────────────────────────────

/** List the file objects directly under `c2/ja/l{id}/`. */
async function listLessonFiles(id: number): Promise<string[]> {
  const prefix = `c2/ja/l${id}`;
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .list(prefix, { limit: 1000 });
  if (error) {
    throw new Error(`list ${prefix}: ${error.message}`);
  }
  // Storage .list returns folder placeholders with id === null; keep real files.
  return (data ?? [])
    .filter((o) => o.id !== null && o.name && !o.name.endsWith("/"))
    .map((o) => o.name);
}

// ── Main ────────────────────────────────────────────────────────────────

async function main() {
  console.log(
    `[rekey-japanese-c2-audio] bucket=${BUCKET} mode=${APPLY ? "APPLY" : "DRY-RUN"}`,
  );

  let moved = 0;
  let skippedExisting = 0;
  let skippedEmpty = 0;
  let failed = 0;

  for (const oldId of OLD_IDS) {
    const newId = oldId + OFFSET;
    const srcFiles = await listLessonFiles(oldId);

    if (srcFiles.length === 0) {
      // Either never had audio or already moved on a previous run.
      console.log(`  l${oldId} → l${newId}: source empty — skip`);
      skippedEmpty++;
      continue;
    }

    // Pre-list destination so a resumed run skips already-moved files.
    const destExisting = new Set(await listLessonFiles(newId));

    for (const name of srcFiles) {
      const from = `c2/ja/l${oldId}/${name}`;
      const to = `c2/ja/l${newId}/${name}`;

      if (destExisting.has(name)) {
        console.log(`    skip (dest exists): ${to}`);
        skippedExisting++;
        continue;
      }

      if (!APPLY) {
        console.log(`    [dry-run] move ${from} → ${to}`);
        moved++;
        continue;
      }

      const { error } = await supabase.storage
        .from(BUCKET)
        .move(from, to);
      if (error) {
        console.error(`    [FAIL] ${from} → ${to}: ${error.message}`);
        failed++;
      } else {
        console.log(`    moved ${from} → ${to}`);
        moved++;
      }
    }
  }

  console.log(
    `\n[Done] ${APPLY ? "moved" : "would move"}=${moved} ` +
      `skipped(dest-exists)=${skippedExisting} skipped(empty)=${skippedEmpty} failed=${failed}`,
  );
  if (!APPLY) {
    console.log("Dry-run only. Re-run with --apply to execute the moves.");
  }
  if (failed > 0) process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
