/**
 * Upload all .mp3 files under public/audio/ to Supabase Storage (bucket: room-audio).
 *
 * Recursively walks public/audio/ and uploads every .mp3, preserving the
 * relative path as the bucket key:
 *   public/audio/foo.mp3                → foo.mp3                 (adult room audio)
 *   public/audio/kids/airplane.mp3      → kids/airplane.mp3
 *   public/audio/kids/josh/airplane.mp3 → kids/josh/airplane.mp3
 *   public/audio/music/theme.mp3        → music/theme.mp3
 *
 * Idempotent: skips files already present in the bucket with matching size.
 * Writes a manifest to scripts/audio-upload-manifest.json on completion.
 *
 * Run with:
 *   npx tsx scripts/upload-audio-to-supabase.ts
 *
 * Required env (read from .env.local or .env, both gitignored):
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

/**
 * Walks AUDIO_DIR recursively, returning relative paths of every .mp3 found.
 * The relative path doubles as the Supabase bucket key (slashes preserved).
 */
function collectAllMp3s(): string[] {
  const out: string[] = [];
  const walk = (dir: string, rel: string) => {
    for (const name of readdirSync(dir)) {
      const fullPath = join(dir, name);
      const relPath = rel ? `${rel}/${name}` : name;
      const st = statSync(fullPath);
      if (st.isDirectory()) {
        walk(fullPath, relPath);
      } else if (st.isFile() && name.toLowerCase().endsWith('.mp3')) {
        out.push(relPath);
      }
    }
  };
  walk(AUDIO_DIR, '');
  out.sort();
  return out;
}

async function remoteSizeOf(key: string): Promise<number | null> {
  // key may be "foo.mp3" or "kids/airplane.mp3" or "kids/josh/ant.mp3".
  // Supabase list() takes a directory prefix + search basename.
  const lastSlash = key.lastIndexOf('/');
  const dirPart = lastSlash >= 0 ? key.slice(0, lastSlash) : '';
  const basePart = lastSlash >= 0 ? key.slice(lastSlash + 1) : key;
  const { data, error } = await supabase.storage.from(BUCKET).list(dirPart, {
    limit: 1,
    search: basePart,
  });
  if (error) return null;
  const hit = (data ?? []).find((o) => o.name === basePart);
  const sz = hit?.metadata?.size;
  return typeof sz === 'number' ? sz : null;
}

async function uploadOne(filename: string): Promise<UploadResult> {
  // `filename` here is the full relative path from AUDIO_DIR, which is also
  // the bucket key (slashes preserved).
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
    for (;;) {
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
  console.log('[upload] starting audio migration to Supabase Storage');
  console.log(`[upload] project: ${SUPABASE_URL}`);
  console.log(`[upload] bucket: ${BUCKET}`);

  await ensureBucket();

  const files = collectAllMp3s();
  console.log(`[upload] found ${files.length} .mp3 files under ${AUDIO_DIR} (recursive)`);

  // Break down by top-level prefix so the operator can sanity-check scope.
  const byPrefix: Record<string, number> = {};
  for (const f of files) {
    const prefix = f.includes('/') ? f.slice(0, f.indexOf('/')) : '(root)';
    byPrefix[prefix] = (byPrefix[prefix] ?? 0) + 1;
  }
  for (const [prefix, count] of Object.entries(byPrefix).sort()) {
    console.log(`[upload]   ${prefix}/: ${count} files`);
  }

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
