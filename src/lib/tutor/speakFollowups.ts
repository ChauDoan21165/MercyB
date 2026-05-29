export type SpeakFollowUpPattern = {
  id: string;
  test: RegExp;
  questions: readonly string[];
};

export const SPEAK_FOLLOW_UP_PATTERNS: readonly SpeakFollowUpPattern[] = [
  {
    id: "bought-hat-yesterday",
    test: /\bi bought\b.*\bhat\b.*\byesterday\b/i,
    questions: ["Where did you buy it?", "What kind of hat was it?"],
  },
  {
    id: "dinner-family",
    test: /\bi (?:had|ate)\b.*\bdinner\b.*\bfamily\b/i,
    questions: ["What did you eat?", "Who cooked dinner?"],
  },
  {
    id: "evening-home-dinner",
    test: /\bevening\b.*\b(?:go|went|come|came) home\b.*\bdinner\b/i,
    questions: ["What do you usually eat for dinner?", "Who do you eat dinner with?"],
  },
  {
    id: "go-to-work",
    test: /\b(?:go|went) to work\b|\barrive(?:d)? at work\b/i,
    questions: ["What do you usually do when you arrive?", "What is your first task at work?"],
  },
  {
    id: "office-tasks",
    test: /\boffice\b|\btasks?\b|\bboss\b|\bcolleagues?\b/i,
    questions: ["What is your first task there?", "Who do you usually talk to at the office?"],
  },
  {
    id: "lunch-colleagues",
    test: /\blunch\b.*\bcolleagues?\b|\bcolleagues?\b.*\blunch\b/i,
    questions: ["What do you usually eat for lunch?", "Where do you eat with your colleagues?"],
  },
  {
    id: "coffee-email",
    test: /\bcoffee\b.*\bemail\b|\bemail\b.*\bcoffee\b/i,
    questions: ["What do you usually check first?", "Do you drink coffee before work?"],
  },
  {
    id: "market-food",
    test: /\b(?:market|store|shop)\b.*\b(?:food|buy|bought)\b|\b(?:buy|bought)\b.*\bfood\b/i,
    questions: ["What did you buy?", "Who did you buy food for?"],
  },
];

export function selectSpeakFollowUp(sentence: string): string {
  const normalized = sentence.replace(/\s+/g, " ").trim();
  const pattern = SPEAK_FOLLOW_UP_PATTERNS.find((candidate) => candidate.test.test(normalized));
  return pattern?.questions[0] ?? "Can you tell me one more detail about that?";
}

export function calculateSentenceMatchPercent(spoken: string, target: string): number {
  const spokenWords = normalizeWords(spoken);
  const targetWords = normalizeWords(target);
  if (!spokenWords.length || !targetWords.length) return 0;

  const targetCounts = new Map<string, number>();
  for (const word of targetWords) {
    targetCounts.set(word, (targetCounts.get(word) ?? 0) + 1);
  }

  let matched = 0;
  for (const word of spokenWords) {
    const count = targetCounts.get(word) ?? 0;
    if (count > 0) {
      matched += 1;
      targetCounts.set(word, count - 1);
    }
  }

  const precision = matched / spokenWords.length;
  const recall = matched / targetWords.length;
  if (precision + recall === 0) return 0;
  return Math.round((2 * precision * recall / (precision + recall)) * 100);
}

function normalizeWords(value: string): string[] {
  return value
    .toLowerCase()
    .replace(/[^\p{L}\p{N}' ]/gu, " ")
    .split(/\s+/)
    .filter(Boolean);
}
