// scripts/fix-room-tiers.mjs
// MercyBlade Blue — Tier Fix Script (SAFE: only edits tier/hasData)

import fs from "node:fs";

const FILE = "src/lib/roomList.ts";

function deriveTier(id) {
  if (!id) return "free";
  if (id.endsWith("_free")) return "free";

  const matches = [...id.matchAll(/_vip(\d+)/g)];
  if (matches.length) {
    const max = Math.max(...matches.map((m) => Number(m[1] || 0)));
    return `vip${max}`;
  }
  return "free";
}

const src = fs.readFileSync(FILE, "utf8");

// Find the __ROOM_LIST array literal in the TS file
const m = src.match(/const __ROOM_LIST:\s*RoomListItem\[\]\s*=\s*(\[[\s\S]*?\]);/);
if (!m) {
  console.error("Could not find __ROOM_LIST in", FILE);
  process.exit(1);
}

let list;
try {
  // __ROOM_LIST is JSON-like in your file (double quotes). This parses it safely.
  list = JSON.parse(m[1]);
} catch (e) {
  console.error("Failed to JSON.parse __ROOM_LIST array. Ensure it is pure JSON (double quotes).");
  console.error(e);
  process.exit(1);
}

let changed = 0;
for (const item of list) {
  const newTier = deriveTier(item.id);
  if (item.tier !== newTier) {
    item.tier = newTier;
    changed++;
  }
  // optional: force hasData true (comment out if you don’t want)
  item.hasData = true;
}

const newArrayText = JSON.stringify(list, null, 2);
const patched = src.replace(m[1], newArrayText);

fs.writeFileSync(FILE, patched, "utf8");

console.log("Patched tiers in:", FILE);
console.log("Items:", list.length);
console.log("Tier changes:", changed);
