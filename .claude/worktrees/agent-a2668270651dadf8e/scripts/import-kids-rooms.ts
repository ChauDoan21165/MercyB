/**
 * Import kids room content from JSON files to Supabase
 * This will populate the kids_entries table with proper content
 */

import { createClient } from '@supabase/supabase-js';
import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY!;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

interface KidsEntry {
  id: string;
  room_id: string;
  content_en: string;
  content_vi: string;
  audio_url: string | null;
  display_order: number;
  is_active: boolean;
}

async function importKidsRooms() {
  console.log('🚀 Starting kids room import...\n');
  
  const dataDir = join(process.cwd(), 'public', 'data');
  const files = readdirSync(dataDir);
  
  // Filter for kids room JSON files (ending with _kids_l1.json or _kids_l2.json)
  const kidsFiles = files.filter(f => 
    f.endsWith('_kids_l1.json') || f.endsWith('_kids_l2.json')
  );
  
  console.log(`📝 Found ${kidsFiles.length} kids room files\n`);
  
  let totalEntries = 0;
  let importedRooms = 0;
  let errors = 0;

  for (const filename of kidsFiles) {
    try {
      const filePath = join(dataDir, filename);
      const fileContent = readFileSync(filePath, 'utf-8');
      const roomData = JSON.parse(fileContent);
      
      // Extract room ID from filename
      // e.g., "family_home_words_kids_l1.json" -> "family-home"
      const roomId = filename
        .replace('_kids_l1.json', '')
        .replace('_kids_l2.json', '')
        .replace(/_/g, '-');
      
      console.log(`📦 Processing: ${filename} -> ${roomId}`);
      
      // Check if room exists
      const { data: room } = await supabase
        .from('kids_rooms')
        .select('id')
        .eq('id', roomId)
        .single();
      
      if (!room) {
        console.log(`   ⚠️  Room not found in database: ${roomId}, skipping...`);
        continue;
      }
      
      // Process entries
      const entries: KidsEntry[] = [];
      
      if (roomData.entries && Array.isArray(roomData.entries)) {
        roomData.entries.forEach((entry: any, index: number) => {
          // Handle different entry structures
          let contentEn = '';
          let contentVi = '';
          
          if (entry.copy) {
            contentEn = entry.copy.en || '';
            contentVi = entry.copy.vi || '';
          } else if (entry.content) {
            contentEn = entry.content.en || '';
            contentVi = entry.content.vi || '';
          }
          
          // Extract audio URL
          let audioUrl = entry.audio || entry.audio_url || null;
          
          // If audio is relative path, ensure it's proper
          if (audioUrl && !audioUrl.startsWith('http')) {
            audioUrl = `/${audioUrl}`;
          }
          
          entries.push({
            id: `${roomId}-${index + 1}`,
            room_id: roomId,
            content_en: contentEn,
            content_vi: contentVi,
            audio_url: audioUrl,
            display_order: index + 1,
            is_active: true
          });
        });
      }
      
      if (entries.length > 0) {
        // Insert entries
        const { error } = await supabase
          .from('kids_entries')
          .insert(entries);
        
        if (error) {
          console.error(`   ❌ Error inserting entries for ${roomId}:`, error.message);
          errors++;
        } else {
          console.log(`   ✅ Imported ${entries.length} entries for ${roomId}`);
          totalEntries += entries.length;
          importedRooms++;
        }
      } else {
        console.log(`   ⚠️  No entries found in ${filename}`);
      }
      
    } catch (err: any) {
      console.error(`❌ Failed to process ${filename}:`, err.message);
      errors++;
    }
  }
  
  console.log(`\n📊 Import Summary:`);
  console.log(`   ✅ Rooms imported: ${importedRooms}`);
  console.log(`   📝 Total entries: ${totalEntries}`);
  console.log(`   ❌ Errors: ${errors}`);
  console.log(`\n✨ Import complete!`);
}

importKidsRooms().catch(console.error);
