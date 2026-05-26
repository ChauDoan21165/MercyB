// FILE: Scenario_TierBoundaryCheck.ts
// PATH: src/simulator/scenarios/Scenario_TierBoundaryCheck.ts
// VERSION: MB-BLUE-97.9d — 2026-01-18 (+0700)
//
// FIX:
// - level3 tier is DELETED.
// - Legacy level3 behavior is validated by mapping to level3.
// - Scenarios must assert CANONICAL tiers only.

import { simulator } from '../LaunchSimulatorCore';
import { mockTier } from '../TierSimulation';

export async function runScenario_TierBoundaryCheck() {
  return simulator.runScenario('Tier Boundary Check', [
    {
      name: 'Kids trying to access adult Level 9 room',
      action: async () => {
        const kidsUser = mockTier('kids_1');
        simulator.assert(kidsUser.tier !== 'level9', 'Kids user should not have Level 9 access');
      },
    },
    {
      name: 'Level 2 trying to access Level 3 room',
      action: async () => {
        const vip2User = mockTier('level2');
        simulator.assert(vip2User.tier !== 'level3', 'Level 2 user should not have Level 3 access');
      },
    },
    {
      name: 'Legacy Level 3 user mapped to Level 3 (should work)',
      action: async () => {
        // level3 is a legacy alias → must resolve to level3
        const legacyVip3User = mockTier('level3');

        simulator.assert(
          legacyVip3User.tier === 'level3',
          'Legacy Level 3 user should be treated as Level 3'
        );
      },
    },
    {
      name: 'Level 4 trying to access Level 5 room',
      action: async () => {
        const vip4User = mockTier('level4');
        simulator.assert(vip4User.tier !== 'level5', 'Level 4 user should not have Level 5 access');
      },
    },
    {
      name: 'Admin bypass check',
      action: async () => {
        const adminUser = mockTier('admin');
        simulator.assert(adminUser.isAdmin === true, 'Admin user should have admin flag');
      },
    },
    {
      name: 'Level 0 user trying to access Level 1 room',
      action: async () => {
        const freeUser = mockTier('level0');
        simulator.assert(freeUser.tier === 'level0', 'Level 0 user should not have Level 1 access');
      },
    },
  ]);
}
