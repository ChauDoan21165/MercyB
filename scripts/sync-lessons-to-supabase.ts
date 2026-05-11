/**
 * scripts/sync-lessons-to-supabase.ts
 *
 * Reads src/languages/<lang>/lessons-<level>.ts files and upserts each
 * lesson into public.lessons via the Supabase service role key.
 *
 * Flags:
 *   --dry-run          Print what would be done, skip writes
 *   --language=<lang>  Filter to one language (e.g. german)
 *   --level=<lvl>      Filter to one level (e.g. b2)
 *
 * Examples:
 *   npx tsx scripts/sync-lessons-to-supabase.ts --dry-run
 *   npx tsx scripts/sync-lessons-to-supabase.ts --language=german --level=b2
 *   npx tsx scripts/sync-lessons-to-supabase.ts
 */

import { createClient } from "@supabase/supabase-js";
import { config as loadDotenv } from "dotenv";
import { existsSync, readdirSync, statSync } from "node:fs";
import { resolve } from "node:path";

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

const args = process.argv.slice(2);
const DRY_RUN = args.includes("--dry-run");
const LANG_FILTER = args
  .find((a) => a.startsWith("--language="))
  ?.split("=")[1];
const LEVEL_FILTER = args
  .find((a) => a.startsWith("--level="))
  ?.split("=")[1];

const LANGUAGES_DIR = resolve("src/languages");

// ── Helpers ─────────────────────────────────────────────────────────────

type LessonRow = {
  language: string;
  level: string;
  lesson_index: number;
  content: unknown;
};

/**
 * Parse a lessons-<level>.ts file with the dynamic import pattern.
 * Each file has the shape:
 *   import type { XxxLesson } from "./lessons";
 *   export const lessons: XxxLesson[] = [ ... ];
 *   export default lessons;
 *
 * This function uses dynamic import() which tsx handles natively.
 */
async function loadLessonsFromFile(
  filePath: string,
): Promise<unknown[]> {
  // Dynamic import resolves the module
  const mod = await import(filePath);
  // Each file exports both `const lessons` and `default`
  const lessons: unknown[] = mod.default ?? mod.lessons;
  if (!Array.isArray(lessons)) {
    throw new Error(`${filePath}: exported value is not an array`);
  }
  return lessons;
}

function extractLevel(fileName: string): string {
  // lessons-a1.ts → a1, lessons-b2.ts → b2, lessons-c1.ts → c1
  const m = fileName.match(/^lessons-(.+)\.ts$/);
  if (!m) throw new Error(`Unexpected file name: ${fileName}`);
  return m[1]!.toLowerCase();
}

// ── Main ────────────────────────────────────────────────────────────────

async function main() {
  const languages = readdirSync(LANGUAGES_DIR).filter((entry) => {
    const p = resolve(LANGUAGES_DIR, entry);
    return statSync(p).isDirectory();
  });

  let totalInserted = 0;
  let totalUpdated = 0;
  let totalUnchanged = 0;

  for (const lang of languages) {
    if (LANG_FILTER && lang !== LANG_FILTER) continue;

    const langDir = resolve(LANGUAGES_DIR, lang);
    const files = readdirSync(langDir).filter(
      (f) => f.startsWith("lessons-") && f.endsWith(".ts") && !f.includes(".test."),
    );

    for (const file of files) {
      const level = extractLevel(file);
      if (LEVEL_FILTER && level !== LEVEL_FILTER) continue;

      const fullPath = resolve(langDir, file);
      console.log(`[load] ${lang}/${level}`);

      const lessons = await loadLessonsFromFile(fullPath);

      for (let i = 0; i < lessons.length; i++) {
        const lesson = lessons[i];
        const lessonIndex = i + 1; // 1-based within level

        if (DRY_RUN) {
          console.log(
            `  [dry-run] upsert ${lang} ${level} #${lessonIndex}`,
          );
          totalInserted++;
          continue;
        }

        const { data, error } = await supabase
          .from("lessons")
          .upsert(
            {
              language: lang,
              level,
              lesson_index: lessonIndex,
              content: lesson as Record<string, unknown>,
            },
            {
              onConflict: "language,level,lesson_index",
              ignoreDuplicates: false, // update on conflict
            },
          )
          .select("created_at, updated_at")
          .single();

        if (error) {
          console.error(
            `  [error] ${lang}/${level} #${lessonIndex}: ${error.message}`,
          );
          continue;
        }

        // Detect whether it was an insert or update by comparing timestamps
        if (
          data.created_at &&
          data.updated_at &&
          data.created_at !== data.updated_at
        ) {
          totalUpdated++;
        } else {
          totalInserted++;
        }
      }
    }
  }

  console.log(
    `\n[Done] inserted=${totalInserted} updated=${totalUpdated} unchanged=${totalUnchanged}`,
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
