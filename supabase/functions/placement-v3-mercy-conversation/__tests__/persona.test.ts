import { describe, expect, it } from "vitest";
import { containsPersonaViolation, enforcePersona, openingTurn, wrapTurn } from "../mercyPersona";
import { personaSamples } from "./fixtures/personaSamples";

describe("Mercy persona", () => {
  it("never grades aloud after enforcement", () => {
    const text = enforcePersona("Your CEFR is B1 and your score is good.", "B1", "probe");
    expect(containsPersonaViolation(text)).toBe(false);
  });

  it("always gives a warm closing", () => {
    expect(wrapTurn().text).toMatch(/Thank you/);
    expect(wrapTurn().shouldEndSession).toBe(true);
  });

  it("shows cultural awareness in opening", () => {
    expect(openingTurn().text).toMatch(/Vietnam/);
  });

  it("allows VI code-switch only when appropriate", () => {
    for (const sample of personaSamples) {
      const hasVi = /[ăâêôơưđáàảãạấầẩẫậắằẳẵặéèẻẽẹếềểễệíìỉĩịóòỏõọốồổỗộớờởỡợúùủũụứừửữựýỳỷỹỵ]/i.test(sample.text);
      if (hasVi) expect(sample.viAllowed).toBe(true);
    }
  });

  it("strips Vietnamese at B1+", () => {
    const text = enforcePersona("Em trả lời ngắn thôi. What do you think?", "B2", "probe");
    expect(text).not.toMatch(/Em trả lời/);
  });
});
