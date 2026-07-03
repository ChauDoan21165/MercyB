import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

type JsonRecord = Record<string, unknown>;

function isRecord(value: unknown): value is JsonRecord {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

async function fixVIP9PersonalSystems() {
  console.log('🔧 Fixing VIP9 Personal Systems room entries...');
  
  // Read the JSON file
  const jsonPath = path.join(process.cwd(), 'public/data/strategic_personal_systems_vip9.json');
  const parsed: unknown = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
  if (!isRecord(parsed) || !Array.isArray(parsed.entries)) {
    throw new Error('Room JSON root is invalid or missing entries');
  }
  const jsonData = parsed;
  const entries = Array.isArray(jsonData.entries) ? jsonData.entries : [];
  
  // Transform entries to match database structure
  const transformedEntries = entries.map((entryValue) => {
    const entry = isRecord(entryValue) ? entryValue : {};
    const copy = isRecord(entry.copy) ? entry.copy : {};
    return {
    slug: entry.slug,
    identifier: entry.slug,
    keywords_en: entry.keywords_en,
    keywords_vi: entry.keywords_vi,
    copy_en: copy.en,
    copy_vi: copy.vi,
    tags: entry.tags,
    audio: entry.audio
    };
  });
  
  console.log(`📝 Transforming ${transformedEntries.length} entries...`);
  
  // Update the database
  const { error } = await supabase
    .from('rooms')
    .update({ entries: transformedEntries })
    .eq('id', 'strategic_personal_systems_vip9');
  
  if (error) {
    console.error('❌ Error updating room:', error);
    process.exit(1);
  }
  
  console.log('✅ Successfully updated VIP9 Personal Systems room entries!');
  
  // Verify
  const { data: verifyData } = await supabase
    .from('rooms')
    .select('id, entries')
    .eq('id', 'strategic_personal_systems_vip9')
    .single();
  
  if (verifyData) {
    const entries = Array.isArray(verifyData.entries) ? verifyData.entries : [];
    console.log(`✅ Verified: Room has ${entries.length} entries`);
  }
}

fixVIP9PersonalSystems().catch(console.error);
