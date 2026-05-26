// Pure-helper unit tests for parseItemId / buildItemId. The route
// `/teacher/review/:itemId` uses the encoding `<content_type>:<content_id>`,
// so a regression here breaks the link from ReviewQueue → ReviewItem.

import { describe, expect, it } from "vitest";

import { buildItemId, parseItemId } from "../types";

describe("parseItemId / buildItemId", () => {
  it("round-trips a standard id", () => {
    const itemId = buildItemId("ielts", "ielts_speaking_part1_hometown");
    expect(itemId).toBe("ielts:ielts_speaking_part1_hometown");
    expect(parseItemId(itemId)).toEqual({
      contentType: "ielts",
      contentId: "ielts_speaking_part1_hometown",
    });
  });

  it("handles content_id with colons in the suffix", () => {
    // First colon is the separator; the rest stays in the content_id.
    expect(parseItemId("room:vip6:advanced:topic")).toEqual({
      contentType: "room",
      contentId: "vip6:advanced:topic",
    });
  });

  it("rejects unknown content types", () => {
    expect(parseItemId("bogus:anything")).toBeNull();
  });

  it("rejects malformed inputs", () => {
    expect(parseItemId("")).toBeNull();
    expect(parseItemId("ielts:")).toBeNull();
    expect(parseItemId(":foo")).toBeNull();
    expect(parseItemId("noseparator")).toBeNull();
  });
});
