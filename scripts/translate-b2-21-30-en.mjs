#!/usr/bin/env node
// Surgical injection of _en mirror fields into lessons 21-30 of lessons-b2.ts.
// Translations live in scripts/translations-b2-21-30-en.json.
//
// This script does NOT JSON.parse / JSON.stringify the whole array (that would
// normalize trailing-comma style of unrelated lessons). Instead it walks each
// lesson in scope as a balanced {...} block and rebuilds it from its current
// keys + the _en siblings, preserving 2-space indent + lesson-style trailing commas.

import fs from "node:fs";

const FILE = "src/languages/german/lessons-b2.ts";
const JSON_FILE = "scripts/translations-b2-21-30-en.json";

const translations = JSON.parse(fs.readFileSync(JSON_FILE, "utf8"));
const TARGET_IDS = Object.keys(translations);

// Find balanced range [start, end) of `{...}` starting at `from` (must be at `{`).
function balancedRange(text, from) {
  if (text[from] !== "{") throw new Error(`expected '{' at ${from}`);
  let depth = 0, inStr = false, esc = false;
  for (let i = from; i < text.length; i++) {
    const c = text[i];
    if (inStr) {
      if (esc) esc = false;
      else if (c === "\\") esc = true;
      else if (c === '"') inStr = false;
    } else if (c === '"') inStr = true;
    else if (c === "{") depth++;
    else if (c === "}") {
      depth--;
      if (depth === 0) return [from, i + 1];
    }
  }
  throw new Error(`no balanced close from ${from}`);
}

// Same for [...]
function balancedRangeBracket(text, from) {
  if (text[from] !== "[") throw new Error(`expected '[' at ${from}`);
  let depth = 0, inStr = false, esc = false;
  for (let i = from; i < text.length; i++) {
    const c = text[i];
    if (inStr) {
      if (esc) esc = false;
      else if (c === "\\") esc = true;
      else if (c === '"') inStr = false;
    } else if (c === '"') inStr = true;
    else if (c === "[") depth++;
    else if (c === "]") {
      depth--;
      if (depth === 0) return [from, i + 1];
    }
  }
  throw new Error(`no balanced close from ${from}`);
}

// JSON-encode a string with embedded \n preserved as `\n` escape; doublequotes escaped.
function jsonString(s) {
  return JSON.stringify(s);
}

// Render an inline JSON value at a given indent, matching the file's style:
// strings → "..."
// arrays of strings → multi-line with one element per line at indent+2
function renderArrayOfStrings(arr, indent) {
  if (arr.length === 0) return "[]";
  const ind = " ".repeat(indent);
  const inner = " ".repeat(indent + 2);
  return "[\n" + arr.map((s) => inner + jsonString(s)).join(",\n") + "\n" + ind + "]";
}

let text = fs.readFileSync(FILE, "utf8");
let totalInjected = 0;

function findLessonStart(id) {
  const needle = `"id": "${id}"`;
  const idIdx = text.indexOf(needle);
  if (idIdx === -1) throw new Error(`lesson id not found: ${id}`);
  // walk back to the `{` that opens this lesson object
  let i = idIdx;
  while (i > 0 && text[i] !== "{") i--;
  return i;
}

// Insert `addition` text immediately after the end of the value of a specified key
// inside `objStart..objEnd` lesson range. `keyName` finds `"keyName":` at the
// current indent. `addition` should NOT include a leading newline; it should be
// the rendered line(s) including the trailing comma if the original line had one.
function insertAfterKey(objStart, objEnd, keyName, addition) {
  const range = text.slice(objStart, objEnd);
  // Match `    "keyName": ...,?\n` — capture full line + comma if present
  // The key starts at indent 4 (lesson-level: "    "key":") or 6 (sentence-level: "      "key":")
  // We rely on a unique match within the lesson range.
  const re = new RegExp(`(    "${keyName}": )`, "g");
  const m = re.exec(range);
  if (!m) return false;
  // Find the end of the value: walk a quote-aware scanner from the colon onward
  const start = m.index + m[0].length;
  const absStart = objStart + start;
  let i = absStart;
  // value starts with `"` (string) — string-end scan
  if (text[i] === '"') {
    let inStr = true, esc = false;
    i++;
    while (i < text.length && inStr) {
      const c = text[i];
      if (esc) esc = false;
      else if (c === "\\") esc = true;
      else if (c === '"') inStr = false;
      i++;
    }
  } else if (text[i] === "[") {
    [, i] = balancedRangeBracket(text, i);
  } else if (text[i] === "{") {
    [, i] = balancedRange(text, i);
  } else {
    return false;
  }
  // Optional trailing comma
  let hasComma = false;
  if (text[i] === ",") { hasComma = true; i++; }
  // Newline
  if (text[i] !== "\n") return false;
  // Insertion point is just after the newline
  const insertAt = i + 1;
  // Build the new line preserving comma style: insertion already begins at indent 4
  // If the original key had a trailing comma, our new key also needs trailing comma logic.
  // For simplicity we use the SAME comma style as the original line (with comma if hasComma).
  // (The caller passes `addition` WITHOUT a trailing newline; we add it here.)
  let finalLine = "    " + addition;
  finalLine += hasComma ? ",\n" : "\n";
  // Also: if original had no comma, we must add a comma to original (since we're
  // inserting a key after it inside the object). The simpler invariant:
  // ensure the original line ends with `,` if our new line follows.
  let before = text.slice(0, i);
  if (!hasComma) {
    before += ",";
  }
  before += "\n";
  text = before + finalLine + text.slice(insertAt);
  return true;
}

// Insert an _en sibling array AFTER a specific _vi array inside a sentence/exercise object.
// Used for pronunciation_focus_en. We find the Nth occurrence of `"pronunciation_focus":`
// inside the lesson object and insert after its array.
function insertSiblingArrayAfterNthOccurrence(objStart, objEnd, siblingKey, newKey, valuesByOccurrence) {
  // valuesByOccurrence: array of arrays (each is the new array contents) — one entry per occurrence in source
  let cursor = objStart;
  let occurrenceIdx = 0;
  while (true) {
    const idx = text.indexOf(`"${siblingKey}":`, cursor);
    if (idx === -1 || idx >= objEnd) break;
    // Find the `[` after the key
    let i = idx + siblingKey.length + 3; // past `":`
    while (text[i] === " ") i++;
    if (text[i] !== "[") {
      // not an array — skip
      cursor = idx + 1;
      continue;
    }
    const [, arrEnd] = balancedRangeBracket(text, i);
    let after = arrEnd;
    let hasComma = false;
    if (text[after] === ",") { hasComma = true; after++; }
    if (text[after] !== "\n") {
      cursor = arrEnd;
      continue;
    }
    const insertAt = after + 1;
    // Determine indent of original line containing the key — count spaces before `"`
    let lineStart = idx;
    while (lineStart > 0 && text[lineStart - 1] !== "\n") lineStart--;
    const indent = idx - lineStart; // number of spaces
    const ind = " ".repeat(indent);
    const valArr = valuesByOccurrence[occurrenceIdx];
    if (valArr !== undefined && valArr !== null) {
      const rendered = renderArrayOfStrings(valArr, indent);
      let finalLine = ind + `"${newKey}": ` + rendered;
      finalLine += hasComma ? ",\n" : "\n";
      // Ensure the previous line ends with `,`
      let before = text.slice(0, after);
      if (!hasComma) {
        // last char of "before" is `]` ; we need to insert `,` after it
        before += ",";
      }
      before += "\n";
      text = before + finalLine + text.slice(insertAt);
      // Update objEnd because we inserted text. Caller's objEnd is no longer valid;
      // but since we process keys in order this is fine if we update via length delta.
      const delta = (finalLine.length + (hasComma ? 0 : 1)) - (insertAt - after);
      objEnd += delta;
    }
    cursor = arrEnd + 1; // advance past current occurrence
    occurrenceIdx++;
  }
  return objEnd;
}

// Insert a `pronunciation_en` key after a `pronunciation_vi` key within each vocab item.
function insertVocabPronunciationEn(objStart, objEnd, pronunciationEnByIdx) {
  let cursor = objStart;
  let occurrenceIdx = 0;
  while (true) {
    const idx = text.indexOf(`"pronunciation_vi":`, cursor);
    if (idx === -1 || idx >= objEnd) break;
    // Find end of value string
    let i = idx + `"pronunciation_vi":`.length;
    while (text[i] === " ") i++;
    if (text[i] !== '"') { cursor = idx + 1; continue; }
    // String scan
    let inStr = true, esc = false; i++;
    while (i < text.length && inStr) {
      const c = text[i];
      if (esc) esc = false;
      else if (c === "\\") esc = true;
      else if (c === '"') inStr = false;
      i++;
    }
    let after = i;
    let hasComma = false;
    if (text[after] === ",") { hasComma = true; after++; }
    if (text[after] !== "\n") { cursor = i; continue; }
    const insertAt = after + 1;

    let lineStart = idx;
    while (lineStart > 0 && text[lineStart - 1] !== "\n") lineStart--;
    const indent = idx - lineStart;
    const ind = " ".repeat(indent);

    const pronEn = pronunciationEnByIdx[occurrenceIdx];
    if (pronEn !== undefined && pronEn !== null) {
      let finalLine = ind + `"pronunciation_en": ${jsonString(pronEn)}`;
      finalLine += hasComma ? ",\n" : "\n";
      let before = text.slice(0, after);
      if (!hasComma) before += ",";
      before += "\n";
      text = before + finalLine + text.slice(insertAt);
      const delta = (finalLine.length + (hasComma ? 0 : 1)) - (insertAt - after);
      objEnd += delta;
    }
    cursor = i + 1;
    occurrenceIdx++;
  }
  return objEnd;
}

// Insert `instruction_en` after `instruction_vi` for each exercise.
function insertExerciseInstructionEn(objStart, objEnd, instructionEnByIdx) {
  let cursor = objStart;
  let occurrenceIdx = 0;
  while (true) {
    const idx = text.indexOf(`"instruction_vi":`, cursor);
    if (idx === -1 || idx >= objEnd) break;
    let i = idx + `"instruction_vi":`.length;
    while (text[i] === " ") i++;
    if (text[i] !== '"') { cursor = idx + 1; continue; }
    let inStr = true, esc = false; i++;
    while (i < text.length && inStr) {
      const c = text[i];
      if (esc) esc = false;
      else if (c === "\\") esc = true;
      else if (c === '"') inStr = false;
      i++;
    }
    let after = i;
    let hasComma = false;
    if (text[after] === ",") { hasComma = true; after++; }
    if (text[after] !== "\n") { cursor = i; continue; }
    const insertAt = after + 1;
    let lineStart = idx;
    while (lineStart > 0 && text[lineStart - 1] !== "\n") lineStart--;
    const indent = idx - lineStart;
    const ind = " ".repeat(indent);

    const value = instructionEnByIdx[occurrenceIdx];
    if (value !== undefined && value !== null) {
      let finalLine = ind + `"instruction_en": ${jsonString(value)}`;
      finalLine += hasComma ? ",\n" : "\n";
      let before = text.slice(0, after);
      if (!hasComma) before += ",";
      before += "\n";
      text = before + finalLine + text.slice(insertAt);
      const delta = (finalLine.length + (hasComma ? 0 : 1)) - (insertAt - after);
      objEnd += delta;
    }
    cursor = i + 1;
    occurrenceIdx++;
  }
  return objEnd;
}

// Insert `meaning_en` after `meaning` for each idiom gloss.
function insertIdiomMeaningEn(objStart, objEnd, meaningEnByIdx) {
  let cursor = objStart;
  let occurrenceIdx = 0;
  while (true) {
    const idx = text.indexOf(`"meaning":`, cursor);
    if (idx === -1 || idx >= objEnd) break;
    let i = idx + `"meaning":`.length;
    while (text[i] === " ") i++;
    if (text[i] !== '"') { cursor = idx + 1; continue; }
    let inStr = true, esc = false; i++;
    while (i < text.length && inStr) {
      const c = text[i];
      if (esc) esc = false;
      else if (c === "\\") esc = true;
      else if (c === '"') inStr = false;
      i++;
    }
    let after = i;
    let hasComma = false;
    if (text[after] === ",") { hasComma = true; after++; }
    if (text[after] !== "\n") { cursor = i; continue; }
    const insertAt = after + 1;
    let lineStart = idx;
    while (lineStart > 0 && text[lineStart - 1] !== "\n") lineStart--;
    const indent = idx - lineStart;
    const ind = " ".repeat(indent);
    const value = meaningEnByIdx[occurrenceIdx];
    if (value !== undefined && value !== null) {
      let finalLine = ind + `"meaning_en": ${jsonString(value)}`;
      finalLine += hasComma ? ",\n" : "\n";
      let before = text.slice(0, after);
      if (!hasComma) before += ",";
      before += "\n";
      text = before + finalLine + text.slice(insertAt);
      const delta = (finalLine.length + (hasComma ? 0 : 1)) - (insertAt - after);
      objEnd += delta;
    }
    cursor = i + 1;
    occurrenceIdx++;
  }
  return objEnd;
}

// Insert a lesson-level _en sibling AFTER a specific _vi key inside an object.
function insertLessonLevelEn(objStart, objEnd, viKey, enKey, enValue) {
  const idx = text.indexOf(`    "${viKey}":`, objStart);
  if (idx === -1 || idx >= objEnd) return objEnd;
  let i = idx + `    "${viKey}":`.length;
  while (text[i] === " ") i++;
  // value can be string or other; assume string for lesson-level fields
  if (text[i] !== '"') return objEnd;
  let inStr = true, esc = false; i++;
  while (i < text.length && inStr) {
    const c = text[i];
    if (esc) esc = false;
    else if (c === "\\") esc = true;
    else if (c === '"') inStr = false;
    i++;
  }
  let after = i;
  let hasComma = false;
  if (text[after] === ",") { hasComma = true; after++; }
  if (text[after] !== "\n") return objEnd;
  const insertAt = after + 1;
  let finalLine = `    "${enKey}": ${jsonString(enValue)}`;
  finalLine += hasComma ? ",\n" : "\n";
  let before = text.slice(0, after);
  if (!hasComma) before += ",";
  before += "\n";
  text = before + finalLine + text.slice(insertAt);
  const delta = (finalLine.length + (hasComma ? 0 : 1)) - (insertAt - after);
  return objEnd + delta;
}

// Process each target lesson
for (const lessonId of TARGET_IDS) {
  const t = translations[lessonId];
  let objStart = findLessonStart(lessonId);
  let [, objEnd] = balancedRange(text, objStart);

  // 1) sentences[i].pronunciation_focus_en — collect per sentence
  // The sentences array is the first occurrence of `"pronunciation_focus":` inside this lesson.
  // We pass arrays of strings (or null to skip).
  if (Array.isArray(t.sentences)) {
    // sentence pronunciation_focus_en list
    const sentenceArrays = t.sentences.map((s) => s?.pronunciation_focus_en ?? null);
    objEnd = insertSiblingArrayAfterNthOccurrence(
      objStart,
      objEnd,
      "pronunciation_focus",
      "pronunciation_focus_en",
      sentenceArrays,
    );
    // After we inserted N _en arrays, the lesson is grown. The next call below
    // wants exercise pronunciation_focus_en — those occurrences appear LATER in the lesson
    // but the prior insertion offsets are accounted for via the updated `objEnd` (we
    // can't naïvely reuse `pronunciation_focus` because we already inserted
    // `pronunciation_focus_en` siblings — but indexOf will skip over the new keys
    // because they have a different name). Good.
  }
  // Exercises' pronunciation_focus_en — same mechanism but appended sequentially with
  // sentence ones; since insertSiblingArrayAfterNthOccurrence walks ALL "pronunciation_focus":
  // occurrences in order, we already passed sentence values for indices 0..(N-1).
  // For exercises, we need to extend the values array.
  if (Array.isArray(t.exercises)) {
    // Re-scan: collect all occurrences AGAIN starting fresh, this time pass full
    // values array (sentence + exercise) using the sentence-len offset.
    // But our prior loop already inserted at sentence positions and advanced
    // occurrenceIdx accordingly. We need to start at sentence-count.
    // Easier: build the full values array and re-run a fresh walk, skipping
    // occurrences where _en already exists.
    const allValues = [
      ...(Array.isArray(t.sentences) ? t.sentences.map((s) => s?.pronunciation_focus_en ?? null) : []),
      ...t.exercises.map((e) => e?.pronunciation_focus_en ?? null),
    ];
    // Re-walk and only insert where missing
    let cursor = objStart;
    let occ = 0;
    while (true) {
      const idx = text.indexOf(`"pronunciation_focus":`, cursor);
      if (idx === -1 || idx >= objEnd) break;
      // Check if the next sibling is already pronunciation_focus_en (within the same parent object)
      // We do a simple lookahead: find the closing `]` of this array, then peek the next key.
      let i = idx + `"pronunciation_focus":`.length;
      while (text[i] === " ") i++;
      if (text[i] !== "[") { cursor = idx + 1; continue; }
      const [, arrEnd] = balancedRangeBracket(text, i);
      // Peek next non-whitespace line: looking for "pronunciation_focus_en"
      let j = arrEnd;
      if (text[j] === ",") j++;
      if (text[j] === "\n") j++;
      while (text[j] === " ") j++;
      const alreadyEn = text.slice(j, j + 25).startsWith('"pronunciation_focus_en"');
      if (alreadyEn) {
        // skip — already inserted
        cursor = arrEnd + 1;
        occ++;
        continue;
      }
      // Insert
      let after = arrEnd;
      let hasComma = false;
      if (text[after] === ",") { hasComma = true; after++; }
      if (text[after] !== "\n") { cursor = arrEnd + 1; continue; }
      const insertAt = after + 1;
      let lineStart = idx;
      while (lineStart > 0 && text[lineStart - 1] !== "\n") lineStart--;
      const indent = idx - lineStart;
      const ind = " ".repeat(indent);
      const val = allValues[occ];
      if (val !== undefined && val !== null) {
        const rendered = renderArrayOfStrings(val, indent);
        let finalLine = ind + `"pronunciation_focus_en": ` + rendered;
        finalLine += hasComma ? ",\n" : "\n";
        let before = text.slice(0, after);
        if (!hasComma) before += ",";
        before += "\n";
        text = before + finalLine + text.slice(insertAt);
        const delta = (finalLine.length + (hasComma ? 0 : 1)) - (insertAt - after);
        objEnd += delta;
        totalInjected++;
      }
      cursor = arrEnd + 1;
      occ++;
    }
  }

  // 2) vocabulary[i].pronunciation_en — sibling after pronunciation_vi
  if (Array.isArray(t.vocabulary)) {
    const pronEns = t.vocabulary.map((v) => v?.pronunciation_en ?? null);
    objEnd = insertVocabPronunciationEn(objStart, objEnd, pronEns);
    totalInjected += pronEns.filter((p) => p !== null).length;
  }

  // 3) exercises[i].instruction_en — sibling after instruction_vi
  if (Array.isArray(t.exercises)) {
    const instrs = t.exercises.map((e) => e?.instruction_en ?? null);
    objEnd = insertExerciseInstructionEn(objStart, objEnd, instrs);
    totalInjected += instrs.filter((v) => v !== null).length;
  }

  // 4) idiom_glosses[i].meaning_en — sibling after meaning
  if (Array.isArray(t.idiom_glosses)) {
    const meanings = t.idiom_glosses.map((g) => g?.meaning_en ?? null);
    objEnd = insertIdiomMeaningEn(objStart, objEnd, meanings);
    totalInjected += meanings.filter((v) => v !== null).length;
  }

  // 5) lesson-level _en after _vi siblings
  if (t.cultural_notes_en) {
    objEnd = insertLessonLevelEn(objStart, objEnd, "cultural_notes_vi", "cultural_notes_en", t.cultural_notes_en);
    totalInjected++;
  }
  if (t.tip_advice_en) {
    objEnd = insertLessonLevelEn(objStart, objEnd, "tip_advice_vi", "tip_advice_en", t.tip_advice_en);
    totalInjected++;
  }
  if (t.register_notes_en) {
    objEnd = insertLessonLevelEn(objStart, objEnd, "register_notes", "register_notes_en", t.register_notes_en);
    totalInjected++;
  }
}

fs.writeFileSync(FILE, text);
console.log(`injected ${totalInjected} _en fields into ${FILE}`);
