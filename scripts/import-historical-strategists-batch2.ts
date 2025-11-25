/**
 * Script to import Historical Strategists VIP9 rooms (Batch 2: 4 rooms)
 * Julius Caesar (3 volumes) + Machiavelli (1 room)
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join } from 'path';

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const roomFiles = [
  'julius_caesar_vip9_vol1.json',
  'julius_caesar_vip9_vol2.json',
  'julius_caesar_vip9_vol3.json',
  'machiavelli_strategy_1_vip9.json',
];

function extractKeywords(entries: any[]): string[] {
  const keywords = new Set<string>();
  
  entries.forEach(entry => {
    if (entry.keywords_en && Array.isArray(entry.keywords_en)) {
      entry.keywords_en.forEach((kw: string) => keywords.add(kw.toLowerCase()));
    }
    if (entry.keywords_vi && Array.isArray(entry.keywords_vi)) {
      entry.keywords_vi.forEach((kw: string) => keywords.add(kw.toLowerCase()));
    }
  });
  
  return Array.from(keywords);
}

async function importRooms() {
  console.log('🚀 Starting Historical Strategists batch 2 import...\n');
  
  const dataDir = join(process.cwd(), 'public/data');
  let imported = 0;
  let errors = 0;

  for (const fileName of roomFiles) {
    try {
      const filePath = join(dataDir, fileName);
      const fileContent = readFileSync(filePath, 'utf-8');
      const roomData = JSON.parse(fileContent);

      const keywords = extractKeywords(roomData.entries || []);

      const roomRecord = {
        id: roomData.id,
        schema_id: roomData.id,
        title_en: roomData.title.en,
        title_vi: roomData.title.vi,
        room_essay_en: roomData.content.en || '',
        room_essay_vi: roomData.content.vi || '',
        entries: roomData.entries || [],
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
        console.log(`✅ Imported: ${roomData.id} (${keywords.length} keywords, ${roomData.entries.length} entries)`);
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
