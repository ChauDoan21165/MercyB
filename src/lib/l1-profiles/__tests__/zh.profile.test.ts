import { describe, expect, it } from "vitest";

import { chineseCorrectionRules } from "../../tutor/correctionRules/zh.js";
import { validateL1Profile } from "../validate.js";
import { zhL1Profile } from "../zh.js";

describe("zhL1Profile shell", () => {
  it("identifies the Vietnamese learner to Chinese target pair", () => {
    expect(zhL1Profile.meta.nativeLangCode).toBe("vi");
    expect(zhL1Profile.meta.targetLangCode).toBe("zh");
  });

  it("passes the shared structural validator", () => {
    const result = validateL1Profile(zhL1Profile);

    expect(result.errors).toEqual([]);
  });

  it("uses the existing ZH correction rules as its functional consumer", () => {
    expect(zhL1Profile.functionalConsumer.correctionRules).toBe(
      chineseCorrectionRules,
    );
    expect(zhL1Profile.functionalConsumer.correctionRulesPath).toBe(
      "src/lib/tutor/correctionRules/zh.ts",
    );
  });

  it("does not declare detector or prompt wiring", () => {
    expect("detector" in zhL1Profile.functionalConsumer).toBe(false);
    expect("prompt" in zhL1Profile.functionalConsumer).toBe(false);
  });
});
