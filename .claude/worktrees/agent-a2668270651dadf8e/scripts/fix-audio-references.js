// Fix audio references in all room JSON files
const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '../public/data');
const dryRun = process.argv.includes('--dry-run');

const stats = {
  filesProcessed: 0,
  filesModified: 0,
  totalFixes: 0
};

function extractTierFromFilename(filename) {
  const match = filename.match(/_(free|vip1|vip2|vip3)\./i);
  return match ? match[1].toLowerCase() : null;
}

function getRoomSlug(filename) {
  return filename
    .replace(/_(free|vip1|vip2|vip3)\.json$/i, '')
    .replace(/\s+/g, '_')
    .toLowerCase();
}

function fixAudioPath(currentPath, expectedTier, roomSlug, entrySlug) {
  if (typeof currentPath === 'object') {
    // Handle {en: "...", vi: "..."} format
    const fixed = {};
    if (currentPath.en) {
      fixed.en = `${roomSlug}_${expectedTier}_${entrySlug}.mp3`;
    }
    if (currentPath.vi) {
      fixed.vi = `${roomSlug}_${expectedTier}_${entrySlug}_vi.mp3`;
    }
    return fixed;
  }
  
  // Handle string format
  return `${roomSlug}_${expectedTier}_${entrySlug}.mp3`;
}

function processJsonFile(filePath) {
  try {
    const filename = path.basename(filePath);
    const content = fs.readFileSync(filePath, 'utf8');
    const json = JSON.parse(content);
    
    stats.filesProcessed++;
    let modified = false;
    const changes = [];

    const expectedTier = extractTierFromFilename(filename);
    if (!expectedTier) {
      console.log(`⚠️  Skipping ${filename}: cannot determine tier`);
      return;
    }

    const roomSlug = getRoomSlug(filename);

    // Remove root-level audio if it exists (usually incorrect)
    if (json.audio) {
      delete json.audio;
      modified = true;
      changes.push('Removed root-level audio field');
      stats.totalFixes++;
    }

    // Fix content.audio if it exists
    if (json.content && json.content.audio) {
      const oldAudio = JSON.stringify(json.content.audio);
      json.content.audio = `${roomSlug}_${expectedTier}_intro.mp3`;
      changes.push(`content.audio: ${oldAudio} → ${json.content.audio}`);
      modified = true;
      stats.totalFixes++;
    }

    // Fix entries
    if (json.entries && Array.isArray(json.entries)) {
      json.entries.forEach((entry, index) => {
        if (!entry.slug) {
          console.log(`⚠️  ${filename}: entry[${index}] has no slug, skipping`);
          return;
        }

        const entrySlug = entry.slug.replace(/\s+/g, '_').toLowerCase();
        
        if (!entry.audio) {
          // Add missing audio
          entry.audio = `${roomSlug}_${expectedTier}_${entrySlug}.mp3`;
          changes.push(`entry[${index}] (${entry.slug}): Added audio field`);
          modified = true;
          stats.totalFixes++;
        } else {
          // Fix existing audio
          const oldAudio = typeof entry.audio === 'object' 
            ? JSON.stringify(entry.audio) 
            : entry.audio;
          
          const newAudio = fixAudioPath(entry.audio, expectedTier, roomSlug, entrySlug);
          const newAudioStr = typeof newAudio === 'object' 
            ? JSON.stringify(newAudio) 
            : newAudio;

          if (oldAudio !== newAudioStr) {
            entry.audio = newAudio;
            changes.push(`entry[${index}] (${entry.slug}): ${oldAudio} → ${newAudioStr}`);
            modified = true;
            stats.totalFixes++;
          }
        }
      });
    }

    if (modified) {
      stats.filesModified++;
      console.log(`\n📝 ${filename} - ${changes.length} changes:`);
      changes.forEach(change => console.log(`   • ${change}`));
      
      if (!dryRun) {
        fs.writeFileSync(filePath, JSON.stringify(json, null, 2));
        console.log(`   ✅ Saved`);
      } else {
        console.log(`   🔍 [DRY RUN] Would save`);
      }
    }

  } catch (error) {
    console.error(`❌ Error processing ${path.basename(filePath)}: ${error.message}`);
  }
}

// Main execution
console.log('🔧 Starting audio reference standardization...');
console.log(dryRun ? '🔍 DRY RUN MODE - No files will be modified\n' : '');

if (!fs.existsSync(dataDir)) {
  console.error(`❌ Data directory not found: ${dataDir}`);
  process.exit(1);
}

const files = fs.readdirSync(dataDir)
  .filter(f => f.endsWith('.json'))
  .sort();

files.forEach(file => {
  processJsonFile(path.join(dataDir, file));
});

// Print summary
console.log('\n' + '='.repeat(60));
console.log('📊 SUMMARY');
console.log('='.repeat(60));
console.log(`Files processed: ${stats.filesProcessed}`);
console.log(`Files modified: ${stats.filesModified}`);
console.log(`Total fixes applied: ${stats.totalFixes}`);
console.log('='.repeat(60));

if (dryRun) {
  console.log('\n💡 Run without --dry-run to apply changes');
} else {
  console.log('\n✨ All changes saved!');
}
