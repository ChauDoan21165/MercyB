// Truncates each language's lessons.ts to its types/CATEGORIES head and
// appends a lazy registry that loads per-level lessons-{level}.ts files
// on demand.
//
// Run AFTER scripts/split-lessons-by-level.mjs has emitted the
// lessons-a1.ts ... lessons-c2.ts files.

import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const REPO_ROOT = resolve(__dirname, "..");

const LANGUAGES = [
  {
    code: "chinese",
    typeName: "ChineseLesson",
    levelType: "ChineseCefrLevel",
    categoryType: "ChineseCategoryId",
    totalConst: "CHINESE_TOTAL_LESSONS",
    extraExports: [],
  },
  {
    code: "japanese",
    typeName: "JapaneseLesson",
    levelType: "JapaneseCefrLevel",
    categoryType: null, // Japanese page groups by level, not category — but
                        // category is a field. Keep getLessonsByCategory in
                        // case anyone wires it up later.
    categoryFallback: "string",
    totalConst: "JAPANESE_TOTAL_LESSONS",
    extraExports: [],
  },
  {
    code: "korean",
    typeName: "KoreanLesson",
    levelType: "KoreanCefrLevel",
    categoryType: null,
    categoryFallback: "string",
    totalConst: "KOREAN_TOTAL_LESSONS",
    extraExports: [],
  },
  {
    code: "french",
    typeName: "FrenchLesson",
    levelType: "FrenchCefrLevel",
    categoryType: "FrenchCategoryId",
    totalConst: "FRENCH_TOTAL_LESSONS",
    // French page reads getLessonsByCategory by FrenchCategoryMeta.id —
    // signature stays the same.
    extraExports: [],
  },
  {
    code: "german",
    typeName: "GermanLesson",
    levelType: "GermanCefrLevel",
    categoryType: "GermanCategoryId",
    totalConst: "GERMAN_TOTAL_LESSONS",
    extraExports: [],
  },
];

const LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"];

for (const lang of LANGUAGES) {
  const filePath = resolve(
    REPO_ROOT,
    `src/languages/${lang.code}/lessons.ts`,
  );
  const text = readFileSync(filePath, "utf8");
  const lines = text.split("\n");

  // Find the first line that begins the lessons array. Patterns observed:
  //   "export const lessons: ChineseLesson[] = ["
  //   "const GREETINGS: FrenchLesson[] = ["
  // Truncation point is the first occurrence of either.
  let cutIdx = -1;
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i];
    if (
      /^export const lessons\s*:/.test(l) ||
      /^const GREETINGS\s*:/.test(l) ||
      /^const A1_LESSONS\s*:/.test(l)
    ) {
      cutIdx = i;
      break;
    }
  }
  if (cutIdx === -1) {
    throw new Error(
      `Could not locate lesson-array start in ${filePath}. Pattern not found.`,
    );
  }

  // Trim trailing blank lines from the kept head.
  let endOfHead = cutIdx;
  while (endOfHead > 0 && lines[endOfHead - 1].trim() === "") {
    endOfHead--;
  }
  const head = lines.slice(0, endOfHead).join("\n");

  // Compute total lesson count by importing the per-level files we just
  // emitted. Done at install time so the constant is real.
  let total = 0;
  for (const level of LEVELS) {
    const lvlPath = resolve(
      REPO_ROOT,
      `src/languages/${lang.code}/lessons-${level.toLowerCase()}.ts`,
    );
    const lvlText = readFileSync(lvlPath, "utf8");
    // Crude but correct: count "id":  occurrences in the JSON-stringified
    // lesson literals our generator wrote.
    const matches = lvlText.match(/"id":/g);
    total += matches ? matches.length : 0;
  }

  const categoryParam =
    lang.categoryType ?? lang.categoryFallback ?? "string";

  const registry = `
// ── Lazy lesson registry ────────────────────────────────────────────────
// The data array used to live inline above this comment. It now lives in
// per-level lessons-{level}.ts files that are loaded on demand. The page
// imports only the level the user selects, so the initial chunk shrinks
// dramatically as more C1/C2/etc rounds ship.

const _cache = new Map<${lang.levelType}, ${lang.typeName}[]>();

const _importers: Record<
  ${lang.levelType},
  () => Promise<{ default: ${lang.typeName}[] }>
> = {
  A1: () => import("./lessons-a1"),
  A2: () => import("./lessons-a2"),
  B1: () => import("./lessons-b1"),
  B2: () => import("./lessons-b2"),
  C1: () => import("./lessons-c1"),
  C2: () => import("./lessons-c2"),
};

export async function loadLessonsForLevel(
  level: ${lang.levelType},
): Promise<${lang.typeName}[]> {
  const cached = _cache.get(level);
  if (cached) return cached;
  const mod = await _importers[level]();
  _cache.set(level, mod.default);
  return mod.default;
}

export async function loadAllLessons(): Promise<${lang.typeName}[]> {
  const levels: ${lang.levelType}[] = ["A1", "A2", "B1", "B2", "C1", "C2"];
  const arrays = await Promise.all(levels.map(loadLessonsForLevel));
  return arrays.flat();
}

// Sync helpers — operate on whatever's currently in the cache. Callers
// that need lessons must await loadLessonsForLevel / loadAllLessons first.

export function getLessonsByCategory(
  category: ${categoryParam},
): ${lang.typeName}[] {
  const out: ${lang.typeName}[] = [];
  for (const arr of _cache.values()) {
    for (const l of arr) if ((l as { category?: string }).category === category) out.push(l);
  }
  return out;
}

export function getLessonById(id: number | string): ${lang.typeName} | undefined {
  for (const arr of _cache.values()) {
    const found = arr.find((l) => (l as { id: number | string }).id === id);
    if (found) return found;
  }
  return undefined;
}

// Total lesson count across every level. Kept manually in sync with the
// per-level files; updated by scripts/install-lessons-registry.mjs at
// generation time.
export const ${lang.totalConst} = ${total};
`;

  const newText = head + "\n" + registry;
  writeFileSync(filePath, newText, "utf8");
  console.log(
    `${lang.code}: trimmed to ${endOfHead} lines, total=${total}`,
  );
}

console.log("Done.");
