import { describe, expect, it } from "vitest";
import { selectPrompt } from "../modality.ts";
import { createPersistence, recommendLessons } from "../persistence.ts";
import type { PlacementV3Profile } from "../types.ts";

type Row = Record<string, unknown>;
type TableName = "placement_v3_sessions" | "placement_v3_responses" | "placement_v3_profiles";

class FakeQuery {
  private rows: Row[];
  private filters: Array<[string, unknown]> = [];
  private insertValue: Row | null = null;
  private updateValue: Row | null = null;
  private upsertValue: Row | null = null;
  private orderColumn: string | null = null;
  private ascending = true;
  private limitCount: number | null = null;

  constructor(rows: Row[]) {
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
      if (
        this.rows.some((row) =>
          row.session_id === this.insertValue?.session_id &&
          row.task_index === this.insertValue?.task_index
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
      this.rows.push(this.insertValue);
      return { data: this.insertValue, error: null };
    }
    if (this.upsertValue) {
      const idx = this.rows.findIndex(
        (r) =>
          r.user_id === this.upsertValue?.user_id &&
          r.session_id === this.upsertValue?.session_id,
      );
      if (idx >= 0) this.rows[idx] = { ...this.rows[idx], ...this.upsertValue };
      else this.rows.push(this.upsertValue);
      return { data: this.upsertValue, error: null };
    }
    if (this.updateValue) {
      const row = this.resultRows()[0];
      if (row) Object.assign(row, this.updateValue);
      return { data: row ?? null, error: null };
    }
    return { data: this.resultRows()[0] ?? null, error: null };
  }

  then(resolve: (value: { data: unknown; error: null }) => unknown) {
    if (this.updateValue) {
      for (const row of this.resultRows()) Object.assign(row, this.updateValue);
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

function fakeDb(seed: Partial<Record<TableName, Row[]>> = {}) {
  const tables: Record<TableName, Row[]> = {
    placement_v3_sessions: seed.placement_v3_sessions ?? [],
    placement_v3_responses: seed.placement_v3_responses ?? [],
    placement_v3_profiles: seed.placement_v3_profiles ?? [],
  };
  return {
    tables,
    db: {
      from(table: string) {
        return new FakeQuery(tables[table as TableName]);
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
