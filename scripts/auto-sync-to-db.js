import { watch } from 'fs';
import { readFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');
const DATA_DIR = join(projectRoot, 'public', 'data');

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
};

// Debounce syncs to avoid multiple runs on rapid saves
const pendingSyncs = new Map();

// Extract keywords from entries
function extractKeywords(entries) {
  const keywordsSet = new Set();
  
  entries.forEach(entry => {
    if (entry.keywords_en) {
      entry.keywords_en.forEach(kw => keywordsSet.add(kw.toLowerCase()));
    }
    if (entry.copy?.en) {
      const words = entry.copy.en.toLowerCase().split(/\s+/);
      words.forEach(word => {
        if (word.length > 3) keywordsSet.add(word);
      });
    }
  });
  
  return Array.from(keywordsSet);
}

// Sync a single room file to database
async function syncRoomToDatabase(filename) {
  const filePath = join(DATA_DIR, filename);
  
  try {
    const fileContent = await readFile(filePath, 'utf-8');
    const roomData = JSON.parse(fileContent);
    
    // Extract room ID from filename (remove .json and tier suffix if present)
    const baseFilename = filename.replace('.json', '');
    const roomId = baseFilename;
    
    // Extract keywords
    const keywords = extractKeywords(roomData.entries || []);
    
    // Prepare room record
    const roomRecord = {
      id: roomId,
      schema_id: roomId,
      title_en: roomData.name || roomData.title?.en || 'Untitled Room',
      title_vi: roomData.name_vi || roomData.title?.vi || 'Phòng không tên',
      tier: roomData.meta?.tier || roomData.tier || 'free',
      keywords: keywords,
      entries: roomData.entries || [],
      room_essay_en: roomData.room_essay?.en || null,
      room_essay_vi: roomData.room_essay?.vi || null,
      crisis_footer_en: roomData.crisis_footer?.en || null,
      crisis_footer_vi: roomData.crisis_footer?.vi || null,
      safety_disclaimer_en: roomData.safety_disclaimer?.en || null,
      safety_disclaimer_vi: roomData.safety_disclaimer?.vi || null,
    };
    
    // Upsert to database
    const { data, error } = await supabase
      .from('rooms')
      .upsert(roomRecord, { onConflict: 'id' });
    
    if (error) {
      console.error(`${colors.red}❌ Failed to sync ${filename}:${colors.reset}`, error.message);
    } else {
      console.log(`${colors.green}✅ Synced ${filename} → Database${colors.reset}`);
    }
  } catch (error) {
    console.error(`${colors.red}❌ Error syncing ${filename}:${colors.reset}`, error.message);
  }
}

// Handle file change with debouncing
function handleFileChange(filename) {
  const key = filename;
  
  // Clear existing timeout
  if (pendingSyncs.has(key)) {
    clearTimeout(pendingSyncs.get(key));
  }
  
  // Set new timeout
  const timeoutId = setTimeout(() => {
    console.log(`\n${colors.cyan}🔄 Detected change: ${filename}${colors.reset}`);
    console.log(`${colors.yellow}⏳ Syncing to database...${colors.reset}`);
    
    syncRoomToDatabase(filename).finally(() => {
      pendingSyncs.delete(key);
    });
  }, 500); // Wait 500ms after last change
  
  pendingSyncs.set(key, timeoutId);
}

// Initial sync of all files
async function initialSync() {
  console.log(`${colors.magenta}🔄 Running initial sync...${colors.reset}`);
  
  const fs = await import('fs/promises');
  const files = await fs.readdir(DATA_DIR);
  const jsonFiles = files.filter(f => f.endsWith('.json') && !f.startsWith('.'));
  
  for (const file of jsonFiles) {
    await syncRoomToDatabase(file);
  }
  
  console.log(`${colors.green}✅ Initial sync complete${colors.reset}\n`);
}

// Main
console.log(`${colors.blue}═══════════════════════════════════════════════════${colors.reset}`);
console.log(`${colors.blue}       AUTO-SYNC SYSTEM STARTED${colors.reset}`);
console.log(`${colors.blue}═══════════════════════════════════════════════════${colors.reset}`);
console.log(`${colors.green}📁 Watching:${colors.reset} ${DATA_DIR}`);
console.log(`${colors.cyan}🔄 Auto-syncing to database on changes...${colors.reset}`);
console.log(`${colors.yellow}💡 Press Ctrl+C to stop${colors.reset}\n`);

// Run initial sync
await initialSync();

// Start watching
const watcher = watch(DATA_DIR, { recursive: false }, (eventType, filename) => {
  // Only process JSON files
  if (!filename || !filename.endsWith('.json') || filename.startsWith('.')) {
    return;
  }
  
  // Sync on change or rename events
  if (eventType === 'change' || eventType === 'rename') {
    handleFileChange(filename);
  }
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log(`\n\n${colors.yellow}🛑 Stopping auto-sync system...${colors.reset}`);
  watcher.close();
  process.exit(0);
});

process.on('SIGTERM', () => {
  watcher.close();
  process.exit(0);
});
