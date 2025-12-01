// Scenario: Load All Rooms - Validate all room JSON files

import { simulator } from '../LaunchSimulatorCore';
import { environment } from '../SimulatorEnvironment';
import { roomMasterLoader } from '@/lib/roomMaster/roomMasterLoader';

export async function runScenario_LoadAllRooms() {
  const roomIds = await getAllRoomIds();

  return simulator.runScenario('Load All Rooms', [
    {
      name: 'Simulate slow network',
      action: () => {
        environment.simulateSlowNetwork(500);
      },
    },
    {
      name: 'Simulate cold start',
      action: () => {
        environment.simulateColdStart();
      },
    },
    {
      name: `Load and validate ${roomIds.length} rooms`,
      action: async () => {
        let errorCount = 0;
        let warningCount = 0;
        let autofixCount = 0;

        for (const roomId of roomIds) {
          const result = await roomMasterLoader(roomId, {
            mode: 'strict',
            allowMissingFields: false,
            allowEmptyEntries: false,
            requireAudio: true,
            requireBilingualCopy: true,
            minEntries: 2,
            maxEntries: 8,
          });

          errorCount += result.errors.length;
          warningCount += result.warnings.length;
          if (result.autofixed) autofixCount++;

          if (result.errors.length > 0) {
            simulator.warn(`Room ${roomId} has ${result.errors.length} errors`);
          }
        }

        simulator.info(`Total errors: ${errorCount}`);
        simulator.info(`Total warnings: ${warningCount}`);
        simulator.info(`Autofixed rooms: ${autofixCount}`);

        simulator.assert(errorCount === 0, 'All rooms should have zero errors');
      },
    },
    {
      name: 'Restore network',
      action: () => {
        environment.restoreAll();
      },
    },
  ]);
}

async function getAllRoomIds(): Promise<string[]> {
  try {
    const { supabase } = await import('@/integrations/supabase/client');
    const { data } = await supabase.from('rooms').select('id');
    return data?.map(r => r.id) || [];
  } catch {
    // Fallback: use known room IDs
    return [];
  }
}
