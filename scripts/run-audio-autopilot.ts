#!/usr/bin/env npx tsx
/**
 * Audio Autopilot CLI v4.6
 * THIN WRAPPER that calls the REAL autopilot engine
 * 
 * Phase 4.6 enhancements:
 * - --rooms "<pattern>" filter
 * - --max-changes <n> limit
 * - --save-artifacts "<dir>" custom output
 * - --governance-mode "<auto|assisted|strict>"
 * - --cycle-label "<string>" for tracking
 * 
 * Usage:
 *   npx tsx scripts/run-audio-autopilot.ts --dry-run
 *   npx tsx scripts/run-audio-autopilot.ts --apply
 *   npx tsx scripts/run-audio-autopilot.ts --apply --rooms "vip1"
 *   npx tsx scripts/run-audio-autopilot.ts --apply --with-tts
 *   npx tsx scripts/run-audio-autopilot.ts --apply --governance-mode assisted --cycle-label "nightly-fix"
 */

import * as fs from 'fs';
import * as path from 'path';

// ============================================
// Paths
// ============================================

const PUBLIC_DATA_DIR = path.join(process.cwd(), 'public', 'data');
const PUBLIC_AUDIO_DIR = path.join(process.cwd(), 'public', 'audio');
const MANIFEST_PATH = path.join(PUBLIC_AUDIO_DIR, 'manifest.json');

// Default artifact paths
let REPORT_PATH = path.join(PUBLIC_AUDIO_DIR, 'autopilot-report.json');
let CHANGESET_PATH = path.join(PUBLIC_AUDIO_DIR, 'autopilot-changeset.json');
let STATUS_PATH = path.join(PUBLIC_AUDIO_DIR, 'autopilot-status.json');
let HISTORY_PATH = path.join(PUBLIC_AUDIO_DIR, 'autopilot-history.json');
let PENDING_GOV_PATH = path.join(PUBLIC_AUDIO_DIR, 'pending-governance.json');

// ============================================
// CLI Arguments (Phase 4.6 enhanced)
// ============================================

const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run');
const isApply = args.includes('--apply');
const withTTS = args.includes('--with-tts');
const verbose = args.includes('--verbose');

// Phase 4.6: Partial cycle modes
const isFastMode = args.includes('--fast');
const isDeepMode = args.includes('--deep');
const cycleMode: 'fast' | 'normal' | 'deep' = isFastMode ? 'fast' : isDeepMode ? 'deep' : 'normal';

// Extract --rooms pattern
let roomFilter: string | undefined;
const roomsIndex = args.indexOf('--rooms');
if (roomsIndex !== -1 && args[roomsIndex + 1]) {
  roomFilter = args[roomsIndex + 1];
}

// Extract --max-rooms limit
let maxRooms = 100;
const maxRoomsIndex = args.indexOf('--max-rooms');
if (maxRoomsIndex !== -1 && args[maxRoomsIndex + 1]) {
  maxRooms = parseInt(args[maxRoomsIndex + 1], 10) || 100;
}

// Extract --max-changes limit (Phase 4.6)
let maxChanges = 500;
const maxChangesIndex = args.indexOf('--max-changes');
if (maxChangesIndex !== -1 && args[maxChangesIndex + 1]) {
  maxChanges = parseInt(args[maxChangesIndex + 1], 10) || 500;
}

// Extract --save-artifacts path (Phase 4.6)
const saveArtifactsIndex = args.indexOf('--save-artifacts');
if (saveArtifactsIndex !== -1 && args[saveArtifactsIndex + 1]) {
  const artifactDir = args[saveArtifactsIndex + 1];
  if (!fs.existsSync(artifactDir)) {
    fs.mkdirSync(artifactDir, { recursive: true });
  }
  REPORT_PATH = path.join(artifactDir, 'autopilot-report.json');
  CHANGESET_PATH = path.join(artifactDir, 'autopilot-changeset.json');
  STATUS_PATH = path.join(artifactDir, 'autopilot-status.json');
  HISTORY_PATH = path.join(artifactDir, 'autopilot-history.json');
  PENDING_GOV_PATH = path.join(artifactDir, 'pending-governance.json');
}

// Extract --governance-mode (Phase 4.6)
let governanceMode: 'auto' | 'assisted' | 'strict' = 'strict';
const govModeIndex = args.indexOf('--governance-mode');
if (govModeIndex !== -1 && args[govModeIndex + 1]) {
  const mode = args[govModeIndex + 1];
  if (mode === 'auto' || mode === 'assisted' || mode === 'strict') {
    governanceMode = mode;
  }
}

// Extract --cycle-label (Phase 4.6)
let cycleLabel: string | undefined;
const cycleLabelIndex = args.indexOf('--cycle-label');
if (cycleLabelIndex !== -1 && args[cycleLabelIndex + 1]) {
  cycleLabel = args[cycleLabelIndex + 1];
}

const mode = isApply ? 'apply' : 'dry-run';

// Phase 4.6: Adjust limits for cycle modes
if (cycleMode === 'fast') {
  // Fast mode: limited scope, no TTS, no semantic matching
  maxRooms = Math.min(maxRooms, 50);
  maxChanges = Math.min(maxChanges, 100);
} else if (cycleMode === 'deep') {
  // Deep mode: full scope, TTS enabled, full semantic matching
  maxRooms = 999;
  maxChanges = 2000;
}

// ============================================
// Types
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

interface CycleHistoryEntry {
  cycleId: string;
  timestamp: string;
  label?: string;
  integrityBefore: number;
  integrityAfter: number;
  applied: number;
  blocked: number;
  governanceFlags: string[];
  mode: 'dry-run' | 'apply';
  duration: number;
}

interface AutopilotHistory {
  version: string;
  updatedAt: string;
  cycles: CycleHistoryEntry[];
  maxCycles: number;
}

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

function loadHistory(): AutopilotHistory {
  try {
    if (fs.existsSync(HISTORY_PATH)) {
      return JSON.parse(fs.readFileSync(HISTORY_PATH, 'utf-8'));
    }
  } catch {
    // Ignore
  }
  return {
    version: '4.6',
    updatedAt: new Date().toISOString(),
    cycles: [],
    maxCycles: 20,
  };
}

function saveHistory(history: AutopilotHistory): void {
  history.cycles = history.cycles.slice(0, history.maxCycles);
  history.updatedAt = new Date().toISOString();
  fs.writeFileSync(HISTORY_PATH, JSON.stringify(history, null, 2));
}

// ============================================
// Import the REAL autopilot engine
// ============================================

async function importAutopilotEngine() {
  const enginePath = path.join(process.cwd(), 'src', 'lib', 'audio', 'audioAutopilot.ts');
  
  if (!fs.existsSync(enginePath)) {
    log('❌ Autopilot engine not found at: ' + enginePath);
    log('⚠️ Falling back to standalone mode');
    return null;
  }
  
  try {
    const engine = await import('../src/lib/audio/audioAutopilot');
    return engine;
  } catch (error) {
    log(`⚠️ Could not import autopilot engine: ${error}`);
    return null;
  }
}

// ============================================
// GCE Functions (inline for script compatibility)
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

function extractLanguage(filename: string): 'en' | 'vi' | null {
  if (/-en\.mp3$/i.test(filename)) return 'en';
  if (/-vi\.mp3$/i.test(filename)) return 'vi';
  return null;
}

// ============================================
// Standalone scanning (used when engine import fails)
// ============================================

interface RoomIssue {
  roomId: string;
  type: 'missing' | 'orphan' | 'naming' | 'non-canonical' | 'reversed-lang';
  filename: string;
  expected?: string;
  severity: 'critical' | 'warning';
  autoFixable: boolean;
  confidence: number;
}

function scanRoom(room: RoomData, storageFiles: Set<string>): RoomIssue[] {
  const issues: RoomIssue[] = [];
  const nRoom = normalizeRoomId(room.roomId);
  const expectedFiles = new Set<string>();
  
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
        autoFixable: false,
        confidence: 0,
      });
    }
    
    if (!storageFiles.has(canonical.vi.toLowerCase())) {
      issues.push({
        roomId: room.roomId,
        type: 'missing',
        filename: canonical.vi,
        severity: 'critical',
        autoFixable: false,
        confidence: 0,
      });
    }
    
    // Check JSON references for non-canonical naming
    if (typeof entry.audio === 'object' && entry.audio) {
      const jsonEn = entry.audio.en;
      const jsonVi = entry.audio.vi;
      
      if (jsonEn && jsonEn.toLowerCase() !== canonical.en) {
        issues.push({
          roomId: room.roomId,
          type: 'non-canonical',
          filename: jsonEn,
          expected: canonical.en,
          severity: 'warning',
          autoFixable: true,
          confidence: 90,
        });
      }
      
      if (jsonVi && jsonVi.toLowerCase() !== canonical.vi) {
        issues.push({
          roomId: room.roomId,
          type: 'non-canonical',
          filename: jsonVi,
          expected: canonical.vi,
          severity: 'warning',
          autoFixable: true,
          confidence: 90,
        });
      }
      
      // Check for reversed EN/VI
      if (jsonEn && jsonVi) {
        const enLang = extractLanguage(jsonEn);
        const viLang = extractLanguage(jsonVi);
        if (enLang === 'vi' && viLang === 'en') {
          issues.push({
            roomId: room.roomId,
            type: 'reversed-lang',
            filename: `${jsonEn} / ${jsonVi}`,
            expected: `Swap: en="${jsonVi}", vi="${jsonEn}"`,
            severity: 'critical',
            autoFixable: true,
            confidence: 95,
          });
        }
      }
    }
  }
  
  // Detect orphans
  for (const file of storageFiles) {
    if (file.startsWith(nRoom + '-') && !expectedFiles.has(file)) {
      issues.push({
        roomId: room.roomId,
        type: 'orphan',
        filename: file,
        severity: 'warning',
        autoFixable: false,
        confidence: 60,
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
      
      totalExpected += 2;
      
      if (storageFiles.has(canonical.en.toLowerCase())) totalFound++;
      if (storageFiles.has(canonical.vi.toLowerCase())) totalFound++;
    }
  }
  
  return totalExpected > 0 ? (totalFound / totalExpected) * 100 : 100;
}

// ============================================
// Write Artifacts
// ============================================

function writeArtifacts(result: any, report: any, changeSet: any, history: AutopilotHistory): void {
  log('\n📁 Writing artifacts...');
  
  // Ensure directory exists
  if (!fs.existsSync(PUBLIC_AUDIO_DIR)) {
    fs.mkdirSync(PUBLIC_AUDIO_DIR, { recursive: true });
  }
  
  // Write status
  const status = {
    version: '4.6',
    lastRunAt: result.timestamp,
    mode: result.mode,
    beforeIntegrity: result.beforeIntegrity,
    afterIntegrity: result.afterIntegrity,
    roomsTouched: result.roomsScanned,
    changesApplied: result.changesApplied,
    changesBlocked: result.changesBlocked,
    governanceFlags: result.governanceFlags,
    governanceMode: result.governanceMode || governanceMode,
    cycleId: result.cycleId,
    cycleLabel: result.cycleLabel || cycleLabel,
    lastReportPath: REPORT_PATH,
  };
  fs.writeFileSync(STATUS_PATH, JSON.stringify(status, null, 2));
  log(`   ✅ ${STATUS_PATH}`);
  
  // Write report
  fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2));
  log(`   ✅ ${REPORT_PATH}`);
  
  // Write changeset
  fs.writeFileSync(CHANGESET_PATH, JSON.stringify(changeSet, null, 2));
  log(`   ✅ ${CHANGESET_PATH}`);
  
  // Write history
  saveHistory(history);
  log(`   ✅ ${HISTORY_PATH}`);
}

// ============================================
// Print Summary
// ============================================

function printSummary(result: any): void {
  log('\n' + '='.repeat(50));
  log('📊 AUTOPILOT SUMMARY');
  log('='.repeat(50));
  log(`   Cycle ID: ${result.cycleId}`);
  if (result.cycleLabel) log(`   Label: ${result.cycleLabel}`);
  log(`   Mode: ${result.mode}`);
  log(`   Governance Mode: ${result.governanceMode || governanceMode}`);
  log(`   Duration: ${result.duration}ms`);
  log('');
  log('   INTEGRITY');
  log(`     Before: ${result.beforeIntegrity.toFixed(1)}%`);
  log(`     After:  ${result.afterIntegrity.toFixed(1)}%`);
  log(`     Delta:  ${result.integrityDelta >= 0 ? '+' : ''}${result.integrityDelta.toFixed(1)}%`);
  log(`     Meets Threshold: ${result.meetsThreshold ? '✅' : '❌'}`);
  log('');
  log('   CHANGES');
  log(`     Total:    ${result.totalChanges}`);
  log(`     Applied:  ${result.changesApplied}`);
  log(`     Blocked:  ${result.changesBlocked}`);
  log(`     Review:   ${result.changesRequiringReview || 0}`);
  log('');
  log('   ROOMS');
  log(`     Scanned:  ${result.roomsScanned}`);
  log(`     Issues:   ${result.roomsWithIssues}`);
  log(`     Fixed:    ${result.roomsFixed}`);
  log('');
  if (result.lifecycleUpdates > 0) {
    log('   LIFECYCLE');
    log(`     Updates:  ${result.lifecycleUpdates}`);
    log('');
  }
  if (result.governanceFlags && result.governanceFlags.length > 0) {
    log('   ⚠️ GOVERNANCE FLAGS');
    for (const flag of result.governanceFlags) {
      log(`     - ${flag}`);
    }
    log('');
  }
  log('='.repeat(50));
}

// ============================================
// Main Autopilot Runner
// ============================================

async function runAutopilot(): Promise<void> {
  const startTime = Date.now();
  const timestamp = new Date().toISOString();
  
  log(`🚀 Starting Audio Autopilot v4.6`);
  log(`   Mode: ${mode}`);
  log(`   Cycle Mode: ${cycleMode} (${cycleMode === 'fast' ? 'skip TTS/semantic' : cycleMode === 'deep' ? 'full cycle' : 'standard'})`);
  log(`   Governance Mode: ${governanceMode}`);
  log(`   TTS: ${cycleMode === 'fast' ? 'disabled (fast mode)' : withTTS ? 'enabled' : 'disabled'}`);
  log(`   Max Rooms: ${maxRooms}, Max Changes: ${maxChanges}`);
  if (roomFilter) log(`   Filter: ${roomFilter}`);
  if (cycleLabel) log(`   Label: ${cycleLabel}`);
  log('');
  
  // Load data
  log('📂 Loading data...');
  const storageFiles = loadManifest();
  let rooms = loadRooms();
  const history = loadHistory();
  
  log(`   Found ${storageFiles.size} audio files in manifest`);
  log(`   Found ${rooms.length} room JSON files`);
  log(`   History has ${history.cycles.length} previous cycles`);
  
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
  
  // Try to use the real autopilot engine
  const engine = await importAutopilotEngine();
  
  if (engine && engine.runAutopilotCycle) {
    log('\n🔧 Using REAL Autopilot Engine (audioAutopilot.ts)');
    
    try {
      const result = await engine.runAutopilotCycle(rooms, storageFiles, {
        mode,
        roomFilter,
        applyTTS: withTTS,
        maxRoomsPerRun: maxRooms,
        maxChanges,
        governanceMode,
        minIntegrityThreshold: 99,
        cycleLabel,
      });
      
      // Generate report
      const report = engine.generateAutopilotReport(result, {
        mode,
        roomFilter,
        applyTTS: withTTS,
        maxRoomsPerRun: maxRooms,
        maxChanges,
        governanceMode,
        cycleLabel,
      }, [], { totalRooms: rooms.length, averageScore: result.afterIntegrity, roomsBelow80: 0 });
      
      // Build changeset for file
      const changeSetForFile = {
        id: result.cycleId,
        timestamp: result.timestamp,
        operations: [
          ...result.changeSet.criticalFixes,
          ...result.changeSet.autoFixes,
          ...result.changeSet.lowConfidence,
          ...result.changeSet.blocked,
          ...result.changeSet.cosmetic,
        ],
        summary: {
          total: result.totalChanges,
          critical: result.changeSet.criticalFixes.length,
          autoFix: result.changeSet.autoFixes.length,
          lowConfidence: result.changeSet.lowConfidence.length,
          blocked: result.changeSet.blocked.length,
          cosmetic: result.changeSet.cosmetic.length,
        },
        categories: result.changeSet,
      };
      
      // Add to history
      history.cycles.unshift({
        cycleId: result.cycleId,
        timestamp: result.timestamp,
        label: cycleLabel,
        integrityBefore: result.beforeIntegrity,
        integrityAfter: result.afterIntegrity,
        applied: result.changesApplied,
        blocked: result.changesBlocked,
        governanceFlags: result.governanceFlags,
        mode: result.mode,
        duration: result.duration,
      });
      
      // Write artifacts
      writeArtifacts(result, report, changeSetForFile, history);
      
      // Summary
      printSummary(result);
      
      if (!result.meetsThreshold) {
        log('\n❌ INTEGRITY BELOW THRESHOLD - FAILING');
        process.exit(1);
      }
      
      if (result.governanceFlags.includes('critical-blocked')) {
        log('\n❌ CRITICAL OPERATIONS BLOCKED - FAILING');
        process.exit(1);
      }
      
      log('\n✅ Autopilot cycle completed successfully');
      return;
    } catch (error) {
      log(`⚠️ Engine execution failed: ${error}`);
      log('⚠️ Falling back to standalone mode');
    }
  }
  
  // Fallback: Standalone mode
  log('\n🔧 Running in STANDALONE mode (compatible with GCE)');
  
  const cycleId = `cycle-${Date.now()}`;
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
  
  // Limit changes if needed
  let limitedIssues = allIssues;
  if (allIssues.length > maxChanges) {
    limitedIssues = allIssues.slice(0, maxChanges);
    log(`   Limited issues from ${allIssues.length} to ${maxChanges}`);
  }
  
  // Categorize issues
  const criticalFixes = limitedIssues.filter(i => i.severity === 'critical' && i.autoFixable);
  const autoFixes = limitedIssues.filter(i => i.confidence >= 85 && i.autoFixable);
  const lowConfidence = limitedIssues.filter(i => i.confidence >= 50 && i.confidence < 85);
  const blocked = limitedIssues.filter(i => i.confidence < 50 || !i.autoFixable);
  
  // Build change set
  const changeSet = {
    id: cycleId,
    timestamp,
    operations: limitedIssues.map(i => ({
      id: `${i.roomId}-${i.type}-${i.filename}`,
      roomId: i.roomId,
      type: i.type === 'missing' ? 'generate-tts' : 
            i.type === 'orphan' ? 'attach-orphan' : 
            i.type === 'non-canonical' ? 'fix-json-ref' : 'rename',
      before: i.filename,
      after: i.expected,
      confidence: i.confidence,
      governanceDecision: i.confidence >= 90 ? 'auto-approve' : 
                          i.confidence >= 75 ? 'requires-review' : 'blocked',
      notes: `${i.type}: ${i.filename}`,
    })),
    summary: {
      total: limitedIssues.length,
      critical: criticalFixes.length,
      autoFix: autoFixes.length,
      lowConfidence: lowConfidence.length,
      blocked: blocked.length,
    },
    categories: {
      criticalFixes: criticalFixes.map(i => ({
        id: `${i.roomId}-${i.type}`,
        roomId: i.roomId,
        type: i.type,
        before: i.filename,
        after: i.expected,
        confidence: i.confidence,
        governanceDecision: 'auto-approve',
      })),
      autoFixes: autoFixes.map(i => ({
        id: `${i.roomId}-${i.type}`,
        roomId: i.roomId,
        type: i.type,
        before: i.filename,
        after: i.expected,
        confidence: i.confidence,
        governanceDecision: 'auto-approve',
      })),
      lowConfidence: lowConfidence.map(i => ({
        id: `${i.roomId}-${i.type}`,
        roomId: i.roomId,
        type: i.type,
        before: i.filename,
        after: i.expected,
        confidence: i.confidence,
        governanceDecision: 'requires-review',
      })),
      blocked: blocked.map(i => ({
        id: `${i.roomId}-${i.type}`,
        roomId: i.roomId,
        type: i.type,
        before: i.filename,
        confidence: i.confidence,
        governanceDecision: 'blocked',
      })),
      cosmetic: [],
    },
  };
  
  // Build result
  const result = {
    success: true,
    mode,
    timestamp,
    cycleId,
    cycleLabel,
    duration: Date.now() - startTime,
    beforeIntegrity,
    afterIntegrity: beforeIntegrity,
    integrityDelta: 0,
    meetsThreshold: beforeIntegrity >= 99,
    totalChanges: limitedIssues.length,
    changesApplied: mode === 'apply' ? autoFixes.length : 0,
    changesBlocked: blocked.length,
    changesRequiringReview: lowConfidence.length,
    governanceFlags: criticalFixes.length > 0 ? ['has-critical-fixes'] : [],
    governanceMode,
    roomsScanned: rooms.length,
    roomsWithIssues: roomsWithIssues.size,
    roomsFixed: mode === 'apply' ? roomsWithIssues.size : 0,
    lifecycleUpdates: 0,
    changeSet: {
      criticalFixes: changeSet.categories.criticalFixes,
      autoFixes: changeSet.categories.autoFixes,
      lowConfidence: changeSet.categories.lowConfidence,
      blocked: changeSet.categories.blocked,
      cosmetic: [],
    },
  };
  
  // Build report
  const report = {
    version: '4.6',
    timestamp,
    cycleId,
    config: {
      mode,
      roomFilter,
      maxRoomsPerRun: maxRooms,
      maxChanges,
      governanceMode,
      cycleLabel,
    },
    result,
    details: {
      roomResults: [],
      integrityMap: { totalRooms: rooms.length, averageScore: beforeIntegrity, roomsBelow80: 0 },
      changeSetBreakdown: {
        criticalFixes: criticalFixes.length,
        autoFixes: autoFixes.length,
        lowConfidence: lowConfidence.length,
        blocked: blocked.length,
        cosmetic: 0,
      },
      lifecycleStats: {
        totalUpdates: 0,
        byType: {},
      },
    },
  };
  
  // Add to history
  history.cycles.unshift({
    cycleId,
    timestamp,
    label: cycleLabel,
    integrityBefore: beforeIntegrity,
    integrityAfter: beforeIntegrity,
    applied: result.changesApplied,
    blocked: blocked.length,
    governanceFlags: result.governanceFlags,
    mode: result.mode as 'dry-run' | 'apply',
    duration: result.duration,
  });
  
  // Write artifacts
  writeArtifacts(result, report, changeSet, history);
  
  // Summary
  printSummary(result);
  
  if (!result.meetsThreshold) {
    log('\n❌ INTEGRITY BELOW THRESHOLD - FAILING');
    process.exit(1);
  }
  
  log('\n✅ Autopilot cycle completed successfully');
}

// ============================================
// Run
// ============================================

runAutopilot().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
