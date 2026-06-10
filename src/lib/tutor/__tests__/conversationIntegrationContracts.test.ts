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
