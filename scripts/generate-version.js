/**
 * Generate version.json for auto-update detection
 * Run during build: node scripts/generate-version.js
 */

import { writeFileSync } from 'fs';
import { execSync } from 'child_process';

// Get git hash (short)
let gitHash = 'unknown';
try {
  gitHash = execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim();
} catch (e) {
  console.warn('[version] Could not get git hash:', e.message);
}

// Generate version string: YYYY-MM-DD-HH
const now = new Date();
const version = [
  now.getFullYear(),
  String(now.getMonth() + 1).padStart(2, '0'),
  String(now.getDate()).padStart(2, '0'),
  String(now.getHours()).padStart(2, '0')
].join('-');

const versionData = {
  version,
  hash: gitHash,
  buildTime: now.toISOString(),
  app: 'mercy-blade',
  semver: '0.9.23'
};

// Write to public folder so it's accessible at /version.json
writeFileSync('public/version.json', JSON.stringify(versionData, null, 2));

console.log(`[version] Generated version.json: v${version} (${gitHash})`);
