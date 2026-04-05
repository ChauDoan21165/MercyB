/**
 * Path: src/components/mercy-guide/logic/routeMercyMessage.ts
 */

import {
  detectMercyIntent,
  isPronunciationRepairMessage,
  type MercyIntent,
} from "./detectMercyIntent";
import { MERCY_COPY } from "../copy/mercyCopy";
import type { MercyApiMode } from "../api/askMercyApi";
import {
  getGuidePronunciationPolicyReply,
  getGuidePronunciationRepairReply,
  getToddlerPolicyReply,
  isToddlerPolicyQuestion,
} from "./mercyPolicy";

export interface MercyRouteReply {
  en: string;
  vi: string;
}

export interface MercyRouteResult {
  intent: MercyIntent;
  reply?: MercyRouteReply;
  action?: "open_speak" | "open_english";
  apiMode?: MercyApiMode;
}

export type PronunciationReplyKind = "intro" | "followup";

type MercyCopyWithOptionalUiAcks = typeof MERCY_COPY & {
  openSpeakAck?: unknown;
  openEnglishAck?: unknown;
  genericUiAck?: unknown;
};

function inferUiAction(
  input: string
): "open_speak" | "open_english" | undefined {
  const text = input.trim().toLowerCase();

  if (
    /\bopen speak\b/.test(text) ||
    /\bshow me the speak tab\b/.test(text) ||
    /\bgo to speak\b/.test(text)
  ) {
    return "open_speak";
  }

  if (
    /\bopen english\b/.test(text) ||
    /\bshow me the english tab\b/.test(text) ||
    /\bgo to english\b/.test(text)
  ) {
    return "open_english";
  }

  return undefined;
}

function getSafeCopyReply(
  value: unknown,
  fallback: MercyRouteReply
): MercyRouteReply {
  if (
    value &&
    typeof value === "object" &&
    typeof (value as { en?: unknown }).en === "string" &&
    typeof (value as { vi?: unknown }).vi === "string"
  ) {
    return value as MercyRouteReply;
  }

  return fallback;
}

function getPronunciationGuideHandoffReply(
  input: string,
  kind: PronunciationReplyKind
): MercyRouteReply {
  if (isPronunciationRepairMessage(input)) {
    return getGuidePronunciationRepairReply();
  }

  if (kind === "followup") {
    return getGuidePronunciationPolicyReply();
  }

  return getGuidePronunciationPolicyReply();
}

export function getPronunciationHelpReply(
  input: string,
  kind: PronunciationReplyKind = "intro"
): MercyRouteReply {
  return getPronunciationGuideHandoffReply(input, kind);
}

export function routeMercyMessage(input: string): MercyRouteResult {
  if (isToddlerPolicyQuestion(input)) {
    return {
      intent: "fallback_api",
      reply: getToddlerPolicyReply(),
    };
  }

  const intent = detectMercyIntent(input);
  const mercyCopy = MERCY_COPY as MercyCopyWithOptionalUiAcks;

  switch (intent) {
    case "speak_help":
      return {
        intent,
        reply: getPronunciationHelpReply(input, "intro"),
      };

    case "english_explain":
      return {
        intent,
        apiMode: "english_explain",
      };

    case "emotional_support":
      return {
        intent,
        apiMode: "emotional_support",
      };

    case "learning_path":
      return {
        intent,
        apiMode: "learning_path",
      };

    case "ui_action": {
      const action = inferUiAction(input);

      if (action === "open_speak") {
        return {
          intent,
          reply: getSafeCopyReply(mercyCopy.openSpeakAck, {
            en: "I’m opening the Speak tab for you.",
            vi: "Mình đang mở tab Speak cho bạn nhé.",
          }),
          action,
        };
      }

      if (action === "open_english") {
        return {
          intent,
          reply: getSafeCopyReply(mercyCopy.openEnglishAck, {
            en: "I’m opening the English tab for you.",
            vi: "Mình đang mở tab English cho bạn nhé.",
          }),
          action,
        };
      }

      return {
        intent,
        reply: getSafeCopyReply(mercyCopy.genericUiAck, {
          en: "I can help you use the guide. Tell me what you want to open.",
          vi: "Mình có thể giúp bạn dùng guide. Hãy nói bạn muốn mở gì nhé.",
        }),
      };
    }

    case "fallback_api":
    default:
      return {
        intent: "fallback_api",
        apiMode: "general_guide",
      };
  }
}