import { createClient } from '@supabase/supabase-js';

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

      // Check each room
      for (const room of rooms) {
        // Fetch entries for this room
        const { data: entries, error: entriesError } = await supabase
          .from('kids_entries')
          .select('*')
          .eq('room_id', room.id)
          .order('display_order');

        if (entriesError) {
          issues.push(`    ❌ Error fetching entries for room ${room.id}: ${entriesError.message}`);
          continue;
        }

        const entryCount = entries?.length || 0;
        totalEntries += entryCount;

        if (entryCount === 0) {
          issues.push(`    ⚠️  Room "${room.title_en}" (${room.id}) has no entries`);
        } else {
          console.log(`    ${colors.green}✓${colors.reset} ${room.title_en}: ${entryCount} entries`);
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
