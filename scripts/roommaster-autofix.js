#!/usr/bin/env node
// RoomMaster Auto-Fix CLI - Auto-fix common issues in all rooms

const fs = require('fs');
const path = require('path');

const PUBLIC_DATA_DIR = path.join(__dirname, '../public/data');

async function main() {
  console.log('🔧 RoomMaster Auto-Fix');
  console.log('======================\n');

  const files = fs.readdirSync(PUBLIC_DATA_DIR).filter(f => f.endsWith('.json'));
  
  console.log(`Found ${files.length} JSON files\n`);

  let totalFixed = 0;
  let totalChanges = 0;

  for (const file of files) {
    const filePath = path.join(PUBLIC_DATA_DIR, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    
    try {
      const room = JSON.parse(content);
      const fixResult = autoFixRoomSimple(room);

      if (fixResult.fixed) {
        totalFixed++;
        totalChanges += fixResult.changes.length;
        
        console.log(`✅ Fixed ${room.id || file}:`);
        fixResult.changes.forEach(change => console.log(`   - ${change}`));
        
        // Write back to file with pretty-print
        const output = JSON.stringify(fixResult.room, null, 2);
        fs.writeFileSync(filePath, output + '\n', 'utf-8');
      } else {
        console.log(`✓ ${room.id || file} - no changes needed`);
      }
    } catch (error) {
      console.log(`❌ ${file} - Failed to parse: ${error.message}`);
    }
  }

  console.log(`\n📊 Summary:`);
  console.log(`   Total files processed: ${files.length}`);
  console.log(`   Files fixed: ${totalFixed}`);
  console.log(`   Total changes applied: ${totalChanges}`);
  console.log('\n✅ Auto-fix complete\n');
}

function autoFixRoomSimple(room) {
  const changes = [];
  let fixed = false;

  // Fix 1: Normalize tier
  const tierMap = {
    'Free / Miễn phí': 'free',
    'VIP1': 'vip1',
    'VIP2': 'vip2',
    'VIP3': 'vip3',
    'VIP3II': 'vip3ii',
    'VIP4': 'vip4',
    'VIP5': 'vip5',
    'VIP6': 'vip6',
    'VIP9': 'vip9',
    'Kids Level 1': 'kids_1',
    'Kids Level 2': 'kids_2',
    'Kids Level 3': 'kids_3',
  };

  if (tierMap[room.tier] && tierMap[room.tier] !== room.tier) {
    changes.push(`Normalized tier: ${room.tier} → ${tierMap[room.tier]}`);
    room.tier = tierMap[room.tier];
    fixed = true;
  }

  // Fix 2: Fix slugs to kebab-case
  if (room.entries && Array.isArray(room.entries)) {
    room.entries = room.entries.map((entry, i) => {
      if (entry.slug && /[_A-Z]/.test(entry.slug)) {
        const fixedSlug = entry.slug
          .toLowerCase()
          .replace(/_/g, '-')
          .replace(/[^a-z0-9-]/g, '')
          .replace(/-+/g, '-');
        
        if (fixedSlug !== entry.slug) {
          changes.push(`Fixed slug in entry ${i}: ${entry.slug} → ${fixedSlug}`);
          entry.slug = fixedSlug;
          fixed = true;
        }
      }
      return entry;
    });
  }

  // Fix 3: Normalize whitespace
  if (room.entries && Array.isArray(room.entries)) {
    room.entries = room.entries.map((entry, i) => {
      if (entry.copy?.en) {
        const cleaned = entry.copy.en.replace(/\s+/g, ' ').trim();
        if (cleaned !== entry.copy.en) {
          changes.push(`Normalized whitespace in entry ${i} (EN)`);
          entry.copy.en = cleaned;
          fixed = true;
        }
      }
      if (entry.copy?.vi) {
        const cleaned = entry.copy.vi.replace(/\s+/g, ' ').trim();
        if (cleaned !== entry.copy.vi) {
          changes.push(`Normalized whitespace in entry ${i} (VI)`);
          entry.copy.vi = cleaned;
          fixed = true;
        }
      }
      return entry;
    });
  }

  return { fixed, room, changes };
}

main().catch(error => {
  console.error('❌ Auto-fix script failed:', error);
  process.exit(1);
});