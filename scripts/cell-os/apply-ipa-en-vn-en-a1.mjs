#!/usr/bin/env node
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const SOURCE_PATH = "src/languages/vietnamese/lessons-a1.ts";
const PAYLOAD_PATH = "reports/cell-inventory/ipa-en-map-vn-en-a1.json";

function readText(relativePath) {
  return fs.readFileSync(path.join(ROOT, relativePath), "utf8");
}

function writeText(relativePath, value) {
  fs.writeFileSync(path.join(ROOT, relativePath), value);
}

function deterministicUuid(seed) {
  const bytes = crypto.createHash("sha256").update(`wp-cell-id-1:${seed}`).digest();
  const copy = Buffer.from(bytes.subarray(0, 16));
  copy[6] = (copy[6] & 0x0f) | 0x50;
  copy[8] = (copy[8] & 0x3f) | 0x80;
  const hex = copy.toString("hex");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20, 32)}`;
}

function scanner(source) {
  function skipString(index, quote) {
    let i = index + 1;
    while (i < source.length) {
      if (source[i] === "\\") {
        i += 2;
        continue;
      }
      if (source[i] === quote) return i + 1;
      i += 1;
    }
    throw new Error(`Unterminated string at ${index}`);
  }

  function skipLineComment(index) {
    const end = source.indexOf("\n", index + 2);
    return end === -1 ? source.length : end + 1;
  }

  function skipBlockComment(index) {
    const end = source.indexOf("*/", index + 2);
    if (end === -1) throw new Error(`Unterminated block comment at ${index}`);
    return end + 2;
  }

  function matching(openIndex, openChar, closeChar) {
    let depth = 0;
    let i = openIndex;
    while (i < source.length) {
      const ch = source[i];
      const next = source[i + 1];
      if (ch === '"' || ch === "'" || ch === "`") {
        i = skipString(i, ch);
        continue;
      }
      if (ch === "/" && next === "/") {
        i = skipLineComment(i);
        continue;
      }
      if (ch === "/" && next === "*") {
        i = skipBlockComment(i);
        continue;
      }
      if (ch === openChar) depth += 1;
      if (ch === closeChar) {
        depth -= 1;
        if (depth === 0) return i;
      }
      i += 1;
    }
    throw new Error(`No match for ${openChar} at ${openIndex}`);
  }

  function topLevelObjectRanges(arrayOpen, arrayClose) {
    const ranges = [];
    let i = arrayOpen + 1;
    while (i < arrayClose) {
      const ch = source[i];
      const next = source[i + 1];
      if (ch === '"' || ch === "'" || ch === "`") {
        i = skipString(i, ch);
        continue;
      }
      if (ch === "/" && next === "/") {
        i = skipLineComment(i);
        continue;
      }
      if (ch === "/" && next === "*") {
        i = skipBlockComment(i);
        continue;
      }
      if (ch === "{") {
        const end = matching(i, "{", "}");
        ranges.push({ start: i, end });
        i = end + 1;
        continue;
      }
      i += 1;
    }
    return ranges;
  }

  function propertyArrayRange(objectRange, propertyName) {
    const body = source.slice(objectRange.start, objectRange.end + 1);
    const match = new RegExp(`\\b${propertyName}\\s*:\\s*\\[`).exec(body);
    if (!match) return null;
    const open = objectRange.start + match.index + match[0].lastIndexOf("[");
    const close = matching(open, "[", "]");
    return { start: open, end: close };
  }

  return { matching, topLevelObjectRanges, propertyArrayRange };
}

function lineIndentBefore(index, source) {
  const lineStart = source.lastIndexOf("\n", index) + 1;
  return source.slice(lineStart, index).match(/^[ \t]*/)?.[0] ?? "";
}

function propertyLineEnd(objectText, propertyName) {
  const match = new RegExp(`\\n[ \\t]*${propertyName}\\s*:`).exec(objectText);
  if (!match) return null;
  const start = match.index + 1;
  const lineEnd = objectText.indexOf("\n", start);
  return lineEnd === -1 ? objectText.length : lineEnd + 1;
}

function stringProperty(objectText, propertyName) {
  const match = new RegExp(`\\b${propertyName}\\s*:\\s*"([^"]*)"`).exec(objectText);
  return match?.[1] ?? null;
}

function buildInsertions(source, payload) {
  const scan = scanner(source);
  const declarationStart = source.indexOf("export const lessons");
  const assignmentStart = source.indexOf("=", declarationStart);
  const lessonsArrayOpen = source.indexOf("[", assignmentStart);
  if (lessonsArrayOpen === -1) throw new Error("Unable to locate lessons array");
  const lessonsArrayClose = scan.matching(lessonsArrayOpen, "[", "]");
  const lessonRanges = scan.topLevelObjectRanges(lessonsArrayOpen, lessonsArrayClose);
  const insertions = [];
  const seenPayloadIds = new Set();
  const cellsBySyntheticId = new Map(payload.cells.map((cell) => [cell.cell_id, cell]));

  for (const lessonRange of lessonRanges) {
    const lessonText = source.slice(lessonRange.start, lessonRange.end + 1);
    const lessonId = Number(/\bid\s*:\s*(\d+)/.exec(lessonText)?.[1]);
    if (!Number.isFinite(lessonId)) continue;
    const lessonIdPadded = String(lessonId).padStart(3, "0");

    const phraseArray = scan.propertyArrayRange(lessonRange, "phrases");
    if (phraseArray) {
      const phrases = scan.topLevelObjectRanges(phraseArray.start, phraseArray.end);
      phrases.forEach((range, index) => {
        const ordinal = String(index + 1).padStart(3, "0");
        const syntheticId = `vi-en:A1:lesson-${lessonIdPadded}:vocabulary-${ordinal}`;
        const cell = cellsBySyntheticId.get(syntheticId);
        if (!cell) throw new Error(`Missing payload cell ${syntheticId}`);
        seenPayloadIds.add(syntheticId);
        const text = source.slice(range.start, range.end + 1);
        const indent = `${lineIndentBefore(range.start, source)}  `;
        if (!/\bcell_id\s*:/.test(text)) {
          insertions.push({
            index: range.start + 1,
            text: `\n${indent}cell_id: "${deterministicUuid(syntheticId)}",`,
          });
        }
        if (!/\bipa_en\s*:/.test(text)) {
          const offset = propertyLineEnd(text, "english");
          if (offset === null) throw new Error(`Unable to locate english property for ${syntheticId}`);
          insertions.push({
            index: range.start + offset,
            text: `${indent}ipa_en: ${cell.ipa_en === null ? "null" : JSON.stringify(cell.ipa_en)},\n`,
          });
        }
      });
    }

    const dialogueArray = scan.propertyArrayRange(lessonRange, "dialogue");
    if (dialogueArray) {
      const turns = scan.topLevelObjectRanges(dialogueArray.start, dialogueArray.end);
      turns.forEach((range, index) => {
        const ordinal = String(index + 1).padStart(3, "0");
        const syntheticId = `vi-en:A1:lesson-${lessonIdPadded}:dialogue-turn-${ordinal}`;
        const cell = cellsBySyntheticId.get(syntheticId);
        if (!cell) throw new Error(`Missing payload cell ${syntheticId}`);
        seenPayloadIds.add(syntheticId);
        const text = source.slice(range.start, range.end + 1);
        const indent = `${lineIndentBefore(range.start, source)}  `;
        if (!stringProperty(text, "cell_id")) {
          insertions.push({
            index: range.start + 1,
            text: `\n${indent}cell_id: "${deterministicUuid(syntheticId)}",`,
          });
        }
        if (!/\bipa_en\s*:/.test(text)) {
          const offset = propertyLineEnd(text, "english");
          if (offset === null) throw new Error(`Unable to locate english property for ${syntheticId}`);
          insertions.push({
            index: range.start + offset,
            text: `${indent}ipa_en: ${cell.ipa_en === null ? "null" : JSON.stringify(cell.ipa_en)},\n`,
          });
        }
      });
    }
  }

  for (const cell of payload.cells) {
    if (!seenPayloadIds.has(cell.cell_id)) throw new Error(`Payload cell not applied: ${cell.cell_id}`);
  }

  return insertions.sort((a, b) => b.index - a.index);
}

const payload = JSON.parse(readText(PAYLOAD_PATH));
const source = readText(SOURCE_PATH);
const insertions = buildInsertions(source, payload);
let next = source;
for (const insertion of insertions) {
  next = `${next.slice(0, insertion.index)}${insertion.text}${next.slice(insertion.index)}`;
}
writeText(SOURCE_PATH, next);
console.log(`Applied ${payload.summary.complete_cells} IPA rows and ${payload.summary.partial_cells} null rows to ${SOURCE_PATH}`);
