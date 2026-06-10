// @vitest-environment jsdom
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  getCaptureConsentKey,
  hasCaptureConsent,
  hasCaptureConsentDecision,
  setCaptureConsent,
} from "@/lib/conversationCapture/captureConsent";
import { scoreConversationTurn } from "@/lib/pronunciation/conversationPronunciation";
import {
  CONVERSATION_AI_MAX_TURNS,
  buildConversationAiRequestBody,
  sendConversationAiTurn,
  type SendConversationAiTurnInput,
} from "@/lib/tutor/conversationAiClient";
import {
  RECENT_QUESTION_WINDOW,
  TOPIC_MIN_TURNS,
  decideConversationTurnPolicy,
} from "@/lib/tutor/conversationTurnPolicy";
import {
  abstentionRedirectFromPronunciation,
  buildAbstentionRedirect,
  type AbstentionTrigger,
} from "@/lib/tutor/conversationWarmth";
import { SPEAK_TOPIC_LIBRARY } from "@/lib/tutor/speakTopicLibrary";
import { VIETLISH_CORPUS } from "@/lib/tutor/vietlishCorpus";

const repoRoot = process.cwd();
const tutorRoot = join(repoRoot, "src", "lib", "tutor");

type SourceContract = {
  rel: string;
  label: string;
  patterns: readonly RegExp[];
};

const SOURCE_CONTRACTS: readonly SourceContract[] = [
  {
    rel: "conversationPromptTemplates.ts",
    label: "prompt templates include topic, Vietlish, warmth, premium gate, and 50-turn cap context",
    patterns: [
      /SPEAK_TOPIC_LIBRARY|SpeakTopic/i,
      /VIETLISH_CORPUS|conversationVietlishContext/i,
      /warmthPatterns|conversationWarmth/i,
      /premium/i,
      /\b50\b|MAX_.*TURNS/i,
      /vi(?:etnamese)?[- ]?primary|Tiếng Việt|Vietnamese/i,
    ],
  },
  {
    rel: "conversationVietlishContext.ts",
    label: "Vietlish selector injects compact relevant examples without duplicates",
    patterns: [
      /VIETLISH_CORPUS/,
      /frequency|high/i,
      /scenario|topic/i,
      /learner/i,
      /max|limit|slice/i,
      /Set<|new Set|dedupe|duplicate/i,
    ],
  },
  {
    rel: "conversationTurnPolicy.ts",
    label: "turn policy preserves topic continuity, pivots on learner input, and avoids repetition",
    patterns: [
      /4\+?|four|MIN_.*TURNS|TOPIC_.*TURNS/i,
      /recent/i,
      /repetition|repeat/i,
      /pivot/i,
      /learner/i,
      /off[- ]?topic|redirect/i,
    ],
  },
  {
    rel: "conversationWarmth.ts",
    label: "warmth helper is VN-calibrated and always redirects after abstention",
    patterns: [
      /warmthPatterns/,
      /l1InterferenceNotes|interference/i,
      /low[- ]?shame|shame/i,
      /face[- ]?saving|identity|register/i,
      /abstain|uncertain|low_confidence|null/i,
      /redirect|nextPrompt|practice/i,
      /Tiếng Việt|Vietnamese|vi/i,
    ],
  },
  {
    rel: "conversationPronunciationAdapter.ts",
    label: "pronunciation adapter scores only real learner audio and never fabricates a percent",
    patterns: [
      /scoreConversationTurn/,
      /Blob/,
      /\.size|size\s*>/,
      /step7Enabled/,
      /no_audio|overallScore:\s*null/,
      /modelAudio|source|learner/i,
    ],
  },
  {
    rel: "conversationTelemetry.ts",
    label: "telemetry gates capture by consent and retention by CONVERSATION_RETENTION_HOOKS",
    patterns: [
      /startSession/,
      /logTurn/,
      /endSession/,
      /hasCaptureConsent/,
      /getEncouragementForTurn/,
      /awardConversationTurnXP/,
      /CONVERSATION_RETENTION_HOOKS/,
      /sessionDate|startedAt|date/i,
      /turnCount|scenario|topic/i,
    ],
  },
  {
    rel: "conversationAiClient.ts",
    label: "AI client uses /api/mercy-ai with premium gate, model intent, cap, and Vietnamese fallback",
    patterns: [
      /\/api\/mercy-ai/,
      /gpt-4o-mini/,
      /gpt-4o/,
      /premium/i,
      /\b50\b|turnCap|MAX_.*TURNS/i,
      /fallback|fail/i,
      /Không|Xin|thử|lại|Vietnamese|Tiếng Việt/i,
    ],
  },
];

beforeEach(() => {
  window.localStorage.clear();
});

function readTutorSource(rel: string): string | null {
  const path = join(tutorRoot, rel);
  return existsSync(path) ? readFileSync(path, "utf8") : null;
}

describe("conversation integration contracts", () => {
  it("keeps the C2 consent gate fail-closed and opt-in only", () => {
    expect(getCaptureConsentKey()).toBe("mb-capture-consent");
    expect(hasCaptureConsent()).toBe(false);
    expect(hasCaptureConsentDecision()).toBe(false);

    setCaptureConsent(false);
    expect(hasCaptureConsent()).toBe(false);
    expect(hasCaptureConsentDecision()).toBe(true);

    setCaptureConsent(true);
    expect(hasCaptureConsent()).toBe(true);
    expect(hasCaptureConsentDecision()).toBe(true);

    window.localStorage.setItem(getCaptureConsentKey(), "yes");
    expect(hasCaptureConsent()).toBe(false);
  });

  it("keeps C1 pronunciation honest for text-only and empty-audio turns", async () => {
    const scoreImpl = vi.fn();

    const noAudio = await scoreConversationTurn({
      audioBlob: null,
      target: "I would like to open a bank account.",
      step7Enabled: true,
      scoreImpl,
    });
    expect(noAudio).toMatchObject({
      provider: "azure",
      mode: "english-pronunciation-conversation",
      overallScore: null,
      quality: "no_audio",
      shouldAskRetry: true,
    });

    const emptyAudio = await scoreConversationTurn({
      audioBlob: new Blob([]),
      target: "I would like to open a bank account.",
      step7Enabled: true,
      scoreImpl,
    });
    expect(emptyAudio.overallScore).toBeNull();
    expect(emptyAudio.quality).toBe("no_audio");
    expect(scoreImpl).not.toHaveBeenCalled();
  });

  it("has topic metadata and Vietlish examples available for prompt grounding", () => {
    const topicsWithWarmth = SPEAK_TOPIC_LIBRARY.filter((topic) => {
      const extended = topic as typeof topic & {
        scenarioDescription?: string;
        aiRoleDefinition?: string;
        conversationDirections?: readonly string[];
        warmthPatterns?: readonly string[];
      };
      return (
        (extended.scenarioDescription?.length ?? 0) > 40 &&
        (extended.aiRoleDefinition?.length ?? 0) > 40 &&
        (extended.conversationDirections?.length ?? 0) >= 5 &&
        (extended.warmthPatterns?.length ?? 0) >= 3 &&
        (topic.l1InterferenceNotes?.length ?? 0) >= 2
      );
    });

    expect(topicsWithWarmth.length).toBeGreaterThanOrEqual(6);
    expect(topicsWithWarmth.some((topic) => /ngân hàng|bệnh nhân|móng|nhà hàng/i.test(topic.labelVi))).toBe(true);
    expect(VIETLISH_CORPUS.length).toBeGreaterThanOrEqual(350);
    expect(new Set(VIETLISH_CORPUS.map((entry) => entry.vietlish.toLowerCase())).size).toBe(
      VIETLISH_CORPUS.length,
    );
    expect(VIETLISH_CORPUS.some((entry) => entry.frequency === "high" && entry.context.length > 0)).toBe(true);
  });
});

describe("conversation A2-A8 source contracts", () => {
  for (const contract of SOURCE_CONTRACTS) {
    const source = readTutorSource(contract.rel);
    if (!source) {
      it.todo(`${contract.rel}: ${contract.label}`);
      continue;
    }

    it(`${contract.rel}: ${contract.label}`, () => {
      const missing = contract.patterns
        .filter((pattern) => !pattern.test(source))
        .map((pattern) => pattern.toString());

      expect(missing).toEqual([]);
    });
  }
});

// ---------------------------------------------------------------------------
// D6 contract wall: behavioral contracts the live conversation depends on.
// These import the real engine functions (A1-owned, never edited here) and
// lock their product invariants — turn policy, entitlement/turn-cap gate,
// capture-consent, and abstention redirect — at the integration boundary.
// ---------------------------------------------------------------------------

describe("conversation turn-policy contract", () => {
  const baseTurn = {
    learnerText: "I usually drink iced milk coffee in the morning.",
    currentTopicId: "topic-coffee",
    topicLabel: "Ordering coffee",
    turnsOnTopic: 1,
  };

  it("exposes the documented topic-depth and anti-repetition constants", () => {
    expect(TOPIC_MIN_TURNS).toBe(4);
    expect(RECENT_QUESTION_WINDOW).toBe(8);
  });

  it("redirects (never dead-ends) when confidence is low / abstaining", () => {
    const decision = decideConversationTurnPolicy({ ...baseTurn, abstain: true });

    expect(decision.action).toBe("redirect_off_topic");
    expect(decision.reason).toBe("abstain_redirect_no_dead_end");
    expect(decision.promptInstruction).toContain("Never dead-end");
    expect(decision.promptInstruction).toContain("never guess");
    expect(decision.promptInstruction.trim().length).toBeGreaterThan(0);
  });

  it("pivots onto the learner's own words and resets the topic depth counter", () => {
    const decision = decideConversationTurnPolicy(baseTurn);

    expect(decision.action).toBe("pivot_on_learner");
    expect(decision.reason).toBe("pivot_on_learner_input");
    expect(decision.turnsOnTopic).toBe(0);
    expect(decision.promptInstruction.toLowerCase()).toContain("follow their own words");
  });

  it("appends an anti-repetition guard listing only the most recent questions", () => {
    const recentQuestions = Array.from({ length: 10 }, (_, i) => `Recent question number ${i + 1}?`);
    const decision = decideConversationTurnPolicy({ ...baseTurn, recentQuestions });

    expect(decision.promptInstruction).toContain("Avoid repetition");
    // Newest RECENT_QUESTION_WINDOW (8) questions are guarded; the oldest two are dropped.
    expect(decision.promptInstruction).toContain("Recent question number 10?");
    expect(decision.promptInstruction).toContain("Recent question number 3?");
    expect(decision.promptInstruction).not.toContain("Recent question number 1?");
    expect(decision.promptInstruction).not.toContain("Recent question number 2?");
  });
});

describe("conversation entitlement / turn-cap contract", () => {
  const baseInput: SendConversationAiTurnInput = {
    scenarioId: "topic-coffee",
    learnerText: "Two coffees, less ice please.",
    messages: [{ role: "learner", text: "Two coffees, less ice please." }],
    promptMetadata: { scenarioId: "topic-coffee" } as SendConversationAiTurnInput["promptMetadata"],
    entitlement: { isPremium: true },
    turnCap: { turnCount: 3 },
  };

  it("passes the premium flag honestly and computes the remaining turn budget", () => {
    const body = buildConversationAiRequestBody({ ...baseInput });

    expect(body.entitlement.isPremium).toBe(true);
    expect(body.maxTurns).toBe(CONVERSATION_AI_MAX_TURNS);
    expect(body.turnCount).toBe(3);
    expect(body.turnCap.remaining).toBe(CONVERSATION_AI_MAX_TURNS - 3);
  });

  it("coerces a missing/non-boolean premium flag to false and never goes negative on remaining", () => {
    const body = buildConversationAiRequestBody({
      ...baseInput,
      entitlement: { isPremium: undefined as unknown as boolean },
      turnCap: { turnCount: -5, maxTurns: 10 },
    });

    expect(body.entitlement.isPremium).toBe(false);
    expect(body.turnCount).toBe(0); // negative sanitized
    expect(body.turnCap.remaining).toBe(10);
  });

  it("fails closed at the local turn cap without calling the network, in Vietnamese first", async () => {
    const fetcher = vi.fn<typeof fetch>();
    const result = await sendConversationAiTurn({
      ...baseInput,
      turnCap: { turnCount: CONVERSATION_AI_MAX_TURNS, maxTurns: CONVERSATION_AI_MAX_TURNS },
      fetcher,
    });

    expect(fetcher).not.toHaveBeenCalled();
    expect(result.ok).toBe(false);
    expect(result.fallback).toBe(true);
    expect(result.provider).toBe("local-fallback");
    if (!result.ok) {
      expect(result.reason).toBe("cost_cap");
      // Vietnamese-primary copy: the English half is introduced by an "English:" marker.
      expect(result.reply.indexOf("English:")).toBeGreaterThan(0);
    }
  });
});

describe("conversation capture-consent contract", () => {
  it("is fail-closed and opt-in: no stored choice means no capture and no decision", () => {
    expect(getCaptureConsentKey()).toBe("mb-capture-consent");
    expect(hasCaptureConsent()).toBe(false);
    expect(hasCaptureConsentDecision()).toBe(false);
  });

  it("separates a recorded decline from a grant so a learner is never re-prompted", () => {
    setCaptureConsent(false);
    expect(hasCaptureConsent()).toBe(false);
    expect(hasCaptureConsentDecision()).toBe(true);
  });

  it("treats any non-'true' stored value as no-consent and no-decision", () => {
    window.localStorage.setItem(getCaptureConsentKey(), "garbage");
    expect(hasCaptureConsent()).toBe(false);
    expect(hasCaptureConsentDecision()).toBe(false);
  });
});

describe("conversation abstention-redirect contract", () => {
  const triggers: AbstentionTrigger[] = [
    "no_audio",
    "low_confidence_pronunciation",
    "scoring_unavailable",
    "uncertain_interference",
    "uncertain_vietlish",
  ];

  it("always returns an honest bilingual acknowledgment with no fabricated number, plus a concrete next prompt", () => {
    for (const trigger of triggers) {
      const redirect = buildAbstentionRedirect({ trigger });

      expect(redirect.vi.length).toBeGreaterThan(0);
      expect(redirect.en.length).toBeGreaterThan(0);
      // Never surface a guessed score: the acknowledgment carries no digits.
      expect(/\d/.test(redirect.vi)).toBe(false);
      expect(/\d/.test(redirect.en)).toBe(false);
      // The redirect must keep the conversation alive with a real next prompt.
      expect(redirect.nextPrompt.vi.length).toBeGreaterThan(0);
      expect(redirect.nextPrompt.en.length).toBeGreaterThan(0);
    }
  });

  it("uses a caller-supplied next prompt verbatim when provided", () => {
    const suggestedNextPrompt = { vi: "Bạn kể tiếp về buổi sáng nhé?", en: "Tell me more about your morning?" };
    const redirect = buildAbstentionRedirect({ trigger: "no_audio", suggestedNextPrompt });

    expect(redirect.nextPrompt).toEqual(suggestedNextPrompt);
  });

  it("abstains on a null or low-confidence pronunciation score but renders a solid one", () => {
    expect(
      abstentionRedirectFromPronunciation({ overallScore: 88, quality: "ok", confidence: "ok" }),
    ).toBeNull();

    const nullScore = abstentionRedirectFromPronunciation({
      overallScore: null,
      quality: "ok",
      confidence: "ok",
    });
    expect(nullScore?.trigger).toBe("low_confidence_pronunciation");
    expect(nullScore?.nextPrompt.vi.length).toBeGreaterThan(0);

    const noAudio = abstentionRedirectFromPronunciation({
      overallScore: null,
      quality: "no_audio",
      confidence: "ok",
    });
    expect(noAudio?.trigger).toBe("no_audio");
  });
});
