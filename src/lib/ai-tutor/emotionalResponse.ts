import type { TutorResponse } from "./types";
import {
  classifyResponseStance,
  type ResponseStanceDecision,
} from "@/lib/tutor/emotionalResponseBoundary";
import {
  buildTurnWarmth,
  type WarmthRegister,
} from "@/lib/tutor/conversationWarmth";

export type EmotionalTutorResponseResult = {
  response: TutorResponse;
  stance: ResponseStanceDecision;
};

export type EmotionalTutorResponseInput = {
  learnerText: string;
  response: TutorResponse;
  turnIndex?: number;
};

const CLARIFY_VI =
  "Mình chưa rõ phần nào đang làm bạn rối. Bạn muốn mình giải thích lại bằng ví dụ đơn giản, hay bạn muốn gửi một câu cụ thể để mình sửa?";

const CLARIFY_EN =
  "I'm not sure which part is confusing yet. Do you want a simpler example, or do you want to send one sentence for me to fix?";

const PAUSE_VI =
  "Mình dừng phần sửa lỗi một chút nhé. Nghe chuyện này khá nặng lòng, nên mình sẽ không vội chỉnh tiếng Anh ngay. Khi bạn sẵn sàng, bạn có thể viết một câu rất ngắn về điều bạn muốn nói tiếp.";

const PAUSE_EN =
  "Let's pause correction for a moment. That sounds heavy, so I won't rush into fixing English right away.";

function withPreface(response: TutorResponse, viPreface: string, enPreface?: string): TutorResponse {
  return {
    ...response,
    vi: [viPreface, response.vi].filter(Boolean).join("\n"),
    en: [enPreface, response.en].filter(Boolean).join("\n") || undefined,
  };
}

function clarificationResponse(): TutorResponse {
  return {
    vi: CLARIFY_VI,
    en: CLARIFY_EN,
    nextSteps: [
      {
        labelVi: "Gửi một câu",
        action: "write",
        payload: "",
      },
    ],
    saveTargets: [],
  };
}

function pauseResponse(): TutorResponse {
  return {
    vi: PAUSE_VI,
    en: PAUSE_EN,
    nextSteps: [
      {
        labelVi: "Viết một câu ngắn",
        action: "write",
        payload: "",
      },
    ],
    saveTargets: [],
  };
}

function registerForStance(stance: ResponseStanceDecision["stance"]): WarmthRegister {
  return stance === "needs_pause" ? "respectful" : "friendly";
}

/**
 * Applies the existing emotional-state classifiers to the live TutorResponse.
 * Neutral turns preserve the provider response object. Clarify/pause turns
 * intentionally stop correction before it reaches the chat transcript.
 */
export function applyEmotionalStateToTutorResponse(
  input: EmotionalTutorResponseInput,
): EmotionalTutorResponseResult {
  const stance = classifyResponseStance({ learnerText: input.learnerText });

  if (stance.stance === "neutral") {
    return { response: input.response, stance };
  }

  if (stance.stance === "needs_clarification") {
    return { response: clarificationResponse(), stance };
  }

  if (stance.stance === "needs_pause") {
    return { response: pauseResponse(), stance };
  }

  const warmth = buildTurnWarmth({
    outcome: "minor_slip",
    register: registerForStance(stance.stance),
    turnIndex: input.turnIndex,
  });

  return {
    response: withPreface(input.response, warmth.vi, warmth.en),
    stance,
  };
}
