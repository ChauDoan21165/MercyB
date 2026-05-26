import { createClient } from '@supabase/supabase-js';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const publicDir = join(process.cwd(), 'public', 'data');

async function importIndividualVIP9Rooms() {
  console.log('🔍 Scanning for Individual Strategic Mastery VIP9 rooms...\n');
  
  try {
    const files = readdirSync(publicDir);
    const strategicFiles = files.filter(f => 
      f.startsWith('strategic_') && 
      f.endsWith('_vip9.json') &&
      f !== 'strategic_adaptive_intelligence_vip9.json' // Skip overview
    );
    
    console.log(`Found ${strategicFiles.length} Individual Strategic Mastery rooms:\n`);
    strategicFiles.forEach(f => console.log(`  - ${f}`));
    console.log('');
    
    let imported = 0;
    let skipped = 0;
    let errors = 0;
    
    for (const filename of strategicFiles) {
      const filepath = join(publicDir, filename);
      
      try {
        const content = readFileSync(filepath, 'utf-8');
        const roomData = JSON.parse(content);
        
        // Extract keywords from entries
        const keywords: string[] = [];
        if (roomData.entries && Array.isArray(roomData.entries)) {
          roomData.entries.forEach((entry: any) => {
            if (entry.keywords_en) keywords.push(...entry.keywords_en);
          });
        }
        
        // Build entries array with proper structure
        const entries = roomData.entries?.map((entry: any) => ({
          identifier: entry.slug || entry.artifact_id || entry.id,
          audio: entry.audio || ''
        })) || [];
        
        const roomRecord = {
          id: roomData.id,
          schema_id: 'standard',
          title_en: roomData.title?.en || 'Untitled',
          title_vi: roomData.title?.vi || 'Chưa đặt tên',
          tier: 'vip9',
          domain: 'Individual',
          entries: JSON.stringify(entries),
          keywords: keywords.length > 0 ? keywords : null,
          room_essay_en: roomData.content?.en || null,
          room_essay_vi: roomData.content?.vi || null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        const { error } = await supabase
          .from('rooms')
          .upsert(roomRecord, { onConflict: 'id' });
        
        if (error) {
          console.error(`❌ Error importing ${roomData.id}:`, error.message);
          errors++;
        } else {
          console.log(`✅ Imported: ${roomData.id} - ${roomData.title?.en}`);
          imported++;
        }
        
      } catch (err: any) {
        console.error(`❌ Error processing ${filename}:`, err.message);
        errors++;
      }
    }
    
    console.log(`\n📊 Import Summary:`);
    console.log(`   ✅ Imported: ${imported}`);
    console.log(`   ⏭️  Skipped: ${skipped}`);
    console.log(`   ❌ Errors: ${errors}`);
    console.log(`   📁 Total: ${strategicFiles.length}`);
    
  } catch (error: any) {
    console.error('Fatal error:', error.message);
    process.exit(1);
  }
}

importIndividualVIP9Rooms().catch(console.error);
