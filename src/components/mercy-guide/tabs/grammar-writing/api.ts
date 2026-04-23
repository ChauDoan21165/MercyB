/**
 * Path: src/components/mercy-guide/tabs/grammar-writing/api.ts
 * File: api.ts
 */

import type { GrammarApiResponse } from '../../types';
import { supabase } from '@/lib/supabaseClient';

export const GRAMMAR_API_ENDPOINT = '/api/mercy/grammar';
const GRAMMAR_API_TIMEOUT_MS = 20000;
const MAX_CONTEXT_LENGTH = 4000;
const MAX_ERROR_PREVIEW_LENGTH = 240;

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

type GrammarApiErrorPayload = {
  error?: string;
  message?: string;
};

function cleanText(value?: string | null): string {
  return typeof value === 'string' ? value.replace(/\s+/g, ' ').trim() : '';
}

function truncateText(value: string, maxLength: number): string {
  if (value.length <= maxLength) return value;
  return `${value.slice(0, Math.max(0, maxLength - 1)).trimEnd()}…`;
}

function buildContext(payload: AnalyzeGrammarPayload): string {
  const contextParts = [
    cleanText(payload.contentEn),
    cleanText(payload.originalText),
    cleanText(payload.focus),
    cleanText(payload.taskType),
    cleanText(payload.englishLevel ?? undefined),
  ].filter(Boolean);

  return truncateText(contextParts.join(' | '), MAX_CONTEXT_LENGTH);
}

function buildRoutePayload(
  payload: AnalyzeGrammarPayload,
  userId: string | null,
) {
  const text = cleanText(payload.text);
  const title = cleanText(payload.roomTitle);

  return {
    text,
    roomId: cleanText(payload.roomId),
    title,
    context: buildContext(payload),
    originalText: cleanText(payload.originalText),
    focus: cleanText(payload.focus),
    taskType: cleanText(payload.taskType),
    englishLevel: cleanText(payload.englishLevel ?? undefined),
    isTeacherInitiated: Boolean(payload.isTeacherInitiated),
    isRevisionAttempt: Boolean(payload.isRevisionAttempt),
    // userId is forwarded so the server can check the per-user
    // feedbackL1DetectorEnabled flag. When unset (anonymous session),
    // the detector stays OFF regardless of the global flag state.
    userId: userId ?? undefined,
  };
}

async function getCurrentUserId(): Promise<string | null> {
  try {
    const { data } = await supabase.auth.getUser();
    return data.user?.id ?? null;
  } catch {
    return null;
  }
}

function getTimeoutErrorMessage(): string {
  return 'Grammar help took too long to respond. Please try again.';
}

function getNetworkErrorMessage(): string {
  return 'Grammar help could not be reached. Please check the connection and try again.';
}

function extractErrorMessage(raw: string): string {
  if (!raw) return '';

  try {
    const parsed = JSON.parse(raw) as GrammarApiErrorPayload | null;
    return cleanText(parsed?.error || parsed?.message || raw);
  } catch {
    return cleanText(raw);
  }
}

function buildHttpErrorMessage(status: number, raw: string): string {
  const details = truncateText(extractErrorMessage(raw), MAX_ERROR_PREVIEW_LENGTH);

  switch (status) {
    case 400:
      return details || 'Grammar request was invalid.';
    case 401:
    case 403:
      return 'You do not have access to grammar help right now.';
    case 404:
      return 'Grammar endpoint was not found.';
    case 408:
      return getTimeoutErrorMessage();
    case 413:
      return 'The grammar request was too large. Please shorten the text and try again.';
    case 429:
      return 'Grammar help is busy right now. Please wait a moment and try again.';
    case 500:
    case 502:
    case 503:
    case 504:
      return details || 'Grammar help is temporarily unavailable. Please try again.';
    default:
      return details || `Grammar API failed with status ${status}.`;
  }
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function normalizeGrammarApiResponse(value: unknown): GrammarApiResponse {
  if (!isObject(value)) {
    throw new Error('Grammar help returned an invalid response.');
  }

  return value as GrammarApiResponse;
}

export async function analyzeGrammarWithApi(
  payload: AnalyzeGrammarPayload,
): Promise<GrammarApiResponse> {
  const userId = await getCurrentUserId();
  const requestBody = buildRoutePayload(payload, userId);

  if (!requestBody.text) {
    throw new Error('Grammar API was not called because text is empty.');
  }

  if (typeof fetch !== 'function') {
    throw new Error('Grammar API is unavailable in this environment.');
  }

  const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
  const timeoutId = controller
    ? window.setTimeout(() => controller.abort(), GRAMMAR_API_TIMEOUT_MS)
    : null;

  try {
    const response = await fetch(GRAMMAR_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      cache: 'no-store',
      credentials: 'same-origin',
      body: JSON.stringify(requestBody),
      signal: controller?.signal,
    });

    const raw = await response.text();

    if (!response.ok) {
      throw new Error(buildHttpErrorMessage(response.status, raw));
    }

    if (!raw) {
      throw new Error('Grammar help returned an empty response.');
    }

    let parsed: unknown;

    try {
      parsed = JSON.parse(raw) as unknown;
    } catch {
      throw new Error('Grammar help returned invalid JSON.');
    }

    return normalizeGrammarApiResponse(parsed);
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error(getTimeoutErrorMessage());
      }

      if (error.message) {
        throw error;
      }
    }

    throw new Error(getNetworkErrorMessage());
  } finally {
    if (timeoutId !== null) {
      window.clearTimeout(timeoutId);
    }
  }
}