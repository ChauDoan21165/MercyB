#!/usr/bin/env node
import { randomUUID } from "node:crypto";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import ts from "typescript";

const ROOT = process.cwd();
const SOURCE_DIR = "src/languages";

function usage() {
  return [
    "Usage: node scripts/content/add-cell-ids.mjs [--apply] [--diff-sample=N]",
    "",
    "Default mode is dry-run. It reports the files/items that would be touched.",
    "--apply writes missing cell_id fields in-place.",
    "--diff-sample=N prints unified diffs for the first N touched files.",
  ].join("\n");
}

const args = new Set(process.argv.slice(2));
if (args.has("--help") || args.has("-h")) {
  console.log(usage());
  process.exit(0);
}
const apply = args.has("--apply");
const sampleArg = process.argv.slice(2).find((arg) => arg.startsWith("--diff-sample="));
const diffSample = sampleArg ? Number(sampleArg.split("=")[1]) : 0;

function rel(file) {
  return path.relative(ROOT, file).replaceAll("\\", "/");
}

function walkFiles(dir, acc = []) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return acc;
  }
  for (const entry of entries) {
    if (entry.name === "__tests__" || entry.name === "fixtures" || entry.name === "__fixtures__") continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkFiles(fullPath, acc);
    } else if (entry.name.endsWith(".ts") && !/\.(test|spec)\.ts$/.test(entry.name)) {
      acc.push(fullPath);
    }
  }
  return acc;
}

function propertyName(node) {
  if (ts.isIdentifier(node) || ts.isStringLiteral(node) || ts.isNumericLiteral(node)) return node.text;
  return undefined;
}

function objectProperties(node) {
  const out = new Map();
  if (!ts.isObjectLiteralExpression(node)) return out;
  for (const property of node.properties) {
    if (!ts.isPropertyAssignment(property)) continue;
    const name = propertyName(property.name);
    if (name) out.set(name, property.initializer);
  }
  return out;
}

function hasPopulatedCellId(node) {
  const value = objectProperties(node).get("cell_id");
  return value && ts.isStringLiteralLike(value) && value.text.trim().length > 0;
}

function indentForInsert(sourceText, objectNode) {
  const openBrace = objectNode.getStart();
  const afterBrace = sourceText.slice(openBrace + 1);
  const newline = afterBrace.match(/^\r?\n([ \t]*)/);
  if (newline) return newline[1];
  const lineStart = sourceText.lastIndexOf("\n", openBrace) + 1;
  const objectIndent = sourceText.slice(lineStart, openBrace).match(/^[ \t]*/)?.[0] || "";
  return `${objectIndent}  `;
}

function insertionFor(sourceText, objectNode, id) {
  const openBrace = objectNode.getStart();
  const afterBrace = sourceText.slice(openBrace + 1);
  const lineBreak = afterBrace.startsWith("\r\n") ? "\r\n" : "\n";
  const indent = indentForInsert(sourceText, objectNode);
  if (/^\r?\n/.test(afterBrace)) {
    return { index: openBrace + 1, text: `${lineBreak}${indent}cell_id: "${id}",` };
  }
  return { index: openBrace + 1, text: ` cell_id: "${id}",` };
}

function scanFile(file) {
  const sourceText = fs.readFileSync(file, "utf8");
  const sourceFile = ts.createSourceFile(file, sourceText, ts.ScriptTarget.Latest, true);
  const insertions = [];
  const counts = { vocabulary: 0, phrases: 0, dialogue: 0 };

  function visit(node) {
    if (ts.isObjectLiteralExpression(node)) {
      const properties = objectProperties(node);
      for (const arrayName of ["vocabulary", "phrases", "dialogue"]) {
        const arrayNode = properties.get(arrayName);
        if (!arrayNode || !ts.isArrayLiteralExpression(arrayNode)) continue;
        for (const element of arrayNode.elements) {
          if (!ts.isObjectLiteralExpression(element)) continue;
          if (hasPopulatedCellId(element)) continue;
          const id = randomUUID();
          insertions.push({ arrayName, ...insertionFor(sourceText, element, id) });
          counts[arrayName]++;
        }
      }
    }
    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  return { sourceText, insertions, counts };
}

function applyInsertions(sourceText, insertions) {
  let next = sourceText;
  for (const insertion of [...insertions].sort((a, b) => b.index - a.index)) {
    next = `${next.slice(0, insertion.index)}${insertion.text}${next.slice(insertion.index)}`;
  }
  return next;
}

function unifiedDiff(file, before, after) {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "cell-id-diff-"));
  const beforePath = path.join(tmpDir, "before.ts");
  const afterPath = path.join(tmpDir, "after.ts");
  try {
    fs.writeFileSync(beforePath, before);
    fs.writeFileSync(afterPath, after);
    return execFileSync("diff", ["-u", "--label", `a/${rel(file)}`, "--label", `b/${rel(file)}`, beforePath, afterPath], {
      encoding: "utf8",
      maxBuffer: 1 << 20,
    });
  } catch (e) {
    return e.stdout ? String(e.stdout) : `[diff unavailable for ${rel(file)}: ${e.message}]`;
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
}

const files = walkFiles(path.join(ROOT, SOURCE_DIR)).sort();
const touched = [];
let vocabularyItems = 0;
let phraseItems = 0;
let dialogueItems = 0;

for (const file of files) {
  const result = scanFile(file);
  if (result.insertions.length === 0) continue;
  const next = applyInsertions(result.sourceText, result.insertions);
  touched.push({ file, result, next });
  vocabularyItems += result.counts.vocabulary;
  phraseItems += result.counts.phrases;
  dialogueItems += result.counts.dialogue;
}

console.log(`[cell-id] mode=${apply ? "apply" : "dry-run"}`);
console.log(`[cell-id] files_scanned=${files.length}`);
console.log(`[cell-id] files_touched=${touched.length}`);
console.log(`[cell-id] vocabulary_ids_to_add=${vocabularyItems}`);
console.log(`[cell-id] phrase_ids_to_add=${phraseItems}`);
console.log(`[cell-id] dialogue_ids_to_add=${dialogueItems}`);
console.log(`[cell-id] total_ids_to_add=${vocabularyItems + phraseItems + dialogueItems}`);

if (diffSample > 0) {
  for (const item of touched.slice(0, diffSample)) {
    console.log("");
    console.log(unifiedDiff(item.file, item.result.sourceText, item.next));
  }
}

if (apply) {
  for (const item of touched) {
    fs.writeFileSync(item.file, item.next);
  }
}
