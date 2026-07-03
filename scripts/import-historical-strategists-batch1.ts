/**
 * Script to import Historical Strategists VIP9 rooms (Batch 1: 5 rooms)
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

const roomFiles = [
  'genghis_khan_vip9_vol3.json',
  'hannibal_barca_grand_strategy_vip9_vol1.json',
  'hannibal_barca_grand_strategy_vip9_vol2.json',
  'kautilya_grand_strategy_vip9_vol1.json',
  'kautilya_grand_strategy_vip9_vol2.json',
];

type JsonRecord = Record<string, unknown>;

function isRecord(value: unknown): value is JsonRecord {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function hasToLowerCase(value: unknown): value is { toLowerCase(): string } {
  return (
    value !== null &&
    typeof value === 'object' &&
    'toLowerCase' in value &&
    typeof value.toLowerCase === 'function'
  ) || typeof value === 'string';
}

function extractKeywords(entries: unknown[]): string[] {
  const keywords = new Set<string>();
  
  entries.forEach((entryValue) => {
    if (!isRecord(entryValue)) return;
    const entry = entryValue;
    if (entry.keywords_en && Array.isArray(entry.keywords_en)) {
      entry.keywords_en.forEach((kw) => {
        if (hasToLowerCase(kw)) keywords.add(kw.toLowerCase());
      });
    }
    if (entry.keywords_vi && Array.isArray(entry.keywords_vi)) {
      entry.keywords_vi.forEach((kw) => {
        if (hasToLowerCase(kw)) keywords.add(kw.toLowerCase());
      });
    }
  });
  
  return Array.from(keywords);
}

async function importRooms() {
  console.log('🚀 Starting Historical Strategists batch 1 import...\n');
  
  const dataDir = join(process.cwd(), 'public/data');
  let imported = 0;
  let errors = 0;

  for (const fileName of roomFiles) {
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
      const entries = Array.isArray(roomData.entries) ? roomData.entries : [];

      const keywords = extractKeywords(entries);

      const roomRecord = {
        id: roomData.id,
        schema_id: roomData.id,
        title_en: title.en,
        title_vi: title.vi,
        room_essay_en: content.en || '',
        room_essay_vi: content.vi || '',
        entries,
        keywords: keywords,
        tier: 'vip9',
        domain: 'Strategy',
      };

      const { error } = await supabase
        .from('rooms')
        .upsert(roomRecord, { onConflict: 'id' });

      if (error) {
        console.error(`❌ Error importing ${roomData.id}:`, error.message);
        errors++;
      } else {
        console.log(`✅ Imported: ${roomData.id} (${keywords.length} keywords, ${entries.length} entries)`);
        imported++;
      }
    } catch (err) {
      console.error(`❌ Failed to process ${fileName}:`, err);
      errors++;
    }
  }

  console.log(`\n📊 Import Summary:`);
  console.log(`   ✅ Imported: ${imported}`);
  console.log(`   ❌ Errors: ${errors}`);
  console.log(`\n✨ Import complete!`);
}

importRooms().catch(console.error);
