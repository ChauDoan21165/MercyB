import { describe, it, expect, vi, beforeEach } from "vitest";

// Inline supabase mock — every call records its inputs on the spy so the
// tests can assert exactly what conversationClient sent. We reset the
// recorded state between tests to avoid bleed.
type Recorded = {
  table: string | null;
  insertPayload: unknown;
  updatePayload: unknown;
  selectArgs: string[];
  deleteCalled: boolean;
  eqArgs: Array<[string, unknown]>;
  orderArgs: Array<[string, { ascending: boolean }]>;
  singleCalled: boolean;
};

const recorded: Recorded = resetRecorded();

function resetRecorded(): Recorded {
  return {
    table: null,
    insertPayload: undefined,
    updatePayload: undefined,
    selectArgs: [],
    deleteCalled: false,
    eqArgs: [],
    orderArgs: [],
    singleCalled: false,
  };
}

let mockResultData: unknown = null;
let mockResultError: unknown = null;

function chain() {
  const c: any = {
    insert: (payload: unknown) => {
      recorded.insertPayload = payload;
      return c;
    },
    update: (payload: unknown) => {
      recorded.updatePayload = payload;
      return c;
    },
    select: (cols?: string) => {
      if (cols) recorded.selectArgs.push(cols);
      return c;
    },
    delete: () => {
      recorded.deleteCalled = true;
      return c;
    },
    eq: (col: string, val: unknown) => {
      recorded.eqArgs.push([col, val]);
      return c;
    },
    order: (col: string, opts: { ascending: boolean }) => {
      recorded.orderArgs.push([col, opts]);
      return Promise.resolve({ data: mockResultData, error: mockResultError });
    },
    single: () => {
      recorded.singleCalled = true;
      return Promise.resolve({ data: mockResultData, error: mockResultError });
    },
    then: (onFulfilled: (v: unknown) => unknown) =>
      Promise.resolve({ data: mockResultData, error: mockResultError }).then(onFulfilled),
  };
  return c;
}

vi.mock("@/lib/supabaseClient", () => ({
  supabase: {
    from: (table: string) => {
      recorded.table = table;
      return chain();
    },
  },
}));

import {
  appendMessage,
  createConversation,
  deleteConversation,
  getMessagesForConversation,
  listMyConversations,
  renameConversation,
} from "../conversationClient";

beforeEach(() => {
  Object.assign(recorded, resetRecorded());
  mockResultData = null;
  mockResultError = null;
});

describe("createConversation", () => {
  it("inserts a row with user_id + title and maps the result", async () => {
    mockResultData = {
      id: "conv-1",
      user_id: "user-A",
      title: "Practice talking",
      created_at: "2026-04-24T10:00:00Z",
      last_message_at: "2026-04-24T10:00:00Z",
    };

    const result = await createConversation("user-A", "Practice talking");

    expect(recorded.table).toBe("mercy_conversations");
    expect(recorded.insertPayload).toEqual({
      user_id: "user-A",
      title: "Practice talking",
    });
    expect(recorded.singleCalled).toBe(true);
    expect(result).toEqual({
      id: "conv-1",
      userId: "user-A",
      title: "Practice talking",
      createdAt: "2026-04-24T10:00:00Z",
      lastMessageAt: "2026-04-24T10:00:00Z",
    });
  });

  it("inserts with null title when none provided", async () => {
    mockResultData = {
      id: "conv-2",
      user_id: "user-A",
      title: null,
      created_at: "2026-04-24T10:00:00Z",
      last_message_at: "2026-04-24T10:00:00Z",
    };
    await createConversation("user-A");
    expect((recorded.insertPayload as { title: unknown }).title).toBeNull();
  });

  it("throws when supabase returns an error", async () => {
    mockResultError = { message: "permission denied" };
    await expect(createConversation("user-A", "x")).rejects.toEqual({
      message: "permission denied",
    });
  });
});

describe("listMyConversations", () => {
  it("queries by user_id and orders by last_message_at desc", async () => {
    mockResultData = [
      {
        id: "c1",
        user_id: "u1",
        title: "First",
        created_at: "2026-04-23T08:00:00Z",
        last_message_at: "2026-04-24T09:00:00Z",
      },
      {
        id: "c2",
        user_id: "u1",
        title: null,
        created_at: "2026-04-22T08:00:00Z",
        last_message_at: "2026-04-22T09:00:00Z",
      },
    ];

    const result = await listMyConversations("u1");

    expect(recorded.table).toBe("mercy_conversations");
    expect(recorded.eqArgs).toContainEqual(["user_id", "u1"]);
    expect(recorded.orderArgs).toContainEqual([
      "last_message_at",
      { ascending: false },
    ]);
    expect(result).toHaveLength(2);
    expect(result[0]).toMatchObject({ id: "c1", title: "First" });
    expect(result[1]).toMatchObject({ id: "c2", title: null });
  });

  it("returns [] when supabase returns null data", async () => {
    mockResultData = null;
    const result = await listMyConversations("u1");
    expect(result).toEqual([]);
  });
});

describe("getMessagesForConversation", () => {
  it("queries messages by conversation_id ordered by created_at asc", async () => {
    mockResultData = [
      {
        id: "m1",
        conversation_id: "c1",
        role: "user",
        content: "Hello",
        vi_translation: null,
        created_at: "2026-04-24T09:00:00Z",
      },
      {
        id: "m2",
        conversation_id: "c1",
        role: "mercy",
        content: "Hi! How can I help?",
        vi_translation: "Chào bạn!",
        created_at: "2026-04-24T09:00:01Z",
      },
    ];

    const result = await getMessagesForConversation("c1");

    expect(recorded.table).toBe("mercy_messages");
    expect(recorded.eqArgs).toContainEqual(["conversation_id", "c1"]);
    expect(recorded.orderArgs).toContainEqual([
      "created_at",
      { ascending: true },
    ]);
    expect(result).toHaveLength(2);
    expect(result[0].role).toBe("user");
    expect(result[1].role).toBe("mercy");
    expect(result[1].viTranslation).toBe("Chào bạn!");
  });
});

describe("appendMessage", () => {
  it("inserts a user message + bumps conversation last_message_at", async () => {
    mockResultData = {
      id: "m99",
      conversation_id: "c1",
      role: "user",
      content: "How do I say 'hello'?",
      vi_translation: null,
      created_at: "2026-04-24T10:00:00Z",
    };

    const result = await appendMessage("c1", "user", "How do I say 'hello'?");

    expect(recorded.insertPayload).toEqual({
      conversation_id: "c1",
      role: "user",
      content: "How do I say 'hello'?",
      vi_translation: null,
    });
    // The last `from()` call should be the parent recency bump.
    expect(recorded.table).toBe("mercy_conversations");
    expect(recorded.updatePayload).toMatchObject({
      last_message_at: expect.any(String),
    });
    expect(result.id).toBe("m99");
  });

  it("stores vi_translation when provided", async () => {
    mockResultData = {
      id: "m100",
      conversation_id: "c1",
      role: "mercy",
      content: "Hello!",
      vi_translation: "Xin chào!",
      created_at: "2026-04-24T10:00:01Z",
    };

    await appendMessage("c1", "mercy", "Hello!", "Xin chào!");

    expect(recorded.insertPayload).toMatchObject({
      vi_translation: "Xin chào!",
    });
  });

  it("throws when message insert fails", async () => {
    mockResultError = { message: "violates check constraint" };
    await expect(
      appendMessage("c1", "user", "x"),
    ).rejects.toMatchObject({ message: "violates check constraint" });
  });
});

describe("deleteConversation", () => {
  it("calls delete with eq id", async () => {
    mockResultData = null;
    await deleteConversation("c1");
    expect(recorded.table).toBe("mercy_conversations");
    expect(recorded.deleteCalled).toBe(true);
    expect(recorded.eqArgs).toContainEqual(["id", "c1"]);
  });

  it("throws on error", async () => {
    mockResultError = { message: "not found" };
    await expect(deleteConversation("c1")).rejects.toMatchObject({
      message: "not found",
    });
  });
});

describe("renameConversation", () => {
  it("updates title where id matches", async () => {
    mockResultData = null;
    await renameConversation("c1", "New title");
    expect(recorded.updatePayload).toEqual({ title: "New title" });
    expect(recorded.eqArgs).toContainEqual(["id", "c1"]);
  });
});
