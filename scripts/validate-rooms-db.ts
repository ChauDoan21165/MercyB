/**
 * CI script to validate rooms table data integrity
 * Run with: npx tsx scripts/validate-rooms-db.ts
 * 
 * Validates:
 * - ID format (snake_case)
 * - Tier maps to valid TierId
 * - Title fields are non-empty
 * - Entry data is valid JSON
 */

import { createClient } from '@supabase/supabase-js';
import { normalizeTier, isValidTierId, type TierId } from '../src/lib/constants/tiers';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || '';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

interface RoomRow {
  id: string;
  title_en: string;
  title_vi: string;
  tier: string | null;
  entries: any;
}

async function validateRoomsDB() {
  console.log('🔍 Fetching rooms from database...');
  
  const { data: rooms, error } = await supabase
    .from('rooms')
    .select('id, title_en, title_vi, tier, entries');

  if (error) {
    console.error('❌ Failed to fetch rooms:', error);
    process.exit(1);
  }

  if (!rooms || rooms.length === 0) {
    console.error('❌ No rooms found in database');
    process.exit(1);
  }

  console.log(`✅ Found ${rooms.length} rooms`);
  console.log('\n📋 Validating room data...\n');

  const errors: string[] = [];
  let validCount = 0;

  for (const room of rooms as RoomRow[]) {
    const roomErrors: string[] = [];

    // Validate ID format (should be snake_case, lowercase)
    if (!/^[a-z0-9_]+$/.test(room.id)) {
      roomErrors.push(`Invalid ID format: "${room.id}" (must be lowercase snake_case)`);
    }

    // Validate tier maps to valid TierId
    const normalizedTier = normalizeTier(room.tier);
    if (!isValidTierId(normalizedTier)) {
      roomErrors.push(`Invalid tier: "${room.tier}" normalizes to "${normalizedTier}" which is not a valid TierId`);
    }

    // Validate title_en is non-empty
    if (!room.title_en || room.title_en.trim().length === 0) {
      roomErrors.push('Missing or empty title_en');
    }

    // Validate title_vi is non-empty
    if (!room.title_vi || room.title_vi.trim().length === 0) {
      roomErrors.push('Missing or empty title_vi');
    }

    // Validate entries is valid array
    if (!Array.isArray(room.entries)) {
      roomErrors.push('Entries field is not an array');
    } else if (room.entries.length === 0) {
      roomErrors.push('Entries array is empty (room has no content)');
    }

    if (roomErrors.length > 0) {
      errors.push(`\n❌ Room: ${room.id}`);
      roomErrors.forEach(err => errors.push(`   - ${err}`));
    } else {
      validCount++;
    }
  }

  console.log(`\n📊 Validation Results:`);
  console.log(`   ✅ Valid rooms: ${validCount}`);
  console.log(`   ❌ Invalid rooms: ${errors.length > 0 ? rooms.length - validCount : 0}`);

  if (errors.length > 0) {
    console.log('\n🚨 Validation Errors:\n');
    errors.forEach(err => console.log(err));
    console.log('\n❌ CI GATE FAILED: Fix the above issues before deployment\n');
    process.exit(1);
  }

  console.log('\n✅ All rooms passed validation! Database is clean.\n');
  process.exit(0);
}

validateRoomsDB().catch(err => {
  console.error('❌ Unexpected error:', err);
  process.exit(1);
});
