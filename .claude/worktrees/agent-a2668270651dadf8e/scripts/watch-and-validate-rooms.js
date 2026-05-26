import { watch } from 'fs';
import { join, dirname, basename } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');
const DATA_DIR = join(projectRoot, 'public', 'data');

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
};

// Debounce validation to avoid multiple runs on rapid saves
const pendingValidations = new Map();

function validateRoom(filename) {
  const key = filename;
  
  // Clear existing timeout
  if (pendingValidations.has(key)) {
    clearTimeout(pendingValidations.get(key));
  }
  
  // Set new timeout
  const timeoutId = setTimeout(() => {
    console.log(`\n${colors.cyan}🔄 Change detected: ${filename}${colors.reset}`);
    console.log(`${colors.yellow}⏳ Running validation...${colors.reset}\n`);
    
    try {
      execSync(`node scripts/validate-room-after-update.js "${filename}"`, {
        cwd: projectRoot,
        stdio: 'inherit'
      });
    } catch (error) {
      console.error(`${colors.red}Validation failed for ${filename}${colors.reset}`);
    }
    
    pendingValidations.delete(key);
  }, 500); // Wait 500ms after last change
  
  pendingValidations.set(key, timeoutId);
}

console.log(`${colors.blue}═══════════════════════════════════════════════════${colors.reset}`);
console.log(`${colors.blue}       ROOM FILE WATCHER STARTED${colors.reset}`);
console.log(`${colors.blue}═══════════════════════════════════════════════════${colors.reset}`);
console.log(`${colors.green}👁  Watching:${colors.reset} ${DATA_DIR}`);
console.log(`${colors.cyan}📋 Auto-validating JSON files on changes...${colors.reset}`);
console.log(`${colors.yellow}💡 Press Ctrl+C to stop${colors.reset}\n`);

// Watch the data directory
const watcher = watch(DATA_DIR, { recursive: false }, (eventType, filename) => {
  // Only process JSON files
  if (!filename || !filename.endsWith('.json') || filename.startsWith('.')) {
    return;
  }
  
  // Validate on change or rename events
  if (eventType === 'change' || eventType === 'rename') {
    validateRoom(filename);
  }
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log(`\n\n${colors.yellow}🛑 Stopping file watcher...${colors.reset}`);
  watcher.close();
  process.exit(0);
});

process.on('SIGTERM', () => {
  watcher.close();
  process.exit(0);
});
