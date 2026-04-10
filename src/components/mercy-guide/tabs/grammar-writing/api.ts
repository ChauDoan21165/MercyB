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

function cleanText(value?: string | null): string {
  return typeof value === 'string' ? value.trim() : '';
}

function buildRoutePayload(payload: AnalyzeGrammarPayload) {
  const text = cleanText(payload.text);
  const title = cleanText(payload.roomTitle);

  const contextParts = [
    cleanText(payload.contentEn),
    cleanText(payload.originalText),
    cleanText(payload.focus),
    cleanText(payload.taskType),
    cleanText(payload.englishLevel ?? undefined),
  ].filter(Boolean);

  return {
    text,
    roomId: cleanText(payload.roomId),
    title,
    context: contextParts.join(' | '),
    originalText: cleanText(payload.originalText),
    focus: cleanText(payload.focus),
    taskType: cleanText(payload.taskType),
    englishLevel: cleanText(payload.englishLevel ?? undefined),
    isTeacherInitiated: Boolean(payload.isTeacherInitiated),
    isRevisionAttempt: Boolean(payload.isRevisionAttempt),
  };
}

export async function analyzeGrammarWithApi(
  payload: AnalyzeGrammarPayload,
): Promise<GrammarApiResponse> {
  const requestBody = buildRoutePayload(payload);

  if (!requestBody.text) {
    throw new Error('Grammar API was not called because text is empty.');
  }

  const response = await fetch(GRAMMAR_API_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    cache: 'no-store',
    credentials: 'same-origin',
    body: JSON.stringify(requestBody),
  });

  const raw = await response.text();

  if (!response.ok) {
    let details = raw;

    try {
      const parsed = raw ? (JSON.parse(raw) as { error?: string; message?: string }) : null;
      details = parsed?.error || parsed?.message || raw;
    } catch {
      // keep raw text as-is
    }

    throw new Error(
      `Grammar API failed with status ${response.status}${
        details ? `: ${details}` : ''
      }\n\nAPI endpoint tried: ${GRAMMAR_API_ENDPOINT}\nRequest method: POST`,
    );
  }

  try {
    return JSON.parse(raw) as GrammarApiResponse;
  } catch {
    throw new Error(
      `Grammar API returned invalid JSON.\n\nAPI endpoint tried: ${GRAMMAR_API_ENDPOINT}\nResponse body: ${raw}`,
    );
  }
}