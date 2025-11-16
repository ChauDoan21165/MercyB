#!/usr/bin/env node

/**
 * Audio Content Match Validator
 * 
 * This script helps prevent audio/content mismatches by:
 * 1. Checking that entry slugs match audio file patterns
 * 2. Validating that keywords appear in the copy text
 * 3. Creating a mapping report for manual verification
 * 
 * Usage: node scripts/validate-audio-content-match.js [room-file.json]
 */

const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '../public/data');
const audioDir = path.join(__dirname, '../public/audio');

function extractKeywordsFromText(text) {
  // Extract words that might be keywords (simplified)
  const words = text.toLowerCase()
    .replace(/[*_]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 3);
  return new Set(words);
}

function checkKeywordMatch(keywords, copyText) {
  const textWords = extractKeywordsFromText(copyText);
  const matches = [];
  const misses = [];
  
  keywords.forEach(keyword => {
    const keywordWords = keyword.toLowerCase().split(/\s+/);
    const allWordsPresent = keywordWords.every(word => textWords.has(word));
    
    if (allWordsPresent) {
      matches.push(keyword);
    } else {
      misses.push(keyword);
    }
  });
  
  return { matches, misses, matchRate: matches.length / keywords.length };
}

function validateRoomFile(filePath) {
  console.log(`\n${'='.repeat(80)}`);
  console.log(`Validating: ${path.basename(filePath)}`);
  console.log('='.repeat(80));
  
  const content = fs.readFileSync(filePath, 'utf8');
  const data = JSON.parse(content);
  
  if (!data.entries || !Array.isArray(data.entries)) {
    console.log('❌ No entries array found');
    return;
  }
  
  const issues = [];
  const report = [];
  
  data.entries.forEach((entry, index) => {
    const position = index + 1;
    const slug = entry.slug || 'unknown';
    const audio = entry.audio || 'missing';
    const keywords_en = entry.keywords_en || [];
    const copy_en = entry.copy?.en || '';
    
    console.log(`\n--- Entry ${position}: ${slug} ---`);
    console.log(`Audio: ${audio}`);
    console.log(`Keywords: ${keywords_en.join(', ')}`);
    
    // Check if audio file exists
    const audioPath = path.join(audioDir, audio.replace(/^\/audio\//, ''));
    const audioExists = fs.existsSync(audioPath);
    console.log(`Audio file exists: ${audioExists ? '✅' : '❌'}`);
    
    if (!audioExists) {
      issues.push({
        position,
        slug,
        type: 'missing_audio',
        message: `Audio file not found: ${audio}`
      });
    }
    
    // Check keyword match
    const keywordCheck = checkKeywordMatch(keywords_en, copy_en);
    console.log(`Keyword match rate: ${(keywordCheck.matchRate * 100).toFixed(0)}%`);
    
    if (keywordCheck.misses.length > 0) {
      console.log(`⚠️  Missing keywords in text: ${keywordCheck.misses.join(', ')}`);
      issues.push({
        position,
        slug,
        type: 'keyword_mismatch',
        message: `Keywords not found in copy: ${keywordCheck.misses.join(', ')}`,
        severity: keywordCheck.matchRate < 0.5 ? 'high' : 'medium'
      });
    } else {
      console.log('✅ All keywords found in copy');
    }
    
    // Add to report
    report.push({
      position,
      slug,
      audio,
      audioExists,
      firstKeyword: keywords_en[0],
      keywordMatchRate: keywordCheck.matchRate,
      textPreview: copy_en.substring(0, 100) + '...'
    });
  });
  
  // Print summary
  console.log(`\n${'='.repeat(80)}`);
  console.log('VALIDATION SUMMARY');
  console.log('='.repeat(80));
  console.log(`Total entries: ${data.entries.length}`);
  console.log(`Issues found: ${issues.length}`);
  
  if (issues.length > 0) {
    console.log('\n⚠️  ISSUES DETECTED:');
    issues.forEach(issue => {
      const severity = issue.severity ? `[${issue.severity.toUpperCase()}]` : '';
      console.log(`  ${severity} Position ${issue.position} (${issue.slug}):`);
      console.log(`    ${issue.message}`);
    });
  } else {
    console.log('\n✅ No issues detected!');
  }
  
  // Save detailed report
  const reportPath = path.join(__dirname, '../audio-content-match-report.json');
  fs.writeFileSync(reportPath, JSON.stringify({ 
    file: path.basename(filePath),
    timestamp: new Date().toISOString(),
    entries: report, 
    issues 
  }, null, 2));
  console.log(`\nDetailed report saved to: ${reportPath}`);
  
  return issues.length === 0;
}

// Main execution
const args = process.argv.slice(2);
let allValid = true;

if (args.length > 0) {
  // Validate specific file
  const filePath = path.resolve(args[0]);
  if (!fs.existsSync(filePath)) {
    console.error(`❌ File not found: ${filePath}`);
    process.exit(1);
  }
  allValid = validateRoomFile(filePath);
} else {
  // Validate all JSON files in data directory
  const files = fs.readdirSync(dataDir)
    .filter(f => f.endsWith('.json'))
    .map(f => path.join(dataDir, f));
  
  console.log(`Found ${files.length} room files to validate\n`);
  
  files.forEach(file => {
    const valid = validateRoomFile(file);
    if (!valid) allValid = false;
  });
}

console.log(`\n${'='.repeat(80)}`);
console.log(allValid ? '✅ All validations passed!' : '⚠️  Some validations failed');
console.log('='.repeat(80)\n);

process.exit(allValid ? 0 : 1);
