/**
 * Upload music tracks from /tmp/mercyblade_music/ to the `music` Supabase Storage bucket.
 *
 * Scope: MusicPlayer.tsx background songs only. Public bucket, flat layout
 * (no subfolders). Service-role write, anonymous public read.
 *
 * Idempotent: skips files already present with matching size.
 *
 * Run:
 *   npx tsx scripts/upload-music-to-supabase.ts
 *
 * Required env (read from .env):
 *   VITE_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 *
 * The bucket MUST exist before running — create it in the Supabase dashboard as
 * `music` with Public = true. This script will NOT create the bucket.
 */

import { createClient } from '@supabase/supabase-js';
import { readdirSync, statSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { config as loadDotenv } from 'dotenv';

loadDotenv({ path: '.env.local' });
loadDotenv({ path: '.env' });

const SUPABASE_URL = (process.env.VITE_SUPABASE_URL ?? '').trim();
const SERVICE_ROLE_KEY = (process.env.SUPABASE_SERVICE_ROLE_KEY ?? '').trim();

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('[upload-music] missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const BUCKET = 'music';
const SRC_DIR = '/tmp/mercyblade_music';
const MANIFEST_PATH = 'scripts/music-upload-manifest.json';
const CONCURRENCY = 4;

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

type UploadResult = {
  filename: string;
  size: number;
  status: 'uploaded' | 'skipped' | 'failed';
  error?: string;
};

async function assertBucketExists(): Promise<void> {
  const { data: buckets, error } = await supabase.storage.listBuckets();
  if (error) throw new Error(`listBuckets failed: ${error.message}`);

  const bucket = (buckets ?? []).find((b) => b.name === BUCKET);
  if (!bucket) {
    throw new Error(
      `Bucket "${BUCKET}" does not exist. Create it first in the Supabase dashboard (Storage → New bucket → name=${BUCKET}, Public=true).`,
    );
  }
  if (!bucket.public) {
    throw new Error(
      `Bucket "${BUCKET}" exists but is NOT public. Change it to Public in the dashboard before running this script.`,
    );
  }
  console.log(`[upload-music] bucket "${BUCKET}" verified (public=true)`);
}

async function remoteSize(filename: string): Promise<number | null> {
  const { data, error } = await supabase.storage.from(BUCKET).list('', {
    limit: 1,
    search: filename,
  });
  if (error) return null;
  const hit = (data ?? []).find((f) => f.name === filename);
  return hit?.metadata?.size ?? null;
}

async function uploadOne(filename: string): Promise<UploadResult> {
  const fullPath = join(SRC_DIR, filename);
  const st = statSync(fullPath);
  const size = st.size;

  const existingSize = await remoteSize(filename);
  if (existingSize === size) {
    return { filename, size, status: 'skipped' };
  }

  const body = readFileSync(fullPath);
  const { error } = await supabase.storage.from(BUCKET).upload(filename, body, {
    contentType: 'audio/mpeg',
    cacheControl: '31536000',
    upsert: true,
  });
  if (error) {
    return { filename, size, status: 'failed', error: error.message };
  }
  return { filename, size, status: 'uploaded' };
}

async function main() {
  await assertBucketExists();

  const files = readdirSync(SRC_DIR)
    .filter((n) => n.toLowerCase().endsWith('.mp3'))
    .sort();

  console.log(`[upload-music] ${files.length} file(s) to process from ${SRC_DIR}`);

  const results: UploadResult[] = [];
  let cursor = 0;

  async function worker() {
    while (cursor < files.length) {
      const i = cursor++;
      const filename = files[i];
      try {
        const r = await uploadOne(filename);
        results[i] = r;
        const tag =
          r.status === 'uploaded' ? '↑' : r.status === 'skipped' ? '=' : '✗';
        console.log(`  [${i + 1}/${files.length}] ${tag} ${filename}${r.error ? ` — ${r.error}` : ''}`);
      } catch (err) {
        results[i] = {
          filename,
          size: 0,
          status: 'failed',
          error: err instanceof Error ? err.message : String(err),
        };
        console.error(`  [${i + 1}/${files.length}] ✗ ${filename} — ${results[i].error}`);
      }
    }
  }

  await Promise.all(Array.from({ length: CONCURRENCY }, worker));

  const summary = {
    bucket: BUCKET,
    generatedAt: new Date().toISOString(),
    total: results.length,
    uploaded: results.filter((r) => r.status === 'uploaded').length,
    skipped: results.filter((r) => r.status === 'skipped').length,
    failed: results.filter((r) => r.status === 'failed').length,
    entries: results,
  };

  writeFileSync(MANIFEST_PATH, JSON.stringify(summary, null, 2));
  console.log(
    `[upload-music] done — uploaded=${summary.uploaded} skipped=${summary.skipped} failed=${summary.failed}`,
  );
  console.log(`[upload-music] manifest written to ${MANIFEST_PATH}`);

  if (summary.failed > 0) process.exit(1);
}

main().catch((err) => {
  console.error('[upload-music] fatal:', err);
  process.exit(1);
});
