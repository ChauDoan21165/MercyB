import { describe, it, expect } from "vitest";
import { __test } from "../feedbackTriageClient";

describe("toRow mapper", () => {
  it("maps a fully-populated row", () => {
    const r = __test.toRow({
      id: "f1",
      user_id: "u1",
      message: "Audio is broken",
      category: "general",
      priority: "normal",
      status: "new",
      sentiment: "negative",
      sentiment_tags: ["audio_quality", "bug"],
      admin_status: "triaged",
      admin_notes: "Reproduced in Chrome",
      created_at: "2026-04-25T10:00:00Z",
    });
    expect(r).toEqual({
      id: "f1",
      userId: "u1",
      message: "Audio is broken",
      category: "general",
      priority: "normal",
      status: "new",
      sentiment: "negative",
      sentimentTags: ["audio_quality", "bug"],
      adminStatus: "triaged",
      adminNotes: "Reproduced in Chrome",
      createdAt: "2026-04-25T10:00:00Z",
    });
  });

  it("clamps invalid sentiment to null", () => {
    expect(__test.toRow({ sentiment: "weird" }).sentiment).toBeNull();
    expect(__test.toRow({}).sentiment).toBeNull();
  });

  it("clamps invalid admin_status to 'new'", () => {
    expect(__test.toRow({ admin_status: "wat" }).adminStatus).toBe("new");
    expect(__test.toRow({}).adminStatus).toBe("new");
  });

  it("treats non-array sentiment_tags as empty", () => {
    expect(__test.toRow({ sentiment_tags: null }).sentimentTags).toEqual([]);
    expect(__test.toRow({ sentiment_tags: "audio" }).sentimentTags).toEqual([]);
  });

  it("preserves null user_id (anonymous feedback)", () => {
    expect(__test.toRow({ user_id: null }).userId).toBeNull();
  });
});
