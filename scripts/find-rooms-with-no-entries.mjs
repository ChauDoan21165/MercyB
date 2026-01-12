import fs from "fs";
import path from "path";

const DATA_DIR = path.resolve("public/data");

function hasEntries(room) {
  if (!room || typeof room !== "object") return false;

  // common patterns you already support
  const candidates = [
    room.entries,
    room.items,
    room.cards,
    room.blocks,
  ];

  for (const c of candidates) {
    if (Array.isArray(c) && c.length > 0) return true;
  }

  return false;
}

const badRooms = [];

for (const file of fs.readdirSync(DATA_DIR)) {
  if (!file.endsWith(".json")) continue;

  const full = path.join(DATA_DIR, file);

  try {
    const json = JSON.parse(fs.readFileSync(full, "utf8"));

    if (!hasEntries(json)) {
      badRooms.push(file);
    }
  } catch (e) {
    console.error("❌ Invalid JSON:", file);
  }
}

if (badRooms.length === 0) {
  console.log("✅ All rooms have at least one entry");
} else {
  console.log("❌ Rooms with NO entries:");
  badRooms.forEach(r => console.log(" -", r));
  console.log(`\nTotal: ${badRooms.length}`);
}
