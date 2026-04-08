/**
 * File: api.ts
 * Path: src/components/mercy-guide/tabs/grammar-writing/api.ts
 */

import type { GrammarApiResponse } from '../../types';

export const GRAMMAR_API_ENDPOINT = '/api/mercy/grammar';

export type AnalyzeGrammarPayload = {
  text: string;
  roomId?: string;
  roomTitle?: string;
  englishLevel?: string | null;
  contentEn?: string;
  originalText?: string;
  focus?: string;
  taskType?: string;
  isTeacherInitiated?: boolean;
  isRevisionAttempt?: boolean;
};

export async function analyzeGrammarWithApi(
  payload: AnalyzeGrammarPayload,
): Promise<GrammarApiResponse> {
  const response = await fetch(GRAMMAR_API_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const raw = await response.text();

  if (!response.ok) {
    throw new Error(
      `Grammar API failed with status ${response.status}${raw ? `: ${raw}` : ''}\n\nAPI endpoint tried: ${GRAMMAR_API_ENDPOINT}`,
    );
  }

  return JSON.parse(raw) as GrammarApiResponse;
}