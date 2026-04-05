// src/components/mercy-guide/tabs/grammar-writing/api.ts

import type { AnalyzeGrammarInput, GrammarApiResponse } from './types';

export const GRAMMAR_API_ENDPOINT =
  import.meta.env.VITE_MERCY_API_URL || '/api/mercy/grammar';

export const SHOW_DEBUG =
  import.meta.env.DEV || import.meta.env.VITE_SHOW_MERCY_DEBUG === 'true';

export async function analyzeGrammarWithApi(
  input: AnalyzeGrammarInput,
): Promise<GrammarApiResponse> {
  const response = await fetch(GRAMMAR_API_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error(`Grammar API failed with status ${response.status}`);
  }

  const data = (await response.json()) as GrammarApiResponse;

  if (!data || typeof data.correctedText !== 'string' || !data.correctedText.trim()) {
    throw new Error('Grammar API returned no corrected text.');
  }

  return {
    ...data,
    source: 'api',
  };
}