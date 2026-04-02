export type GrammarApiResponse = {
  correctedText: string;
  enhancedText?: string;
  explanation?: string;
  issues?: Array<{
    original: string;
    corrected: string;
    reason: string;
  }>;
};

export async function analyzeGrammar(input: {
  text: string;
  roomId?: string;
  roomTitle?: string;
  englishLevel?: string | null;
  contentEn?: string;
}): Promise<GrammarApiResponse> {
  const response = await fetch('/api/english/analyze', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      mode: 'grammar_writing',
      text: input.text,
      roomId: input.roomId,
      roomTitle: input.roomTitle,
      englishLevel: input.englishLevel,
      contentEn: input.contentEn,
    }),
  });

  if (!response.ok) {
    const message = await response.text().catch(() => '');
    throw new Error(message || 'Grammar analysis failed.');
  }

  return response.json();
}