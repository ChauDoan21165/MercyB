// fix-room-audio.js
// Two-phase production hygiene script for `room-audio` storage bucket.
//
//   PHASE 1 (--query): query storage.objects for objects whose `name` has
//     embedded spaces (and isn't music/* / kids/* / has parens). Writes
//     /Users/admin/Desktop/broken-audio-files.json.
//
//   PHASE 2 (default): for each broken object, split the space-joined
//     name into individual filenames, find the matching public/data/*.json
//     entry, regenerate audio via ElevenLabs (Rachel, eleven_multilingual_v2),
//     upload the per-track file to Supabase, and ONLY THEN delete the broken
//     concatenated object. Honors DRY_RUN=true (default) — no TTS calls,
//     no uploads, no deletes — just emits the manifest.
//
// Env vars required: VITE_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY,
//                    ELEVENLABS_API_KEY.
//
// Manifest log: /Users/admin/MercyB/room-audio-fix-manifest.jsonl
// Failures:    /Users/admin/MercyB/room-audio-failures.json
// Generated:   /Users/admin/MercyB/room-audio-fixed/<filename>.mp3

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import { ElevenLabsClient } from 'elevenlabs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ─── config ──────────────────────────────────────────────────────────────
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SERVICE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY;
const TTS_KEY      = process.env.ELEVENLABS_API_KEY;
const BUCKET       = 'room-audio';
const VOICE_ID     = '21m00Tcm4TlvDq8ikWAM'; // Rachel
const MODEL_ID     = 'eleven_multilingual_v2';
const RATE_LIMIT_MS = 1000 / 3;
const MAX_CONSECUTIVE_FAILS = 30;

const DRY_RUN  = (process.env.DRY_RUN ?? 'true') !== 'false';
const QUERY_ONLY = process.argv.includes('--query');

const ROOT = __dirname;
const PUBLIC_DATA_DIR  = path.join(ROOT, 'public', 'data');
const FIXED_DIR        = path.join(ROOT, 'room-audio-fixed');
const MANIFEST_PATH    = path.join(ROOT, 'room-audio-fix-manifest.jsonl');
const FAILURES_PATH    = path.join(ROOT, 'room-audio-failures.json');
const BROKEN_LIST_PATH = '/Users/admin/Desktop/broken-audio-files.json';

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('VITE_SUPABASE_URL and/or SUPABASE_SERVICE_ROLE_KEY missing in .env — aborting.');
  process.exit(1);
}

const supabaseStorage = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});
const supabaseDb = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
  db: { schema: 'storage' },
});

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const manifest = (entry) => fs.appendFileSync(MANIFEST_PATH, JSON.stringify({ ts: new Date().toISOString(), ...entry }) + '\n');

// ─── PHASE 1: query storage.objects ───────────────────────────────────────

async function queryBrokenObjects() {
  // PostgREST doesn't expose the `storage` schema, so we walk the bucket via
  // the storage admin list API. The user's filter excludes music/* and kids/*,
  // so we only need to walk the bucket root (top-level objects).
  const PAGE = 1000;
  let offset = 0;
  const root = [];
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const { data, error } = await supabaseStorage.storage.from(BUCKET).list('', {
      limit: PAGE,
      offset,
      sortBy: { column: 'name', order: 'asc' },
    });
    if (error) throw new Error(`storage list failed: ${error.message}`);
    if (!data || data.length === 0) break;
    root.push(...data);
    if (data.length < PAGE) break;
    offset += PAGE;
  }
  // list() returns both files and "folders". Folders have id === null on Supabase;
  // files have a string id. We want files only.
  const files = root.filter((r) => r.id !== null && typeof r.name === 'string');
  // Apply the user's predicate: name LIKE '% %' (has space) AND not in music/kids
  // (we're at root so already excluded) AND not containing '('.
  return files
    .map((f) => f.name)
    .filter((n) => / /.test(n) && !n.includes('('));
}

// ─── filename → JSON entry resolver ───────────────────────────────────────

let JSON_INDEX = null;
let AUDIO_INDEX = null; // filename → { room, entry } — primary lookup table
function buildJsonIndex() {
  if (JSON_INDEX) return JSON_INDEX;
  JSON_INDEX = [];
  AUDIO_INDEX = new Map();
  const files = fs.readdirSync(PUBLIC_DATA_DIR).filter((f) => f.endsWith('.json'));
  for (const f of files) {
    try {
      const body = JSON.parse(fs.readFileSync(path.join(PUBLIC_DATA_DIR, f), 'utf8'));
      const roomId = body?.id ?? f.replace(/\.json$/, '');
      const entries = Array.isArray(body?.entries) ? body.entries : [];
      const room = { roomId, file: f, entries };
      JSON_INDEX.push(room);
      // Index by exact audio filename (only single-file entries; skip
      // broken concats that contain spaces — those are the bug we're fixing).
      for (const e of entries) {
        const audioField = typeof e?.audio === 'string' ? e.audio.trim() : '';
        if (audioField && !audioField.includes(' ')) {
          AUDIO_INDEX.set(audioField, { room, entry: e });
        }
      }
    } catch {
      /* skip malformed */
    }
  }
  return JSON_INDEX;
}

function tokenize(s) {
  return s
    .toLowerCase()
    .replace(/\.mp3$/i, '')
    .replace(/[_\-]+/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
}

function extractEntryText(entry) {
  return (
    entry?.copy?.en ??
    entry?.copy_en ??
    entry?.text_en ??
    entry?.body?.en ??
    null
  );
}

function findEntryForFilename(filename) {
  buildJsonIndex();
  // Pass 1: exact audio-field match. Each room JSON declares its own audio
  // filename per entry — the source of truth. This catches positional names
  // (ai_free_1_en.mp3) that the slug heuristic can't.
  const direct = AUDIO_INDEX.get(filename);
  if (direct) {
    const text = extractEntryText(direct.entry);
    if (text) return { room: direct.room, entry: direct.entry, text: String(text) };
  }

  // Pass 2: room/slug token-overlap heuristic (fallback for any audio field
  // that wasn't a clean filename in the JSON).
  const fnTokens = tokenize(filename);
  let bestRoom = null;
  let bestScore = 0;
  for (const room of JSON_INDEX) {
    const roomTokens = tokenize(room.roomId);
    const overlap = roomTokens.filter((t) => fnTokens.includes(t)).length;
    if (overlap > bestScore && overlap >= Math.ceil(roomTokens.length * 0.5)) {
      bestScore = overlap;
      bestRoom = room;
    }
  }
  if (!bestRoom) return null;
  const remainder = fnTokens.filter((t) => !tokenize(bestRoom.roomId).includes(t));
  let bestEntry = null;
  let bestEntryScore = 0;
  for (const e of bestRoom.entries) {
    const slugTokens = tokenize(e?.slug ?? '');
    if (slugTokens.length === 0) continue;
    const overlap = slugTokens.filter((t) => remainder.includes(t)).length;
    if (overlap > bestEntryScore) {
      bestEntryScore = overlap;
      bestEntry = e;
    }
  }
  if (!bestEntry || bestEntryScore === 0) return null;
  const text = extractEntryText(bestEntry);
  if (!text) return null;
  return { room: bestRoom, entry: bestEntry, text: String(text) };
}

// ─── false-positive filter ────────────────────────────────────────────────

function isLikelyTypoNotConcatenation(name) {
  // "Names with only 1 space that looks like a typo not a concatenation."
  // Three patterns count as typo:
  //   (a) tail too short to be a real filename: "foo bar.mp3" where "bar" < 4 chars
  //   (b) space-before-non-alnum: "foo _bar.mp3" — second segment starts with _
  //       (caught: building_simple_routines _free.mp3)
  //   (c) split would produce a chunk that is not an .mp3 filename at all
  //       (caught: "abc _def.mp3" → first chunk "abc" isn't *.mp3)
  const spaceCount = (name.match(/ /g) ?? []).length;
  if (spaceCount !== 1) return false;
  const [before, after] = name.split(' ');
  const tail = after.replace(/\.mp3$/i, '');
  if (tail.length < 4) return true;
  if (/^[_\W]/.test(after)) return true;
  if (!/\.mp3$/i.test(before)) return true;
  return false;
}

function filterBrokenList(names) {
  return names.filter((n) => {
    if (n.includes('music/')) return false;
    if (n.includes('kids/')) return false;
    if (n.includes('(')) return false;
    if (isLikelyTypoNotConcatenation(n)) return false;
    return true;
  });
}

// ─── ElevenLabs ───────────────────────────────────────────────────────────

let tts = null;
function getTts() {
  if (!tts) {
    if (!TTS_KEY) throw new Error('ELEVENLABS_API_KEY missing in .env');
    tts = new ElevenLabsClient({ apiKey: TTS_KEY });
  }
  return tts;
}

async function streamToBuffer(stream) {
  const chunks = [];
  for await (const chunk of stream) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  return Buffer.concat(chunks);
}

async function generateMp3(text, retry = false) {
  try {
    const audio = await getTts().generate({ voice: VOICE_ID, model_id: MODEL_ID, text });
    return Buffer.isBuffer(audio) ? audio : await streamToBuffer(audio);
  } catch (err) {
    const status = err?.statusCode ?? err?.status ?? err?.response?.status;
    if (status === 429 && !retry) {
      await sleep(2000);
      return generateMp3(text, true);
    }
    throw err;
  }
}

async function uploadToBucket(filename, buffer) {
  const { error } = await supabaseStorage.storage.from(BUCKET).upload(filename, buffer, {
    contentType: 'audio/mpeg',
    upsert: true,
  });
  if (error) throw new Error(`upload failed: ${error.message}`);
}

async function deleteFromBucket(filename) {
  const { error } = await supabaseStorage.storage.from(BUCKET).remove([filename]);
  if (error) throw new Error(`delete failed: ${error.message}`);
}

// ─── PHASE 2: fix one broken object ───────────────────────────────────────

async function fixOne(brokenName) {
  const splits = brokenName.split(' ').map((s) => s.trim()).filter(Boolean);
  const perFile = [];
  for (const filename of splits) {
    const found = findEntryForFilename(filename);
    perFile.push({ filename, found });
  }

  // Manifest: planned splits.
  manifest({
    action: 'plan',
    broken_name: brokenName,
    splits: perFile.map((p) => ({
      filename: p.filename,
      matched_room: p.found?.room?.roomId ?? null,
      matched_slug: p.found?.entry?.slug ?? null,
      text_chars: p.found?.text?.length ?? 0,
    })),
  });

  if (perFile.some((p) => !p.found)) {
    manifest({ action: 'skip', broken_name: brokenName, reason: 'one_or_more_unmatched' });
    return { ok: false, reason: 'unmatched' };
  }

  if (DRY_RUN) {
    manifest({ action: 'dryrun', broken_name: brokenName });
    return { ok: true, dryRun: true };
  }

  fs.mkdirSync(FIXED_DIR, { recursive: true });
  const uploaded = [];
  for (const p of perFile) {
    try {
      const buf = await generateMp3(p.found.text);
      const localPath = path.join(FIXED_DIR, p.filename);
      fs.writeFileSync(localPath, buf);
      await uploadToBucket(p.filename, buf);
      manifest({ action: 'upload', broken_name: brokenName, target: p.filename, bytes: buf.length });
      uploaded.push(p.filename);
      await sleep(RATE_LIMIT_MS);
    } catch (err) {
      manifest({ action: 'fail', broken_name: brokenName, target: p.filename, error: err?.message ?? String(err) });
      return { ok: false, reason: err?.message ?? String(err), uploaded };
    }
  }
  // All splits uploaded → safe to delete the broken concatenated object.
  try {
    await deleteFromBucket(brokenName);
    manifest({ action: 'delete', broken_name: brokenName });
  } catch (err) {
    manifest({ action: 'fail', broken_name: brokenName, error: `delete: ${err?.message ?? String(err)}` });
    return { ok: false, reason: err?.message ?? String(err) };
  }
  return { ok: true };
}

// ─── main ─────────────────────────────────────────────────────────────────

(async () => {
  // Phase 1: query (always runs if list missing or --query passed).
  if (QUERY_ONLY || !fs.existsSync(BROKEN_LIST_PATH)) {
    console.log('Phase 1: querying storage.objects…');
    const raw = await queryBrokenObjects();
    console.log(`  raw matches: ${raw.length}`);
    const filtered = filterBrokenList(raw);
    console.log(`  after false-positive filter: ${filtered.length}`);
    fs.writeFileSync(BROKEN_LIST_PATH, JSON.stringify(filtered.map((name) => ({ broken_filename: name })), null, 2));
    console.log(`  wrote ${BROKEN_LIST_PATH}`);
    if (QUERY_ONLY) return;
  }

  // Phase 2.
  const broken = JSON.parse(fs.readFileSync(BROKEN_LIST_PATH, 'utf8'));
  const total = broken.length;
  console.log(`Phase 2: ${DRY_RUN ? 'DRY-RUN' : 'LIVE'} fix over ${total} broken objects…`);
  // Reset manifest at start.
  fs.writeFileSync(MANIFEST_PATH, '');
  manifest({ action: 'start', mode: DRY_RUN ? 'dry-run' : 'live', total });

  let succeeded = 0;
  let consecutiveFails = 0;
  const failures = [];
  for (let i = 0; i < total; i++) {
    const item = broken[i];
    const name = item.broken_filename ?? item.name ?? item;
    console.log(`[${i + 1}/${total}] ${name}`);
    try {
      const res = await fixOne(name);
      if (res.ok) {
        succeeded++;
        consecutiveFails = 0;
      } else {
        failures.push({ broken_filename: name, reason: res.reason });
        consecutiveFails++;
      }
    } catch (err) {
      failures.push({ broken_filename: name, reason: err?.message ?? String(err) });
      consecutiveFails++;
      manifest({ action: 'fail', broken_name: name, error: err?.message ?? String(err) });
    }
    if (consecutiveFails >= MAX_CONSECUTIVE_FAILS) {
      console.error(`Aborting: ${MAX_CONSECUTIVE_FAILS} consecutive failures.`);
      manifest({ action: 'abort', reason: 'consecutive_failures' });
      break;
    }
  }
  fs.writeFileSync(FAILURES_PATH, JSON.stringify(failures, null, 2));
  manifest({ action: 'done', succeeded, failed: failures.length, total });
  console.log(`\nDone. ${succeeded}/${total} succeeded. ${failures.length} failures → ${FAILURES_PATH}`);
})().catch((err) => {
  console.error('Fatal:', err);
  process.exit(1);
});
