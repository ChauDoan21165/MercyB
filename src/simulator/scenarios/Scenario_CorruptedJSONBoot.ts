// Scenario: Corrupted JSON Boot - Test handling of corrupted room data

import { simulator } from '../LaunchSimulatorCore';
import { applyRandomCorruption } from '../JSONCorruptionEngine';
import { roomMasterLoader } from '@/lib/roomMaster/roomMasterLoader';

export async function runScenario_CorruptedJSONBoot() {
  const roomIds = await getSampleRoomIds(20);

  return simulator.runScenario('Corrupted JSON Boot', [
    {
      name: 'Load and corrupt 20 random rooms',
      action: async () => {
        let caughtErrors = 0;
        let uncaughtErrors = 0;

        for (const roomId of roomIds) {
          try {
            // Load room
            const result = await roomMasterLoader(roomId);

            // Corrupt it
            const corrupted = applyRandomCorruption(result.cleanedRoom);

            // Try to validate corrupted room
            const { validateRoom } = await import('@/lib/roomMaster/roomMaster');
            const corruptedResult = validateRoom(corrupted, {
              mode: 'strict',
              allowMissingFields: false,
              allowEmptyEntries: false,
              requireAudio: true,
              requireBilingualCopy: true,
              minEntries: 2,
              maxEntries: 8,
            });

            if (corruptedResult.errors.length > 0) {
              caughtErrors++;
              simulator.info(`RoomMaster caught corruption in ${roomId}`);
            }
          } catch (error: any) {
            uncaughtErrors++;
            simulator.error(`Uncaught error for ${roomId}: ${error.message}`);
          }
        }

        simulator.info(`Caught errors: ${caughtErrors}`);
        simulator.info(`Uncaught errors: ${uncaughtErrors}`);

        simulator.assert(uncaughtErrors === 0, 'All corruptions should be caught by RoomMaster');
        simulator.assert(caughtErrors > 0, 'RoomMaster should detect corruptions');
      },
    },
  ]);
}

async function getSampleRoomIds(count: number): Promise<string[]> {
  try {
    const { supabase } = await import('@/integrations/supabase/client');
    const { data } = await supabase.from('rooms').select('id').limit(count);
    return data?.map(r => r.id) || [];
  } catch {
    return [];
  }
}
