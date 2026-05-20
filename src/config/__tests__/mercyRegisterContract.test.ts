/**
 * A80 — Mercy register regression contract.
 *
 * WHY THIS FILE EXISTS
 * --------------------
 * `mercyPersona.ts` (the canonical persona config) was *never* the file
 * #690 broke and #736 (A52) fixed. #690's strict male-teacher register
 * ("thầy"↔"em", "Mercy Host, a strict… teacher", the self-sabotaging
 * "của bạn" Good exemplar, and the calqued crisis copy) lived entirely
 * in the Deno edge functions:
 *
 *   supabase/functions/guide-assistant/index.ts
 *   supabase/functions/guide-english-helper/index.ts
 *   supabase/functions/_shared/crisisResponse.ts   (new in #736)
 *
 * Those files are outside the vitest reach and had ZERO guardrails, so
 * the 32 `mercyPersona.test.ts` smoke tests would all stay green if a
 * future agent re-introduced "thầy" — they only assert config shape +
 * UTF-8 survival, not register, gender, or the edge-prompt wording.
 *
 * This suite reads the three #736-touched edge files as source text and
 * locks the A52 wins. It uses the same fs-guardrail pattern already
 * established for migration / RLS contracts in this codebase
 * (e.g. src/lib/security/__tests__/legacyPublicPolicies.migration.test.ts).
 * Every assertion below is a #736 *delta*: it FAILS on the pre-#736
 * tree and PASSES on current main.
 */
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { describe, it, expect } from "vitest";

import {
  MERCY_PERSONA_CONFIG,
} from "../mercyPersona";

const here = dirname(fileURLToPath(import.meta.url));
// src/config/__tests__  ->  ../../../  ->  repo root
const fn = (p: string) =>
  resolve(here, "../../../supabase/functions", p);

const guideAssistant = readFileSync(fn("guide-assistant/index.ts"), "utf8");
const guideEnglishHelper = readFileSync(
  fn("guide-english-helper/index.ts"),
  "utf8",
);
const crisisResponsePath = fn("_shared/crisisResponse.ts");

describe("Mercy register contract — locks PR #736 (A52) revert of #690's thầy↔em register", () => {
  // 1. The exact A52 fix: the strict male-teacher instruction must never
  //    return, and the canonical persona config must stay informal so the
  //    edge contract has a source of truth to mirror.
  it("guide-assistant VI contract bans thầy/cô/em and the persona config stays informal-friendly", () => {
    // Pre-#736 instruction (gender-wrong, strict). Must be gone.
    expect(guideAssistant).not.toContain(
      'xưng "thầy" và gọi học viên là "em"',
    );
    // The explicit ban A52 introduced. Must be present.
    expect(guideAssistant).toContain(
      'Tự xưng "mình", gọi học viên bằng tên hoặc "bạn". TUYỆT ĐỐI không xưng "thầy"/"cô", không gọi học viên là "em", không dùng "tôi".',
    );
    // Canonical source of truth the edge contract is documented to follow.
    expect(MERCY_PERSONA_CONFIG.voice.formality).toBe("informal-friendly");
    expect(MERCY_PERSONA_CONFIG.voice.warmthLevel).toBe("warm");
    expect(MERCY_PERSONA_CONFIG.codeSwitch.preferredVNTitle).toBe("bạn");
  });

  // 2. System-prompt identity drift: "Mercy Host, a strict, kind teacher"
  //    -> warm female teacher. Catches a "cô"/strict/male revert at the
  //    identity line, and the lingering "Host" terminology.
  it("guide-assistant presents Mercy as a warm female teacher, not a strict 'Mercy Host'", () => {
    expect(guideAssistant).not.toContain("Mercy Host, a strict");
    expect(guideAssistant).toContain(
      "You are Mercy, a warm, encouraging English teacher for Vietnamese learners (a female teacher; never strict or distant).",
    );
  });

  // 3. The self-sabotaging "Good" exemplar + the thầy↔em output-contract
  //    comment. #690's "Good" example used "của bạn / bạn" repetition
  //    that the same contract banned — a prompt that contradicts itself.
  it("guide-assistant drops the thầy↔em contract comment and the self-sabotaging Good exemplar", () => {
    expect(guideAssistant).not.toContain("giọng thầy↔em");
    expect(guideAssistant).not.toContain(
      "/θ/ của bạn lên 25 điểm tuần này — chứng tỏ bạn đang luyện đúng cách.",
    );
    expect(guideAssistant).toContain("(giọng mình↔bạn, thân thiện)");
    expect(guideAssistant).toContain(
      "Good: 'Âm /θ/ tuần này lên 25 điểm — bạn đang luyện đúng hướng rồi đấy.'",
    );
  });

  // 4. Crisis-response wording drift. #736 created the shared file and
  //    rewrote the VI natively (not a calque of the EN). Guards both the
  //    safety copy and the female/informal register inside it.
  it("crisis SAFE_RESPONSE/SAFE_ENCOURAGEMENT VI is native informal copy, not the EN calque", () => {
    // Pre-#736 the file did not exist (copy was inlined, divergent, in
    // each function). Its absence fails this test cleanly.
    expect(existsSync(crisisResponsePath)).toBe(true);
    // Strip `//` comment lines so we assert on the COPY VALUES only —
    // the header comment legitimately mentions "thầy" while explaining
    // the ban, and we must not match that.
    const copyOnly = readFileSync(crisisResponsePath, "utf8")
      .split("\n")
      .filter((l) => !l.trimStart().startsWith("//"))
      .join("\n");

    // Pre-#736 guide-english-helper calque of "You deserve real, human
    // support" — a translated tail, not native VI. Must be gone.
    expect(copyOnly).not.toContain(
      "Bạn xứng đáng nhận được sự hỗ trợ trực tiếp, thật sự.",
    );
    // Pre-#736 guide-english-helper encouragement: redundant
    // "bản thân bạn" calque of "take care of yourself". Must be gone.
    expect(copyOnly).not.toContain("Hãy chăm sóc bản thân bạn nhé.");

    // The native A52 wordings must be present and in-register.
    expect(copyOnly).toContain(
      "Bạn không phải tự mình xoay xở chuyện này đâu.",
    );
    expect(copyOnly).toContain("Bạn nhớ chăm sóc bản thân nhé.");
    // Female/informal register inside the safety copy itself: never the
    // male term, never the strict-formal "quý vị".
    expect(copyOnly).not.toContain("thầy");
    expect(copyOnly).not.toContain("quý vị");
  });

  // 5. Single source of truth. Pre-#736 each function declared its own
  //    `const SAFE_RESPONSE` with DIFFERENT VI wording for the SAME
  //    safety event. A future agent re-inlining one re-opens the drift.
  it("both guide functions import crisis copy from the one _shared source, no local re-declaration", () => {
    expect(guideAssistant).toContain(
      'from "../_shared/crisisResponse.ts"',
    );
    expect(guideEnglishHelper).toContain(
      'from "../_shared/crisisResponse.ts"',
    );
    // The pre-#736 local declaration that caused the divergence.
    expect(guideAssistant).not.toMatch(/const\s+SAFE_RESPONSE\s*=\s*\{/);
    expect(guideEnglishHelper).not.toMatch(/const\s+SAFE_RESPONSE\s*=\s*\{/);
  });
});
