// src/lib/userContent/__tests__/sentenceSubmission.test.ts
//
// Focus: the validation logic and the permission-gate contracts.
// The DB interactions are mocked — the real enforcement is RLS, which
// is covered by the SQL migration not this unit suite. What we verify
// here is that the client-side helpers:
//   - reject bad payloads before hitting the network
//   - refuse admin operations when `requireAdmin` throws
//   - surface duplicate-today as a specific error code, not a generic one

import { describe, it, expect, vi, beforeEach } from 'vitest';

// ── Mocks ────────────────────────────────────────────────────────────
// The auth guard is the admin gate; flip it per-test to exercise the
// gate path without a real session.
vi.mock('@/lib/security/authGuard', () => ({
  requireAuth: vi.fn(),
  requireAdmin: vi.fn(),
}));

// Supabase client — a chainable stub that records the last operation
// and returns whatever we ask it to.
const supabaseState = {
  lastTable: '' as string,
  lastInsertRow: null as unknown,
  lastUpdate: null as unknown,
  insertReturn: { data: null as unknown, error: null as unknown },
  selectReturn: { data: [] as unknown[], error: null as unknown },
  updateReturn: { data: null as unknown, error: null as unknown },
};

function resetSupabaseState() {
  supabaseState.lastTable = '';
  supabaseState.lastInsertRow = null;
  supabaseState.lastUpdate = null;
  supabaseState.insertReturn = { data: null, error: null };
  supabaseState.selectReturn = { data: [], error: null };
  supabaseState.updateReturn = { data: null, error: null };
}

vi.mock('@/lib/supabaseClient', () => {
  const chainable = (kind: 'select' | 'insert' | 'update') => {
    const api: Record<string, unknown> = {};
    const terminal = async () => {
      if (kind === 'insert') return supabaseState.insertReturn;
      if (kind === 'update') return supabaseState.updateReturn;
      return supabaseState.selectReturn;
    };
    const chainMethods = [
      'select', 'eq', 'ilike', 'gte', 'lt', 'order', 'limit',
    ];
    chainMethods.forEach((m) => {
      api[m] = vi.fn(() => api);
    });
    (api as { single: () => Promise<unknown> }).single = vi.fn(terminal);
    (api as { then: unknown }).then = (resolve: (v: unknown) => unknown) =>
      terminal().then(resolve);
    return api;
  };
  return {
    supabase: {
      from: vi.fn((t: string) => {
        supabaseState.lastTable = t;
        return {
          insert: vi.fn((row: unknown) => {
            supabaseState.lastInsertRow = row;
            return chainable('insert');
          }),
          update: vi.fn((u: unknown) => {
            supabaseState.lastUpdate = u;
            return chainable('update');
          }),
          select: vi.fn(() => chainable('select')),
        };
      }),
    },
  };
});

import {
  approveSubmission,
  getMySubmissions,
  getPendingSubmissions,
  rejectSubmission,
  submitSentence,
  validateSubmissionPayload,
  SUBMISSION_DIFFICULTY_LEVELS,
} from '../sentenceSubmission';
import { requireAdmin } from '@/lib/security/authGuard';

beforeEach(() => {
  vi.mocked(requireAdmin).mockReset();
  resetSupabaseState();
});

describe('validateSubmissionPayload', () => {
  it('accepts a minimal well-formed payload', () => {
    expect(
      validateSubmissionPayload({ en: 'Hello world', vi: 'Chào' }),
    ).toBeNull();
  });

  it('rejects short English (< 5 chars after trim)', () => {
    expect(validateSubmissionPayload({ en: 'Hi', vi: 'Chào' })).toMatch(/English/i);
  });

  it('rejects short Vietnamese (< 3 chars after trim)', () => {
    expect(validateSubmissionPayload({ en: 'Hello world', vi: 'C' })).toMatch(/Vietnamese/i);
  });

  it('rejects long English (> 500 chars)', () => {
    const en = 'a'.repeat(501);
    expect(validateSubmissionPayload({ en, vi: 'Chào' })).toMatch(/500/);
  });

  it('trims whitespace before length checks', () => {
    // 'Hi   ' after trim is 2 chars → should fail, not pass because of padding.
    expect(
      validateSubmissionPayload({ en: 'Hi   ', vi: 'Chào' }),
    ).toMatch(/English/i);
  });

  it('accepts every documented difficulty level', () => {
    for (const level of SUBMISSION_DIFFICULTY_LEVELS) {
      expect(
        validateSubmissionPayload({ en: 'Hello world', vi: 'Chào', difficulty: level }),
      ).toBeNull();
    }
  });

  it('rejects an unknown difficulty', () => {
    expect(
      validateSubmissionPayload({
        en: 'Hello world',
        vi: 'Chào',
        // @ts-expect-error — exercising the runtime guard
        difficulty: 'D3',
      }),
    ).toMatch(/Difficulty/i);
  });

  it('accepts a well-formed suggested L1 tag', () => {
    expect(
      validateSubmissionPayload({
        en: 'Hello world',
        vi: 'Chào',
        suggestedL1Tag: 'vi_l1_3rd_person_s',
      }),
    ).toBeNull();
  });

  it('rejects a malformed suggested L1 tag', () => {
    expect(
      validateSubmissionPayload({
        en: 'Hello world',
        vi: 'Chào',
        suggestedL1Tag: 'Vi_L1_Bad',
      }),
    ).toMatch(/L1/);
  });

  it('treats an empty suggested L1 tag as absent (not an error)', () => {
    expect(
      validateSubmissionPayload({
        en: 'Hello world',
        vi: 'Chào',
        suggestedL1Tag: '',
      }),
    ).toBeNull();
  });
});

describe('submitSentence', () => {
  it('fails fast without hitting the network when unauthenticated', async () => {
    const result = await submitSentence('', { en: 'Hello world', vi: 'Chào' });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.code).toBe('AUTH_REQUIRED');
    }
    expect(supabaseState.lastTable).toBe('');
  });

  it('fails with VALIDATION code on bad payload before hitting the network', async () => {
    const result = await submitSentence('user-1', { en: 'Hi', vi: 'C' });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.code).toBe('VALIDATION');
    }
    expect(supabaseState.lastInsertRow).toBeNull();
  });

  it('trims en/vi and forwards the row to Supabase on happy path', async () => {
    supabaseState.selectReturn = { data: [], error: null }; // dup check returns nothing
    supabaseState.insertReturn = {
      data: { id: 'x', submitter_user_id: 'u', en: 'Hello world', vi: 'Chào', context: null, difficulty: null, suggested_l1_tag: null, submitted_at: '', status: 'pending', reviewed_at: null, reviewed_by_user_id: null, review_notes: null },
      error: null,
    };

    const result = await submitSentence('u', {
      en: '  Hello world  ',
      vi: '  Chào  ',
      context: '  travel  ',
    });
    expect(result.ok).toBe(true);
    expect(supabaseState.lastInsertRow).toMatchObject({
      submitter_user_id: 'u',
      en: 'Hello world',
      vi: 'Chào',
      context: 'travel',
      difficulty: null,
    });
  });

  it('maps Postgres unique-violation (23505) to DUPLICATE_TODAY', async () => {
    supabaseState.selectReturn = { data: [], error: null };
    supabaseState.insertReturn = {
      data: null,
      error: { code: '23505', message: 'duplicate key value violates unique constraint' },
    };

    const result = await submitSentence('u', { en: 'Hello world', vi: 'Chào' });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.code).toBe('DUPLICATE_TODAY');
    }
  });

  it('short-circuits when same-day dedup already matches', async () => {
    supabaseState.selectReturn = { data: [{ id: 'prev' }], error: null };
    const result = await submitSentence('u', { en: 'Hello world', vi: 'Chào' });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.code).toBe('DUPLICATE_TODAY');
    }
    // Must not have called insert.
    expect(supabaseState.lastInsertRow).toBeNull();
  });
});

describe('getMySubmissions', () => {
  it('requires a user id', async () => {
    const result = await getMySubmissions('');
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.code).toBe('AUTH_REQUIRED');
  });

  it('returns rows the query produced', async () => {
    supabaseState.selectReturn = {
      data: [{ id: '1', en: 'x', vi: 'y', status: 'pending', submitted_at: '' }],
      error: null,
    };
    const result = await getMySubmissions('u');
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.length).toBe(1);
    }
  });
});

describe('getPendingSubmissions — admin gate', () => {
  it('refuses when requireAdmin throws', async () => {
    vi.mocked(requireAdmin).mockRejectedValueOnce(new Error('ADMIN_ACCESS_REQUIRED'));
    const result = await getPendingSubmissions();
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.code).toBe('ADMIN_ACCESS_REQUIRED');
    expect(supabaseState.lastTable).toBe(''); // never hit the table
  });

  it('queries pending rows when admin check passes', async () => {
    vi.mocked(requireAdmin).mockResolvedValueOnce({
      user: { id: 'admin-1' } as never,
      isAdmin: true,
      isAuthenticated: true,
    });
    supabaseState.selectReturn = {
      data: [{ id: 'p1', en: 'x', vi: 'y', status: 'pending', submitted_at: '' }],
      error: null,
    };
    const result = await getPendingSubmissions();
    expect(result.ok).toBe(true);
    expect(supabaseState.lastTable).toBe('user_submitted_sentences');
  });
});

describe('approveSubmission / rejectSubmission — admin gate', () => {
  it('approveSubmission refuses when non-admin', async () => {
    vi.mocked(requireAdmin).mockRejectedValueOnce(new Error('ADMIN_ACCESS_REQUIRED'));
    const result = await approveSubmission('admin-1', 'sub-1', 'ok');
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.code).toBe('ADMIN_ACCESS_REQUIRED');
  });

  it('rejectSubmission refuses when non-admin', async () => {
    vi.mocked(requireAdmin).mockRejectedValueOnce(new Error('ADMIN_ACCESS_REQUIRED'));
    const result = await rejectSubmission('admin-1', 'sub-1', 'bad vi');
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.code).toBe('ADMIN_ACCESS_REQUIRED');
  });

  it('approveSubmission writes the correct status + reviewer on happy path', async () => {
    vi.mocked(requireAdmin).mockResolvedValueOnce({
      user: { id: 'admin-1' } as never,
      isAdmin: true,
      isAuthenticated: true,
    });
    supabaseState.updateReturn = {
      data: { id: 'sub-1', status: 'approved', reviewed_by_user_id: 'admin-1' } as unknown,
      error: null,
    };
    const result = await approveSubmission('admin-1', 'sub-1', 'great');
    expect(result.ok).toBe(true);
    expect(supabaseState.lastUpdate).toMatchObject({
      status: 'approved',
      reviewed_by_user_id: 'admin-1',
      review_notes: 'great',
    });
  });

  it('rejectSubmission stores null when notes blank', async () => {
    vi.mocked(requireAdmin).mockResolvedValueOnce({
      user: { id: 'admin-1' } as never,
      isAdmin: true,
      isAuthenticated: true,
    });
    supabaseState.updateReturn = {
      data: { id: 'sub-1', status: 'rejected' } as unknown,
      error: null,
    };
    const result = await rejectSubmission('admin-1', 'sub-1', '   ');
    expect(result.ok).toBe(true);
    expect(supabaseState.lastUpdate).toMatchObject({
      status: 'rejected',
      review_notes: null,
    });
  });

  it('approveSubmission requires a submission id', async () => {
    vi.mocked(requireAdmin).mockResolvedValue({
      user: { id: 'admin-1' } as never,
      isAdmin: true,
      isAuthenticated: true,
    });
    const result = await approveSubmission('admin-1', '', null);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.code).toBe('VALIDATION');
  });
});
