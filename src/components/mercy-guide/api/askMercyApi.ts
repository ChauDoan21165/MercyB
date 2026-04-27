/**
 * Path: src/components/mercy-guide/api/askMercyApi.ts
 */

import { supabase } from '@/lib/supabaseClient';
import type { GuideAssistantResponse } from '../shared';
import type { ProgressContext } from '@/lib/mercy/progressContext';

export type MercyApiMode =
  | 'general_guide'
  | 'emotional_support'
  | 'learning_path'
  | 'english_explain';

export interface MercyApiRequest {
  input: string;
  mode: MercyApiMode;
  roomId?: string;
  roomTitle?: string;
  tier?: string;
  pathSlug?: string;
  tags?: string[];
  englishLevel?: string | null;
  learningGoal?: string | null;
  /**
   * Optional progress snapshot to inject into Mercy's system prompt.
   * Sent only when the chat layer's progressTriggers logic decides
   * the moment is right (frustration, self-check, practice ask, low
   * recent score) AND the cooldown allows. Edge function unconditionally
   * appends it as STUDENT_PROGRESS:… when present.
   */
  progressContext?: ProgressContext | null;
}

export type MercyApiResponse = {
  data: GuideAssistantResponse | null;
  error: Error | null;
};

export async function askMercyApi({
  input,
  mode,
  roomId,
  roomTitle,
  tier,
  pathSlug,
  tags,
  englishLevel,
  learningGoal,
  progressContext,
}: MercyApiRequest): Promise<MercyApiResponse> {
  const { data, error } = await supabase.functions.invoke<GuideAssistantResponse>(
    'guide-assistant',
    {
      body: {
        question: input,
        roomId,
        roomTitle,
        language: 'en_vi',
        responseMode: 'bilingual_en_vi',
        mode,
        context: {
          tier: tier || 'Level 0',
          pathSlug,
          tags: tags || [],
          englishLevel,
          learningGoal,
          mercyIntentMode: mode,
        },
        // Edge fn reads `body.progressContext` and appends a
        // STUDENT_PROGRESS: block to its system prompt when present.
        // Always send the field — null is informative ("no signal yet")
        // so the edge fn doesn't have to disambiguate "absent" vs
        // "explicitly null" branches.
        progressContext: progressContext ?? null,
      },
    }
  );

  return {
    data,
    error: error ?? null,
  };
}