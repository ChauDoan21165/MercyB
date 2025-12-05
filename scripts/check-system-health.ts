// scripts/check-system-health.ts
// Pure TS/Node, no external deps

import * as fs from "fs";
import * as path from "path";

type StatusLevel = "healthy" | "warning" | "critical";

interface RoomMetrics {
  totalRooms: number;
  validRooms: number;
  invalidRooms: number;
}

interface AudioMetrics {
  hasAutopilotStatus: boolean;
  beforeIntegrity: number | null;
  afterIntegrity: number | null;
}

interface SystemHealth {
  version: string;
  generatedAt: string;
  status: StatusLevel;
  overallScore: number;
  rooms: RoomMetrics;
  audio: AudioMetrics;
  notes: string[];
}

const ROOT = process.cwd();
const PUBLIC_DIR = path.join(ROOT, "public");
const DATA_DIR = path.join(PUBLIC_DIR, "data");
const AUDIO_DIR = path.join(PUBLIC_DIR, "audio");
const HEALTH_PATH = path.join(PUBLIC_DIR, "system-health.json");
const BADGE_PATH = path.join(PUBLIC_DIR, "system-health-badge.json");
const AUTOPILOT_STATUS_PATH = path.join(AUDIO_DIR, "autopilot-status.json");

function ensureDirExists(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function readJsonSafe<T = any>(filePath: string): T | null {
  if (!fs.existsSync(filePath)) return null;
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function collectRoomMetrics(): RoomMetrics {
  const metrics: RoomMetrics = {
    totalRooms: 0,
    validRooms: 0,
    invalidRooms: 0,
  };

  if (!fs.existsSync(DATA_DIR)) {
    return metrics;
  }

  const files = fs
    .readdirSync(DATA_DIR)
    .filter((f) => f.endsWith(".json") && !f.startsWith("_"));

  metrics.totalRooms = files.length;

  for (const file of files) {
    const fullPath = path.join(DATA_DIR, file);
    const data = readJsonSafe<any>(fullPath);
    if (data && data.id && Array.isArray(data.entries) && data.entries.length > 0) {
      metrics.validRooms += 1;
    } else {
      metrics.invalidRooms += 1;
    }
  }

  return metrics;
}

function collectAudioMetrics(): AudioMetrics {
  const audio: AudioMetrics = {
    hasAutopilotStatus: false,
    beforeIntegrity: null,
    afterIntegrity: null,
  };

  const status = readJsonSafe<any>(AUTOPILOT_STATUS_PATH);
  if (status && typeof status.afterIntegrity === "number") {
    audio.hasAutopilotStatus = true;
    audio.beforeIntegrity =
      typeof status.beforeIntegrity === "number" ? status.beforeIntegrity : null;
    audio.afterIntegrity = status.afterIntegrity;
  }

  return audio;
}

function computeOverallScore(rooms: RoomMetrics, audio: AudioMetrics): { score: number; status: StatusLevel; notes: string[] } {
  const notes: string[] = [];
  let roomScore = 100;

  if (rooms.totalRooms === 0) {
    roomScore = 0;
    notes.push("No room JSON files found in public/data.");
  } else {
    roomScore = (rooms.validRooms / rooms.totalRooms) * 100;
    if (rooms.invalidRooms > 0) {
      notes.push(`Found ${rooms.invalidRooms} invalid room JSON file(s).`);
    }
  }

  let audioScore = 0;
  if (!audio.hasAutopilotStatus) {
    audioScore = 50;
    notes.push("No autopilot-status.json found; audio integrity unknown (assumed 50%).");
  } else if (audio.afterIntegrity == null) {
    audioScore = 50;
    notes.push("autopilot-status.json missing afterIntegrity; assumed 50%.");
  } else {
    audioScore = audio.afterIntegrity;
  }

  // Simple weighting: 60% audio, 40% rooms
  const score = roomScore * 0.4 + audioScore * 0.6;

  let status: StatusLevel;
  if (score >= 95) status = "healthy";
  else if (score >= 85) status = "warning";
  else status = "critical";

  return { score, status, notes };
}

function colorForScore(score: number): string {
  if (score >= 95) return "brightgreen";
  if (score >= 85) return "yellow";
  if (score >= 70) return "orange";
  return "red";
}

function main() {
  ensureDirExists(PUBLIC_DIR);

  const rooms = collectRoomMetrics();
  const audio = collectAudioMetrics();
  const { score, status, notes } = computeOverallScore(rooms, audio);

  const health: SystemHealth = {
    version: "1.0.0",
    generatedAt: new Date().toISOString(),
    status,
    overallScore: Number(score.toFixed(1)),
    rooms,
    audio,
    notes,
  };

  fs.writeFileSync(HEALTH_PATH, JSON.stringify(health, null, 2), "utf-8");
  console.log(`[system-health] Wrote ${HEALTH_PATH}`);

  // Shields.io endpoint format
  const badgeJson = {
    schemaVersion: 1,
    label: "system health",
    message: `${health.overallScore.toFixed(1)}%`,
    color: colorForScore(health.overallScore),
  };

  fs.writeFileSync(BADGE_PATH, JSON.stringify(badgeJson, null, 2), "utf-8");
  console.log(`[system-health] Wrote ${BADGE_PATH}`);

  // Exit non-zero if truly critical
  if (status === "critical") {
    console.error("[system-health] Status CRITICAL – failing CI.");
    process.exit(1);
  }
}

main();
