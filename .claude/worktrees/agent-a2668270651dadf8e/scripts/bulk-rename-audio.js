// Bulk rename audio files in public/audio to match JSON references
const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '../public/data');
const audioDir = path.join(__dirname, '../public/audio');

// Collect all audio references from JSON files
function collectAudioReferences() {
  const references = new Set();
  const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.json'));
  
  files.forEach(file => {
    try {
      const content = JSON.parse(fs.readFileSync(path.join(dataDir, file), 'utf8'));
      
      // Check entries
      if (content.entries && Array.isArray(content.entries)) {
        content.entries.forEach(entry => {
          if (entry.audio) {
            if (typeof entry.audio === 'string') {
              references.add(entry.audio);
            } else if (typeof entry.audio === 'object') {
              if (entry.audio.en) references.add(entry.audio.en);
              if (entry.audio.vi) references.add(entry.audio.vi);
            }
          }
        });
      }
    } catch (error) {
      console.log(`⚠️  Error reading ${file}: ${error.message}`);
    }
  });
  
  return Array.from(references);
}

// Get all actual audio files in public/audio
function getActualAudioFiles() {
  if (!fs.existsSync(audioDir)) {
    console.log('❌ Audio directory not found');
    return [];
  }
  
  return fs.readdirSync(audioDir)
    .filter(f => f.endsWith('.mp3'))
    .sort();
}

// Find best match for a reference
function findBestMatch(reference, actualFiles) {
  // Exact match
  if (actualFiles.includes(reference)) {
    return { type: 'exact', actual: reference };
  }
  
  // Try removing file extension and comparing
  const refBase = reference.replace('.mp3', '');
  
  // Look for files with suffix like "-2.mp3"
  const withSuffix = actualFiles.find(f => 
    f.startsWith(refBase) && f.match(new RegExp(`^${refBase}[-_]\\d+\\.mp3$`))
  );
  if (withSuffix) {
    return { type: 'suffix_mismatch', actual: withSuffix, expected: reference };
  }
  
  // Look for case mismatches
  const caseMatch = actualFiles.find(f => f.toLowerCase() === reference.toLowerCase());
  if (caseMatch) {
    return { type: 'case_mismatch', actual: caseMatch, expected: reference };
  }
  
  // Look for similar filenames (fuzzy match)
  const similar = actualFiles.find(f => {
    const fBase = f.replace('.mp3', '').toLowerCase();
    const rBase = refBase.toLowerCase();
    return fBase.includes(rBase) || rBase.includes(fBase);
  });
  if (similar) {
    return { type: 'fuzzy_match', actual: similar, expected: reference };
  }
  
  return { type: 'missing', expected: reference };
}

// Main execution
console.log('🔍 Analyzing audio references and files...\n');

const references = collectAudioReferences();
const actualFiles = getActualAudioFiles();

console.log(`📊 Found ${references.length} unique audio references in JSON files`);
console.log(`📊 Found ${actualFiles.length} actual MP3 files in public/audio\n`);

const renameOps = [];
const missingFiles = [];
const perfectMatches = [];

references.forEach(ref => {
  const match = findBestMatch(ref, actualFiles);
  
  if (match.type === 'exact') {
    perfectMatches.push(ref);
  } else if (match.type === 'missing') {
    missingFiles.push(ref);
  } else {
    renameOps.push(match);
  }
});

// Report findings
console.log('✅ PERFECT MATCHES:', perfectMatches.length);
perfectMatches.slice(0, 5).forEach(f => console.log(`   ${f}`));
if (perfectMatches.length > 5) console.log(`   ... and ${perfectMatches.length - 5} more`);

console.log('\n🔄 FILES NEEDING RENAME:', renameOps.length);
renameOps.forEach(op => {
  console.log(`   ${op.actual} → ${op.expected} [${op.type}]`);
});

console.log('\n❌ MISSING FILES:', missingFiles.length);
missingFiles.forEach(f => console.log(`   ${f}`));

// Perform renames if --execute flag is passed
const shouldExecute = process.argv.includes('--execute');

if (shouldExecute && renameOps.length > 0) {
  console.log('\n🚀 EXECUTING RENAMES...\n');
  
  renameOps.forEach(op => {
    const oldPath = path.join(audioDir, op.actual);
    const newPath = path.join(audioDir, op.expected);
    
    try {
      fs.renameSync(oldPath, newPath);
      console.log(`✅ Renamed: ${op.actual} → ${op.expected}`);
    } catch (error) {
      console.log(`❌ Failed to rename ${op.actual}: ${error.message}`);
    }
  });
  
  console.log('\n✨ Rename operation complete!');
} else if (renameOps.length > 0) {
  console.log('\n💡 To execute these renames, run:');
  console.log('   node scripts/bulk-rename-audio.js --execute');
} else {
  console.log('\n✨ All files are correctly named!');
}

// Show unused audio files
const referencedSet = new Set(references);
const unusedFiles = actualFiles.filter(f => !referencedSet.has(f) && !renameOps.find(op => op.actual === f));
if (unusedFiles.length > 0) {
  console.log('\n⚠️  UNUSED AUDIO FILES (not referenced in any JSON):', unusedFiles.length);
  unusedFiles.forEach(f => console.log(`   ${f}`));
}
