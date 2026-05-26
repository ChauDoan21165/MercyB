/**
 * DEV TIER AUDIT SCRIPT
 * 
 * Finds rooms with non-canonical tier values in the database.
 * Run this once, fix the DB data, then delete this file.
 * 
 * Usage: npx tsx scripts/audit-db-tiers.ts
 */

import { createClient } from '@supabase/supabase-js';
import { normalizeTier, TIER_ID_TO_LABEL, type TierId } from '../src/lib/constants/tiers';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || '';
const SUPABASE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || '';

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function auditTiers() {
  console.log('\n🔍 TIER AUDIT - Finding non-canonical tier values\n');

  const { data, error } = await supabase
    .from('rooms')
    .select('id, title_en, tier')
    .neq('is_active', false);

  if (error) {
    console.error('❌ Error fetching rooms:', error);
    process.exit(1);
  }

  const issues: Array<{ id: string; title: string; current: string; expected: string }> = [];

  (data || []).forEach((room: any) => {
    const normalized = normalizeTier(room.tier || '');
    const canonical = TIER_ID_TO_LABEL[normalized as TierId];

    // Check if DB tier matches canonical label
    if (room.tier !== canonical) {
      issues.push({
        id: room.id,
        title: room.title_en || 'Untitled',
        current: room.tier || 'null',
        expected: canonical,
      });
    }
  });

  if (issues.length === 0) {
    console.log('✅ All room tiers are canonical!\n');
    return;
  }

  console.log(`❌ Found ${issues.length} rooms with non-canonical tier values:\n`);
  
  issues.forEach(({ id, title, current, expected }) => {
    console.log(`Room: ${id}`);
    console.log(`  Title: ${title}`);
    console.log(`  Current: "${current}"`);
    console.log(`  Expected: "${expected}"`);
    console.log();
  });

  console.log('🔧 FIX IN SUPABASE UI:');
  console.log('   1. Open Lovable Cloud → Database');
  console.log('   2. Find each room by ID');
  console.log('   3. Set tier to exactly the Expected value');
  console.log('   4. Re-run this script to verify\n');
}

auditTiers();
