/**
 * Validate VIP2 JSON files structure
 * Ensures all VIP2 files use the new name/description/keywords structure
 * and don't have old tier/title/content fields
 * 
 * Run with: node scripts/validate-vip2-structure.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const dataDir = path.join(projectRoot, 'public', 'data');

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m'
};

const issues = [];
let filesChecked = 0;
let filesValid = 0;

/**
 * Validate a single VIP2 JSON file
 */
function validateVIP2File(filePath, filename) {
  try {
    const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const fileIssues = [];

    // Check for REQUIRED fields in new structure
    if (!content.name || typeof content.name !== 'string' || content.name.trim() === '') {
      fileIssues.push('❌ Missing or empty "name" field (English name)');
    }

    if (!content.name_vi || typeof content.name_vi !== 'string' || content.name_vi.trim() === '') {
      fileIssues.push('❌ Missing or empty "name_vi" field (Vietnamese name)');
    }

    if (!content.description) {
      fileIssues.push('❌ Missing "description" field');
    } else if (typeof content.description !== 'string' || content.description.trim() === '') {
      fileIssues.push('❌ "description" must be a non-empty string');
    }

    if (!content.description_vi) {
      fileIssues.push('⚠️  Missing "description_vi" field (Vietnamese description)');
    } else if (typeof content.description_vi !== 'string' || content.description_vi.trim() === '') {
      fileIssues.push('⚠️  "description_vi" should be a non-empty string');
    }

    if (!content.keywords_en || !Array.isArray(content.keywords_en) || content.keywords_en.length === 0) {
      fileIssues.push('❌ Missing or invalid "keywords_en" array');
    }

    if (!content.keywords_vi || !Array.isArray(content.keywords_vi) || content.keywords_vi.length === 0) {
      fileIssues.push('❌ Missing or invalid "keywords_vi" array');
    }

    if (!content.entries || !Array.isArray(content.entries) || content.entries.length === 0) {
      fileIssues.push('❌ Missing or empty "entries" array');
    }

    // Check for OLD fields that should NOT exist
    if (content.tier) {
      fileIssues.push('⚠️  Found old "tier" field - should be removed (tier is in filename)');
    }

    if (content.title && typeof content.title === 'object' && (content.title.en || content.title.vi)) {
      fileIssues.push('⚠️  Found old "title" object structure - should use "name" and "name_vi" instead');
    }

    if (content.content && typeof content.content === 'object' && (content.content.en || content.content.vi)) {
      fileIssues.push('⚠️  Found old "content" object structure - should use "description" and "description_vi" instead');
    }

    // Validate entries structure
    if (content.entries && Array.isArray(content.entries)) {
      content.entries.forEach((entry, index) => {
        if (!entry.slug) {
          fileIssues.push(`❌ Entry ${index + 1}: Missing "slug" field`);
        }
        if (!entry.copy || !entry.copy.en || !entry.copy.vi) {
          fileIssues.push(`❌ Entry ${index + 1}: Missing or invalid "copy" object (needs en and vi)`);
        }
        if (!entry.keywords_en || !Array.isArray(entry.keywords_en)) {
          fileIssues.push(`⚠️  Entry ${index + 1}: Missing or invalid "keywords_en"`);
        }
        if (!entry.keywords_vi || !Array.isArray(entry.keywords_vi)) {
          fileIssues.push(`⚠️  Entry ${index + 1}: Missing or invalid "keywords_vi"`);
        }
      });
    }

    if (fileIssues.length > 0) {
      issues.push({
        file: filename,
        issues: fileIssues
      });
      console.log(`${colors.red}✗${colors.reset} ${filename} - ${fileIssues.length} issue(s) found`);
    } else {
      filesValid++;
      console.log(`${colors.green}✓${colors.reset} ${filename} - Valid structure`);
    }

    filesChecked++;
  } catch (error) {
    issues.push({
      file: filename,
      issues: [`❌ Failed to parse JSON: ${error.message}`]
    });
    console.log(`${colors.red}✗${colors.reset} ${filename} - Parse error: ${error.message}`);
    filesChecked++;
  }
}

/**
 * Main validation function
 */
function validateAllVIP2Files() {
  console.log(`${colors.bold}${colors.cyan}🔍 Validating VIP2 JSON Structure${colors.reset}\n`);
  console.log(`Scanning: ${dataDir}\n`);

  if (!fs.existsSync(dataDir)) {
    console.error(`${colors.red}Error: Data directory not found: ${dataDir}${colors.reset}`);
    process.exit(1);
  }

  const files = fs.readdirSync(dataDir);
  const vip2Files = files.filter(f => f.endsWith('_vip2.json') || f.endsWith('-vip2.json'));

  if (vip2Files.length === 0) {
    console.log(`${colors.yellow}No VIP2 files found${colors.reset}`);
    process.exit(0);
  }

  console.log(`Found ${vip2Files.length} VIP2 files to validate\n`);

  // Validate each file
  vip2Files.forEach(filename => {
    const filePath = path.join(dataDir, filename);
    validateVIP2File(filePath, filename);
  });

  // Print summary
  console.log(`\n${colors.bold}${colors.cyan}═══════════════════════════════════════${colors.reset}`);
  console.log(`${colors.bold}Validation Summary${colors.reset}`);
  console.log(`${colors.cyan}═══════════════════════════════════════${colors.reset}`);
  console.log(`Total files checked: ${filesChecked}`);
  console.log(`${colors.green}Valid files: ${filesValid}${colors.reset}`);
  console.log(`${colors.red}Files with issues: ${issues.length}${colors.reset}`);

  // Print detailed issues
  if (issues.length > 0) {
    console.log(`\n${colors.bold}${colors.red}Issues Found:${colors.reset}\n`);
    issues.forEach(({ file, issues: fileIssues }) => {
      console.log(`${colors.yellow}${file}:${colors.reset}`);
      fileIssues.forEach(issue => {
        console.log(`  ${issue}`);
      });
      console.log('');
    });
    
    console.log(`${colors.red}${colors.bold}❌ Validation failed!${colors.reset}`);
    console.log(`Please fix the issues above before proceeding.\n`);
    process.exit(1);
  } else {
    console.log(`\n${colors.green}${colors.bold}✅ All VIP2 files are valid!${colors.reset}\n`);
    process.exit(0);
  }
}

// Run validation
validateAllVIP2Files();
