export const GRAMMAR_API_ENDPOINT = 'http://localhost:3001/api/mercy/grammar';

type AnalyzeGrammarRequest = {
  text: string;
  roomId?: string;
  roomTitle?: string;
  englishLevel?: string | null;
  contentEn?: string;
};

export async function analyzeGrammarWithApi(
  payload: AnalyzeGrammarRequest,
) {
  const res = await fetch(GRAMMAR_API_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const text = await res.text();

  if (!res.ok) {
    throw new Error(`Grammar API failed ${res.status}: ${text}`);
  }

  return JSON.parse(text);
}