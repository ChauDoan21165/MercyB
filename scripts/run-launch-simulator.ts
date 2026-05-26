// scripts/run-launch-simulator.ts
// MERCY BLADE – Launch Simulator (READ-ONLY)
//
// Quick performance and memory check by loading room data.
// Does NOT make network requests or modify anything.
//
// Usage: npx tsx scripts/run-launch-simulator.ts [--preset short|full]

import * as fs from "node:fs";
import * as path from "node:path";

const DATA_DIR = path.join(process.cwd(), "public", "data");
const AUDIO_DIR = path.join(process.cwd(), "public", "audio");

interface SimulationResult {
  totalRooms: number;
  totalEntries: number;
  totalAudioFiles: number;
  avgEntriesPerRoom: number;
  loadTimeMs: number;
  memoryUsedMB: number;
}

function countFiles(dir: string, ext: string): number {
  if (!fs.existsSync(dir)) return 0;
  
  let count = 0;
  const items = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const item of items) {
    if (item.isDirectory()) {
      count += countFiles(path.join(dir, item.name), ext);
    } else if (item.name.endsWith(ext)) {
      count++;
    }
  }
  
  return count;
}

function runSimulation(): void {
  console.log("🚀 LAUNCH SIMULATOR – SHORT SUITE");
  console.log("==================================\n");

  const startTime = Date.now();
  const startMemory = process.memoryUsage().heapUsed;

  // 1. Count and load JSON files
  console.log("Loading room data...");
  
  let totalRooms = 0;
  let totalEntries = 0;
  
  if (fs.existsSync(DATA_DIR)) {
    const jsonFiles = fs.readdirSync(DATA_DIR).filter(f => f.endsWith(".json"));
    totalRooms = jsonFiles.length;

    for (const file of jsonFiles) {
      try {
        const content = fs.readFileSync(path.join(DATA_DIR, file), "utf-8");
        const room = JSON.parse(content);
        if (Array.isArray(room.entries)) {
          totalEntries += room.entries.length;
        }
      } catch {
        // Skip invalid files
      }
    }
  }

  // 2. Count audio files
  console.log("Counting audio files...");
  const totalAudioFiles = countFiles(AUDIO_DIR, ".mp3");

  // 3. Calculate metrics
  const endTime = Date.now();
  const endMemory = process.memoryUsage().heapUsed;

  const result: SimulationResult = {
    totalRooms,
    totalEntries,
    totalAudioFiles,
    avgEntriesPerRoom: totalRooms > 0 ? Math.round(totalEntries / totalRooms) : 0,
    loadTimeMs: endTime - startTime,
    memoryUsedMB: Math.round((endMemory - startMemory) / 1024 / 1024 * 100) / 100
  };

  // Report
  console.log("\n📊 SIMULATION RESULTS");
  console.log("=====================\n");

  console.log(`📁 Total Rooms:      ${result.totalRooms}`);
  console.log(`📝 Total Entries:    ${result.totalEntries}`);
  console.log(`🎵 Audio Files:      ${result.totalAudioFiles}`);
  console.log(`📈 Avg Entries/Room: ${result.avgEntriesPerRoom}`);
  console.log(`⏱️  Load Time:        ${result.loadTimeMs}ms`);
  console.log(`💾 Memory Used:      ${result.memoryUsedMB}MB`);

  // Performance thresholds
  const issues: string[] = [];

  if (result.loadTimeMs > 5000) {
    issues.push(`Load time too slow: ${result.loadTimeMs}ms (threshold: 5000ms)`);
  }

  if (result.memoryUsedMB > 100) {
    issues.push(`Memory usage high: ${result.memoryUsedMB}MB (threshold: 100MB)`);
  }

  if (result.totalRooms === 0) {
    issues.push("No rooms found in public/data/");
  }

  console.log("");

  if (issues.length > 0) {
    console.log("⚠️ PERFORMANCE WARNINGS:");
    for (const issue of issues) {
      console.log(`   - ${issue}`);
    }
    console.log("");
    process.exit(2); // Warn but don't block
  }

  console.log("✅ Performance metrics within acceptable range.\n");
  process.exit(0);
}

runSimulation();
