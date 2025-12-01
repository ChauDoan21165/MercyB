#!/usr/bin/env node
// RoomMaster Validation CLI - Validate all rooms via RoomMaster engine

const fs = require('fs');
const path = require('path');

const PUBLIC_DATA_DIR = path.join(__dirname, '../public/data');

async function main() {
  console.log('🔍 RoomMaster Validation');
  console.log('========================\n');

  // Load all JSON files
  const files = fs.readdirSync(PUBLIC_DATA_DIR).filter(f => f.endsWith('.json'));
  
  console.log(`Found ${files.length} JSON files\n`);

  let totalRooms = 0;
  let validRooms = 0;
  let roomsWithErrors = 0;
  let roomsWithWarnings = 0;
  const allErrors = [];
  const allWarnings = [];

  for (const file of files) {
    const filePath = path.join(PUBLIC_DATA_DIR, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    
    try {
      const room = JSON.parse(content);
      totalRooms++;

      // Run validation (simplified version - full validation requires roomMaster import)
      const validation = validateRoomSimple(room);

      if (validation.errors.length === 0 && validation.warnings.length === 0) {
        validRooms++;
        console.log(`✅ ${room.id || file}`);
      } else {
        if (validation.errors.length > 0) {
          roomsWithErrors++;
          console.log(`❌ ${room.id || file} - ${validation.errors.length} errors`);
          allErrors.push({ file, errors: validation.errors });
        }
        
        if (validation.warnings.length > 0) {
          roomsWithWarnings++;
          console.log(`⚠️  ${room.id || file} - ${validation.warnings.length} warnings`);
          allWarnings.push({ file, warnings: validation.warnings });
        }
      }
    } catch (error) {
      roomsWithErrors++;
      console.log(`❌ ${file} - Invalid JSON: ${error.message}`);
      allErrors.push({ file, errors: [error.message] });
    }
  }

  console.log('\n📊 Summary:');
  console.log(`   Total rooms: ${totalRooms}`);
  console.log(`   Valid rooms: ${validRooms}`);
  console.log(`   Rooms with errors: ${roomsWithErrors}`);
  console.log(`   Rooms with warnings: ${roomsWithWarnings}`);

  if (roomsWithErrors > 0) {
    console.log('\n❌ VALIDATION FAILED\n');
    console.log('Errors:');
    allErrors.forEach(({ file, errors }) => {
      console.log(`  ${file}:`);
      errors.forEach(err => console.log(`    - ${err}`));
    });
    process.exit(1);
  } else {
    console.log('\n✅ ALL ROOMS PASS VALIDATION\n');
    process.exit(0);
  }
}

function validateRoomSimple(room) {
  const errors = [];
  const warnings = [];

  // Check required fields
  if (!room.id) errors.push('Missing field: id');
  if (!room.tier) errors.push('Missing field: tier');
  if (!room.title?.en || !room.title?.vi) errors.push('Missing bilingual title');
  if (!room.entries || !Array.isArray(room.entries)) errors.push('Missing or invalid entries array');

  // Check ID format (snake_case)
  if (room.id && !/^[a-z0-9]+(_[a-z0-9]+)*$/.test(room.id)) {
    errors.push(`ID must be snake_case: ${room.id}`);
  }

  // Check entry count
  if (room.entries && (room.entries.length < 2 || room.entries.length > 8)) {
    warnings.push(`Entry count out of range: ${room.entries.length} (expected 2-8)`);
  }

  // Check each entry
  room.entries?.forEach((entry, i) => {
    if (!entry.slug) errors.push(`Entry ${i}: missing slug`);
    if (!entry.copy?.en || !entry.copy?.vi) errors.push(`Entry ${i}: missing bilingual copy`);
    if (!entry.keywords_en || entry.keywords_en.length < 3 || entry.keywords_en.length > 5) {
      warnings.push(`Entry ${i}: keywords_en count ${entry.keywords_en?.length || 0} (expected 3-5)`);
    }
  });

  return { errors, warnings };
}

main().catch(error => {
  console.error('❌ Validation script failed:', error);
  process.exit(1);
});