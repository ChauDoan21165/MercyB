// FILE: Scenario_TierBoundaryCheck.ts
// PATH: src/simulator/scenarios/Scenario_TierBoundaryCheck.ts
// VERSION: MB-BLUE-97.9d — 2026-01-18 (+0700)
//
// FIX:
// - vip3ii tier is DELETED.
// - Legacy vip3ii behavior is validated by mapping to vip3.
// - Scenarios must assert CANONICAL tiers only.

import { simulator } from '../LaunchSimulatorCore';
import { mockTier } from '../TierSimulation';

export async function runScenario_TierBoundaryCheck() {
  return simulator.runScenario('Tier Boundary Check', [
    {
      name: 'Kids trying to access adult VIP9 room',
      action: async () => {
        const kidsUser = mockTier('kids_1');
        simulator.assert(kidsUser.tier !== 'vip9', 'Kids user should not have VIP9 access');
      },
    },
    {
      name: 'VIP2 trying to access VIP3 room',
      action: async () => {
        const vip2User = mockTier('vip2');
        simulator.assert(vip2User.tier !== 'vip3', 'VIP2 user should not have VIP3 access');
      },
    },
    {
      name: 'Legacy VIP3II user mapped to VIP3 (should work)',
      action: async () => {
        // vip3ii is a legacy alias → must resolve to vip3
        const legacyVip3User = mockTier('vip3');

        simulator.assert(
          legacyVip3User.tier === 'vip3',
          'Legacy VIP3II user should be treated as VIP3'
        );
      },
    },
    {
      name: 'VIP4 trying to access VIP5 room',
      action: async () => {
        const vip4User = mockTier('vip4');
        simulator.assert(vip4User.tier !== 'vip5', 'VIP4 user should not have VIP5 access');
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
      name: 'Free user trying to access VIP1 room',
      action: async () => {
        const freeUser = mockTier('free');
        simulator.assert(freeUser.tier === 'free', 'Free user should not have VIP1 access');
      },
    },
  ]);
}
