#!/usr/bin/env node
/**
 * Audit exam audio — scan all data files for expected audio keys,
 * check Supabase room-audio bucket for existence, report gaps.
 *
 * Run: node scripts/audit-exam-audio.mjs
 *
 * Covers: TOEIC, IELTS Speaking, IELTS Listening (future), TOEFL (future)
 */

import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

const URL = process.env.VITE_SUPABASE_URL;
const ANON = process.env.VITE_SUPABASE_ANON_KEY;
if (!URL || !ANON) { console.error('Missing Supabase env vars'); process.exit(1); }

const supabase = createClient(URL, ANON);
const BUCKET = 'room-audio';

// ── Source-of-truth definitions ─────────────────────────────────────
const AUDIT_TARGETS = [
  {
    system: 'TOEIC Listening',
    dataFile: 'src/data/exam-prep/toeic/practice-items.ts',
    keyPattern: /audioKey:\s*"([^"]+)"/g,
    folder: 'toeic-listening',
    expected: 15,
    uiPage: '/exam-prep/toeic',
    uiUses: 'TalkingFacePlayButton',
  },
  {
    system: 'IELTS Speaking',
    dataFile: null, // Special: folder-based
    folder: 'ielts-speaking',
    expectedDirs: 30,
    expectedFilesPerDir: 2, // band5.mp3 + band7.mp3
    uiPage: '/exam/ielts/speaking (premium)',
    uiUses: 'useAudioUrl → <audio>',
  },
  {
    system: 'IELTS Listening (future)',
    dataFile: 'src/data/exam-prep/ielts/listening-items.ts',
    keyPattern: /audioKey:\s*"([^"]+)"/g,
    folder: 'ielts-listening',
    expected: 0, // No audioKey field defined yet
    uiPage: '/exam-prep/ielts/listening/:itemId',
    uiUses: 'Live TTS (useMercyVoice.speak)',
  },
  {
    system: 'TOEFL (future)',
    dataFile: 'src/data/exam-prep/toefl/listening-items.ts',
    keyPattern: /audioKey:\s*"([^"]+)"/g,
    folder: 'toefl-listening',
    expected: 0,
    uiPage: '/exam/toefl (scaffolding)',
    uiUses: 'None',
  },
];

async function listBucket(prefix) {
  const all = [];
  let offset = 0;
  while (true) {
    const { data, error } = await supabase.storage.from(BUCKET).list(prefix, { limit: 100, offset });
    if (error) break;
    if (!data || data.length === 0) break;
    all.push(...data);
    if (data.length < 100) break;
    offset += 100;
  }
  return all;
}

async function main() {
  console.log('╔══════════════════════════════════════════════╗');
  console.log('║  Exam Audio Audit                            ║');
  console.log('╚══════════════════════════════════════════════╝\n');

  let totalExpected = 0;
  let totalExisting = 0;
  let totalMissing = 0;

  for (const target of AUDIT_TARGETS) {
    console.log(`── ${target.system} ──`);

    if (target.dataFile) {
      // Data-file-driven: extract audio keys from TypeScript source
      const src = readFileSync(resolve(ROOT, target.dataFile), 'utf-8');
      const matches = [...src.matchAll(target.keyPattern)];
      const keys = matches.map(m => m[1]);
      const count = keys.length || target.expected;

      console.log(`  Audio keys in data: ${keys.length > 0 ? keys.length : count}`);
      console.log(`  Folder: ${BUCKET}/${target.folder}/`);

      const files = await listBucket(target.folder);
      const fileNames = files.map(f => f.name);
      const existing = keys.length > 0
        ? keys.filter(k => fileNames.includes(k.replace(`${target.folder}/`, '')))
        : [];
      const missing = keys.length > 0
        ? keys.filter(k => !fileNames.includes(k.replace(`${target.folder}/`, '')))
        : [];

      console.log(`  Existing: ${existing.length}  Missing: ${missing.length}  Expected: ${keys.length || count}`);
      if (missing.length > 0) {
        console.log(`  MISSING: ${missing.join(', ')}`);
      }
      totalExpected += keys.length || count;
      totalExisting += existing.length > 0 ? existing.length : (files.length >= (keys.length || count) ? (keys.length || count) : files.length);
      totalMissing += missing.length;
      console.log(`  UI: ${target.uiPage} — ${target.uiUses}`);

    } else if (target.folder === 'ielts-speaking') {
      const entries = await listBucket(target.folder);
      const dirs = entries.filter(e => !e.id && e.name !== '.emptyFolderPlaceholder');
      console.log(`  Topic folders: ${dirs.length} / ${target.expectedDirs}`);

      let clipCount = 0;
      for (const dir of dirs) {
        const { data } = await supabase.storage.from(BUCKET).list(`${target.folder}/${dir.name}`, { limit: 10 });
        if (data) clipCount += data.filter(f => f.name.endsWith('.mp3')).length;
      }
      console.log(`  Total clips: ${clipCount} (expected: ${target.expectedDirs * target.expectedFilesPerDir})`);
      console.log(`  UI: ${target.uiPage} — ${target.uiUses}`);

      totalExpected += target.expectedDirs * target.expectedFilesPerDir;
      totalExisting += clipCount;
    }

    console.log();
  }

  console.log(`═══════════════════════════════════`);
  console.log(`  Total expected: ${totalExpected}`);
  console.log(`  Total existing: ${totalExisting}`);
  console.log(`  Total missing:  ${totalMissing}`);
  if (totalMissing === 0) console.log(`  ✅ All exam audio present.`);
  else console.log(`  ⚠️  ${totalMissing} files missing.`);
  console.log(`═══════════════════════════════════`);
}

main().catch(e => { console.error(e); process.exit(1); });