/**
 * Audio Autopilot CLI Helpers
 * Phase 4.7: Pure functions for CLI argument parsing
 * 
 * These helpers are separated for testability - they can be imported
 * by both the CLI script and Vitest tests.
 */

export type CycleMode = 'fast' | 'normal' | 'deep';
export type RunMode = 'dry-run' | 'apply';
export type GovernanceMode = 'auto' | 'assisted' | 'strict';

export interface ParsedCliOptions {
  mode: RunMode;
  cycleMode: CycleMode;
  governanceMode: GovernanceMode;
  withTTS: boolean;
  verbose: boolean;
  roomFilter?: string;
  maxRooms: number;
  maxChanges: number;
  cycleLabel?: string;
  saveArtifactsDir?: string;
}

/**
 * Parse autopilot CLI arguments into structured options
 * This is a pure function for easy testing
 */
export function parseAutopilotCliOptions(argv: string[]): ParsedCliOptions {
  const isDryRun = argv.includes('--dry-run');
  const isApply = argv.includes('--apply');
  const isFast = argv.includes('--fast');
  const isDeep = argv.includes('--deep');
  const withTTS = argv.includes('--with-tts');
  const verbose = argv.includes('--verbose');

  // Mode: apply wins if both specified, otherwise dry-run is default
  const mode: RunMode = isApply ? 'apply' : 'dry-run';

  // Cycle mode: deep > fast > normal (deep wins if both specified)
  let cycleMode: CycleMode = 'normal';
  if (isFast) cycleMode = 'fast';
  if (isDeep) cycleMode = 'deep';

  // Extract --rooms pattern
  let roomFilter: string | undefined;
  const roomsIndex = argv.indexOf('--rooms');
  if (roomsIndex !== -1 && argv[roomsIndex + 1]) {
    roomFilter = argv[roomsIndex + 1];
  }

  // Extract --max-rooms limit
  let maxRooms = 100;
  const maxRoomsIndex = argv.indexOf('--max-rooms');
  if (maxRoomsIndex !== -1 && argv[maxRoomsIndex + 1]) {
    maxRooms = parseInt(argv[maxRoomsIndex + 1], 10) || 100;
  }

  // Extract --max-changes limit
  let maxChanges = 500;
  const maxChangesIndex = argv.indexOf('--max-changes');
  if (maxChangesIndex !== -1 && argv[maxChangesIndex + 1]) {
    maxChanges = parseInt(argv[maxChangesIndex + 1], 10) || 500;
  }

  // Extract --governance-mode
  let governanceMode: GovernanceMode = 'strict';
  const govModeIndex = argv.indexOf('--governance-mode');
  if (govModeIndex !== -1 && argv[govModeIndex + 1]) {
    const gm = argv[govModeIndex + 1];
    if (gm === 'auto' || gm === 'assisted' || gm === 'strict') {
      governanceMode = gm;
    }
  }

  // Extract --cycle-label
  let cycleLabel: string | undefined;
  const cycleLabelIndex = argv.indexOf('--cycle-label');
  if (cycleLabelIndex !== -1 && argv[cycleLabelIndex + 1]) {
    cycleLabel = argv[cycleLabelIndex + 1];
  }

  // Extract --save-artifacts path
  let saveArtifactsDir: string | undefined;
  const saveArtifactsIndex = argv.indexOf('--save-artifacts');
  if (saveArtifactsIndex !== -1 && argv[saveArtifactsIndex + 1]) {
    saveArtifactsDir = argv[saveArtifactsIndex + 1];
  }

  // Adjust limits based on cycle mode
  if (cycleMode === 'fast') {
    maxRooms = Math.min(maxRooms, 50);
    maxChanges = Math.min(maxChanges, 100);
  } else if (cycleMode === 'deep') {
    maxRooms = 999;
    maxChanges = 2000;
  }

  return {
    mode,
    cycleMode,
    governanceMode,
    withTTS,
    verbose,
    roomFilter,
    maxRooms,
    maxChanges,
    cycleLabel,
    saveArtifactsDir,
  };
}

/**
 * Format integrity value for CLI log output
 * Must match the format expected by CI workflow fallback parsing
 */
export function formatIntegrityLine(label: 'Before' | 'After', value: number): string {
  return `${label}: ${value.toFixed(1)}%`;
}

/**
 * Format changes count for CLI log output
 */
export function formatChangesLine(label: 'Applied' | 'Blocked', count: number): string {
  return `${label}: ${count}`;
}
