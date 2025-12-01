#!/usr/bin/env node

/**
 * Dev Polish Check Script
 * 
 * Catches easy UX/consistency issues automatically.
 * Run in CI as a non-blocking check with warnings.
 */

const fs = require('fs');
const path = require('path');

let hasWarnings = false;

// Check for console.log outside log.ts
console.log('🔍 Checking for stray console.log calls...');
const srcFiles = getAllFiles('src', ['.ts', '.tsx']);
const logFile = path.join('src', 'lib', 'log.ts');

srcFiles.forEach(file => {
  if (file === logFile) return; // Skip log.ts itself
  
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');
  
  lines.forEach((line, index) => {
    if (line.includes('console.log') && !line.trim().startsWith('//')) {
      console.warn(`⚠️  console.log found in ${file}:${index + 1}`);
      console.warn(`   ${line.trim()}`);
      hasWarnings = true;
    }
  });
});

// Check for TODO/FIXME
console.log('\n🔍 Checking for TODO/FIXME comments...');
const allowedTodoFiles = ['README.md', 'CONTRIBUTING.md'];

srcFiles.forEach(file => {
  const basename = path.basename(file);
  if (allowedTodoFiles.includes(basename)) return;
  
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');
  
  lines.forEach((line, index) => {
    if (line.includes('TODO') || line.includes('FIXME')) {
      console.warn(`⚠️  TODO/FIXME found in ${file}:${index + 1}`);
      console.warn(`   ${line.trim()}`);
      hasWarnings = true;
    }
  });
});

// Check for test/dummy IDs in public/data
console.log('\n🔍 Checking for test/dummy room IDs...');
const dataDir = path.join('public', 'data');
if (fs.existsSync(dataDir)) {
  const dataFiles = fs.readdirSync(dataDir).filter(f => f.endsWith('.json'));
  
  dataFiles.forEach(file => {
    const filePath = path.join(dataDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    
    if (content.includes('test-room') || content.includes('dummy') || content.includes('example-room')) {
      console.warn(`⚠️  Test/dummy ID found in ${file}`);
      hasWarnings = true;
    }
  });
}

// Helper function
function getAllFiles(dir, extensions, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      if (!file.includes('node_modules') && !file.includes('.git')) {
        getAllFiles(filePath, extensions, fileList);
      }
    } else {
      if (extensions.some(ext => file.endsWith(ext))) {
        fileList.push(filePath);
      }
    }
  });
  return fileList;
}

// Report results
console.log('\n' + '='.repeat(50));
if (hasWarnings) {
  console.log('⚠️  Polish check found warnings (non-blocking)');
  console.log('='.repeat(50));
  process.exit(0); // Non-blocking - exit with success but show warnings
} else {
  console.log('✅ All polish checks passed!');
  console.log('='.repeat(50));
  process.exit(0);
}
