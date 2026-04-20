/**
 * Phase 2: Upload adult-room audio to Supabase Storage (bucket: room-audio).
 *
 * Uploads every .mp3 at the top level of public/audio/ (skipping kids/, music/,
 * and any other subdirectories — those remain bundled with the app).
 *
 * Idempotent: skips files already present in the bucket with matching size.
 * Writes a manifest to scripts/audio-upload-manifest.json on completion.
 *
 * Run with:
 *   npx tsx scripts/upload-audio-to-supabase.ts
 *
 * Required env (read from .env.local, which is gitignored):
 *   VITE_SUPABASE_URL              (same as client)
 *   SUPABASE_SERVICE_ROLE_KEY      (NOT the anon key — this bypasses RLS)
 */

import { createClient } from '@supabase/supabase-js';
import { readdirSync, statSync, readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import { config as loadDotenv } from 'dotenv';

loadDotenv({ path: '.env.local' });
loadDotenv({ path: '.env' });

const SUPABASE_URL = (process.env.VITE_SUPABASE_URL ?? '').trim();
const SERVICE_ROLE_KEY = (process.env.SUPABASE_SERVICE_ROLE_KEY ?? '').trim();

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('[upload] missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  console.error('[upload] add SUPABASE_SERVICE_ROLE_KEY=eyJ... to .env.local (Supabase dashboard → Project Settings → API → service_role)');
  process.exit(1);
}

const BUCKET = 'room-audio';
const AUDIO_DIR = 'public/audio';
const MANIFEST_PATH = 'scripts/audio-upload-manifest.json';
const CONCURRENCY = 6;

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

type UploadResult = {
  filename: string;
  size: number;
  status: 'uploaded' | 'skipped' | 'failed';
  error?: string;
};

async function ensureBucket(): Promise<void> {
  const { data: buckets, error } = await supabase.storage.listBuckets();
  if (error) throw new Error(`[upload] listBuckets failed: ${error.message}`);
  const exists = (buckets ?? []).some((b) => b.name === BUCKET);
  if (exists) {
    console.log(`[upload] bucket ${BUCKET} already exists`);
    return;
  }
  console.log(`[upload] creating private bucket ${BUCKET}`);
  const { error: createErr } = await supabase.storage.createBucket(BUCKET, { public: false });
  if (createErr) throw new Error(`[upload] createBucket failed: ${createErr.message}`);
}

function collectTopLevelMp3s(): string[] {
  const entries = readdirSync(AUDIO_DIR);
  const files: string[] = [];
  for (const name of entries) {
    const fullPath = join(AUDIO_DIR, name);
    const st = statSync(fullPath);
    if (st.isFile() && name.toLowerCase().endsWith('.mp3')) {
      files.push(name);
    }
  }
  files.sort();
  return files;
}

async function remoteSizeOf(filename: string): Promise<number | null> {
  const { data, error } = await supabase.storage.from(BUCKET).list('', {
    limit: 1,
    search: filename,
  });
  if (error) return null;
  const hit = (data ?? []).find((o) => o.name === filename);
  const sz = hit?.metadata?.size;
  return typeof sz === 'number' ? sz : null;
}

async function uploadOne(filename: string): Promise<UploadResult> {
  const localPath = join(AUDIO_DIR, filename);
  const localSize = statSync(localPath).size;

  try {
    const remoteSize = await remoteSizeOf(filename);
    if (remoteSize === localSize) {
      return { filename, size: localSize, status: 'skipped' };
    }

    const bytes = readFileSync(localPath);
    const { error } = await supabase.storage.from(BUCKET).upload(filename, bytes, {
      contentType: 'audio/mpeg',
      upsert: true,
    });
    if (error) throw error;
    return { filename, size: localSize, status: 'uploaded' };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { filename, size: localSize, status: 'failed', error: message };
  }
}

async function runWithConcurrency<T, R>(
  items: T[],
  worker: (item: T, index: number) => Promise<R>,
  concurrency: number,
  onProgress: (done: number, total: number, latest: R) => void,
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let nextIndex = 0;
  let done = 0;

  async function runner() {
    while (true) {
      const i = nextIndex++;
      if (i >= items.length) return;
      const r = await worker(items[i], i);
      results[i] = r;
      done++;
      onProgress(done, items.length, r);
    }
  }

  const runners = Array.from({ length: Math.min(concurrency, items.length) }, () => runner());
  await Promise.all(runners);
  return results;
}

async function main(): Promise<void> {
  console.log('[upload] starting Phase 2 audio migration to Supabase Storage');
  console.log(`[upload] project: ${SUPABASE_URL}`);
  console.log(`[upload] bucket: ${BUCKET}`);

  await ensureBucket();

  const files = collectTopLevelMp3s();
  console.log(`[upload] found ${files.length} top-level .mp3 files in ${AUDIO_DIR}`);

  const totalBytes = files.reduce((sum, f) => sum + statSync(join(AUDIO_DIR, f)).size, 0);
  console.log(`[upload] total size: ${(totalBytes / 1024 / 1024).toFixed(1)} MB`);

  const startedAt = Date.now();
  const results = await runWithConcurrency(files, uploadOne, CONCURRENCY, (done, total, latest) => {
    const marker = latest.status === 'uploaded' ? '↑' : latest.status === 'skipped' ? '·' : '✗';
    process.stdout.write(`\r[upload] ${done}/${total} ${marker} ${latest.filename.slice(0, 60).padEnd(60)}`);
  });
  process.stdout.write('\n');

  const uploaded = results.filter((r) => r.status === 'uploaded');
  const skipped = results.filter((r) => r.status === 'skipped');
  const failed = results.filter((r) => r.status === 'failed');

  const uploadedBytes = uploaded.reduce((s, r) => s + r.size, 0);
  const elapsedSec = (Date.now() - startedAt) / 1000;

  console.log(`[upload] done in ${elapsedSec.toFixed(1)}s`);
  console.log(`[upload]   uploaded: ${uploaded.length} files (${(uploadedBytes / 1024 / 1024).toFixed(1)} MB)`);
  console.log(`[upload]   skipped:  ${skipped.length} files (already present, size matches)`);
  console.log(`[upload]   failed:   ${failed.length} files`);

  if (failed.length > 0) {
    console.log('[upload] first 10 failures:');
    for (const f of failed.slice(0, 10)) {
      console.log(`[upload]   ${f.filename}: ${f.error}`);
    }
  }

  const manifest = {
    generatedAt: new Date().toISOString(),
    bucket: BUCKET,
    totalFiles: results.length,
    uploadedCount: uploaded.length,
    skippedCount: skipped.length,
    failedCount: failed.length,
    totalSizeBytes: totalBytes,
    files: results.map((r) => ({
      filename: r.filename,
      size: r.size,
      status: r.status,
      ...(r.error ? { error: r.error } : {}),
    })),
  };
  writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
  console.log(`[upload] manifest written to ${MANIFEST_PATH}`);

  if (failed.length > 0) process.exit(2);
}

main().catch((err) => {
  console.error('[upload] fatal:', err);
  process.exit(1);
});
