/**
 * Auto-generate room registry from all JSON files in public directory
 * Run with: node scripts/generate-room-registry.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get project root (one level up from scripts/)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get project root (one level up from scripts/)
const projectRoot = path.resolve(__dirname, '..');
const publicDir = path.join(projectRoot, 'public');
const ROOM_FILE_REGEX = /(free|vip1|vip2|vip3|vip3_ii|vip4|vip5|vip6)\.json$/i;

// Helper to convert filename to room ID (kebab-case with tier)
function filenameToRoomId(filename) {
  // Remove .json extension
  const base = filename.replace(/\.json$/i, '');
  
  // Convert to kebab-case and normalize tier suffix
  return base
    .toLowerCase()
    .replace(/[_\s]+/g, '-') // underscores and spaces to hyphens
    .replace(/-(free|vip1|vip2|vip3|vip3[-_]ii|vip4|vip5|vip6)$/i, (match) => match.toLowerCase()); // normalize tier
}

// Validate filename follows canonical rules
function validateFilename(filename) {
  // Must be lowercase
  if (filename !== filename.toLowerCase()) {
    return { valid: false, reason: 'Filename must be all lowercase' };
  }

  // Must end with .json
  if (!filename.endsWith('.json')) {
    return { valid: false, reason: 'Filename must end with .json' };
  }

  // Must end with tier suffix
  const tierMatch = filename.match(/_(free|vip\d+|kidslevel\d+)\.json$/);
  if (!tierMatch) {
    return { valid: false, reason: 'Filename must end with tier suffix (e.g., _vip9.json)' };
  }

  return { valid: true };
}

// Helper to extract display names from JSON
function extractNames(jsonPath, filename) {
  try {
    // Validate filename first
    const filenameValidation = validateFilename(filename);
    if (!filenameValidation.valid) {
      console.error(`❌ REJECTED: ${filename} - ${filenameValidation.reason}`);
      return null;
    }

    const content = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    
    // NEW STRUCTURE (VIP2 standardized): Prioritize name/name_vi fields
    let nameEn = content.name || null;
    let nameVi = content.name_vi || null;
    
    // OLD STRUCTURE: Fallback to title.en/title.vi for backwards compatibility
    if (!nameEn && content.title) {
      nameEn = content.title?.en || content.title;
    }
    if (!nameVi && content.title) {
      nameVi = content.title?.vi || content.title;
    }
    
    // Additional fallbacks
    if (!nameEn) {
      nameEn = content.nameEn || null;
    }
    if (!nameVi) {
      nameVi = content.nameVi || null;
    }
    
    // If still no name found, extract from filename
    if (!nameEn) {
      nameEn = filename
        .replace(/\.(json)$/i, '')
        .replace(/[_-](free|vip1|vip2|vip3|vip3[-_]ii|vip4|vip5|vip6|vip7|vip8|vip9|kidslevel\d+)$/i, '')
        .replace(/[_-]/g, ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
    }
    
    nameVi = nameVi || nameEn;

    // Validate JSON structure
    const roomId = filename.replace(/\.json$/, '');
    
    // Check if JSON.id matches filename
    if (content.id && content.id !== roomId) {
      console.error(`❌ REJECTED: ${filename} - JSON.id (${content.id}) does not match filename (${roomId})`);
      return null;
    }

    // Validate entries
    if (!content.entries || !Array.isArray(content.entries)) {
      console.error(`❌ REJECTED: ${filename} - Missing or invalid entries array`);
      return null;
    }

    const entryCount = content.entries.length;
    if (entryCount < 2 || entryCount > 8) {
      console.error(`❌ REJECTED: ${filename} - Invalid entry count: ${entryCount} (must be 2-8)`);
      return null;
    }
    
    return { nameEn, nameVi };
  } catch (err) {
    console.error(`❌ REJECTED: ${jsonPath} - Parse error: ${err.message}`);
    return null;
  }
}

// Scan public/data directory for JSON files (flat structure) with error recovery
function scanRoomFiles() {
  const dataDir = path.join(publicDir, 'data');
  
  if (!fs.existsSync(dataDir)) {
    console.error(`Error: Data directory not found: ${dataDir}`);
    console.log('Creating data directory...');
    fs.mkdirSync(dataDir, { recursive: true });
    return { manifest: {}, dataImports: {} };
  }
  
  const files = fs.readdirSync(dataDir);
  const roomFiles = files.filter(f => f.endsWith('.json') && !f.startsWith('.') && ROOM_FILE_REGEX.test(f));
  
  const manifest = {};
  const dataImports = {};
  
  console.log(`Found ${roomFiles.length} room files to process`);
  
  for (const filename of roomFiles) {
    try {
      const roomId = filenameToRoomId(filename);
      const jsonPath = path.join(dataDir, filename);
      const names = extractNames(jsonPath, filename);
      
      if (!names) {
        console.warn(`⚠️  Skipping ${filename}: Could not extract names`);
        continue;
      }
      
      // Extract tier from filename
      let tier = 'free';
      if (roomId.endsWith('-vip3-ii')) tier = 'vip3_ii';
      else if (roomId.endsWith('-vip9') || roomId.endsWith('_vip9')) tier = 'vip9';
      else if (roomId.endsWith('-vip8') || roomId.endsWith('_vip8')) tier = 'vip8';
      else if (roomId.endsWith('-vip7') || roomId.endsWith('_vip7')) tier = 'vip7';
      else if (roomId.endsWith('-vip6') || roomId.endsWith('_vip6')) tier = 'vip6';
      else if (roomId.endsWith('-vip5') || roomId.endsWith('_vip5')) tier = 'vip5';
      else if (roomId.endsWith('-vip4') || roomId.endsWith('_vip4')) tier = 'vip4';
      else if (roomId.endsWith('-vip3') || roomId.endsWith('_vip3')) tier = 'vip3';
      else if (roomId.endsWith('-vip2') || roomId.endsWith('_vip2')) tier = 'vip2';
      else if (roomId.endsWith('-vip1') || roomId.endsWith('_vip1')) tier = 'vip1';
      else if (roomId.match(/[-_]kidslevel[123]$/)) {
        const match = roomId.match(/[-_](kidslevel[123])$/);
        tier = match ? match[1] : 'free';
      }
      
      // Add to manifest with data/ prefix
      manifest[roomId] = `data/${filename}`;
      
      // Add to dataImports
      dataImports[roomId] = {
        id: roomId,
        nameEn: names.nameEn,
        nameVi: names.nameVi,
        tier,
        hasData: true
      };
      
      console.log(`✓ Registered: ${roomId} → data/${filename}`);
    } catch (error) {
      console.error(`✗ Error processing ${filename}:`, error.message);
      // Continue processing other files instead of failing
    }
  }
  
  return { manifest, dataImports };
}

// Generate manifest file
function generateManifest(manifest) {
  const content = `/**
 * AUTO-GENERATED: Do not edit manually
 * Generated by: scripts/generate-room-registry.js
 * Run: node scripts/generate-room-registry.js
 */
export const PUBLIC_ROOM_MANIFEST: Record<string, string> = ${JSON.stringify(manifest, null, 2)};

/**
 * Get all unique room base names (without tier suffix)
 */
export function getRoomBaseNames(): string[] {
  const baseNames = new Set<string>();
  
  for (const roomId of Object.keys(PUBLIC_ROOM_MANIFEST)) {
    const baseName = roomId.replace(/-(free|vip1|vip2|vip3|vip3[-_]ii|vip4|vip5|vip6)$/, '');
    baseNames.add(baseName);
  }
  
  return Array.from(baseNames).sort();
}

/**
 * Get all tiers available for a room base name
 */
export function getAvailableTiers(roomBaseName: string): string[] {
  const tiers: string[] = [];
  
  for (const tier of ['free', 'vip1', 'vip2', 'vip3', 'vip3_ii', 'vip4', 'vip5', 'vip6']) {
    const roomId = \`\${roomBaseName}-\${tier.replace('_', '-')}\`;
    if (PUBLIC_ROOM_MANIFEST[roomId]) {
      tiers.push(tier);
    }
  }
  
  return tiers;
}
`;
  
  const manifestPath = path.join(projectRoot, 'src', 'lib', 'roomManifest.ts');
  fs.writeFileSync(manifestPath, content, 'utf8');
  console.log(`✅ Generated roomManifest.ts with ${Object.keys(manifest).length} rooms`);
}

// Generate dataImports file
function generateDataImports(dataImports) {
  const entries = Object.entries(dataImports).map(([key, value]) => {
    return `  "${key}": ${JSON.stringify(value, null, 4).replace(/\n/g, '\n  ')}`;
  }).join(',\n');
  
  const content = `/**
 * AUTO-GENERATED: Do not edit manually
 * Generated by: scripts/generate-room-registry.js
 * Run: node scripts/generate-room-registry.js
 */
import { RoomData } from "@/lib/roomData";

export const roomDataMap: Record<string, RoomData> = {
${entries}
};
`;
  
  const importsPath = path.join(projectRoot, 'src', 'lib', 'roomDataImports.ts');
  fs.writeFileSync(importsPath, content, 'utf8');
  console.log(`✅ Generated roomDataImports.ts with ${Object.keys(dataImports).length} rooms`);
}

// Main execution
try {
  console.log('🔍 Scanning for room JSON files...');
  const { manifest, dataImports } = scanRoomFiles();
  
  console.log(`📦 Found ${Object.keys(manifest).length} room files`);
  
  generateManifest(manifest);
  generateDataImports(dataImports);
  
  console.log('✨ Room registry generation complete!');
} catch (err) {
  console.error('❌ Error generating room registry:', err);
  process.exit(1);
}
