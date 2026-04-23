// src/lib/placement/__tests__/persistence.test.ts
//
// Unit tests for savePlacementResult with a mocked Supabase client. Verifies:
//   - the three writes fire with the expected payloads
//   - weakness UPSERT chooses INSERT when no row exists, UPDATE when one does
//   - errors from individual writes are collected but do not throw
//   - kid self-report case (empty responses + null score) writes correctly

import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock the supabase client module BEFORE importing savePlacementResult.
type FakeResult = { data?: unknown; error?: { message: string } | null };
type QueryHandler = (ctx: {
  table: string;
  method: 'insert' | 'update' | 'select';
  filters: Record<string, unknown>;
  payload?: unknown;
}) => FakeResult;

const queryLog: Array<{
  table: string;
  method: 'insert' | 'update' | 'select';
  filters: Record<string, unknown>;
  payload?: unknown;
}> = [];
let queryHandler: QueryHandler = () => ({ data: null, error: null });

function makeQueryChain(table: string) {
  let method: 'insert' | 'update' | 'select' = 'select';
  let payload: unknown = undefined;
  const filters: Record<string, unknown> = {};

  const terminal = async (): Promise<FakeResult> => {
    const entry = { table, method, filters: { ...filters }, payload };
    queryLog.push(entry);
    return queryHandler(entry);
  };

  const chain: {
    select: (cols?: string) => typeof chain;
    insert: (p: unknown) => Promise<FakeResult>;
    update: (p: unknown) => typeof chain;
    eq: (col: string, val: unknown) => typeof chain;
    maybeSingle: () => Promise<FakeResult>;
    then: (resolve: (r: FakeResult) => void) => Promise<void>;
  } = {
    select(cols?: string) {
      method = 'select';
      filters.__select = cols;
      return chain;
    },
    insert(p: unknown) {
      method = 'insert';
      payload = p;
      return terminal();
    },
    update(p: unknown) {
      method = 'update';
      payload = p;
      return chain;
    },
    eq(col: string, val: unknown) {
      filters[col] = val;
      return chain;
    },
    async maybeSingle() {
      return terminal();
    },
    // Make eq().eq().eq() awaitable directly (for the UPDATE path)
    then(resolve: (r: FakeResult) => void) {
      return terminal().then(resolve);
    },
  };
  return chain;
}

vi.mock('@/lib/supabaseClient', () => ({
  supabase: {
    from: (table: string) => makeQueryChain(table),
  },
}));

import { savePlacementResult } from '../persistence';

beforeEach(() => {
  queryLog.length = 0;
  queryHandler = () => ({ data: null, error: null });
});

describe('savePlacementResult', () => {
  it('writes user_placements, profiles, and one weakness row per flag', async () => {
    queryHandler = ({ table, method, filters: _f, payload: _p }) => {
      // First lookup on weakness profile returns null → triggers INSERT
      if (table === 'mb_user_weakness_profile' && method === 'select') {
        return { data: null, error: null };
      }
      return { data: null, error: null };
    };

    const result = await savePlacementResult({
      userId: 'user-123',
      method: 'test',
      cefr: 'A2',
      score: 2.3,
      recommendedRoomId: 'english_a2_a201',
      questionResponses: [
        {
          questionId: 'q_a1_009',
          cefr: 'A1',
          difficulty: 1,
          selectedOptionId: 'a',
          correct: false,
          viRevealed: false,
          elapsedMs: 8000,
          weaknessTag: 'vi_l1_plural_s',
        },
      ],
      weaknessFlags: ['vi_l1_plural_s', 'vi_l1_past_ed'],
      elapsedMs: 185_000,
    });

    expect(result.ok).toBe(true);
    expect(result.userPlacementsInserted).toBe(true);
    expect(result.profileUpdated).toBe(true);
    expect(result.weaknessRowsWritten).toBe(2);
    expect(result.errors).toEqual([]);

    const tables = queryLog.map((q) => `${q.method}:${q.table}`);
    expect(tables).toContain('insert:user_placements');
    expect(tables).toContain('update:profiles');

    // Two flags → two SELECT-then-INSERT pairs on the weakness table
    const weaknessOps = queryLog.filter(
      (q) => q.table === 'mb_user_weakness_profile',
    );
    expect(weaknessOps.filter((q) => q.method === 'select')).toHaveLength(2);
    expect(weaknessOps.filter((q) => q.method === 'insert')).toHaveLength(2);
  });

  it('UPDATEs existing weakness row instead of INSERTing when one exists', async () => {
    let selectCalls = 0;
    queryHandler = ({ table, method }) => {
      if (table === 'mb_user_weakness_profile' && method === 'select') {
        selectCalls += 1;
        return {
          data: { user_id: 'user-123', frequency: 4 },
          error: null,
        };
      }
      return { data: null, error: null };
    };

    const result = await savePlacementResult({
      userId: 'user-123',
      method: 'test',
      cefr: 'B1',
      score: 3.1,
      recommendedRoomId: 'english_b1_b101',
      questionResponses: [],
      weaknessFlags: ['vi_l1_3rd_person_s'],
      elapsedMs: 200_000,
    });

    expect(result.weaknessRowsWritten).toBe(1);
    expect(selectCalls).toBe(1);

    const weaknessOps = queryLog.filter(
      (q) => q.table === 'mb_user_weakness_profile',
    );
    expect(weaknessOps.filter((q) => q.method === 'update')).toHaveLength(1);
    expect(weaknessOps.filter((q) => q.method === 'insert')).toHaveLength(0);

    const updateOp = weaknessOps.find((q) => q.method === 'update')!;
    expect(
      (updateOp.payload as { frequency: number }).frequency,
    ).toBe(5); // 4 + 1
  });

  it('kid self-report: empty responses + null score, no weakness rows', async () => {
    const result = await savePlacementResult({
      userId: 'user-456',
      method: 'self_report_kid',
      cefr: 'pre_a1',
      score: null,
      recommendedRoomId: 'alphabet_adventure_kids_l1',
      questionResponses: [],
      weaknessFlags: [],
      elapsedMs: null,
    });

    expect(result.ok).toBe(true);
    expect(result.weaknessRowsWritten).toBe(0);

    const insertUP = queryLog.find(
      (q) => q.table === 'user_placements' && q.method === 'insert',
    );
    expect(insertUP).toBeDefined();
    expect((insertUP!.payload as { placement_method: string }).placement_method).toBe(
      'self_report_kid',
    );
    expect((insertUP!.payload as { cefr: string }).cefr).toBe('pre_a1');

    // No weakness table traffic when no flags
    expect(
      queryLog.filter((q) => q.table === 'mb_user_weakness_profile'),
    ).toHaveLength(0);
  });

  it('collects errors from failing writes without throwing', async () => {
    queryHandler = ({ table, method }) => {
      if (table === 'user_placements' && method === 'insert') {
        return { error: { message: 'boom insert' } };
      }
      if (table === 'profiles' && method === 'update') {
        return { error: { message: 'boom update' } };
      }
      return { data: null, error: null };
    };

    const result = await savePlacementResult({
      userId: 'user-789',
      method: 'test',
      cefr: 'A1',
      score: 1.2,
      recommendedRoomId: 'english_a1_a101',
      questionResponses: [],
      weaknessFlags: [],
      elapsedMs: 120_000,
    });

    expect(result.ok).toBe(false);
    expect(result.userPlacementsInserted).toBe(false);
    expect(result.profileUpdated).toBe(false);
    expect(result.errors.join(' ')).toMatch(/user_placements/);
    expect(result.errors.join(' ')).toMatch(/profiles/);
  });
});
