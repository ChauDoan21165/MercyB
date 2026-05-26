// Seed `sleep_improvement_free` from public/data/sleep_improvement_free.json
// into `public.rooms` + `public.room_entries`. Idempotent: upserts the room
// and replaces the entries (DELETE then INSERT) so reruns converge.

import 'dotenv/config';
import fs from 'node:fs';
import { createClient } from '@supabase/supabase-js';

const URL = process.env.VITE_SUPABASE_URL;
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!URL || !KEY) { console.error('env missing'); process.exit(1); }

const sb = createClient(URL, KEY, { auth: { persistSession: false, autoRefreshToken: false } });

const JSON_PATH = '/Users/admin/MercyB/public/data/sleep_improvement_free.json';
const room = JSON.parse(fs.readFileSync(JSON_PATH, 'utf8'));
const ROOM_ID = room.id;
console.log(`Loaded ${ROOM_ID} from JSON. ${room.entries?.length ?? 0} entries.`);

// ── Map JSON → rooms row (using actual prod schema, discovered via probe) ──
// Prod columns differ from migration files (no schema_id / entries JSONB).
// Convention from existing free-tier rooms: domain='core' for mental-health,
// track='bonus', status='active', app_key='mercy_blade'.
const titleEn = room.title?.en ?? room.name ?? ROOM_ID;
const titleVi = room.title?.vi ?? room.name_vi ?? ROOM_ID;
const roomRow = {
  id: ROOM_ID,
  slug: ROOM_ID,
  title: titleEn,
  title_en: titleEn,
  title_vi: titleVi,
  room_essay_en: room.description ?? null,
  room_essay_vi: room.description_vi ?? null,
  content_en: room.content?.en ?? room.description ?? '',
  content_vi: room.content?.vi ?? room.description_vi ?? '',
  domain: 'core',
  tier: room.tier ?? 'free',
  track: 'bonus',
  status: 'active',
  app_key: 'mercy_blade',
  required_rank: 0,
  required_vip_rank: 0,
  is_active: true,
  is_locked: false,
  keywords: [...(room.keywords_en ?? []), ...(room.keywords_vi ?? [])],
};

console.log('\nUpserting rooms row…');
const upsert = await sb.from('rooms').upsert(roomRow, { onConflict: 'id' }).select();
if (upsert.error) { console.error('rooms upsert failed:', upsert.error); process.exit(1); }
console.log(`  rooms upserted: ${upsert.data?.length ?? 0} row.`);

// ── Replace room_entries for this room ────────────────────────────────
console.log('\nClearing existing room_entries…');
const del = await sb.from('room_entries').delete().eq('room_id', ROOM_ID);
if (del.error) { console.error('delete failed:', del.error); process.exit(1); }
console.log('  cleared.');

const entryRows = (room.entries ?? []).map((e, i) => ({
  room_id: ROOM_ID,
  index: i + 1,
  slug: e.slug ?? `entry-${i + 1}`,
  copy_en: e.copy?.en ?? e.copy_en ?? '',
  copy_vi: e.copy?.vi ?? e.copy_vi ?? '',
  audio: typeof e.audio === 'string' ? e.audio : null,
  tags: Array.isArray(e.tags) ? e.tags : null,
  metadata: {
    keywords_en: e.keywords_en ?? [],
    keywords_vi: e.keywords_vi ?? [],
  },
}));

console.log(`\nInserting ${entryRows.length} entries…`);
const ins = await sb.from('room_entries').insert(entryRows).select();
if (ins.error) { console.error('insert failed:', ins.error); process.exit(1); }
console.log(`  inserted: ${ins.data?.length ?? 0} rows.`);

// ── Verify ────────────────────────────────────────────────────────────
console.log('\nVerification:');
const verifyRoom = await sb.from('rooms').select('id, schema_id, title_en, title_vi, tier').eq('id', ROOM_ID).maybeSingle();
console.log('  rooms row:', verifyRoom.data);
const { count, error: countErr } = await sb
  .from('room_entries')
  .select('*', { count: 'exact', head: true })
  .eq('room_id', ROOM_ID);
if (countErr) { console.error('count failed:', countErr); process.exit(1); }
console.log(`  room_entries count for ${ROOM_ID}: ${count}`);
