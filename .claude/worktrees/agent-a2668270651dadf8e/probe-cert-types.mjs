// Read-only probe: full certificate_types catalog + usage by cert_type.
import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const sb = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

console.log('── full certificate_types catalog ──');
const { data: types, error: typesErr } = await sb
  .from('certificate_types')
  .select('cert_type, category, milestone_value, display_name_en, display_name_vi, sort_order, is_active')
  .order('sort_order', { ascending: true });
if (typesErr) console.log('error:', typesErr);
else {
  console.log('total rows:', types?.length ?? 0);
  for (const t of types ?? []) {
    console.log(`  ${t.sort_order?.toString().padStart(4)} | ${t.cert_type.padEnd(28)} | cat=${(t.category||'').padEnd(12)} | val=${String(t.milestone_value ?? '').padStart(5)} | active=${t.is_active}`);
  }
}

console.log('\n── distinct issued cert_type usage ──');
const { data: certs } = await sb.from('certificates').select('cert_type');
const counts = {};
for (const c of certs ?? []) counts[c.cert_type] = (counts[c.cert_type] || 0) + 1;
for (const [k, v] of Object.entries(counts).sort()) {
  console.log(`  ${k.padEnd(28)} → ${v} issued`);
}
console.log(`  (total issued certs: ${certs?.length ?? 0})`);
