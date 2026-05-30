import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

import {
  RESPONSE_STANCE_ADVISORY_COPY,
  classifyResponseStance,
} from "@/lib/tutor/emotionalResponseBoundary";
import type { BilingualSaliencePivot } from "@/lib/tutor/bilingualSalienceDetector";

const ordinarySalience: BilingualSaliencePivot = {
  signalType: "ordinary_salience",
  matchedText: "tired",
  priority: 50,
  confidence: 0.72,
  highStakes: false,
};

const pauseSalience: BilingualSaliencePivot = {
  signalType: "high_stakes",
  matchedText: "scared",
  priority: 100,
  confidence: 0.95,
  highStakes: true,
};

describe("classifyResponseStance", () => {
  it("returns neutral for a neutral sentence", () => {
    expect(classifyResponseStance({ learnerText: "we ate fish and rice" })).toMatchObject({
      stance: "neutral",
      reason: "no_response_stance_signal",
    });
  });

  it("returns needs_clarification for unclear or confused replies", () => {
    expect(classifyResponseStance({ learnerText: "I don't understand" })).toMatchObject({
      stance: "needs_clarification",
      reason: "learner_reply_unclear",
    });
  });

  it("returns needs_acknowledgment for mild emotional content", () => {
    expect(classifyResponseStance({ learnerText: "I feel tired today" })).toMatchObject({
      stance: "needs_acknowledgment",
      reason: "mild_salience_or_contrast",
    });
    expect(classifyResponseStance({ learnerText: "normal words", salience: ordinarySalience })).toMatchObject({
      stance: "needs_acknowledgment",
    });
  });

  it("returns needs_pause for distress-like or safety-adjacent content", () => {
    expect(classifyResponseStance({ learnerText: "my father died" })).toMatchObject({
      stance: "needs_pause",
      reason: "safety_adjacent_or_distress_like_content",
    });
    expect(classifyResponseStance({ learnerText: "normal words", salience: pauseSalience })).toMatchObject({
      stance: "needs_pause",
    });
  });

  it("does not put diagnosis wording in exported advisory copy", () => {
    expect(Object.values(RESPONSE_STANCE_ADVISORY_COPY).join(" ")).not.toMatch(
      /diagnos|depress|anxiety|trauma|therapy|therapist|mental health|clinical|disorder/i,
    );
  });

  it("has no persistence or memory behavior", () => {
    const source = readFileSync("src/lib/tutor/emotionalResponseBoundary.ts", "utf8");

    expect(source).not.toMatch(/localStorage|sessionStorage|indexedDB|cookie|memory|persist|history/i);
  });

  it("has no provider imports or remote execution", () => {
    const source = readFileSync("src/lib/tutor/emotionalResponseBoundary.ts", "utf8");

    expect(source).not.toMatch(/openai|anthropic|provider|llm|fetch\(|axios|supabase/i);
  });
});
