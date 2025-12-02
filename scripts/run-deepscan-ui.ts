// scripts/run-deepscan-ui.ts
// MERCY BLADE – UI Health DeepScan (READ-ONLY)
//
// Runs RoomMaster validators on all JSON files to check
// for structural and content issues.
//
// Usage: npx tsx scripts/run-deepscan-ui.ts

import * as fs from "node:fs";
import * as path from "node:path";

const DATA_DIR = path.join(process.cwd(), "public", "data");

interface DeepScanIssue {
  roomId: string;
  severity: "error" | "warning";
  code: string;
  message: string;
}

function deepScanUI(): void {
  console.log("🔍 UI HEALTH DEEPSCAN");
  console.log("=====================\n");

  if (!fs.existsSync(DATA_DIR)) {
    console.log("⚠️ Data directory not found:", DATA_DIR);
    process.exit(0);
  }

  const issues: DeepScanIssue[] = [];
  const jsonFiles = fs.readdirSync(DATA_DIR).filter(f => f.endsWith(".json"));

  console.log(`Scanning ${jsonFiles.length} room files...\n`);

  for (const file of jsonFiles) {
    const filePath = path.join(DATA_DIR, file);
    const roomId = file.replace(".json", "");

    try {
      const content = fs.readFileSync(filePath, "utf-8");
      const room = JSON.parse(content);

      // Check 1: ID matches filename
      if (room.id && room.id !== roomId) {
        issues.push({
          roomId,
          severity: "warning",
          code: "id_mismatch",
          message: `JSON id "${room.id}" doesn't match filename "${roomId}"`
        });
      }

      // Check 2: Title present
      if (!room.title && !room.title_en) {
        issues.push({
          roomId,
          severity: "error",
          code: "missing_title",
          message: "Room has no title"
        });
      }

      // Check 3: Entries array
      if (!Array.isArray(room.entries)) {
        issues.push({
          roomId,
          severity: "error",
          code: "invalid_entries",
          message: "entries is not an array"
        });
      } else if (room.entries.length === 0) {
        issues.push({
          roomId,
          severity: "error",
          code: "empty_entries",
          message: "Room has no entries"
        });
      } else {
        // Check 4: Entry content
        let emptyContentCount = 0;
        for (const entry of room.entries) {
          const hasContent = entry.copy?.en || entry.copy?.vi || 
                            entry.content?.en || entry.content?.vi ||
                            entry.copy_en || entry.copy_vi ||
                            entry.content_en || entry.content_vi;
          if (!hasContent) {
            emptyContentCount++;
          }
        }

        if (emptyContentCount > 0) {
          issues.push({
            roomId,
            severity: "warning",
            code: "empty_content",
            message: `${emptyContentCount} entries have no content`
          });
        }

        // Check 5: Audio coverage
        let audioCount = 0;
        for (const entry of room.entries) {
          if (entry.audio || entry.audio_en || entry.audioEn) {
            audioCount++;
          }
        }

        if (audioCount === 0 && room.entries.length > 0) {
          issues.push({
            roomId,
            severity: "warning",
            code: "no_audio",
            message: "No entries have audio files"
          });
        }
      }

      // Check 6: Tier field
      if (!room.tier) {
        issues.push({
          roomId,
          severity: "warning",
          code: "missing_tier",
          message: "Room has no tier field"
        });
      }

    } catch (err: any) {
      issues.push({
        roomId,
        severity: "error",
        code: "parse_error",
        message: err.message
      });
    }
  }

  // Report
  console.log("\n📊 DEEPSCAN RESULTS");
  console.log("===================\n");

  const errors = issues.filter(i => i.severity === "error");
  const warnings = issues.filter(i => i.severity === "warning");

  console.log(`❌ Errors:   ${errors.length}`);
  console.log(`⚠️ Warnings: ${warnings.length}`);

  if (errors.length > 0) {
    console.log("\n❌ ERRORS (launch-blocking):");
    for (const issue of errors.slice(0, 20)) {
      console.log(`   ${issue.roomId}: [${issue.code}] ${issue.message}`);
    }
    if (errors.length > 20) {
      console.log(`   ... and ${errors.length - 20} more`);
    }
  }

  if (warnings.length > 0) {
    console.log("\n⚠️ WARNINGS (non-blocking):");
    for (const issue of warnings.slice(0, 10)) {
      console.log(`   ${issue.roomId}: [${issue.code}] ${issue.message}`);
    }
    if (warnings.length > 10) {
      console.log(`   ... and ${warnings.length - 10} more`);
    }
  }

  console.log("");

  if (errors.length > 0) {
    console.log(`❌ DeepScan found ${errors.length} critical issue(s).\n`);
    process.exit(1);
  }

  if (warnings.length > 0) {
    console.log(`⚠️ DeepScan passed with ${warnings.length} warning(s).\n`);
    process.exit(0); // Warnings don't block
  }

  console.log("✅ DeepScan passed with no issues.\n");
  process.exit(0);
}

deepScanUI();
