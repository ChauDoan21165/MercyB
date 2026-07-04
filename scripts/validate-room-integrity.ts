#!/usr/bin/env node
/**
 * Comprehensive Room Data Integrity & Quality Validator
 * Checks all room JSON files for syntax, structure, completeness, and consistency
 */

import { readFileSync, readdirSync, existsSync } from 'fs';
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

type JsonRecord = Record<string, unknown>;

function isRecord(value: unknown): value is JsonRecord {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function hasItems(value: unknown): boolean {
  return Array.isArray(value) && value.length > 0;
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

// ✅ Look in public/data (real room JSONs), not src/data/rooms
const roomsDir = join(process.cwd(), 'public', 'data');

if (!existsSync(roomsDir)) {
  console.error(`\n❌ Rooms directory not found: ${roomsDir}`);
  console.error('Make sure your room JSON files live in public/data\n');
  process.exit(1);
}

const existingFiles = readdirSync(roomsDir).filter(f => f.endsWith('.json'));

// Optional: import consistency check (only if file exists)
const importsPath = join(process.cwd(), 'src/lib/roomDataImports.ts');
const importedFiles = new Set<string>();

if (existsSync(importsPath)) {
  const importsFile = readFileSync(importsPath, 'utf-8');
  const importMatches = importsFile.matchAll(/from '@\/data\/rooms\/(.+?)\.json'/g);
  for (const match of importMatches) {
    importedFiles.add(match[1] + '.json');
  }
}

console.log('\n🔍 Room Data Integrity & Quality Validation');
console.log('═'.repeat(70));
console.log(`\n📁 Found ${existingFiles.length} JSON files in public/data/`);
if (existsSync(importsPath)) {
  console.log(`📦 Found ${importedFiles.size} imported files in roomDataImports.ts\n`);
} else {
  console.log('📦 roomDataImports.ts not found – skipping import consistency checks\n');
}

// Check orphaned files (exist but not imported)
if (importedFiles.size > 0) {
  const orphanedFiles = existingFiles.filter(f => !importedFiles.has(f));
  if (orphanedFiles.length > 0) {
    console.log(`⚠️  Found ${orphanedFiles.length} orphaned files (exist but not imported):`);
    orphanedFiles.forEach(f => {
      console.log(`   - ${f}`);
      report.warnings.push({ file: f, message: 'File exists but is not imported in roomDataImports.ts' });
    });
    console.log();
  }

  // Check missing files (imported but don’t exist)
  const missingFiles = Array.from(importedFiles).filter(f => !existingFiles.includes(f));
  if (missingFiles.length > 0) {
    console.log(`❌ Found ${missingFiles.length} missing files (imported but don’t exist):`);
    missingFiles.forEach(f => {
      console.log(`   - ${f}`);
      report.errors.push({ file: f, message: 'File is imported but does not exist' });
    });
    console.log();
  }
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
    let parsed: unknown;
    try {
      parsed = JSON.parse(content);
    } catch (e) {
      report.errors.push({ file: filename, message: `Invalid JSON: ${e instanceof Error ? e.message : 'Parse error'}` });
      hasIssues = true;
      return;
    }

    const data = isRecord(parsed) ? parsed : {};
    
    // 2. Required Fields (legacy room-schema style – keep for now)
    const requiredFields = ['schema_version', 'schema_id', 'description', 'keywords', 'entries'];
    requiredFields.forEach(field => {
      if (data[field] === undefined) {
        report.errors.push({ file: filename, message: `Missing required field: ${field}` });
        hasIssues = true;
      }
    });
    
    // 3. Description Languages
    const description = isRecord(data.description) ? data.description : null;
    if (description) {
      if (typeof description.en !== 'string' || description.en.trim() === '') {
        report.warnings.push({ file: filename, message: 'Missing or empty English description' });
        hasIssues = true;
      }
      if (typeof description.vi !== 'string' || description.vi.trim() === '') {
        report.warnings.push({ file: filename, message: 'Missing or empty Vietnamese description' });
        hasIssues = true;
      }
    }
    
    // 4. Keywords Quality
    const keywords = isRecord(data.keywords) ? data.keywords : null;
    if (keywords) {
      const keywordCount = Object.keys(keywords).length;
      report.stats.totalKeywords += keywordCount;
      
      if (keywordCount === 0) {
        report.warnings.push({ file: filename, message: 'No keywords defined' });
        hasIssues = true;
      } else if (keywordCount < 3) {
        report.info.push({ file: filename, message: `Only ${keywordCount} keyword categories (consider adding more)` });
      }
      
      Object.entries(keywords).forEach(([key, value]) => {
        const keyword = isRecord(value) ? value : {};
        if (!hasItems(keyword.en)) {
          report.warnings.push({ file: filename, message: `Keyword "${key}" missing English terms` });
          hasIssues = true;
        }
        if (!hasItems(keyword.vi)) {
          report.warnings.push({ file: filename, message: `Keyword "${key}" missing Vietnamese terms` });
          hasIssues = true;
        }
      });
    }
    
    // 5. Entries Quality
    if (Array.isArray(data.entries)) {
      const entryCount = data.entries.length;
      report.stats.totalEntries += entryCount;
      
      if (entryCount === 0) {
        report.errors.push({ file: filename, message: 'No entries defined' });
        hasIssues = true;
      } else if (entryCount < 5) {
        report.info.push({ file: filename, message: `Only ${entryCount} entries (might need more content)` });
      }
      
      data.entries.forEach((entryValue, idx: number) => {
        const entry = isRecord(entryValue) ? entryValue : {};
        const entryId = entry.slug || `entry-${idx}`;
        const title = isRecord(entry.title) ? entry.title : {};
        const copy = isRecord(entry.copy) ? entry.copy : {};
        
        if (!entry.slug) {
          report.errors.push({ file: filename, message: `Entry ${idx} missing slug` });
          hasIssues = true;
        }
        
        if (!title.en || !title.vi) {
          report.warnings.push({ file: filename, message: `Entry "${entryId}" missing title translations` });
          hasIssues = true;
        }
        
        if (!copy.en || !copy.vi) {
          report.warnings.push({ file: filename, message: `Entry "${entryId}" missing copy translations` });
          hasIssues = true;
        }
        
        if (!hasItems(entry.tags)) {
          report.info.push({ file: filename, message: `Entry "${entryId}" has no tags` });
        }
      });
    }
    
    // 6. Room Essay
    const roomEssay = isRecord(data.room_essay) ? data.room_essay : null;
    if (roomEssay) {
      if (!roomEssay.en && !roomEssay.vi) {
        report.info.push({ file: filename, message: 'Room essay defined but empty' });
      } else {
        if (typeof roomEssay.en === 'string' && roomEssay.en.length < 100) {
          report.info.push({ file: filename, message: 'English essay is very short (<100 chars)' });
        }
        if (typeof roomEssay.vi === 'string' && roomEssay.vi.length < 100) {
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
report.stats.avgEntriesPerRoom = report.totalFiles > 0
  ? Math.round(report.stats.totalEntries / report.totalFiles)
  : 0;
report.stats.avgKeywordsPerRoom = report.totalFiles > 0
  ? Math.round(report.stats.totalKeywords / report.totalFiles)
  : 0;

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

const issueCount = report.errors.length + report.warnings.length + report.info.length;
console.log(`\n${issueCount === 0 ? '✅' : '⚠️'} Total issues: ${issueCount} (${report.errors.length} errors, ${report.warnings.length} warnings, ${report.info.length} info)\n`);

// Exit code: 0 if no errors, 1 if errors exist
process.exit(report.errors.length > 0 ? 1 : 0);
