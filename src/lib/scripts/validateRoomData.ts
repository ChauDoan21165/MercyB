#!/usr/bin/env tsx
// Room Data Validation Script
// Run with: npx tsx src/lib/scripts/validateRoomData.ts

import { supabase } from '@/integrations/supabase/client';
import {
  generateValidationReport,
  logValidationReport,
  exportValidationReportAsJson,
  exportValidationReportAsMarkdown,
  RoomJson
} from '../validation/roomDataHygiene';
import { ROOMS_TABLE, KIDS_TABLE } from '../constants';
import * as fs from 'fs';

async function fetchAllRoomsFromDB(): Promise<RoomJson[]> {
  console.log('📥 Fetching rooms from database...');
  
  // Fetch adult/VIP rooms
  const { data: vipRooms, error: vipError } = await supabase
    .from(ROOMS_TABLE)
    .select('*');

  if (vipError) {
    console.error('Error fetching VIP rooms:', vipError);
  }

  // Fetch kids rooms
  const { data: kidsRooms, error: kidsError } = await supabase
    .from(KIDS_TABLE)
    .select('*');

  if (kidsError) {
    console.error('Error fetching Kids rooms:', kidsError);
  }

  // Transform database rows to RoomJson format
  const allRooms: RoomJson[] = [];

  // Transform VIP rooms
  vipRooms?.forEach(room => {
    if (room.entries && Array.isArray(room.entries)) {
      allRooms.push({
        id: room.id,
        tier: room.tier || 'Unknown',
        title: {
          en: room.title_en,
          vi: room.title_vi,
        },
        entries: room.entries,
      });
    }
  });

  // Transform Kids rooms (simplified structure)
  kidsRooms?.forEach(room => {
    allRooms.push({
      id: room.id,
      tier: `Kids ${room.level_id}`,
      title: {
        en: room.title_en,
        vi: room.title_vi,
      },
      entries: [], // Kids rooms don't have the same entry structure
    });
  });

  console.log(`✅ Fetched ${allRooms.length} rooms total`);
  return allRooms;
}

async function main() {
  console.log('🔍 Starting Room Data Hygiene Validation');
  console.log('=========================================\n');

  try {
    // Fetch rooms from database
    const rooms = await fetchAllRoomsFromDB();

    // Generate validation report
    console.log('📋 Generating validation report...\n');
    const report = generateValidationReport(rooms);

    // Log report to console
    logValidationReport(report);

    // Export report as JSON file
    const jsonReport = exportValidationReportAsJson(report);
    const jsonReportPath = 'ROOM_VALIDATION_REPORT.json';
    
    fs.writeFileSync(jsonReportPath, jsonReport, 'utf-8');
    console.log(`\n💾 JSON report exported to: ${jsonReportPath}`);

    // Export report as Markdown file
    const markdownReport = exportValidationReportAsMarkdown(report, rooms.length);
    const markdownReportPath = 'ROOM_VALIDATION_RESULTS.md';
    
    fs.writeFileSync(markdownReportPath, markdownReport, 'utf-8');
    console.log(`📄 Markdown report exported to: ${markdownReportPath}`);

    // Summary
    const violationCount = report.filter(r => r.violations.length > 0 || r.entryViolations.length > 0).length;
    
    console.log('\n📊 Validation Summary:');
    console.log(`   Total rooms checked: ${rooms.length}`);
    console.log(`   Rooms with violations: ${violationCount}`);
    console.log(`   Clean rooms: ${rooms.length - violationCount}`);

    if (violationCount > 0) {
      console.log('\n⚠️  Violations found! Review the report and fix issues before deploying.');
      process.exit(1);
    } else {
      console.log('\n✅ All rooms pass validation!');
      process.exit(0);
    }
  } catch (error) {
    console.error('❌ Validation failed:', error);
    process.exit(1);
  }
}

// Run if executed directly
if (require.main === module) {
  main();
}

export { main as validateRoomData };
