/**
 * VIP6 Room Restoration Script
 * Restores all deleted VIP6 rooms from JSON files in public/data/
 */

import { createClient } from '@supabase/supabase-js';
import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

type JsonRecord = Record<string, unknown>;

function isRecord(value: unknown): value is JsonRecord {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

// Extract keywords from entries
function extractKeywords(entries: unknown[]): string[] {
  const keywords = new Set<string>();
  
  entries.forEach((entryValue) => {
    if (!isRecord(entryValue)) return;
    const entry = entryValue;
    if (entry.keywords_en && Array.isArray(entry.keywords_en)) {
      entry.keywords_en.forEach((kw: string) => keywords.add(kw.toLowerCase()));
    }
    if (entry.keywords_vi && Array.isArray(entry.keywords_vi)) {
      entry.keywords_vi.forEach((kw: string) => keywords.add(kw.toLowerCase()));
    }
  });
  
  return Array.from(keywords);
}

async function restoreVIP6Rooms() {
  console.log('🔧 Starting VIP6 room restoration...\n');
  
  const dataDir = join(process.cwd(), 'public/data');
  const files = readdirSync(dataDir);
  
  // Find all vip6_*.json files
  const vip6Files = files.filter(f => f.startsWith('vip6_') && f.endsWith('.json'));
  
  console.log(`📁 Found ${vip6Files.length} VIP6 JSON files\n`);
  
  let restored = 0;
  let errors = 0;

  for (const fileName of vip6Files) {
    try {
      const filePath = join(dataDir, fileName);
      const fileContent = readFileSync(filePath, 'utf-8');
      const parsed: unknown = JSON.parse(fileContent);
      if (!isRecord(parsed)) {
        throw new Error('Room JSON root is not an object');
      }
      const roomData = parsed;
      const title = isRecord(roomData.title) ? roomData.title : {};
      const content = isRecord(roomData.content) ? roomData.content : {};
      const safetyDisclaimer = isRecord(roomData.safety_disclaimer) ? roomData.safety_disclaimer : {};
      const crisisFooter = isRecord(roomData.crisis_footer) ? roomData.crisis_footer : {};
      const entries = Array.isArray(roomData.entries) ? roomData.entries : [];

      const keywords = extractKeywords(entries);

      const roomRecord = {
        id: roomData.id,
        schema_id: roomData.id,
        title_en: title.en || roomData.id,
        title_vi: title.vi || roomData.id,
        room_essay_en: content.en || '',
        room_essay_vi: content.vi || '',
        safety_disclaimer_en: safetyDisclaimer.en || '',
        safety_disclaimer_vi: safetyDisclaimer.vi || '',
        crisis_footer_en: crisisFooter.en || '',
        crisis_footer_vi: crisisFooter.vi || '',
        entries,
        keywords: keywords,
        tier: 'vip6', // Normalized
        domain: 'Shadow Psychology',
        is_demo: false,
      };

      const { error } = await supabase
        .from('rooms')
        .upsert(roomRecord, { onConflict: 'id' });

      if (error) {
        console.error(`❌ Error restoring ${roomData.id}:`, error.message);
        errors++;
      } else {
        console.log(`✅ Restored: ${roomData.id} (${keywords.length} keywords)`);
        restored++;
      }
    } catch (err: unknown) {
      console.error(`❌ Failed to process ${fileName}:`, getErrorMessage(err));
      errors++;
    }
  }

  console.log(`\n📊 Restoration Summary:`);
  console.log(`   ✅ Restored: ${restored}`);
  console.log(`   ❌ Errors: ${errors}`);
  console.log(`\n✨ VIP6 restoration complete!`);
}

restoreVIP6Rooms().catch(console.error);
