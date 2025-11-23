#!/usr/bin/env node

/**
 * Repairs and validates Room JSON files for Free and VIP tiers
 * Fixes common JSON syntax errors and ensures proper formatting
 */

const fs = require('fs');
const path = require('path');

/**
 * Auto-detect all room JSON files by scanning the data directory
 */
function detectRoomFiles(tier = null) {
  const dataDir = path.join(__dirname, '..', 'public', 'data');
  try {
    const files = fs.readdirSync(dataDir);
    return files
      .filter(file => {
        if (!file.endsWith('.json')) return false;
        if (file.includes('kids_l')) return false; // Skip kids files
        if (file.startsWith('tsconfig')) return false;
        if (file.startsWith('package')) return false;
        if (file === 'components.json') return false;
        
        if (tier) {
          const lowerFile = file.toLowerCase();
          return lowerFile.includes(`_${tier.toLowerCase()}.json`) || 
                 lowerFile.includes(`_${tier.toLowerCase()}_`);
        }
        
        return true;
      })
      .map(file => path.join(dataDir, file));
  } catch (error) {
    console.error('Error scanning data directory:', error.message);
    return [];
  }
}

function repairJSON(filePath) {
  console.log(`\n🔧 Repairing: ${path.basename(filePath)}`);
  
  if (!fs.existsSync(filePath)) {
    console.error(`❌ File not found: ${filePath}`);
    return { success: false, error: 'File not found' };
  }

  try {
    // Read the file
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Remove BOM if present
    if (content.charCodeAt(0) === 0xFEFF) {
      content = content.slice(1);
      console.log('  ✓ Removed BOM');
    }

    // Try to parse the JSON
    let jsonData;
    try {
      jsonData = JSON.parse(content);
      console.log('  ✓ JSON is valid');
    } catch (parseError) {
      console.log(`  ⚠️  Parse error: ${parseError.message}`);
      
      // Try common fixes
      // Remove trailing commas
      content = content.replace(/,(\s*[}\]])/g, '$1');
      
      // Fix missing commas between properties
      content = content.replace(/"\s*\n\s*"/g, '",\n  "');
      
      // Fix unescaped quotes in strings
      content = content.replace(/([^\\])"([^"]*)"([^,}\]:])/g, '$1\\"$2\\"$3');
      
      // Try parsing again
      try {
        jsonData = JSON.parse(content);
        console.log('  ✓ Fixed JSON syntax errors');
      } catch (secondError) {
        console.error(`  ❌ Could not repair JSON: ${secondError.message}`);
        return { success: false, error: secondError.message };
      }
    }

    // Validate structure
    const requiredFields = ['id', 'tier', 'title', 'content', 'entries', 'meta'];
    const missingFields = requiredFields.filter(field => !jsonData[field]);
    
    if (missingFields.length > 0) {
      console.error(`  ❌ Missing required fields: ${missingFields.join(', ')}`);
      return { success: false, error: `Missing fields: ${missingFields.join(', ')}` };
    }

    // Ensure proper structure
    if (!jsonData.title.en || !jsonData.title.vi) {
      console.error('  ❌ Title must have both en and vi');
      return { success: false, error: 'Invalid title structure' };
    }

    if (!jsonData.content.en || !jsonData.content.vi) {
      console.error('  ❌ Content must have both en and vi');
      return { success: false, error: 'Invalid content structure' };
    }

    if (!Array.isArray(jsonData.entries)) {
      console.error('  ❌ Entries must be an array');
      return { success: false, error: 'Invalid entries structure' };
    }

    // Write the repaired JSON back to file with proper formatting
    const repairedContent = JSON.stringify(jsonData, null, 2);
    fs.writeFileSync(filePath, repairedContent, 'utf8');
    
    console.log(`  ✅ Repaired and saved`);
    return { success: true, data: jsonData };
    
  } catch (error) {
    console.error(`  ❌ Error: ${error.message}`);
    return { success: false, error: error.message };
  }
}

function main() {
  const tier = process.argv[2];
  const tierText = tier ? ` (${tier.toUpperCase()})` : '';
  
  console.log(`🔧 Room JSON Repair Tool${tierText}\n`);
  console.log('=' .repeat(60));

  // Auto-detect all room files
  const detectedFiles = detectRoomFiles(tier);
  
  console.log(`Found ${detectedFiles.length} files to repair\n`);

  let successCount = 0;
  let failCount = 0;
  const results = [];

  for (const file of detectedFiles) {
    const result = repairJSON(file);
    results.push({ file, ...result });
    
    if (result.success) {
      successCount++;
    } else {
      failCount++;
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('\n📊 Summary:');
  console.log(`  ✅ Successfully repaired: ${successCount}`);
  console.log(`  ❌ Failed to repair: ${failCount}`);
  
  if (failCount > 0) {
    console.log('\n❌ Failed files:');
    results.filter(r => !r.success).forEach(r => {
      console.log(`  - ${path.basename(r.file)}: ${r.error}`);
    });
    process.exit(1);
  } else {
    console.log('\n✅ All files repaired successfully!');
    process.exit(0);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { repairJSON, detectRoomFiles };
