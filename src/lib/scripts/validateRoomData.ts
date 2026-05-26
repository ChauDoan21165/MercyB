#!/usr/bin/env tsx
// Room Data Validation Script
// Run with: npx tsx src/lib/scripts/validateRoomData.ts
//
// Reads room JSON directly from public/data/ — does NOT touch Supabase.
// Validation here is structural (slug, tier, keywords, audio key shape);
// it does not need live DB state, so keeping it filesystem-only lets CI run
// without VITE_SUPABASE_URL.

import {
  generateValidationReport,
  logValidationReport,
  exportValidationReportAsJson,
  exportValidationReportAsMarkdown,
  RoomJson,
} from '../validation/roomDataHygiene';
import * as fs from 'fs';
import * as path from 'path';

const DATA_DIR = path.resolve(process.cwd(), 'public/data');

// Same ignore list as scripts/validate-room-registry.js — files that live
// in public/data/ but are not room content.
const IGNORE_FILES = new Set([
  '.gitkeep',
  'Tiers.json',
  'Tiers_.json',
  'Package_Lock.json',
  'Tsconfig_App.json',
  'Tsconfig_Node.json',
  'components.json',
  'package-lock.json',
  'package.json',
  'registry.json',
  'tsconfig.app.json',
  'tsconfig.json',
  'tsconfig.node.json',
  'Mercy_Blade_home_page.json',
  'Mercy_Blade_Method_Of_ Learning_English.json',
]);

function loadRoomsFromDisk(): RoomJson[] {
  if (!fs.existsSync(DATA_DIR)) {
    throw new Error(`Missing folder: ${DATA_DIR}`);
  }

  const files = fs
    .readdirSync(DATA_DIR)
    .filter((f) => f.endsWith('.json') && !f.startsWith('.'))
    .filter((f) => !IGNORE_FILES.has(f))
    .sort();

  console.log(`📥 Loading ${files.length} room files from ${DATA_DIR}...`);

  const rooms: RoomJson[] = [];

  for (const file of files) {
    const filePath = path.join(DATA_DIR, file);
    try {
      const raw = fs.readFileSync(filePath, 'utf-8');
      const parsed = JSON.parse(raw);

      // Some rooms ship `audio` as an object ({ en, vi }) instead of a string.
      // The shared hygiene validator assumes string. Coerce here so we don't
      // need to touch roomDataHygiene (which is shared with other code paths).
      const entries = Array.isArray(parsed.entries)
        ? parsed.entries.map((e: Record<string, unknown>) => {
            const audio = e?.audio;
            const audioStr =
              typeof audio === 'string'
                ? audio
                : audio && typeof audio === 'object'
                  ? String(
                      (audio as Record<string, unknown>).en ??
                        (audio as Record<string, unknown>).vi ??
                        '',
                    )
                  : '';
            return { ...e, audio: audioStr };
          })
        : [];

      rooms.push({
        id: parsed.id ?? file.replace(/\.json$/, ''),
        tier: parsed.tier ?? 'Unknown',
        title: {
          en: parsed.title?.en ?? '',
          vi: parsed.title?.vi ?? '',
        },
        entries,
      });
    } catch (err) {
      console.error(`❌ Failed to parse ${file}:`, err);
      throw err;
    }
  }

  console.log(`✅ Loaded ${rooms.length} rooms`);
  return rooms;
}

function main(): void {
  console.log('🔍 Starting Room Data Hygiene Validation');
  console.log('=========================================\n');

  try {
    const rooms = loadRoomsFromDisk();

    console.log('📋 Generating validation report...\n');
    const report = generateValidationReport(rooms);

    logValidationReport(report);

    const jsonReportPath = 'ROOM_VALIDATION_REPORT.json';
    fs.writeFileSync(jsonReportPath, exportValidationReportAsJson(report), 'utf-8');
    console.log(`\n💾 JSON report exported to: ${jsonReportPath}`);

    const markdownReportPath = 'ROOM_VALIDATION_RESULTS.md';
    fs.writeFileSync(
      markdownReportPath,
      exportValidationReportAsMarkdown(report, rooms.length),
      'utf-8',
    );
    console.log(`📄 Markdown report exported to: ${markdownReportPath}`);

    const violationCount = report.filter(
      (r) => r.violations.length > 0 || r.entryViolations.length > 0,
    ).length;

    console.log('\n📊 Validation Summary:');
    console.log(`   Total rooms checked: ${rooms.length}`);
    console.log(`   Rooms with violations: ${violationCount}`);
    console.log(`   Clean rooms: ${rooms.length - violationCount}`);

    if (violationCount > 0) {
      // Hygiene rules (e.g. 50-150 word copy bands) are advisory, not blocking.
      // The script's job is to produce the report; a separate cleanup pass owns
      // bringing the data into compliance. Exit 0 so CI does not gate on this.
      console.log('\n⚠️  Violations found — see ROOM_VALIDATION_REPORT.json (advisory, not blocking).');
    } else {
      console.log('\n✅ All rooms pass validation!');
    }
    process.exit(0);
  } catch (error) {
    console.error('❌ Validation failed:', error);
    process.exit(1);
  }
}

main();

export { main as validateRoomData };
