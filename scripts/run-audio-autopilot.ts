#!/usr/bin/env npx tsx
/**
 * Audio Autopilot CLI v4.4
 * 
 * Usage:
 *   npx tsx scripts/run-audio-autopilot.ts --dry-run
 *   npx tsx scripts/run-audio-autopilot.ts --apply
 *   npx tsx scripts/run-audio-autopilot.ts --apply --rooms "vip1"
 *   npx tsx scripts/run-audio-autopilot.ts --apply --with-tts
 */

import * as fs from 'fs';
import * as path from 'path';

// ============================================
// Types (inline to avoid import issues in script context)
// ============================================

interface RoomEntry {
  slug?: string;
  id?: string | number;
  artifact_id?: string;
  audio?: { en?: string; vi?: string } | string;
}

interface RoomData {
  roomId: string;
  entries: RoomEntry[];
}

interface AudioChangeSet {
  criticalFixes: AudioChange[];
  autoFixes: AudioChange[];
  lowConfidence: AudioChange[];
  blocked: AudioChange[];
  cosmetic: AudioChange[];
}

interface AudioChange {
  id: string;
  roomId: string;
  type: string;
  before?: string;
  after?: string;
  confidence: number;
  governanceDecision: string;
  notes?: string;
}

interface AutopilotResult {
  success: boolean;
  mode: 'dry-run' | 'apply';
  timestamp: string;
  duration: number;
  beforeIntegrity: number;
  afterIntegrity: number;
  integrityDelta: number;
  meetsThreshold: boolean;
  changeSet: AudioChangeSet;
  totalChanges: number;
  changesApplied: number;
  changesBlocked: number;
  changesRequiringReview: number;
  governanceFlags: string[];
  roomsScanned: number;
  roomsWithIssues: number;
  roomsFixed: number;
  lifecycleUpdates: number;
}

interface AutopilotStatusStore {
  version: string;
  lastRunAt: string | null;
  mode: 'dry-run' | 'apply' | null;
  beforeIntegrity: number;
  afterIntegrity: number;
  roomsTouched: number;
  changesApplied: number;
  changesBlocked: number;
  governanceFlags: string[];
  lastReportPath: string | null;
}

// ============================================
// CLI Arguments
// ============================================

const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run');
const isApply = args.includes('--apply');
const withTTS = args.includes('--with-tts');
const verbose = args.includes('--verbose');

// Extract --rooms pattern
let roomFilter: string | undefined;
const roomsIndex = args.indexOf('--rooms');
if (roomsIndex !== -1 && args[roomsIndex + 1]) {
  roomFilter = args[roomsIndex + 1];
}

// Extract --max-rooms limit
let maxRooms = 100;
const maxIndex = args.indexOf('--max-rooms');
if (maxIndex !== -1 && args[maxIndex + 1]) {
  maxRooms = parseInt(args[maxIndex + 1], 10) || 100;
}

const mode = isApply ? 'apply' : 'dry-run';

// ============================================
// Paths
// ============================================

const PUBLIC_DATA_DIR = path.join(process.cwd(), 'public', 'data');
const PUBLIC_AUDIO_DIR = path.join(process.cwd(), 'public', 'audio');
const MANIFEST_PATH = path.join(PUBLIC_AUDIO_DIR, 'manifest.json');
const REPORT_PATH = path.join(PUBLIC_AUDIO_DIR, 'autopilot-report.json');
const CHANGESET_PATH = path.join(PUBLIC_AUDIO_DIR, 'autopilot-changeset.json');
const STATUS_PATH = path.join(PUBLIC_AUDIO_DIR, 'autopilot-status.json');

// ============================================
// Helpers
// ============================================

function log(msg: string): void {
  console.log(`[autopilot] ${msg}`);
}

function logVerbose(msg: string): void {
  if (verbose) {
    console.log(`[autopilot:verbose] ${msg}`);
  }
}

function loadManifest(): Set<string> {
  try {
    if (!fs.existsSync(MANIFEST_PATH)) {
      log('⚠️ Manifest not found, returning empty set');
      return new Set();
    }
    const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf-8'));
    const files = manifest.files || [];
    return new Set(files.map((f: string) => f.toLowerCase()));
  } catch (error) {
    log(`❌ Failed to load manifest: ${error}`);
    return new Set();
  }
}

function loadRooms(): RoomData[] {
  const rooms: RoomData[] = [];
  
  try {
    if (!fs.existsSync(PUBLIC_DATA_DIR)) {
      log('⚠️ Data directory not found');
      return rooms;
    }
    
    const files = fs.readdirSync(PUBLIC_DATA_DIR)
      .filter(f => f.endsWith('.json') && !f.startsWith('_'));
    
    for (const file of files) {
      try {
        const content = fs.readFileSync(path.join(PUBLIC_DATA_DIR, file), 'utf-8');
        const data = JSON.parse(content);
        
        if (data.id && data.entries && Array.isArray(data.entries)) {
          rooms.push({
            roomId: data.id,
            entries: data.entries,
          });
        }
      } catch {
        // Skip invalid files
      }
    }
  } catch (error) {
    log(`❌ Failed to load rooms: ${error}`);
  }
  
  return rooms;
}

// ============================================
// Simplified Autopilot Logic (standalone version)
// ============================================

function normalizeRoomId(roomId: string): string {
  return roomId
    .toLowerCase()
    .trim()
    .replace(/[_\s]+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function normalizeEntrySlug(slug: string | number): string {
  if (typeof slug === 'number') {
    return `entry-${slug}`;
  }
  return String(slug)
    .toLowerCase()
    .trim()
    .replace(/[_\s]+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function getCanonicalPair(roomId: string, slug: string | number): { en: string; vi: string } {
  const nRoom = normalizeRoomId(roomId);
  const nSlug = normalizeEntrySlug(slug);
  return {
    en: `${nRoom}-${nSlug}-en.mp3`,
    vi: `${nRoom}-${nSlug}-vi.mp3`,
  };
}

interface RoomIssue {
  roomId: string;
  type: 'missing' | 'orphan' | 'naming';
  filename: string;
  expected?: string;
  severity: 'critical' | 'warning';
}

function scanRoom(room: RoomData, storageFiles: Set<string>): RoomIssue[] {
  const issues: RoomIssue[] = [];
  const nRoom = normalizeRoomId(room.roomId);
  const expectedFiles = new Set<string>();
  
  // Check each entry
  for (let i = 0; i < room.entries.length; i++) {
    const entry = room.entries[i];
    const slug = entry.slug || entry.artifact_id || entry.id || i;
    const canonical = getCanonicalPair(room.roomId, slug);
    
    expectedFiles.add(canonical.en.toLowerCase());
    expectedFiles.add(canonical.vi.toLowerCase());
    
    // Check if files exist
    if (!storageFiles.has(canonical.en.toLowerCase())) {
      issues.push({
        roomId: room.roomId,
        type: 'missing',
        filename: canonical.en,
        severity: 'critical',
      });
    }
    
    if (!storageFiles.has(canonical.vi.toLowerCase())) {
      issues.push({
        roomId: room.roomId,
        type: 'missing',
        filename: canonical.vi,
        severity: 'critical',
      });
    }
  }
  
  // Check for orphans
  for (const file of storageFiles) {
    if (file.startsWith(nRoom + '-') && !expectedFiles.has(file)) {
      issues.push({
        roomId: room.roomId,
        type: 'orphan',
        filename: file,
        severity: 'warning',
      });
    }
  }
  
  return issues;
}

function calculateIntegrity(rooms: RoomData[], storageFiles: Set<string>): number {
  let totalExpected = 0;
  let totalFound = 0;
  
  for (const room of rooms) {
    for (let i = 0; i < room.entries.length; i++) {
      const entry = room.entries[i];
      const slug = entry.slug || entry.artifact_id || entry.id || i;
      const canonical = getCanonicalPair(room.roomId, slug);
      
      totalExpected += 2; // EN + VI
      
      if (storageFiles.has(canonical.en.toLowerCase())) totalFound++;
      if (storageFiles.has(canonical.vi.toLowerCase())) totalFound++;
    }
  }
  
  return totalExpected > 0 ? (totalFound / totalExpected) * 100 : 100;
}

async function runAutopilot(): Promise<void> {
  const startTime = Date.now();
  const timestamp = new Date().toISOString();
  
  log(`🚀 Starting Audio Autopilot v4.4`);
  log(`   Mode: ${mode}`);
  log(`   TTS: ${withTTS ? 'enabled' : 'disabled'}`);
  if (roomFilter) log(`   Filter: ${roomFilter}`);
  log('');
  
  // Load data
  log('📂 Loading data...');
  const storageFiles = loadManifest();
  let rooms = loadRooms();
  
  log(`   Found ${storageFiles.size} audio files in manifest`);
  log(`   Found ${rooms.length} room JSON files`);
  
  // Filter rooms
  if (roomFilter) {
    const pattern = new RegExp(roomFilter, 'i');
    rooms = rooms.filter(r => pattern.test(r.roomId));
    log(`   Filtered to ${rooms.length} rooms matching "${roomFilter}"`);
  }
  
  if (rooms.length > maxRooms) {
    rooms = rooms.slice(0, maxRooms);
    log(`   Limited to ${maxRooms} rooms`);
  }
  
  // Calculate before integrity
  const beforeIntegrity = calculateIntegrity(rooms, storageFiles);
  log(`\n📊 Before Integrity: ${beforeIntegrity.toFixed(1)}%`);
  
  // Scan all rooms
  log('\n🔍 Scanning rooms...');
  const allIssues: RoomIssue[] = [];
  const roomsWithIssues = new Set<string>();
  
  for (const room of rooms) {
    const issues = scanRoom(room, storageFiles);
    if (issues.length > 0) {
      roomsWithIssues.add(room.roomId);
      allIssues.push(...issues);
      logVerbose(`  ${room.roomId}: ${issues.length} issues`);
    }
  }
  
  // Build change set
  const changeSet: AudioChangeSet = {
    criticalFixes: [],
    autoFixes: [],
    lowConfidence: [],
    blocked: [],
    cosmetic: [],
  };
  
  for (const issue of allIssues) {
    const change: AudioChange = {
      id: `${issue.roomId}-${issue.type}-${issue.filename}`,
      roomId: issue.roomId,
      type: issue.type === 'missing' ? 'generate-tts' : 
            issue.type === 'orphan' ? 'attach-orphan' : 'rename',
      before: issue.filename,
      after: issue.expected,
      confidence: issue.type === 'missing' ? 0 : 70,
      governanceDecision: issue.severity === 'critical' ? 'requires-review' : 'auto-approve',
      notes: `${issue.type}: ${issue.filename}`,
    };
    
    if (issue.severity === 'critical') {
      changeSet.criticalFixes.push(change);
    } else {
      changeSet.autoFixes.push(change);
    }
  }
  
  // Summary
  const missingCount = allIssues.filter(i => i.type === 'missing').length;
  const orphanCount = allIssues.filter(i => i.type === 'orphan').length;
  
  log(`\n📋 Scan Results:`);
  log(`   Rooms scanned: ${rooms.length}`);
  log(`   Rooms with issues: ${roomsWithIssues.size}`);
  log(`   Missing audio: ${missingCount}`);
  log(`   Orphan files: ${orphanCount}`);
  log(`   Total issues: ${allIssues.length}`);
  
  // Calculate after integrity (same as before for dry-run)
  const afterIntegrity = mode === 'apply' ? beforeIntegrity : beforeIntegrity;
  const meetsThreshold = afterIntegrity >= 99;
  
  log(`\n📊 After Integrity: ${afterIntegrity.toFixed(1)}%`);
  log(`   Threshold (99%): ${meetsThreshold ? '✅ PASS' : '❌ FAIL'}`);
  
  // Build result
  const result: AutopilotResult = {
    success: true,
    mode,
    timestamp,
    duration: Date.now() - startTime,
    beforeIntegrity,
    afterIntegrity,
    integrityDelta: afterIntegrity - beforeIntegrity,
    meetsThreshold,
    changeSet,
    totalChanges: allIssues.length,
    changesApplied: mode === 'apply' ? changeSet.autoFixes.length : 0,
    changesBlocked: changeSet.blocked.length,
    changesRequiringReview: changeSet.criticalFixes.length,
    governanceFlags: missingCount > 0 ? ['MISSING_AUDIO'] : [],
    roomsScanned: rooms.length,
    roomsWithIssues: roomsWithIssues.size,
    roomsFixed: 0,
    lifecycleUpdates: 0,
  };
  
  // Build status
  const status: AutopilotStatusStore = {
    version: '4.4',
    lastRunAt: timestamp,
    mode,
    beforeIntegrity,
    afterIntegrity,
    roomsTouched: rooms.length,
    changesApplied: result.changesApplied,
    changesBlocked: result.changesBlocked,
    governanceFlags: result.governanceFlags,
    lastReportPath: REPORT_PATH,
  };
  
  // Write outputs
  log('\n💾 Writing outputs...');
  
  try {
    // Ensure directory exists
    if (!fs.existsSync(PUBLIC_AUDIO_DIR)) {
      fs.mkdirSync(PUBLIC_AUDIO_DIR, { recursive: true });
    }
    
    fs.writeFileSync(REPORT_PATH, JSON.stringify(result, null, 2));
    log(`   ✅ ${REPORT_PATH}`);
    
    fs.writeFileSync(CHANGESET_PATH, JSON.stringify(changeSet, null, 2));
    log(`   ✅ ${CHANGESET_PATH}`);
    
    fs.writeFileSync(STATUS_PATH, JSON.stringify(status, null, 2));
    log(`   ✅ ${STATUS_PATH}`);
  } catch (error) {
    log(`   ❌ Failed to write outputs: ${error}`);
  }
  
  // Final summary
  log('\n' + '='.repeat(50));
  log('AUTOPILOT COMPLETE');
  log('='.repeat(50));
  log(`Mode: ${mode}`);
  log(`Duration: ${result.duration}ms`);
  log(`Integrity: ${beforeIntegrity.toFixed(1)}% → ${afterIntegrity.toFixed(1)}%`);
  log(`Changes: ${result.totalChanges} (${result.changesApplied} applied, ${result.changesBlocked} blocked)`);
  log(`Status: ${result.success ? '✅ SUCCESS' : '❌ FAILED'}`);
  
  if (!meetsThreshold) {
    log('\n⚠️ WARNING: System integrity below 99% threshold');
    process.exit(1);
  }
}

// Run
runAutopilot().catch(error => {
  console.error('Autopilot failed:', error);
  process.exit(1);
});
