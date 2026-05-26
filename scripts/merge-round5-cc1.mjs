#!/usr/bin/env node
// scripts/merge-round5-cc1.mjs
//
// One-shot merge: append the Round-5 CC1 batch (200 sentences across
// work/daily/texting/email/shopping/money) into the main
// src/data/speech-sentences.json file. Keeps the per-batch file in the
// repo so git history preserves exactly what each round added.
//
// Run: node scripts/merge-round5-cc1.mjs
// Idempotent: skips IDs that already exist in the main file and logs
// how many were appended.

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const MAIN = join(__dirname, '..', 'src', 'data', 'speech-sentences.json');
const BATCH = join(__dirname, '..', 'src', 'data', 'speech-sentences-round5-cc1.json');

const main = JSON.parse(readFileSync(MAIN, 'utf8'));
const batch = JSON.parse(readFileSync(BATCH, 'utf8'));

if (!Array.isArray(main.sentences) || !Array.isArray(batch.sentences)) {
  console.error('[merge] malformed input: expected {sentences: [...]} in both files');
  process.exit(1);
}

const existing = new Set(main.sentences.map((s) => s.id));
const appended = [];
const skipped = [];

for (const sentence of batch.sentences) {
  if (existing.has(sentence.id)) {
    skipped.push(sentence.id);
    continue;
  }
  main.sentences.push(sentence);
  appended.push(sentence.id);
}

writeFileSync(MAIN, JSON.stringify(main, null, 2) + '\n', 'utf8');

console.log(`[merge] appended ${appended.length} sentences to speech-sentences.json`);
if (skipped.length > 0) {
  console.log(`[merge] skipped ${skipped.length} existing ids: ${skipped.slice(0, 5).join(', ')}${skipped.length > 5 ? ' …' : ''}`);
}
console.log(`[merge] total sentences now: ${main.sentences.length}`);
