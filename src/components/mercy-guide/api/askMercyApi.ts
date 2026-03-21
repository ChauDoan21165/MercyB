/**
 * Path: src/components/mercy-guide/api/askMercyApi.ts
 */

import { supabase } from '@/lib/supabaseClient';
import type { GuideAssistantResponse } from '../shared';

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
          tier: tier || 'Free',
          pathSlug,
          tags: tags || [],
          englishLevel,
          learningGoal,
          mercyIntentMode: mode,
        },
      },
    }
  );

  return {
    data,
    error: error ?? null,
  };
}