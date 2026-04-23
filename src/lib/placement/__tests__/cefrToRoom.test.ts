// src/lib/placement/__tests__/cefrToRoom.test.ts
//
// Validation gate for the static CEFR → room id map.
//
// This test reads the actual room JSON inventory from public/data and
// asserts that every roomId referenced by CEFR_TO_ROOM exists on disk.
// If any room is renamed or deleted, CI fails loudly here — the
// placement feature cannot recommend a nonexistent room.

import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { CEFR_TO_ROOM } from '../cefrToRoom';

const ROOM_DATA_DIR = path.join(process.cwd(), 'public', 'data');

const INVENTORY = new Set(
  fs
    .readdirSync(ROOM_DATA_DIR)
    .filter((f) => f.endsWith('.json'))
    .map((f) => f.replace(/\.json$/, '')),
);

describe('cefrToRoom — validation gate', () => {
  it('public/data directory exists and is non-empty', () => {
    expect(fs.existsSync(ROOM_DATA_DIR)).toBe(true);
    expect(INVENTORY.size).toBeGreaterThan(0);
  });

  it.each(Object.entries(CEFR_TO_ROOM))(
    'CEFR %s → %s is a real room file in public/data/',
    (_cefr, roomId) => {
      expect(
        INVENTORY.has(roomId),
        `Expected public/data/${roomId}.json to exist for placement mapping`,
      ).toBe(true);
    },
  );

  it('primary Start-this-lesson room must never be paywalled', () => {
    // All recommended rooms should live in the free-tier content range.
    // We encode this as a lightweight filename-pattern check: none of the
    // recommended rooms should match the legacy paid-tier marker 'vip'.
    // (Tier gating lives in app logic, not in JSON — but the filename
    // convention is a reliable proxy today.)
    for (const [cefr, roomId] of Object.entries(CEFR_TO_ROOM)) {
      expect(
        /vip\d/i.test(roomId),
        `CEFR ${cefr} recommends ${roomId} which looks paid-tier`,
      ).toBe(false);
    }
  });
});
