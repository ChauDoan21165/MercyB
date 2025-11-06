import { readdir, readFile, writeFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');
const DATA_DIR = join(projectRoot, 'public', 'data');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

const stats = {
  totalFiles: 0,
  fixedFiles: 0,
  issues: [],
};

function fixCommonIssues(jsonString) {
  // Remove trailing commas before closing brackets/braces
  let fixed = jsonString.replace(/,(\s*[}\]])/g, '$1');
  
  // Normalize line endings
  fixed = fixed.replace(/\r\n/g, '\n');
  
  return fixed;
}

async function fixJsonFile(filePath, filename) {
  try {
    const content = await readFile(filePath, 'utf-8');
    const fixedContent = fixCommonIssues(content);
    
    // Try to parse and re-stringify for consistent formatting
    let data;
    try {
      data = JSON.parse(fixedContent);
    } catch (parseError) {
      console.log(`  ${colors.yellow}⚠${colors.reset} ${filename}: Could not parse - ${parseError.message}`);
      stats.issues.push({ file: filename, issue: 'Parse error after fixes' });
      return false;
    }
    
    // Re-stringify with consistent formatting
    const formatted = JSON.stringify(data, null, 2) + '\n';
    
    // Only write if content changed
    if (formatted !== content) {
      await writeFile(filePath, formatted, 'utf-8');
      console.log(`  ${colors.green}✓${colors.reset} ${filename}: Fixed formatting issues`);
      stats.fixedFiles++;
      return true;
    } else {
      console.log(`  ${colors.cyan}·${colors.reset} ${filename}: No changes needed`);
      return false;
    }
  } catch (error) {
    console.log(`  ${colors.yellow}⚠${colors.reset} ${filename}: ${error.message}`);
    stats.issues.push({ file: filename, issue: error.message });
    return false;
  }
}

async function processDataDirectory() {
  const files = await readdir(DATA_DIR);
  const jsonFiles = files.filter(f => f.endsWith('.json') && !f.startsWith('.'));

  console.log(`\n${colors.cyan}🔧 Auto-fixing JSON files (${jsonFiles.length} files)${colors.reset}\n`);

  for (const file of jsonFiles) {
    stats.totalFiles++;
    const filePath = join(DATA_DIR, file);
    await fixJsonFile(filePath, file);
  }
}

async function main() {
  console.log(`${colors.blue}═══════════════════════════════════════════════════${colors.reset}`);
  console.log(`${colors.blue}       JSON AUTO-FIX REPORT${colors.reset}`);
  console.log(`${colors.blue}═══════════════════════════════════════════════════${colors.reset}`);

  await processDataDirectory();

  // Summary
  console.log(`\n${colors.blue}═══════════════════════════════════════════════════${colors.reset}`);
  console.log(`${colors.blue}                    SUMMARY${colors.reset}`);
  console.log(`${colors.blue}═══════════════════════════════════════════════════${colors.reset}`);
  console.log(`Total files processed: ${stats.totalFiles}`);
  console.log(`${colors.green}Files fixed: ${stats.fixedFiles}${colors.reset}`);
  console.log(`${colors.yellow}Files with issues: ${stats.issues.length}${colors.reset}`);

  if (stats.issues.length > 0) {
    console.log(`\n${colors.yellow}Issues encountered:${colors.reset}`);
    stats.issues.forEach(({ file, issue }) => {
      console.log(`  - ${file}: ${issue}`);
    });
  }

  if (stats.fixedFiles > 0) {
    console.log(`\n${colors.green}✓ Fixed ${stats.fixedFiles} file(s)${colors.reset}\n`);
  } else {
    console.log(`\n${colors.green}✓ All files already properly formatted${colors.reset}\n`);
  }

  process.exit(0);
}

main().catch(error => {
  console.error(`${colors.red}Fatal error:${colors.reset}`, error);
  process.exit(1);
});
