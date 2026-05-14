#!/usr/bin/env node
/**
 * scripts/translate-c2-en.mjs
 *
 * Augments src/languages/german/lessons-c2.ts with _en bilingual mirror
 * fields, sourced from translations-c2-en.json. The lessons file is the
 * source of truth for the data shape; the JSON file is the source of
 * truth for the English copy.
 *
 * Modes:
 *   --extract   Write translations-c2-en.json with empty-string placeholders
 *               for every VI field that needs a mirror.
 *   --inject    Read translations-c2-en.json + lessons-c2.ts; emit a
 *               new lessons-c2.ts with _en fields inserted right after
 *               their VI siblings. The file is fully re-serialized
 *               (pretty 2-space JSON) so the entire array uses a
 *               consistent format — this is acceptable because the
 *               source file is auto-generated from JSON.
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const LESSONS_PATH = resolve("src/languages/german/lessons-c2.ts");
const TRANSLATIONS_PATH = resolve("scripts/translations-c2-en.json");

function loadLessons() {
  const src = readFileSync(LESSONS_PATH, "utf8");
  const jsCode = src
    .replace(/import type \{ GermanLesson \} from "\.\/lessons";/, "")
    .replace(/export const lessons:[^=]*=\s*/, "globalThis.__lessons = ")
    .replace(/;\s*export default[^;]*;\s*$/, ";")
    .replace(/^\s*\/\/.*$/gm, "");
  const sandbox = { globalThis: {} };
  new Function("globalThis", jsCode).call(sandbox, sandbox.globalThis);
  return sandbox.globalThis.__lessons;
}

function extract() {
  const lessons = loadLessons();
  const existing = existsSync(TRANSLATIONS_PATH)
    ? JSON.parse(readFileSync(TRANSLATIONS_PATH, "utf8"))
    : { lessons: {}, instructions: {} };

  const out = {
    lessons: existing.lessons || {},
    instructions: existing.instructions || {},
  };

  for (const lesson of lessons) {
    const id = lesson.id;
    const prev = out.lessons[id] || {};
    const entry = { ...prev };

    if (lesson.cultural_notes_vi && entry.cultural_notes_en === undefined)
      entry.cultural_notes_en = "";
    if (lesson.tip_advice_vi && entry.tip_advice_en === undefined)
      entry.tip_advice_en = "";
    if (lesson.register_notes && entry.register_notes_en === undefined)
      entry.register_notes_en = "";

    if (lesson.idiom_glosses) {
      const prevIg = entry.idiom_glosses_en || [];
      entry.idiom_glosses_en = lesson.idiom_glosses.map((_, i) => ({
        meaning_en: prevIg[i]?.meaning_en ?? "",
        example_en: prevIg[i]?.example_en ?? "",
      }));
    }

    if (lesson.sentences) {
      const prevSp = entry.sentences_pronunciation_focus_en || [];
      entry.sentences_pronunciation_focus_en = lesson.sentences.map((s, i) =>
        s.pronunciation_focus
          ? Array.from({ length: s.pronunciation_focus.length }, (_, j) =>
              prevSp[i]?.[j] ?? "",
            )
          : null,
      );
    }
    if (lesson.exercises) {
      const prevEp = entry.exercises_pronunciation_focus_en || [];
      entry.exercises_pronunciation_focus_en = lesson.exercises.map((e, i) =>
        e.pronunciation_focus && e.pronunciation_focus.length
          ? Array.from({ length: e.pronunciation_focus.length }, (_, j) =>
              prevEp[i]?.[j] ?? "",
            )
          : [],
      );
    }
    if (lesson.vocabulary) {
      const prevVp = entry.vocab_pronunciation_en || [];
      entry.vocab_pronunciation_en = lesson.vocabulary.map(
        (v, i) => prevVp[i] ?? "",
      );
    }
    out.lessons[id] = entry;

    for (const e of lesson.exercises || []) {
      if (e.instruction_vi && out.instructions[e.instruction_vi] === undefined) {
        out.instructions[e.instruction_vi] = "";
      }
    }
  }

  writeFileSync(TRANSLATIONS_PATH, JSON.stringify(out, null, 2) + "\n", "utf8");
  console.log(
    `[extract] wrote ${TRANSLATIONS_PATH} (lessons=${Object.keys(out.lessons).length}, instructions=${Object.keys(out.instructions).length})`,
  );
}

/**
 * Build an "ordered keys" version of each lesson so the JSON serialization
 * emits _en fields right after their _vi siblings (matching the schema docs
 * and the A1 pilot's PR diff style).
 */
function inject() {
  const lessons = loadLessons();
  const tr = JSON.parse(readFileSync(TRANSLATIONS_PATH, "utf8"));

  const stats = {
    cn: 0,
    ta: 0,
    rn: 0,
    pf_sent: 0,
    pf_exer: 0,
    pe: 0,
    iv: 0,
    ig_m: 0,
    ig_e: 0,
  };
  const missing = [];

  function ordered(obj, layout) {
    // layout: array of keys in the desired output order
    const out = {};
    for (const k of layout) {
      if (k in obj) out[k] = obj[k];
    }
    // Keep any keys not in layout, in their original order, at the end
    for (const k of Object.keys(obj)) {
      if (!layout.includes(k)) out[k] = obj[k];
    }
    return out;
  }

  const enrichedLessons = lessons.map((lesson) => {
    const ten = tr.lessons[lesson.id] || {};

    // ── sentences: inject pronunciation_focus_en
    const sentences = (lesson.sentences || []).map((s, i) => {
      const out = { ...s };
      const arr = ten.sentences_pronunciation_focus_en?.[i];
      if (
        s.pronunciation_focus &&
        Array.isArray(arr) &&
        arr.length === s.pronunciation_focus.length &&
        arr.every((x) => typeof x === "string" && x.length > 0)
      ) {
        out.pronunciation_focus_en = arr;
        stats.pf_sent++;
      } else if (s.pronunciation_focus) {
        missing.push(`${lesson.id} sentences[${i}].pronunciation_focus_en`);
      }
      return ordered(out, [
        "en",
        "vi",
        "pronunciation_focus",
        "pronunciation_focus_en",
      ]);
    });

    // ── vocabulary: inject pronunciation_en
    const vocabulary = (lesson.vocabulary || []).map((v, i) => {
      const out = { ...v };
      const en = ten.vocab_pronunciation_en?.[i];
      if (v.pronunciation_vi && typeof en === "string" && en.length > 0) {
        out.pronunciation_en = en;
        stats.pe++;
      } else if (v.pronunciation_vi) {
        missing.push(`${lesson.id} vocabulary[${i}].pronunciation_en`);
      }
      return ordered(out, [
        "word",
        "en",
        "vi",
        "pos",
        "gender",
        "pronunciation_vi",
        "pronunciation_en",
      ]);
    });

    // ── exercises: inject instruction_en + pronunciation_focus_en
    const exercises = (lesson.exercises || []).map((e, i) => {
      const out = { ...e };
      if (e.instruction_vi) {
        const enInstr = tr.instructions?.[e.instruction_vi];
        if (typeof enInstr === "string" && enInstr.length > 0) {
          out.instruction_en = enInstr;
          stats.iv++;
        } else {
          missing.push(`${lesson.id} exercises[${i}].instruction_en`);
        }
      }
      const arr = ten.exercises_pronunciation_focus_en?.[i];
      if (
        e.pronunciation_focus &&
        e.pronunciation_focus.length > 0 &&
        Array.isArray(arr) &&
        arr.length === e.pronunciation_focus.length &&
        arr.every((x) => typeof x === "string" && x.length > 0)
      ) {
        out.pronunciation_focus_en = arr;
        stats.pf_exer++;
      } else if (e.pronunciation_focus && e.pronunciation_focus.length > 0) {
        missing.push(`${lesson.id} exercises[${i}].pronunciation_focus_en`);
      }
      return ordered(out, [
        "type",
        "instruction_vi",
        "instruction_en",
        "pronunciation_focus",
        "pronunciation_focus_en",
        "items",
      ]);
    });

    // ── idiom_glosses: inject meaning_en + example_en
    const idiom_glosses = lesson.idiom_glosses
      ? lesson.idiom_glosses.map((g, i) => {
          const out = { ...g };
          const en = ten.idiom_glosses_en?.[i];
          if (en?.meaning_en) {
            out.meaning_en = en.meaning_en;
            stats.ig_m++;
          } else {
            missing.push(`${lesson.id} idiom_glosses[${i}].meaning_en`);
          }
          if (en?.example_en) {
            out.example_en = en.example_en;
            stats.ig_e++;
          } else {
            missing.push(`${lesson.id} idiom_glosses[${i}].example_en`);
          }
          return ordered(out, [
            "idiom",
            "literal",
            "meaning",
            "meaning_en",
            "example",
            "example_en",
          ]);
        })
      : undefined;

    // ── lesson-level fields
    const out = { ...lesson };
    out.sentences = sentences;
    if (lesson.vocabulary) out.vocabulary = vocabulary;
    if (lesson.exercises) out.exercises = exercises;
    if (lesson.idiom_glosses) out.idiom_glosses = idiom_glosses;

    if (lesson.cultural_notes_vi) {
      if (ten.cultural_notes_en) {
        out.cultural_notes_en = ten.cultural_notes_en;
        stats.cn++;
      } else {
        missing.push(`${lesson.id} cultural_notes_en`);
      }
    }
    if (lesson.tip_advice_vi) {
      if (ten.tip_advice_en) {
        out.tip_advice_en = ten.tip_advice_en;
        stats.ta++;
      } else {
        missing.push(`${lesson.id} tip_advice_en`);
      }
    }
    if (lesson.register_notes) {
      if (ten.register_notes_en) {
        out.register_notes_en = ten.register_notes_en;
        stats.rn++;
      } else {
        missing.push(`${lesson.id} register_notes_en`);
      }
    }

    // Output key order matching the schema
    return ordered(out, [
      "id",
      "level",
      "category",
      "title_vi",
      "title_en",
      "sentences",
      "cultural_notes_vi",
      "cultural_notes_en",
      "tip_advice_vi",
      "tip_advice_en",
      "vocabulary",
      "dialogue",
      "dialogue_long",
      "roleplay_prompts",
      "register_notes",
      "register_notes_en",
      "idiom_glosses",
      "exercises",
    ]);
  });

  const header =
    "// Auto-generated by scripts/split-lessons-by-level.mjs.\n" +
    "// Edit the source lesson content here directly. DO NOT regenerate\n" +
    "// from a stale lessons.ts — the registry replaced that file.\n" +
    "//\n" +
    "// Bilingual _en mirrors authored via scripts/translate-c2-en.mjs.\n\n" +
    'import type { GermanLesson } from "./lessons";\n\n';

  const body =
    "export const lessons: GermanLesson[] = " +
    JSON.stringify(enrichedLessons, null, 2) +
    ";\n";

  writeFileSync(LESSONS_PATH, header + body, "utf8");
  console.log("[inject] done. stats:", JSON.stringify(stats));
  if (missing.length) {
    console.log(`[inject] missing translations: ${missing.length}`);
    console.log(missing.slice(0, 20).map((m) => "  - " + m).join("\n"));
    if (missing.length > 20) console.log(`  ... and ${missing.length - 20} more`);
  }
}

const args = process.argv.slice(2);
if (args.includes("--extract")) {
  extract();
} else if (args.includes("--inject")) {
  inject();
} else {
  console.error("Usage: node scripts/translate-c2-en.mjs --extract|--inject");
  process.exit(1);
}
