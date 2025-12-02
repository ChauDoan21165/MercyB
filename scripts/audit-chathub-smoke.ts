// scripts/audit-chathub-smoke.ts
// MERCY BLADE – ChatHub Stability Smoke Test (READ-ONLY)
//
// Validates that room JSON files can be loaded and parsed correctly,
// simulating what ChatHub does when loading rooms.
//
// Usage: npx tsx scripts/audit-chathub-smoke.ts

import * as fs from "node:fs";
import * as path from "node:path";

const DATA_DIR = path.join(process.cwd(), "public", "data");

interface SmokeResult {
  roomId: string;
  status: "ok" | "error";
  error?: string;
}

function smokeTestChatHub(): void {
  console.log("🔍 CHATHUB STABILITY SMOKE TEST");
  console.log("================================\n");

  if (!fs.existsSync(DATA_DIR)) {
    console.log("⚠️ Data directory not found:", DATA_DIR);
    process.exit(0);
  }

  const results: SmokeResult[] = [];
  const jsonFiles = fs.readdirSync(DATA_DIR).filter(f => f.endsWith(".json"));

  console.log(`Testing ${jsonFiles.length} room JSON files...\n`);

  for (const file of jsonFiles) {
    const filePath = path.join(DATA_DIR, file);
    const roomId = file.replace(".json", "");

    try {
      // 1. Read file
      const content = fs.readFileSync(filePath, "utf-8");

      // 2. Parse JSON
      const room = JSON.parse(content);

      // 3. Validate required fields that ChatHub expects
      const issues: string[] = [];

      if (!room.id) {
        issues.push("missing id field");
      }

      if (!room.title || (!room.title.en && !room.title_en)) {
        issues.push("missing title");
      }

      if (!Array.isArray(room.entries)) {
        issues.push("entries is not an array");
      } else {
        // Validate each entry has required fields
        for (let i = 0; i < room.entries.length; i++) {
          const entry = room.entries[i];
          
          // Check for copy/content
          const hasContent = entry.copy || entry.content || entry.copy_en || entry.content_en;
          if (!hasContent) {
            issues.push(`entry ${i}: missing copy/content`);
            break; // Only report first entry issue
          }
        }
      }

      if (issues.length > 0) {
        results.push({
          roomId,
          status: "error",
          error: issues.join("; ")
        });
      } else {
        results.push({ roomId, status: "ok" });
      }

    } catch (err: any) {
      results.push({
        roomId,
        status: "error",
        error: err.message
      });
    }
  }

  // Report
  console.log("\n📊 SMOKE TEST RESULTS");
  console.log("=====================\n");

  const passed = results.filter(r => r.status === "ok");
  const failed = results.filter(r => r.status === "error");

  console.log(`✅ Passed: ${passed.length}`);
  console.log(`❌ Failed: ${failed.length}`);

  if (failed.length > 0) {
    console.log("\n❌ FAILED ROOMS:");
    for (const result of failed.slice(0, 20)) {
      console.log(`   - ${result.roomId}: ${result.error}`);
    }
    if (failed.length > 20) {
      console.log(`   ... and ${failed.length - 20} more`);
    }
  }

  console.log("");

  if (failed.length > 0) {
    console.log(`❌ ${failed.length} room(s) would cause ChatHub issues.\n`);
    process.exit(1);
  }

  console.log("✅ All rooms pass ChatHub smoke test.\n");
  process.exit(0);
}

smokeTestChatHub();
