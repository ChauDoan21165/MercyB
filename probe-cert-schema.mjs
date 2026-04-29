// Read-only probes of the production certificates schema.
// No writes, no mutations.

import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const URL = process.env.VITE_SUPABASE_URL;
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!URL || !KEY) { console.error('env missing'); process.exit(1); }

const sb = createClient(URL, KEY, { auth: { persistSession: false, autoRefreshToken: false } });

console.log('── 1. certificates table — column shape from a sample row ──');
const certs = await sb.from('certificates').select('*').limit(1);
if (certs.error) console.log('  error:', certs.error.message);
else if (!certs.data?.[0]) console.log('  table exists but no rows');
else {
  console.log('  columns:', Object.keys(certs.data[0]).sort());
  console.log('  sample row:', certs.data[0]);
}

console.log('\n── 2. certificate_types or similar catalog table ──');
const types = await sb.from('certificate_types').select('*').limit(2);
if (types.error) console.log('  error:', types.error.message);
else console.log('  rows:', types.data?.length, 'sample:', types.data?.[0]);

console.log('\n── 3. RPC verify_certificate(p_code uuid) — invoke with the row\'s code ──');
const v = await sb.rpc('verify_certificate', { p_code: '4e924bb8-2c7f-430e-8026-b79335abd19e' });
if (v.error) console.log('  error:', v.error.message);
else console.log('  data:', v.data);

console.log('\n── 4. RPC verify_certificate(certificate_code uuid) — alt arg name ──');
const v2 = await sb.rpc('verify_certificate', { certificate_code: '4e924bb8-2c7f-430e-8026-b79335abd19e' });
if (v2.error) console.log('  error:', v2.error.message);
else console.log('  data:', v2.data);

console.log('\n── 5. RPC get_user_certificates ──');
const g = await sb.rpc('get_user_certificates', { p_user_id: '397a6ab7-1d3a-480f-9f02-9021a438d02a' });
if (g.error) {
  console.log('  p_user_id error:', g.error.message);
  const g2 = await sb.rpc('get_user_certificates', { user_id: '397a6ab7-1d3a-480f-9f02-9021a438d02a' });
  if (g2.error) console.log('  user_id error:', g2.error.message);
  else console.log('  user_id ok, sample:', g2.data?.[0]);
} else {
  console.log('  p_user_id ok, sample:', g.data?.[0]);
}

console.log('\n── 6. feature_flags row ──');
const ff = await sb.from('feature_flags').select('*').eq('flag_key', 'certificates_enabled').maybeSingle();
if (ff.error) console.log('  error:', ff.error.message);
else console.log('  row:', ff.data);
