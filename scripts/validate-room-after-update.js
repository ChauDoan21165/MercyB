import { readFile, access } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

async function fileExists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

async function validateRoom(roomFile) {
  const issues = [];
  const DATA_DIR = join(projectRoot, 'public', 'data');
  const EDGE_DATA_DIR = join(projectRoot, 'supabase', 'functions', 'room-chat', 'data');
  const AUDIO_DIR = join(projectRoot, 'public', 'audio');
  
  const roomPath = join(DATA_DIR, roomFile);
  const edgePath = join(EDGE_DATA_DIR, roomFile);
  
  console.log(`\n${colors.cyan}🔍 Validating room: ${roomFile}${colors.reset}\n`);
  
  // Check if room file exists
  if (!await fileExists(roomPath)) {
    issues.push(`❌ Room file not found: ${roomPath}`);
    return issues;
  }
  
  // Parse room data
  let roomData;
  try {
    const content = await readFile(roomPath, 'utf-8');
    roomData = JSON.parse(content);
    console.log(`  ${colors.green}✓${colors.reset} JSON is valid`);
  } catch (error) {
    issues.push(`❌ Invalid JSON: ${error.message}`);
    return issues;
  }
  
  // Check edge function sync
  if (await fileExists(edgePath)) {
    try {
      const edgeContent = await readFile(edgePath, 'utf-8');
      const edgeData = JSON.parse(edgeContent);
      
      if (JSON.stringify(roomData) === JSON.stringify(edgeData)) {
        console.log(`  ${colors.green}✓${colors.reset} Edge function data is synced`);
      } else {
        issues.push(`⚠️  Edge function data differs from main file`);
      }
    } catch (error) {
      issues.push(`⚠️  Edge function data is invalid: ${error.message}`);
    }
  } else {
    issues.push(`⚠️  Edge function data not found (may need manual sync)`);
  }
  
  // Check required fields
  if (!roomData.entries) {
    issues.push(`❌ Missing 'entries' field`);
    return issues;
  }
  
  console.log(`  ${colors.green}✓${colors.reset} Has entries field`);
  
  // Validate entries and audio
  const entriesList = Array.isArray(roomData.entries) ? roomData.entries : Object.values(roomData.entries);
  console.log(`  ${colors.green}✓${colors.reset} Found ${entriesList.length} entries`);
  
  let missingAudioCount = 0;
  for (const entry of entriesList) {
    const slug = entry.slug || entry.keywordEn || 'unknown';
    
    // Check audio field
    if (entry.audio) {
      const audioPath = typeof entry.audio === 'object' ? entry.audio.en : entry.audio;
      if (audioPath) {
        const cleanPath = audioPath.replace(/^\//, '');
        const fullPath = join(AUDIO_DIR, cleanPath);
        
        if (!await fileExists(fullPath)) {
          issues.push(`⚠️  Missing audio for entry "${slug}": ${audioPath}`);
          missingAudioCount++;
        }
      }
    }
  }
  
  if (missingAudioCount === 0) {
    console.log(`  ${colors.green}✓${colors.reset} All audio files exist`);
  } else {
    console.log(`  ${colors.yellow}⚠${colors.reset}  ${missingAudioCount} audio file(s) missing`);
  }
  
  // Check manifest registration
  try {
    const manifestPath = join(projectRoot, 'src', 'lib', 'roomManifest.ts');
    const manifestContent = await readFile(manifestPath, 'utf-8');
    
    const roomId = roomFile
      .replace('.json', '')
      .replace(/_/g, '-')
      .toLowerCase();
    
    if (manifestContent.includes(roomId)) {
      console.log(`  ${colors.green}✓${colors.reset} Room is registered in manifest as "${roomId}"`);
    } else {
      issues.push(`❌ Room not found in manifest (expected ID: "${roomId}")`);
      issues.push(`   Run: npm run registry:generate`);
    }
  } catch (error) {
    issues.push(`⚠️  Could not verify manifest: ${error.message}`);
  }
  
  return issues;
}

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log(`${colors.red}Usage: node scripts/validate-room-after-update.js <room-file.json>${colors.reset}`);
    console.log(`${colors.yellow}Example: node scripts/validate-room-after-update.js Mens_Mental_Health_free.json${colors.reset}`);
    process.exit(1);
  }
  
  const roomFile = args[0];
  
  console.log(`${colors.blue}═══════════════════════════════════════════════════${colors.reset}`);
  console.log(`${colors.blue}       ROOM UPDATE VALIDATION${colors.reset}`);
  console.log(`${colors.blue}═══════════════════════════════════════════════════${colors.reset}`);
  
  const issues = await validateRoom(roomFile);
  
  console.log(`\n${colors.blue}═══════════════════════════════════════════════════${colors.reset}`);
  console.log(`${colors.blue}                    RESULTS${colors.reset}`);
  console.log(`${colors.blue}═══════════════════════════════════════════════════${colors.reset}\n`);
  
  if (issues.length === 0) {
    console.log(`${colors.green}✅ Room is fully validated and ready!${colors.reset}\n`);
    process.exit(0);
  } else {
    console.log(`${colors.yellow}Found ${issues.length} issue(s):${colors.reset}\n`);
    issues.forEach(issue => console.log(`  ${issue}`));
    
    // Check if regeneration is needed
    const needsRegeneration = issues.some(i => i.includes('manifest') || i.includes('Edge function'));
    
    if (needsRegeneration) {
      console.log(`\n${colors.cyan}🔄 Auto-fixing: Regenerating registry...${colors.reset}`);
      try {
        execSync('node scripts/generate-room-registry.js', { 
          cwd: projectRoot,
          stdio: 'inherit'
        });
        console.log(`${colors.green}✓ Registry regenerated!${colors.reset}`);
        console.log(`\n${colors.cyan}Re-validating...${colors.reset}`);
        
        const newIssues = await validateRoom(roomFile);
        if (newIssues.length === 0) {
          console.log(`\n${colors.green}✅ All issues resolved!${colors.reset}\n`);
          process.exit(0);
        } else {
          console.log(`\n${colors.yellow}Remaining issues:${colors.reset}`);
          newIssues.forEach(issue => console.log(`  ${issue}`));
        }
      } catch (error) {
        console.error(`${colors.red}Failed to regenerate: ${error.message}${colors.reset}`);
      }
    }
    
    console.log();
    process.exit(1);
  }
}

main().catch(error => {
  console.error(`${colors.red}Fatal error:${colors.reset}`, error);
  process.exit(1);
});
