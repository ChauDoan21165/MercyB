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

async function validateKidsRooms() {
  console.log(`${colors.blue}═══════════════════════════════════════════════════${colors.reset}`);
  console.log(`${colors.blue}       KIDS ROOMS VALIDATION CHECK${colors.reset}`);
  console.log(`${colors.blue}═══════════════════════════════════════════════════${colors.reset}\n`);

  try {
    // First, check for files with invalid characters (like trailing quotes)
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

    // Fetch all kids levels
    const { data: levels, error: levelsError } = await supabase
      .from('kids_levels')
      .select('*')
      .order('display_order');

    if (levelsError) throw levelsError;

    console.log(`${colors.cyan}📊 Found ${levels.length} kids levels${colors.reset}\n`);

    let totalRooms = 0;
    let totalEntries = 0;
    const issues = [];

    for (const level of levels) {
      console.log(`${colors.magenta}▶ ${level.name_en} (${level.id})${colors.reset}`);
      console.log(`  Age Range: ${level.age_range}`);
      console.log(`  Color Theme: ${level.color_theme}`);

      // Fetch rooms for this level
      const { data: rooms, error: roomsError } = await supabase
        .from('kids_rooms')
        .select('*')
        .eq('level_id', level.id)
        .order('display_order');

      if (roomsError) {
        issues.push(`  ❌ Error fetching rooms for ${level.id}: ${roomsError.message}`);
        continue;
      }

      totalRooms += rooms.length;
      console.log(`  ${colors.green}✓${colors.reset} ${rooms.length} rooms found`);

      // Check each room for JSON and audio files
      for (const room of rooms) {
        // Try multiple possible paths (kids/ subdirectory and directly in data/)
        const possiblePaths = [
          join(publicDir, 'data', 'kids', `${room.id}.json`),
          join(publicDir, 'data', `${room.id}.json`)
        ];
        
        let jsonFound = false;
        let jsonPath = '';
        
        // Find which path exists
        for (const path of possiblePaths) {
          try {
            await access(path);
            jsonFound = true;
            jsonPath = path;
            break;
          } catch {
            // Try next path
          }
        }
        
        if (!jsonFound) {
          const expectedPath = `${room.id.replace(/-/g, '_')}_kids_${level.id.replace('level', 'l')}.json`;
          issues.push(`    ❌ JSON file not found for room: ${room.id}`);
          issues.push(`       Expected: /data/${expectedPath}`);
          issues.push(`       💡 Create this file with proper structure based on other ${level.id} files`);
          continue;
        }
        
        // Check if JSON file is valid
        try {
          const jsonContent = await readFile(jsonPath, 'utf-8');
          
          // Try to parse JSON
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
              const audioPath = entry.audio_url;
              
              if (!audioPath) {
                issues.push(`      ⚠️  Entry ${i + 1} missing audio_url`);
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

        // Check if room is active
        if (!room.is_active) {
          issues.push(`    ⚠️  Room "${room.title_en}" is inactive`);
        }
      }

      console.log();
    }

    // Summary
    console.log(`${colors.blue}═══════════════════════════════════════════════════${colors.reset}`);
    console.log(`${colors.blue}                    SUMMARY${colors.reset}`);
    console.log(`${colors.blue}═══════════════════════════════════════════════════${colors.reset}\n`);

    console.log(`${colors.cyan}📊 Statistics:${colors.reset}`);
    console.log(`  • Total Levels: ${levels.length}`);
    console.log(`  • Total Rooms: ${totalRooms}`);
    console.log(`  • Total Entries: ${totalEntries}`);
    console.log();

    if (issues.length === 0) {
      console.log(`${colors.green}✅ All kids rooms are properly configured!${colors.reset}\n`);
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

validateKidsRooms();
