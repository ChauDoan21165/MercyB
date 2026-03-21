/**
 * Path: src/components/mercy-guide/logic/routeMercyMessage.ts
 */

import {
  detectMercyIntent,
  isPronunciationRepairMessage,
  type MercyIntent,
} from './detectMercyIntent';
import { MERCY_COPY } from '../copy/mercyCopy';
import type { MercyApiMode } from '../api/askMercyApi';
import {
  getGuidePronunciationPolicyReply,
  getGuidePronunciationRepairReply,
  getToddlerPolicyReply,
  isToddlerPolicyQuestion,
} from './mercyPolicy';

export interface MercyRouteResult {
  intent: MercyIntent;
  reply?: {
    en: string;
    vi: string;
  };
  action?: 'open_speak' | 'open_english';
  apiMode?: MercyApiMode;
}

export type PronunciationReplyKind = 'intro' | 'followup';

function inferUiAction(
  input: string
): 'open_speak' | 'open_english' | undefined {
  const text = input.trim().toLowerCase();

  if (
    /\bopen speak\b/.test(text) ||
    /\bshow me the speak tab\b/.test(text) ||
    /\bgo to speak\b/.test(text)
  ) {
    return 'open_speak';
  }

  if (
    /\bopen english\b/.test(text) ||
    /\bshow me the english tab\b/.test(text) ||
    /\bgo to english\b/.test(text)
  ) {
    return 'open_english';
  }

  return undefined;
}

function getPronunciationGuideHandoffReply(
  input: string,
  kind: PronunciationReplyKind
) {
  if (isPronunciationRepairMessage(input)) {
    return getGuidePronunciationRepairReply();
  }

  if (kind === 'followup') {
    return getGuidePronunciationPolicyReply();
  }

  return getGuidePronunciationPolicyReply();
}

export function getPronunciationHelpReply(
  input: string,
  kind: PronunciationReplyKind = 'intro'
) {
  return getPronunciationGuideHandoffReply(input, kind);
}

export function routeMercyMessage(input: string): MercyRouteResult {
  if (isToddlerPolicyQuestion(input)) {
    return {
      intent: 'fallback_api',
      reply: getToddlerPolicyReply(),
    };
  }

  const intent = detectMercyIntent(input);

  switch (intent) {
    case 'speak_help':
      return {
        intent,
        reply: getPronunciationHelpReply(input, 'intro'),
      };

    case 'english_explain':
      return {
        intent,
        apiMode: 'english_explain',
      };

    case 'emotional_support':
      return {
        intent,
        apiMode: 'emotional_support',
      };

    case 'learning_path':
      return {
        intent,
        apiMode: 'learning_path',
      };

    case 'ui_action': {
      const action = inferUiAction(input);

      if (action === 'open_speak') {
        return {
          intent,
          reply: MERCY_COPY.openSpeakAck,
          action,
        };
      }

      if (action === 'open_english') {
        return {
          intent,
          reply: MERCY_COPY.openEnglishAck,
          action,
        };
      }

      return {
        intent,
        reply: MERCY_COPY.genericUiAck,
      };
    }

    case 'fallback_api':
    default:
      return {
        intent: 'fallback_api',
        apiMode: 'general_guide',
      };
  }
}