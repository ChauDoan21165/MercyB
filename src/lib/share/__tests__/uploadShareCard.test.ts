import { describe, it, expect } from "vitest";

import { derivePath } from "../uploadShareCard";

describe("derivePath", () => {
  it("starts with the user-id prefix expected by the storage RLS policy", () => {
    const path = derivePath("11111111-1111-1111-1111-111111111111");
    expect(path.startsWith("11111111-1111-1111-1111-111111111111/")).toBe(true);
  });

  it("ends with .png", () => {
    expect(derivePath("u").endsWith(".png")).toBe(true);
  });

  it("contains a timestamp + random suffix to prevent collisions on rapid re-shares", () => {
    const a = derivePath("u1");
    const b = derivePath("u1");
    expect(a).not.toBe(b);
  });

  it("never includes path traversal characters", () => {
    const path = derivePath("u1");
    expect(path).not.toContain("..");
    expect(path).not.toContain("\\");
  });
});
