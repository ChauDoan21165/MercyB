/**
 * ROOM LINK VALIDATION CI SCRIPT
 * 
 * Validates that all UI room references point to valid data sources.
 * Blocks CI if broken links are detected.
 * 
 * Integration: Add to .github/workflows/validate-json.yml
 * 
 * jobs:
 *   validate:
 *     steps:
 *       ...
 *       - run: node scripts/validate-rooms-ci.js
 *       - run: node scripts/validate-room-links.js  # <-- Add this
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../public/data');
const PROJECT_ROOT = path.join(__dirname, '..');

console.log('\n' + '='.repeat(60));
console.log('🔗 CI: ROOM LINK VALIDATION');
console.log('='.repeat(60) + '\n');

// ============= Step 1: Extract Room IDs from Data Sources =============

/**
 * Get all JSON filenames from public/data/
 * These represent the actual rooms available
 */
function getAvailableRoomFiles() {
  if (!fs.existsSync(DATA_DIR)) {
    console.error('❌ Data directory not found:', DATA_DIR);
    return [];
  }

  const files = fs.readdirSync(DATA_DIR)
    .filter(f => f.endsWith('.json') && !f.startsWith('.'));

  // Extract room IDs from filenames (normalize to lowercase kebab-case)
  const roomIds = files.map(f => {
    const basename = f.replace(/\.json$/i, '');
    // Normalize to lowercase kebab-case for comparison
    return basename.toLowerCase().replace(/_/g, '-');
  });

  console.log(`📁 Found ${files.length} JSON files in public/data/`);
  return { files, roomIds: new Set(roomIds), filenameMap: Object.fromEntries(files.map((f, i) => [roomIds[i], f])) };
}

/**
 * Extract room IDs from roomDataImports.ts
 * These are the registry entries (normalized to lowercase kebab-case for comparison)
 */
function getRegistryRoomIds() {
  const registryPath = path.join(PROJECT_ROOT, 'src/lib/roomDataImports.ts');
  
  if (!fs.existsSync(registryPath)) {
    console.warn('⚠️  Registry not found:', registryPath);
    return new Set();
  }

  const content = fs.readFileSync(registryPath, 'utf-8');
  
  // Extract room IDs from lines like: "room-id": {
  const idPattern = /"([a-z0-9-_]+)":\s*\{/g;
  const ids = new Set();
  let match;
  
  while ((match = idPattern.exec(content)) !== null) {
    // Normalize to lowercase kebab-case for consistent comparison
    const normalized = match[1].toLowerCase().replace(/_/g, '-');
    ids.add(normalized);
  }

  console.log(`📋 Found ${ids.size} normalized rooms in registry (roomDataImports.ts)`);
  return ids;
}

/**
 * Extract hardcoded room IDs from UI pages
 */
function getUiReferencedRooms() {
  const uiRoomIds = new Set();
  const sources = [];

  // VIP4 hardcoded rooms
  const vip4Path = path.join(PROJECT_ROOT, 'src/pages/RoomGridVIP4.tsx');
  if (fs.existsSync(vip4Path)) {
    const content = fs.readFileSync(vip4Path, 'utf-8');
    
    // Extract from VIP4_CAREER_ROOMS array
    const idMatches = content.match(/id:\s*"([^"]+)"/g);
    if (idMatches) {
      idMatches.forEach(match => {
        const id = match.match(/"([^"]+)"/)[1];
        uiRoomIds.add(id);
        sources.push({ id, source: 'RoomGridVIP4.tsx (hardcoded)' });
      });
    }
  }

  // KidsChat hardcoded room map
  const kidsChatPath = path.join(PROJECT_ROOT, 'src/pages/KidsChat.tsx');
  if (fs.existsSync(kidsChatPath)) {
    const content = fs.readFileSync(kidsChatPath, 'utf-8');
    
    // Extract from KIDS_ROOM_JSON_MAP
    const mapMatches = content.match(/"([a-z0-9-_]+)":\s*"[^"]+\.json"/g);
    if (mapMatches) {
      mapMatches.forEach(match => {
        const id = match.match(/"([a-z0-9-_]+)":/)[1];
        uiRoomIds.add(id);
        sources.push({ id, source: 'KidsChat.tsx (KIDS_ROOM_JSON_MAP)' });
      });
    }
  }

  console.log(`🎨 Found ${uiRoomIds.size} hardcoded room IDs in UI`);
  return { ids: uiRoomIds, sources };
}

// ============= Step 2: Cross-Check for Mismatches =============

function crossCheckRoomLinks() {
  const { roomIds: availableFiles, filenameMap } = getAvailableRoomFiles();
  const registryIds = getRegistryRoomIds();
  const { ids: uiIds, sources: uiSources } = getUiReferencedRooms();

  const issues = {
    brokenLinks: [], // UI references that don't exist
    orphanFiles: [], // JSON files not referenced anywhere
    namingMismatches: [], // Files with non-standard naming
  };

  // Check for broken links (UI → missing data)
  uiIds.forEach(id => {
    const normalizedId = id.toLowerCase().replace(/_/g, '-');
    if (!availableFiles.has(normalizedId) && !registryIds.has(normalizedId)) {
      const source = uiSources.find(s => s.id === id)?.source || 'Unknown';
      issues.brokenLinks.push({
        id,
        source,
        reason: 'No JSON file or registry entry found'
      });
    }
  });

  // Check for orphan files (data → no UI reference)
  // Note: Most rooms are loaded from DB dynamically, so this is informational only
  availableFiles.forEach(normalizedId => {
    if (!registryIds.has(normalizedId) && !uiIds.has(normalizedId)) {
      issues.orphanFiles.push({
        id: normalizedId,
        filename: filenameMap[normalizedId],
        note: 'Not in registry or hardcoded UI (may be loaded from DB)'
      });
    }
  });

  // Check for naming mismatches (PascalCase, snake_case vs kebab-case)
  Object.entries(filenameMap).forEach(([normalizedId, filename]) => {
    const basename = filename.replace(/\.json$/i, '');
    
    // Check if filename uses non-canonical naming
    const isKebabCase = /^[a-z0-9]+(-[a-z0-9]+)*$/i.test(basename);
    const hasUpperCase = basename !== basename.toLowerCase();
    const hasMixedCase = basename.includes('-') && basename.includes('_');
    
    if (!isKebabCase || hasUpperCase || hasMixedCase) {
      issues.namingMismatches.push({
        filename,
        issue: hasUpperCase ? 'Uses uppercase/PascalCase' : 
               hasMixedCase ? 'Mixes hyphens and underscores' :
               'Not in lowercase kebab-case',
        canonicalName: normalizedId + '.json'
      });
    }
  });

  return issues;
}

// ============= Step 3: Report Results =============

function reportResults(issues) {
  let hasErrors = false;

  // Report broken links (CRITICAL - blocks CI)
  if (issues.brokenLinks.length > 0) {
    console.error('\n❌ BROKEN ROOM LINKS (CRITICAL)\n');
    console.error('These room IDs are referenced in UI but have no data:\n');
    issues.brokenLinks.forEach(({ id, source, reason }) => {
      console.error(`  • ${id}`);
      console.error(`    Source: ${source}`);
      console.error(`    Issue: ${reason}\n`);
    });
    hasErrors = true;
  }

  // Report naming mismatches (WARNING - should be fixed)
  if (issues.namingMismatches.length > 0) {
    console.warn('\n⚠️  NAMING MISMATCHES (WARNING)\n');
    console.warn('These files use non-canonical naming:\n');
    issues.namingMismatches.forEach(({ filename, issue, canonicalName }) => {
      console.warn(`  • ${filename}`);
      console.warn(`    Issue: ${issue}`);
      console.warn(`    Canonical: ${canonicalName}\n`);
    });
  }

  // Report orphan files (INFO only - may be loaded from DB)
  if (issues.orphanFiles.length > 0) {
    console.log('\n📝 ORPHAN FILES (INFORMATIONAL)\n');
    console.log('These JSON files are not in registry or hardcoded UI:\n');
    console.log('(They may be loaded dynamically from database)\n');
    issues.orphanFiles.forEach(({ filename, note }) => {
      console.log(`  • ${filename}`);
      console.log(`    ${note}\n`);
    });
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('VALIDATION SUMMARY');
  console.log('='.repeat(60));
  console.log(`Broken Links: ${issues.brokenLinks.length} ❌`);
  console.log(`Naming Mismatches: ${issues.namingMismatches.length} ⚠️`);
  console.log(`Orphan Files: ${issues.orphanFiles.length} 📝`);

  if (hasErrors) {
    console.error('\n❌ VALIDATION FAILED - Fix broken links before deployment\n');
    process.exit(1);
  } else if (issues.namingMismatches.length > 0) {
    console.warn('\n⚠️  VALIDATION PASSED with warnings - Consider fixing naming mismatches\n');
    process.exit(0);
  } else {
    console.log('\n✅ ALL ROOM LINKS VALID\n');
    process.exit(0);
  }
}

// ============= Main Execution =============

try {
  const issues = crossCheckRoomLinks();
  reportResults(issues);
} catch (error) {
  console.error('\n❌ FATAL ERROR:', error.message);
  process.exit(1);
}
