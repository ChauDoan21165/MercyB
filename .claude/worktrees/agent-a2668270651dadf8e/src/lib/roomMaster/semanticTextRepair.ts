// Semantic Text Repair - Fix broken sentences, remove duplicates, modernize language

export function repairEntryCopy(copy: string): string {
  let repaired = copy;

  // 1. Remove weird artifacts
  repaired = repaired
    .replace(/\\\\/g, '') // Remove double backslashes
    .replace(/\n{3,}/g, '\n\n') // Max 2 newlines
    .replace(/\.{4,}/g, '…') // Multiple dots → ellipsis
    .replace(/\s{2,}/g, ' ') // Multiple spaces → single space
    .trim();

  // 2. Fix broken sentences (capitalize after period)
  repaired = repaired.replace(/\.\s+([a-z])/g, (match, letter) => {
    return `. ${letter.toUpperCase()}`;
  });

  // 3. Remove duplicate sentences
  repaired = removeDuplicateSentences(repaired);

  // 4. Modernize English vocabulary
  repaired = modernizeEnglish(repaired);

  return repaired;
}

function removeDuplicateSentences(text: string): string {
  const sentences = text.split(/\.\s+/).filter(s => s.trim().length > 0);
  const seen = new Set<string>();
  const unique: string[] = [];

  for (const sentence of sentences) {
    const normalized = sentence.trim().toLowerCase();
    
    // Check if this sentence is 80%+ similar to any seen sentence
    let isDuplicate = false;
    for (const seenSentence of seen) {
      const similarity = calculateSimilarity(normalized, seenSentence);
      if (similarity > 0.8) {
        isDuplicate = true;
        break;
      }
    }

    if (!isDuplicate) {
      seen.add(normalized);
      unique.push(sentence.trim());
    }
  }

  return unique.join('. ') + (unique.length > 0 ? '.' : '');
}

function calculateSimilarity(str1: string, str2: string): number {
  const words1 = str1.split(/\s+/);
  const words2 = str2.split(/\s+/);
  
  const set1 = new Set(words1);
  const set2 = new Set(words2);
  
  const intersection = new Set([...set1].filter(x => set2.has(x)));
  const union = new Set([...set1, ...set2]);
  
  return intersection.size / union.size;
}

function modernizeEnglish(text: string): string {
  const replacements: [RegExp, string][] = [
    [/\btherefore\b/gi, 'so'],
    [/\bmoreover\b/gi, 'also'],
    [/\bin order to\b/gi, 'to'],
    [/\bdue to the fact that\b/gi, 'because'],
    [/\bin the event that\b/gi, 'if'],
    [/\bprior to\b/gi, 'before'],
    [/\bsubsequent to\b/gi, 'after'],
    [/\bat this point in time\b/gi, 'now'],
    [/\bin the near future\b/gi, 'soon'],
    [/\bat the present time\b/gi, 'now'],
  ];

  let modernized = text;

  for (const [pattern, replacement] of replacements) {
    modernized = modernized.replace(pattern, replacement);
  }

  return modernized;
}