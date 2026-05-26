// One-off: delete 9 explicitly-listed orphan objects from `room-audio`.
// Each name is fully enumerated by the user; no wildcards, no globs.

import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const URL = process.env.VITE_SUPABASE_URL;
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!URL || !KEY) { console.error('env missing VITE_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY'); process.exit(1); }

const TARGETS = [
  'building_simple_routines _free.mp3',
  'bur_vip1_1_en.mp3 bur_vip1_2_en.mp3 bur_vip1_3_en.mp3 bur_vip1_4_en.mp3',
  'bur_vip2_1_en.mp3 bur_vip2_2_en.mp3 bur_vip2_3_en.mp3 bur_vip2_4_en.mp3 bur_vip2_5_en.mp3 bur_vip2_6_en.mp3',
  'eng_write_vip2_1_en.mp3 eng_write_vip2_2_en.mp3 eng_write_vip2_3_en.mp3 eng_write_vip2_4_en.mp3 eng_write_vip2_5_en.mp3 eng_write_vip2_6_en.mp3',
  'mmh_vip2_1_en.mp3 mmh_vip2_2_en.mp3 mmh_vip2_3_en.mp3 mmh_vip2_4_en.mp3 mmh_vip2_5_en.mp3 mmh_vip2_6_en.mp3',
  'nut_vip1_1_en.mp3 nut_vip1_2_en.mp3 nut_vip1_3_en.mp3 nut_vip1_4_en.mp3',
  'schizo_free_daily_routine.mp3 schizo_free_managing_symptoms.mp3 schizo_free_support_system.mp3 schizo_free_grounding_techniques.mp3',
  'schizo_under_vip2_1_en.mp3 schizo_under_vip2_2_en.mp3 schizo_under_vip2_3_en.mp3 schizo_under_vip2_4_en.mp3 schizo_under_vip2_5_en.mp3 schizo_under_vip2_6_en.mp3',
  'world former_vip3_24_en.mp3',
];

const sb = createClient(URL, KEY, { auth: { persistSession: false, autoRefreshToken: false } });

console.log(`Deleting ${TARGETS.length} orphans from room-audio…`);
const { data, error } = await sb.storage.from('room-audio').remove(TARGETS);

if (error) {
  console.error('remove() error:', JSON.stringify(error, null, 2));
  process.exit(1);
}

const removed = new Set((data ?? []).map((r) => r.name));
console.log(`\nPer-file result:`);
let okCount = 0;
let missCount = 0;
for (const name of TARGETS) {
  if (removed.has(name)) {
    console.log(`  ✓ removed: ${name}`);
    okCount++;
  } else {
    console.log(`  ⚠ not in remove() response (likely already absent): ${name}`);
    missCount++;
  }
}

console.log(`\nremove() data length: ${data?.length ?? 0}`);
console.log(`Summary: ${okCount} confirmed removed, ${missCount} not in response.`);
