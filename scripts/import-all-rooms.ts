/**
 * Comprehensive room import script
 * Scans all JSON files in public/data/ and imports them to Supabase
 * 
 * Usage: npx tsx scripts/import-all-rooms.ts
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

// Convert filename to room ID (e.g., "AI_vip1.json" -> "ai-vip1")
function filenameToRoomId(filename: string): string {
  return filename
    .replace('.json', '')
    .replace(/_/g, '-')
    .toLowerCase()
    .replace(/\s+/g, '-');
}

// Extract keywords from entries
function extractKeywords(entries: any[]): string[] {
  const keywords = new Set<string>();
  
  if (!entries || !Array.isArray(entries)) return [];
  
  entries.forEach(entry => {
    if (entry.keywords && Array.isArray(entry.keywords)) {
      entry.keywords.forEach((kw: string) => keywords.add(kw.toLowerCase()));
    }
    
    if (entry.keywords_en && Array.isArray(entry.keywords_en)) {
      entry.keywords_en.forEach((kw: string) => keywords.add(kw.toLowerCase()));
    }
    
    if (entry.keywords_vi && Array.isArray(entry.keywords_vi)) {
      entry.keywords_vi.forEach((kw: string) => keywords.add(kw.toLowerCase()));
    }
    
    // Add title words as keywords
    if (entry.title?.en) {
      entry.title.en.toLowerCase().split(/\s+/).forEach((word: string) => {
        if (word.length > 3) keywords.add(word);
      });
    }
  });
  
  return Array.from(keywords);
}

// Determine tier from filename or content
function determineTier(filename: string, data: any): string {
  const lowerFilename = filename.toLowerCase();
  
  if (lowerFilename.includes('vip4')) return 'vip4';
  if (lowerFilename.includes('vip3')) return 'vip3';
  if (lowerFilename.includes('vip2')) return 'vip2';
  if (lowerFilename.includes('vip1')) return 'vip1';
  if (lowerFilename.includes('free')) return 'free';
  
  // Check in data
  if (data.tier) return data.tier;
  if (data.meta?.tier) return data.meta.tier;
  
  return 'free'; // Default to free
}

async function importAllRooms() {
  console.log('🚀 Starting comprehensive room import...\n');
  
  const dataDir = join(process.cwd(), 'public/data');
  const files = readdirSync(dataDir).filter(f => f.endsWith('.json') && f !== '.gitkeep');
  
  console.log(`📁 Found ${files.length} JSON files\n`);
  
  let imported = 0;
  let updated = 0;
  let errors = 0;
  const errorDetails: string[] = [];

  for (const filename of files) {
    try {
      const filePath = join(dataDir, filename);
      const fileContent = readFileSync(filePath, 'utf-8');
      const roomData = JSON.parse(fileContent);

      const roomId = filenameToRoomId(filename);
      const tier = determineTier(filename, roomData);
      const keywords = extractKeywords(roomData.entries || []);

      const roomRecord = {
        id: roomId,
        schema_id: roomData.schema_id || roomData.id || roomId,
        title_en: roomData.title?.en || roomData.name || roomData.title || filename.replace('.json', ''),
        title_vi: roomData.title?.vi || roomData.name_vi || roomData.title?.en || filename.replace('.json', ''),
        room_essay_en: roomData.room_essay?.en || roomData.description || '',
        room_essay_vi: roomData.room_essay?.vi || roomData.description_vi || '',
        safety_disclaimer_en: roomData.safety_disclaimer?.en || '',
        safety_disclaimer_vi: roomData.safety_disclaimer?.vi || '',
        crisis_footer_en: roomData.crisis_footer?.en || '',
        crisis_footer_vi: roomData.crisis_footer?.vi || '',
        entries: roomData.entries || [],
        keywords: keywords,
        tier: tier,
      };

      // Check if room exists
      const { data: existing } = await supabase
        .from('rooms')
        .select('id')
        .eq('id', roomId)
        .single();

      if (existing) {
        // Update existing room
        const { error } = await supabase
          .from('rooms')
          .update(roomRecord)
          .eq('id', roomId);

        if (error) {
          console.error(`❌ Error updating ${roomId}:`, error.message);
          errorDetails.push(`${roomId}: ${error.message}`);
          errors++;
        } else {
          console.log(`🔄 Updated: ${roomId} [${tier}] (${keywords.length} keywords)`);
          updated++;
        }
      } else {
        // Insert new room
        const { error } = await supabase
          .from('rooms')
          .insert(roomRecord);

        if (error) {
          console.error(`❌ Error importing ${roomId}:`, error.message);
          errorDetails.push(`${roomId}: ${error.message}`);
          errors++;
        } else {
          console.log(`✅ Imported: ${roomId} [${tier}] (${keywords.length} keywords)`);
          imported++;
        }
      }
    } catch (err: any) {
      console.error(`❌ Failed to process ${filename}:`, err.message);
      errorDetails.push(`${filename}: ${err.message}`);
      errors++;
    }
  }

  console.log(`\n📊 Import Summary:`);
  console.log(`   ✅ Newly imported: ${imported}`);
  console.log(`   🔄 Updated: ${updated}`);
  console.log(`   ❌ Errors: ${errors}`);
  console.log(`   📁 Total processed: ${imported + updated + errors}/${files.length}`);
  
  if (errorDetails.length > 0) {
    console.log(`\n⚠️  Error Details:`);
    errorDetails.forEach(detail => console.log(`   - ${detail}`));
  }
  
  console.log(`\n✨ Import complete!`);
}

importAllRooms().catch(console.error);
