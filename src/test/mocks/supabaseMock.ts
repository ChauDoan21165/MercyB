// src/test/mocks/supabaseMock.ts
import { vi } from "vitest";

type QueryResult<T = unknown> = Promise<{
  data: T;
  error: null;
}>;

function resolved<T>(data: T): QueryResult<T> {
  return Promise.resolve({
    data,
    error: null,
  });
}

function createQueryBuilder(defaultData: unknown[] = []) {
  const chain = {
    select: vi.fn(() => chain),
    insert: vi.fn(() => chain),
    update: vi.fn(() => chain),
    upsert: vi.fn(() => chain),
    delete: vi.fn(() => chain),

    eq: vi.fn(() => chain),
    neq: vi.fn(() => chain),
    gt: vi.fn(() => chain),
    gte: vi.fn(() => chain),
    lt: vi.fn(() => chain),
    lte: vi.fn(() => chain),
    like: vi.fn(() => chain),
    ilike: vi.fn(() => chain),
    is: vi.fn(() => chain),
    in: vi.fn(() => chain),
    contains: vi.fn(() => chain),
    containedBy: vi.fn(() => chain),
    overlaps: vi.fn(() => chain),
    textSearch: vi.fn(() => chain),
    match: vi.fn(() => chain),
    not: vi.fn(() => chain),

    order: vi.fn(() => chain),
    limit: vi.fn(() => chain),
    range: vi.fn(() => chain),

    abortSignal: vi.fn(() => chain),
    returns: vi.fn(() => resolved(defaultData)),

    single: vi.fn(() => resolved(null)),
    maybeSingle: vi.fn(() => resolved(null)),
    then: undefined as unknown,
  };

  return chain;
}

export function createSupabaseMock() {
  return {
    auth: {
      getSession: vi.fn().mockResolvedValue({
        data: { session: null },
        error: null,
      }),

      getUser: vi.fn().mockResolvedValue({
        data: { user: null },
        error: null,
      }),

      onAuthStateChange: vi.fn(() => ({
        data: {
          subscription: {
            unsubscribe: vi.fn(),
          },
        },
      })),

      setSession: vi.fn().mockResolvedValue({
        data: { session: null, user: null },
        error: null,
      }),

      exchangeCodeForSession: vi.fn().mockResolvedValue({
        data: { session: null, user: null },
        error: null,
      }),

      updateUser: vi.fn().mockResolvedValue({
        data: { user: null },
        error: null,
      }),

      signInWithPassword: vi.fn().mockResolvedValue({
        data: { session: null, user: null },
        error: null,
      }),

      signInWithOtp: vi.fn().mockResolvedValue({
        data: {},
        error: null,
      }),

      signUp: vi.fn().mockResolvedValue({
        data: { user: null, session: null },
        error: null,
      }),

      signOut: vi.fn().mockResolvedValue({
        error: null,
      }),

      resetPasswordForEmail: vi.fn().mockResolvedValue({
        data: {},
        error: null,
      }),
    },

    functions: {
      invoke: vi.fn().mockResolvedValue({
        data: null,
        error: null,
      }),
    },

    rpc: vi.fn().mockResolvedValue({
      data: false,
      error: null,
    }),

    from: vi.fn((_table: string) => createQueryBuilder([])),
  };
}