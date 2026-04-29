// Round 3: pin down column shapes for empty tables (xp_events, user_vocabulary,
// user_writing_submissions) by trying common SRS / event column names. The probe
// errors back will name the columns it doesn't recognize.
import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const sb = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

async function tryProbe(table, cols) {
  const r = await sb.from(table).select(cols).limit(1);
  console.log(`  ${table}.${cols} → ${r.error ? 'err: ' + r.error.message : (r.data?.[0] ? 'ok cols=' + Object.keys(r.data[0]).join(',') : 'ok empty')}`);
}

console.log('── xp_events ──');
for (const c of [
  'id,user_id,amount,created_at',
  'id,user_id,xp,created_at',
  'id,user_id,points,reason,created_at',
  'id,user_id,event_type,xp_amount,created_at',
  'id,user_id,delta,kind,occurred_at',
]) await tryProbe('xp_events', c);

console.log('\n── user_vocabulary ──');
for (const c of [
  'id,user_id,word,mastered',
  'id,user_id,word,interval,due',
  'id,user_id,word_id,box,next_review',
  'id,user_id,vocabulary_id,mastery_level,next_review_at',
  'id,user_id,word_id,is_mastered',
  'id,user_id,word,reviews_count,mastery,last_reviewed_at',
]) await tryProbe('user_vocabulary', c);

console.log('\n── user_writing_submissions ──');
for (const c of [
  'id,user_id,prompt_id,submitted_at',
  'id,user_id,prompt,text,created_at',
  'id,user_id,content,score,submitted_at',
  'id,user_id,prompt_id,band_score,created_at',
]) await tryProbe('user_writing_submissions', c);

console.log('\n── speech_attempts: distinct lines per user (drill granularity)? ──');
const r = await sb.from('speech_attempts').select('user_id,line_id,room_id,overall_score').limit(5);
console.log('  sample:', JSON.stringify(r.data));
