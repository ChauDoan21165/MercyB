import { createClient } from '@supabase/supabase-js';
import { readdir, readFile, access } from 'fs/promises';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const publicDir = join(__dirname, '..', 'public');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
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

// Map of tier display names
const TIER_NAMES = {
  'free': 'Free',
  'Free / Miễn phí': 'Free',
  'vip1': 'VIP1',
  'VIP1': 'VIP1',
  'vip2': 'VIP2',
  'VIP2': 'VIP2',
  'vip3': 'VIP3',
  'VIP3': 'VIP3',
  'vip4': 'VIP4',
  'VIP4': 'VIP4',
  'vip5': 'VIP5',
  'VIP5': 'VIP5',
  'vip6': 'VIP6',
  'VIP6': 'VIP6',
  'vip7': 'VIP7',
  'VIP7': 'VIP7',
};

async function validateRooms(targetTier = null) {
  const tierFilter = targetTier ? ` (${TIER_NAMES[targetTier] || targetTier})` : '';
  console.log(`${colors.blue}═══════════════════════════════════════════════════${colors.reset}`);
  console.log(`${colors.blue}       ROOMS VALIDATION CHECK${tierFilter}${colors.reset}`);
  console.log(`${colors.blue}═══════════════════════════════════════════════════${colors.reset}\n`);

  try {
    // Check for files with invalid characters
    console.log(`${colors.cyan}🔍 Checking for files with invalid characters...${colors.reset}\n`);
    const dataFiles = await readdir(join(publicDir, 'data'));
    const filesWithInvalidChars = dataFiles.filter(file => 
      file.includes('"') || file.includes("'") || file.includes('`')
    );
    
    if (filesWithInvalidChars.length > 0) {
      console.log(`${colors.red}❌ Found ${filesWithInvalidChars.length} file(s) with invalid characters:${colors.reset}`);
      filesWithInvalidChars.forEach(file => {
        console.log(`  ${colors.red}✗${colors.reset} ${file}`);
      });
      console.log(`\n${colors.yellow}⚠️  Please rename these files to remove quotes and special characters.${colors.reset}\n`);
    }

    // Fetch rooms from database
    let query = supabase
      .from('rooms')
      .select('*')
      .neq('tier', 'kids')
      .order('tier')
      .order('title_en');

    if (targetTier) {
      query = query.eq('tier', targetTier);
    }

    const { data: rooms, error: roomsError } = await query;

    if (roomsError) throw roomsError;

    console.log(`${colors.cyan}📊 Found ${rooms.length} rooms${tierFilter}${colors.reset}\n`);

    // Group rooms by tier
    const roomsByTier = rooms.reduce((acc, room) => {
      const tier = TIER_NAMES[room.tier] || room.tier;
      if (!acc[tier]) acc[tier] = [];
      acc[tier].push(room);
      return acc;
    }, {});

    let totalRooms = 0;
    let totalEntries = 0;
    const issues = [];

    for (const [tier, tierRooms] of Object.entries(roomsByTier).sort()) {
      console.log(`${colors.magenta}▶ ${tier} Tier${colors.reset}`);
      console.log(`  ${colors.green}✓${colors.reset} ${tierRooms.length} rooms found`);

      for (const room of tierRooms) {
        totalRooms++;
        
        // Generate expected JSON filename patterns
        const possibleFilenames = [
          `${room.id}.json`,
          `${room.id.replace(/-/g, '_')}.json`,
        ];

        let jsonFound = false;
        let jsonPath = '';
        
        // Try to find the JSON file
        for (const filename of possibleFilenames) {
          const path = join(publicDir, 'data', filename);
          try {
            await access(path);
            jsonFound = true;
            jsonPath = path;
            break;
          } catch {
            // Try next filename
          }
        }
        
        if (!jsonFound) {
          issues.push(`    ❌ JSON file not found for room: ${room.title_en} (${room.id})`);
          issues.push(`       Expected: /data/${room.id}.json`);
          issues.push(`       💡 Create this file with proper structure based on other ${tier} files`);
          continue;
        }
        
        // Validate JSON file
        try {
          const jsonContent = await readFile(jsonPath, 'utf-8');
          
          let roomData;
          try {
            roomData = JSON.parse(jsonContent);
          } catch (parseError) {
            issues.push(`    ❌ Invalid JSON syntax in ${room.title_en}: ${parseError.message}`);
            continue;
          }
          
          const entryCount = roomData.entries?.length || 0;
          totalEntries += entryCount;

          if (entryCount === 0) {
            issues.push(`    ⚠️  Room "${room.title_en}" JSON has no entries`);
          } else {
            console.log(`    ${colors.green}✓${colors.reset} ${room.title_en}: ${entryCount} entries`);
            
            // Check audio files for each entry
            for (let i = 0; i < roomData.entries.length; i++) {
              const entry = roomData.entries[i];
              const audioPath = entry.audio;
              
              if (!audioPath) {
                issues.push(`      ⚠️  Entry ${i + 1} missing audio file`);
                continue;
              }
              
              const fullAudioPath = join(publicDir, audioPath.startsWith('/') ? audioPath.substring(1) : audioPath);
              
              try {
                await access(fullAudioPath);
              } catch {
                issues.push(`      ❌ Audio file missing: ${audioPath}`);
              }
            }
          }
        } catch (error) {
          issues.push(`    ❌ Error reading JSON file for ${room.title_en}: ${error.message}`);
        }

        // Check if room is locked/inactive
        if (room.is_locked) {
          issues.push(`    ⚠️  Room "${room.title_en}" is locked`);
        }
      }

      console.log();
    }

    // Summary
    console.log(`${colors.blue}═══════════════════════════════════════════════════${colors.reset}`);
    console.log(`${colors.blue}                    SUMMARY${colors.reset}`);
    console.log(`${colors.blue}═══════════════════════════════════════════════════${colors.reset}\n`);

    console.log(`${colors.cyan}📊 Statistics:${colors.reset}`);
    console.log(`  • Total Tiers: ${Object.keys(roomsByTier).length}`);
    console.log(`  • Total Rooms: ${totalRooms}`);
    console.log(`  • Total Entries: ${totalEntries}`);
    console.log();

    if (issues.length === 0) {
      console.log(`${colors.green}✅ All rooms are properly configured!${colors.reset}\n`);
      process.exit(0);
    } else {
      console.log(`${colors.yellow}⚠️  Found ${issues.length} issue(s):${colors.reset}\n`);
      issues.forEach(issue => console.log(issue));
      console.log();
      process.exit(1);
    }

  } catch (error) {
    console.error(`${colors.red}❌ Fatal error:${colors.reset}`, error.message);
    process.exit(1);
  }
}

// Get tier from command line args
const targetTier = process.argv[2];
validateRooms(targetTier);
