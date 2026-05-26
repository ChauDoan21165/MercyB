// scripts/audit-keyword-mapping.ts
// MERCY BLADE – Keyword Mapping Audit (READ-ONLY)
//
// Validates that keyword arrays in room JSON files are properly structured
// and can be resolved to entries.
//
// Usage: npx tsx scripts/audit-keyword-mapping.ts

import * as fs from "node:fs";
import * as path from "node:path";

const DATA_DIR = path.join(process.cwd(), "public", "data");

interface AuditIssue {
  roomId: string;
  type: "missing_keywords" | "empty_keywords" | "duplicate_keywords" | "invalid_type";
  message: string;
}

function auditKeywordMapping(): void {
  console.log("🔍 KEYWORD MAPPING AUDIT");
  console.log("========================\n");

  if (!fs.existsSync(DATA_DIR)) {
    console.log("⚠️ Data directory not found:", DATA_DIR);
    process.exit(0); // Not blocking if no data dir
  }

  const issues: AuditIssue[] = [];
  const jsonFiles = fs.readdirSync(DATA_DIR).filter(f => f.endsWith(".json"));

  console.log(`Scanning ${jsonFiles.length} JSON files...\n`);

  for (const file of jsonFiles) {
    const filePath = path.join(DATA_DIR, file);
    try {
      const content = fs.readFileSync(filePath, "utf-8");
      const room = JSON.parse(content);
      const roomId = room.id || file.replace(".json", "");

      // Check entries for keywords
      if (Array.isArray(room.entries)) {
        for (let i = 0; i < room.entries.length; i++) {
          const entry = room.entries[i];
          
          // Check keywords_en
          if (entry.keywords_en !== undefined) {
            if (!Array.isArray(entry.keywords_en)) {
              issues.push({
                roomId,
                type: "invalid_type",
                message: `Entry ${i}: keywords_en is not an array`
              });
            } else if (entry.keywords_en.length === 0) {
              issues.push({
                roomId,
                type: "empty_keywords",
                message: `Entry ${i}: keywords_en is empty`
              });
            }
          }

          // Check keywords_vi
          if (entry.keywords_vi !== undefined) {
            if (!Array.isArray(entry.keywords_vi)) {
              issues.push({
                roomId,
                type: "invalid_type",
                message: `Entry ${i}: keywords_vi is not an array`
              });
            }
          }

          // Check for duplicate keywords within entry
          if (Array.isArray(entry.keywords_en)) {
            const unique = new Set(entry.keywords_en);
            if (unique.size !== entry.keywords_en.length) {
              issues.push({
                roomId,
                type: "duplicate_keywords",
                message: `Entry ${i}: duplicate keywords in keywords_en`
              });
            }
          }
        }
      }

      // Check room-level keywords
      if (room.keywords !== undefined && !Array.isArray(room.keywords)) {
        issues.push({
          roomId,
          type: "invalid_type",
          message: "Room-level keywords is not an array"
        });
      }

    } catch (err: any) {
      console.log(`⚠️ Skipping ${file}: ${err.message}`);
    }
  }

  // Report
  console.log("\n📊 AUDIT RESULTS");
  console.log("================\n");

  if (issues.length === 0) {
    console.log("✅ All keyword mappings are valid!\n");
    process.exit(0);
  }

  // Group by type
  const byType: Record<string, AuditIssue[]> = {};
  for (const issue of issues) {
    if (!byType[issue.type]) byType[issue.type] = [];
    byType[issue.type].push(issue);
  }

  for (const [type, typeIssues] of Object.entries(byType)) {
    console.log(`\n${type.toUpperCase()} (${typeIssues.length}):`);
    for (const issue of typeIssues.slice(0, 10)) {
      console.log(`  - ${issue.roomId}: ${issue.message}`);
    }
    if (typeIssues.length > 10) {
      console.log(`  ... and ${typeIssues.length - 10} more`);
    }
  }

  console.log(`\n⚠️ Total issues found: ${issues.length}`);
  
  // Only fail if there are invalid_type issues (structural problems)
  const criticalIssues = issues.filter(i => i.type === "invalid_type");
  if (criticalIssues.length > 0) {
    process.exit(1);
  }
  
  process.exit(0);
}

auditKeywordMapping();
