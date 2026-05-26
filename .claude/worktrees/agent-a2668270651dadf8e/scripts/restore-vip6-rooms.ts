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

// Extract keywords from entries
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
      const roomData = JSON.parse(fileContent);

      const keywords = extractKeywords(roomData.entries || []);

      const roomRecord = {
        id: roomData.id,
        schema_id: roomData.id,
        title_en: roomData.title?.en || roomData.id,
        title_vi: roomData.title?.vi || roomData.id,
        room_essay_en: roomData.content?.en || '',
        room_essay_vi: roomData.content?.vi || '',
        safety_disclaimer_en: roomData.safety_disclaimer?.en || '',
        safety_disclaimer_vi: roomData.safety_disclaimer?.vi || '',
        crisis_footer_en: roomData.crisis_footer?.en || '',
        crisis_footer_vi: roomData.crisis_footer?.vi || '',
        entries: roomData.entries || [],
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
    } catch (err: any) {
      console.error(`❌ Failed to process ${fileName}:`, err.message);
      errors++;
    }
  }

  console.log(`\n📊 Restoration Summary:`);
  console.log(`   ✅ Restored: ${restored}`);
  console.log(`   ❌ Errors: ${errors}`);
  console.log(`\n✨ VIP6 restoration complete!`);
}

restoreVIP6Rooms().catch(console.error);
