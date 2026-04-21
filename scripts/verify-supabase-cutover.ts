/**
 * Phase 2 post-deploy sanity check.
 *
 * Reads public/audio/manifest.json, filters out kids/ and music/ (those stay
 * local), samples N adult-room filenames at random, signs each via Supabase,
 * HEAD-fetches the signed URL, asserts 200. Reports per-key PASS/FAIL with
 * source (supabase vs fallback) + summary. Exits 0 on success, 1 on any
 * failure OR when every "pass" is a fallback (which means Supabase is broken
 * silently) — override the latter with --allow-all-fallback.
 *
 * Usage:
 *   npx tsx scripts/verify-supabase-cutover.ts
 *   npx tsx scripts/verify-supabase-cutover.ts --sample-size=25
 *   npx tsx scripts/verify-supabase-cutover.ts --all
 *
 * Required env (from .env.local):
 *   VITE_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { config as loadDotenv } from 'dotenv';

loadDotenv({ path: '.env.local' });
loadDotenv({ path: '.env' });

const SUPABASE_URL = (process.env.VITE_SUPABASE_URL ?? '').trim();
const SERVICE_ROLE_KEY = (process.env.SUPABASE_SERVICE_ROLE_KEY ?? '').trim();

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('[verify] missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const BUCKET = 'room-audio';
const MANIFEST_PATH = 'public/audio/manifest.json';
const SIGNED_URL_TTL_SECONDS = 60 * 60;

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

type CliArgs = { sampleSize: number; all: boolean; allowAllFallback: boolean };

function parseArgs(argv: string[]): CliArgs {
  let sampleSize = 10;
  let all = false;
  let allowAllFallback = false;
  for (const raw of argv.slice(2)) {
    if (raw === '--all') all = true;
    else if (raw === '--allow-all-fallback') allowAllFallback = true;
    else if (raw.startsWith('--sample-size=')) {
      const n = parseInt(raw.slice('--sample-size='.length), 10);
      if (Number.isFinite(n) && n > 0) sampleSize = n;
    }
  }
  return { sampleSize, all, allowAllFallback };
}

function manifestKey(entry: string): string {
  return entry.replace(/^\/+/, '').replace(/^audio\//, '');
}

function loadManifestKeys(): string[] {
  const raw = readFileSync(MANIFEST_PATH, 'utf8');
  const parsed = JSON.parse(raw) as { files?: unknown };
  if (!Array.isArray(parsed.files)) {
    throw new Error(`[verify] ${MANIFEST_PATH} is missing 'files' array`);
  }
  return parsed.files
    .filter((f): f is string => typeof f === 'string')
    .map(manifestKey)
    .filter((k) => k.length > 0 && !k.startsWith('kids/') && !k.startsWith('music/'));
}

function shuffle<T>(arr: T[]): T[] {
  const copy = arr.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

type ResolveResult = {
  url: string;
  source: 'supabase' | 'fallback';
  signError?: string;
};

async function signKey(key: string): Promise<ResolveResult> {
  try {
    const { data, error } = await supabase.storage
      .from(BUCKET)
      .createSignedUrl(key, SIGNED_URL_TTL_SECONDS);
    if (error || !data?.signedUrl) {
      return {
        url: `/audio/${key}`,
        source: 'fallback',
        signError: error?.message ?? 'createSignedUrl returned no URL',
      };
    }
    return { url: data.signedUrl, source: 'supabase' };
  } catch (err) {
    return {
      url: `/audio/${key}`,
      source: 'fallback',
      signError: err instanceof Error ? err.message : String(err),
    };
  }
}

async function headFetch(url: string): Promise<{ status: number; ok: boolean }> {
  // Local fallback URLs (/audio/xxx.mp3) aren't fetchable from Node — only
  // Supabase signed URLs are absolute and testable here.
  if (!/^https?:\/\//i.test(url)) return { status: 0, ok: false };
  try {
    const res = await fetch(url, { method: 'HEAD' });
    return { status: res.status, ok: res.ok };
  } catch {
    return { status: 0, ok: false };
  }
}

type RowResult = {
  key: string;
  status: number;
  source: 'supabase' | 'fallback';
  pass: boolean;
  error?: string;
};

async function checkOne(key: string, index: number, total: number): Promise<RowResult> {
  const resolved = await signKey(key);
  const head = await headFetch(resolved.url);

  const pass = resolved.source === 'supabase' && head.ok;

  const indexLabel = `[${String(index + 1).padStart(String(total).length)}/${total}]`;
  const verdict = pass ? 'PASS' : 'FAIL';
  const statusLabel = head.status === 0 ? '---' : String(head.status);
  const sourceLabel = `(${resolved.source})`;
  const errorSuffix = resolved.signError
    ? `   ${resolved.signError}`
    : !head.ok && head.status !== 0
      ? `   HTTP ${head.status}`
      : '';

  console.log(
    `${indexLabel} ${key.padEnd(40)} ${verdict}  ${statusLabel}  ${sourceLabel}${errorSuffix}`,
  );

  return {
    key,
    status: head.status,
    source: resolved.source,
    pass,
    error: resolved.signError,
  };
}

async function main() {
  const args = parseArgs(process.argv);
  const keys = loadManifestKeys();

  console.log(`[verify] manifest has ${keys.length} adult-room keys (kids/music filtered)`);

  const sample = args.all ? keys : shuffle(keys).slice(0, Math.min(args.sampleSize, keys.length));
  console.log(`[verify] sampling ${sample.length} key(s)\n`);

  const results: RowResult[] = [];
  for (let i = 0; i < sample.length; i++) {
    results.push(await checkOne(sample[i], i, sample.length));
  }

  const passCount = results.filter((r) => r.pass).length;
  const supabasePass = results.filter((r) => r.pass && r.source === 'supabase').length;
  const fallbackCount = results.filter((r) => r.source === 'fallback').length;
  const failCount = results.length - passCount;

  console.log(
    `\nSummary: ${passCount}/${results.length} PASS (${supabasePass} supabase, ${fallbackCount} fallback), ${failCount}/${results.length} FAIL`,
  );

  if (failCount > 0) {
    console.error(`[verify] ${failCount} failure(s) — cutover not clean`);
    process.exit(1);
  }

  if (passCount > 0 && supabasePass === 0 && !args.allowAllFallback) {
    console.error('[verify] every pass was a fallback — Supabase is broken silently. Use --allow-all-fallback to override.');
    process.exit(1);
  }

  console.log('[verify] cutover looks good');
  process.exit(0);
}

main().catch((err) => {
  console.error('[verify] unexpected error:', err);
  process.exit(1);
});
