// scripts/patch-wlf-rooms.mjs
import { readFileSync, writeFileSync } from "fs";

function patchRoom(path, patch) {
  const raw = readFileSync(path, "utf8");
  const json = JSON.parse(raw);
  const updated = { ...json, ...patch };
  writeFileSync(path, JSON.stringify(updated, null, 2));
  console.log(`patched ${path} -> id: ${updated.id}`);
}

function main() {
  // FREE room
  patchRoom("public/data/weight_loss_and_fitness_free.json", {
    id: "weight_loss_and_fitness_free",
  });

  // VIP2 room
  patchRoom("public/data/weight_loss_and_fitness_vip2.json", {
    id: "weight_loss_and_fitness_vip2",
  });
}

main();
