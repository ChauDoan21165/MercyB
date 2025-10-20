#!/usr/bin/env node
/**
 * Comprehensive Room Data Integrity & Quality Validator
 * Checks all room JSON files for syntax, structure, completeness, and consistency
 */

import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

interface ValidationReport {
  totalFiles: number;
  validFiles: number;
  filesWithIssues: number;
  errors: Array<{ file: string; message: string }>;
  warnings: Array<{ file: string; message: string }>;
  info: Array<{ file: string; message: string }>;
  stats: {
    totalEntries: number;
    totalKeywords: number;
    avgEntriesPerRoom: number;
    avgKeywordsPerRoom: number;
  };
}

const report: ValidationReport = {
  totalFiles: 0,
  validFiles: 0,
  filesWithIssues: 0,
  errors: [],
  warnings: [],
  info: [],
  stats: {
    totalEntries: 0,
    totalKeywords: 0,
    avgEntriesPerRoom: 0,
    avgKeywordsPerRoom: 0,
  }
};

// Check which files exist
const roomsDir = join(process.cwd(), 'src/data/rooms');
const existingFiles = readdirSync(roomsDir).filter(f => f.endsWith('.json'));

// Check which files are imported
const importsFile = readFileSync(join(process.cwd(), 'src/lib/roomDataImports.ts'), 'utf-8');
const importedFiles = new Set<string>();
const importMatches = importsFile.matchAll(/from '@\/data\/rooms\/(.+?)\.json'/g);
for (const match of importMatches) {
  importedFiles.add(match[1] + '.json');
}

console.log('\n🔍 Room Data Integrity & Quality Validation');
console.log('═'.repeat(70));
console.log(`\n📁 Found ${existingFiles.length} JSON files in src/data/rooms/`);
console.log(`📦 Found ${importedFiles.size} imported files in roomDataImports.ts\n`);

// Check for orphaned files (exist but not imported)
const orphanedFiles = existingFiles.filter(f => !importedFiles.has(f));
if (orphanedFiles.length > 0) {
  console.log(`⚠️  Found ${orphanedFiles.length} orphaned files (exist but not imported):`);
  orphanedFiles.forEach(f => {
    console.log(`   - ${f}`);
    report.warnings.push({ file: f, message: 'File exists but is not imported in roomDataImports.ts' });
  });
  console.log();
}

// Check for missing files (imported but don't exist)
const missingFiles = Array.from(importedFiles).filter(f => !existingFiles.includes(f));
if (missingFiles.length > 0) {
  console.log(`❌ Found ${missingFiles.length} missing files (imported but don't exist):`);
  missingFiles.forEach(f => {
    console.log(`   - ${f}`);
    report.errors.push({ file: f, message: 'File is imported but does not exist' });
  });
  console.log();
}

console.log('🔬 Validating file contents...\n');

// Validate each file
existingFiles.forEach(filename => {
  report.totalFiles++;
  const filePath = join(roomsDir, filename);
  let hasIssues = false;
  
  try {
    const content = readFileSync(filePath, 'utf-8');
    
    // 1. JSON Syntax
    let data: any;
    try {
      data = JSON.parse(content);
    } catch (e) {
      report.errors.push({ file: filename, message: `Invalid JSON: ${e instanceof Error ? e.message : 'Parse error'}` });
      hasIssues = true;
      return;
    }
    
    // 2. Required Fields
    const requiredFields = ['schema_version', 'schema_id', 'description', 'keywords', 'entries'];
    requiredFields.forEach(field => {
      if (!data[field]) {
        report.errors.push({ file: filename, message: `Missing required field: ${field}` });
        hasIssues = true;
      }
    });
    
    // 3. Description Languages
    if (data.description) {
      if (!data.description.en || data.description.en.trim() === '') {
        report.warnings.push({ file: filename, message: 'Missing or empty English description' });
        hasIssues = true;
      }
      if (!data.description.vi || data.description.vi.trim() === '') {
        report.warnings.push({ file: filename, message: 'Missing or empty Vietnamese description' });
        hasIssues = true;
      }
    }
    
    // 4. Keywords Quality
    if (data.keywords) {
      const keywordCount = Object.keys(data.keywords).length;
      report.stats.totalKeywords += keywordCount;
      
      if (keywordCount === 0) {
        report.warnings.push({ file: filename, message: 'No keywords defined' });
        hasIssues = true;
      } else if (keywordCount < 3) {
        report.info.push({ file: filename, message: `Only ${keywordCount} keyword categories (consider adding more)` });
      }
      
      // Check each keyword has both languages
      Object.entries(data.keywords).forEach(([key, value]: [string, any]) => {
        if (!value?.en || value.en.length === 0) {
          report.warnings.push({ file: filename, message: `Keyword "${key}" missing English terms` });
          hasIssues = true;
        }
        if (!value?.vi || value.vi.length === 0) {
          report.warnings.push({ file: filename, message: `Keyword "${key}" missing Vietnamese terms` });
          hasIssues = true;
        }
      });
    }
    
    // 5. Entries Quality
    if (data.entries && Array.isArray(data.entries)) {
      const entryCount = data.entries.length;
      report.stats.totalEntries += entryCount;
      
      if (entryCount === 0) {
        report.errors.push({ file: filename, message: 'No entries defined' });
        hasIssues = true;
      } else if (entryCount < 5) {
        report.info.push({ file: filename, message: `Only ${entryCount} entries (might need more content)` });
      }
      
      // Check each entry
      data.entries.forEach((entry: any, idx: number) => {
        const entryId = entry.slug || `entry-${idx}`;
        
        if (!entry.slug) {
          report.errors.push({ file: filename, message: `Entry ${idx} missing slug` });
          hasIssues = true;
        }
        
        if (!entry.title?.en || !entry.title?.vi) {
          report.warnings.push({ file: filename, message: `Entry "${entryId}" missing title translations` });
          hasIssues = true;
        }
        
        if (!entry.copy?.en || !entry.copy?.vi) {
          report.warnings.push({ file: filename, message: `Entry "${entryId}" missing copy translations` });
          hasIssues = true;
        }
        
        if (!entry.tags || entry.tags.length === 0) {
          report.info.push({ file: filename, message: `Entry "${entryId}" has no tags` });
        }
      });
    }
    
    // 6. Room Essay
    if (data.room_essay) {
      if (!data.room_essay.en && !data.room_essay.vi) {
        report.info.push({ file: filename, message: 'Room essay defined but empty' });
      } else {
        if (data.room_essay.en && data.room_essay.en.length < 100) {
          report.info.push({ file: filename, message: 'English essay is very short (<100 chars)' });
        }
        if (data.room_essay.vi && data.room_essay.vi.length < 100) {
          report.info.push({ file: filename, message: 'Vietnamese essay is very short (<100 chars)' });
        }
      }
    }
    
    if (!hasIssues) {
      report.validFiles++;
    }
    
  } catch (error) {
    report.errors.push({ 
      file: filename, 
      message: `Validation failed: ${error instanceof Error ? error.message : 'Unknown error'}` 
    });
    hasIssues = true;
  }
  
  if (hasIssues) {
    report.filesWithIssues++;
  }
});

// Calculate averages
report.stats.avgEntriesPerRoom = Math.round(report.stats.totalEntries / report.totalFiles);
report.stats.avgKeywordsPerRoom = Math.round(report.stats.totalKeywords / report.totalFiles);

// Print Report
console.log('═'.repeat(70));
console.log('\n📊 VALIDATION SUMMARY\n');

if (report.errors.length === 0 && report.warnings.length === 0) {
  console.log('✅ All files passed validation!\n');
} else {
  if (report.errors.length > 0) {
    console.log(`\n❌ ERRORS (${report.errors.length}):\n`);
    report.errors.forEach(({ file, message }) => {
      console.log(`   ${file}: ${message}`);
    });
  }
  
  if (report.warnings.length > 0) {
    console.log(`\n⚠️  WARNINGS (${report.warnings.length}):\n`);
    report.warnings.forEach(({ file, message }) => {
      console.log(`   ${file}: ${message}`);
    });
  }
  
  if (report.info.length > 0) {
    console.log(`\nℹ️  INFO (${report.info.length}):\n`);
    report.info.forEach(({ file, message }) => {
      console.log(`   ${file}: ${message}`);
    });
  }
}

console.log('\n═'.repeat(70));
console.log('\n📈 STATISTICS\n');
console.log(`   Files checked:        ${report.totalFiles}`);
console.log(`   ✅ Valid files:       ${report.validFiles}`);
console.log(`   ⚠️  Files with issues: ${report.filesWithIssues}`);
console.log(`   Total entries:        ${report.stats.totalEntries}`);
console.log(`   Total keyword cats:   ${report.stats.totalKeywords}`);
console.log(`   Avg entries/room:     ${report.stats.avgEntriesPerRoom}`);
console.log(`   Avg keywords/room:    ${report.stats.avgKeywordsPerRoom}`);

console.log('\n═'.repeat(70));

const issueCount = report.errors.length + report.warnings.length;
console.log(`\n${issueCount === 0 ? '✅' : '⚠️'} Total issues: ${issueCount} (${report.errors.length} errors, ${report.warnings.length} warnings, ${report.info.length} info)\n`);

// Exit code: 0 if no errors, 1 if errors exist
process.exit(report.errors.length > 0 ? 1 : 0);
