/**
 * Validate room JSON files against schema
 * Run with: node scripts/validate-room-schema.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.resolve(__dirname, '..');
const publicDir = path.join(projectRoot, 'public', 'data');
const audioDir = path.join(projectRoot, 'public', 'audio');
const schemaPath = path.join(__dirname, 'room-schema.json');
const ROOM_FILE_REGEX = /(free|vip1|vip2|vip3|vip4)\.json$/i;

// Simple JSON schema validator
function validateSchema(data, schema) {
  const errors = [];

  // Check required fields
  if (schema.required) {
    for (const field of schema.required) {
      if (!(field in data)) {
        errors.push(`Missing required field: ${field}`);
      }
    }
  }

  // Check properties
  if (schema.properties) {
    for (const [key, propSchema] of Object.entries(schema.properties)) {
      if (key in data) {
        const value = data[key];
        
        // Type check
        if (propSchema.type === 'string' && typeof value !== 'string') {
          errors.push(`Field '${key}' must be a string`);
        } else if (propSchema.type === 'integer' && !Number.isInteger(value)) {
          errors.push(`Field '${key}' must be an integer`);
        } else if (propSchema.type === 'array' && !Array.isArray(value)) {
          errors.push(`Field '${key}' must be an array`);
        } else if (propSchema.type === 'object' && typeof value !== 'object') {
          errors.push(`Field '${key}' must be an object`);
        }

        // Pattern check
        if (propSchema.pattern && typeof value === 'string') {
          const regex = new RegExp(propSchema.pattern);
          if (!regex.test(value)) {
            errors.push(`Field '${key}' does not match pattern: ${propSchema.pattern}`);
          }
        }

        // Min length check
        if (propSchema.minLength && typeof value === 'string' && value.length < propSchema.minLength) {
          errors.push(`Field '${key}' must have minimum length of ${propSchema.minLength}`);
        }

        // Nested object validation
        if (propSchema.type === 'object' && propSchema.properties) {
          const nestedErrors = validateSchema(value, propSchema);
          errors.push(...nestedErrors.map(e => `${key}.${e}`));
        }

        // Array items validation
        if (propSchema.type === 'array' && propSchema.items && Array.isArray(value)) {
          if (propSchema.minItems && value.length < propSchema.minItems) {
            errors.push(`Field '${key}' must have at least ${propSchema.minItems} items`);
          }
          
          value.forEach((item, index) => {
            if (propSchema.items.type === 'object') {
              const itemErrors = validateSchema(item, propSchema.items);
              errors.push(...itemErrors.map(e => `${key}[${index}].${e}`));
            }
          });
        }
      }
    }
  }

  return errors;
}

// Get all audio files from public/audio directory
function getAllAudioFiles() {
  const audioFiles = new Set();
  
  function scanDir(dir) {
    if (!fs.existsSync(dir)) return;
    
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        scanDir(fullPath);
      } else if (entry.name.endsWith('.mp3')) {
        // Store relative path from public/audio
        const relativePath = path.relative(audioDir, fullPath);
        audioFiles.add(relativePath);
        // Also store just the filename for backward compatibility
        audioFiles.add(entry.name);
      }
    }
  }
  
  scanDir(audioDir);
  return audioFiles;
}

// Extract audio references from JSON data
function extractAudioReferences(data, audioRefs = []) {
  if (typeof data === 'string' && data.endsWith('.mp3')) {
    audioRefs.push(data);
  } else if (Array.isArray(data)) {
    data.forEach(item => extractAudioReferences(item, audioRefs));
  } else if (typeof data === 'object' && data !== null) {
    for (const [key, value] of Object.entries(data)) {
      // Check for audio fields
      if (key === 'audio' || key === 'audio_en' || key === 'audio_vi') {
        if (typeof value === 'string' && value.endsWith('.mp3')) {
          audioRefs.push(value);
        } else if (typeof value === 'object') {
          // Handle { en: "file_en.mp3", vi: "file_vi.mp3" }
          Object.values(value).forEach(v => {
            if (typeof v === 'string' && v.endsWith('.mp3')) {
              audioRefs.push(v);
            }
          });
        }
      } else {
        extractAudioReferences(value, audioRefs);
      }
    }
  }
  return audioRefs;
}

// Validate audio file references (warnings only if SKIP_AUDIO_CHECK is not "false")
function validateAudioReferences(content, filename, availableAudioFiles) {
  const skipAudioCheck = process.env.SKIP_AUDIO_CHECK !== 'false';
  const issues = [];
  const audioRefs = extractAudioReferences(content);
  
  for (const audioRef of audioRefs) {
    // Clean the path - remove leading slashes and audio/en/ or audio/vi/ prefixes
    let cleanPath = audioRef.replace(/^\//, '').replace(/^audio\/(en|vi)\//, '');
    
    if (!availableAudioFiles.has(cleanPath) && !availableAudioFiles.has(audioRef)) {
      issues.push(`Missing audio file: ${audioRef}`);
    }
  }
  
  // Return as warnings if skipping audio checks, otherwise errors
  return skipAudioCheck ? [] : issues;
}

// Validate all room files
function validateAllRooms() {
  console.log('🔍 Validating room JSON files...\n');

  const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
  const files = fs.readdirSync(publicDir);
  const roomFiles = files.filter(f => f.endsWith('.json') && !f.startsWith('.') && ROOM_FILE_REGEX.test(f));
  
  // Get all available audio files
  const skipAudioCheck = process.env.SKIP_AUDIO_CHECK !== 'false';
  console.log('📁 Scanning audio files...');
  const availableAudioFiles = getAllAudioFiles();
  console.log(`   Found ${availableAudioFiles.size} audio files`);
  if (skipAudioCheck) {
    console.log('   ℹ️  Audio validation: warnings only (SKIP_AUDIO_CHECK enabled)\n');
  } else {
    console.log('   ⚠️  Audio validation: strict mode (SKIP_AUDIO_CHECK=false)\n');
  }

  let totalErrors = 0;
  const results = [];

  for (const filename of roomFiles) {
    const filePath = path.join(publicDir, filename);
    
    try {
      const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      const schemaErrors = validateSchema(content, schema);
      const audioErrors = validateAudioReferences(content, filename, availableAudioFiles);
      const errors = [...schemaErrors, ...audioErrors];

      if (errors.length > 0) {
        totalErrors += errors.length;
        results.push({
          file: filename,
          valid: false,
          errors
        });
        console.log(`❌ ${filename}`);
        errors.forEach(err => console.log(`   - ${err}`));
        console.log('');
      } else {
        results.push({
          file: filename,
          valid: true
        });
        console.log(`✅ ${filename}`);
      }
    } catch (err) {
      totalErrors++;
      results.push({
        file: filename,
        valid: false,
        errors: [`Failed to parse JSON: ${err.message}`]
      });
      console.log(`❌ ${filename}`);
      console.log(`   - Failed to parse: ${err.message}\n`);
    }
  }

  console.log(`\n📊 Validation Summary:`);
  console.log(`   Total files: ${roomFiles.length}`);
  console.log(`   Valid: ${results.filter(r => r.valid).length}`);
  console.log(`   Invalid: ${results.filter(r => !r.valid).length}`);
  console.log(`   Total errors: ${totalErrors}`);

  if (totalErrors > 0) {
    console.log('\n❌ Validation failed!');
    process.exit(1);
  } else {
    console.log('\n✅ All room files are valid!');
  }
}

// Run validation
try {
  validateAllRooms();
} catch (err) {
  console.error('❌ Validation error:', err);
  process.exit(1);
}
