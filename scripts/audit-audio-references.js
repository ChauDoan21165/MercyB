// Comprehensive audio reference audit for all room JSON files
const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '../public/data');
const issues = [];
const summary = {
  totalFiles: 0,
  totalEntries: 0,
  filesWithIssues: 0,
  issueTypes: {
    missingAudio: 0,
    wrongTier: 0,
    mixedFormat: 0,
    invalidPath: 0,
    rootLevelAudio: 0
  }
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

function checkAudioReference(audioRef, expectedTier, roomSlug, context) {
  const problems = [];
  
  if (!audioRef) {
    problems.push('Missing audio field');
    summary.issueTypes.missingAudio++;
    return problems;
  }

  // Handle object format {en: "...", vi: "..."}
  if (typeof audioRef === 'object' && !Array.isArray(audioRef)) {
    if (audioRef.en) {
      const enProblems = checkAudioPath(audioRef.en, expectedTier, roomSlug, context);
      problems.push(...enProblems.map(p => `[EN] ${p}`));
    }
    if (audioRef.vi) {
      const viProblems = checkAudioPath(audioRef.vi, expectedTier, roomSlug, context);
      problems.push(...viProblems.map(p => `[VI] ${p}`));
    }
    return problems;
  }

  // Handle string format
  if (typeof audioRef === 'string') {
    return checkAudioPath(audioRef, expectedTier, roomSlug, context);
  }

  problems.push(`Invalid audio format: ${typeof audioRef}`);
  summary.issueTypes.invalidPath++;
  return problems;
}

function checkAudioPath(audioPath, expectedTier, roomSlug, context) {
  const problems = [];

  if (!audioPath.endsWith('.mp3')) {
    problems.push(`Not an MP3 file: "${audioPath}"`);
    summary.issueTypes.invalidPath++;
  }

  // Check if tier matches
  const tierMatch = audioPath.match(/_(free|vip1|vip2|vip3)_/i);
  if (tierMatch) {
    const audioTier = tierMatch[1].toLowerCase();
    if (audioTier !== expectedTier) {
      problems.push(`Wrong tier in audio: expected "${expectedTier}" but found "${audioTier}" in "${audioPath}"`);
      summary.issueTypes.wrongTier++;
    }
  } else {
    problems.push(`No tier found in audio path: "${audioPath}"`);
    summary.issueTypes.invalidPath++;
  }

  // Check if room slug matches
  const expectedPrefix = `${roomSlug}_${expectedTier}_`;
  if (!audioPath.toLowerCase().startsWith(expectedPrefix)) {
    problems.push(`Audio path doesn't match expected pattern "${expectedPrefix}*": "${audioPath}"`);
    summary.issueTypes.invalidPath++;
  }

  return problems;
}

function auditJsonFile(filePath) {
  try {
    const filename = path.basename(filePath);
    const content = fs.readFileSync(filePath, 'utf8');
    const json = JSON.parse(content);
    
    summary.totalFiles++;
    const fileIssues = [];
    
    const expectedTier = extractTierFromFilename(filename);
    if (!expectedTier) {
      fileIssues.push({
        type: 'CRITICAL',
        message: `Cannot extract tier from filename: ${filename}`
      });
    }

    const roomSlug = getRoomSlug(filename);

    // Check root-level audio (should not exist in most cases)
    if (json.audio) {
      summary.issueTypes.rootLevelAudio++;
      const audioProblems = checkAudioReference(json.audio, expectedTier, roomSlug, 'root level');
      audioProblems.forEach(problem => {
        fileIssues.push({
          type: 'WARNING',
          location: 'root',
          message: problem
        });
      });
    }

    // Check content.audio (for some room formats)
    if (json.content && json.content.audio) {
      const audioProblems = checkAudioReference(json.content.audio, expectedTier, roomSlug, 'content');
      audioProblems.forEach(problem => {
        fileIssues.push({
          type: 'WARNING',
          location: 'content',
          message: problem
        });
      });
    }

    // Check entries
    if (json.entries && Array.isArray(json.entries)) {
      json.entries.forEach((entry, index) => {
        summary.totalEntries++;
        
        if (!entry.audio) {
          fileIssues.push({
            type: 'ERROR',
            location: `entry[${index}] (${entry.slug || 'no slug'})`,
            message: 'Missing audio field'
          });
          summary.issueTypes.missingAudio++;
          return;
        }

        // Check audio reference in entry
        const audioProblems = checkAudioReference(entry.audio, expectedTier, roomSlug, `entry[${index}]`);
        audioProblems.forEach(problem => {
          fileIssues.push({
            type: 'ERROR',
            location: `entry[${index}] (${entry.slug || 'no slug'})`,
            message: problem
          });
        });

        // Check if audio reference is object with both copy.en and copy.vi
        if (entry.copy && entry.copy.en && entry.copy.vi) {
          if (typeof entry.audio === 'string') {
            // This is OK - single audio file for bilingual content
          } else if (typeof entry.audio === 'object') {
            // This is also OK - separate audio for each language
          }
        }
      });
    }

    if (fileIssues.length > 0) {
      summary.filesWithIssues++;
      issues.push({
        file: filename,
        issues: fileIssues
      });
    }

  } catch (error) {
    issues.push({
      file: path.basename(filePath),
      issues: [{
        type: 'CRITICAL',
        message: `Failed to parse: ${error.message}`
      }]
    });
  }
}

// Main execution
console.log('🔍 Starting comprehensive audio reference audit...\n');

if (!fs.existsSync(dataDir)) {
  console.error(`❌ Data directory not found: ${dataDir}`);
  process.exit(1);
}

const files = fs.readdirSync(dataDir)
  .filter(f => f.endsWith('.json'))
  .sort();

files.forEach(file => {
  auditJsonFile(path.join(dataDir, file));
});

// Print results
console.log('📊 AUDIT SUMMARY');
console.log('='.repeat(60));
console.log(`Total JSON files scanned: ${summary.totalFiles}`);
console.log(`Total entries checked: ${summary.totalEntries}`);
console.log(`Files with issues: ${summary.filesWithIssues}`);
console.log(`\nIssue breakdown:`);
console.log(`  - Missing audio: ${summary.issueTypes.missingAudio}`);
console.log(`  - Wrong tier: ${summary.issueTypes.wrongTier}`);
console.log(`  - Invalid path: ${summary.issueTypes.invalidPath}`);
console.log(`  - Root level audio: ${summary.issueTypes.rootLevelAudio}`);
console.log('='.repeat(60));

if (issues.length > 0) {
  console.log(`\n⚠️  DETAILED ISSUES (${issues.length} files)\n`);
  
  issues.forEach(({ file, issues: fileIssues }) => {
    console.log(`\n📄 ${file}`);
    fileIssues.forEach(issue => {
      const icon = issue.type === 'CRITICAL' ? '🔴' : issue.type === 'ERROR' ? '🟠' : '🟡';
      console.log(`  ${icon} [${issue.type}] ${issue.location ? `${issue.location}: ` : ''}${issue.message}`);
    });
  });

  // Save detailed report
  const reportPath = path.join(__dirname, '../audio-audit-report.json');
  fs.writeFileSync(reportPath, JSON.stringify({ summary, issues }, null, 2));
  console.log(`\n💾 Detailed report saved to: ${reportPath}`);
} else {
  console.log('\n✅ No issues found! All audio references are consistent.');
}

console.log('\n✨ Audit complete!');
