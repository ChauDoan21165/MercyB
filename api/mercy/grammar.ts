/**
 * File: grammar.ts
 * Path: api/mercy/grammar.ts
 */

type BilingualLike = {
  vi?: unknown;
  en?: unknown;
};

type GrammarRequestBody = {
  text?: unknown;
  input?: unknown;
  content?: unknown;
  sentence?: unknown;
  selectedText?: unknown;
  context?: unknown;
  title?: unknown;
  mode?: unknown;
  locale?: unknown;
  roomId?: unknown;
  [key: string]: unknown;
};

function json(data: unknown, init: ResponseInit = {}): Response {
  const headers = new Headers(init.headers);
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json; charset=utf-8');
  }

  return new Response(JSON.stringify(data), {
    ...init,
    headers,
  });
}

function asText(value: unknown): string {
  if (typeof value === 'string') return value.trim();
  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value).trim();
  }

  if (Array.isArray(value)) {
    return value.map(asText).filter(Boolean).join(' ').trim();
  }

  if (value && typeof value === 'object') {
    const bilingual = value as BilingualLike;

    const en = asText(bilingual.en);
    if (en) return en;

    const vi = asText(bilingual.vi);
    if (vi) return vi;
  }

  return '';
}

function getPrimaryText(body: GrammarRequestBody): string {
  return (
    asText(body.text) ||
    asText(body.input) ||
    asText(body.content) ||
    asText(body.sentence) ||
    asText(body.selectedText) ||
    ''
  );
}

function splitSentences(text: string): string[] {
  return text
    .split(/(?<=[.!?])\s+/)
    .map((part) => part.trim())
    .filter(Boolean);
}

function buildFallbackGrammarResult(text: string) {
  const normalized = text.replace(/\s+/g, ' ').trim();

  return {
    ok: true,
    source: 'fallback-local',
    originalText: normalized,
    correctedText: normalized,
    summary: 'Grammar analysis completed.',
    issues: [],
    suggestions: [],
    sentences: splitSentences(normalized).map((sentence) => ({
      original: sentence,
      corrected: sentence,
      notes: [],
    })),
  };
}

async function runOpenAIGrammarAnalysis(text: string, context: string) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return buildFallbackGrammarResult(text);
  }

  const prompt = [
    'You are a precise English grammar assistant.',
    'Return JSON only.',
    'Required JSON shape:',
    '{',
    '  "correctedText": string,',
    '  "summary": string,',
    '  "issues": Array<{ "type": string, "message": string, "original"?: string, "suggestion"?: string }>,',
    '  "suggestions": string[],',
    '  "sentences": Array<{ "original": string, "corrected": string, "notes": string[] }>',
    '}',
    '',
    context ? `Context: ${context}` : '',
    `Text: ${text}`,
  ]
    .filter(Boolean)
    .join('\n');

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: process.env.OPENAI_GRAMMAR_MODEL || 'gpt-4.1-mini',
      temperature: 0.2,
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content:
            'You are an English grammar correction service. Respond with valid JSON only.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => '');
    throw new Error(
      `OpenAI grammar request failed: ${response.status} ${errorText}`,
    );
  }

  const result = await response.json();
  const content = result?.choices?.[0]?.message?.content;

  if (typeof content !== 'string' || !content.trim()) {
    throw new Error('OpenAI grammar response was empty.');
  }

  let parsed: any;
  try {
    parsed = JSON.parse(content);
  } catch {
    throw new Error('OpenAI grammar response was not valid JSON.');
  }

  return {
    ok: true,
    source: 'openai',
    originalText: text,
    correctedText: asText(parsed?.correctedText) || text,
    summary: asText(parsed?.summary) || 'Grammar analysis completed.',
    issues: Array.isArray(parsed?.issues) ? parsed.issues : [],
    suggestions: Array.isArray(parsed?.suggestions) ? parsed.suggestions : [],
    sentences: Array.isArray(parsed?.sentences) ? parsed.sentences : [],
  };
}

export default async function handler(request: Request): Promise<Response> {
  if (request.method === 'GET') {
    return json(
      {
        ok: true,
        endpoint: '/api/mercy/grammar',
        method: 'POST',
      },
      { status: 200 },
    );
  }

  if (request.method !== 'POST') {
    return json(
      {
        ok: false,
        error: `Method ${request.method} Not Allowed.`,
      },
      {
        status: 405,
        headers: {
          Allow: 'GET, POST',
        },
      },
    );
  }

  try {
    let body: GrammarRequestBody;

    try {
      body = (await request.json()) as GrammarRequestBody;
    } catch {
      return json(
        { ok: false, error: 'Invalid JSON body.' },
        { status: 400 },
      );
    }

    const text = getPrimaryText(body);
    const context = asText(body.context);
    const title = asText(body.title);
    const mergedContext = [title, context].filter(Boolean).join(' — ');

    if (!text) {
      return json(
        { ok: false, error: 'Missing grammar text input.' },
        { status: 400 },
      );
    }

    const result = await runOpenAIGrammarAnalysis(text, mergedContext);
    return json(result, { status: 200 });
  } catch (error) {
    console.error('[api/mercy/grammar] request failed', error);

    return json(
      { ok: false, error: 'Grammar analysis failed.' },
      { status: 500 },
    );
  }
}