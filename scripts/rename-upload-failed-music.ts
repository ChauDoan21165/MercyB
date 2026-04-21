/**
 * Re-upload the 17 music files that failed with "Invalid key" (diacritics /
 * em-dash / smart-quote / space) under ASCII-safe slugified keys.
 *
 * Reads scripts/audio-upload-manifest.json to find failed entries,
 * computes a deterministic ASCII slug for each, uploads under the new name,
 * and writes scripts/music-rename-map.json with the old→new mapping so
 * musicTracks.ts can be updated.
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync, writeFileSync, statSync } from 'fs';
import { join } from 'path';
import { config as loadDotenv } from 'dotenv';

loadDotenv({ path: '.env.local' });
loadDotenv({ path: '.env' });

const SUPABASE_URL = (process.env.VITE_SUPABASE_URL ?? '').trim();
const SERVICE_ROLE_KEY = (process.env.SUPABASE_SERVICE_ROLE_KEY ?? '').trim();
if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('[rename] missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env');
  process.exit(1);
}

const BUCKET = 'room-audio';
const AUDIO_DIR = 'public/audio';
const MANIFEST = 'scripts/audio-upload-manifest.json';
const MAP_OUT = 'scripts/music-rename-map.json';

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

function stripDiacritics(s: string): string {
  return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    // Vietnamese đ / Đ are NOT in NFD — handle explicitly.
    .replace(/đ/g, 'd').replace(/Đ/g, 'D');
}

function slugifyFilename(original: string): string {
  // original e.g. "music/Heart of the Blade _ Trái Tim Của Lưỡi Gươm (1).mp3"
  // expect the "music/" prefix — keep it, slugify the rest
  const prefix = original.startsWith('music/') ? 'music/' : '';
  let name = original.slice(prefix.length);
  name = name.replace(/\.mp3$/i, '');
  name = stripDiacritics(name).toLowerCase();
  name = name.replace(/[^a-z0-9]+/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, '');
  return prefix + name + '.mp3';
}

async function upload(oldKey: string, newKey: string): Promise<void> {
  const localPath = join(AUDIO_DIR, oldKey);
  const bytes = readFileSync(localPath);
  const { error } = await supabase.storage.from(BUCKET).upload(newKey, bytes, {
    contentType: 'audio/mpeg',
    upsert: true,
  });
  if (error) throw error;
}

async function main() {
  const manifest = JSON.parse(readFileSync(MANIFEST, 'utf8'));
  const failed = (manifest.files ?? []).filter((f: any) => f.status === 'failed');
  if (failed.length === 0) {
    console.log('[rename] no failed files in manifest — nothing to do');
    return;
  }

  console.log(`[rename] processing ${failed.length} failed files`);

  // Compute slugs with collision counter
  const mapping: Array<{ old: string; slug: string; size: number }> = [];
  const seen = new Map<string, number>();
  for (const f of failed) {
    const oldKey = f.filename as string;
    let baseSlug = slugifyFilename(oldKey);
    const count = seen.get(baseSlug) ?? 0;
    let slug = baseSlug;
    if (count > 0) {
      // Avoid "foo.mp3" + "foo.mp3" collision — append _vN
      const stem = baseSlug.replace(/\.mp3$/, '');
      slug = `${stem}_v${count + 1}.mp3`;
    }
    seen.set(baseSlug, count + 1);
    const size = statSync(join(AUDIO_DIR, oldKey)).size;
    mapping.push({ old: oldKey, slug, size });
  }

  console.log('[rename] computed slugs:');
  for (const m of mapping) {
    console.log(`  ${m.old}`);
    console.log(`    → ${m.slug}  (${(m.size / 1024 / 1024).toFixed(2)} MB)`);
  }

  console.log('');
  console.log('[rename] uploading...');
  let ok = 0, fail = 0;
  const results: Array<{ old: string; slug: string; status: 'uploaded' | 'failed'; error?: string }> = [];
  for (const m of mapping) {
    try {
      await upload(m.old, m.slug);
      console.log(`  ✓ ${m.slug}`);
      results.push({ old: m.old, slug: m.slug, status: 'uploaded' });
      ok++;
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      console.log(`  ✗ ${m.slug} — ${msg}`);
      results.push({ old: m.old, slug: m.slug, status: 'failed', error: msg });
      fail++;
    }
  }

  console.log('');
  console.log(`[rename] done: ${ok} uploaded, ${fail} failed`);
  writeFileSync(MAP_OUT, JSON.stringify({ generatedAt: new Date().toISOString(), results }, null, 2));
  console.log(`[rename] mapping written to ${MAP_OUT}`);

  if (fail > 0) process.exit(2);
}

main().catch((e) => { console.error('[rename] fatal:', e); process.exit(1); });
