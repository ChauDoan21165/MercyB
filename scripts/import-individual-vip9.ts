import { createClient } from '@supabase/supabase-js';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const publicDir = join(process.cwd(), 'public', 'data');

type JsonRecord = Record<string, unknown>;

function isRecord(value: unknown): value is JsonRecord {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function stringValue(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

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
        const parsed: unknown = JSON.parse(content);
        if (!isRecord(parsed)) {
          throw new Error('Room JSON root is not an object');
        }
        const roomData = parsed;
        const title = isRecord(roomData.title) ? roomData.title : {};
        const contentBlock = isRecord(roomData.content) ? roomData.content : {};
        const roomEntries = Array.isArray(roomData.entries) ? roomData.entries : [];
        
        // Extract keywords from entries
        const keywords: string[] = [];
        if (roomEntries.length > 0) {
          roomEntries.forEach((entryValue) => {
            const entry = isRecord(entryValue) ? entryValue : {};
            if (Array.isArray(entry.keywords_en)) {
              keywords.push(...entry.keywords_en.filter((keyword): keyword is string => typeof keyword === 'string'));
            }
          });
        }
        
        // Build entries array with proper structure
        const entries = roomEntries.map((entryValue) => {
          const entry = isRecord(entryValue) ? entryValue : {};
          return {
            identifier: entry.slug || entry.artifact_id || entry.id,
            audio: entry.audio || ''
          };
        });
        
        const roomRecord = {
          id: stringValue(roomData.id),
          schema_id: 'standard',
          title_en: stringValue(title.en) || 'Untitled',
          title_vi: stringValue(title.vi) || 'Chưa đặt tên',
          tier: 'vip9',
          domain: 'Individual',
          entries: JSON.stringify(entries),
          keywords: keywords.length > 0 ? keywords : null,
          room_essay_en: stringValue(contentBlock.en) || null,
          room_essay_vi: stringValue(contentBlock.vi) || null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        const { error } = await supabase
          .from('rooms')
          .upsert(roomRecord, { onConflict: 'id' });
        
        if (error) {
          console.error(`❌ Error importing ${roomRecord.id}:`, error.message);
          errors++;
        } else {
          console.log(`✅ Imported: ${roomRecord.id} - ${roomRecord.title_en}`);
          imported++;
        }
        
      } catch (err: unknown) {
        console.error(`❌ Error processing ${filename}:`, getErrorMessage(err));
        errors++;
      }
    }
    
    console.log(`\n📊 Import Summary:`);
    console.log(`   ✅ Imported: ${imported}`);
    console.log(`   ⏭️  Skipped: ${skipped}`);
    console.log(`   ❌ Errors: ${errors}`);
    console.log(`   📁 Total: ${strategicFiles.length}`);
    
  } catch (error: unknown) {
    console.error('Fatal error:', getErrorMessage(error));
    process.exit(1);
  }
}

importIndividualVIP9Rooms().catch(console.error);
