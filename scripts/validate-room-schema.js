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
const schemaPath = path.join(__dirname, 'room-schema.json');

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

// Validate all room files
function validateAllRooms() {
  console.log('🔍 Validating room JSON files...\n');

  const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
  const files = fs.readdirSync(publicDir);
  const roomFiles = files.filter(f => f.endsWith('.json') && !f.startsWith('.'));

  let totalErrors = 0;
  const results = [];

  for (const filename of roomFiles) {
    const filePath = path.join(publicDir, filename);
    
    try {
      const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      const errors = validateSchema(content, schema);

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
