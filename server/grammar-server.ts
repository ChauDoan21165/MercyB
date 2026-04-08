/**
 * File: grammar-server.ts
 * Path: server/grammar-server.ts
 */

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import OpenAI from 'openai';
import mercyMemoryRoutes from './routes/mercyMemoryRoutes';

const app = express();

app.use(cors());
app.use(express.json());

app.use(mercyMemoryRoutes);
console.log('✅ mercyMemoryRoutes mounted');

type GrammarRequestBody = {
  text?: unknown;
  roomId?: unknown;
  roomTitle?: unknown;
  englishLevel?: unknown;
  contentEn?: unknown;
};

type GrammarResponsePayload = {
  ok: boolean;
  correctedText?: string;
  enhancedText?: string;
  explanation?: string;
  writingMode?: 'sentence' | 'paragraph' | 'essay';
  grammarPoints?: string[];
  issues?: Array<{
    original?: string;
    corrected?: string;
    reason?: string;
    category?: string;
    grammarPoint?: string;
  }>;
  tenseAnalysis?: {
    detected: string[];
    likelyMainTense: string | null;
    notes: string[];
  };
  source?: 'api' | 'fallback';
  error?: string;
};

function getOpenAIClient(): OpenAI | null {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return null;
  }

  return new OpenAI({ apiKey });
}

function asText(value: unknown): string {
  if (typeof value === 'string') return value.trim();
  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value).trim();
  }
  return '';
}

function getWritingMode(text: string): 'sentence' | 'paragraph' | 'essay' {
  const wordCount = text.split(/\s+/).filter(Boolean).length;

  if (wordCount <= 12) return 'sentence';
  if (wordCount <= 60) return 'paragraph';
  return 'essay';
}

app.get('/health', (_req, res) => {
  res.json({
    ok: true,
    service: 'mercy-grammar-server',
    hasOpenAIKey: Boolean(process.env.OPENAI_API_KEY),
  });
});

app.get('/api/mercy/grammar', (_req, res) => {
  res.json({
    ok: true,
    endpoint: '/api/mercy/grammar',
    message: 'Grammar server is running.',
    hasOpenAIKey: Boolean(process.env.OPENAI_API_KEY),
  });
});

app.post('/api/mercy/grammar', async (req, res) => {
  try {
    const body = (req.body ?? {}) as GrammarRequestBody;
    const text = asText(body.text);
    const roomTitle = asText(body.roomTitle);
    const englishLevel = asText(body.englishLevel);
    const contentEn = asText(body.contentEn);

    if (!text) {
      return res.status(400).json({
        ok: false,
        error: 'Missing grammar text input.',
      } satisfies GrammarResponsePayload);
    }

    const openai = getOpenAIClient();

    if (!openai) {
      return res.status(500).json({
        ok: false,
        error: 'Missing OPENAI_API_KEY in environment.',
      } satisfies GrammarResponsePayload);
    }

    const prompt = [
      'You are Mercy, a careful English grammar coach.',
      'Correct grammar, spelling, capitalization, punctuation, and natural phrasing.',
      'Keep the original meaning.',
      'Return JSON only with this shape:',
      '{',
      '  "correctedText": string,',
      '  "enhancedText": string,',
      '  "explanation": string,',
      '  "grammarPoints": string[],',
      '  "issues": Array<{',
      '    "original"?: string,',
      '    "corrected"?: string,',
      '    "reason"?: string,',
      '    "category"?: string,',
      '    "grammarPoint"?: string',
      '  }>,',
      '  "tenseAnalysis": {',
      '    "detected": string[],',
      '    "likelyMainTense": string | null,',
      '    "notes": string[]',
      '  }',
      '}',
      roomTitle ? `Room title: ${roomTitle}` : '',
      englishLevel ? `English level: ${englishLevel}` : '',
      contentEn ? `Context: ${contentEn}` : '',
      `Student text: ${text}`,
    ]
      .filter(Boolean)
      .join('\n');

    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_GRAMMAR_MODEL || 'gpt-4.1-mini',
      temperature: 0.2,
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content:
            'You are an English grammar correction assistant. Reply with valid JSON only.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const content = response.choices?.[0]?.message?.content ?? '';

    if (!content.trim()) {
      return res.status(500).json({
        ok: false,
        error: 'OpenAI returned an empty response.',
      } satisfies GrammarResponsePayload);
    }

    let parsed: {
      correctedText?: unknown;
      enhancedText?: unknown;
      explanation?: unknown;
      grammarPoints?: unknown;
      issues?: unknown;
      tenseAnalysis?: {
        detected?: unknown;
        likelyMainTense?: unknown;
        notes?: unknown;
      };
    };

    try {
      parsed = JSON.parse(content);
    } catch {
      return res.status(500).json({
        ok: false,
        error: 'OpenAI returned invalid JSON.',
      } satisfies GrammarResponsePayload);
    }

    const correctedText = asText(parsed.correctedText) || text;
    const enhancedText = asText(parsed.enhancedText) || correctedText;
    const explanation =
      asText(parsed.explanation) || 'Grammar feedback generated successfully.';

    const grammarPoints = Array.isArray(parsed.grammarPoints)
      ? parsed.grammarPoints.map(asText).filter(Boolean)
      : [];

    const issues = Array.isArray(parsed.issues)
      ? parsed.issues
          .filter(
            (item): item is Record<string, unknown> =>
              Boolean(item && typeof item === 'object'),
          )
          .map((item) => ({
            original: asText(item.original) || undefined,
            corrected: asText(item.corrected) || undefined,
            reason: asText(item.reason) || undefined,
            category: asText(item.category) || undefined,
            grammarPoint: asText(item.grammarPoint) || undefined,
          }))
      : [];

    const tenseAnalysis = {
      detected: Array.isArray(parsed.tenseAnalysis?.detected)
        ? parsed.tenseAnalysis.detected.map(asText).filter(Boolean)
        : [],
      likelyMainTense: asText(parsed.tenseAnalysis?.likelyMainTense) || null,
      notes: Array.isArray(parsed.tenseAnalysis?.notes)
        ? parsed.tenseAnalysis.notes.map(asText).filter(Boolean)
        : [],
    };

    return res.json({
      ok: true,
      correctedText,
      enhancedText,
      explanation,
      writingMode: getWritingMode(text),
      grammarPoints,
      issues,
      tenseAnalysis,
      source: 'api',
    } satisfies GrammarResponsePayload);
  } catch (error) {
    console.error('[grammar-server] POST /api/mercy/grammar failed', error);

    return res.status(500).json({
      ok: false,
      error: 'Grammar analysis failed.',
    } satisfies GrammarResponsePayload);
  }
});

app.listen(3001, '127.0.0.1', () => {
  console.log('Grammar API running at http://127.0.0.1:3001');
  console.log('Memory API running at http://127.0.0.1:3001/api/mercy/memory');
});