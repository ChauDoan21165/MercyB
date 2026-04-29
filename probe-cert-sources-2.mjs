// Round 2 probe — profile shape + count-style queries to verify usable signals.
import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const sb = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

console.log('── profiles row shape (one sample) ──');
const p = await sb.from('profiles').select('*').limit(1);
if (p.error) console.log('err:', p.error.message);
else if (p.data?.[0]) console.log('  cols:', Object.keys(p.data[0]).sort().join(', '));

console.log('\n── xp_events shape ──');
const x = await sb.from('xp_events').select('*').limit(1);
if (x.error) console.log('err:', x.error.message);
else if (!x.data?.[0]) {
  // Empty — try inferring shape via 0-row select with column names from metadata.
  const x2 = await sb.from('xp_events').select('id,user_id,event_kind,xp_amount,created_at').limit(1);
  console.log('  zero rows; named-column probe error:', x2.error?.message ?? 'no error');
}
else console.log('  cols:', Object.keys(x.data[0]).sort().join(', '));

console.log('\n── user_vocabulary shape ──');
const v = await sb.from('user_vocabulary').select('id,user_id,word,review_state,interval_days,ease_factor,next_review_at,reviews,mastered_at').limit(1);
console.log('  named-column probe error:', v.error?.message ?? 'no error');

console.log('\n── speech_attempts: count style + per-user count probe ──');
const sa = await sb.from('speech_attempts').select('id', { count: 'exact', head: true });
console.log('  total speech_attempts:', sa.count, 'err:', sa.error?.message ?? null);

console.log('\n── user_room_progress: completion criterion ──');
const u = await sb.from('user_room_progress').select('progress_pct, repeat_count, user_id').limit(5);
if (u.error) console.log('err:', u.error.message);
else console.log('  sample rows:', JSON.stringify(u.data));

console.log('\n── more candidates: streak fields, writing tables ──');
for (const t of ['user_writing_submissions', 'writing_practice_sessions', 'mercy_writing_attempts', 'practice_recommendations', 'streaks_v2', 'user_activity']) {
  const r = await sb.from(t).select('*').limit(1);
  if (!r.error) console.log(`  ✓ ${t} EXISTS, cols:`, r.data?.[0] ? Object.keys(r.data[0]).sort().join(', ') : '(empty)');
}
