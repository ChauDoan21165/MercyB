// Read-only probe: find candidate source-of-truth tables for each
// certificate category (xp, streak, vocab, pronunciation, writing, rooms).
import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const sb = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

// Candidate tables for each category — try each, report whether it exists
// (presence of column shape on a one-row probe).
const candidates = [
  // XP
  ['profiles',                      ['id', 'total_xp', 'current_streak_days', 'longest_streak_days']],
  ['xp_events',                     ['*']],
  ['user_xp_events',                ['*']],
  // Streak
  ['user_streaks',                  ['*']],
  ['streaks',                       ['*']],
  ['daily_activity',                ['*']],
  // Vocab SRS
  ['vocabulary_reviews',            ['*']],
  ['vocab_reviews',                 ['*']],
  ['user_vocabulary',               ['*']],
  ['vocabulary_progress',           ['*']],
  ['srs_reviews',                   ['*']],
  // Pronunciation drills
  ['pronunciation_attempts',        ['*']],
  ['pronunciation_drills',          ['*']],
  ['pronunciation_results',         ['*']],
  ['speech_attempts',               ['*']],
  // Writing submissions
  ['writing_submissions',           ['*']],
  ['writing_practice',              ['*']],
  ['writing_attempts',              ['*']],
  // Rooms completed
  ['user_room_progress',            ['*']],
  ['room_progress',                 ['*']],
  ['user_rooms',                    ['*']],
  ['room_completions',              ['*']],
];

for (const [table, cols] of candidates) {
  const { data, error } = await sb.from(table).select(cols.join(',')).limit(1);
  if (error) {
    if (!/does not exist|relation .* does not exist|Could not find the table/i.test(error.message)) {
      console.log(`✓ ${table.padEnd(28)} EXISTS (other err: ${error.message.slice(0, 60)})`);
    }
    // missing — silent
    continue;
  }
  if (!data || data.length === 0) {
    console.log(`✓ ${table.padEnd(28)} EXISTS (empty)`);
    continue;
  }
  console.log(`✓ ${table.padEnd(28)} EXISTS, columns: ${Object.keys(data[0]).sort().join(', ')}`);
}
