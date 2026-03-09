export function normalizeText(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKC")
    .replace(/[^\p{L}\p{N}\s']/gu, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function tokenize(input: string): string[] {
  const s = normalizeText(input);
  return s ? s.split(" ") : [];
}

export function compareTargetToTranscript(targetText: string, transcript: string) {
  const normalizedTarget = normalizeText(targetText);
  const normalizedTranscript = normalizeText(transcript);

  const targetTokens = tokenize(targetText);
  const heardTokens = tokenize(transcript);

  const heardCounts = new Map<string, number>();
  for (const token of heardTokens) {
    heardCounts.set(token, (heardCounts.get(token) ?? 0) + 1);
  }

  const matched: string[] = [];
  const missingWords: string[] = [];

  for (const token of targetTokens) {
    const count = heardCounts.get(token) ?? 0;
    if (count > 0) {
      matched.push(token);
      heardCounts.set(token, count - 1);
    } else {
      missingWords.push(token);
    }
  }

  const extraWords: string[] = [];
  for (const [token, count] of heardCounts.entries()) {
    for (let i = 0; i < count; i += 1) {
      extraWords.push(token);
    }
  }

  const matchScore =
    targetTokens.length === 0 ? 0 : matched.length / targetTokens.length;

  return {
    normalizedTarget,
    normalizedTranscript,
    matchScore: Number(matchScore.toFixed(4)),
    missingWords,
    extraWords,
  };
}

export function buildGentleFeedback(args: {
  score: number;
  missingWords: string[];
  extraWords: string[];
}): string {
  const { score, missingWords, extraWords } = args;

  if (score >= 0.9) {
    return "Beautiful. You were very close.";
  }

  if (score >= 0.75) {
    if (missingWords.length > 0) {
      return `Good attempt. Try once more slowly and include “${missingWords
        .slice(0, 2)
        .join(" ")}”.`;
    }
    return "Good attempt. Try once more slowly and clearly.";
  }

  if (score >= 0.55) {
    if (missingWords.length > 0) {
      return `You’re getting there. Read the sentence once, then try again with “${missingWords
        .slice(0, 2)
        .join(" ")}”.`;
    }
    return "You’re getting there. Read the sentence once, then try again.";
  }

  if (extraWords.length > 0) {
    return "Take a calm breath and try one short part at a time.";
  }

  return "Take a calm breath and try again slowly, one part at a time.";
}