// Room Data Hygiene Validation
// Following Mercy Blade Design System v1.1

import { SLUG_PATTERN, TIERS } from '@/lib/constants';

export interface RoomEntry {
  slug?: string;
  artifact_id?: string;
  id?: string;
  keywords_en: string[];
  keywords_vi: string[];
  tags: string[];
  copy: {
    en: string;
    vi: string;
  };
  audio: string;
}

export interface RoomJson {
  id: string;
  tier: string;
  title: {
    en: string;
    vi: string;
  };
  entries: RoomEntry[];
}

export interface ValidationViolation {
  field: string;
  rule: string;
  actual: any;
  expected: string;
}

export interface RoomValidationReport {
  roomId: string;
  tier: string;
  violations: ValidationViolation[];
  entryViolations: Array<{
    entryId: string;
    violations: ValidationViolation[];
  }>;
}

// Validation functions
export function validateRoomId(id: string): ValidationViolation[] {
  const violations: ValidationViolation[] = [];

  if (!SLUG_PATTERN.test(id)) {
    violations.push({
      field: 'id',
      rule: 'Must be kebab-case, lowercase, pattern /^[a-z0-9]+(-[a-z0-9]+)*$/',
      actual: id,
      expected: 'kebab-case lowercase (e.g., "my-room-name")',
    });
  }

  return violations;
}

export function validateTier(tier: string): ValidationViolation[] {
  const violations: ValidationViolation[] = [];
  const validTiers = Object.values(TIERS);

  if (!validTiers.includes(tier as any)) {
    violations.push({
      field: 'tier',
      rule: 'Must be one of the canonical tier values',
      actual: tier,
      expected: validTiers.join(', '),
    });
  }

  return violations;
}

export function validateEntry(entry: RoomEntry, entryIndex: number): ValidationViolation[] {
  const violations: ValidationViolation[] = [];
  const entryId = entry.slug || entry.artifact_id || entry.id || `entry-${entryIndex}`;

  // Validate keywords_en count (3-5)
  if (!entry.keywords_en || entry.keywords_en.length < 3 || entry.keywords_en.length > 5) {
    violations.push({
      field: 'keywords_en',
      rule: 'Must have 3-5 keywords',
      actual: entry.keywords_en?.length || 0,
      expected: '3-5 items',
    });
  }

  // Validate keywords_vi count (3-5)
  if (!entry.keywords_vi || entry.keywords_vi.length < 3 || entry.keywords_vi.length > 5) {
    violations.push({
      field: 'keywords_vi',
      rule: 'Must have 3-5 keywords',
      actual: entry.keywords_vi?.length || 0,
      expected: '3-5 items',
    });
  }

  // Validate tags count (2-4)
  if (!entry.tags || entry.tags.length < 2 || entry.tags.length > 4) {
    violations.push({
      field: 'tags',
      rule: 'Must have 2-4 tags',
      actual: entry.tags?.length || 0,
      expected: '2-4 items',
    });
  }

  // Validate copy.en word count (50-150)
  const enWordCount = entry.copy?.en ? entry.copy.en.split(/\s+/).length : 0;
  if (enWordCount < 50 || enWordCount > 150) {
    violations.push({
      field: 'copy.en',
      rule: 'Must have 50-150 words',
      actual: enWordCount,
      expected: '50-150 words',
    });
  }

  // Validate copy.vi word count (50-150)
  const viWordCount = entry.copy?.vi ? entry.copy.vi.split(/\s+/).length : 0;
  if (viWordCount < 50 || viWordCount > 150) {
    violations.push({
      field: 'copy.vi',
      rule: 'Must have 50-150 words',
      actual: viWordCount,
      expected: '50-150 words',
    });
  }

  // Validate audio is filename only (no path)
  if (entry.audio && (entry.audio.includes('/') || entry.audio.includes('\\'))) {
    violations.push({
      field: 'audio',
      rule: 'Must be filename only, no folder path',
      actual: entry.audio,
      expected: 'e.g., "meaning_of_life_vip3_01_en.mp3"',
    });
  }

  return violations;
}

export function validateRoom(room: RoomJson): RoomValidationReport {
  const report: RoomValidationReport = {
    roomId: room.id,
    tier: room.tier,
    violations: [],
    entryViolations: [],
  };

  // Validate room ID
  report.violations.push(...validateRoomId(room.id));

  // Validate tier
  report.violations.push(...validateTier(room.tier));

  // Check for empty entries
  if (!room.entries || room.entries.length === 0) {
    report.violations.push({
      field: 'entries',
      rule: 'Rooms with entries.length === 0 must be non-public or marked incomplete',
      actual: 0,
      expected: '> 0 entries or marked as incomplete',
    });
  }

  // Validate each entry
  room.entries?.forEach((entry, index) => {
    const entryViolations = validateEntry(entry, index);
    if (entryViolations.length > 0) {
      const entryId = entry.slug || entry.artifact_id || entry.id || `entry-${index}`;
      report.entryViolations.push({
        entryId,
        violations: entryViolations,
      });
    }
  });

  return report;
}

export function generateValidationReport(rooms: RoomJson[]): RoomValidationReport[] {
  return rooms.map(validateRoom).filter(report => 
    report.violations.length > 0 || report.entryViolations.length > 0
  );
}

export function logValidationReport(reports: RoomValidationReport[]): void {
  console.group('🔍 Room Data Hygiene Validation Report');
  console.log(`Total rooms checked: ${reports.length}`);
  console.log(`Rooms with violations: ${reports.filter(r => r.violations.length > 0 || r.entryViolations.length > 0).length}`);
  
  reports.forEach(report => {
    if (report.violations.length > 0 || report.entryViolations.length > 0) {
      console.group(`❌ Room: ${report.roomId} (${report.tier})`);
      
      if (report.violations.length > 0) {
        console.group('Room-level violations:');
        report.violations.forEach(v => {
          console.log(`  ${v.field}: ${v.rule}`);
          console.log(`    Actual: ${JSON.stringify(v.actual)}`);
          console.log(`    Expected: ${v.expected}`);
        });
        console.groupEnd();
      }
      
      if (report.entryViolations.length > 0) {
        console.group('Entry violations:');
        report.entryViolations.forEach(ev => {
          console.log(`  Entry: ${ev.entryId}`);
          ev.violations.forEach(v => {
            console.log(`    ${v.field}: ${v.rule} (actual: ${v.actual})`);
          });
        });
        console.groupEnd();
      }
      
      console.groupEnd();
    }
  });
  
  console.groupEnd();
}

// Export validation report as JSON
export function exportValidationReportAsJson(reports: RoomValidationReport[]): string {
  return JSON.stringify(reports, null, 2);
}
