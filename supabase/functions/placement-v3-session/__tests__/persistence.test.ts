import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";
import { replaySafeSerialize } from "../../_shared/placementForensicLogger.ts";
import { selectPrompt } from "../modality.ts";
import { createPersistence, recommendLessons } from "../persistence.ts";
import type { PlacementV3Profile, PlacementV3Session } from "../types.ts";

type Row = Record<string, unknown>;
type TableName = "placement_v3_sessions" | "placement_v3_responses" | "placement_v3_profiles" | "profiles";

type FakeDbOptions = {
  unsupportedColumns?: Partial<Record<TableName, string[]>>;
};

class FakeQuery {
  private rows: Row[];
  private filters: Array<[string, unknown]> = [];
  private insertValue: Row | null = null;
  private updateValue: Row | null = null;
  private upsertValue: Row | null = null;
  private orderColumn: string | null = null;
  private ascending = true;
  private limitCount: number | null = null;

  constructor(
    private tableName: TableName,
    rows: Row[],
    private options: FakeDbOptions,
  ) {
    this.rows = rows;
  }

  select() {
    return this;
  }

  insert(value: unknown) {
    this.insertValue = value as Row;
    return this;
  }

  update(value: unknown) {
    this.updateValue = value as Row;
    return this;
  }

  upsert(value: unknown) {
    this.upsertValue = value as Row;
    return this;
  }

  eq(column: string, value: unknown) {
    this.filters.push([column, value]);
    return this;
  }

  order(column: string, options?: { ascending?: boolean }) {
    this.orderColumn = column;
    this.ascending = options?.ascending ?? true;
    return this;
  }

  limit(count: number) {
    this.limitCount = count;
    return this;
  }

  async maybeSingle() {
    const data = this.resultRows()[0] ?? null;
    return { data, error: null };
  }

  async single() {
    if (this.insertValue) {
      const insertValue = serializeForDb(this.insertValue);
      const unsupported = this.options.unsupportedColumns?.[this.tableName] ?? [];
      const unsupportedColumn = unsupported.find((column) =>
        Object.prototype.hasOwnProperty.call(insertValue, column)
      );
      if (unsupportedColumn) {
        return {
          data: null,
          error: { message: `column "${unsupportedColumn}" of relation "${this.tableName}" does not exist` },
        };
      }
      if (
        this.rows.some((row) =>
          row.session_id === insertValue.session_id &&
          row.task_index === insertValue.task_index
        )
      ) {
        return {
          data: null,
          error: {
            message:
              'duplicate key value violates unique constraint "uniq_responses_session_task"',
          },
        };
      }
      this.rows.push(insertValue);
      return { data: insertValue, error: null };
    }
    if (this.upsertValue) {
      const upsertValue = serializeForDb(this.upsertValue);
      const idx = this.rows.findIndex(
        (r) =>
          r.user_id === upsertValue.user_id &&
          r.session_id === upsertValue.session_id,
      );
      if (idx >= 0) this.rows[idx] = serializeForDb({ ...this.rows[idx], ...upsertValue });
      else this.rows.push(upsertValue);
      return { data: upsertValue, error: null };
    }
    if (this.updateValue) {
      const updateValue = serializeForDb(this.updateValue);
      const row = this.resultRows()[0];
      if (row) Object.assign(row, updateValue);
      return { data: row ?? null, error: null };
    }
    return { data: this.resultRows()[0] ?? null, error: null };
  }

  then(resolve: (value: { data: unknown; error: null }) => unknown) {
    if (this.updateValue) {
      const updateValue = serializeForDb(this.updateValue);
      for (const row of this.resultRows()) Object.assign(row, updateValue);
    }
    return Promise.resolve({ data: this.resultRows(), error: null }).then(resolve);
  }

  private resultRows() {
    let out = this.rows.filter((row) =>
      this.filters.every(([column, value]) => row[column] === value)
    );
    if (this.orderColumn) {
      const c = this.orderColumn;
      out = [...out].sort((a, b) => {
        const av = String(a[c] ?? "");
        const bv = String(b[c] ?? "");
        return this.ascending ? av.localeCompare(bv) : bv.localeCompare(av);
      });
    }
    if (this.limitCount !== null) out = out.slice(0, this.limitCount);
    return out;
  }
}

function serializeForDb<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function stableHash(value: unknown) {
  return createHash("sha256").update(JSON.stringify(value)).digest("hex");
}

function fakeDb(seed: Partial<Record<TableName, Row[]>> = {}, options: FakeDbOptions = {}) {
  const tables: Record<TableName, Row[]> = {
    placement_v3_sessions: seed.placement_v3_sessions ?? [],
    placement_v3_responses: seed.placement_v3_responses ?? [],
    placement_v3_profiles: seed.placement_v3_profiles ?? [],
    profiles: seed.profiles ?? [],
  };
  return {
    tables,
    db: {
      from(table: string) {
        return new FakeQuery(table as TableName, tables[table as TableName], options);
      },
    },
  };
}

describe("placement v3 persistence", () => {
  it("creates session rows with active prompt metadata", async () => {
    const f = fakeDb();
    const p = createPersistence(f.db, {
      now: () => "2026-05-20T12:00:00.000Z",
      newId: () => "id-1",
    });
    const prompt = selectPrompt({ modality: "writing", targetLevel: "A2", responses: [] });
    const session = await p.createSession({
      id: "session-1",
      userId: "user-1",
      languagePair: { native: "vi", target: "en" },
      firstPrompt: prompt,
      now: "2026-05-20T12:00:00.000Z",
      totalTasks: 11,
    });
    expect(session.metadata.lastPrompt?.id).toBe(prompt.id);
    expect(f.tables.placement_v3_sessions).toHaveLength(1);
  });

  it("marks session rows synthetic when the start request carries the monitoring marker", async () => {
    const f = fakeDb();
    const p = createPersistence(f.db, {
      now: () => "2026-05-20T12:00:00.000Z",
      newId: () => "id-1",
    });
    const prompt = selectPrompt({ modality: "writing", targetLevel: "A2", responses: [] });

    await p.createSession({
      id: "session-1",
      userId: "user-1",
      languagePair: { native: "vi", target: "en" },
      firstPrompt: prompt,
      now: "2026-05-20T12:00:00.000Z",
      totalTasks: 11,
      isSynthetic: true,
    });

    expect(f.tables.placement_v3_sessions[0].is_synthetic).toBe(true);
  });

  it("marks session rows synthetic when the authenticated profile is synthetic", async () => {
    const f = fakeDb({
      profiles: [{ id: "user-1", is_synthetic: true }],
    });
    const p = createPersistence(f.db, {
      now: () => "2026-05-20T12:00:00.000Z",
      newId: () => "id-1",
    });
    const prompt = selectPrompt({ modality: "writing", targetLevel: "A2", responses: [] });

    await p.createSession({
      id: "session-1",
      userId: "user-1",
      languagePair: { native: "vi", target: "en" },
      firstPrompt: prompt,
      now: "2026-05-20T12:00:00.000Z",
      totalTasks: 11,
    });

    expect(f.tables.placement_v3_sessions[0].is_synthetic).toBe(true);
  });

  it("falls back safely before the is_synthetic migration is applied", async () => {
    const f = fakeDb({}, {
      unsupportedColumns: { placement_v3_sessions: ["is_synthetic"] },
    });
    const p = createPersistence(f.db, {
      now: () => "2026-05-20T12:00:00.000Z",
      newId: () => "id-1",
    });
    const prompt = selectPrompt({ modality: "writing", targetLevel: "A2", responses: [] });

    await p.createSession({
      id: "session-1",
      userId: "user-1",
      languagePair: { native: "vi", target: "en" },
      firstPrompt: prompt,
      now: "2026-05-20T12:00:00.000Z",
      totalTasks: 11,
      isSynthetic: true,
    });

    expect(f.tables.placement_v3_sessions).toHaveLength(1);
    expect(f.tables.placement_v3_sessions[0].is_synthetic).toBeUndefined();
  });

  it("loads most recent in-progress session", async () => {
    const f = fakeDb({
      placement_v3_sessions: [
        { id: "old", user_id: "user-1", flow_state: "in_progress", updated_at: "2026-05-20T10:00:00.000Z", language_pair: {}, metadata: {} },
        { id: "new", user_id: "user-1", flow_state: "in_progress", updated_at: "2026-05-20T11:00:00.000Z", language_pair: {}, metadata: {} },
      ],
    });
    const p = createPersistence(f.db, { now: () => "", newId: () => "" });
    expect((await p.loadLatestInProgress("user-1"))?.id).toBe("new");
  });

  it("inserts response rows", async () => {
    const f = fakeDb();
    const p = createPersistence(f.db, { now: () => "", newId: () => "" });
    await p.insertResponse({
      session_id: "session-1",
      task_index: 0,
      modality: "writing",
      prompt_id: "p1",
      prompt_text: "Prompt",
      user_response_text: "Answer",
      audio_storage_path: null,
      response_duration_ms: 100,
      ai_assessment: null,
      ai_assessment_version: null,
      graded_at: null,
      created_at: "2026-05-20T12:00:00.000Z",
    });
    expect(f.tables.placement_v3_responses).toHaveLength(1);
  });

  it("returns the existing response on a session/task uniqueness conflict", async () => {
    const existing = {
      id: "response-1",
      session_id: "session-1",
      task_index: 0,
      modality: "writing",
      prompt_id: "p1",
      prompt_text: "Prompt",
      user_response_text: "First answer",
      audio_storage_path: null,
      response_duration_ms: 100,
      ai_assessment: null,
      ai_assessment_version: null,
      graded_at: null,
      created_at: "2026-05-20T12:00:00.000Z",
    };
    const f = fakeDb({ placement_v3_responses: [existing] });
    const p = createPersistence(f.db, { now: () => "", newId: () => "" });

    const result = await p.insertResponse({
      ...existing,
      id: "response-duplicate",
      user_response_text: "Duplicate answer",
    });

    expect(result.inserted).toBe(false);
    expect(result.response).toMatchObject(existing);
    expect(f.tables.placement_v3_responses).toHaveLength(1);
  });

  it("upserts current profile and marks old profiles inactive", async () => {
    const f = fakeDb({
      placement_v3_profiles: [{ user_id: "user-1", session_id: "old", is_current: true }],
    });
    const p = createPersistence(f.db, { now: () => "", newId: () => "" });
    await p.markProfilesNotCurrent("user-1");
    expect(f.tables.placement_v3_profiles[0].is_current).toBe(false);
    const profile = await p.upsertProfile({
      user_id: "user-1",
      session_id: "session-1",
      cefr_overall: "A2",
      cefr_overall_confidence: 0.7,
      cefr_per_skill: {},
      l1_interference_flags: [],
      strengths: [],
      gaps: [],
      recommended_lessons: [],
      computed_at: "2026-05-20T12:00:00.000Z",
      is_current: true,
    } satisfies PlacementV3Profile);
    expect(profile.session_id).toBe("session-1");
  });

  it("serializes forensic metadata with stable key ordering", () => {
    const left = replaySafeSerialize({
      b: 2,
      a: { d: 4, c: 3 },
    });
    const right = replaySafeSerialize({
      a: { c: 3, d: 4 },
      b: 2,
    });

    expect(JSON.stringify(left)).toBe(JSON.stringify(right));
  });

  it("keeps equivalent-object hashes stable after sanitization", () => {
    const left = replaySafeSerialize({
      z: ["last"],
      a: { serviceRoleKey: "super-secret", c: 3 },
    });
    const right = replaySafeSerialize({
      a: { c: 3, serviceRoleKey: "different-secret" },
      z: ["last"],
    });

    expect(stableHash(left)).toBe(stableHash(right));
  });

  it("keeps rejected validation replay hashes stable while redacting hostile metadata", () => {
    const left = replaySafeSerialize({
      sequence: 7,
      type: "provider_event",
      metadata: {
        reason: "azure_auth_failed",
        authorization: "Bearer eyJabc.def.ghi",
        runtimeOrigin: "https://mercyblade.com",
        nested: {
          serviceRoleKey: "service-role-secret-a",
          access_token: "eyJaaa.bbb.ccc",
        },
      },
    });
    const right = replaySafeSerialize({
      metadata: {
        nested: {
          access_token: "eyJxxx.yyy.zzz",
          serviceRoleKey: "service-role-secret-b",
        },
        runtimeOrigin: "https://mercyblade.com",
        authorization: "Bearer eyJxxx.yyy.zzz",
        reason: "azure_auth_failed",
      },
      type: "provider_event",
      sequence: 7,
    });

    const serialized = JSON.stringify(left);
    expect(stableHash(left)).toBe(stableHash(right));
    expect(serialized).not.toContain("service-role-secret");
    expect(serialized).not.toContain("eyJabc");
    expect(serialized).not.toContain("eyJxxx");
  });

  it("keeps oversized and unicode-contaminated rejected metadata deterministic after redaction", () => {
    const makeRejected = (secret: string, order: "left" | "right") => {
      const metadata = {
        reason: "azure_auth_failed",
        unicodeReason: "azure_auth_failed＿fullwidth",
        malformedJsonFragment: "{\"token\":\"eyJaaa.bbb.ccc\"",
        payload: "x".repeat(8_192),
        nested: {
          password: secret,
          bearer: `Bearer ${secret}`,
          email: "learner@example.com",
        },
      };
      return order === "left"
        ? replaySafeSerialize({ metadata, sequence: 11, type: "provider_event" })
        : replaySafeSerialize({ type: "provider_event", sequence: 11, metadata: { ...metadata, nested: { ...metadata.nested } } });
    };

    const left = makeRejected("eyJleft.secret.value", "left");
    const right = makeRejected("eyJright.secret.value", "right");
    const serialized = JSON.stringify(left);

    expect(stableHash(left)).toBe(stableHash(right));
    expect(serialized).toContain("azure_auth_failed");
    expect(serialized).toContain("azure_auth_failed＿fullwidth");
    expect(serialized).not.toContain("eyJleft");
    expect(serialized).not.toContain("eyJright");
    expect(serialized).not.toContain("learner@example.com");
    expect(serialized).toContain("[email-redacted]");
    expect(serialized).toContain("[redacted]");
  });

  it("keeps conflicting rejected fallback reasons readable without redaction marker drift", () => {
    const authFailed = replaySafeSerialize({
      type: "fallback_event",
      metadata: {
        reason: "azure_auth_failed",
        previousReason: "azure_timeout",
        token: "eyJaaa.bbb.ccc",
      },
    });
    const timeout = replaySafeSerialize({
      metadata: {
        token: "eyJxxx.yyy.zzz",
        previousReason: "azure_auth_failed",
        reason: "azure_timeout",
      },
      type: "fallback_event",
    });

    expect(JSON.stringify(authFailed)).toContain("\"reason\":\"azure_auth_failed\"");
    expect(JSON.stringify(timeout)).toContain("\"reason\":\"azure_timeout\"");
    expect(JSON.stringify(authFailed)).toContain("\"token\":\"[redacted]\"");
    expect(JSON.stringify(timeout)).toContain("\"token\":\"[redacted]\"");
    expect(stableHash(authFailed)).not.toBe(stableHash(timeout));
  });

  it("keeps adversarial JSON edge cases distinct after canonicalization", () => {
    const sparse: unknown[] = [];
    sparse[2] = "x";
    const cases = [
      {},
      { a: undefined },
      { a: null },
      { a: sparse },
      { a: [undefined, undefined, "x"] },
      { a: new Date("2026-05-20T00:00:00.000Z") },
      { a: "2026-05-20T00:00:00.000Z" },
      { a: 1n },
      { a: "1" },
      { a: NaN },
      { a: Infinity },
    ].map((value) => stableHash(replaySafeSerialize(value)));

    expect(new Set(cases).size).toBe(cases.length);
  });

  it("preserves prototype-pollution payloads as inert forensic data", () => {
    const sanitized = replaySafeSerialize(
      JSON.parse('{"__proto__":{"polluted":true},"safe":1}'),
    );

    expect(JSON.stringify(sanitized)).toBe('{"__proto__":{"polluted":true},"safe":1}');
    expect(({} as { polluted?: boolean }).polluted).toBeUndefined();
  });

  it("redacts token-shaped values through nested arrays and circular paths", () => {
    const circular: Record<string, unknown> = {
      nested: [
        { serviceRoleKey: "service-secret" },
        "Bearer abc.def.ghi",
        "OPENAI_API_KEY=sk-1234567890abcdef",
        "https://storage.test/audio.wav?X-Amz-Signature=abc&expires=1",
      ],
      jwt: "eyJhbGciOi.fake.payload",
    };
    circular.self = circular;

    const serialized = JSON.stringify(replaySafeSerialize(circular));
    expect(serialized).not.toContain("service-secret");
    expect(serialized).not.toContain("abc.def.ghi");
    expect(serialized).not.toContain("sk-1234567890abcdef");
    expect(serialized).not.toContain("X-Amz-Signature=abc");
    expect(serialized).not.toContain("eyJhbGciOi.fake.payload");
    expect(serialized).toContain("[circular]");
  });

  it("bounds extreme metadata depth deterministically", () => {
    let metadata: Record<string, unknown> = { terminal: true };
    for (let i = 0; i < 80; i += 1) {
      metadata = { child: metadata };
    }

    const first = replaySafeSerialize(metadata);
    const second = replaySafeSerialize(metadata);
    expect(JSON.stringify(first)).toBe(JSON.stringify(second));
    expect(JSON.stringify(first)).toContain("[max-depth]");
  });

  it("redacts secret-shaped nested metadata before session persistence", async () => {
    const f = fakeDb();
    const p = createPersistence(f.db, {
      now: () => "2026-05-20T12:00:00.000Z",
      newId: () => "id-1",
    });
    const prompt = selectPrompt({ modality: "writing", targetLevel: "A2", responses: [] });
    const session = await p.createSession({
      id: "session-1",
      userId: "user-1",
      languagePair: { native: "vi", target: "en" },
      firstPrompt: prompt,
      now: "2026-05-20T12:00:00.000Z",
      totalTasks: 11,
    });

    await p.updateSession({
      ...session,
      metadata: {
        ...session.metadata,
        nested: {
          apiKey: "sk-1234567890abcdef",
          authorization: "Bearer abc.def.ghi",
          message: "email learner@example.com",
        },
      } as unknown as PlacementV3Session["metadata"],
    });

    const metadata = f.tables.placement_v3_sessions[0].metadata as Record<string, unknown>;
    const nested = metadata.nested as Record<string, unknown>;
    expect(nested.apiKey).toBe("[redacted]");
    expect(nested.authorization).toBe("[redacted]");
    expect(nested.message).toBe("email [email-redacted]");
  });

  it("omits object undefined metadata and serializes array undefined as null", async () => {
    const f = fakeDb();
    const p = createPersistence(f.db, {
      now: () => "2026-05-20T12:00:00.000Z",
      newId: () => "id-1",
    });
    const prompt = selectPrompt({ modality: "writing", targetLevel: "A2", responses: [] });
    const session = await p.createSession({
      id: "session-1",
      userId: "user-1",
      languagePair: { native: "vi", target: "en" },
      firstPrompt: prompt,
      now: "2026-05-20T12:00:00.000Z",
      totalTasks: 11,
    });

    await p.updateSession({
      ...session,
      metadata: {
        keep: "value",
        omitMe: undefined,
        nested: { keepNested: true, omitNested: undefined },
        list: [undefined, "x"],
      } as unknown as PlacementV3Session["metadata"],
    });

    const serialized = JSON.stringify(f.tables.placement_v3_sessions[0].metadata);
    expect(serialized).not.toContain("[undefined]");
    expect(serialized).not.toContain("omitMe");
    expect(serialized).not.toContain("omitNested");
    expect(f.tables.placement_v3_sessions[0].metadata).toMatchObject({
      keep: "value",
      nested: { keepNested: true },
      list: [null, "x"],
    });
  });

  it("prevents circular session metadata update failures", async () => {
    const f = fakeDb();
    const p = createPersistence(f.db, {
      now: () => "2026-05-20T12:00:00.000Z",
      newId: () => "id-1",
    });
    const prompt = selectPrompt({ modality: "writing", targetLevel: "A2", responses: [] });
    const session = await p.createSession({
      id: "session-1",
      userId: "user-1",
      languagePair: { native: "vi", target: "en" },
      firstPrompt: prompt,
      now: "2026-05-20T12:00:00.000Z",
      totalTasks: 11,
    });
    const circular: Record<string, unknown> = { ok: true };
    circular.self = circular;

    await expect(p.updateSession({
      ...session,
      metadata: circular as PlacementV3Session["metadata"],
    })).resolves.toMatchObject({
      metadata: { ok: true, self: "[circular]" },
    });
  });

  it("normalizes non-object session metadata to an empty object", async () => {
    const f = fakeDb({
      placement_v3_sessions: [
        {
          id: "session-1",
          user_id: "user-1",
          flow_state: "in_progress",
          updated_at: "2026-05-20T11:00:00.000Z",
          language_pair: {},
          metadata: "corrupt",
        },
      ],
    });
    const p = createPersistence(f.db, { now: () => "", newId: () => "" });

    await expect(p.loadSession("session-1", "user-1")).resolves.toMatchObject({
      metadata: {},
    });
  });

  it("returns stub recommendations while recommender branch is absent", async () => {
    const recs = await recommendLessons({
      user_id: "user-1",
      session_id: "session-1",
      cefr_overall: "B1",
      cefr_overall_confidence: 0.8,
      cefr_per_skill: {},
      l1_interference_flags: [],
      strengths: [],
      gaps: ["articles"],
      recommended_lessons: [],
      computed_at: "2026-05-20T12:00:00.000Z",
      is_current: true,
    });
    expect(recs).toHaveLength(3);
  });
});
