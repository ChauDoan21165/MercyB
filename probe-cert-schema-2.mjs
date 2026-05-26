// Follow-up probes: issue_certificate signature/return + get_user_certificates columns.
// Read-only probes only — issue_certificate is called with the EXISTING cert's
// args so the UNIQUE constraint makes it idempotent (no new row is created).

import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const sb = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

console.log('── A. issue_certificate — call with no args to learn signature ──');
const a = await sb.rpc('issue_certificate', {});
console.log('  error:', a.error?.message);
console.log('  hint :', a.error?.hint);
console.log('  details:', a.error?.details);

console.log('\n── B. issue_certificate — idempotent call with existing cert ──');
// Existing row: user_id=397a6ab7…, cert_type=xp_100, milestone_value=100.
// Try the most-likely arg names; if wrong, will error and we learn the right ones.
const argShapes = [
  { p_user_id: '397a6ab7-1d3a-480f-9f02-9021a438d02a', p_cert_type: 'xp_100', p_milestone_value: 100 },
  { user_id:   '397a6ab7-1d3a-480f-9f02-9021a438d02a',   cert_type: 'xp_100',   milestone_value: 100 },
];
for (const args of argShapes) {
  const r = await sb.rpc('issue_certificate', args);
  console.log('  args:', Object.keys(args).join(','), '| error:', r.error?.message, '| data:', r.data);
  if (!r.error) break;
}

console.log('\n── C. get_user_certificates — column shape via admin probe ──');
// Try several arg names + see if data has rows with full shape.
const c = await sb.rpc('get_user_certificates', { p_user_id: '397a6ab7-1d3a-480f-9f02-9021a438d02a' });
console.log('  data length:', Array.isArray(c.data) ? c.data.length : '<not array>');
console.log('  data:', c.data);
console.log('  error:', c.error?.message);
