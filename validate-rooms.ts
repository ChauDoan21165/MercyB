/**
 * Room Data Validation Script
 * Checks integrity and quality of all room JSON files
 */

import * as fs from 'fs';
import * as path from 'path';

interface ValidationIssue {
  file: string;
  severity: 'error' | 'warning' | 'info';
  message: string;
}

interface RoomData {
  schema_version?: string;
  schema_id?: string;
  description?: { en?: string; vi?: string };
  supported_languages?: string[];
  keywords?: Record<string, any>;
  entries?: Array<{
    slug?: string;
    title?: { en?: string; vi?: string };
    copy?: { en?: string; vi?: string };
    tags?: string[];
  }>;
  room_essay?: {
    en?: string;
    vi?: string;
  };
}

const issues: ValidationIssue[] = [];

// Required top-level fields
const requiredFields = ['schema_version', 'schema_id', 'description', 'keywords', 'entries'];

// Get all JSON files in src/data/rooms
const roomsDir = path.join(process.cwd(), 'src/data/rooms');
const roomFiles = fs.readdirSync(roomsDir).filter(file => file.endsWith('.json'));

console.log(`\n🔍 Validating ${roomFiles.length} room files...\n`);

roomFiles.forEach(file => {
  const filePath = path.join(roomsDir, file);
  
  try {
    // 1. Check if file can be parsed as JSON
    const content = fs.readFileSync(filePath, 'utf-8');
    const data: RoomData = JSON.parse(content);
    
    // 2. Check required top-level fields
    requiredFields.forEach(field => {
      if (!(field in data)) {
        issues.push({
          file,
          severity: 'error',
          message: `Missing required field: ${field}`
        });
      }
    });
    
    // 3. Check description has both languages
    if (data.description) {
      if (!data.description.en) {
        issues.push({
          file,
          severity: 'warning',
          message: 'Missing English description'
        });
      }
      if (!data.description.vi) {
        issues.push({
          file,
          severity: 'warning',
          message: 'Missing Vietnamese description'
        });
      }
    }
    
    // 4. Check keywords structure
    if (data.keywords && Object.keys(data.keywords).length === 0) {
      issues.push({
        file,
        severity: 'warning',
        message: 'Keywords object is empty'
      });
    }
    
    // 5. Check entries
    if (data.entries) {
      if (data.entries.length === 0) {
        issues.push({
          file,
          severity: 'warning',
          message: 'Entries array is empty'
        });
      }
      
      // Check each entry has required fields
      data.entries.forEach((entry, index) => {
        if (!entry.slug) {
          issues.push({
            file,
            severity: 'error',
            message: `Entry ${index} missing slug`
          });
        }
        if (!entry.title || !entry.title.en || !entry.title.vi) {
          issues.push({
            file,
            severity: 'warning',
            message: `Entry ${index} (${entry.slug || 'unknown'}) missing title translations`
          });
        }
        if (!entry.copy || !entry.copy.en || !entry.copy.vi) {
          issues.push({
            file,
            severity: 'warning',
            message: `Entry ${index} (${entry.slug || 'unknown'}) missing copy translations`
          });
        }
      });
    }
    
    // 6. Check room_essay if present
    if (data.room_essay) {
      if (!data.room_essay.en && !data.room_essay.vi) {
        issues.push({
          file,
          severity: 'info',
          message: 'Room essay exists but has no content'
        });
      }
    }
    
  } catch (error) {
    issues.push({
      file,
      severity: 'error',
      message: `Failed to parse JSON: ${error instanceof Error ? error.message : 'Unknown error'}`
    });
  }
});

// Report results
console.log('📊 Validation Results\n');
console.log('═'.repeat(60));

const errors = issues.filter(i => i.severity === 'error');
const warnings = issues.filter(i => i.severity === 'warning');
const infos = issues.filter(i => i.severity === 'info');

if (issues.length === 0) {
  console.log('\n✅ All room files passed validation!\n');
} else {
  if (errors.length > 0) {
    console.log(`\n❌ ERRORS (${errors.length}):\n`);
    errors.forEach(issue => {
      console.log(`  ${issue.file}: ${issue.message}`);
    });
  }
  
  if (warnings.length > 0) {
    console.log(`\n⚠️  WARNINGS (${warnings.length}):\n`);
    warnings.forEach(issue => {
      console.log(`  ${issue.file}: ${issue.message}`);
    });
  }
  
  if (infos.length > 0) {
    console.log(`\nℹ️  INFO (${infos.length}):\n`);
    infos.forEach(issue => {
      console.log(`  ${issue.file}: ${issue.message}`);
    });
  }
}

console.log('\n' + '═'.repeat(60));
console.log(`\n📈 Summary: ${roomFiles.length} files checked`);
console.log(`   ✅ Clean: ${roomFiles.length - new Set(issues.map(i => i.file)).size}`);
console.log(`   ⚠️  With issues: ${new Set(issues.map(i => i.file)).size}`);
console.log(`   Total issues: ${issues.length} (${errors.length} errors, ${warnings.length} warnings, ${infos.length} info)\n`);

process.exit(errors.length > 0 ? 1 : 0);
