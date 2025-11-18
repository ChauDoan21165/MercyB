import wordColorRules from "@/data/word-color-rule.json";

interface ColoredWord {
  word: string;
  color: string;
  category: string;
}

function findWordInCategories(word: string, isVietnamese: boolean = false): ColoredWord | null {
  const lowerWord = word.toLowerCase();
  
  // Check all categories for this word
  for (const categoryData of wordColorRules.categories as any[]) {
    // Collect words based on language
    const allWords = isVietnamese ? [
      ...(categoryData.adjectives_vi || []),
      ...(categoryData.adverbs_vi || []),
      ...(categoryData.verbs_light_vi || []),
      ...(categoryData.verbs_medium_vi || []),
      ...(categoryData.verbs_strong_vi || [])
    ] : [
      ...(categoryData.adjectives || []),
      ...(categoryData.adverbs || []),
      ...(categoryData.verbs_light || []),
      ...(categoryData.verbs_medium || []),
      ...(categoryData.verbs_strong || [])
    ];
    
    // For Vietnamese, also include individual words from multi-word phrases
    const expandedWords = isVietnamese 
      ? allWords.flatMap(w => {
          const parts = w.split(/\s+/);
          return parts.length > 1 ? [w, ...parts] : [w];
        })
      : allWords;
    
    const lowerWords = expandedWords.map((w: string) => w.toLowerCase());
    
    if (lowerWords.includes(lowerWord)) {
      return { 
        word, 
        color: categoryData.hex, 
        category: categoryData.id 
      };
    }
  }
  
  return null;
}

export function highlightTextByRules(text: string, isVietnamese: boolean = false): JSX.Element[] {
  // Split by common punctuation while preserving the punctuation
  const segments = text.split(/(\s+|[.,;:!?()""—–-])/);
  const result: JSX.Element[] = [];

  // Limit how many words are colored based on config (7–11 per 150 words)
  const wordsOnly = segments.filter((seg) => seg && seg.trim() !== "" && !/(\s+|[.,;:!?()""—–-])/.test(seg));
  const totalWords = wordsOnly.length || 1;
  const maxPer150 = (wordColorRules as any).rules?.max_colored_per_150_words ?? 11;
  const maxColored = Math.ceil((totalWords / 150) * maxPer150);
  let coloredCount = 0;
  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];

    if (!segment || segment.trim() === '') {
      result.push(<span key={i}>{segment}</span>);
      continue;
    }
    
    const cleanWord = segment.trim().toLowerCase();
    
    // Check the word with language context
    const coloredWord = findWordInCategories(cleanWord, isVietnamese);
    
    if (coloredWord && coloredCount < maxColored) {
      coloredCount++;
      result.push(
        <span 
          key={i}
          style={{ 
            color: coloredWord.color,
            fontWeight: 600,
          }}
        >
          {segment}
        </span>
      );
    } else {
      result.push(<span key={i}>{segment}</span>);
    }
  }
  
  return result;
}

export function highlightPairedText(enText: string, viText: string): {
  enHighlighted: JSX.Element[];
  viHighlighted: JSX.Element[];
} {
  return {
    enHighlighted: highlightTextByRules(enText, false),
    viHighlighted: highlightTextByRules(viText, true)
  };
}
