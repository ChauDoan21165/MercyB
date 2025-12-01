#!/usr/bin/env node
// Secret Scanner - Detect hardcoded secrets in source code

const fs = require('fs');
const path = require('path');

const SECRET_PATTERNS = [
  {
    name: 'AWS Access Key',
    pattern: /AKIA[0-9A-Z]{16}/g,
    severity: 'critical',
  },
  {
    name: 'AWS Secret Key',
    pattern: /[0-9a-zA-Z/+=]{40}/g,
    severity: 'critical',
  },
  {
    name: 'Generic API Key',
    pattern: /api[_-]?key["\s:=]+[a-zA-Z0-9]{20,}/gi,
    severity: 'high',
  },
  {
    name: 'Generic Secret',
    pattern: /secret["\s:=]+[a-zA-Z0-9]{20,}/gi,
    severity: 'high',
  },
  {
    name: 'JWT Token',
    pattern: /eyJ[a-zA-Z0-9_-]+\.eyJ[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+/g,
    severity: 'high',
  },
  {
    name: 'Private Key',
    pattern: /-----BEGIN (RSA|DSA|EC|OPENSSH) PRIVATE KEY-----/g,
    severity: 'critical',
  },
  {
    name: 'Supabase Anon Key',
    pattern: /eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9\.[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+/g,
    severity: 'medium',
  },
  {
    name: 'Supabase Service Role Key',
    pattern: /eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9\.[a-zA-Z0-9_-]{100,}\.[a-zA-Z0-9_-]+/g,
    severity: 'critical',
  },
  {
    name: 'Generic Password',
    pattern: /password["\s:=]+[a-zA-Z0-9!@#$%^&*()]{8,}/gi,
    severity: 'high',
  },
];

const EXCLUDED_DIRS = [
  'node_modules',
  '.git',
  'dist',
  'build',
  '.next',
  'coverage',
  '.vscode',
];

const EXCLUDED_FILES = [
  'package-lock.json',
  'yarn.lock',
  'pnpm-lock.yaml',
  '.env.example',
  'scan-secrets.js',
];

function scanDirectory(dir, results = []) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      if (!EXCLUDED_DIRS.includes(file)) {
        scanDirectory(filePath, results);
      }
    } else {
      if (!EXCLUDED_FILES.includes(file)) {
        scanFile(filePath, results);
      }
    }
  }

  return results;
}

function scanFile(filePath, results) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');

    for (const pattern of SECRET_PATTERNS) {
      lines.forEach((line, index) => {
        const matches = line.match(pattern.pattern);

        if (matches) {
          results.push({
            file: filePath,
            line: index + 1,
            pattern: pattern.name,
            severity: pattern.severity,
            match: matches[0].slice(0, 50) + '...',
          });
        }
      });
    }
  } catch (error) {
    // Skip files that can't be read
  }
}

function main() {
  console.log('🔍 Scanning for hardcoded secrets...\n');

  const rootDir = path.join(__dirname, '..');
  const results = scanDirectory(rootDir);

  if (results.length === 0) {
    console.log('✅ No secrets detected\n');
    process.exit(0);
  }

  console.log(`❌ Found ${results.length} potential secrets:\n`);

  // Group by severity
  const critical = results.filter(r => r.severity === 'critical');
  const high = results.filter(r => r.severity === 'high');
  const medium = results.filter(r => r.severity === 'medium');

  if (critical.length > 0) {
    console.log('🔴 CRITICAL:');
    critical.forEach(r => {
      console.log(`  ${r.file}:${r.line}`);
      console.log(`    ${r.pattern}: ${r.match}`);
    });
    console.log('');
  }

  if (high.length > 0) {
    console.log('🟠 HIGH:');
    high.forEach(r => {
      console.log(`  ${r.file}:${r.line}`);
      console.log(`    ${r.pattern}: ${r.match}`);
    });
    console.log('');
  }

  if (medium.length > 0) {
    console.log('🟡 MEDIUM:');
    medium.forEach(r => {
      console.log(`  ${r.file}:${r.line}`);
      console.log(`    ${r.pattern}: ${r.match}`);
    });
    console.log('');
  }

  console.log('❌ Secret scan failed\n');
  process.exit(1);
}

main();
