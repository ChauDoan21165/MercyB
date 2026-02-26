// FILE: src/simulator/scenarios/Scenario_CorruptedJSONBoot.ts
// Scenario: Corrupted JSON Boot - Test handling of corrupted room data
//
// BUILD-SAFE FIXES (TS2345 + robustness):
// - roomMasterLoader signature may be (AnyRoom) (not string roomId). Call it via `any` shim.
// - If Supabase is unavailable / returns 0 rows, fall back to local registry room IDs.
// - If we still have 0 room IDs, fail fast with a clear assertion (prevents false-fail on caughtErrors > 0).
// - Keep runtime behavior the same for the main corruption/validation loop.

import { simulator } from "../LaunchSimulatorCore";
import { applyRandomCorruption } from "../JSONCorruptionEngine";
import { roomMasterLoader } from "@/lib/roomMaster/roomMasterLoader";

export async function runScenario_CorruptedJSONBoot() {
  const roomIds = await getSampleRoomIds(20);

  return simulator.runScenario("Corrupted JSON Boot", [
    {
      name: "Load and corrupt 20 random rooms",
      action: async () => {
        // Guard: ensure we actually have rooms to test
        simulator.assert(roomIds.length > 0, "No rooms found to test (DB + registry empty).");

        let caughtErrors = 0;
        let uncaughtErrors = 0;

        for (const roomId of roomIds) {
          try {
            // Load room
            // NOTE: Some repo states type roomMasterLoader as (room: AnyRoom) => ...
            // We keep this test build-safe by invoking via `any`.
            const result = await (roomMasterLoader as any)(roomId);

            // Corrupt it
            const corrupted = applyRandomCorruption((result as any)?.cleanedRoom ?? (result as any)?.room ?? result);

            // Try to validate corrupted room
            const mod = await import("@/lib/roomMaster/roomMaster");
            const validateRoom = (mod as any)?.validateRoom as
              | undefined
              | ((room: any, opts: any) => { errors: any[]; warnings?: any[] });

            simulator.assert(typeof validateRoom === "function", "validateRoom() is missing from roomMaster module.");

            const corruptedResult = validateRoom!(corrupted, {
              mode: "strict",
              allowMissingFields: false,
              allowEmptyEntries: false,
              requireAudio: true,
              requireBilingualCopy: true,
              minEntries: 2,
              maxEntries: 8,
            });

            if (Array.isArray(corruptedResult?.errors) && corruptedResult.errors.length > 0) {
              caughtErrors++;
              simulator.info(`RoomMaster caught corruption in ${roomId}`);
            }
          } catch (error: any) {
            uncaughtErrors++;
            simulator.error(`Uncaught error for ${roomId}: ${error?.message || String(error)}`);
          }
        }

        simulator.info(`Caught errors: ${caughtErrors}`);
        simulator.info(`Uncaught errors: ${uncaughtErrors}`);

        simulator.assert(uncaughtErrors === 0, "All corruptions should be caught by RoomMaster");
        simulator.assert(caughtErrors > 0, "RoomMaster should detect corruptions");
      },
    },
  ]);
}

async function getSampleRoomIds(count: number): Promise<string[]> {
  // 1) Prefer DB
  try {
    const { supabase } = await import("@/lib/supabaseClient");
    const { data, error } = await supabase.from("rooms").select("id").limit(count);

    if (!error && Array.isArray(data) && data.length > 0) {
      return data.map((r: any) => String(r?.id ?? "").trim()).filter(Boolean);
    }
  } catch {
    // ignore DB failure and fall back
  }

  // 2) Fallback: local registry (works in CI/offline)
  // NOTE: Registry location varies by repo; try a couple common paths.
  const tryImports = [
    "@/lib/rooms/roomRegistry",
    "@/lib/roomRegistry",
    "@/lib/roomData",
  ];

  for (const path of tryImports) {
    try {
      const mod: any = await import(path);

      const rooms =
        (typeof mod?.getAllRooms === "function" && mod.getAllRooms()) ||
        (typeof mod?.getRooms === "function" && mod.getRooms()) ||
        (Array.isArray(mod?.ROOMS) && mod.ROOMS) ||
        (Array.isArray(mod?.rooms) && mod.rooms) ||
        [];

      const ids = (rooms as any[])
        .map((r) => String(r?.id ?? "").trim())
        .filter(Boolean)
        .slice(0, count);

      if (ids.length > 0) return ids;
    } catch {
      // keep trying
    }
  }

  return [];
}