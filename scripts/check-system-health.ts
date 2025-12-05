#!/usr/bin/env npx tsx
/**
 * System Health Checker v1.0
 *
 * Usage:
 *   npx tsx scripts/check-system-health.ts
 *
 * Produces:
 *   public/system-health.json
 *
 * Scope (Phase 1):
 *   - Room JSON health (public/data/*.json)
 *   - Audio manifest health (public/audio/manifest.json)
 *   - Audio autopilot health (public/audio/autopilot-status.json) if present
 */

import * as fs from 'fs';
import * as path from 'path';

type HealthStatus = 'healthy' | 'warning' | 'critical';

interface SubsystemHealth {
  id: string;
  label: string;
  status: HealthStatus;
  score: number; // 0–100
  issues: string[];
  lastCheckedAt: string | null;
}

interface SystemHealthSnapshot {
  version: '1.0';
  generatedAt: string;
  subsystems: SubsystemHealth[];
}

const ROOT = process.cwd();
const PUBLIC_DIR = path.join(ROOT, 'public');
const PUBLIC_DATA_DIR = path.join(PUBLIC_DIR, 'data');
const PUBLIC_AUDIO_DIR = path.join(PUBLIC_DIR, 'audio');
const OUTPUT_PATH = path.join(PUBLIC_DIR, 'system-health.json');

function log(msg: string) {
  console.log(`[system-health] ${msg}`);
}

function ensureDirExists(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function scoreToStatus(score: number): HealthStatus {
  if (score >= 95) return 'healthy';
  if (score >= 80) return 'warning';
  return 'critical';
}

/**
 * ROOMS SUBSYSTEM
 * - Check that all JSON files in public/data are parseable
 * - Check they contain basic Mercy Blade room shape
 */
function checkRoomJsonHealth(): SubsystemHealth {
  const issues: string[] = [];
  const now = new Date().toISOString();

  if (!fs.existsSync(PUBLIC_DATA_DIR)) {
    issues.push('public/data directory not found');
    return {
      id: 'rooms',
      label: 'Room JSON',
      status: 'critical',
      score: 0,
      issues,
      lastCheckedAt: now,
    };
  }

  const files = fs
    .readdirSync(PUBLIC_DATA_DIR)
    .filter((f) => f.endsWith('.json') && !f.startsWith('_'));

  if (files.length === 0) {
    issues.push('No room JSON files found in public/data');
    return {
      id: 'rooms',
      label: 'Room JSON',
      status: 'warning',
      score: 0,
      issues,
      lastCheckedAt: now,
    };
  }

  let total = 0;
  let valid = 0;
  let parseErrors = 0;
  let schemaErrors = 0;

  for (const file of files) {
    total += 1;
    const fullPath = path.join(PUBLIC_DATA_DIR, file);

    try {
      const text = fs.readFileSync(fullPath, 'utf-8');
      const data = JSON.parse(text);

      const hasId = typeof data.id === 'string';
      const hasTier = typeof data.tier === 'string';
      const hasTitle =
        data.title &&
        typeof data.title.en === 'string' &&
        typeof data.title.vi === 'string';
      const hasContent =
        data.content &&
        typeof data.content.en === 'string' &&
        typeof data.content.vi === 'string';
      const hasEntries = Array.isArray(data.entries) && data.entries.length > 0;

      if (hasId && hasTier && hasTitle && hasContent && hasEntries) {
        valid += 1;
      } else {
        schemaErrors += 1;
        issues.push(
          `Schema issue in ${file} (id:${hasId}, tier:${hasTier}, title:${hasTitle}, content:${hasContent}, entries:${hasEntries})`
        );
      }
    } catch (err) {
      parseErrors += 1;
      const msg = err instanceof Error ? err.message : String(err);
      issues.push(`Parse error in ${file}: ${msg}`);
    }
  }

  const score =
    total > 0 ? Math.max(0, Math.min(100, (valid / total) * 100)) : 0;
  if (parseErrors > 0) {
    issues.unshift(`Parse errors in ${parseErrors} file(s)`);
  }
  if (schemaErrors > 0) {
    issues.unshift(`Schema issues in ${schemaErrors} file(s)`);
  }

  const status = scoreToStatus(score);

  return {
    id: 'rooms',
    label: 'Room JSON',
    status,
    score,
    issues: issues.slice(0, 10), // keep snapshot small
    lastCheckedAt: now,
  };
}

/**
 * AUDIO MANIFEST SUBSYSTEM
 * - Check manifest file exists and has sensible fields
 */
function checkAudioManifestHealth(): SubsystemHealth {
  const issues: string[] = [];
  const now = new Date().toISOString();

  if (!fs.existsSync(PUBLIC_AUDIO_DIR)) {
    issues.push('public/audio directory not found');
    return {
      id: 'audio-manifest',
      label: 'Audio Manifest',
      status: 'critical',
      score: 0,
      issues,
      lastCheckedAt: now,
    };
  }

  const manifestPath = path.join(PUBLIC_AUDIO_DIR, 'manifest.json');
  if (!fs.existsSync(manifestPath)) {
    issues.push('public/audio/manifest.json not found');
    return {
      id: 'audio-manifest',
      label: 'Audio Manifest',
      status: 'warning',
      score: 0,
      issues,
      lastCheckedAt: now,
    };
  }

  try {
    const text = fs.readFileSync(manifestPath, 'utf-8');
    const manifest = JSON.parse(text);

    const totalFiles = Number(manifest.totalFiles ?? manifest.files?.length ?? 0);
    const validFiles = Number(manifest.validFiles ?? totalFiles);

    if (!Array.isArray(manifest.files)) {
      issues.push('manifest.files is missing or not an array');
    }

    if (!Number.isFinite(totalFiles) || totalFiles < 0) {
      issues.push('manifest.totalFiles is invalid');
    }
    if (!Number.isFinite(validFiles) || validFiles < 0) {
      issues.push('manifest.validFiles is invalid');
    }

    if (issues.length > 0) {
      return {
        id: 'audio-manifest',
        label: 'Audio Manifest',
        status: 'warning',
        score: 50,
        issues,
        lastCheckedAt: now,
      };
    }

    const score =
      totalFiles > 0
        ? Math.max(0, Math.min(100, (validFiles / totalFiles) * 100))
        : 100;

    return {
      id: 'audio-manifest',
      label: 'Audio Manifest',
      status: scoreToStatus(score),
      score,
      issues,
      lastCheckedAt: now,
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    issues.push(`Failed to parse manifest.json: ${msg}`);
    return {
      id: 'audio-manifest',
      label: 'Audio Manifest',
      status: 'critical',
      score: 0,
      issues,
      lastCheckedAt: now,
    };
  }
}

/**
 * AUDIO AUTOPILOT SUBSYSTEM
 * - Optional: use autopilot-status.json if present
 */
function checkAudioAutopilotHealth(): SubsystemHealth {
  const issues: string[] = [];
  const now = new Date().toISOString();
  const statusPath = path.join(PUBLIC_AUDIO_DIR, 'autopilot-status.json');

  if (!fs.existsSync(statusPath)) {
    issues.push('autopilot-status.json not found (audio autopilot may not have run yet)');
    return {
      id: 'audio-autopilot',
      label: 'Audio Autopilot',
      status: 'warning',
      score: 0,
      issues,
      lastCheckedAt: now,
    };
  }

  try {
    const text = fs.readFileSync(statusPath, 'utf-8');
    const status = JSON.parse(text);

    const after = Number(status.afterIntegrity ?? 0);
    const before = Number(status.beforeIntegrity ?? 0);
    const changesApplied = Number(status.changesApplied ?? 0);
    const changesBlocked = Number(status.changesBlocked ?? 0);
    const flags: string[] = Array.isArray(status.governanceFlags)
      ? status.governanceFlags
      : [];

    if (!Number.isFinite(after)) {
      issues.push('afterIntegrity is missing or invalid');
    }
    if (!Number.isFinite(before)) {
      issues.push('beforeIntegrity is missing or invalid');
    }

    let score = after;
    if (!Number.isFinite(score) || score < 0 || score > 100) {
      score = 0;
    }

    if (flags.length > 0) {
      issues.push(`Governance flags: ${flags.join(', ')}`);
    }

    issues.push(
      `Integrity: before=${before.toFixed(1)}% → after=${after.toFixed(
        1
      )}%, applied=${changesApplied}, blocked=${changesBlocked}`
    );

    return {
      id: 'audio-autopilot',
      label: 'Audio Autopilot',
      status: scoreToStatus(score),
      score,
      issues: issues.slice(0, 10),
      lastCheckedAt: now,
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    issues.push(`Failed to parse autopilot-status.json: ${msg}`);
    return {
      id: 'audio-autopilot',
      label: 'Audio Autopilot',
      status: 'critical',
      score: 0,
      issues,
      lastCheckedAt: now,
    };
  }
}

/**
 * MAIN
 */
function run(): void {
  log('Starting system health check...');

  ensureDirExists(PUBLIC_DIR);

  const subsystems: SubsystemHealth[] = [];

  // 1) Room JSON health
  const roomsHealth = checkRoomJsonHealth();
  subsystems.push(roomsHealth);
  log(
    `Room JSON: ${roomsHealth.status.toUpperCase()} (${roomsHealth.score.toFixed(
      1
    )}%)`
  );

  // 2) Audio manifest health
  const manifestHealth = checkAudioManifestHealth();
  subsystems.push(manifestHealth);
  log(
    `Audio Manifest: ${manifestHealth.status.toUpperCase()} (${manifestHealth.score.toFixed(
      1
    )}%)`
  );

  // 3) Audio autopilot health (optional)
  const autopilotHealth = checkAudioAutopilotHealth();
  subsystems.push(autopilotHealth);
  log(
    `Audio Autopilot: ${autopilotHealth.status.toUpperCase()} (${autopilotHealth.score.toFixed(
      1
    )}%)`
  );

  const snapshot: SystemHealthSnapshot = {
    version: '1.0',
    generatedAt: new Date().toISOString(),
    subsystems,
  };

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(snapshot, null, 2));
  log(`Wrote system health snapshot to ${OUTPUT_PATH}`);
}

run();
